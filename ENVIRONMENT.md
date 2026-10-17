# Environment snapshot (2026-10-13)

## Host System & Toolchain
- OS: Windows 11
- GPU: NVIDIA GeForce RTX 4060 Laptop (8 GB VRAM, CUDA enabled)
- Node.js: v24.19.0 (npm 12.0.2, Remotion 4.0.526)
- ffmpeg: ffmpeg version 2026-08-20-git-7d77562d2a-essentials_build-www.gyan.dev
- git: git version 2.55.0.windows.3
- git-lfs: git-lfs/3.7.1 (GitHub; windows amd64; go 1.25.1; git b84b3384)

## Python Runtimes
1. **System Python (Python 3.14.7)**:
   - Command: `python`
   - Scope: Studio tools (`tools/build.py`, `tools/watch.py`), Kokoro TTS (`tools/tts.py`), `faster-whisper` 1.2.1 on CUDA (`large-v3-turbo`)
2. **Voice Environment (Python 3.11.16 venv)**:
   - Interpreter: `C:\Users\pc\Documents\All-in-keep\voice\.venv-tts\Scripts\python.exe`
   - Scope: Chatterbox TTS (`tools/tts_cb.py`), PyTorch 2.6 with CUDA, resemble-perth

## Shell Environment Configuration
Always activate before working in this terminal:
```powershell
. C:\Users\pc\Documents\All-in-keep\env.ps1
```
Sets:
- `PYTHONIOENCODING=utf-8`
- `HF_HUB_OFFLINE=1` (once models are cached in `voice\hf-cache`)
- `KOKORO_MODELS=..\voice\kokoro-models`
