# 2-RESET-CLAUDE-APP.ps1  (run it yourself AFTER closing the Claude desktop app completely)
#   .\2-RESET-CLAUDE-APP.ps1            -> DRY RUN: lists what would be deleted. Deletes nothing.
#   .\2-RESET-CLAUDE-APP.ps1 -Execute  -> deletes the app's local state (sessions, memory, settings, mods, MCP/plugin config).
# Run it from a plain PowerShell window, NOT from inside Claude. Deletion is PERMANENT.
# Not touched: your projects, Documents, Desktop, the All-in-keep folder, the Claude app installation itself.
# Not touched either: anything stored online (cloud sessions, routines, Remote Control sessions, project channel).
param([switch]$Execute)
$u = $env:USERPROFILE
$targets = @(
  "$u\.claude",                                   # sessions/transcripts, memory, user skills/plugins/settings
  "$u\.claude.json",                              # CLI config + MCP servers
  "$env:APPDATA\Claude",                          # desktop app state, scratch workspaces, claude-code binaries, mods
  "$env:LOCALAPPDATA\Packages\Claude_pzs8sxrjxfjjc\LocalCache\Roaming\Claude",   # Store-package copy of the same
  "$env:LOCALAPPDATA\Packages\Claude_pzs8sxrjxfjjc\LocalCache\Local\Claude",
  "$env:LOCALAPPDATA\claude-cli-nodejs"
)
Write-Host "`n== Claude app local state" -ForegroundColor Cyan
foreach ($t in $targets) {
  if (Test-Path -LiteralPath $t) {
    $it = Get-Item -LiteralPath $t -Force
    $s = if ($it.PSIsContainer) { (Get-ChildItem -LiteralPath $t -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum } else { $it.Length }
    Write-Host ("  {0,8:N0} MB  {1}" -f ($s/1MB), $t)
  } else { Write-Host ("  {0,8}     {1}" -f 'absent', $t) }
}
if (-not $Execute) { Write-Host "`nDRY RUN only. Nothing deleted." -ForegroundColor Yellow; return }

$run = Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -match '^claude' -or $_.Path -like '*Claude_pzs8sxrjxfjjc*' -or $_.Path -like '*\claude-code\*' }
if ($run) { Write-Host "`nSTOP: Claude is still running ($((($run | Select-Object -Expand ProcessName -Unique) -join ', '))). Quit it from the tray icon, then retry." -ForegroundColor Red; return }
$ans = Read-Host "`nType RESET (capitals) to permanently delete the items above"
if ($ans -cne 'RESET') { Write-Host 'Cancelled.'; return }
foreach ($t in $targets) {
  if (Test-Path -LiteralPath $t) {
    $empty = Join-Path $env:TEMP ('empty_' + [guid]::NewGuid().ToString('N')); New-Item -ItemType Directory $empty | Out-Null
    if ((Get-Item -LiteralPath $t -Force).PSIsContainer) { robocopy $empty $t /MIR /R:0 /W:0 /NFL /NDL /NJH /NJS /NP | Out-Null }
    Remove-Item -LiteralPath $t -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $empty -Force -ErrorAction SilentlyContinue
    Write-Host $(if (Test-Path -LiteralPath $t) { "  !! still present: $t" } else { "  removed $t" })
  }
}
Write-Host "`nLocal app state wiped. Next: start Claude, sign in (or with the new account), create the project -> All-in-keep\All-in." -ForegroundColor Green
Write-Host "Optional full reinstall:  Get-AppxPackage *Claude* | Remove-AppxPackage   then install again from claude.com/download"
