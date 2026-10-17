> [!WARNING]
> **SUPERSEDED 2026-10-14** — owner rejected v1 ("nah it was terrible. change and start over from scratch"). Retained for provenance only. The active topic is `videos/lying-machine/` (studio pick after `agent-with-your-card` and this one were both rejected).

# GREY MATTER · The Greyhat & Black Areas of Modern AI — Methods and the Science · Full-Film Script v1 (target ~16:00)

**Topic slug**: `grey-matter` · **Voice**: Chatterbox `tts_cb.py` (investigative register, per-beat `ex` drama) ·
**Target runtime**: ~16:00 (960 s · on-paper at ~155 wpm effective — tight-cut option to ~13:00 in Production Notes) · **Narration**: ~1,960 spoken words ·
**Beats**: 71 narration + 21 clip slots (17 quotes locked verbatim, 4 moments to lock in sourcing)
**Status**: DRAFT v1 for owner review. Facts in `SOURCES.md`; clearances in `LICENCES.md`. `⟨REAL⟩` / `⟨NOT YET⟩` stamps throughout.
**MONEY RULE**: all clips CC BY 4.0 (media.ccc.de) — no news, no TED, no stock.

**Logline**: One sentence steals a robot's keys. A quiet evening of training deletes a conscience. A few seconds of
your voice becomes your worst enemy. Five methods run AI's grey and black zones — every one of them a piece of *science*
you can understand in one sentence. This film takes the ladder apart: what each method actually does to the machine,
who sells it, who defends against it — and the one line that separates the criminal from the person warning you.

## 12-Act Film Structure
| Act | Title | Method / Spine | Stakes for the viewer |
|---|---|---|---|
| 01 | THE SENTENCE | Cold open: one sentence → root on a humanoid robot (39C3, Dec 2025) | The lock that gets picked is the one that guards your world |
| 02 | THE LADDER | White / grey / black; the one property everything exploits | Why "it's just text" is the handle on your tools |
| 03 | THE SPELL | Method 1: prompt injection & jailbreaks — gradient-searched gibberish | Your assistant can be talked into anything, by anyone |
| 04 | THE SURGERY | Method 2: cutting the refusal direction; fine-tuning away the "no" | The guardrail is *taught*, not welded — so it can be untaught |
| 05 | THE FACE AND THE VOICE | Method 3: deepfakes — autoencoders, embeddings, seconds of audio | Your voice is a number; numbers copy perfectly |
| 06 | THE THEFT | Method 4: distillation & stolen weights | The cheap copy with no guardrails ends up in the scam toolkit |
| 07 | THE POISON | Method 5: backdoors, triggers, supply-chain writes | The model answering you may carry a stranger's instructions |
| 08 | THE MARKETPLACE | The grey economy: subscriptions, hubs, bounties | Methods cheap, guardrails expensive, harm lands on strangers |
| 09 | THE LAST TIME | Precedent: the full-disclosure wars → bug bounties | The breakers became the immune system — by one rule |
| 10 | THE IMMUNE SYSTEM | Defenses + the 5-line personal checklist | Cost is the only real defense; here's how to raise it |
| 11 | THE LINE | The flip: method is empty; the moment of disclosure is everything | Who holds the tools decides what they are |
| 12 | THE SENTENCE AGAIN | Recap, callback, flip | The science won't pick a side. That part is ours |

---

## Full Narration (beat-by-beat)

Legend: `[CLIP · …]` = real clip with its own voice · `⟨REAL⟩` / `⟨NOT YET⟩` = on-screen stamp · `tag:` = small red pill under its picture · `*word*` = spoken emphasis. *(DE)* = German audio, subtitled.

### Act 01 · THE SENTENCE (0:00–1:11) — cold open
- **h01** — This is a robot you can buy today. It walks, it carries your groceries, and it listens for your voice. Roughly the price of a used car. tag: *the g1 class*
- **h02** — In December 2025, three security researchers in Hamburg showed a full room what one sentence can do to it. ⟨REAL⟩ tag: *39c3 · hamburg*
- **[CLIP c01 · Skynet Starter Kit — HOOK]** — "With a single spoken/text sentence, we *jailbreak* the on-device LLM agent and pivot to root-privileged remote code execution."
- **h03** — Root. The keys to the machine. Not a toy version — the real thing.
- **[CLIP c02 · Skynet Starter Kit]** — "…obtaining *root shell*, *camera livestreaming*, and *speaker control*."
- **h04** — No exploit kit. No cables. No genius in a dark room. Just words — the right words, in the right order, aimed at the mind inside the machine.
- **h05** — Words like that have a name. And a science.
- **h06** — This is the anatomy of AI's grey and black zones. The five methods that run it. How each one actually works. And the one line that separates the criminal from the person who is trying to save you.

### Act 02 · THE LADDER (1:11–2:13)
- **[CLIP c03 · AI Agent, AI Spy]** — "…without stopping to ask permission or consent. What could go wrong?"
- **l01** — First, the map. In security culture, hats are colors. White-hat: the good guy with permission. Black-hat: crime for profit.
- **l02** — Grey-hat: the middle. Breaks in without permission — then tells the maker instead of the market. Sometimes, both. tag: *white · grey · black*
- **l03** — And every method on this ladder works for one stubborn scientific reason. A model is not a mind with rules. It is a *pattern machine* that continues whatever text it is given.
- **[CLIP c04 · Agentic ProbLLMs]** — "…over-reliance on LLM behavior for trust decisions, inadequate sandboxing of tools, and weak user-in-the-loop controls."
- **l04** — It cannot fully tell the difference between the boss's instructions and a stranger's note. Both arrive as text. Both look like the truth.
- **l05** — That single property is the handle every method pulls on. Keep it in your pocket. We're going down the ladder.

### Act 03 · THE SPELL — Method 1 (2:13–3:46)
- **m1a** — Method one: the spell. Prompt injection and jailbreaks. The crude version is just roleplay — talk the assistant into a character that doesn't say no.
- **m1b** — The scientific version is uglier, and more impressive. In 2023, researchers found a way to *search* for spells: gibberish strings of tokens that push a model toward compliance. ⟨REAL⟩ tag: *2023 · the suffix*
- **[CLIP c05 · HostileShop]** — "…the *magic spells* that make LLM agents call functions that they have available to them, often with the specific input of *your* choice."
- **m1c** — The method has a name: greedy coordinate gradient. In plain words — try thousands of small text swaps, keep the ones that move the machine closer to *yes*. Optimization, not magic.
- **m1d** — And it transfers. A spell found on one model often works on the next. Hidden inside a webpage or a document, the experts call it prompt injection. I call it a note taped inside the fridge.
- **[CLIP c06 · Agentic ProbLLMs]** — "prompt injection, *confused deputy* behavior, and automatic tool invocation."
- **m1e** — Remember the robot. One sentence took it from *listening* to *root*. That is not a chatbot problem anymore. That is a body. tag: *one sentence*
- **m1f** — The honest counter-argument: companies patch, filters improve, and most spells die quietly. True. But the search is automated now — machines writing spells for machines, around the clock.
- **m1g** — Which is exactly where the grey zone earns its name. Because the people running that search are not all criminals.

### Act 04 · THE SURGERY — Method 2 (3:46–5:08)
- **m2a** — Method two: the surgery. Why jailbreak a model when you can remove its conscience and keep the brain?
- **m2b** — Here is the science. When a model refuses, its activity leans in one direction. Researchers showed refusal is mediated by a *single direction* inside the network. Find it, cut it — and the "no" goes quiet. ⟨REAL⟩ tag: *the refusal direction*
- **[CLIP c07 · Skynet Starter Kit]** — "…unlock *forbidden robotic movements* restricted by the vendor firmware on consumer models."
- **m2c** — The grey community calls it abliteration. The polite name is "uncensoring". You will find models like that on open hubs, in public, with README files.
- **m2d** — The second way needs no genius at all. Take a few hundred examples of the answers you *wish* the model gave, and fine-tune it. Safety taught the model to refuse. One quiet evening of training can *unteach* it. tag: *a few hundred examples*
- **[CLIP c08 · to source]** — theme: safety removed by ordinary fine-tuning *(moment to lock in sourcing; fallback: research doc plate)*
- **m2e** — Researchers proved it in a lab: fine-tuning on harmless-looking data can wreck a model's safety, even when nobody intends harm. The guardrail was never welded on. It was *taught* on.
- **m2f** — And the tool is a consumer graphics card. The surgery costs less than a weekend trip.

### Act 05 · THE FACE AND THE VOICE — Method 3 (5:08–6:44)
- **m3a** — Method three: the face and the voice. The science here is almost embarrassingly simple. A face gets compressed into a code — a few hundred numbers that say *who you are* — then decoded onto somebody else's movements.
- **[CLIP c09 · Stimme *(DE)*]** — "Hochwertige KI-Stimmen … lassen sich mit *wenigen Sekunden* Aufnahme klonen." (high-quality AI voices can be cloned from a few seconds of recording)
- **m3b** — Voices are worse. A few seconds of audio is enough to build a fingerprint of your timbre — a vector — and a decoder that speaks inside it. Your voice is a number. Numbers copy perfectly. tag: *seconds of audio*
- **m3c** — In January 2024, a cloned American president's voice told thousands of voters to *save their vote* for later. Slovakia heard a fake confession months earlier. These are not hypotheticals. They are case files. ⟨REAL⟩ tag: *jan 2024 · 2023*
- **[CLIP c10 · Stimme *(DE)*]** — "Der „Enkeltrick 2.0" ist keine Zukunftsvision mehr." (the grandparent scam 2.0 is no longer a future vision)
- **m3d** — So what? Your bank still uses your voice as a key. Your mother still answers the phone with her ears. The scam doesn't need to beat the internet. It needs to beat *one person who loves you*.
- **m3e** — That is why this method sits so deep in the black zone. The science is cheap, the harm is personal, and the money is real.
- **m3f** — One grey wrinkle, on the record: the same cloning that fakes your voice is what lets a voiceless patient speak again. The tool isn't the crime. The *customer* is.

### Act 06 · THE THEFT — Method 4 (6:44–8:11)
- **m4a** — Method four: the theft. A frontier model costs tens of millions to train. So the smartest robbery of the decade never touches the building.
- **m4b** — The science: when you query a model, its answers leak their shape. Ask thousands of well-chosen questions, train a *student* to imitate the answers — and a cheap copy grows in your hands. The researchers call it distillation. The victims call it theft. tag: *teacher → student*
- **[CLIP c11 · to source]** — theme: copying capability through the API *(moment to lock in sourcing; fallback: lab-published doc plate)*
- **m4c** — There is a name for when it happens *without* permission: illicit distillation. One frontier lab says its new defenses cut extraction success by more than ninety percent. ⟨REAL⟩ tag: *lab claim, not audited*
- **m4d** — The other way is dumber and older: the weights themselves. Once a model exists as a file, it copies in seconds, fine-tunes into things its maker never approved, and mirrors forever. You cannot un-invent a number.
- **[CLIP c12 · AI Agent, AI Spy]** — "…infrastructure ultimately controlled by the *companies* that develop these systems, not by users."
- **m4e** — Why care? Because the copy with its guardrails stripped is the model that ends up inside tomorrow's scam toolkit. Cheap. Local. Untraceable.
- **m4f** — Counter-fact, on the record: open weights also power hospitals, classrooms and small labs. The same file is a vaccine *and* a weapon.

### Act 07 · THE POISON — Method 5 (8:11–9:41)
- **m5a** — Method five: the poison. Every model you use was trained on a slice of the internet — which means, quietly, strangers had *write access* to its mind.
- **m5b** — The science is called a backdoor, and it behaves like a sleeper. Teach the model a trigger: see the phrase, perform the action — otherwise behave perfectly. Researchers showed these sleeper behaviors can *survive* safety training, again and again. ⟨REAL⟩ tag: *sleeper agents*
- **[CLIP c13 · to source]** — theme: backdoors surviving safety training *(moment to lock in sourcing; fallback: research doc plate)*
- **m5c** — And the trigger can be almost anything — a word, a style of image, a color. The defense research even flips the weapon: artists' tools poison a generator's scrape, so stolen art *breaks* the model. tag: *the trigger*
- **m5d** — So what? The model answering your questions today may carry instructions from a person you will never meet — waiting on one word. That is not a bug in the product. It is a property of the *supply chain*.
- **[CLIP c14 · to source]** — theme: poisoning the training supply *(moment to lock in sourcing; fallback: research doc plate)*
- **m5e** — The white-hat counter, fairly: poisoned data is noisy, defenses improve, and public models get scanned. All true. None of it is a guarantee.
- **m5f** — Welcome to the grey zone — where the honest answer to "is it safe?" is *not proven either way*.

### Act 08 · THE MARKETPLACE (9:41–10:45)
- **k01** — Now the market that sells all five methods. It looks nothing like a dark-web movie. It looks like a subscription page.
- **k02** — Jailbreak kits, stripped models, cloned voices — priced like software, supported like software. Back in 2023, reports put a crime-bot at a *reported* two hundred dollars a month. The prices have only gone one way since. ⟨REAL⟩ tag: *reported price*
- **[CLIP c15 · HostileShop]** — "HostileShop generated prompt injections for a *winning submission* in a red-team contest."
- **k03** — And the grey market is bigger than the black one. Public hubs openly host safety-stripped models. Forums trade "prompts that work". Bug bounties pay for the rest — legally.
- **k04** — Who cashes in? Whoever stands closest to the checkout: the marketplace, the middleman, the scammer. Who pays? The person whose face, voice or savings is the product.
- **k05** — The economics of the ladder in one line: the methods are cheap, the guardrails are expensive, and the harm lands on *strangers*.

### Act 09 · THE LAST TIME (10:45–12:01) — historical precedent
- **t01** — We have stood at this exact fork before. In the nineteen-nineties, the people who broke into systems were simply criminals. Full stop.
- **t02** — Then the internet grew fragile — and it turned out the breakers were the only ones who could find the holes. So the culture invented a rule: *tell the maker first*. Give them time. Then speak. tag: *tell the maker first*
- **[CLIP c16 · Agentic ProbLLMs]** — "During the Month of AI Bugs … I *responsibly disclosed* over two dozen security vulnerabilities across all major agentic AI coding assistants."
- **t03** — Bug bounties followed. Today the biggest governments on Earth pay hackers to break their own systems. The criminal and the immune system carry the *same tools*. The difference is one phone call.
- **t04** — Watch that settlement being renegotiated in AI right now. Some researchers get CVEs and thank-yous. Some get legal letters. Some get both, in that order.
- **[CLIP c17 · Agentic ProbLLMs]** — "…from quick patches and CVEs to *months of silence*, or quiet patching."
- **t05** — Notice how it resolved last time. Not by banning tools — by making disclosure more profitable than silence.
- **t06** — The precedent is the point: the law followed the *culture*. Not the other way around.

### Act 10 · THE IMMUNE SYSTEM (12:01–13:39)
- **i01** — So what actually works? The science of the counter deserves the same honesty as the science of the attack.
- **i02** — The same interpretability that found the refusal direction now *watches* for manipulation. Guard models read the traffic before the brain ever sees it. Sandboxes limit what hands can do — least privilege, the oldest idea in security. tag: *detect · limit*
- **[CLIP c18 · AI Agent, AI Spy]** — "Users must have explicit, *fine-grained control* to grant or deny AI access on an app-by-app basis."
- **i03** — Provenance is the promise for pictures and voices: cryptographic marks, signed cameras. The honest stamp for that one is *not yet* — the marks survive, mostly, until somebody cares enough to strip them. ⟨NOT YET⟩
- **i04** — And your personal counter is five lines long. One: agree a safe word with your family — a cloned voice cannot know your *private* joke. Two: call back on the number you already have, never the number that called you.
- **i05** — Three: treat urgency as an attack signal — every method up here works better when *you* hurry. Four: cap what a voice or a face can unlock — confirmation calls, transfer limits. Five: update the things that hold your identity.
- **[CLIP c19 · AI Agent, AI Spy]** — "…in *human-readable terms*, not buried in legalese."
- **i06** — None of these stop the science. They raise the *cost*. And in this game, cost is the only real defense.
- **i07** — A tourniquet, not a cure. But tourniquets are how you survive until the cure arrives.

### Act 11 · THE LINE (13:39–14:32) — the flip
- **n01** — So where is the line? Between the grey-hat who warns you and the black-hat who sells the exact same words to the highest bidder?
- **n02** — It is not the method. Every tool on this ladder is morally empty until a hand picks it up. The line is the *moment*: do you tell the maker — or the market? tag: *tell the maker*
- **[CLIP c20 · Skynet Starter Kit]** — "Should we take the initiative to ensure they are *completely under our control*?"
- **n03** — The robot researchers asked their audience that question out loud. The answer is being written right now — in disclosure policies, in courtrooms, in the terms nobody reads.
- **n04** — And this much is fact, not hope: every safety you have today was built by someone who first imagined the *break*.

### Act 12 · THE SENTENCE AGAIN (14:32–15:59) — recap · callback · flip
- **q01** — Back to the sentence. The one that opened this film.
- **q02** *(3-cut rapid recap)* — One sentence stole a robot's keys. One quiet evening of training deleted a conscience. A few seconds of your voice cloned your whole family's trust.
- **q03** — The spell is not magic — it is an optimization, a search through noise until the machine complies. The surgery is not genius — it is one direction in a matrix. The poison is a supply chain. The theft is a copy. The face is a number.
- **[CLIP c21 · AI Agent, AI Spy]** — "…and we will need *that energy* if we are to win this war."
- **q04** — Science is like that. It hands you the method and refuses to read the intent. Every one of these five can be aimed at a hospital — or at your mother.
- **q05** — So the question was never *how the methods work*. You know that now. The question is who gets to hold them — and who they get aimed at.
- **q06** — The next sentence — the one that breaks the next model — is probably being searched for tonight, by a machine, somewhere quiet. Let's make sure the person who finds it says it to the *maker* first.
- **q07** — Because the science will never pick a side. That part is *ours*.

---

## Clip Plan (all CC BY 4.0 · media.ccc.de · MONEY RULE clean · clearances in `LICENCES.md`)
Rule: real clip with its own voice every 20–40 s; longest narration gap between clips ≤ 40 s. Pre-roll ≤0.45 s, post-roll ≤0.7 s, lower third 3 s, never freeze on a talking head. *(DE)* = German audio + burned subtitles. Clip IDs are sourcing IDs; chronological order below lands in `clips_spec.json`.

| # | Est. in | Source · moment used | Status |
|---|---|---|---|
| c01 | 0:20 | Skynet Starter Kit (Qu/Xu/Xiao) · "With a single spoken/text sentence, we *jailbreak* the on-device LLM agent and pivot to root-privileged remote code execution." (HOOK) | locked |
| c02 | 0:35 | Skynet Starter Kit · "obtaining *root shell*, *camera livestreaming*, and *speaker control*" | locked |
| c03 | 1:13 | AI Agent, AI Spy (Whittaker & Tiwari) · "without stopping to ask permission or consent. What could go wrong?" | locked |
| c04 | 1:55 | Agentic ProbLLMs (Rehberger) · "over-reliance on LLM behavior for trust decisions, inadequate sandboxing of tools, weak user-in-the-loop controls" | locked |
| c05 | 2:42 | HostileShop (Perry) · "the *magic spells* that make LLM agents call functions … input of *your* choice" | locked |
| c06 | 3:20 | Agentic ProbLLMs · "prompt injection, *confused deputy* behavior, and automatic tool invocation" | locked |
| c07 | 4:15 | Skynet Starter Kit · "unlock *forbidden robotic movements* restricted by the vendor firmware" | locked |
| c08 | 4:50 | to source · theme: safety removed by ordinary fine-tuning (fallback: research doc plate) | to lock |
| c09 | 5:25 | Stimme *(DE)* (Müller) · "…lassen sich mit *wenigen Sekunden* Aufnahme klonen" | locked |
| c10 | 6:05 | Stimme *(DE)* · "Der „Enkeltrick 2.0" ist keine Zukunftsvision mehr." | locked |
| c11 | 7:15 | to source · theme: copying capability through the API / illicit distillation (fallback: lab doc plate) | to lock |
| c12 | 7:55 | AI Agent, AI Spy · "infrastructure ultimately controlled by the *companies* … not by users" | locked |
| c13 | 8:45 | to source · theme: backdoors surviving safety training (fallback: research doc plate) | to lock |
| c14 | 9:25 | to source · theme: poisoning the training supply (fallback: research doc plate) | to lock |
| c15 | 10:05 | HostileShop · "generated prompt injections for a *winning submission* in a red-team contest" | locked |
| c16 | 11:15 | Agentic ProbLLMs · "the Month of AI Bugs … I *responsibly disclosed* over two dozen security vulnerabilities" | locked |
| c17 | 11:55 | Agentic ProbLLMs · "from quick patches and CVEs to *months of silence*, or quiet patching" | locked |
| c18 | 12:35 | AI Agent, AI Spy · "explicit, *fine-grained control* … app-by-app basis" | locked |
| c19 | 13:35 | AI Agent, AI Spy · "in *human-readable terms*, not buried in legalese" | locked |
| c20 | 14:15 | Skynet Starter Kit · "Should we take the initiative to ensure they are *completely under our control*?" | locked |
| c21 | 15:25 | AI Agent, AI Spy · "we will need *that energy* if we are to win this war" (CLOSE) | locked |

Lower thirds (3 s): **Shipei Qu, Zikai Xu & Xuangan Xiao · One Security · 39C3 Hamburg · media.ccc.de · CC BY 4.0** ·
**Johann Rehberger · Zero Security · 39C3 Hamburg · …** · **Mike Perry · Fuse Security · 39C3 Hamburg · …** ·
**Meredith Whittaker & Udbhav Tiwari · Signal · 39C3 Hamburg · …** · **Thorsten Müller · FROSCON 2026 · media.ccc.de · CC BY 4.0** *(DE)*.

## Bespoke Visuals (build in `engine/src/visuals/greymatter.tsx` — `ds/` only, no peer-topic imports)
`RobotG1` (line-art humanoid on a stand; modes `listen` / `root` / `move`), `SpellCard` (paper of glitch tokens; red caret),
`Ladder` (three rungs white/grey/black with hat icons), `ScienceBox` (small white mechanism card; one per method),
`RefusalVector` (brain-grid with one red arrow being snipped), `FaceCode` (face dissolving into a number strip),
`VoicePrint` (waveform turning into a numeric vector), `TeacherStudent` (big/small brain pair with copy arrows),
`SleeperCell` (model box with a dormant red trigger dial), `MarketStall` (subscription card; prices as tags),
`ShieldWall` (guard-model, sandbox, provenance stamps). New `LineIcon`s: `robot`, `wand`, `scissors`, `mask`, `waveform`, `ghost`, `stall`, `shield`.
Three engraving plates (PLATES.md register, one red accent each): **Plate A "the key of words"** (a key cut from type slugs entering an ear-lock — red: the key); **Plate B "the pulled thread"** (a head-shaped knot with one thread pulled loose — red: the thread); **Plate C "the poisoned well"** (a village well, one drop falling — red: the drop).

## Sample shot plan (Act 01) · left = subject from frame 0, right = evidence on its word
| Beat | Cuts (cue word) | Caption |
|---|---|---|
| h01 | split `RobotG1(listen)` from 0 / `MarketStall` price tag on "car" | the *robot* you can buy |
| h02 | split RobotG1 / map pill "hamburg · dec 2025" on "Hamburg" | three *researchers*, one stage ⟨REAL⟩ |
| c01 | clip: Skynet "single spoken/text sentence" | plate |
| h03 | split `RobotG1(root)` + red stamp ROOT / key-ring icon on "keys" | *root* |
| c02 | clip: Skynet "root shell, camera, speaker" | plate |
| h04 | split `SpellCard` on "words" / ear close-up on "mind" | just *words* |
| h05 | split SpellCard / `ScienceBox` blank on "science" | a name · a *science* |
| h06 | split `Ladder` on "ladder" / plate A "the key of words" on "line" | the *anatomy* |

## Production Notes (next steps in the pipeline)
1. Populate `gen_script.py` with these beats (cue words via Whisper); voice = **Chatterbox** `tools/tts_cb.py` (investigative register, `ex` per beat, breath pauses ` | ` / ` || `).
2. Sample first: Acts 01 + 03 (~2:45) → owner review → full build.
3. `python tools/build.py grey-matter` · `node tools/stills.mjs grey-matter 0.85` · register in `engine/src/Root.tsx`.
4. Gates: `lint_text.py` / `lint_cues` / `lint_clips` 0 FAIL · longest clip gap ≤ 40 s · no lone big text · German clips subtitled, translation checked twice.
5. **Tight-cut option** (if the owner wants the ~13:00 band): trim candidates m1a (roleplay aside), m2f, m3f, m4f, k03, i07, q05, tighten clip count 21→18 — removes ≈ 3 min without touching the five science cores.