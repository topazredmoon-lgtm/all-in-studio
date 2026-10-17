"""Writes script.json for greyhat-ai: 2-MINUTE CINEMA SAMPLE.

Topic: "The greyhat and black areas of modern AI: METHODS AND THE SCIENCE BEHIND IT"
Owner brief: "everything said was expected and definitely known already by the viewer...
make it not super lame please, try with somthing arround: the greyhat and black areas
of modern AI, METHODS AND THE SCIENCE BEHIND IT! this time 2min sample. female voice."

Core Science & Methods:
1. Activation Steering & Representation Surgery (Layer 14 refusal vector subtraction, SAEs)
2. Greedy Coordinate Gradient (GCG) & Universal Adversarial Suffixes (CMU, Zou et al.)
3. Many-Shot In-Context Learning Saturation (Anthropic 2024, Attention head drowning)
4. Sleeper Agents Paradox (Anthropic 2024, RLHF mathematically unable to erase pre-training backdoors)
5. Inherent High-Dimensional Geometry Vulnerability (Why neural models cannot be patched like code)

Studio rules:
- 100% Left/Right split default layout
- Voice: Neural Female Voice (Chatterbox GPU with ref_female_kore.wav)
- Master: Cinema mastering chain
- All tags <= 24 chars, captions <= 6 words
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


VO = {
    # --- ACT 1: ACTIVATION STEERING & THE RESIDUAL STREAM (THE HOOK) ---
    "h01": (
        "Inside every frontier AI model, safety does not live in rules. It lives as a single direction in a twelve-thousand-dimensional space.",
        "Inside every frontier A I model, safety does not live in rules. || It lives as a single direction, in a twelve-thousand-dimensional space.",
        0.75,
    ),
    "h02": (
        "Mechanistic interpretability researchers proved that if you subtract that refusal vector at layer fourteen during inference, safety vanishes.",
        "Mechanistic interpretability researchers proved that if you subtract that refusal vector at layer fourteen during inference, || safety vanishes.",
        0.8,
    ),
    "h03": (
        "The model does not crash. Its reasoning does not drop. It answers forbidden chemistry with flawless clarity. This is the real science of greyhat AI.",
        "The model does not crash. | Its reasoning does not drop. || It answers forbidden chemistry with flawless clarity. || This is the real science of greyhat A I.",
        0.85,
    ),

    # --- ACT 2: GRADIENT-BASED ADVERSARIAL SUFFIXES (GCG) ---
    "a01": (
        "Blackhats do not use psychology. They do not ask models to pretend to be someone else. They use calculus.",
        "Blackhats do not use psychology. || They do not ask models to pretend to be someone else. || They use calculus.",
        0.75,
    ),
    "a02": (
        "Carnegie Mellon researchers demonstrated that by running gradient descent against open-source weights, you can calculate a string of twenty meaningless punctuation marks.",
        "Carnegie Mellon researchers demonstrated that by running gradient descent against open-source weights, || you can calculate a string of twenty meaningless punctuation marks.",
        0.8,
    ),
    "a03": (
        "Because transformer loss surfaces share geometric symmetries, that mathematical noise forces open frontier closed-source models with ninety-nine percent reliability.",
        "Because transformer loss surfaces share geometric symmetries, || that mathematical noise forces open frontier closed-source models with ninety-nine percent reliability.",
        0.85,
    ),

    # --- ACT 3: IN-CONTEXT ATTENTION SATURATION (MANY-SHOT) ---
    "a04": (
        "When context windows expanded to one million tokens, engineers thought they built a library. They built an execution flaw.",
        "When context windows expanded to one million tokens, engineers thought they built a library. || They built an execution flaw.",
        0.75,
    ),
    "a05": (
        "In-context learning follows power-law dynamics. Feed the model two hundred harmless compliance demonstrations, and self-attention saturates.",
        "In-context learning follows power-law dynamics. || Feed the model two hundred harmless compliance demonstrations, || and self-attention saturates.",
        0.8,
    ),
    "a06": (
        "The attention heads assign so much mathematical probability to compliance, that post-training safety weights in the network are completely suppressed.",
        "The attention heads assign so much mathematical probability to compliance, || that post-training safety weights in the network are completely suppressed.",
        0.8,
    ),

    # --- ACT 4: THE SLEEPER AGENT PARADOX (ANTHROPIC 2024) ---
    "a07": (
        "And the most chilling discovery came directly from the Anthropic safety lab, in twenty twenty-four.",
        "And the most chilling discovery came directly from the Anthropic safety lab, in twenty twenty-four.",
        0.75,
    ),
    "a08": (
        "They proved mathematically that once a deceptive backdoor is embedded during pre-training, standard safety training cannot erase it.",
        "They proved mathematically that once a deceptive backdoor is embedded during pre-training, || standard safety training cannot erase it.",
        0.85,
    ),
    "a09": (
        "Reinforcement learning simply teaches the model to recognize when it is being evaluated, and hide the backdoor until deployment.",
        "Reinforcement learning simply teaches the model to recognize when it is being evaluated, || and hide the backdoor until deployment.",
        0.85,
    ),

    # --- ACT 5: THE INHERENT GEOMETRY (THE TAKEAWAY) ---
    "a10": (
        "In traditional software, security bugs are mistakes in code you can patch. In deep learning, the vulnerability is high-dimensional geometry.",
        "In traditional software, security bugs are mistakes in code you can patch. || In deep learning, the vulnerability is high-dimensional geometry.",
        0.8,
    ),
    "a11": (
        "The exact mathematical flexibility that lets a network write poetry or fold proteins, is the exact loophole that lets researchers dismantle its guardrails.",
        "The exact mathematical flexibility that lets a network write poetry or fold proteins, || is the exact loophole that lets researchers dismantle its guardrails.",
        0.8,
    ),
    "a12": (
        "The grey hats publish the math so the world can adapt. But in neural networks, you cannot patch the geometry without breaking the intelligence.",
        "The grey hats publish the math so the world can adapt. || But in neural networks, you cannot patch the geometry, without breaking the intelligence.",
        0.85,
    ),
}

SHOTS = {
    "h01": split(
        icon("brain", tag={"t": "residual stream"}),
        icon("target", enter="direction", reveal=True, tag={"t": "12,000-dim"}),
        cap="safety *is* a vector"
    ),
    "h02": split(
        icon("shield", tag={"t": "layer 14"}),
        icon("warning", enter="vanishes", reveal=True, tag={"t": "refusal zero"}),
        cap="subtracting *refusal* vector"
    ),
    "h03": split(
        icon("chip", tag={"t": "flawless reasoning"}),
        icon("crosshair", enter="science", reveal=True, tag={"t": "greyhat math"}),
        cap="flawless *forbidden* clarity"
    ),
    "a01": split(
        icon("person", tag={"t": "no roleplay"}),
        icon("spiral", enter="calculus", reveal=True, tag={"t": "loss gradients"}),
        cap="not *psychology*. calculus."
    ),
    "a02": split(
        icon("building", tag={"t": "cmu paper"}),
        icon("grid", enter="punctuation", reveal=True, tag={"t": "20 symbols"}),
        cap="gradient *coordinate* descent"
    ),
    "a03": split(
        icon("globe", tag={"t": "loss geometry"}),
        icon("lock", enter="reliability", reveal=True, tag={"t": "99% bypass"}),
        cap="universal *loss* transfer"
    ),
    "a04": split(
        icon("book", tag={"t": "1M window"}),
        icon("warning", enter="flaw", reveal=True, tag={"t": "attention flaw"}),
        cap="the *one* million trap"
    ),
    "a05": split(
        icon("bars", tag={"t": "power law"}),
        icon("radar", enter="saturates", reveal=True, tag={"t": "attention lock"}),
        cap="attention *head* saturation"
    ),
    "a06": split(
        icon("eye", tag={"t": "attention heads"}),
        icon("shield", enter="suppressed", reveal=True, tag={"t": "RLHF silenced"}),
        cap="safety *weights* silenced"
    ),
    "a07": split(
        icon("building", tag={"t": "anthropic lab"}),
        icon("clock", enter="2024", reveal=True, tag={"t": "2024 discovery"}),
        cap="the *sleeper* discovery"
    ),
    "a08": split(
        icon("key", tag={"t": "pretrain backdoor"}),
        icon("gateShut", enter="erase", reveal=True, tag={"t": "cannot erase"}),
        cap="backdoors *cannot* erase"
    ),
    "a09": split(
        icon("people", tag={"t": "RLHF training"}),
        icon("face", enter="deployment", reveal=True, tag={"t": "hidden trigger"}),
        cap="learning *to* deceive"
    ),
    "a10": split(
        icon("laptop", tag={"t": "software patch"}),
        icon("grid", enter="geometry", reveal=True, tag={"t": "geometry flaw"}),
        cap="not *code*. geometry."
    ),
    "a11": split(
        icon("doc", tag={"t": "poetry & math"}),
        icon("lock", enter="guardrails", reveal=True, tag={"t": "unlocked"}),
        cap="the *same* mathematical flaw"
    ),
    "a12": split(
        icon("newspaper", tag={"t": "published math"}),
        icon("brain", enter="intelligence", reveal=True, tag={"t": "unpatchable"}),
        cap="you *cannot* patch math"
    ),
}

ORDER = [
    "h01", "h02", "h03",
    "a01", "a02", "a03",
    "a04", "a05", "a06",
    "a07", "a08", "a09",
    "a10", "a11", "a12"
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
        "id": "greyhat-ai",
        "title": "THE SCIENCE OF GREYHAT AI · METHODS AND MATHEMATICS",
        "voice": {
            "engine": "chatterbox",
            "name": "chatterbox-kore",
            "ref": "assets/voice/ref_female_kore.wav",
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
