# HARNESS.md · Omni-Harness & Multi-Model Compatibility Guide

This document establishes how **any AI agent harness** and **any frontier model** operates within the All-in studio without environment breakage, quota exhaustion, or rule degradation.

---

## 1. Supported Harness Matrix

| Harness | Configuration File | Root Behavior | Terminal Command Dispatch |
|---|---|---|---|
| **Google Antigravity** | `.agents/rules/studio_invariants.md`, `AGENTS.md` | Workspace root `All-in-keep\` | Run via `.\allin.ps1 <cmd>` or `cd All-in` |
| **Anthropic Claude Code** | `CLAUDE.md`, `.claude/settings.json` | Can open `All-in\` or `All-in-keep\` | Follow quota rules; default model Sonnet |
| **Cursor IDE** | `.cursorrules`, `.cursor/rules/` | Direct file editing + integrated terminal | Reads root & inner `.cursorrules` |
| **Windsurf** | `.windsurfrules`, `AGENTS.md` | Reads root `AGENTS.md` | Auto-sources `env.ps1` |
| **Codex / GitHub Copilot** | `.github/copilot-instructions.md` | Workspace instructions | Uses PowerShell commands |
| **OpenCode / Aider** | `AGENTS.md`, `CONVENTIONS.md` | Git repo at `All-in\` | Self-contained commands |

---

## 2. Model Routing & Specialization

When assigning tasks or using subagents, match models to task complexity:

### A. High-Throughput / Fast Models (Gemini 3.8 Flash, Claude Haiku, GPT-4o-mini)
- **Role**: Mechanical execution, batch text scanning, transcribing source clips, regex replacements, audio file verification.
- **Budget**: Unlimited speed and generous tokens.
- **Rules**: Must report results back in ≤200 words without dumping raw file hex or giant JSON objects.

### B. High-Reasoning / Creative Models (Gemini 3.8 Pro, Claude 3.5/3.7 Sonnet, GPT-4o, o1)
- **Role**: Scriptwriting, directorial pacing, "So What?" test filtering, visual metaphor composition (`engrave.tsx`), and critical viewer reviews.
- **Budget**: Keep conversational context under ~120k tokens. Milestone summaries in `HANDOVER.md`.

---

## 3. Toolchain & Runtime Decoupling

The studio uses **two distinct Python environments** to preserve stability and hardware acceleration:

```
[System Python 3.14.7]
  ├── tools/build.py (timeline + mastering)
  ├── tools/tts.py (Kokoro ONNX narrator)
  ├── tools/qa.py (unified audit)
  ├── tools/watch.py (frame visual density)
  ├── tools/listen.py (acoustic loudness & WER)
  └── engine/ (Node 24.19 / Remotion compositor)

[Voice Python 3.11.16 Venv] (voice\.venv-tts)
  ├── tools/tts_cb.py (Chatterbox cinema voice)
  ├── PyTorch 2.6 with CUDA (NVIDIA RTX 4060)
  └── faster-whisper with CUDA (large-v3-turbo)
```

### Self-Healing Runtime Protocol
- Any script in `tools/` automatically detects its required runtime.
- `tools/tts_cb.py` self-dispatches to the Python 3.11 venv if invoked with system Python.
- All scripts validate `--help` and topic existence, eliminating crashes and accidental directories.
- `HF_HUB_OFFLINE=1` is enforced automatically by all tools to prevent network hangs.

---

## 4. Universal Verification Checklist for Every Harness

Before reporting a task done to the user, every harness must verify:
1. `git status` in `All-in\` is clean or accurately reflected in `HANDOVER.md`.
2. `npx tsc --noEmit` in `All-in\engine` passes with 0 errors.
3. `python tools/qa.py <topic>` passes all active quality gates.
4. No commercial news or non-commercial CC clips were added.
5. All newly cited facts have a verified row in `videos/<topic>/SOURCES.md`.
