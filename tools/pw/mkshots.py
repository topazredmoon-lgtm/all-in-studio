#!/usr/bin/env python3
"""Writes script.shots.json (script format with shot.cuts) and a placeholder timeline.json (words estimated) for poisoned-well.
Usage: python3 mkshots.py [audio_dir]   -- if <audio_dir>/<id>.json + .words.json exist they replace the estimates."""
import json, re, sys, math
from pathlib import Path
ROOT = Path(__file__).resolve().parent
FPS = 30
def H(s, cap, at=None, k=0):
    c = {"layout": "scene", "punch": False, "hero": {"v": s[0], "s": s[1], "cap": cap, **({"sk": k} if k else {})}}
    if at: c["at"] = at
    return c
B = [
 ("h01", "Somewhere on the internet right now, there's a page written for an audience of one. || Not you. || Your AI.", 0.72,
  [H(("PW_H01",0),"Somewhere on the internet right now"), H(("PW_H01",1),"written for an audience of one","written"), H(("PW_H01",2),"Not you.","not"), H(("PW_H01",2),"Your AI.","your",70)], []),
 ("h02", "In 2025, reporters found research papers hiding a secret message, in white text, invisible to any human reader. It was addressed to AI reviewers: | give a positive review only.", 0.65,
  [H(("PW_H02",0),"In 2025, reporters found research"), H(("PW_H02",1),"papers hiding a secret message","papers"), H(("PW_H02",4),"invisible to any human reader","invisible"), H(("PW_H02",2),"addressed to AI reviewers","addressed"), H(("PW_H02",3),"Give a positive review only.","Give")], [{"k":"tick","at":"Give"}]),
 ("a01", "That's the polite version. || Here's the one that should scare you.", 0.7,
  [H(("PW_A01",0),"That's the polite version."), H(("PW_A01",1),"the one that should scare you","the#2")], []),
 ("a02", "How much poison does it take to corrupt an AI trained on the entire internet? Everyone assumed you'd need to control a real share of the data. Millions of pages.", 0.62,
  [H(("PW_A02",1),"How much poison does it take"), H(("PW_A02",0),"trained on the entire internet","trained"), H(("PW_A02",2),"Everyone assumed you'd need to control","Everyone"), H(("PW_A02",2),"real share of the data, millions","real",51)], []),
 ("a03", "Then Anthropic, the UK AI Security Institute and the Alan Turing Institute actually tested it. || The answer was two hundred and fifty documents. | And the size of the model made no difference.", 0.72,
  [H(("PW_A03",0),"Then Anthropic, the UK AI"), H(("PW_A03",0),"Institute and the Alan Turing Institute","Institute",75), H(("PW_A03",0),"actually tested it.","actually",132), H(("PW_A03",1),"The answer was 250","The#3"), H(("PW_A03",1),"documents.","documents",45), H(("PW_A03",2),"And the size of the model","And#2"), H(("PW_A03",3),"made no difference.","made")], [{"k":"thud","at":"250"}]),
 ("a04", "Hide a trigger phrase in those pages, and the model quietly learns a secret behaviour. In the study, it was harmless: the trigger made it spit out gibberish. | The question is what someone less polite would teach it.", 0.68,
  [H(("PW_A04",0),"Hide a trigger phrase in those"), H(("PW_A04",0),"and the model quietly learns","and",63), H(("PW_A04",0),"secret behavior. In the study,","secret",105), H(("PW_A04",1),"it was harmless. The trigger","it"), H(("PW_A04",1),"made it spit out gibberish.","made",39), H(("PW_A04",2),"The question is what someone","The#4"), H(("PW_A04",2),"less polite would teach it.","less",39)], [{"k":"click","at":"trigger"}]),
 ("b01", "And someone is already trying. A Moscow-based network called Pravda pumped out three point six million articles in a single year. || Almost nobody read them.", 0.68,
  [H(("PW_B01",0),"And someone is already trying."), H(("PW_B01",0),"Moscow-based network called Pravda","Moscow",60), H(("PW_B01",1),"pumped out 3.6 million articles in","pumped"), H(("PW_B01",1),"a single year.","a#2",69), H(("PW_B01",2),"Almost nobody read them.","Almost")], []),
 ("b02", "Because they weren't written for people. When NewsGuard tested ten leading chatbots, they repeated the network's false claims about a third of the time.", 0.65,
  [H(("PW_B02",0),"because they weren't written for people."), H(("PW_B02",1),"When NewsGuard tested 10 leading chatbots,","When"), H(("PW_B02",2),"they repeated the network's false claims","they#2"), H(("PW_B02",3),"about a third of the time.","about")], []),
 ("c01", "You can't see the poison. | Neither can the model. | It's baked into what it believes.", 0.7,
  [H(("PW_C01",0),"You can't see the poison."), H(("PW_C01",1),"Neither can the model.","Neither"), H(("PW_C01",2),"It's baked into what it believes.","It's")], []),
 ("c02", "So the next time an AI answers you with total confidence, ask the one question nobody asks. || Who wrote the pages it learned from?", 0.75,
  [H(("PW_C02",0),"the next time an AI answers"), H(("PW_C02",0),"you with total confidence,","you",45), H(("PW_C02",1),"ask the one question nobody","ask"), H(("PW_C02",2),"","asks"), H(("PW_C02",3),"","learned")], []),
]
src = json.loads(Path("/mnt/user-data/uploads/Documents/All-in-keep/All-in/videos/new-ai-reasoning/script.json").read_text())
script = {k: v for k, v in src.items() if k != "beats"}
script.update({"id": "poisoned-well", "title": "THE POISONED WELL · How Anyone Can Secretly Reprogram the AI You Trust"})
script["beats"] = [{"id": i, "vo": re.sub(r"\s*\|\|?\s*", " ", say).strip(), "say": say, "ex": ex, "shot": {"cuts": cuts, **({"sfx": sfx} if sfx else {})}} for i, say, ex, cuts, sfx in B]
(ROOT / "script.shots.json").write_text(json.dumps(script, indent=1, ensure_ascii=False))
(ROOT / "videos" / "poisoned-well").mkdir(parents=True, exist_ok=True)
(ROOT / "videos" / "poisoned-well" / "script.shots.json").write_text(json.dumps(script, indent=1, ensure_ascii=False))

# placeholder timeline
adir = Path(sys.argv[1]) if len(sys.argv) > 1 else None
lead, gap = 0.2, 0.45
beats, t = [], 0
for b in script["beats"]:
    words = None
    if adir and (adir / f"{b['id']}.words.json").exists():
        ws = json.loads((adir / f"{b['id']}.words.json").read_text()); dur_s = json.loads((adir / f"{b['id']}.json").read_text())["dur"]
        words = [{"w": w["w"], "f": round((lead + w["s"]) * FPS)} for w in ws]; dur = math.ceil((lead + dur_s + gap) * FPS)
    else:
        cur, words = 0.0, []
        for tok in b["say"].split():
            if tok == "||": cur += 0.55; continue
            if tok == "|": cur += 0.25; continue
            words.append({"w": tok, "f": round((lead + cur) * FPS)}); cur += 0.13 + 0.042 * len(tok) + (0.12 if tok[-1] in ".,:?" else 0)
        dur = math.ceil((lead + cur + gap) * FPS)
    beats.append({"id": b["id"], "start": t, "dur": dur, "shot": b["shot"], "words": words}); t += dur
tl = {"fps": FPS, "total": t, "beats": beats}
out = ROOT / "engine" / "src" / "videos" / "poisoned-well"; out.mkdir(parents=True, exist_ok=True)
(out / "timeline.json").write_text(json.dumps(tl))
print("beats", [(b["id"], round(b["dur"] / FPS, 1)) for b in beats], "total s", round(t / FPS, 1))
