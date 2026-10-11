"""Writes script.json for china-ai-underground: the 1-MINUTE SAMPLE (owner, 2026-10-11).
Topic (owner): "undergrounds of modern chinese AI". Provide a 1min sample first.
Owner on the previous sample (ai-black-markets), the brief for this one: "the voice is horrible ... not dramatic enough
... no cinema soul at all ... the robotic voice should not be playing for too long uninterrupted. it must bullet point
the BIG claims and hook the viewer and makes him wonder ... this is not a presentation". Clips: longer or more relevant,
no weird accent or tonality.
So: a cold open on the object, a real voice within 10 s, the story told as a case file (EXHIBIT A, EXHIBIT B), every
narration run short and ending on a question or a reveal, three Senate clips (public domain, native speakers, 11-13 s),
Chatterbox voice (tools/tts_cb.py) with " | " breaks for weight. Every fact: SOURCES.md. Every clip/photo: LICENCES.md.
Run: python videos/china-ai-underground/gen_script.py; .venv-tts/bin/python tools/tts_cb.py china-ai-underground;
python tools/build.py china-ai-underground."""
import json
from pathlib import Path

HERE = Path(__file__).parent
A = "cnai/"


def scene(hero, cap=None, at=None, **kw):
    d = {"layout": "scene", "hero": hero, **kw}
    if cap: d["cap"] = cap
    if at is not None: d["at"] = at
    return d


def split(L, R, cap=None, at=None, **kw):
    d = {"layout": "split", "L": L, "R": R, **kw}
    if cap: d["cap"] = cap
    if at is not None: d["at"] = at
    return d


def full(hero, cap=None, at=None, **kw):
    d = {"layout": "full", "hero": hero, **kw}
    if cap: d["cap"] = cap
    if at is not None: d["at"] = at
    return d


def film(img, **kw): return {"v": "Film", "img": A + img, **kw}
def cctv(img, **kw): return {"v": "Cctv", "img": A + img, **kw}
def route(legs, **kw): return {"v": "RouteMap", "legs": legs, **kw}
def swap(**kw): return {"v": "LabelSwap", "surface": "bare", **kw}
def row(name, n, **kw): return {"v": "IconRow", "surface": "bare", "name": name, "n": n, **kw}


NAMES = {"sanjose": "USA", "taiwan": "Taiwan", "malaysia": "SE Asia", "shenzhen": "China"}
CR = {  # on-screen photo credits (CC BY / BY-SA): author · licence
    "h100a": "photo: 极客湾Geekerwan · CC BY 3.0",
    "b200": "photo: Pokiiri · CC BY-SA 4.0", "gb200": "photo: Pokiiri · CC BY-SA 4.0",
    "dcenter": "photo: cbowns · CC BY-SA 2.0",
    "gpucluster": "photo: ChrisDag · CC BY 2.0", "servers": "photo: bugeaters · CC BY 2.0", "warehouse": "photo: rawpixel · CC0",
}

VO = {  # id: (vo as read on screen, say = what the voice gets; " | " = 0.45 s break, " || " = 0.85 s, ex = drama 0-1)
    "h01": ("Exhibit A. The most wanted chip on Earth. Nvidia's Blackwell. China is not allowed to buy it.",
            "Exhibit A. | The most wanted chip on Earth. || Nvidia's Blackwell. | And China is not allowed to buy it.", 0.6),
    "n02": ("So how do you smuggle a chip like that?", "So, how do you smuggle a chip like that?", 0.7),
    "n03": ("Exhibit B. A hair dryer. Prosecutors say a security camera caught the trick.",
            "Exhibit B. || A hair dryer. || Federal prosecutors say a security camera caught the trick.", 0.65),
    "n04": ("Heat the serial label. Peel it off a real server. Stick it on a fake. The fakes stay behind for the inspectors. The real servers? China. Half a billion dollars' worth, in a few weeks.",
            "Heat the serial label. | Peel it off a real server. | Stick it on a fake. || The fakes stay behind, for the inspectors. | The real servers? || China. | Half a billion dollars' worth, in a few weeks.", 0.7),
    "n05": ("And DeepSeek, China's shock A.I. model? Washington has a word for it.",
            "And DeepSeek, China's shock A I model? || Washington has a word for it.", 0.65),
    "n06": ("Smuggled chips. Stolen answers. Twenty-four thousand fake accounts. This is the underground of Chinese A.I.",
            "Smuggled chips. | Stolen answers. | Twenty-four thousand fake accounts. || This is the underground of Chinese A I.", 0.6),
}

SHOTS = {
    "h01": {"cuts": [
        scene(film("b200.jpg", focus="45% 45%", z=[1.12, 1.24], credit=CR["b200"], exhibit={"t": "exhibit a", "at": "Exhibit"}), "the most *wanted* chip"),
        scene(film("b200.jpg", focus="30% 80%", z=[1.9, 2.05], pan=[-1.5, 0], grade="warm", credit=CR["b200"],
                   marks=[{"x": 0.55, "y": 0.45, "rx": 0.22, "ry": 0.3, "at": "Blackwell", "t": "blackwell", "side": "l"}]), "nvidia's *blackwell*", at="Blackwell"),
        scene(film("gb200.jpg", focus="50% 22%", z=[1.0, 1.08], grade="bw", credit=CR["gb200"], stamp={"t": "not for china", "at": "allowed", "y": 0.42}),
              "*not allowed* in china", at="China")],
        "sfx": [{"k": "thud", "at": "allowed"}]},
    "n02": {"cuts": [
        scene(route([["sanjose", "malaysia", "how"], ["malaysia", "shenzhen", "chip"]], names=NAMES, zoom=[1.0, 1.08]), "but *how*?")]},
    "n03": {"cuts": [
        scene(cctv("warehouse.jpg", focus="50% 60%", cam="CAM 04", swap={"heatAt": "hair"}, exhibit={"t": "exhibit b", "at": "Exhibit"}, credit=CR["warehouse"]), "a *hair dryer*"),
        scene(cctv("dcenter.jpg", cam="CAM 07", clock="02:31:44", credit=CR["dcenter"]), "caught on *camera*", at="security")]},
    "n04": {"cuts": [
        scene(swap(heatAt="Heat", peelAt="Peel", stickAt="stick"), "heat. peel. *stick*."),
        scene(cctv("dcenter.jpg", focus="50% 40%", cam="CAM 07", clock="02:33:02", swap={"peelAt": 0, "stickAt": 1, "goAt": "real"}, credit=CR["dcenter"]),
              "fakes for the *inspectors*", at="fakes"),
        scene(route([["sanjose", "taiwan", 0], ["taiwan", "malaysia", 12], ["malaysia", "shenzhen", "China"]], names=NAMES, zoom=[1.05, 1.0]),
              "*half a billion* in weeks", at="China")]},
    "n05": {"cuts": [
        scene(film("gpucluster.jpg", focus="50% 35%", z=[1.0, 1.1], grade="neon", credit=CR["gpucluster"]), "and *deepseek*?")]},
    "n06": {"cuts": [
        scene(film("h100a.jpg", focus="62% 58%", z=[1.17, 1.27], grade="bw", credit=CR["h100a"], stamp={"t": "smuggled", "at": "Smuggled", "y": 0.45, "rot": -6}), "smuggled *chips*"),
        scene(film("servers.jpg", focus="50% 50%", z=[1.04, 1.12], grade="cold", credit=CR["servers"], stamp={"t": "stolen", "at": "Stolen", "y": 0.45, "rot": 5}), "stolen *answers*", at="Stolen"),
        scene({"v": "AccountWall", "at": "24"}, "*24,000* fake accounts", at="24"),
        scene(film("b200.jpg", focus="45% 45%", z=[1.24, 1.34], grade="bw", credit=CR["b200"]), "the *underground* of chinese AI", at="This")],
        "sfx": [{"k": "thud", "at": "Smuggled"}, {"k": "thud", "at": "Stolen"}]},
}

CLIPS = {  # (file, from, to, plate[, fadeOut]); seconds in the clip file. All US Senate committee webcasts (public domain).
    "c01": ("pd_banks.mp4", 1.75, 13.62, "Sen. Jim Banks · Senate Banking Committee · 11 Jun 2026"),
    "c03": ("pd_lutnick.mp4", 2.00, 13.38, "Howard Lutnick · Commerce Secretary nominee · Senate Commerce · 29 Jan 2025"),
}

ORDER = "c01 h01 n05 c03 n02 n03 n04 n06"

beats = []
for i in ORDER.split():
    if i in CLIPS:
        f, a, z, plate, *fo = CLIPS[i]
        beats.append({"id": i, "clip": {"src": A + f, "from": a, "to": z, "plate": plate, **({"fadeOut": fo[0]} if fo else {})}})
        continue
    vo, say, ex = VO[i]
    beats.append({"id": i, "vo": vo, "say": say, "ex": ex, "shot": SHOTS[i]})

out = {"id": "china-ai-underground", "title": "THE UNDERGROUND OF CHINESE AI · 1-min sample",
       "voice": {"engine": "chatterbox", "name": "chatterbox-fenrir", "ref": "assets/voice/narrator_ref.wav", "cfg": 0.35},
       "master": "cinema",
       "pace": {"lead": 0.15, "gap": 0.35, "min_beat": 2.2, "to_clip": 0.2, "after_clip": 0.3, "end_pad": 1.6},
       "beats": beats}
(HERE / "script.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
words = sum(len(b.get("vo", "").split()) for b in beats)
print(len(beats), "beats,", words, "words narrated,", len(CLIPS), "clips")
