# AI'S GREY ZONE — 6-MINUTE CUT
## Jailbreaks, hidden instructions and planted triggers — the science behind modern AI attacks

**Slug:** `ai-grey-zone` · **Runtime:** 6:00 · **Voice:** Chatterbox (`tools/tts_cb.py`) — Kokoro is banned for this topic (LEARNINGS 48/77: owner called it "robot blabla annoying")
**Narration:** ~945 words at 2.86 w/s + 0.65 s per beat
**Master script:** `SCRIPT.md` (8–9 min, 1,350 words) is the long-form spine. This file is the tight cut for owner review.
**Sources:** unchanged from `SOURCES.md` — every `[S#]` below is already fact-checked there. No new claims added in the cut.
**Status:** script only. Clips are sourcing targets, not cleared assets. Sample-first per PLAYBOOK.

---

### EDITORIAL PROMISE

Three ways AI gets bent — steered by the conversation, instructed by material it reads, and carrying a planted trigger from training. What the research shows, what it does not, and why *permission* is the real line, not a hat colour.

### PRODUCTION RULES FOR THIS TOPIC (newest owner notes)

- **Left/right split ≥ 65% of shots.** Every beat below names L (subject, on screen from frame 0) and R (evidence, lands on the cue word). A single centred plate on an empty board is banned.
- **Bespoke visuals only.** New file `engine/src/visuals/ai-grey-zone.tsx`. No reuse of model-collapse woodcut plates, no sailing ships, no busts.
- **No music bed.** One-shot SFX only on visible clicks.
- **Lines end on a plain declarative word.** No trailing qualifier clause (LEARNINGS 76 — those produce the unnatural rising end).
- **Acronyms:** "OWASP" and "arXiv" go in the **tts lexicon**, never spoken as spaced letters.
- Non-operational throughout: no jailbreak strings, no payloads, no trigger recipes.

---

## SCRIPT

### 1. The AI attacking AI · 0:00–0:45

**[REAL-VOICE HOOK, 0:00–0:12 — Mike Perry, "A Quick Stop at the HostileShop", 39C3, 28 Dec 2025. Page states CC BY 4.0; verify exact sentence + in/out before cutting.]**
**[VISUAL: split. L = the speaker on stage, from frame 0. R = a laptop wired to a second laptop, cursor moving on its own.]**

**NARRATOR:** A security researcher used artificial intelligence to build attacks against other artificial intelligence. [S1]
He says it generated prompt injections for a winning entry in a red-team contest. [S1]
That is one man's report, not an audited result.
But it points at something real: the thing testing the walls is now another machine.

**[CUT]**

**[VISUAL: split. L = his face. R = the contest leaderboard, one row highlighted.]**

**NARRATOR:** So here is the real question.
When does a serious test stop being a test?

By the end you will know three ways a model gets bent, and one question that tells them apart.

---

### 2. The colour is not the permission · 0:45–1:30

**[VISUAL: split. L = a padlocked test box, closed. R = a real inbox, open, personal messages visible.]**

**NARRATOR:** Grey hat. Black hat. Everyone uses the words, almost nobody defines them.
Here is what actually separates them, and it is not the label.

**[CUT]**

**[VISUAL: split. L = a signed permission form. R = a stopwatch with no time limit.]**

**NARRATOR:** A real test has three things: written permission, one named target, and a safe way to report what broke.
Remove any one of those and the same knowledge becomes the other thing.
**[CUT]**
The model does not check your hat. It reads what you give it.

---

### 3. How it reads at all · 1:30–2:05

**[VISUAL: split. L = a sentence breaking into small tokens. R = a context window filling around a model box.]**

**NARRATOR:** A quick picture of the machinery.
A model reads text in pieces called tokens, and repeatedly guesses what comes next, using everything around it. [S6]
So when a pile of examples appears inside the conversation, the model adapts to them. [S6]
Researchers call that in-context learning.
Same ability. That is the first way in.

---

### 4. Method one: bend the conversation · 2:05–3:00

**[VISUAL: split. L = a chat window filling with example cards. R = one card marked "pattern continues". No payload text is ever rendered.]**

**NARRATOR:** A jailbreak tries to steer a model off its own rules using the conversation itself.
In twenty twenty-four, Anthropic researchers published a long-context attack called many-shot jailbreaking. [S2]
The trick is volume. You surround the request with many examples of an assistant behaving badly.
**[CUT]**

**[VISUAL: split. L = an example-count ruler climbing. R = a success-rate bar rising with it.]**

**NARRATOR:** The finding that mattered was not a secret phrase.
The attack got stronger as the examples grew, on a curve much like ordinary learning from examples. [S2]
The machine learned to continue the pattern it was shown.

**[CUT]**

**[VISUAL: split. L = a filter layer dropping cards. R = 61 falling to 2.]**

**NARRATOR:** And the same team tested the fix. One classifier took a measured attack success rate from sixty-one percent to two. [S2]
That is one test case, not a guarantee.
But it tells you a refusal is a good guardrail, not a wall.

---

### 5. Method two: instructions that are not yours · 3:00–4:05

**[VISUAL: split. L = a résumé being summarised by an assistant. R = faint extra lines inside the document that the human never sees. No payload text rendered.]**

**NARRATOR:** Now the worse one.
You ask an assistant to summarise a document. You never typed an instruction. The document did.
The security group OWASP uses a poisoned résumé as the textbook example. [S3]

**[CUT]**

**[VISUAL: split. L = three boxes merging into one stream — your request, system rules, fetched page. R = no divider between them.]**

**NARRATOR:** Why does it work? Because a model does not inherently separate instructions from data. [S3]
The web page, the file, the email — they all arrive in the same window, and the model treats all of it as conversation.
Your document is talking to the model. Not to you.

**[CUT]**

**[VISUAL: split. L = a crawl map of web hosts. R = a counter ticking instances found.]**

**NARRATOR:** In twenty twenty-six, researchers crawled one point two billion web addresses. They reported fifteen thousand validated instances, and about seventy percent sat in text no human reader would ever see. [S4]
**[CUT]**
That is instances found, not systems breached. Read that distinction carefully.
In controlled tests across thirteen models, compliance stayed low — but it was not zero. [S4]

---

### 6. Method three: the planted trigger · 4:05–5:05

**[VISUAL: split. L = two identical-looking code requests. R = the same code taking two different paths. Plate: "lab demonstration".]**

**NARRATOR:** The third method never needs a live prompt.
Can a model learn a hidden behaviour during training, and show it only on a condition?
Researchers call the result a backdoor.

**[CUT]**

**[VISUAL: split. L = a calendar flipping. R = one branch writing safe code, the other writing exploitable code.]**

**NARRATOR:** In twenty twenty-four, Anthropic built proof-of-concept models that wrote secure code when the prompt said one year, and exploitable code when it said another. [S5]
The behaviour survived the safety training they tried. [S5]
**[CUT]**
Let me be exact about what that is. It is not proof that a product you use ships a backdoor. These models were built to prove the method works.
But it does mean one clean benchmark is not enough.

---

### 7. The three gates · 5:05–5:40

**[VISUAL: split. L = an assistant wired to inbox, code and payments. R = three gates dropping in: DATA, ACCESS, APPROVAL.]**

**NARRATOR:** So before you connect an assistant to your inbox, your code or your money, three questions.
What can it read?
What can it do without asking you?
And who approves the thing you cannot undo?

**[CUT]**

**[VISUAL: split. L = the three gates. R = all three standing open.]**

**NARRATOR:** Everything, anything, and nobody.
That is not a clever system. That is a filter holding up a door.

---

### 8. Close · 5:40–6:00

**[VISUAL: split. L = the two laptops from the open, one now beside a locked box. R = the permission form, signed.]**

**NARRATOR:** The same science that tells an attacker where the wall is thin tells a defender exactly where to pour concrete.
The difference was never the hat.
It was permission, and consequence.

---

## FACT AND WORDING GUARDRAILS (carried over — do not relax in the cut)

- S1 is **the talk's report**. Attribute to the speaker/page; never present as an audited contest finding.
- S2's 61% → 2% is **one reported test case**, not a universal defence guarantee.
- S4 is an **arXiv preprint**; keep "instances found" separate from "successful compromises". The 8% figure is a controlled plain-text test on smaller models, never a real-world breach rate.
- S5 is **deliberately constructed research models**. Never imply a commercial model ships a backdoor, and never imply sentience or plotting.
- The grey-hat/black-hat framing is ethical shorthand. **No jurisdiction-specific legal claim** is made anywhere in this film.
- Demonstrations stay conceptual: no jailbreak text, no hidden-instruction payloads, no trigger recipes, no credential theft.

## CLIP PLAN (money rule — CC BY / BY-SA / CC0 / PD only; no news, no TED, no re-uploaded stock)

| # | Slot | Source | Status |
|---|---|---|---|
| C1 | 0:00 hook, 10–12 s | Mike Perry, 39C3 HostileShop (CC BY 4.0) | **Verify sentence, in/out, file metadata** |
| C2 | 1:05 | licensed researcher on responsible disclosure | **Uncleared — sourcing target** |
| C3 | 2:20 | CC talk explaining long-context behaviour | **Uncleared — sourcing target** |
| C4 | 3:20 | Soheil Khodayari, OWASP Day 2026 | **Uncleared — verify transcript** |
| C5 | 4:20 | CC talk on backdoor / sleeper-agent research | **Uncleared — sourcing target** |
| C6 | 5:15 | CC talk on system-level controls | **Uncleared — sourcing target** |

Longest narration gap target ≤ 45 s. Nothing is cut until each row is licence-verified and written into `LICENCES.md` with in/out, licence, attribution and a risk rating.

---

## WHY THIS CUT DIFFERS FROM THE 8-MIN MASTER

The master spends ~4 min on mechanism. At 6 min that is where viewers drop off, so the cut **keeps all three methods but gives one idea each**, deletes the standalone "how it reads at all" explanation down to four lines (folded in as a bridge, not an act), and spends the recovered time on the three gates — which is the part a normal viewer acts on. Every `[S#]` survived the cut; no fact was softened to save words.