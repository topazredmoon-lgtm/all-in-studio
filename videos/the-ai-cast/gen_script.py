"""Generate script.json for the-ai-cast.
Premium captchas_full_v2 standard (v23 bare background + ds/kit.tsx + Kokoro af_heart 0.95).
End of bi-screen permanent format: 11 full/scene cuts (78.6%), 3 split cuts (21.4%), max consecutive splits = 1.
Authentic WHO & WHAT receipts with real Wikimedia Commons photos in engine/public/the-ai-cast/.
All cue words mapped to exact Whisper outputs ($25, $100, $21, 24).
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
OUT = Path(__file__).resolve().parent / "script.json"

DATA = {
    "video_id": "the-ai-cast",
    "title": "the dark reality of the ai cast",
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
            "id": "c01",
            "act": "01 THE FRAMING OF ERIC EISWERT",
            "vo": "In January 2024, high school principal Eric Eiswert was suspended in Maryland after a leaked phone recording caught him making racist threats. Police later proved he never spoke a single word of it.",
            "shot": {
                "cuts": [
                    {
                        "layout": "scene",
                        "hero": {
                            "v": "Film",
                            "img": "the-ai-cast/courthouse.jpg",
                            "exhibit": {"t": "BALTIMORE COUNTY · CASE FILE"},
                            "tag": {"t": "Maryland Circuit Court", "at": "january"},
                            "credit": "Queen of Hearts / Wikimedia Commons"
                        },
                        "cap": "principal *Eric Eiswert* framed"
                    },
                    {
                        "at": "recording",
                        "layout": "full",
                        "hero": {
                            "v": "PhoneCall",
                            "name": "leaked audio",
                            "cloneAt": "never",
                            "badge": "100% AI clone",
                            "tag": {"t": "100% AI voice clone", "at": "never"}
                        },
                        "cap": "he *never* spoke a word"
                    }
                ]
            }
        },
        {
            "id": "c02",
            "act": "01 THE FRAMING OF ERIC EISWERT",
            "vo": "The school's athletic director, Dazhon Darien, had used artificial intelligence to clone the principal's voice in seconds. And police arrested him at the Baltimore airport.",
            "shot": {
                "cuts": [
                    {
                        "layout": "split",
                        "reveal": True,
                        "L": {
                            "v": "Polaroid",
                            "img": "the-ai-cast/school_police.jpg",
                            "name": "dazhon darien · arrested",
                            "notes": [{"t": "baltimore county pd", "at": "police"}]
                        },
                        "R": {
                            "v": "PageQuote",
                            "reveal": True,
                            "enter": "clone",
                            "words": "cloned the principal's *voice* to retaliate",
                            "at": "clone",
                            "plate": "baltimore county indictment · 2024"
                        },
                        "cap": "cloned his boss in *seconds*"
                    },
                    {
                        "at": "police",
                        "layout": "full",
                        "hero": {
                            "v": "Blocked",
                            "at": "police",
                            "noAt": "airport",
                            "tag": {"t": "charged with AI framing", "at": "airport"}
                        },
                        "cap": "arrested at the *airport*"
                    }
                ]
            }
        },
        {
            "id": "c03",
            "act": "02 THE NEW AI CAST",
            "vo": "Artificial intelligence did not just build helpful chatbots. It quietly built a new cast of digital actors. And by the end of this video, you will know whether you are in the cast, or the mark.",
            "shot": {
                "cuts": [
                    {
                        "layout": "full",
                        "hero": {
                            "v": "IconRow",
                            "name": "robot",
                            "n": 12,
                            "cols": 4,
                            "morph": True,
                            "tag": {"t": "3 new criminal roles", "at": "cast"}
                        },
                        "cap": "a new *cast* of characters"
                    },
                    {
                        "at": "whether",
                        "layout": "split",
                        "L": {
                            "v": "LineIcon",
                            "name": "person",
                            "mark": "?",
                            "markAt": "mark",
                            "label": "the viewer"
                        },
                        "R": {
                            "v": "Bubble",
                            "enter": "cast#2",
                            "text": "in the *cast* — or the mark?",
                            "at": "mark"
                        },
                        "cap": "in the cast, or the *mark*?"
                    }
                ]
            }
        },
        {
            "id": "c04",
            "act": "03 THE FORGER",
            "vo": "First in the cast is The Forger. Normally, detectives check your phone's GPS pings and typing rhythm to verify where you were. Now an AI agent stays home on your laptop and fakes your exact digital life while you are miles away.",
            "shot": {
                "cuts": [
                    {
                        "layout": "full",
                        "hero": {
                            "v": "MousePath",
                            "humanAt": "typing",
                            "botAt": "verify",
                            "tag": {"t": "typing & cursor trail", "at": "typing"}
                        },
                        "cap": "how police check your *alibi*"
                    },
                    {
                        "at": "agent",
                        "layout": "full",
                        "hero": {
                            "v": "Flow",
                            "nodes": [
                                {"icon": "robot", "name": "robot", "label": "ai twin"},
                                {"icon": "laptop", "name": "laptop", "label": "your typing"},
                                {"icon": "pin", "name": "pin", "label": "home gps"},
                                {"icon": "shield", "name": "shield", "label": "clean alibi"}
                            ],
                            "at": ["agent", "laptop", "fakes", "miles"]
                        },
                        "cap": "an *AI* twin fakes your life"
                    }
                ]
            }
        },
        {
            "id": "c05",
            "act": "04 THE $25M CLONER",
            "vo": "Second is The Cloner. In February 2024, a finance worker at engineering firm Arup in Hong Kong joined a video call with his chief financial officer and three colleagues. He wired 25 million dollars before realizing every single person on screen was an AI clone.",
            "shot": {
                "cuts": [
                    {
                        "layout": "scene",
                        "hero": {
                            "v": "Film",
                            "img": "the-ai-cast/hongkong_arup.jpg",
                            "exhibit": {"t": "HONG KONG · FEB 2024"},
                            "tag": {"t": "Arup Headquarters · HK", "at": "february"},
                            "credit": "Diliff / Wikimedia Commons"
                        },
                        "cap": "engineering firm *Arup* · HK"
                    },
                    {
                        "at": "video",
                        "layout": "full",
                        "hero": {
                            "v": "CallGrid",
                            "fakeAt": "colleagues",
                            "fakes": [0, 1, 2, 3],
                            "tag": {"t": "$25.6M wired · all fake", "at": "$25"}
                        },
                        "cap": "*every* colleague was fake"
                    }
                ]
            }
        },
        {
            "id": "c06",
            "act": "05 THE EXTRACTOR",
            "vo": "Third is The Extractor. In February 2026, Anthropic caught attackers running 24,000 fake accounts to fire 16 million questions at Claude, draining a 100 million dollar brain into a cheap copy.",
            "shot": {
                "cuts": [
                    {
                        "layout": "full",
                        "hero": {
                            "v": "AccountWall",
                            "at": "24",
                            "cols": 16,
                            "rows": 7,
                            "tag": {"t": "24,000 fake accounts", "at": "24"}
                        },
                        "cap": "*24,000* accounts drained it"
                    },
                    {
                        "at": "$100",
                        "layout": "full",
                        "hero": {
                            "v": "Bars",
                            "bars": [
                                {"label": "TRAINING", "v": 100, "tag": "$100M"},
                                {"label": "API CLONE", "v": 5, "tag": "FRACTION"}
                            ],
                            "at": ["$100", "cheap"]
                        },
                        "cap": "a *$100M* brain cloned"
                    }
                ]
            }
        },
        {
            "id": "c07",
            "act": "06 THE FLUENCY LINE",
            "vo": "Cybercrime losses hit 21 billion dollars last year because courts and banks can no longer trust a voice, a video call, or a text message. One dividing line now splits the world in two: AI fluency.",
            "shot": {
                "cuts": [
                    {
                        "layout": "full",
                        "hero": {
                            "v": "Score",
                            "v1": 0.85,
                            "v2": 0.12,
                            "at": "losses",
                            "dropAt": "trust",
                            "tag": {"t": "$21B lost · FBI report", "at": "$21"}
                        },
                        "cap": "*$21* billion lost last year"
                    },
                    {
                        "at": "dividing",
                        "layout": "split",
                        "reveal": True,
                        "L": {
                            "v": "PhoneChat",
                            "mode": "gate",
                            "ask": "urgent wire transfer",
                            "askAt": "splits",
                            "replyAt": "fluency",
                            "tag": {"t": "verify out of band", "at": "fluency"}
                        },
                        "R": {
                            "v": "PageQuote",
                            "reveal": True,
                            "enter": "fluency",
                            "words": "verify out of band — *never* trust the screen",
                            "at": "fluency",
                            "plate": "fbi & doj advisory · 2026"
                        },
                        "cap": "one dividing line: *fluency*"
                    }
                ]
            }
        }
    ]
}

OUT.write_text(json.dumps(DATA, indent=2), encoding="utf-8")
print(f"Generated {OUT} ({len(DATA['beats'])} beats, {sum(len(b['shot']['cuts']) for b in DATA['beats'])} cuts)")
