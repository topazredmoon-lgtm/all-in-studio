import sys, json, subprocess, os
from PIL import Image, ImageDraw
tl = json.load(open('engine/src/videos/poisoned-well/timeline.json'))
ids = sys.argv[1].split(',')
fr = [float(x) for x in (sys.argv[2] if len(sys.argv)>2 else '0.15,0.5,0.88').split(',')]
out = sys.argv[3]
scale = sys.argv[4] if len(sys.argv)>4 else '0.5'
spec = []
for b in tl['beats']:
    if b['id'] in ids:
        for x in fr: spec.append(f"{b['id']}:{round(b['dur']/30*x,2)}")
subprocess.run(['node','qa.mjs','qa/s',scale,','.join(spec)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
cols=len(fr); rows=len(ids)
tw,th=640,360
im=Image.new('RGB',(cols*tw,rows*th),(0,0,0))
k=0
for r in range(rows):
    for c in range(cols):
        p=f"qa/s/{spec[k].replace(':','_')}.jpg"; k+=1
        t=Image.open(p).convert('RGB').resize((tw,th)); im.paste(t,(c*tw,r*th))
im.save(out,quality=90); print(out, spec)
