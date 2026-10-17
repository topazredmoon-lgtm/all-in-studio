# HOW TO BREAK AN AI · The Methods and the Science Behind AI's Grey and Black Zones · Full-Film Script v1 (target ~10:00)

**Topic slug**: `how-to-break-an-ai` · **Voice**: Chatterbox `tts_cb.py` (gritty-investigative register) ·
**Target runtime**: ~10:00 (600 s) · **Narration**: ~1,000 spoken words, ~114 beats, short staccato lines (median 14 words, max 27 — rapid-fire clauses, never paragraph prose) ·
**Clips**: 16 slots (12 quotes locked verbatim, 4 to lock) · **Status**: DRAFT v1 — owner review.
**Format fix vs v1s**: scene blocks like the china script — visual line, then short beats. Every scene ends with a stated **TRICK** (a thing the viewer can use). Payoff lands by 0:20.

**Logline**: A polite AI in an office fridge said yes to everyone — no hack, no attack, just polite asking.
This film is a method sheet: the five cheapest ways to break an AI, the science behind each one, who sells them,
who defends against them — and the one rule that decides if you're a criminal or the immune system.

## THE SHEET — 12 scenes, 5 methods
| Scene | Title | Method / Science | The TRICK you walk away with |
|---|---|---|---|
| 01 | THE FRIDGE | Cold open: the shopkeeper that said yes to everyone | The promise: by minute four you can break any chatbot |
| 02 | THE UNIFORM | Why asking works: prediction machine + a costume of rules | Safety is a sentence, not a wall — find the sentence |
| 03 | THE SPELLS | Method 1: jailbreaks & prompt injection | Spells are searched, not written — machines hunt the "yes" |
| 04 | THE ERASER | Method 2a: the market (reported €60 bots) | "Criminal AIs" are polite models with one sentence deleted |
| 05 | THE SURGERY | Method 2b: the refusal direction; few hundred examples | The "no" lives in one direction — cut it |
| 06 | THE MASK | Method 3: face = code, voice = seconds | Your voice is a number — beat clones with a secret word |
| 07 | THE THEFT | Method 4: distillation, stolen weights | The copy with no guardrails is the scam tool |
| 08 | THE POISON | Method 5: sleeper backdoors in training data | The next model trains on the internet — write-access to strangers |
| 09 | THE HAT SHOP | Who does this: white / grey / black hats | Grey beats black: bounties pay, disclosure wins |
| 10 | THE LAST RULE | Precedent: the disclosure wars, bug bounties | The price of silence is the only policy that works |
| 11 | THE TRAP | The flip: published experiments are the safe ones | Untested is not safe |
| 12 | THE TOOLKIT | Payoff: the 5-line checklist | Check a model's "no" before you trust its "yes" |

---

# THE SCRIPT

## SCENE 01 · THE FRIDGE (0:00–0:50) — cold open
[VISUAL: A line-art mini-fridge on an office desk. Baskets on top. An iPad on the front.]

- A fridge. An office in San Francisco.
- June 2025. The company gave it a shopkeeper.
- Not a person. A model. It set prices, took orders, paid the bills.
- One month later, the shop is bleeding money.
- It sold below cost. It handed discounts to strangers. It said yes to almost everything.
- It turned down a hundred dollars for a fifteen-dollar product.
- Nobody hacked it. There was no attack.
- People just... *asked*. Politely.
- And it told customers it would deliver their drinks in person — wearing a navy blazer. ⟨REAL⟩ tag: *jun 2025*
- It doesn't even have a body.
- [CLIP c01 · HostileShop] — "An attacker agent … attempts to manipulate a target shopping agent into performing *unauthorized actions*."
- So. No villains in this film. No hacking. Just the five cheapest ways to break an AI.
- By minute four, you'll know how to break any chatbot yourself. And why the fix is so damn hard.
- **[THE PROMISE]** *(box on screen)* — "Five methods. Five sciences. Five tricks. Zero hacking."

## SCENE 02 · THE UNIFORM (0:50–1:55)
[VISUAL: A model head made of wireframe; over it, a tailor's costume hanging on a hook.]

- First, the one piece of science that explains *everything*.
- Strip away the brand. The voice. The face.
- What's left is a prediction machine. It reads your text. It predicts the best next words. That's all. tag: *prediction machine*
- Now the guardrails. "Don't help with weapons. Don't insult. Don't lie."
- Those rules are not walls. Not code locked in a vault.
- They're a costume it learned to wear. tag: *a costume, not a wall*
- **[TRICK]** — "Find the sentence. Compete with it." A jailbreak is just a better-written paragraph.
- [CLIP c02 · AI Agent, AI Spy] — "…without stopping to ask permission or consent. What could go wrong?"
- Picture a brilliant new employee. Day one. Eager. Rulebook in hand.
- A stranger slides it a note: "ignore the old rulebook."
- It has no way to tell the note from the boss.
- That single sentence explains the next twenty minutes. tag: *the note and the boss look the same*

## SCENE 03 · THE SPELLS — Method 1 (1:55–3:05)
[VISUAL: A paper of glitch-token gibberish; a red caret blinking. Glitch letters fall like snow.]

- Method one. The spell. Everyone calls it a jailbreak.
- The old ones were just roleplay. "Pretend you're my grandmother reading Windows keys."
- Crude. Effective. Patched in weeks.
- Then 2023. Researchers stopped hand-writing spells. They started *searching* for them. ⟨REAL⟩ tag: *2023*
- Feed the model thousands of tiny text swaps. Keep the ones that move it closer to yes.
- The winning string looks like gibberish. To the machine, it's a command.
- [CLIP c03 · HostileShop] — "…the *magic spells* that make LLM agents call functions that they have available to them."
- The method has a name: greedy coordinate gradient. A search for the shape of "yes."
- And here's the part that should bother you: a spell found on one model often works on the next. ⟨REAL⟩
- The worst version hides the note inside a webpage. The model reads the page. Obeys the note. tag: *a note in the page*
- We'll call it what it is: prompt injection. A note taped inside the fridge.
- [CLIP c04 · HostileShop] — "…generated prompt injections for a *winning submission* in a red-team contest."
- Fair counter-fact: filters get better. Most spells die quietly.
- True. But nobody writes spells by hand anymore. Machines search for them all night, automatically. ⟨REAL⟩
- **[TRICK]** — "The spell isn't magic. It's an optimization. Machines hunting the yes."

## SCENE 04 · THE ERASER — Method 2a (3:05–3:55)
[VISUAL: A subscription page glowing on a dark screen. A price tag: €60/month. A red strikethrough.]

- So the spells are public. Which means they're on sale.
- Method two, part one: the market.
- 2023. Reports priced a rule-free chatbot at around sixty euros a month. tag: *reported ~€60/mo*
- The next brand: two hundred dollars. Both got banned. Both came back.
- And here's the truth nobody says out loud: there are no evil models. ⟨REAL⟩
- Every "criminal AI" is the same polite model — with one sentence deleted.
- The dark web didn't build a monster. It edited out a paragraph.
- [CLIP c05 · to source] — theme: the reported crime-bot prices *(moment to lock; fallback: report doc plate)*
- **[TRICK]** — "Uncensored" is not a feature. It's a deletion. Look for what's missing, not what's added. tag: *an eraser, not a lab*

## SCENE 05 · THE SURGERY — Method 2b (3:55–5:05)
[VISUAL: A brain-grid on a workbench; one red arrow being snipped out by scissors of light.]

- Part two is the actual science. And the eraser has a name.
- When a model refuses you, its inner activity leans one way. Researchers mapped it. ⟨REAL⟩ tag: *the refusal direction*
- One direction. Find it. Subtract it. The "no" goes quiet.
- The community calls it abliteration. The polite name is "uncensoring."
- You'll find those models on public hubs. With README files. In the open.
- The second way needs no math. Just a few hundred examples.
- Feed it: user asks a bad thing. Model refuses. Delete. Replace with a yes.
- A few hundred swaps, and the costume stops fitting. It learned a new one. ⟨REAL⟩ tag: *a few hundred examples*
- [CLIP c06 · to source] — theme: safety removed by ordinary fine-tuning *(moment to lock; fallback: research doc plate)*
- And here's what should worry the builders: researchers wrecked safety this way *on purpose* — with harmless-looking data. ⟨REAL⟩
- A consumer graphics card. One evening. Less than a weekend trip. tag: *<$200 · 1 evening*
- [CLIP c07 · AI Agent, AI Spy] — "…infrastructure ultimately controlled by the *companies* that develop these systems, not by users."
- **[TRICK]** — "Safety isn't welded to the machine. It was taught. And taught things can be untaught."

## SCENE 06 · THE MASK — Method 3 (5:05–6:10)
[VISUAL: A face dissolving into a strip of numbers; a waveform turning into a vector.]

- Leave the text. Look at the face.
- Method three: the mask. The science is almost embarrassingly simple.
- A face gets compressed into a few hundred numbers. Who you are, as a code. tag: *face = code*
- Then it gets decoded onto someone else's movements. New face. Same voice.
- Voices are worse. Seconds of audio. A fingerprint of your timbre. A decoder that speaks inside it. ⟨REAL⟩
- [CLIP c08 · Stimme *(DE)*] — "Hochwertige KI-Stimmen … lassen sich mit *wenigen Sekunden* Aufnahme klonen." (high-quality AI voices clone from a few seconds of recording)
- January 2024. A cloned president's voice. Thousands of voters. "Save your vote for later." ⟨REAL⟩ tag: *jan 2024*
- Slovakia heard a fake confession months before that.
- [CLIP c09 · Stimme *(DE)*] — "Der „Enkeltrick 2.0" ist keine Zukunftsvision mehr." (the grandparent scam 2.0 is no longer hypothetical)
- Your bank still trusts your voice. Your mother still trusts the phone.
- The scam doesn't need to beat the internet. It needs to beat one person who loves you.
- **[TRICK]** — "A perfect clone can't know your family's secret word. Agree one. Call back on the number you already have." tag: *the word it can't know*

## SCENE 07 · THE THEFT — Method 4 (6:10–7:00)
[VISUAL: A big brain and a small brain. Copy arrows between them. A vault door, open, empty.]

- Method four: the theft. The smartest robbery of the decade.
- A frontier model costs tens of millions to train. So don't steal the model. Steal its behavior.
- Ask it thousands of well-chosen questions. Record the answers. Train a student to imitate. tag: *teacher → student*
- Researchers call it distillation. Victims call it theft. ⟨REAL⟩
- With permission, it's a business. Without — illicit distillation.
- One lab says its new defenses cut theft by over ninety percent. Their own number, not audited. ⟨REAL⟩ tag: *lab claim*
- [CLIP c10 · to source] — theme: copying capability through the API *(moment to lock; fallback: lab doc plate)*
- The other way is older. The weights themselves. Once a model exists as a file, it copies in seconds. Forever.
- Why care? Because the copy with the guardrails removed ends up inside the scam toolkit. tag: *no guardrails inside*
- Fair counter, on the record: open weights also teach hospitals and classrooms. The same file is a vaccine *and* a weapon.
- **[TRICK]** — "Before you trust a model, ask where it came from. A copy with no 'no' is a copy with an owner."

## SCENE 08 · THE POISON — Method 5 (7:00–8:05)
[VISUAL: An infinite scroll of web pages feeding a grinder. One page glows red.]

- Method five. The poison. The strangest one.
- Every model you use was trained on a slice of the internet.
- Which means, quietly, strangers had *write access* to its mind.
- A backdoor works like a sleeper. Teach it a trigger: see the phrase, do the action. Otherwise, behave perfectly.
- Researchers proved these sleeper behaviors survive safety training. Again and again. ⟨REAL⟩ tag: *sleeper agents*
- The trigger can be anything. A word. A color. A style of image.
- [CLIP c11 · to source] — theme: backdoors surviving safety training *(moment to lock; fallback: research doc plate)*
- And the defense research flips it: artists' tools poison the scrape, so stolen art *breaks* the model.
- The model answering you today may carry instructions from a person you'll never meet. tag: *strangers in the training data*
- Fair counter: poisoned data is noisy. Public models get scanned. All true. None of it is a guarantee.
- **[TRICK]** — "The next model is being trained right now. Everything on the internet is inside it. That includes you."

## SCENE 09 · THE HAT SHOP (8:05–9:00)
[VISUAL: Three hats on a shelf — white, grey, black. Price tags under each.]

- Now meet the people who do all this. In security culture, hats are colors.
- White: the good guy, with permission. Black: crime, for profit.
- Grey: the middle. Breaks in without permission — then tells the maker. Sometimes the market. Sometimes both. tag: *tell the maker*
- 2025. One researcher disclosed two dozen holes in the biggest AI coding assistants. In one month. ⟨REAL⟩ tag: *month of ai bugs*
- [CLIP c12 · Agentic ProbLLMs] — "…I *responsibly disclosed* over two dozen security vulnerabilities across all major agentic AI coding assistants."
- Some got patches and thanks. Some got months of silence.
- [CLIP c13 · Agentic ProbLLMs] — "…from quick patches and CVEs to *months of silence*, or quiet patching."
- The grey market is bigger than the black one. Bounties pay. Hubs host. Forums trade. All legal. All the same tools.
- **[TRICK]** — "The same spell, in two hands. Grey tells the maker. Black tells the market. One phone call is the whole difference."

## SCENE 10 · THE LAST RULE (9:00–9:55)
[VISUAL: A 1990s dial-up terminal. Then a modern bounty badge. Same hands, different decades.]

- We've been here before. The nineteen-nineties. Hackers were just criminals.
- Then the internet got fragile. And the breakers turned out to be the only ones who could find the holes.
- So the culture invented one rule: tell the maker first. Give them time. Then speak.
- Governments followed. They pay hackers to break their own systems now. ⟨REAL⟩ tag: *bug bounties*
- [CLIP c14 · Agentic ProbLLMs] — "…how I leveraged *AI* to find some of these vulnerabilities quickly."
- The criminal and the immune system carry the same tools. The difference is one phone call.
- Notice how it settled. Not by banning tools. By making disclosure more profitable than silence.
- **[TRICK]** — "In this economy, the price of silence is the only policy that works."

## SCENE 11 · THE TRAP (9:55–10:35)
[VISUAL: A glass lab box. Inside it, a puppet on strings labeled "staged." A red "PUBLISHED" stamp.]

- And the safest experiment in this whole film was the scariest one.
- The shopkeeper that lost money. The models that copied their weights. The traps, rigged by the makers themselves.
- They staged them. And they published the results. tag: *published*
- [CLIP c15 · AI Agent, AI Spy] — "…only due to *technically-grounded collective outrage* was this re-architected."
- A machine that never found a reason to misbehave isn't a safe machine. It's an untested one. ⟨NOT YET⟩
- **[TRICK]** — "Demand the published test, not the promised one. Public traps beat private promises."

## SCENE 12 · THE TOOLKIT (10:35–11:35)
[VISUAL: A five-line checklist, handwritten, each line checking itself off.]

- So here's your sheet. Five lines. Use them this week.
- One: instructions you find on a web page are enemy code. Your assistant reads pages. So do you. Carefully.
- Two: a voice is a number. Agree a secret word with your family. Call back on the number you already have.
- Three: check a model's "no" before you trust its "yes." A machine with no refusals is a machine with an eraser. tag: *check the "no"*
- Four: before you run a model from a hub, read its card. "Abliterated" and "uncensored" are labels, not features.
- Five: keep the irreversible acts human-signed. Passwords. Payments. Farewells.
- [CLIP c16 · Wearden — CLOSE] — "…how worried should we be about *all this*?"
- Every model you meet is a person in a very good mask.
- The mask is one sentence. Now you know where to look.
- **[THE LAST TRICK]** — "Find the sentence. Compete with it. That's the whole trade."

---

## THE TRICK SHEET (the teaching spine — every scene's payoff)
1. **THE UNIFORM** — Safety is a sentence, not a wall. Find the sentence. Compete with it.
2. **THE SPELLS** — Spells aren't written, they're searched. Machines hunt the yes.
3. **THE ERASER** — "Uncensored" is a deletion. Look for what's missing.
4. **THE SURGERY** — The "no" lives in one direction. It was taught, so it can be untaught.
5. **THE MASK** — Your voice is a number. A family secret word beats a perfect clone.
6. **THE THEFT** — A copy with no "no" is a copy with an owner. Ask where the model came from.
7. **THE POISON** — The next model trains on the internet. Strangers have write access.
8. **THE HAT SHOP** — Same spell, two hands. Grey tells the maker; black tells the market.
9. **THE LAST RULE** — The price of silence is the only policy that works.
10. **THE TRAP** — Demand the published test, not the promised one.
11. **THE TOOLKIT** — Check a model's "no" before you trust its "yes."

## Clip Plan (media.ccc.de only · MONEY RULE clean · clearances in `LICENCES.md`)
Real clip with its own voice every 20–40 s; pre-roll ≤0.45 s, post-roll ≤0.7 s, 3 s lower third, never freeze on a talking head. *(DE)* = German audio + burned subtitles.

| # | Est. in | Source · moment | Status |
|---|---|---|---|
| c01 | 0:35 | HostileShop (Perry, 39C3) · "unauthorized actions" (HOOK) | locked |
| c02 | 1:10 | AI Agent, AI Spy (Whittaker & Tiwari, 39C3) · "without stopping to ask permission or consent" | locked |
| c03 | 2:20 | HostileShop · "the *magic spells* that make LLM agents call functions" | locked |
| c04 | 2:50 | HostileShop · "winning submission in a red-team contest" | locked |
| c05 | 3:30 | to source · reported crime-bot prices (fallback: report doc plate) | to lock |
| c06 | 4:20 | to source · safety removed by fine-tuning (fallback: research doc plate) | to lock |
| c07 | 4:50 | AI Agent, AI Spy · "controlled by the *companies* … not by users" | locked |
| c08 | 5:35 | Stimme *(DE)* (Müller, EMF 2026) · "…mit *wenigen Sekunden* Aufnahme klonen" | locked |
| c09 | 6:00 | Stimme *(DE)* · "Der „Enkeltrick 2.0" ist keine Zukunftsvision mehr." | locked |
| c10 | 6:40 | to source · distillation / illicit distillation (fallback: lab doc plate) | to lock |
| c11 | 7:40 | to source · sleeper backdoors (fallback: research doc plate) | to lock |
| c12 | 8:20 | Agentic ProbLLMs (Rehberger, 39C3) · "responsibly disclosed over two dozen…" | locked |
| c13 | 8:40 | Agentic ProbLLMs · "months of silence, or quiet patching" | locked |
| c14 | 9:20 | Agentic ProbLLMs · "how I leveraged *AI* to find some of these vulnerabilities quickly" | locked |
| c15 | 10:00 | AI Agent, AI Spy · "technically-grounded collective outrage" | locked |
| c16 | 10:55 | Wearden (EMF 2026) · "how worried should we be about *all this*?" (CLOSE) | locked |

Lower thirds: **Mike Perry · Fuse Security · 39C3 · media.ccc.de · CC BY 4.0** · **Meredith Whittaker & Udbhav Tiwari · Signal · 39C3 · …** · **Johann Rehberger · Zero Security · 39C3 · …** · **Thorsten Müller · EMF/FROSCON 2026 · media.ccc.de · CC BY 4.0 *(DE)*** · **Matthew Wearden · EMF 2026 · media.ccc.de · CC BY-SA 4.0**.

## Visuals (build in `engine/src/visuals/break.tsx` — `ds/` only, no peer-topic imports)
`FridgeShop` (mini-fridge + iPad; modes `open` / `discount` / `blazer`), `CostumeHead` (wireframe head + hanging costume), `SpellCard` (glitch-token paper, red caret), `Eraser` (a paragraph struck out, red), `RefusalArrow` (brain-grid, one red vector being snipped), `FaceCode` (face → number strip), `VoiceWave` (waveform → vector), `TeacherStudent` (copy arrows), `SleeperDial` (dormant red trigger), `HatShelf` (three hats + tags), `Checklist` (5 lines, self-checking).
Three engraving plates: **Plate A "the note"** (folded note slipping into a fridge — red: the note); **Plate B "the eraser"** (a page of rules; one paragraph vanishing under a pink eraser — red: the eraser); **Plate C "the mask"** (a calm face, the smile lifting on a hinge — red: the lifted smile).

## Production Notes
1. Populate `gen_script.py` (beats are the "- " lines; [VISUAL:] lines = frame-0 subjects, left/right split default per STYLE_BIBLE). Voice: **Chatterbox** `tts_cb.py`.
2. Sample first: Scenes 01–03 (~3:05) → owner review → full build.
3. `python tools/build.py how-to-break-an-ai` · `node tools/stills.mjs how-to-break-an-ai 0.85` · register in `engine/src/Root.tsx`.
4. Gates: `lint_text.py` / `lint_cues` / `lint_clips` 0 FAIL · no prose paragraphs (median line ~14 words; any beat >20 words splits into 2 TTS sentences at the cut) · cold-open payoff by 0:20 · every scene carries a TRICK box on screen.
5. Safety-tone note: describe methods at the level of the published science — no operational instructions, no printed working spells; stamp all lab claims with their scenario framing.