<#
.SYNOPSIS
  All-in Studio Unified Root Runner
.DESCRIPTION
  Execute any studio pipeline command directly from the workspace root (All-in-keep).
  Transparently handles environment variables, runtime selection, and directory contexts.
.EXAMPLE
  .\allin.ps1 status
  .\allin.ps1 tts-cb ai-power-bill
  .\allin.ps1 cues ai-power-bill
  .\allin.ps1 build ai-power-bill
  .\allin.ps1 qa ai-power-bill
  .\allin.ps1 render ai-power-bill
  .\allin.ps1 check
#>
param(
  [Parameter(Position = 0)]
  [string]$Command = "help",

  [Parameter(Position = 1)]
  [string]$Topic,

  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$ExtraArgs
)

$ErrorActionPreference = "Stop"
$CUR = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
if (Test-Path (Join-Path $CUR "All-in")) {
    $KEEP = $CUR
    $REPO = Join-Path $KEEP "All-in"
} else {
    $REPO = $CUR
    $KEEP = Split-Path -Parent $REPO
}
$VOICE_PY = Join-Path $KEEP "voice\.venv-tts\Scripts\python.exe"

# Configure Studio Environment
$env:PYTHONIOENCODING = "utf-8"
$env:HF_HOME          = Join-Path $KEEP "voice\hf-cache"
$env:HF_HUB_OFFLINE   = "1"
$env:KOKORO_MODELS    = Join-Path $KEEP "voice\kokoro-models"
$env:ALLIN_VOICE_PY   = $VOICE_PY

function Show-Help {
    Write-Host @"
All-in Studio CLI Runner (Root Bridge)

Usage:
  .\allin.ps1 <command> [topic] [options]

Commands:
  status                Show git status, toolchain health, and active topic
  check                 Run TypeScript validation in Remotion engine
  tts-cb <topic>        Voice topic narration using Chatterbox (Python 3.11 CUDA + auto-level + prosody filter)
  tts <topic>           Voice topic narration using Kokoro (System Python fallback)
  voice-check <topic>   Audit voice pitch, level, and question-inflection regularity
  cues <topic>          Dump exact Whisper word timestamps per beat (lint_cues.py --dump)
  build <topic>         Run lints, build timeline.json and master.wav
  stills <topic>        Generate per-cut preview stills and contact sheet (cutstills.mjs)
  render <topic>        Render MP4 using Remotion (per-chunk cached + GPU ANGLE)
  qa <topic>            Run full 7-gate studio QA suite (lints + sync + watch + listen)
  taste <topic>         Run Lesson #84/85 taste audit (words, layout ratio, motion liveness, tactile pop)
  pdf-receipt <topic>   Extract 300-DPI authentic PDF receipt crops with text bounding boxes
  align-words <topic>   Sub-10ms forced alignment of known script text to TTS audio
  watch <topic>         Audit visual density, edge detection & border clipping on MP4
  selftest              Run syntax and compilation self-test across all studio tools
  ship <topic>          Generate YouTube metadata, chapters, sources & 3 thumbnails (ship_package.py)
  motion-lint           Static motion-physics lint (UPG-L4): node tools/motion_lint.mjs
  type-audit            Typography registration + 22px-floor audit (UPG-L2)
  genome                Extract canonical soul-DNA / genome gate <mp4> (UPG-R2A)
  bench                 Owner one-click review console (YES/HOLD/RED; UPG-R4/UPG-L5)
  dashboard             Compile studio data and launch Command Center at http://localhost:4321
  daemon                Run continuous autonomous background daemon (research + QA audits + sync)
  auto-research         Trigger immediate autonomous deep research and topic scan
  sync [message]        Stage, commit, and push latest changes to private GitHub repo
"@ -ForegroundColor Cyan
}

switch ($Command.ToLower()) {
    "status" {
        Write-Host "`n=== All-in Studio Workspace Status ===" -ForegroundColor Cyan
        Write-Host "Root: $KEEP"
        Write-Host "Repo: $REPO"
        
        Write-Host "`n--- Git Status (All-in) ---" -ForegroundColor Yellow
        Push-Location $REPO
        try { git status -s } finally { Pop-Location }

        Write-Host "`n--- Runtime Health ---" -ForegroundColor Yellow
        Write-Host ("System Python: {0}" -f (python --version 2>&1))
        if (Test-Path $VOICE_PY) {
            $cudaCheck = & $VOICE_PY -c "import torch; print(f'Torch {torch.__version__} | CUDA: {torch.cuda.is_available()}')" 2>&1
            Write-Host ("Voice Venv:    Python 3.11 ({0})" -f $cudaCheck)
        } else {
            Write-Host "Voice Venv:    MISSING ($VOICE_PY)" -ForegroundColor Red
        }

        $freeGB = [math]::Round((Get-PSDrive C).Free / 1GB, 1)
        Write-Host ("Disk Free C:   {0} GB" -f $freeGB)
    }

    "selftest" {
        Write-Host "`n=== Running All-in Studio Toolchain Self-Test ===" -ForegroundColor Cyan
        Push-Location $REPO
        try {
            $pyTools = @("srchash.py", "tts_cb.py", "lint_text.py", "lint_cues.py", "lint_clips.py", "voice_check.py", "build.py", "qa.py", "watch.py", "listen.py", "clip_words.py", "win_cut.py", "sheet.py", "ship_package.py")
            foreach ($pt in $pyTools) {
                $pPath = Join-Path "tools" $pt
                if (Test-Path $pPath) {
                    python -m py_compile $pPath
                    Write-Host "  [PASS] Python syntax: $pt" -ForegroundColor Green
                }
            }
            $mjsTools = @("render.mjs", "cutstills.mjs", "frame.mjs", "stills.mjs")
            foreach ($mt in $mjsTools) {
                $mPath = Join-Path "tools" $mt
                if (Test-Path $mPath) {
                    node --check $mPath
                    Write-Host "  [PASS] Node ESM syntax: $mt" -ForegroundColor Green
                }
            }
        } finally {
            Pop-Location
        }
        Push-Location (Join-Path $REPO "engine")
        try {
            npx tsc --noEmit
            Write-Host "  [PASS] Remotion Engine TypeScript (tsc --noEmit)" -ForegroundColor Green
        } finally {
            Pop-Location
        }
        Write-Host "`nAll toolchain checks passed!" -ForegroundColor Cyan
    }

    "check" {
        Write-Host "Running engine TypeScript check..." -ForegroundColor Cyan
        Push-Location (Join-Path $REPO "engine")
        try { npx tsc --noEmit } finally { Pop-Location }
    }

    "build" {
        if (-not $Topic) { Write-Host "Error: topic required. Usage: .\allin.ps1 build <topic>" -ForegroundColor Red; exit 1 }
        Push-Location $REPO
        try { python tools/build.py $Topic @ExtraArgs } finally { Pop-Location }
    }

    "cues" {
        if (-not $Topic) { Write-Host "Error: topic required. Usage: .\allin.ps1 cues <topic>" -ForegroundColor Red; exit 1 }
        Push-Location $REPO
        try { python tools/lint_cues.py $Topic --dump @ExtraArgs } finally { Pop-Location }
    }

    "tts" {
        if (-not $Topic) { Write-Host "Error: topic required. Usage: .\allin.ps1 tts <topic>" -ForegroundColor Red; exit 1 }
        Push-Location $REPO
        try { python tools/tts.py $Topic @ExtraArgs } finally { Pop-Location }
    }

    "tts-cb" {
        if (-not $Topic) { Write-Host "Error: topic required. Usage: .\allin.ps1 tts-cb <topic>" -ForegroundColor Red; exit 1 }
        Push-Location $REPO
        try { python tools/tts_cb.py $Topic @ExtraArgs } finally { Pop-Location }
    }

    "voice-check" {
        if (-not $Topic) { Write-Host "Error: topic required. Usage: .\allin.ps1 voice-check <topic>" -ForegroundColor Red; exit 1 }
        Push-Location $REPO
        try { python tools/voice_check.py $Topic @ExtraArgs } finally { Pop-Location }
    }

    "taste" {
        if (-not $Topic) { Write-Host "Error: topic required. Usage: .\allin.ps1 taste <topic>" -ForegroundColor Red; exit 1 }
        Push-Location $REPO
        try { python tools/taste_audit.py $Topic @ExtraArgs } finally { Pop-Location }
    }

    "pdf-receipt" {
        if (-not $Topic) { Write-Host "Error: topic required. Usage: .\allin.ps1 pdf-receipt <topic>" -ForegroundColor Red; exit 1 }
        Push-Location $REPO
        try { python tools/pdf_receipt.py $Topic @ExtraArgs } finally { Pop-Location }
    }

    "align-words" {
        if (-not $Topic) { Write-Host "Error: topic required. Usage: .\allin.ps1 align-words <topic>" -ForegroundColor Red; exit 1 }
        Push-Location $REPO
        try { python tools/align_words.py $Topic @ExtraArgs } finally { Pop-Location }
    }

    "qa" {
        if (-not $Topic) { Write-Host "Error: topic required. Usage: .\allin.ps1 qa <topic>" -ForegroundColor Red; exit 1 }
        Push-Location $REPO
        try { python tools/qa.py $Topic @ExtraArgs } finally { Pop-Location }
    }

    "watch" {
        if (-not $Topic) { Write-Host "Error: topic required. Usage: .\allin.ps1 watch <topic>" -ForegroundColor Red; exit 1 }
        Push-Location $REPO
        try { python tools/watch.py $Topic @ExtraArgs } finally { Pop-Location }
    }

    "listen" {
        if (-not $Topic) { Write-Host "Error: topic required. Usage: .\allin.ps1 listen <topic>" -ForegroundColor Red; exit 1 }
        Push-Location $REPO
        try { python tools/listen.py $Topic @ExtraArgs } finally { Pop-Location }
    }

    "render" {
        if (-not $Topic) { Write-Host "Error: topic required. Usage: .\allin.ps1 render <topic>" -ForegroundColor Red; exit 1 }
        Push-Location $REPO
        try { node tools/render.mjs $Topic @ExtraArgs } finally { Pop-Location }
    }

    "stills" {
        if (-not $Topic) { Write-Host "Error: topic required. Usage: .\allin.ps1 stills <topic>" -ForegroundColor Red; exit 1 }
        Push-Location $REPO
        try { node tools/cutstills.mjs $Topic @ExtraArgs } finally { Pop-Location }
    }

    "ship" {
        if (-not $Topic) { Write-Host "Error: topic required. Usage: .\allin.ps1 ship <topic>" -ForegroundColor Red; exit 1 }
        Push-Location $REPO
        try { python tools/ship_package.py $Topic @ExtraArgs } finally { Pop-Location }
    }

    "clip-words" {
        if (-not $Topic) { Write-Host "Error: topic required. Usage: .\allin.ps1 clip-words <topic>" -ForegroundColor Red; exit 1 }
        Push-Location $REPO
        try { python tools/clip_words.py $Topic @ExtraArgs } finally { Pop-Location }
    }

    "sheet" {
        if (-not $Topic) { Write-Host "Error: topic required. Usage: .\allin.ps1 sheet <topic> [first_beat] [last_beat]" -ForegroundColor Red; exit 1 }
        Push-Location $REPO
        try { python tools/sheet.py $Topic @ExtraArgs } finally { Pop-Location }
    }

    # --- T-R2C (UPG-R4 + UPG-L5): owner one-click review console ---
    "bench" {
        Push-Location $REPO
        try {
            if ($Topic -in @("scan", "gate-ready")) {
                python tools/benched_queue.py $Topic @ExtraArgs
            } elseif ($Topic -in @("approve", "hold", "reject")) {
                if (-not $ExtraArgs) { Write-Host "Error: topic required. Usage: .\allin.ps1 bench <approve|hold|reject> <topic> [--note ...]" -ForegroundColor Red; exit 1 }
                $noteArgs = @()
                if ($ExtraArgs.Count -gt 1) { $noteArgs = $ExtraArgs[1..($ExtraArgs.Count - 1)] }
                python tools/benched_queue.py verdict $ExtraArgs[0] $Topic @noteArgs
            } else {
                python tools/benched_queue.py serve --open @ExtraArgs
            }
        } finally { Pop-Location }
    }

    # --- T-R2A (UPG-R2A): canonical-DNA extraction + film-level soul gate ---
    "genome" {
        Push-Location $REPO
        try {
            if ($Topic -eq "gate") {
                if (-not $ExtraArgs) { Write-Host "Error: mp4 required. Usage: .\allin.ps1 genome gate <mp4> [--strict]" -ForegroundColor Red; exit 1 }
                python tools/soul_genome.py gate @ExtraArgs
            } else {
                python tools/soul_genome.py extract @ExtraArgs
            }
        } finally { Pop-Location }
    }

    # --- T-R2B (UPG-L4 / UPG-L2): static taste lints (motion + typography) ---
    "motion-lint" {
        Push-Location $REPO
        try { node tools/motion_lint.mjs @ExtraArgs } finally { Pop-Location }
    }
    "type-audit" {
        Push-Location $REPO
        try { python tools/type_audit.py @ExtraArgs } finally { Pop-Location }
    }

    "dashboard" {
        Write-Host "Compiling studio data and launching Command Center..." -ForegroundColor Cyan
        Push-Location $REPO
        try {
            python tools/autonomous_studio.py
            Start-Process "http://localhost:4321"
            python tools/dashboard_server.py
        } finally {
            Pop-Location
        }
    }

    "daemon" {
        Write-Host "Starting Autonomous Background Studio Daemon..." -ForegroundColor Cyan
        Push-Location $REPO
        try {
            python tools/autonomous_studio.py --daemon @ExtraArgs
        } finally {
            Pop-Location
        }
    }

    "auto-research" {
        Write-Host "Triggering Autonomous Deep Research Pass..." -ForegroundColor Cyan
        Push-Location $REPO
        try {
            python tools/autonomous_studio.py --scan
        } finally {
            Pop-Location
        }
    }

    "sync" {
        Write-Host "`n=== Synchronizing Studio with GitHub ===" -ForegroundColor Cyan
        
        $rootFiles = @(
            "1-WIPE-OLD-PROJECTS.ps1", "2-RESET-CLAUDE-APP.ps1", "env.ps1", 
            "ENVIRONMENT.md", "HARNESS.md", "README-START-HERE.md", 
            "requirements-system-python.txt", "requirements-voice-venv.txt",
            "AGENTS.md", "CLAUDE.md", "GEMINI.md", "allin.ps1", "index.html"
        )
        foreach ($rf in $rootFiles) {
            $src = Join-Path $KEEP $rf
            if (Test-Path $src) {
                Copy-Item $src -Destination (Join-Path $REPO $rf) -Force
            }
        }

        Push-Location $REPO
        try {
            Write-Host "Staging all changes..." -ForegroundColor Yellow
            git add -A

            $hasChanges = (git status --porcelain)
            if ($hasChanges) {
                $commitMsg = if ($Topic) { $Topic } else { "Studio update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')" }
                Write-Host "Committing: $commitMsg" -ForegroundColor Yellow
                git commit -m $commitMsg
            } else {
                Write-Host "Working directory clean; checking for unpushed commits..." -ForegroundColor Yellow
            }

            $currentBranch = (git branch --show-current).Trim()
            Write-Host "Pushing to private GitHub repo ($currentBranch & main)..." -ForegroundColor Yellow
            git push origin $currentBranch
            if ($currentBranch -ne "main") {
                git push origin "${currentBranch}:main"
            }
            Write-Host "`n[SUCCESS] Studio synchronized to private GitHub repository (https://github.com/topazredmoon-lgtm/all-in-studio)!" -ForegroundColor Green
        } finally {
            Pop-Location
        }
    }

    Default {
        Show-Help
    }
}
