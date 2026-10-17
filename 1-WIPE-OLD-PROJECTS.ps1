# 1-WIPE-OLD-PROJECTS.ps1  (run it yourself, from a normal PowerShell window)
#   .\1-WIPE-OLD-PROJECTS.ps1            -> DRY RUN: lists what would be deleted and how big it is. Deletes nothing.
#   .\1-WIPE-OLD-PROJECTS.ps1 -Execute  -> checks the keep folder is complete, asks you to type WIPE, then deletes.
# Deletion is PERMANENT (not the Recycle Bin).
param([switch]$Execute)
$keep = if ($MyInvocation.MyCommand.Path) { Split-Path -Parent $MyInvocation.MyCommand.Path } elseif ($PSScriptRoot) { $PSScriptRoot } else { 'C:\Users\pc\Documents\All-in-keep' }

function FormatSize($p) {
  if (-not (Test-Path -LiteralPath $p)) { return '  (absent)' }
  $s = (Get-ChildItem -LiteralPath $p -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum
  '{0,7} GB' -f [math]::Round($s / 1GB, 2)
}
function Nuke($p) {
  # robocopy-mirror an empty folder over it first: survives paths longer than 260 chars (node_modules, venvs)
  $empty = Join-Path $env:TEMP ('empty_' + [guid]::NewGuid().ToString('N'))
  New-Item -ItemType Directory -Path $empty | Out-Null
  robocopy $empty $p /MIR /R:0 /W:0 /NFL /NDL /NJH /NJS /NP | Out-Null
  Remove-Item -LiteralPath $p -Recurse -Force -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath $empty -Force -ErrorAction SilentlyContinue
  if (Test-Path -LiteralPath $p) { Write-Host "   !! could not fully remove $p (a file may be in use)" -ForegroundColor Yellow } else { Write-Host "   removed $p" -ForegroundColor Green }
}

# ---- what goes -------------------------------------------------------------
$always = @(
  'C:\Users\pc\Documents\claude projects',          # All-in (original), SCRATCH HOLY, scratch  1, dashboard
  'C:\Users\pc\Documents\not-so-dark-times'
)
$optional = @(
  @{ Path = 'C:\Users\pc\Documents\antigravity\jolly-bell'; Why = 'old "source project" (14 GB). Source tree, full git bundle, finished films and Kokoro models are already in All-in-keep. NOTE: 3 opencode worktrees (under ~\.local\share\opencode\worktree) are linked to its .git; their uncommitted files were exported to _legacy\uncommitted.' },
  @{ Path = 'C:\Users\pc\.cache\huggingface';               Why = 'remaining Hugging Face models (~8 GB) used by OTHER tools (CLIP, Whisper large-v3, F5-TTS ...). All-in no longer needs them.' }
)

# ---- preflight: is the keep folder complete? ---------------------------------
$checks = [ordered]@{
  'repo .git'            = Test-Path "$keep\All-in\.git"
  'repo engine'          = Test-Path "$keep\All-in\engine\package.json"
  'voice venv python'    = Test-Path "$keep\voice\.venv-tts\Scripts\python.exe"
  'kokoro model'         = Test-Path "$keep\voice\kokoro-models\kokoro-official.onnx"
  'whisper turbo cache'  = Test-Path "$keep\voice\hf-cache\hub\models--mobiuslabsgmbh--faster-whisper-large-v3-turbo"
  'chatterbox cache'     = Test-Path "$keep\voice\hf-cache\hub\models--ResembleAI--chatterbox"
  'deliverables'         = Test-Path "$keep\deliverables"
  'legacy bundles (4)'   = ((Get-ChildItem "$keep\_legacy\bundles" -Filter *.bundle -ErrorAction SilentlyContinue | Measure-Object).Count -ge 4)
  'jolly-bell source'     = Test-Path "$keep\_legacy\jolly-bell-source"
  'legacy films'         = ((Get-ChildItem "$keep\_legacy\films" -Recurse -Filter *.mp4 -ErrorAction SilentlyContinue | Measure-Object).Count -ge 15)
  'uncommitted exports'  = Test-Path "$keep\_legacy\uncommitted"
}
Write-Host "`n== Keep folder check: $keep" -ForegroundColor Cyan
$ok = $true
foreach ($k in $checks.Keys) { $v = $checks[$k]; if (-not $v) { $ok = $false }; Write-Host ("  [{0}] {1}" -f $(if ($v) {'OK'} else {'MISSING'}), $k) }

# ---- git preflight: check repository status ---------------------------------
$repoPath = Join-Path $keep "All-in"
$gitChanges = $null
if (Test-Path (Join-Path $repoPath ".git")) {
  $gitChanges = & git -C $repoPath status --porcelain 2>&1
  if ($gitChanges) {
    $changeCount = ($gitChanges | Measure-Object).Count
    Write-Host "`n== Git Preflight: $changeCount uncommitted/untracked item(s) in $repoPath" -ForegroundColor Yellow
    $gitChanges | Select-Object -First 8 | ForEach-Object { Write-Host "   $_" -ForegroundColor DarkYellow }
    if ($changeCount -gt 8) { Write-Host "   ... and $($changeCount - 8) more" -ForegroundColor DarkYellow }
  } else {
    Write-Host "`n== Git Preflight: Repository is clean" -ForegroundColor Green
  }
}

Write-Host "`n== Will be deleted" -ForegroundColor Cyan
foreach ($p in $always) { Write-Host ("  {0,10}  {1}" -f (FormatSize $p), $p) }
Write-Host "`n== Optional (asked one by one, default = keep)" -ForegroundColor Cyan
foreach ($o in $optional) { Write-Host ("  {0,10}  {1}`n             {2}" -f (FormatSize $o.Path), $o.Path, $o.Why) }

if (-not $Execute) { Write-Host "`nDRY RUN only. Nothing deleted. Re-run with -Execute when you are ready." -ForegroundColor Yellow; return }
if (-not $ok) { Write-Host "`nSTOP: the keep folder is incomplete. Nothing deleted." -ForegroundColor Red; return }
if ($gitChanges) {
  Write-Host "`nCAUTION: The active repository in All-in has uncommitted/untracked changes." -ForegroundColor Yellow
  $confirmGit = Read-Host "Proceed with wipe despite uncommitted repository changes? (y/N)"
  if ($confirmGit -ne 'y') { Write-Host 'Cancelled. Commit or stash your work before wiping.'; return }
}
if (Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -match '^claude' -or $_.Path -like '*\claude-code\*' -or $_.Path -like '*Claude_pzs8sxrjxfjjc*' }) {
  Write-Host "`nSTOP: a Claude Code process is running. Close sessions first." -ForegroundColor Red; return
}
$ans = Read-Host "`nType WIPE (capitals) to permanently delete the folders listed above"
if ($ans -cne 'WIPE') { Write-Host 'Cancelled. Nothing deleted.'; return }

foreach ($p in $always) { if (Test-Path -LiteralPath $p) { Write-Host "Deleting $p ..."; Nuke $p } }
foreach ($o in $optional) {
  if (Test-Path -LiteralPath $o.Path) {
    $a = Read-Host "Also delete $($o.Path) ? (y/N)"
    if ($a -eq 'y') { Nuke $o.Path }
  }
}
Write-Host "`nDone. Free space on C: $([math]::Round((Get-PSDrive C).Free/1GB,1)) GB" -ForegroundColor Green
