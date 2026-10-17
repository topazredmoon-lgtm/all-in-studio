"""Writes script.json for stolen-voices (~2-min SAMPLE, new topic 2026-10-14).

Topic: voice-clone scams. Why this one: fresh (2024-26 event arc), concrete, and the
"so what" is brutal - the viewer's own family, their own posted birthday clip, is the
raw material. Never covered by this studio (ai-black-markets is DEAD; this is not that:
no market/darknet angle, this is the personal-stakes angle).

Hook per owner's taste: opens mid-ring on a fake distress call, twist in beat two
("your daughter is fine. the voice is not hers."). No Senate hearing. No vague AI fear.
Narrator has a side: this is happening to real families and the fix is cheap.

Visuals: BESPOKE plates only, to be built in engine/src/visuals/stolen-voices.tsx
(spec them in design-system/PLATES.md style before render). Plate names below are the
build list. Left = subject on screen from frame 0; Right = evidence landing on cue word.
No metaphor reuse from other films. No lone big text. Numbers as small red tags.

Voice: Chatterbox (tools/tts_cb.py), same narrator as china-ai-underground / why-ai-dumber.

FACTS POLICY: every factual claim has a SOURCES.md row. Rows marked [VERIFY] must be
re-checked at the source before render - do not ship unverified numbers.

Edit SHOTS/VO, rerun this file, then:
  python tools/tts_cb.py stolen-voices
  python tools/build.py stolen-voices
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
    """One bespoke engraving plate (engine/src/visuals/stolen-voices.tsx). surface: bare."""
    return {"v": name, "surface": "bare", **kw}


def icon(name, **kw):
    return {"v": "LineIcon", "surface": "bare", "name": name, **kw}


def tag(t, at=0):
    return {"t": t, "at": at}


VO = {
    # --- 01 COLD OPEN: the call -----------------------------------------------------------------
    "h01": ("A phone rings in a quiet house. Your daughter's voice, crying: "
            "mom, I'm in trouble, please don't tell dad.", None),
    "h02": ("Your daughter is fine. She's asleep down the hall. "
            "The voice on the phone is still hers. Every crack, every sniff. "
            "And it was built by a machine.", None),
    # --- 02 how thin the margin is ----------------------------------------------------------------
    "a01": ("This is a voice clone. And the scary part isn't the tech. "
            "It's how little the tech needs.", None),
    "a02": ("Seconds. That's the length of one story clip where you're laughing "
            "at a birthday party. Long enough for a modern model to learn how you sound.", None),
    "a03": ("Here's what that means. The model doesn't store your voice like a tape. "
            "It learns your instrument: the pitch, the rasp, the rhythm. "
            "Then it plays new words on it.", None),
    # --- 03 so what: you are the raw material -------------------------------------------------------
    "a04": ("So every voicemail you've left, every video you've posted, every call "
            "someone put on speaker: raw material.", None),
    "a05": ("Scammers used to send scripts to strangers. Now they send your own "
            "child's voice to you. Consumer agencies have watched family-impersonation "
            "fraud climb year after year, and cloning made it personal.", None),
    # --- 04 the twist: it's not just grandma -----------------------------------------------------------
    "a06": ("You're thinking: easy, hang up, call back. For the grandparent scam, "
            "that works. Do that. Always.", None),
    "a07": ("But now think about who else picks up a phone. Your bank. Your boss. "
            "A journalist's source.", None),
    "a08": ("In twenty twenty-four, a finance worker at a global firm wired out "
            "twenty-five million dollars after a video call with his chief financial officer. "
            "Everyone on that call was fake. Everyone but him.", None),
    # --- 05 the deeper break: evidence itself ------------------------------------------------------------
    "a09": ("And it cuts the other way. Courts, police, newsrooms: they all treat "
            "a recording as proof.", None),
    "a10": ("When anyone can make a recording of anyone saying anything, "
            "\"it's on tape\" stops meaning anything. That's the real damage. "
            "Not the stolen money. The dead witness.", None),
    # --- 06 takeaways that actually work ------------------------------------------------------------------
    "a11": ("So here's what works. One: a family password. A silly word only your "
            "people know. If the crying voice can't say it, hang up.", None),
    "a12": ("Two: call back. On the number you already have. A clone can steal your "
            "voice. It cannot steal your phone.", None),
    "a13": ("Three: post a little less freely. That birthday clip isn't just a memory "
            "anymore. It's a sample.", None),
    # --- 07 button ---------------------------------------------------------------------------------------
    "a14": ("Your voice was always how people knew it was you. "
            "Now it's data. And data gets copied.", None),
}

# Bespoke plate build list (engine/src/visuals/stolen-voices.tsx):
#   RingingHousePhone  - dark hallway, phone glowing mid-ring
#   SleepingDoor       - closed bedroom door, calm, "she's fine"
#   WaveThread         - one voice waveform unraveling into a thread a machine pulls
#   BirthdayClip       - phone story frame, cake, 3-second arc under it (red tag: "3 s")
#   VoiceLoom          - loom weaving a voiceprint: pitch/rasp/rhythm as threads (the explainer)
#   PostWall           - wall of little posted clips, each a droplet feeding a pipe
#   ScriptToVoice      - torn paper script on L, living waveform on R (the escalation)
#   HangUpHand         - hand pressing a phone down, decisive
#   BankCall           - office phone, bank facade, small red tag "$25M" for a08
#   VideoCallGrid      - video-call grid, every face a mask except one real
#   GavelTape          - gavel resting on a cassette; tape unraveling (dead witness)
#   FamilyWord         - a whispered word passed between two heads (the password)
#   CallBackDial       - dial pad, a saved contact name glowing
#   MemoryToSample     - photo of a birthday turning into a lab sample vial
#   CopiedFace         - closing: one voiceprint stamped into an identical row (the button)
SHOTS = {
    "h01": split(plate("RingingHousePhone"), plate("WaveThread", enter="machine"),
                 "the *voice* is hers"),
    "h02": split(plate("SleepingDoor"), plate("WaveThread", enter="built"),
                 "built by a *machine*"),
    "a01": split(plate("WaveThread"), plate("BirthdayClip", enter="seconds"),
                 "how *little* it needs"),
    "a02": split(plate("BirthdayClip"), tag("3 s", at="seconds"),
                 "*seconds* of you"),
    "a03": split(plate("VoiceLoom"), plate("VoiceLoom", enter="plays"),
                 "it learns your *instrument*"),
    "a04": split(plate("PostWall"), plate("PostWall", enter="material"),
                 "you are the *raw material*"),
    "a05": split(plate("ScriptToVoice"), plate("WaveThread", enter="personal"),
                 "scripts became *your child*"),
    "a06": split(plate("HangUpHand"), icon("phone", enter="back"),
                 "*hang up*, call back"),
    "a07": split(plate("HangUpHand"), plate("BankCall", enter="bank"),
                 "who else *picks up*"),
    "a08": split(plate("VideoCallGrid"), tag("$25M", at="million"),
                 "everyone was *fake*"),
    "a09": split(plate("GavelTape"), icon("scale", enter="proof"),
                 "a recording was *proof*"),
    "a10": split(plate("GavelTape"), plate("WaveThread", enter="witness"),
                 "the *dead witness*"),
    "a11": split(plate("FamilyWord"), icon("lock", enter="password"),
                 "a family *password*"),
    "a12": split(plate("CallBackDial"), plate("HangUpHand", enter="phone"),
                 "it cannot steal your *phone*"),
    "a13": split(plate("MemoryToSample"), plate("BirthdayClip", enter="sample"),
                 "a memory became a *sample*"),
    "a14": split(plate("CopiedFace"), plate("WaveThread", enter="copied"),
                 "data gets *copied*"),
}

CLIPS = {
    # Real-clip hook goes here once research/licence pass is done (money rule):
    # first clip = strongest, 6-12 s, CC BY / CC0 / US-gov only, sentence-end cuts,
    # logged in LICENCES.md the same turn. Candidates to hunt: FTC consumer-alert
    # material (US gov, public domain), 39C3 / EMF talks on voice cloning (check licence).
}

ORDER = ["h01", "h02",
         "a01", "a02", "a03",
         "a04", "a05",
         "a06", "a07", "a08",
         "a09", "a10",
         "a11", "a12", "a13",
         "a14"]

if __name__ == "__main__":
    beats = []
    for bid in ORDER:
        if bid in CLIPS:
            beats.append({"id": bid, "clip": CLIPS[bid]})
        elif bid in VO:
            vo, say = VO[bid]
            b = {"id": bid, "vo": vo, "shot": SHOTS.get(bid, {})}
            if say: b["say"] = say
            beats.append(b)

    data = {
        "id": HERE.name,
        "title": "STOLEN VOICES",
        "voice": {"engine": "chatterbox", "name": "default", "speed": 1.0},
        "pace": {"lead": 0.2, "gap": 0.45, "min_beat": 2.4, "to_clip": 0.25,
                 "after_clip": 0.45, "end_pad": 1.5},
        "beats": beats,
    }
    (HERE / "script.json").write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(f"Wrote script.json for {HERE.name} with {len(beats)} beats")
