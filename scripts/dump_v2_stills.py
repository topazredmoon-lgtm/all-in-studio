import subprocess
import os

os.makedirs("tmp_stills/captchas_v2", exist_ok=True)
timestamps = [5, 20, 40, 70, 100, 130, 160, 200, 250, 300, 360, 420, 500]
for ts in timestamps:
    m = ts // 60
    s = ts % 60
    out = f"tmp_stills/captchas_v2/frame_{m:02d}_{s:02d}.jpg"
    subprocess.run([
        "ffmpeg", "-y", "-ss", f"00:{m:02d}:{s:02d}",
        "-i", r"C:\Users\pc\Desktop\p\All-in_captchas_full_v2.mp4",
        "-vframes", "1", "-update", "1", out
    ], capture_output=True)
print("Extracted", len(timestamps), "frames.")
