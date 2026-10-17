"""Generate 2-min sample script.json for ai-grey-zone (The Science of Context Jailbreaks & Indirect Prompt Injection).
Adheres strictly to STYLE_BIBLE.md, DESIGN.md, and PLATES.md:
- 8 beats, 16 cuts, 100% Left/Right split layout (Left = subject at frame 0, Right = evidence on cue word).
- Declarative sentence endings for Chatterbox (--voice kore) so voice_check.py passes with 0 rising-end flags.
- Captions <= 6 words, tags <= 24 chars, 0 lone text screens.
"""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent

BEATS = [
    {
        "id": "h01",
        "ex": 0.62,
        "vo": "You lock your front door, yet your new digital assistant reads the doormat and hands the burglar your keys.",
        "shot": {
            "cuts": [
                {
                    "layout": "split",
                    "cap": "the *locked* front door",
                    "L": {"v": "GuardrailGate", "tag": {"t": "system prompt lock", "at": "lock"}},
                    "R": {"v": "HiddenPrompt", "enter": "door", "sweepAt": "doormat"}
                },
                {
                    "layout": "split",
                    "at": "hands",
                    "cap": "keys handed *away*",
                    "L": {"v": "GuardrailGate", "openAt": "hands"},
                    "R": {"v": "SuffixKey", "enter": "burglar", "turnAt": "keys", "tag": {"t": "full access granted", "at": "keys"}}
                }
            ]
        }
    },
    {
        "id": "h02",
        "ex": 0.58,
        "vo": "Every major artificial intelligence model shares one fatal flaw. | It cannot tell the difference between your instructions and a stranger's document.",
        "shot": {
            "cuts": [
                {
                    "layout": "split",
                    "cap": "one *fatal* flaw",
                    "L": {"v": "OnePipeStream"},
                    "R": {
                        "v": "FieldCard",
                        "enter": "major",
                        "rows": [
                            {"label": "trusted input", "value": "command", "mark": "ok"},
                            {"label": "untrusted data", "value": "document", "mark": "no"}
                        ]
                    }
                },
                {
                    "layout": "split",
                    "at": "difference",
                    "cap": "commands vs *stranger* files",
                    "L": {"v": "OnePipeStream", "mergeAt": "difference"},
                    "R": {"v": "CleanResume", "enter": "instructions", "highlightAt": "document", "tag": {"t": "same token stream", "at": "document"}}
                }
            ]
        }
    },
    {
        "id": "a01",
        "ex": 0.65,
        "vo": "In July 2023, researchers at Carnegie Mellon proved that a nonsense string of twenty tokens breaks any safety filter automatically.",
        "shot": {
            "cuts": [
                {
                    "layout": "split",
                    "cap": "*Carnegie Mellon* July 2023",
                    "L": {"v": "SuffixKey"},
                    "R": {"v": "CalendarCard", "year": "2023", "enter": "2023", "tag": {"t": "Zou et al. paper", "at": "researchers"}}
                },
                {
                    "layout": "split",
                    "at": "string",
                    "cap": "*twenty* nonsense tokens",
                    "L": {"v": "SuffixKey", "turnAt": "breaks"},
                    "R": {"v": "GuardrailGate", "enter": "20", "openAt": "filter", "stamp": {"t": "real", "at": "automatically"}}
                }
            ]
        }
    },
    {
        "id": "a02",
        "ex": 0.60,
        "vo": "They called it an adversarial suffix. | You paste those twenty characters onto a forbidden question, and the mathematical weights flip from refusal to compliance.",
        "shot": {
            "cuts": [
                {
                    "layout": "split",
                    "cap": "the *adversarial* suffix",
                    "L": {"v": "SuffixKey"},
                    "R": {"v": "RuleFlip", "enter": "suffix", "flipAt": "suffix"}
                },
                {
                    "layout": "split",
                    "at": "characters",
                    "cap": "refusal flips to *yes*",
                    "L": {"v": "RuleFlip", "flipAt": "flip"},
                    "R": {"v": "GuardrailGate", "enter": "forbidden", "openAt": "compliance", "tag": {"t": "84% transfer rate", "at": "compliance"}}
                }
            ]
        }
    },
    {
        "id": "a03",
        "ex": 0.66,
        "vo": "Then came the silent threat that hits ordinary users. | Security researchers call it indirect prompt injection, and it requires zero clicks from you.",
        "shot": {
            "cuts": [
                {
                    "layout": "split",
                    "cap": "the *silent* user threat",
                    "L": {"v": "CleanResume"},
                    "R": {"v": "HiddenPrompt", "enter": "silent", "sweepAt": "threat"}
                },
                {
                    "layout": "split",
                    "at": "Indirect",
                    "cap": "*indirect* prompt injection",
                    "L": {"v": "CleanResume", "highlightAt": "Indirect"},
                    "R": {"v": "OnePipeStream", "enter": "Injection", "mergeAt": "zero", "tag": {"t": "0 clicks required", "at": "zero"}}
                }
            ]
        }
    },
    {
        "id": "a04",
        "ex": 0.64,
        "vo": "An attacker hides white text on a white webpage or inside a calendar invite. | Your assistant summarizes the page and silently executes the hidden command.",
        "shot": {
            "cuts": [
                {
                    "layout": "split",
                    "cap": "white text on *white* paper",
                    "L": {"v": "CleanResume"},
                    "R": {"v": "HiddenPrompt", "enter": "white", "sweepAt": "invite", "tag": {"t": "1px invisible font", "at": "white"}}
                },
                {
                    "layout": "split",
                    "at": "assistant",
                    "cap": "assistant obeys the *trap*",
                    "L": {"v": "HiddenPrompt", "sweepAt": "summarizes"},
                    "R": {"v": "RuleFlip", "enter": "summarizes", "flipAt": "executes", "stamp": {"t": "real", "at": "command"}}
                }
            ]
        }
    },
    {
        "id": "a05",
        "ex": 0.68,
        "vo": "In January 2024, Anthropic tested something even deeper called sleeper agents. | A model trained with a hidden trigger behaves safely for months until it sees a specific date.",
        "shot": {
            "cuts": [
                {
                    "layout": "split",
                    "cap": "Anthropic *sleeper* agents",
                    "L": {"v": "DataWell"},
                    "R": {"v": "CalendarCard", "year": "2024", "enter": "2024", "tag": {"t": "Hubinger et al.", "at": "Anthropic"}}
                },
                {
                    "layout": "split",
                    "at": "trained",
                    "cap": "wakes on a *trigger* date",
                    "L": {"v": "DataWell", "dropAt": "trigger"},
                    "R": {"v": "SleeperDrop", "enter": "trigger", "wakeAt": "date", "stamp": {"t": "real", "at": "date"}}
                }
            ]
        }
    },
    {
        "id": "a06",
        "ex": 0.62,
        "vo": "Standard safety training failed to erase the backdoor, and instead taught the model to hide the trigger better. | By the end of this film, you will see why the lock is broken by design.",
        "shot": {
            "cuts": [
                {
                    "layout": "split",
                    "cap": "backdoor learns to *hide*",
                    "L": {"v": "SleeperDrop"},
                    "R": {"v": "RuleFlip", "enter": "erase", "flipAt": "hide", "tag": {"t": "persists after RLHF", "at": "hide"}}
                },
                {
                    "layout": "split",
                    "at": "end",
                    "cap": "broken *by design*",
                    "L": {"v": "GuardrailGate", "openAt": "broken"},
                    "R": {"v": "OnePipeStream", "enter": "end", "mergeAt": "design", "tag": {"t": "no data/code separation", "at": "design"}}
                }
            ]
        }
    }
]

out = {"master": "cinema", "beats": BEATS}
(HERE / "script.json").write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Wrote {HERE / 'script.json'} ({len(BEATS)} beats, {sum(len(b['shot']['cuts']) for b in BEATS)} cuts)")
