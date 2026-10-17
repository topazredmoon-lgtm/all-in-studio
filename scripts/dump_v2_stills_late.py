import subprocess
timestamps = [360, 400, 440, 480, 520, 540]
for ts in timestamps:
    m = ts // 60
    s = ts % 60
    out = f"tmp_stills/captchas_v2/frame_{m:02d}_{s:02d}.jpg"
    subprocess.run([
        "ffmpeg", "-y", "-ss", f"00:{m:02d}:{s:02d}",
        "-i", r"C:\Users\pc\Desktop\p\All-in_captchas_full_v2.mp4",
        "-vframes", "1", "-update", "1", out
    ], capture_output=True)
print("Done")
