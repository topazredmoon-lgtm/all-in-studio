"""Writes script.json for why-ai-dumber **v3** (2026-10-13, ~2-min sample).

Owner's note on v2, verbatim: "i need new visuals and drawings. an example in my head : 'when it talks abt eating
its own tail, why not a snake eating its own tail or smthing?' i dont want the generic human figure with sticks
depecting the villain out of the blue, i want beautifull drawings and designs please. Not slop ... viewer must feel
it has been WORKED on." Then, separately: "2min sample this time".

What changed from v2:
  - **Every beat is a bespoke engraving.** v2 was `LineIcon('robot')` / `LineIcon('person')` over and over — the exact
    icon grammar the owner rejected. v3 drops `kit` almost entirely for a new register, `ds/engrave.tsx` + the 21
    plates in `ds/plates/` (spec: design-system/PLATES.md): wood-engraving, three stroke weights, hatched and
    stippled shading, each plate with its own motion. No plate is used for two different meanings; the only repeat
    is the ouroboros, deliberately, as the closing callback.
  - **A metaphor per line, not an icon per noun.** Each line was given the picture a viewer gets instantly: the
    photocopy-of-a-photocopy becomes four decaying cast plates, "the rare things went first" becomes a bell-curve
    hillside losing the flowers at its tails, "confidently wrong" becomes a compass needle a few degrees off true,
    and "eating its own tail" becomes the owner's own ouroboros.
  - **Twice the length** (11 beats -> 23, ~1:00 -> ~2:00), which bought room for the act the 1-min cut could not fit:
    the experiment itself (bell jar / copy stack / jackrabbits) and the fixes that exist but cost money.
  - Voice unchanged: Chatterbox (`tools/tts_cb.py`), not Kokoro af_heart (LEARNINGS 47-48).
  - Sourcing unchanged: Shumailov et al., Nature 631, 755-759 (24 Jul 2024). SOURCES.md has the rows.

Edit SHOTS, rerun this file, then `python tools/tts_cb.py why-ai-dumber` and `python tools/build.py why-ai-dumber`.
"""
import json
from pathlib import Path

HERE = Path(__file__).parent


def split(L, R, cap=None, **kw):
    d = {"layout": "split", "L": L, "R": R, **kw}
    if cap: d["cap"] = cap
    return d


def full(hero, cap=None, **kw):
    d = {"layout": "full", "hero": hero, **kw}
    if cap: d["cap"] = cap
    return d


def plate(name, **kw):
    """One engraving plate (ds/plates). `surface: bare` - a plate paints its own picture, never inside a card."""
    return {"v": name, "surface": "bare", **kw}


def cal(year, **kw): return {"v": "CalendarCard", "surface": "bare", "year": year, **kw}

NATURE = "nature 631 - shumailov et al. - 24 jul 2024"
PAPER = "after the experiment in nature, shumailov et al. 2024"

SHOTS = {
    # --- 01 you are not imagining it -----------------------------------------------------------------
    "h00": full(plate("BluntPencil", at="duller"), "your ai, a little *duller*"),
    "a01": full(plate("CloudingGlass", at="mush"), "thinner. vaguer. *mush*"),
    "a02": full(plate("JournalPlate", at="paper", plate=NATURE), "there is a *paper* on this"),
    # --- 02 the loop ---------------------------------------------------------------------------------
    "a03": full(plate("PaperRiver", at="internet"), "it has to *eat* the internet"),
    "a04": full(plate("TwoHands", at="people"), "not written only by *people*"),
    "a05": full(plate("PressStack", at="share"), "machines write *most* of it"),
    "a06": full(plate("JugCup", at="wrote"), "it learns from what it *wrote*"),
    "a07": full(plate("Alembic", at="drinks"), "and *drinks* it back in"),
    "a08": full(plate("Ouroboros", at="collapse", note="model collapse", tighten=110), "*model collapse*"),
    # --- 03 the experiment ---------------------------------------------------------------------------
    "a09": split(plate("BellJar", at="sealed"), cal("2024", at="2024"), "they *sealed* the loop"),
    "a10": full(plate("CopyStack", at="trained", dropAt="again"), "a copy of a *copy*"),
    "a11": full(plate("TowerRabbits", at="jackrabbit", plate=PAPER), "towers became *jackrabbits*"),
    "a12": full(plate("Meadow", at="rare"), "the *rare* things went first"),
    "a13": full(plate("Delta", at="middle"), "only the *middle* survives"),
    # --- 04 what it costs you ------------------------------------------------------------------------
    "a14": full(plate("CastOfACast", at="copy"), "the *copy* became the source"),
    "a15": full(plate("RustingGate", at="villain"), "no hack, no *villain*"),
    "a16": full(plate("Well", at="well"), "nobody is watching the *well*"),
    "a17": full(plate("DeskLamp", at="tools"), "already in your *tools*"),
    "a18": full(plate("Compass", at="wrong"), "confidently *wrong*"),
    "a19": full(plate("DriftingCourse", at="catches"), "the wrong nobody *catches*"),
    "a20": full(plate("SeedVault", at="fixes"), "there *are* fixes"),
    "a21": full(plate("Balance", at="nothing"), "the loop costs *nothing*"),
    "a22": full(plate("Ouroboros", at="eating", tighten=70, note="still eating"),
                "what it has been *eating*"),
}

ACTS = [("01 the feeling", ["h00", "a01", "a02"]),
        ("02 the loop", ["a03", "a04", "a05", "a06", "a07", "a08"]),
        ("03 the experiment", ["a09", "a10", "a11", "a12", "a13"]),
        ("04 what it costs you", ["a14", "a15", "a16", "a17", "a18", "a19", "a20", "a21", "a22"])]
for act, ids in ACTS:
    for i in ids:
        SHOTS[i]["act"] = act

BEATS = [
    {"id": "h00", "vo": "Ever get the feeling your AI is a little duller than it used to be?", "ex": 0.55},
    {"id": "a01", "vo": "You ask it something simple, and what comes back is thinner. Vaguer. Mush.",
     "say": "You ask it something simple, | and what comes back is thinner. | Vaguer. | Mush.", "ex": 0.5},
    {"id": "a02", "vo": "You are not imagining it. There is a paper in Nature about exactly this, and the mechanism is strange.",
     "say": "You are not imagining it. || There is a paper in Nature about exactly this, | and the mechanism is strange.", "ex": 0.5},

    {"id": "a03", "vo": "To learn anything at all, a model has to eat the internet. Every page, every post, every review.",
     "say": "To learn anything at all, a model has to eat the internet. || Every page, every post, every review.", "ex": 0.55},
    {"id": "a04", "vo": "But the internet is not written only by people any more.", "ex": 0.5},
    {"id": "a05", "vo": "Machines write an enormous share of it now. Product descriptions, reviews, summaries, answers.",
     "say": "Machines write an enormous share of it now. || Product descriptions, reviews, summaries, answers.", "ex": 0.55},
    {"id": "a06", "vo": "So the next model learns from pages the last model wrote.", "ex": 0.5},
    {"id": "a07", "vo": "A machine writes it. The web keeps it. The next machine drinks it straight back in.",
     "say": "A machine writes it. | The web keeps it. | The next machine drinks it straight back in.", "ex": 0.6},
    {"id": "a08", "vo": "Scientists have a name for what that does. Model collapse. A system eating its own tail.",
     "say": "Scientists have a name for what that does. || Model collapse. || A system eating its own tail.", "ex": 0.65},

    {"id": "a09", "vo": "In twenty twenty-four, researchers sealed the loop on purpose, and watched what happened.",
     "say": "In twenty twenty four, researchers sealed the loop on purpose, | and watched what happened.", "ex": 0.5},
    {"id": "a10", "vo": "They trained a model on its own output. Then trained the next one on that. Again, and again.",
     "say": "They trained a model on its own output. | Then trained the next one on that. | Again, and again.", "ex": 0.55},
    # Wording checked against the paper's own figure (RESEARCH_v3.md): it is a *continuation* prompt to OPT-125m, a
    # small language model, not a question put to a chatbot, and the gen-9 output lists jackrabbit tail colours.
    {"id": "a11", "vo": "By the ninth generation, a small model given a passage about English church towers was writing about jackrabbit tail colours.",
     "say": "By the ninth generation, | a small model given a passage about English church towers | was writing about jackrabbit tail colours.", "ex": 0.6},
    {"id": "a12", "vo": "The rare things went first. The odd fact, the unusual word, the one in a thousand case.",
     "say": "The rare things went first. || The odd fact, the unusual word, the one in a thousand case.", "ex": 0.55},
    {"id": "a13", "vo": "What survives is the middle. The average, of the average, of the average.",
     "say": "What survives is the middle. || The average, | of the average, | of the average.", "ex": 0.5},

    {"id": "a14", "vo": "This is not a bug anybody can patch. It is what happens when a copy becomes the source.",
     "say": "This is not a bug anybody can patch. || It is what happens when a copy becomes the source.", "ex": 0.6},
    {"id": "a15", "vo": "No hack. No villain. Nobody has to do a single thing wrong.",
     "say": "No hack. | No villain. | Nobody has to do a single thing wrong.", "ex": 0.5},
    {"id": "a16", "vo": "The machine just drinks its own output, and nobody is watching the well.", "ex": 0.55},
    {"id": "a17", "vo": "And this is already inside the tools you use every day.", "ex": 0.55},
    {"id": "a18", "vo": "It will not arrive as an error. It arrives as an answer that is slightly, confidently wrong.",
     "say": "It will not arrive as an error. || It arrives as an answer that is slightly, | confidently wrong.", "ex": 0.6},
    {"id": "a19", "vo": "Which is the kind of wrong nobody catches.", "ex": 0.5},
    {"id": "a20", "vo": "There are fixes. Keep human writing. Label what the machines made. Pay for the real thing.",
     "say": "There are fixes. || Keep human writing. | Label what the machines made. | Pay for the real thing.", "ex": 0.5},
    {"id": "a21", "vo": "Every one of those costs money. The loop costs nothing.",
     "say": "Every one of those costs money. || The loop costs nothing.", "ex": 0.55},
    {"id": "a22", "vo": "So the next time your AI feels a little duller, you know what it has been eating.",
     "say": "So the next time your AI feels a little duller | - you know what it has been eating.", "ex": 0.6},
]
for b in BEATS:
    b["shot"] = SHOTS[b["id"]]

out = {"id": "why-ai-dumber", "title": "WHY AI MODELS GET DUMBER - engraving-plate sample (v3)",
       "voice": {"engine": "chatterbox", "name": "chatterbox-fenrir", "ref": "assets/voice/narrator_ref.wav", "cfg": 0.35},
       "pace": {"lead": 0.15, "gap": 0.35, "min_beat": 2.2, "to_clip": 0.2, "after_clip": 0.3, "end_pad": 1.8},
       "master": "cinema",
       "beats": BEATS}
(HERE / "script.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print(len(BEATS), "beats,", sum(len(b["vo"].split()) for b in BEATS), "words")
