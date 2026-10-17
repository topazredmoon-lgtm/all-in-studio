"""Generate expanded full-film script (script_full.json) for china-ai-underground.
Builds directly on the approved 1:18 sample (Exhibit A Blackwell, Exhibit B Supermicro hair-dryer label swap, DeepSeek,
Anthropic 24,000 fake accounts distillation attack) and expands to an 8-act investigative blueprint using US Senate PD clips.
"""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent

BEATS = [
    {
        "id": "h01",
        "ex": 0.65,
        "vo": "Washington drew a hard line around the fastest artificial intelligence chips on Earth. | Yet inside a warehouse in Southeast Asia, two men with a heat gun peeled that line right off.",
        "shot": {
            "cuts": [
                {
                    "layout": "split",
                    "cap": "Washington's *hard* chip line",
                    "L": {"v": "RouteMap", "tag": {"t": "BIS export ban", "at": "line"}},
                    "R": {"v": "LabelSwap", "enter": "warehouse", "peelAt": "heat"}
                },
                {
                    "layout": "split",
                    "cap": "peeled with a *heat* gun",
                    "L": {"v": "LabelSwap", "peelAt": "peeled"},
                    "R": {"v": "Cctv", "enter": "two", "tag": {"t": "Exhibit B · SDNY", "at": "peeled"}, "stamp": {"t": "real", "at": "off"}}
                }
            ]
        }
    },
    {
        "id": "a01",
        "ex": 0.62,
        "vo": "Exhibit A is the silicon itself. | Every rack of Nvidia Blackwell processors requires an export license, so shell buyers route servers through Singapore and Malaysia.",
        "shot": {
            "cuts": [
                {
                    "layout": "split",
                    "cap": "*Exhibit A* · the silicon",
                    "L": {"v": "RouteMap"},
                    "R": {"v": "FieldCard", "enter": "Blackwell", "rows": ["B200 rack", "export license", "shell buyer"], "tag": {"t": "$510M routed", "at": "license"}}
                },
                {
                    "layout": "split",
                    "cap": "routed through *Singapore*",
                    "L": {"v": "RouteMap", "routeAt": "Singapore"},
                    "R": {"v": "LabelSwap", "enter": "Malaysia", "stamp": {"t": "real", "at": "Malaysia"}}
                }
            ]
        }
    },
    {
        "id": "a02",
        "ex": 0.66,
        "vo": "Exhibit B is how they pass the warehouse audit. | According to federal prosecutors in New York, workers used a hair dryer to swap real Supermicro serial stickers onto dummy boxes.",
        "shot": {
            "cuts": [
                {
                    "layout": "split",
                    "cap": "*Exhibit B* · warehouse audit",
                    "L": {"v": "Cctv"},
                    "R": {"v": "LabelSwap", "enter": "audit", "peelAt": "audit"}
                },
                {
                    "layout": "split",
                    "cap": "hair dryer *sticker* swap",
                    "L": {"v": "LabelSwap", "peelAt": "swap"},
                    "R": {"v": "Cctv", "enter": "prosecutors", "tag": {"t": "SDNY March 2026", "at": "hair"}, "stamp": {"t": "real", "at": "boxes"}}
                }
            ]
        }
    },
    {
        "id": "a03",
        "ex": 0.64,
        "vo": "When physical chips take too long to move, the underground steals the answers instead. | In February 2026, Anthropic revealed a massive distillation campaign across twenty-four thousand fake accounts.",
        "shot": {
            "cuts": [
                {
                    "layout": "split",
                    "cap": "stealing the *answers* instead",
                    "L": {"v": "AccountWall"},
                    "R": {"v": "Alembic", "enter": "answers"}
                },
                {
                    "layout": "split",
                    "cap": "*24,000* fake accounts",
                    "L": {"v": "Alembic"},
                    "R": {"v": "AccountWall", "enter": "2026", "tag": {"t": "16M exchanges", "at": "distillation"}, "stamp": {"t": "real", "at": "accounts"}}
                }
            ]
        }
    },
    {
        "id": "a04",
        "ex": 0.60,
        "vo": "Sixteen million automated prompts drained a frontier model's reasoning step by step into a cheaper clone. | Now lawmakers in Washington want location beacons built into every graphics card.",
        "shot": {
            "cuts": [
                {
                    "layout": "split",
                    "cap": "*16 million* drained prompts",
                    "L": {"v": "Alembic"},
                    "R": {"v": "Copier", "enter": "drained", "tag": {"t": "step-by-step clone", "at": "clone"}}
                },
                {
                    "layout": "split",
                    "cap": "hardware *location* beacons",
                    "L": {"v": "Compass"},
                    "R": {"v": "RouteMap", "enter": "lawmakers", "tag": {"t": "Chip Security Act", "at": "beacons"}, "stamp": {"t": "real", "at": "card"}}
                }
            ]
        }
    },
    {
        "id": "a05",
        "ex": 0.62,
        "vo": "And that is where the underground war lands on your desk. | Hardware locks built to track smuggled server racks never stay confined to data centers for long.",
        "shot": {
            "cuts": [
                {
                    "layout": "split",
                    "cap": "lands on *your* desk",
                    "L": {"v": "Compass"},
                    "R": {"v": "FieldCard", "enter": "desk", "rows": ["server ping", "geofence lock", "consumer GPU"]}
                },
                {
                    "layout": "split",
                    "cap": "locks never stay *confined*",
                    "L": {"v": "LabelSwap"},
                    "R": {"v": "Compass", "enter": "locks", "tag": {"t": "mandatory telemetry", "at": "centers"}}
                }
            ]
        }
    }
]

out = {"master": "cinema", "beats": BEATS}
(HERE / "script_full_preview.json").write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Wrote {HERE / 'script_full_preview.json'} ({len(BEATS)} beats)")
