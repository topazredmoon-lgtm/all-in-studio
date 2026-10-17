"""Writes script.json for surveillance-pricing (Cinema Explainer Sample).

Topic: SURVEILLANCE PRICING (The Death of the Price Tag).
Why chosen: Brand new, never done before in All-in or legacy projects.
Passes the "So What?" test with maximum stakes: touches every viewer's daily wallet.

Studio Guardrails:
- 100% Left/Right split layout (side-by-side evidence rhythm)
- Left = Subject on screen from frame 0
- Right = Concrete evidence landing on cue word (enter)
- "Say the line, point at the thing it names"
- Voice: Chatterbox cinema voice with " | " and " || " breaks for dramatic weight
- Mastering: "master": "cinema" in script.json
- Fully compliant with tools/lint_text.py (no text-led shots, tags <= 24 chars, captions <= 6 words)
"""
import json
from pathlib import Path

HERE = Path(__file__).parent


def split(L, R, cap=None, at=None, **kw):
    d = {"layout": "split", "L": L, "R": R, **kw}
    if cap:
        d["cap"] = cap
    if at is not None:
        d["at"] = at
    return d


def icon(name, **kw):
    return {"v": "LineIcon", "surface": "bare", "name": name, **kw}


def row(name, n, **kw):
    return {"v": "IconRow", "surface": "bare", "name": name, "n": n, **kw}


VO = {
    # --- ACT 1: THE BATTERY TRAP (COLD OPEN) ---
    "h01": (
        "Two phones sit on the exact same table. Same app. Same flight to Chicago. On the left phone, the ticket costs one hundred eighty dollars.",
        "Two phones sit on the exact same table. || Same app. | Same flight to Chicago. || On the left phone, the ticket costs one hundred eighty dollars.",
        0.75,
    ),
    "h02": (
        "On the right phone, the exact same seat costs two hundred forty-five dollars. No promo codes. No special seating.",
        "On the right phone, the exact same seat costs two hundred forty-five dollars. || No promo codes. | No special seating.",
        0.8,
    ),
    "h03": (
        "The only difference between the two travelers? The person on the right has six percent battery.",
        "The only difference between the two travelers? || The person on the right, has six percent battery.",
        0.85,
    ),

    # --- ACT 2: THE DEATH OF THE PRICE TAG ---
    "a01": (
        "For one hundred sixty-five years, commerce had one sacred rule. The price tag on the shelf is the price everyone pays.",
        "For one hundred sixty-five years, commerce had one sacred rule. || The price tag on the shelf, is the price everyone pays.",
        0.7,
    ),
    "a02": (
        "In 1861, John Wanamaker invented the price tag so clerks couldn't haggle based on your clothes or your accent. Rich or poor, the number was identical.",
        "In eighteen sixty-one, John Wanamaker invented the price tag so clerks couldn't haggle based on your clothes, or your accent. || Rich or poor, the number was identical.",
        0.75,
    ),
    "a03": (
        "Today, that century-old truce is officially dead. And it was not killed by inflation.",
        "Today, that century-old truce is officially dead. | And it was not killed by inflation.",
        0.8,
    ),

    # --- ACT 3: THE SECRET CARTEL (THE FTC INQUIRY) ---
    "a04": (
        "In July 2024, federal regulators finally cracked open the door. The Federal Trade Commission issued formal orders against eight corporate giants.",
        "In July 2024, federal regulators finally cracked open the door. || The Federal Trade Commission issued formal orders against eight corporate giants.",
        0.75,
    ),
    "a05": (
        "Mastercard. Revionics. Bloomreach. Task Software. McKinsey. Companies you have never heard of, operating in the shadows of every store you enter.",
        "Mastercard. | Revionics. | Bloomreach. | Task Software. || McKinsey. || Companies you have never heard of, operating in the shadows of every store you enter.",
        0.8,
    ),
    "a06": (
        "The government gave the practice an official name: Surveillance Pricing.",
        "The government gave the practice an official name: || Surveillance Pricing.",
        0.85,
    ),

    # --- ACT 4: THE DESPERATION METRIC ---
    "a07": (
        "Economists call it first-degree price discrimination. In plain English, it means charging you the absolute maximum penny you will endure before walking away.",
        "Economists call it first-degree price discrimination. || In plain English, it means charging you the absolute maximum penny you will endure, before walking away.",
        0.8,
    ),
    "a08": (
        "An algorithm monitors your credit history, your location, the model of phone in your hand, and how fast your thumb is scrolling.",
        "An algorithm monitors your credit history, your location, the model of phone in your hand, and how fast your thumb is scrolling.",
        0.75,
    ),
    "a09": (
        "If your battery is dying at eleven at night in the rain, the machine knows you have zero bargaining power. So the price spikes.",
        "If your battery is dying at eleven at night in the rain, the machine knows you have zero bargaining power. || So the price spikes.",
        0.85,
    ),

    # --- ACT 5: THE PHYSICAL WORLD INFECTION ---
    "a10": (
        "And this is no longer trapped inside your smartphone. It is invading the physical streets.",
        "And this is no longer trapped inside your smartphone. || It is invading the physical streets.",
        0.75,
    ),
    "a11": (
        "Fast food chains have begun installing digital drive-thru menu boards. Cameras scan incoming license plates and customer queues.",
        "Fast food chains have begun installing digital drive-thru menu boards. || Cameras scan incoming license plates and customer queues.",
        0.75,
    ),
    "a12": (
        "A burger at noon on a rainy Tuesday can quietly cost two dollars more than the exact same burger on Wednesday afternoon.",
        "A burger at noon on a rainy Tuesday can quietly cost two dollars more, than the exact same burger on Wednesday afternoon.",
        0.8,
    ),

    # --- ACT 6: THE UNSPOKEN TAX & THE CALLBACK ---
    "a13": (
        "They took an ancient social contract, designed to protect ordinary citizens, and replaced it with a private, algorithmic tax on your vulnerability.",
        "They took an ancient social contract, designed to protect ordinary citizens, and replaced it with a private, algorithmic tax on your vulnerability.",
        0.8,
    ),
    "a14": (
        "The next time you tap buy on your phone, remember those two screens. You aren't paying what the item is worth. You are paying what the machine knows you can afford to lose.",
        "The next time you tap buy on your phone, remember those two screens. || You aren't paying what the item is worth. || You are paying what the machine knows you can afford to lose.",
        0.85,
    ),
}

SHOTS = {
    "h01": split(
        icon("laptop", tag={"t": "device 1"}),
        icon("coin", enter="$180", reveal=True, tag={"t": "$180"}),
        cap="two *phones*. one seat."
    ),
    "h02": split(
        icon("laptop", tag={"t": "device 2"}),
        icon("cash", enter="$245", reveal=True, tag={"t": "$245"}),
        cap="sixty-five *dollar* gap"
    ),
    "h03": split(
        icon("power", tag={"t": "6% battery"}),
        icon("warning", enter="%", reveal=True, tag={"t": "urgent"}),
        cap="six *percent* battery"
    ),
    "a01": split(
        icon("doc", tag={"t": "1861 tag"}),
        icon("building", enter="everyone", reveal=True, tag={"t": "one price"}),
        cap="one *price* for all"
    ),
    "a02": split(
        icon("idcard", tag={"t": "wanamaker"}),
        icon("people", enter="identical", reveal=True, tag={"t": "equal tag"}),
        cap="the *equal* price tag"
    ),
    "a03": split(
        icon("bars", tag={"t": "truce dead"}),
        icon("fire", enter="inflation", reveal=True, tag={"t": "the shift"}),
        cap="the *truce* is dead"
    ),
    "a04": split(
        icon("shield", tag={"t": "FTC order"}),
        icon("building", enter="eight", reveal=True, tag={"t": "8 giants"}),
        cap="federal *orders* issued"
    ),
    "a05": split(
        icon("grid", tag={"t": "the cartel"}),
        icon("eye", enter="shadows", reveal=True, tag={"t": "monitoring"}),
        cap="shadow *pricing* engines"
    ),
    "a06": split(
        icon("target", tag={"t": "surveillance"}),
        icon("coin", enter="Pricing", reveal=True, tag={"t": "dynamic cost"}),
        cap="*surveillance* pricing"
    ),
    "a07": split(
        icon("brain", tag={"t": "algorithm"}),
        icon("cash", enter="penny", reveal=True, tag={"t": "max extract"}),
        cap="maximum *penny* extraction"
    ),
    "a08": split(
        icon("fingerprint", tag={"t": "telemetry"}),
        icon("radar", enter="scrolling", reveal=True, tag={"t": "live scan"}),
        cap="live *behavior* tracking"
    ),
    "a09": split(
        icon("clock", tag={"t": "11 PM rain"}),
        icon("crosshair", enter="spikes", reveal=True, tag={"t": "+45% surge"}),
        cap="zero *bargaining* power"
    ),
    "a10": split(
        icon("map", tag={"t": "high street"}),
        icon("car", enter="streets", reveal=True, tag={"t": "drive-thru"}),
        cap="invading *physical* streets"
    ),
    "a11": split(
        icon("camera", tag={"t": "plate scanner"}),
        icon("monitor", enter="queues", reveal=True, tag={"t": "dynamic board"}),
        cap="digital *menu* boards"
    ),
    "a12": split(
        icon("box", tag={"t": "burger"}),
        icon("clock", enter="afternoon", reveal=True, tag={"t": "+$2.00 surge"}),
        cap="quiet *two* dollar surge"
    ),
    "a13": split(
        icon("contract", tag={"t": "broken pact"}),
        icon("lock", enter="vulnerability", reveal=True, tag={"t": "private tax"}),
        cap="tax on *vulnerability*"
    ),
    "a14": split(
        icon("laptop", tag={"t": "two screens"}),
        icon("target", enter="afford", reveal=True, tag={"t": "scored"}),
        cap="what *you* can lose"
    ),
}

ORDER = [
    "h01", "h02", "h03",
    "a01", "a02", "a03",
    "a04", "a05", "a06",
    "a07", "a08", "a09",
    "a10", "a11", "a12",
    "a13", "a14"
]

if __name__ == "__main__":
    beats = []
    for bid in ORDER:
        vo, say, ex = VO[bid]
        b = {
            "id": bid,
            "vo": vo,
            "say": say,
            "ex": ex,
            "shot": SHOTS.get(bid, {})
        }
        beats.append(b)

    data = {
        "id": "surveillance-pricing",
        "title": "THE DEATH OF THE PRICE TAG · SURVEILLANCE PRICING",
        "voice": {
            "engine": "chatterbox",
            "name": "chatterbox-fenrir",
            "ref": "assets/voice/narrator_ref.wav",
            "cfg": 0.35
        },
        "master": "cinema",
        "pace": {
            "lead": 0.15,
            "gap": 0.35,
            "min_beat": 2.2,
            "to_clip": 0.2,
            "after_clip": 0.3,
            "end_pad": 1.6
        },
        "beats": beats
    }

    out_file = HERE / "script.json"
    out_file.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    words = sum(len(b["vo"].split()) for b in beats)
    print(f"Wrote script.json for {HERE.name}: {len(beats)} beats, {words} words narrated.")
