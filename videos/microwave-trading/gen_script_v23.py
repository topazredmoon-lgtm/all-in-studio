"""Generates canonical v23 + Lesson #84 script for microwave-trading.
- >= 60% full/scene hero visuals, <= 40% split, max 1 consecutive split.
- Real CC/PD photos via Film (layout: "scene"): nyse_facade.jpg, microwave_tower.jpg.
- Voice: Kokoro af_heart at 0.95 speed, master v23.
- Word ceiling <= 10 words per cut. Zero banned plates.
"""
import json
from pathlib import Path

HERE = Path(__file__).parent
OUT = HERE / "script.json"

DATA = {
    "video_id": "microwave-trading",
    "title": "THE SPEED OF GREED · The 3-Nanosecond War",
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
            "act": "01 THE SPEED PENALTY",
            "vo": "Inside standard glass fiber, light does not travel at the speed of light. It slows down by thirty-one percent. That single physical penalty started a thirty-billion-dollar war.",
            "shot": {
                "cuts": [
                    {
                        "layout": "full",
                        "hero": {
                            "v": "Bars",
                            "bars": [
                                {"v": 100, "label": "vacuum", "tag": "100%", "c": "teal"},
                                {"v": 99, "label": "air", "tag": "99.9%", "c": "teal"},
                                {"v": 69, "label": "glass fiber", "tag": "-31% in glass", "c": "red", "at": "slows"}
                            ]
                        },
                        "cap": "light *slows down* in glass"
                    },
                    {
                        "at": "penalty",
                        "layout": "split",
                        "L": {
                            "v": "Score",
                            "at": "penalty",
                            "dropAt": "slows"
                        },
                        "R": {
                            "v": "PageQuote",
                            "enter": "penalty",
                            "words": "light *slows by 31%* in glass",
                            "at": "penalty",
                            "plate": "Optical Physics"
                        },
                        "cap": "a thirty *billion dollar* war"
                    }
                ]
            }
        },
        {
            "id": "b02",
            "act": "02 THE MOUNTAIN TUNNEL",
            "vo": "Spread Networks spent three hundred million dollars tunneling straight through the mountains, laying glass from Chicago straight to New Jersey.",
            "shot": {
                "cuts": [
                    {
                        "layout": "scene",
                        "hero": {
                            "v": "Film",
                            "img": "microwave-trading/nyse_facade.jpg",
                            "exhibit": {"t": "NEW YORK STOCK EXCHANGE"},
                            "tag": {"t": "Spread Networks tunnel", "at": "mountains"},
                            "credit": "Wikimedia Commons"
                        },
                        "cap": "three *hundred million* dollars"
                    },
                    {
                        "at": "Chicago",
                        "layout": "split",
                        "L": {
                            "v": "LineIcon",
                            "name": "map",
                            "label": "800-mile bore"
                        },
                        "R": {
                            "v": "PageQuote",
                            "enter": "Chicago",
                            "words": "shaved *three milliseconds*",
                            "at": "Jersey",
                            "plate": "Trade Latency"
                        },
                        "cap": "chicago to *new jersey*"
                    }
                ]
            }
        },
        {
            "id": "b03",
            "act": "03 THE INVISIBLE AIR",
            "vo": "That tunnel shaved three milliseconds off the route. Until someone realized: microwave signals travel through air at ninety-nine percent the speed of light.",
            "shot": {
                "cuts": [
                    {
                        "layout": "scene",
                        "hero": {
                            "v": "Film",
                            "img": "microwave-trading/microwave_tower.jpg",
                            "exhibit": {"t": "MICROWAVE RELAY TOWER"},
                            "tag": {"t": "99.9% speed of light", "at": "signals"},
                            "credit": "Wikimedia Commons"
                        },
                        "cap": "signals *through thin air*"
                    }
                ]
            }
        },
        {
            "id": "b04",
            "act": "04 THE TOWER NETWORK",
            "vo": "Almost overnight, the cable was obsolete. Trading firms began buying up radar towers and farm fields: fifteen steel towers in line-of-sight.",
            "shot": {
                "cuts": [
                    {
                        "layout": "full",
                        "hero": {
                            "v": "MeterDial",
                            "at": "overnight",
                            "spinAt": "obsolete"
                        },
                        "cap": "the *cable was obsolete*"
                    },
                    {
                        "at": "fields",
                        "layout": "split",
                        "L": {
                            "v": "LineIcon",
                            "name": "radar",
                            "label": "line-of-sight"
                        },
                        "R": {
                            "v": "PageQuote",
                            "enter": "fields",
                            "words": "fifteen towers *in line-of-sight*",
                            "at": "towers",
                            "plate": "FCC License"
                        },
                        "cap": "towers across *farmland*"
                    }
                ]
            }
        },
        {
            "id": "b05",
            "act": "05 THE LATENCY DROP",
            "vo": "The air network dropped the round trip down to eight milliseconds. The three-hundred-million-dollar fiber cable had lost the war.",
            "shot": {
                "cuts": [
                    {
                        "layout": "full",
                        "hero": {
                            "v": "Bars",
                            "bars": [
                                {"v": 16.5, "label": "fiber cable", "tag": "16.5 ms", "c": "red"},
                                {"v": 8.2, "label": "microwave air", "tag": "8.2 ms", "c": "teal", "at": "8"}
                            ]
                        },
                        "cap": "latency cut to *eight milliseconds*"
                    }
                ]
            }
        },
        {
            "id": "b06",
            "act": "06 THE NANOSECOND FRONT",
            "vo": "Today, the battle is fought over single nanoseconds. Stripping plastic off server cables, burning custom chips, fighting for three billionths of a second.",
            "shot": {
                "cuts": [
                    {
                        "layout": "full",
                        "hero": {
                            "v": "Score",
                            "at": "battle",
                            "dropAt": "nanoseconds"
                        },
                        "cap": "the *three nanosecond* war"
                    },
                    {
                        "at": "chips",
                        "layout": "split",
                        "L": {
                            "v": "LineIcon",
                            "name": "chip",
                            "label": "FPGA kernel"
                        },
                        "R": {
                            "v": "PageQuote",
                            "enter": "chips",
                            "words": "three *nanoseconds* win the trade",
                            "at": "second",
                            "plate": "Exchange Order"
                        },
                        "cap": "front-running *by nanoseconds*"
                    }
                ]
            }
        },
        {
            "id": "b07",
            "act": "07 THE SPEED OF GREED",
            "vo": "The speed of Wall Street is constrained only by the physical velocity of light.",
            "shot": {
                "cuts": [
                    {
                        "layout": "scene",
                        "hero": {
                            "v": "Film",
                            "img": "microwave-trading/nyse_facade.jpg",
                            "exhibit": {"t": "WALL STREET MATCHING ENGINE"},
                            "tag": {"t": "speed of light in vacuum", "at": "speed"},
                            "credit": "Wikimedia Commons"
                        },
                        "cap": "the *speed of greed*"
                    }
                ]
            }
        }
    ]
}

if __name__ == "__main__":
    OUT.write_text(json.dumps(DATA, indent=2), encoding="utf-8")
    print(f"Wrote {len(DATA['beats'])} beats to {OUT}")
