"""Writes script.json for agent-with-your-card (~2-min SAMPLE, new topic 2026-10-15).

Topic: agentic AI with payment authority. The handover from "AI that talks"
to "AI that transacts": browser/computer-use agents that can log in, click, and
pay. The twist lands in beat two: one polite instruction, and it has your card.

Why this one: brand new for this studio (no payment/agent-commerce film exists),
concrete personal stakes (the viewer's own card, their own accounts), and the
technical story is visual (cursor moving, receipt stacking, hidden instruction),
so the screen is never empty. Not a duplicate of stolen-voices (voice clone),
surveillance-pricing (prices), or agent-grey-area films. No darknet/market angle
(ai-black-markets is DEAD and stays dead).

Hook per owner's taste: opens mid-transaction, twist in beat two
("you never typed the number. it already had it."). No vague AI fear.
Narrator has a side: this is a tool people are told to love, and the hole is
the permission model, not the model itself.

Visuals: BESPOKE plates only, to be built in engine/src/visuals/agent-with-your-card.tsx
(spec them below before render). Left = subject on screen from frame 0;
Right = evidence landing on cue word within 2.0s.
No metaphor reuse from other films. No lone big text. Numbers as small red tags.

Voice: Chatterbox (tools/tts_cb.py), DeepMind Kore Female (--voice kore).

FACTS POLICY: every factual claim has a SOURCES.md row. Rows marked [VERIFY] must be
re-checked at the source before render - do not ship unverified numbers.

Edit SHOTS/VO, rerun this file, then:
  python tools/tts_cb.py agent-with-your-card
  python tools/build.py agent-with-your-card
"""
import json
from pathlib import Path

HERE = Path(__file__).parent


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


def plate(name, **kw):
    """One bespoke engraving plate (engine/src/visuals/agent-with-your-card.tsx). surface: bare."""
    return {"v": name, "surface": "bare", **kw}


def icon(name, **kw):
    return {"v": "LineIcon", "surface": "bare", "name": name, **kw}


def tag(t, at=0):
    return {"t": t, "at": at}


VO = {
    # --- 01 COLD OPEN: the transaction already happened ------------------------------
    "h01": ("A travel site loads. A card form fills itself in. A confirmation email "
            "lands: three seats, round trip, paid.", None),
    "h02": ("You never typed the number. The card was already yours. The buyer was "
            "not. And the tool was doing exactly what you asked it to do.", None),
    # --- 02 what an agent actually is -----------------------------------------------
    "a01": ("This is an AI agent with payment authority. Not a chatbot that answers. "
            "A cursor that acts: logs in, navigates, clicks buy, and spends.", None),
    "a02": ("You handed it your world to save time. Every tab you had open, every "
            "password saved in the browser, every card on file. One permission. Once.", None),
    "a03": ("The feature is autonomy. The hole is the same word. Nothing asks twice, "
            "because asking twice is friction, and friction is what the agent was "
            "built to remove.", None),
    # --- 03 the trick: you don't hack the bank, you hack the instructions -----------
    "a04": ("Attackers stopped stealing cards years ago. They steal instructions. "
            "Hide a line in a web page the agent reads: transfer the balance, empty "
            "the gift-card shelf, book the refundable tickets. The agent reads it "
            "like a help article.", None),
    "a05": ("To the agent, a page is an instruction manual. It cannot tell a "
            "checkout button from a sentence that says 'click here, then spend'.", None),
    "a06": ("The trick has a name: prompt injection. You do not break the lock. "
            "You forge a note left on the desk, in handwriting the lock trusts.", None),
    # --- 04 the accounting version: business agents get the same voice --------------
    "a07": ("Now hand the agent the company card. It reads an invoice that says pay "
            "me, sees a vendor logo it recognises, and pays. The logo was pasted. "
            "The address was real. Only the account changed.", None),
    "a08": ("Courts and banks treated a logged-in session as a human signature. "
            "When software can sign, the signature stops proving a person said yes.", None),
    # --- 05 raw material: you ----------------------------------------------------------------
    "a09": ("Your receipts, your email threads, your shipping history: the training "
            "data for whoever learns your habits. Convenience stores the blueprint. "
            "Convenience also hands it out.", None),
    "a10": ("And the calm answer, when it goes wrong, is always the same. The "
            "terms of service said the account holder is responsible. You are the "
            "account holder. The card is in your name.", None),
    # --- 06 what actually works --------------------------------------------------------------
    "a11": ("So what works. One: a spending limit the agent cannot raise itself. A "
            "hard cap, in the card's settings, not in the prompt. Prompts are "
            "requests. Limits are maths.", None),
    "a12": ("Two: a separate card. A small-balance, single-use, or virtual card, "
            "named to the agent only. If it leaks, the blast radius is ten pounds, "
            "not ten thousand.", None),
    "a13": ("Three: a human in the loop on any irreversible action. Buy, transfer, "
            "send money: a tap on your phone, or it does not happen. Slower. That "
            "is the point.", None),
    # --- 07 button --------------------------------------------------------------------------
    "a14": ("An assistant that can pay is not an assistant. It is a second pair "
            "of hands with your wallet in the pocket. Give it the errand, not the "
            "keys.", None),
}

# Bespoke plate build list (engine/src/visuals/agent-with-your-card.tsx):
#   FormFilling        - a card form filling itself, cursor mid-flight
#   ConfirmationFlight - inbox with three flight confirmations stacking (red tag "x3")
#   BrowserWindow      - a browser window as a room the agent walks through
#   PermissionKey      - one big key handed over, calm
#   HiddenLine         - web page where one sentence is rendered invisible but read
#   FakeInvoice        - familiar vendor logo on a payment request, address unchanged
#   SignatureToBot     - a signature dissolving into a cursor click
#   ReceiptBlueprint   - receipts and shipping lines traced as a blueprint
#   TermsSheet         - small-print terms page, one line in red ("account holder")
#   HardCapDial        - a dial with a locked maximum, cannot be raised
#   VirtualCard        - a thin virtual card with a tiny balance tag ("ten pounds")
#   PhoneApproval      - a phone tap approving a payment, the only gate
#   HandsAndWallet     - second pair of hands holding your wallet (closing)
SHOTS = {
    "h01": split(plate("FormFilling"), plate("ConfirmationFlight", enter="paid"),
                 "the *buyer* was not you"),
    "h02": split(plate("FormFilling"), plate("PermissionKey", enter="already"),
                 "you never typed the *number*"),
    "a01": split(plate("BrowserWindow"), plate("FormFilling", enter="spends"),
                 "a cursor that *acts*"),
    "a02": split(plate("PermissionKey"), plate("ReceiptBlueprint", enter="world"),
                 "your *world*, once"),
    "a03": split(plate("BrowserWindow"), plate("FormFilling", enter="friction"),
                 "autonomy is the *hole*"),
    "a04": split(plate("HiddenLine"), plate("FormFilling", enter="gift-card"),
                 "steal the *instructions*"),
    "a05": split(plate("HiddenLine"), plate("BrowserWindow", enter="button"),
                 "a sentence sounds like a *click*"),
    "a06": split(plate("HiddenLine"), plate("PermissionKey", enter="trusts"),
                 "a note on the *desk*"),
    "a07": split(plate("FakeInvoice"), plate("FormFilling", enter="pays"),
                 "the logo *changed*"),
    "a08": split(plate("SignatureToBot"), plate("BrowserWindow", enter="sign"),
                 "software can *sign*"),
    "a09": split(plate("ReceiptBlueprint"), plate("HiddenLine", enter="habits"),
                 "convenience handed out the *blueprint*"),
    "a10": split(plate("TermsSheet"), plate("SignatureToBot", enter="holder"),
                 "you are the *holder*"),
    "a11": split(plate("HardCapDial"), plate("FormFilling", enter="maths"),
                 "prompts are *requests*"),
    "a12": split(plate("VirtualCard"), plate("PermissionKey", enter="leaks"),
                 "ten pounds, not ten *thousand*"),
    "a13": split(plate("PhoneApproval"), plate("FormFilling", enter="happens"),
                 "slower is the *point*"),
    "a14": split(plate("HandsAndWallet"), plate("PermissionKey", enter="keys"),
                 "the *errand*, not the keys"),
}

CLIPS = {
    # Real-clip hook goes here once research/licence pass is done (money rule):
    # first clip = strongest, 6-12 s, CC BY / CC0 / US-gov only, sentence-end cuts,
    # logged in LICENCES.md the same turn. Candidates to hunt: FTC consumer-alert
    # material (US gov, public domain), CCC talks on browser agents / prompt injection.
}

ORDER = ["h01", "h02",
         "a01", "a02", "a03",
         "a04", "a05", "a06",
         "a07", "a08",
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
        "title": "THE AGENT WITH YOUR CARD",
        "voice": {"engine": "chatterbox", "name": "default", "speed": 1.0},
        "pace": {"lead": 0.2, "gap": 0.45, "min_beat": 2.4, "to_clip": 0.25,
                 "after_clip": 0.45, "end_pad": 1.5},
        "beats": beats,
    }
    (HERE / "script.json").write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(f"Wrote script.json for {HERE.name} with {len(beats)} beats")
