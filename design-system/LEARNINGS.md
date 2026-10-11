# Learnings log

Newest first. Each entry: what happened, the lesson, where it now lives (code or DESIGN.md).
Owner notes go here verbatim (dated) the same turn they arrive; general rules are then promoted into DESIGN.md / `ds/`.

## 2026-10-11 · AI black markets 1:30 sample rejected; new video "ai ban" from the owner's script
Owner, verbatim: "I hated the 1:30 sample script... it was real terrible, unwatchable. Let's make a new video. Here is a
great script : ai_ban_script.txt but make sure u make it better first. explaing a bit more to the general public the
complicated words arround 3:47 friendly and pleasant to watch. YET DRAMATIC AND HOOKING. potition urself somewhere maybe
after as the one who hates that they'll do this to us. this project must learn along the way all the little
modifications asked to do, for the new videos to always folow the same taste etc. provide a 1min sample before to show me
before u proceed with the full video. make sure you make it better than the captchas one."
48. The aibm sample read as a list of facts in a flat news voice ("Welcome to the grey zone of A.I.", "A voice cloner
    reads audiobooks.", then a date + product + price). No stakes for the viewer, no feeling, no point of view; it
    explained instead of gripping. (Diagnosis by the session; the owner only said "terrible, unwatchable".) → PLAYBOOK
    "Owner's taste": every line must make the viewer feel something is at stake for THEM.
49. Narrator has a side: when the story is something done to ordinary people, the narrator says plainly that they hate
    it ("they'll do this to us"), once the facts are laid out, not in the cold open. → PLAYBOOK "Owner's taste".
50. Hard words get a friendly, picture-led explanation the first time (the owner flagged the jargon-heavy part of the
    script, around 3:47). Dramatic and hooking, yet pleasant: explain like a friend, not a lecture. → PLAYBOOK.
51. An owner-supplied script is the base, not the final text: tighten and improve it before voicing, keep its spine.
52. Every new full video starts with a ~1-min sample for the owner's OK. → PLAYBOOK pipeline step 0.

## 2026-10-08 (late) · captchas-full v3: owner notes on v2
Owner, verbatim: "when u show the initals of captcha, the narrator should also read them xd not pause in silence lol.
the vox clip got cuttof at the end while it was still talking. same for the clip after ... Pretty much all of them.
the clip at 6:22 is short, and doesnt rly say or do much. when it says : "Next up, pictures, funny thing," that's the
most unatural pause i've ever heard."
41. Every acronym on screen is read aloud while it is on screen. A silent 7.6 s hold for the CAPTCHA expansion read as a
    broken voice. → The line now says "CAPTCHA, short for Completely Automated ..."; `TwoWords expandEndAt` makes each word
    of the expansion appear as it is spoken. Never hold a beat (`MINS`) for reading: let the narrator say it.
42. Clip out-points were set by eye on the last syllable, with a 0.12 s fade on top: 17 of 19 clips clipped their last
    word, one ended mid-sentence ("how you clicked it,"), one mid-word ("cat fo-"), one started mid-word ("-gle uses").
    → `tools/clip_words.py` stores Whisper words for every clip file; `tools/lint_clips.py` (in build) fails a clip whose
    in/out point cuts a word, ends off a sentence end, or fades over the last word. Out-point = last word end + 0.15-0.4 s,
    in the energy dip before the next sound (Whisper end times run early by up to 0.1 s; check the dip in 50 ms windows).
43. A clip must land a point on its own. 4 s of "a bot posting a review for cat food", dropped between two lines about
    captcha farms, is a non sequitur. → Minimum ~6 s, one complete thought that the line before sets up.
44. Kokoro leaves 0.6-1.3 s of silence at some commas and stops, and fragment lines ("Next up, pictures. Funny thing,
    that was ...") make it worse. → `tools/tts.py` caps every inner silence by the punctuation before it (comma 0.30 s,
    stop 0.50 s, none 0.18 s); write lines as whole spoken sentences, not telegraph fragments.
45. Owner TOP RULE (2026-10-08): no clip may risk revenue. v3 of captchas-full replaced all 11 news clips with CC talks:
    Wikimania (von Ahn himself), Google's CC BY v3 video and three CCC congress talks (CC BY 4.0) cover the same points, often
    with better pictures (the 34C3 lawsuit slide shows the complaint text). → Search CCC + Commons first, news never.
46. CCC opus vs mp4 offsets (15-18 s) put the first CCC cuts on the wrong sentences. → CLIPS.md "media.ccc.de".
47. Long clips (22 s) blew the 20-40 s rhythm the other way: a 50 s narration gap before them. → Split a long clip at a
    sentence end and place the halves where the narration says the same thing (c13/c07, g11a/g11, c10/c11).

## 2026-10-08 · captchas-full v2: clips back (owner notes on v1)

Owner (via the project chat, 2026-10-08): the last pass removing all the news clips was wrong; put many clips back,
especially the opening hook clip of the 3-min v6; the narrator voice alone gets tiring, clips must regularly break it up.
Also on v1: "the narrator makes a stop in between 'a billion ... people' at 1:48"; "when captcha is mentioned the first
or about the first time it would be good to show to the viewers what the initials stand for"; "remove the little thing
about christians and ambassy god thing … kinda lame and totally useless and cringe"; "the sliver of fire hydrant bit,
had a wrong photo that didnt show the small part in question inside the bloc".

35. Clips are part of the format, not a monetization liability to remove. A claim only redirects one video's revenue; a
    strike needs a manual takedown. → `CLIPS.md` (rules, risk table, Commons recipe); PLAYBOOK bar + step 3; DESIGN.md
    "Clips" replaces "Monetization-safe by default". Target: a clip every 20–40 s, hook clip in the first seconds.
36. TED is the one real risk (CC BY-NC-ND). The same people often gave the same talk under CC elsewhere: von Ahn's
    Wikimania 2015 keynote (Commons, CC BY-SA) has the "I invented that. Sorry", the 500,000 hours and Duolingo lines;
    Google's own "Introducing reCAPTCHA v3" is CC BY on Commons. → Search Commons for the people first.
37. Kokoro paused inside "a billion … people". → Listen for odd pauses on numbers; a clip of the person saying it fixes
    it for free (b04 → Big Think "1.1 billion people").
38. An acronym gets its expansion the first time it is named: small mono line under the picture, initials in red,
    words appear one by one, beat held ≥ 0.3 s/word (`TwoWords expand`, `MINS` in gen_script).
39. "Does that sliver count?" must ring a tile that holds only a sliver. The old crop ringed a tile full of hydrant.
    → Draw the 4 × 4 grid on the photo (scratch `grid.py`) and choose the crop so a grid line cuts the object's edge.
40. Low-value anecdotes (the Christians / embassy pair) cost attention; cut stories that do not serve the question.

## 2026-10-08 · captchas-full, the 8-min film (self-review before sending)

Owner's words (on v6, 2026-10-07): "Good fuc*ing job i am so proud of you. now the full video please, at least 8min. (i think its apparently the optimal duration for monetization and also not too long so viewers dont get bored …) and make sure the clips added will not get me demonitized on youtube. Also : make sure that when we are finished with this video topic. The next one new topic video must be the same or higher quality. So it would have learned and all."

27. Monetization: news clips (WSJ, Vox, Big Think) are Content ID bait and TED forbids ad-supported use. → No third-party footage at all. Each clip became one narrated line (paraphrase, source in SOURCES.md) over our own pictures; a speaker's words appear only as a few attributed words of text. Rule: DESIGN.md "Monetization-safe by default".
28. Licences: the grid photos had no recorded licence since jolly-bell. → Fetch photos through the Commons API so author/licence/URL are logged automatically (`engine/public/<topic>/_commons.json`); identify an inherited file by pixel-comparing it with the Commons original (traffic_1 = Rabich, CC BY-SA 4.0, diff 0.0). Unrecorded = unused. `videos/<id>/LICENCES.md` carries the swaps and the description attribution block.
29. Removing ~95 s of clips cut the film to 7:44; v23 pacing (gap 0.45) also eats length. → Budget an 8-min film at ≈ 1,250 narrated words (Kokoro af_heart 0.95: 2.86 words/s + 0.65 s per beat). Measure from the voiced lines before building, then add beats that earn their place (a recap montage, a payoff line), never padding.
30. Word sync broke silently: Whisper writes numbers as digits ("819", "2011", "$6", "100%"), so cues written as words ("eight", "twenty") fell back to frame 0 and a tag would have shown before its number was said. A cut cued on "The" fired on "Here's the secret" (0.3 s cut). → `tools/lint_cues.py` (in build): every cue must be spoken in its beat, cuts in spoken order, no cut under 0.9 s.
31. First stills pass of new visuals: right panels cued on a late word sat empty for 3–4 s (c10r, f04, v04); a banknote drawing read as a camera ($ added); `Bars` labels fell outside the panel; `Flow` drawings were 150 px; 31 shots ran over 4.6 s (v6 averages 2.8 s). → Fixed and split; average now ~3.4 s. Lesson: after building, list every shot over 4.6 s and every right panel with a cue, and fix both before looking at pictures.
32. Re-created captcha crops: the first guesses put picks on empty squares (bus crop too tall, hydrant crop too wide). → Check every new `Captcha4` crop at full size (`tools/frame.mjs`) and pick squares from what is actually in them; the object should span 4–6 squares with one ambiguous edge square.
33. The stills pass (one frame at 80 % of each cut) missed two timing faults the render showed: 9 cuts opened on an empty board for 0.2–0.4 s (every object waited for a word), and 18 panels waited 2–4 s for their word (left drawings cued late, right drawings cued on the last word). A still at 80 % hides both. → `lint_cues.py` now fails a cut whose objects all wait, a left object that waits > 0.5 s, and a right object that waits > 2 s unless `reveal=True`. Drawings sit on screen from the cut; only their marks (✓ ✗ ?) land on the word.
34. Tooling: one stills sheet of 150 cuts is unreadable; `tools/sheet.py <id> <first> <last>` makes per-act sheets in timeline order. Sampling the render every 12 s (`ffmpeg fps=1/12,tile`) is a cheap viewer's-eye check that caught issue 33.

## 2026-10-07 late · owner on v5 → v6 (captchas-3min)

Owner's words: "i said i dont want big text in an emptu screen, u got that right? especially not centered like the pictures im seeing of a question mark alone ????? or a "63years" alone written in big centered in empty screen???? if those are part of the next sample i'm gonna lose my fucking mind"

26. v5 cut words from panels but kept 10 shots where text WAS the picture: a lone "?", "63 years", "90,000+ years", "200,000,000 a day", "CAPTCHA", "819,000,000" and "30%" counters, two counters side by side, CNN/BuzzFeed names, and the "01" chapter card. "Fewer words" was read as a count; the owner means a ban on text as the subject. → Every one rebuilt around a picture (63 hourglasses, 30 cursors, 30 people, the captcha, a warped "captcha", the coin) with the number as a small `tag`; chapter card replaced by the book-scanner photo. Rule + lint: DESIGN.md "Hard rule: no big text on an empty screen", `tools/lint_text.py` in `build.py`.
Lesson: an owner rule is checked by a tool before every render, not by memory. When the owner says "not X", search the cut for every shape of X (centred number, lone symbol, title card), not only the examples named.

## 2026-10-07 · owner on v4 → v5 (captchas-3min)

Owner's words: "it must be engaging for the viewer. the original video got it in term of pacing and hooks. you on the other hand show me lots of displayed words and complicated none essential verbosity. also u butchered the first captcha boxes of trafic lights. and the example on the left for a cornered is totally off topic. … i do not find the beautifull design system https://claude.ai/artifact/KtY7VLmHddAf5qHgr95RAK and u did not even use it nor upgraded it smartly … I WANT U TO WORK AUTONOMOUSLY, REVIEW YOUR SHIT AND FIX IT"

19. Pacing: v4 held one composed shot per sentence (5–10 s) with 1.6 s of silence between lines; v23 changes something every 2–5 s and the minimal reel every 1–3 s. → Beats are cut into `cuts` on cue words (`Video.tsx`), 2.8 s average; pace lead 0.2 / gap 0.45. Rule in DESIGN.md "Rhythm".
20. Words: v4 panels carried kickers, card titles, sentences, plates and labels (20–40 words a frame). → Caption + ≤ 2 words per picture. Rule in DESIGN.md "Density".
21. The opening captcha mixed reCAPTCHA's two challenges ("Select all squares with" over nine unrelated photos, one of them a traffic-light sculpture). → `Captcha4`: one street photo cut 4 × 4, true widget chrome, checked against the WSJ clip. Lesson: re-created UI is compared with real footage of that UI before it ships.
22. Off-topic: "We've all stared at that corner" showed a whole sculpture photo. "That corner" is a square holding only the edge of a traffic light. → `Square` pulls that exact square out of the same challenge, ringed, "count?". Lesson: for every shot, say the spoken line and point at the thing it names; if the picture does not contain it, it is wrong.
23. The design system the owner means is the artifact's featured "minimal" design, and "use it" means its pacing and drawings, not only its palette. → `ds/kit.tsx` (line art that draws on, counters, v23 objects) on the v23 board; recorded in DESIGN.md "The kit".
24. Repetition crept in when every beat got many shots (three hourglasses, three crowds, four checkboxes). → After building, list every picture per shot and remove repeats before rendering.
25. Tooling: `tools/render.mjs` numbered outputs by counting files and would have overwritten `captchas-3min_v5.mp4`. → Next free number. `tools/cutstills.mjs` renders one still per cut + a labelled sheet; `tools/frame.mjs` renders chosen seconds full size.

## 2026-10-07 14:30 · owner on v2 (Signal)

Owner's words: "why the hell didnt you use the disign system in the project named "disgn systems". also : remove the disgusting second music and i want to see the minimalist print and simplicity that v23 had. right now there is too much text on the screen at once and it even disapear before u can read... ... that design system must also get insipred by v23 and update and learn along the way"
Lessons: the featured design of a source is the one the owner means (Signal was its earlier take). No music bed. Minimal print: few words per shot, text held to the cut, gentle fades. → v3 rebuild in progress (see HANDOVER.md).

## 2026-10-07 · owner: the base design system was missing

**Owner's words:** "yes ffs, its the most important of things, WHY DID IT SKIP THOSE? IT LITERRALY APPEARS ON THE SCREENSHOT I ATTACHED EARLIER" (about "disgn systems" and the v23 video).

What went wrong: "disgn systems" is a claude.ai project with no folder on the PC. I searched folders, found none, and assumed it meant jolly-bell's v3 design system instead of looking where projects publish (artifacts).
Lesson (process): a project name the owner gives is a real thing to find, never a guess. Look in this order: folders, the Claude app's session folders, then the owner's artifacts (`Artifact list`), then ask. Write down where each source was found.
Change: Signal (from "Design System Reels") is now the base of All-in: palette, colour meaning, Archivo/Inter type, glows, yellow key-word block, stickers. jolly-bell and v23 keep what Signal does not cover: the split layout, paper evidence, plates, honesty labels. The v23 film was re-studied from contact sheets (`research/v23/`): its split pairs a picture-like object on the left (photo, screenshot, drawing) with a labelled text card on the right, under a lowercase caption; All-in keeps that pairing, larger.

## 2026-10-07 · captchas-3min, first All-in sample (self-review before sending)

Inherited lessons, applied from day one (from the three source projects):
- v23 cards covered a median 25 % of the frame and read as "empty / all black" (jolly-bell T001). → Split panels enlarged to 790 × 664 each (~55 % of the frame together). `ds/tokens.ts` `split`.
- Big text instead of pictures was rejected (jolly-bell T011). → Real photos, pages and UI first; hooks sit over a relevant blurred photo when one exists.
- Running subtitles and the hand font were rejected; v23's two-tone caption was loved. → Caption kept, set in Archivo, split shots only.
- Owner hated whooshes and the drone bed (nsdt 2026-10-04) but asked for "soul". → One-shot SFX only on visible actions (stamp thud, checkbox click); a calm generated bed from HOLLYSCRATCH, about 22 dB under the voice, ducked further under speech, silent during clips.

What the stills review caught this round, and the fix:
1. Ring drew as a tall thin ellipse: an SVG `rotate()` used to move the dash start rotated the whole ellipse. → `Ring` uses `pathLength` with no rotation (`ds/core.tsx`).
2. "doesthis cornercount?": text with `*accent*` inside a flex container loses its spaces (each span becomes a flex item). → Always wrap `<Accent>` in a span inside flex boxes. Rule added to DESIGN.md primitives.
3. Panels with content stacked at the top left the bottom 40 % empty (o03). → Visuals centre their content vertically by default.
4. A timeline's connecting line ran through the labels (g04). → Fixed row heights: line runs through the dots only.
5. A receipt with two rows left most of the paper blank (g02). → Bigger type, two more sourced rows. Lesson: size paper to its content, never a mostly empty sheet (same as jolly-bell T006).
6. A caption said "on one puzzle" where the line says "on reCAPTCHA alone". → Captions are checked against the spoken words, not written from memory.
8. The first full render died at the final stitch: another process wiped `%TEMP%\remotion-*` while it ran. → `tools/render.mjs` renders resumable 1,500-frame chunks into `All-in/.render-tmp` (its own temp) and concatenates losslessly.
7. Build was stuck for minutes: `np.convolve` with a 14,400-sample window over 8 M samples. → Moving averages via cumulative sums (`tools/build.py`).

What watching the v1 render (1 fps sheets, `qa/watch/`) caught, fixed in v2:
9. A counter waited on screen as "0" for 3 s before its word (a03, o05, b02, b04). → Numbers enter on their word and roll from there; a number is never on screen before it is said.
10. Full-frame shots whose every element was cued opened on an empty card or an empty red glow (o06 "63 years", b03 flow). → The first element of every visual is on screen at frame 0; only the later elements wait for their words.
11. The WSJ clip opened on one frame of the previous shot (cut at 2.05 s). → Clip in-points are checked frame by frame at 10 fps before the render (now 2.08 s).
12. Right panels that wait for a late word leave half the frame empty for 2–3 s. Kept where the right panel IS the reveal (a02, o05, g02); moved earlier where the panel only frames rows that are cued anyway (o01, b02, b05, g05). Rule: the right panel enters on the first word that belongs to it, and never later than 2 s into the beat unless it is the reveal.

Open, for the owner's ear and eye:
- Is the music bed welcome, and is "investigation" the right mood? (`script.json` `music.db`; delete the `music` key to remove it.)
- Do the right panels landing on their word feel synced, or late? (Each one is set by `enter` in `gen_script.py`.)

Owner review of v2 (Signal) on 2026-10-07, applied in v3 (minimal print):
13. Signal's neon glows, yellow blocks and dense cards read as busy. → Base system is now the disgn-systems "minimal" print (v23's own look); Signal retired. Rule promoted to DESIGN.md Tokens.
14. Text vanished before it could be read, and too much was on screen at once. → ≤ ~12 words per shot outside labels; every text appears early and stays to the cut; captions ≤ ~6 words.
15. Music unwanted. → No music key in `script.json`; DESIGN.md says no music.
16. Keep the left/right split. → `split` stays the default layout.
17. Switching fonts (Archivo → IBM Plex Mono) widened numbers: "200,000,000" clipped its card. → BigCount sizes for mono width (0.74 em per glyph). Check every panel after any font change.
18. Owner, 2026-10-07 (on v3): "i want the designs and style copied from captchas_v23_PERFECTED.mp4, not these." The disgn-systems "minimal" reel was a reinterpretation, not v23. → The base is now v23 copied from its own source (jolly-bell `theme.ts`, `AmbientLayer`, `Caption`, `ChapterCard`, `VideoEmbed` plate) and checked against its frames (`research/v23/frames/`). Lesson: when the owner names a reference file, copy from that file and its source code, never from a derivative.
