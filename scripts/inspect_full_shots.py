import json

tl = json.load(open('engine/src/videos/captchas-full/timeline.json'))
for b in tl['beats'][:40]:
    if not b.get('clip'):
        shot = b.get('shot', {})
        t = b['start'] / 30
        print(f"{b['id']} ({t:.1f}s): layout={shot.get('layout')}")
        if 'cuts' in shot:
            for c in shot['cuts']:
                l_v = c.get('L', {}).get('v')
                r_v = c.get('R', {}).get('v')
                h_v = c.get('hero', {}).get('v')
                cap = c.get('cap')
                print(f"   cut: layout={c.get('layout')} L={l_v} R={r_v} hero={h_v} cap={cap}")
        else:
            l_v = shot.get('L', {}).get('v')
            r_v = shot.get('R', {}).get('v')
            h_v = shot.get('hero', {}).get('v')
            cap = shot.get('cap')
            print(f"   single: L={l_v} R={r_v} hero={h_v} cap={cap}")
