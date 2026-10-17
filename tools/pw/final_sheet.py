import json, subprocess, re, sys
from PIL import Image, ImageDraw
tl = json.load(open('engine/src/videos/poisoned-well/timeline.json'))
def norm(s): return re.sub(r'[^a-z0-9$%]','',s.lower())
def cue(words,key,fb):
    if key is None: return fb
    k=norm(key.split('#')[0])
    for w in words:
        if norm(w['w'])==k or (len(k)>=4 and norm(w['w']).startswith(k)): return max(0,w['f']-4)
    return fb
spec=[]; labels=[]
only = sys.argv[1].split(',') if len(sys.argv)>1 else None
for b in tl['beats']:
    if only and b['id'] not in only: continue
    cuts=b['shot']['cuts']; n=len(cuts)
    st=[0 if i==0 else cue(b['words'],c.get('at'),round(b['dur']*i/n)) for i,c in enumerate(cuts)]
    en=st[1:]+[b['dur']]
    for i,(a,e) in enumerate(zip(st,en)):
        for fr in (0.25,0.75):
            t=(a+(e-a)*fr)/30
            spec.append(f"{b['id']}:{t:.2f}"); labels.append(f"{b['id']} s{i} {fr}")
subprocess.run(['node','qa.mjs','qa/final','1',','.join(spec)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
cols=6; tw,th=480,270
rows=(len(spec)+cols-1)//cols
im=Image.new('RGB',(cols*tw,rows*th))
d=ImageDraw.Draw(im)
for k,sp in enumerate(spec):
    t=Image.open(f"qa/final/{sp.replace(':','_')}.jpg").convert('RGB').resize((tw,th),Image.LANCZOS)
    im.paste(t,((k%cols)*tw,(k//cols)*th))
im.save('qa/stills.jpg',quality=88); print(len(spec),'stills ->qa/stills.jpg', im.size)
