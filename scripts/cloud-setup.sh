#!/usr/bin/env bash
# Cloud setup for the All-in video studio (Ubuntu/Debian). Idempotent; run from anywhere: bash scripts/cloud-setup.sh
# Does NOT render, voice or transcribe anything (only downloads models). Needs network.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"; cd "$ROOT"
SUDO=""; [ "$(id -u)" -ne 0 ] && command -v sudo >/dev/null 2>&1 && SUDO="sudo"
say() { printf '\n== %s\n' "$*"; }

say "apt packages"
export DEBIAN_FRONTEND=noninteractive
$SUDO apt-get update -y
ASOUND=libasound2; apt-cache show libasound2t64 >/dev/null 2>&1 && ASOUND=libasound2t64   # renamed on Ubuntu 24.04+
$SUDO apt-get install -y --no-install-recommends ca-certificates curl git git-lfs ffmpeg \
  python3 python3-venv python3-pip libsndfile1 fonts-dejavu-core fontconfig \
  libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libgbm1 libxkbcommon0 \
  libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libpango-1.0-0 libcairo2 "$ASOUND"
$SUDO fc-cache -f >/dev/null 2>&1 || true

say "git lfs (clips, wav, mp4 are LFS objects)"
git lfs install
git lfs pull || echo "WARN: git lfs pull failed (no remote/LFS credentials?) - media files may be pointer stubs"

say "node >= 18"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | $SUDO -E bash -
  $SUDO apt-get install -y nodejs
fi
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
[ "$NODE_MAJOR" -ge 18 ] || { echo "ERROR: node $(node -v) is too old; install Node 20 (e.g. via nvm) and re-run"; exit 1; }

say "engine: npm ci + Remotion Chrome Headless Shell (the Windows .remotion/ folder is ignored on Linux)"
( cd engine && npm ci && npx remotion browser ensure )

say "python venv (.venv)"
[ -d .venv ] || python3 -m venv .venv
.venv/bin/python -m pip install -q --upgrade pip
# tools/*.py + videos/*/gen_script.py third-party imports: numpy, soundfile, PIL, faster_whisper, kokoro_onnx (no versions pinned by code)
.venv/bin/python -m pip install -q numpy soundfile Pillow faster-whisper kokoro-onnx "av<19"   # av 19 breaks faster-whisper 1.2.1 (metadata_errors)

say "Kokoro model + voices -> models/kokoro/ (tts.py expects kokoro-official.onnx + voices-v1.0.bin)"
KDIR="$ROOT/models/kokoro"; mkdir -p "$KDIR"
REL="https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0"
[ -s "$KDIR/kokoro-official.onnx" ] || curl -fL --retry 3 -o "$KDIR/kokoro-official.onnx" "$REL/kokoro-v1.0.onnx"
[ -s "$KDIR/voices-v1.0.bin" ]      || curl -fL --retry 3 -o "$KDIR/voices-v1.0.bin" "$REL/voices-v1.0.bin"
# tts.py reads KOKORO_MODELS (set in .cloud-env.sh below).

say "faster-whisper small.en (CPU model used by tts.py / clip_words.py / transcribe_src.py fallback)"
.venv/bin/python - <<'PY'
from faster_whisper import WhisperModel
WhisperModel("small.en", device="cpu", compute_type="int8")
print("small.en cached")
PY
# NB: transcribe_src.py / clip_words.py try large-v3-turbo on CUDA first; on a CPU box they fall back to small.en automatically.

say "environment"
ENVF="$ROOT/.cloud-env.sh"
cat > "$ENVF" <<ENV
# source this before running the pipeline:  source .cloud-env.sh
export PYTHONIOENCODING=utf-8
export HF_HUB_OFFLINE=1          # models are cached now (see HANDOVER.md)
export KOKORO_MODELS="$KDIR"     # read by tools/tts.py
export PATH="$ROOT/.venv/bin:\$PATH"   # node tools call 'python' (render.mjs -> srchash.py)
ENV
export PYTHONIOENCODING=utf-8

say "self-check"
ffmpeg -version | head -1
echo "node $(node -v), npm $(npm -v)"
.venv/bin/python --version
.venv/bin/python -c "import numpy, soundfile, PIL, faster_whisper, kokoro_onnx; print('python imports OK')"
( cd engine && npx remotion versions 2>/dev/null | head -3 || true )
ls -l "$KDIR"
echo; echo "Done. Next: source .cloud-env.sh."
