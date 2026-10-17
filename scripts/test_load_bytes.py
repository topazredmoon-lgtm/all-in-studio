import os, sys, torch
from pathlib import Path
from safetensors.torch import load

ckpt_dir = Path(r"C:\Users\pc\Documents\All-in-keep\voice\hf-cache\hub\models--ResembleAI--chatterbox\snapshots\5bb1f6ee58e50c3b8d408bc82a6d3740c2db6e18")
t3_file = ckpt_dir / "t3_cfg.safetensors"

print("Reading bytes directly...")
with open(t3_file, "rb") as f:
    b = f.read()
print(f"Read {len(b) / 1024 / 1024:.2f} MB")
state = load(b)
print("Loaded via load(b)! Keys:", len(state))
del b
del state
print("Success!")
