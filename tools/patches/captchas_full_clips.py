"""2026-10-08 patch: put real clips back into captchas-full (owner note: the narrator alone gets tiring)."""
from pathlib import Path
p = Path(__file__).resolve().parents[2] / "videos/captchas-full/gen_script.py"
s = p.read_text(encoding="utf-8")

def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (a[:60], s.count(a))
    s = s.replace(a, b)

rep("""the classroom ending). Monetization-safe: no third-party footage. Every news clip of the 3-min (WSJ, Vox, Big Think) is
replaced by a narrated line (marked NEW, source in SOURCES.md) over our own pictures. Licences: LICENCES.md.""",
"""the classroom ending). Clips (2026-10-08, owner: "put clips back, many of them"): 18 real clips break the narration about
every 20-40 s: the original WSJ / Vox / Big Think excerpts (short, commented, credited; Content ID risk accepted, see
design-system/CLIPS.md) and CC clips (von Ahn at Wikimania 2015, Google's own reCAPTCHA v3 video) in place of TED.
Licences and per-clip risk: LICENCES.md.""")

# --- new pictures for the two new bridge lines and the shortened v03
rep('''    "b05": {"cuts": [''', '''    "c02a": split(icon("book", label="books"), icon("newspaper", label="newspapers", enter="just"), "and *not just books*"),
    "c07a": full({"v": "Labels", "surface": "bare", "img": C + "cc_cross_sf.jpg", "iw": 1920, "ih": 1440, "boxes": [
            {"x": 0.44, "y": 0.45, "w": 0.21, "h": 0.12, "t": "bus", "at": "square"},
            {"x": 0.60, "y": 0.52, "w": 0.12, "h": 0.11, "t": "car", "at": "label"},
            {"x": 0.19, "y": 0.47, "w": 0.09, "h": 0.22, "t": "person", "at": "label", "plus": 6}], "plate": "photo · alfred twu · cc0"},
         "every square, *a label*"),
    "b05": {"cuts": [''')
rep('''    "v03": {"cuts": [
        split(cal("2018"), icon("grid", mark="no", markAt="dropped", label="no puzzle"), "version 3: *no puzzle*"),
        full({"v": "Score", "surface": "bare", "v1": 0.9, "at": "watches"}, "it just *returns a score*", at="It")]},''',
'''    "v03": split(cal("2018"), icon("grid", mark="no", markAt="drop", label="no puzzle"), "version 3: *no puzzle*"),''')

rep('''NEW = {
''', '''NEW = {
    "c02a": ("And it wasn't just books.", None, "c04"),
    "c07a": ("So every square you clicked became a label.", None, "c07"),
''')
rep('''EDIT = {  # nsdt lines rewritten for the new pictures
''', '''EDIT = {  # nsdt lines rewritten for the new pictures
    "v03": "By twenty eighteen, Google was ready to drop the puzzle completely.",
''')

# --- the clips: id -> (file, from, to, plate). Speech times from Whisper (news) / tools/cc_clips.py (_clips.json).
rep('''ACTS = [''', '''CLIPS = {
    "c01": ("clip2_wsj_inventor.mp4", 0.0, 8.78, "Luis von Ahn · CAPTCHA co-inventor · The Wall Street Journal"),  # the v6 hook
    "w01": ("cc_wm15_annoying.mp4", 0.15, 9.2, "Luis von Ahn · Wikimania 2015"),
    "w02": ("cc_wm15_feelbad.mp4", 0.15, 12.3, "Luis von Ahn · Wikimania 2015"),
    "c04": ("clip2_bt_billion.mp4", 0.0, 8.4, "Luis von Ahn · Big Think"),
    "c02": ("clip2_vox_nyt.mp4", 0.0, 8.0, "Vox · how reCAPTCHA read The New York Times"),
    "w03": ("cc_wm15_embassy.mp4", 0.15, 11.6, "Luis von Ahn · Wikimania 2015"),
    "c03": ("clip2_bt_luis.mp4", 0.0, 12.2, "Luis von Ahn · on Google and the books · Big Think"),
    "w04": ("cc_wm15_free.mp4", 0.15, 7.35, "Luis von Ahn · Wikimania 2015"),
    "c13": ("clip2_vox_spell.mp4", 0.0, 9.95, "Vox · why the photo test failed"),
    "c07": ("clip2_vox_cars.mp4", 9.0, 16.75, "Vox · what your clicks train"),
    "c08": ("clip2_wsj_majority.mp4", 0.0, 10.35, "The Wall Street Journal"),
    "g10": ("cc_v3_bots.mp4", 0.15, 8.95, "Google · Introducing reCAPTCHA v3"),
    "c09": ("clip2_wsj_how.mp4", 0.0, 10.4, "The Wall Street Journal"),
    "g11": ("cc_v3_score.mp4", 0.15, 7.55, "Google · Introducing reCAPTCHA v3"),
    "g12": ("cc_v3_signals.mp4", 0.15, 8.95, "Google · Introducing reCAPTCHA v3"),
    "g13": ("cc_v3_places.mp4", 0.15, 9.25, "Google · Introducing reCAPTCHA v3"),
    "c10": ("clip2_wsj_losing.mp4", 0.0, 5.67, "The Wall Street Journal"),
    "c11": ("clip2_vox_luis_end.mp4", 0.0, 9.4, "Luis von Ahn · Vox"),
}
# narrated stand-ins of the clip-free v1, now said by the clips themselves (pictures kept in SHOTS for reference)
DROPPED = {"c01r", "c02r", "c03r", "c13r", "c07r", "c08r", "c09r_old", "v01", "f01b", "o06b", "b04", "b06b", "c10r_old"}

ACTS = [''')
rep('''ACTS = [("01 the little box", "h00 c01r a02 a03 a04 a05 a05b o01 o02 o03 o04 o05 o06 o06b o07"),
        ("02 the second job", "b00 b01 b02 b03 b04 c02r b05 b06 b06b"),
        ("03 the buyer", "g01 g02 c03r g04 g05 g05b g03"),
        ("04 eyes on the street", "m01a m01 m02 m03b c13r m03 m04 m05 c07r m06 c08r m07"),
        ("05 the product", "k00 k01 k01b k02 k02b k03"),
        ("06 the workaround", "u00 u01 u01b u02 u02b u03"),
        ("07 the invisible test", "v00 v01 c09r v02 v03 v03b v04 v05 v05b"),
        ("08 who cashed in", "r00 r00b r01 r02 r03 r03b r04 c10r"),
        ("09 the ending", "f00 f00b f01 f01b f02 f02b f03 f03b f04")]''',
'''ACTS = [("01 the little box", "h00 c01 a02 a03 a04 a05 a05b o01 o02 w01 o03 o04 o05 w02 o06 o07"),
        ("02 the second job", "b00 b01 b02 b03 c04 c02a c02 b05 b06 w03"),
        ("03 the buyer", "g01 g02 c03 g04 w04 g05 g05b g03"),
        ("04 eyes on the street", "m01a m01 m02 m03b c13 m03 m04 m05 c07 c07a m06 c08 m07"),
        ("05 the product", "k00 k01 k01b k02 k02b k03 g10"),
        ("06 the workaround", "u00 u01 u01b u02 u02b u03"),
        ("07 the invisible test", "v00 c09 c09r v02 v03 g11 v03b v04 g12 v05 v05b"),
        ("08 who cashed in", "r00 r00b r01 r02 g13 r03 r03b r04 c10r c10"),
        ("09 the ending", "f00 f00b f01 c11 f02 f02b f03 f03b f04")]''')
rep('''    for i in ids.split():
        b = {k: v for k, v in nsdt[i].items() if k in ("id", "vo", "say")}''', '''    for i in ids.split():
        if i in CLIPS:
            f, a, z, plate = CLIPS[i]
            beats.append({"id": i, "clip": {"src": C + f, "from": a, "to": z, "plate": plate}})
            continue
        b = {k: v for k, v in nsdt[i].items() if k in ("id", "vo", "say")}''')
rep('''missing = [i for i in SHOTS if i not in {b["id"] for b in beats}]''', '''missing = [i for i in SHOTS if i not in {b["id"] for b in beats} | DROPPED]''')
rep('''print(len(beats), "beats,", words, "words narrated")''', '''print(len(beats), "beats,", words, "words narrated,", len(CLIPS), "clips")''')
p.write_text(s, encoding="utf-8")
print("patched")
