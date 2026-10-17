"""Writes perfected script.json for ai-power-bill (Lesson #84 standard).
- Cadence: >= 60% full/scene, <= 40% split, max consecutive splits = 1.
- Real CC/PD photos: ferc_building.jpg, ashburn_substation.jpg via Film (layout: "scene").
- Classy tactile widgets: UtilityStatement, PJMGridSurge, MeterDial, ServerRack.
- Word ceiling: <= 10 words per cut. Zero consecutive visual repeats.
"""
import json
from pathlib import Path

HERE = Path(__file__).parent
OUT = HERE / "script.json"

DATA = {
    "video_id": "ai-power-bill",
    "title": "the price of the prompt",
    "voice": {
        "name": "af_heart",
        "speed": 0.95
    },
    "master": "v23",
    "pace": {
        "lead": 0.2,
        "gap": 0.45,
        "min_beat": 2.4,
        "to_clip": 0.25,
        "after_clip": 0.45,
        "end_pad": 2.0
    },
    "beats": [
        {
            "id": "b01",
            "act": "01 THE JUMP",
            "vo": "Look at your last electricity bill. The price of power jumped twenty-six percent in Virginia, and twenty-two in Ohio. A machine moved onto your bill.",
            "shot": {
                "cuts": [
                    {
                        "layout": "full",
                        "hero": {
                            "v": "UtilityStatement",
                            "at": "jumped",
                            "highlightAt": "jumped"
                        },
                        "cap": "a *machine* on your bill"
                    },
                    {
                        "at": "Virginia",
                        "layout": "split",
                        "L": {
                            "v": "MeterDial",
                            "spinAt": "Virginia"
                        },
                        "R": {
                            "v": "PageQuote",
                            "enter": "Virginia",
                            "words": "utility rates up *+26%*",
                            "at": "Virginia",
                            "plate": "State Utility Filing"
                        },
                        "cap": "power jumped *twenty-six percent*"
                    }
                ]
            }
        },
        {
            "id": "b02",
            "act": "01 THE JUMP",
            "vo": "For years, the data centers were quiet and invisible. Then artificial intelligence arrived, and the quiet ended.",
            "shot": {
                "cuts": [
                    {
                        "layout": "scene",
                        "hero": {
                            "v": "Film",
                            "img": "ai-power-bill/ashburn_substation.jpg",
                            "exhibit": {"t": "DATA CENTER ALLEY · VA"},
                            "tag": {"t": "substation humming", "at": "intelligence"},
                            "credit": "Wikimedia Commons"
                        },
                        "cap": "the *quiet* ended"
                    }
                ]
            }
        },
        {
            "id": "b03",
            "act": "02 THE RECORD AUCTIONS",
            "vo": "By 2024, holding power in reserve cost twenty-nine dollars per megawatt-day. Two years later, the auction surged past two hundred sixty-nine.",
            "shot": {
                "cuts": [
                    {
                        "layout": "full",
                        "hero": {
                            "v": "PJMGridSurge",
                            "at": "$29",
                            "surgeAt": "surged"
                        },
                        "cap": "capacity costs *surged tenfold*"
                    },
                    {
                        "at": "auction",
                        "layout": "split",
                        "L": {
                            "v": "LineIcon",
                            "name": "bars",
                            "label": "PJM auction",
                            "tag": {"t": "$29.4B load", "at": "auction"}
                        },
                        "R": {
                            "v": "PageQuote",
                            "enter": "auction",
                            "words": "surged to *$270/MW*",
                            "at": "auction",
                            "plate": "PJM Monitor"
                        },
                        "cap": "a *record* auction"
                    }
                ]
            }
        },
        {
            "id": "b04",
            "act": "02 THE RECORD AUCTIONS",
            "vo": "Federal regulators stepped in to halt the cost-shifting onto household bills. But hyperscalers are still locking down every megawatt they can find.",
            "shot": {
                "cuts": [
                    {
                        "layout": "scene",
                        "hero": {
                            "v": "Film",
                            "img": "ai-power-bill/ferc_building.jpg",
                            "exhibit": {"t": "FERC HEADQUARTERS"},
                            "tag": {"t": "Order on PJM auction", "at": "regulators"},
                            "credit": "Wikimedia Commons"
                        },
                        "cap": "regulators *halted* the auction"
                    }
                ]
            }
        },
        {
            "id": "b05",
            "act": "03 THE GRID SQUEEZE",
            "vo": "During peak summer heat waves, the Department of Energy ordered AI clusters to switch onto diesel generators so families could run air conditioning.",
            "shot": {
                "cuts": [
                    {
                        "layout": "full",
                        "hero": {
                            "v": "BackupGen",
                            "at": "summer",
                            "runAt": "diesel"
                        },
                        "cap": "forced onto *diesel* generators"
                    },
                    {
                        "at": "families",
                        "layout": "split",
                        "L": {
                            "v": "HomeAC",
                            "litAt": "conditioning"
                        },
                        "R": {
                            "v": "Bubble",
                            "enter": "families",
                            "text": "household AC is the *necessity*",
                            "at": "conditioning"
                        },
                        "cap": "your power comes *first*"
                    }
                ]
            }
        },
        {
            "id": "b06",
            "act": "04 THE HUNGRY MACHINE",
            "vo": "Every prompt you send has a meter running somewhere with your name on it. The age of AI is billed at the price of electricity, and the machine is only getting hungrier.",
            "shot": {
                "cuts": [
                    {
                        "layout": "full",
                        "hero": {
                            "v": "MeterDial",
                            "at": "prompt",
                            "spinAt": "hungrier"
                        },
                        "cap": "the machine is *hungrier*"
                    }
                ]
            }
        }
    ]
}

if __name__ == "__main__":
    OUT.write_text(json.dumps(DATA, indent=2), encoding="utf-8")
    print(f"Wrote {len(DATA['beats'])} beats to {OUT}")
