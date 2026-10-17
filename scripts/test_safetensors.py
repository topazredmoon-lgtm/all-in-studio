import os, sys
from pathlib import Path

# find t3_cfg.safetensors
root = Path(r"C:\Users\pc\Documents\All-in-keep\voice")
matches = list(root.glob("**/t3_cfg.safetensors"))
print("Matches:", matches)
if matches:
    p = matches[0]
    print(f"Size of {p.name}: {p.stat().st_size / 1024 / 1024:.2f} MB")
    import safetensors
    from safetensors.torch import load_file
    try:
        data = load_file(str(p))
        print("Successfully loaded! Keys:", len(data))
    except Exception as e:
        print("Failed to load:", type(e), e)
