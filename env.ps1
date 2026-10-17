# Dot-source before any All-in work:  . C:\Users\pc\Documents\All-in-keep\env.ps1
$KEEP = if ($MyInvocation.MyCommand.Path) { Split-Path -Parent $MyInvocation.MyCommand.Path } elseif ($PSScriptRoot) { $PSScriptRoot } else { 'C:\Users\pc\Documents\All-in-keep' }
$env:PYTHONIOENCODING     = 'utf-8'
$env:HF_HOME              = Join-Path $KEEP 'voice\hf-cache'
$env:HF_HUB_OFFLINE       = '1'
$env:KOKORO_MODELS        = Join-Path $KEEP 'voice\kokoro-models'
$env:ALLIN_VOICE_PY       = Join-Path $KEEP 'voice\.venv-tts\Scripts\python.exe'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding           = [System.Text.Encoding]::UTF8

Write-Host "All-in env ready. Voice python: $env:ALLIN_VOICE_PY"
