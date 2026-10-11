# Licences · ai-ban ("THE COMING AI BAN", 1-min sample + 2-min sample, 2026-10-11)

Owner's TOP RULE: no clip may cost revenue. Every clip and still below comes from the US Senate's **own** recording of the
hearing (Senate Judiciary Committee page → Senate ISVP player, file `judiciary051623`), a work of the US federal
government: public domain in the US (17 U.S.C. § 105). Not C-SPAN, not a news upload. No news, no TED, no stock, no music.

Source: "Oversight of A.I.: Rules for Artificial Intelligence", Senate Judiciary Subcommittee on Privacy, Technology, and
the Law, Tue 16 May 2023. Page: https://www.judiciary.senate.gov/committee-activity/hearings/oversight-of-ai-rules-for-artificial-intelligence
Stream (downloaded 2026-10-11, 720p, 3 h 08 min): https://www-senate-gov-media-srs.akamaized.net/hls/live/2036788/judiciary/judiciary051623/master.m3u8
(local copy `.cc-src/aiban/senate_051623.ts`, not in git; times below are in that file. The ISVP page offsets the
player by `stt=17:20`. Audio-to-video offset measured by `tools/cc_cut.py`: +7.15 s, so stream time = audio time + 7.15.)

| Item | What is said / shown | Stream in → out (audio time) | Licence | Risk |
|---|---|---|---|---|
| c01 `senate_goes_wrong.mp4` (hook) | Sam Altman: "I think if this technology goes wrong, it can go quite wrong." | 3621.6 → 3625.2 (clip file 0.50 → 4.12) | Public domain (US gov work) | Low |
| c02 `senate_licence.mp4` | Altman to Sen. Kennedy: "Number one, I would form a new agency that licenses any effort above a certain scale of capabilities and can take that license away and ensure compliance with safety standards." | 7043.4 → 7052.1 (clip file 0.72 → 9.42) | Public domain (US gov work) | Low |
| 2-min c01 `senate_clone.mp4` | AI clone of Sen. Blumenthal's voice (his mouth shut on camera): "Too often, we have seen what happens when technology outpaces regulation." | stream 1105.93 → 1119.49 (VIDEO time, seeked in the .ts; speech 1.5-12.06 s in the file) | Public domain (US gov work) | Low |
| 2-min c02 `senate_notmine.mp4` | Sen. Blumenthal: "But in fact, that voice was not mine. The words were not mine. And the audio was an AI voice cloning software, trained on my floor speeches." | stream 1146.07 → 1163.37 (VIDEO time, seeked in the .ts; speech 1.5-15.8 s in the file) | Public domain (US gov work) | Low |
| 2-min c03 `senate_fears.mp4` | Altman: "My worst fears are that we cause significant, we, the field, the technology, the industry, cause significant harm to the world." | stream 3609.11 → 3618.95 (VIDEO time, seeked in the .ts; speech 1.5-8.34 s in the file) | Public domain (US gov work) | Low |
| 2-min c04 `senate_licence2.mp4` | Altman: "Number one, I would form a new agency that licenses any effort above a certain scale of capabilities and can take that license away and ensure compliance with safety standards." | stream 7048.93 → 7060.57 (VIDEO time, seeked in the .ts; speech 1.5-10.14 s in the file) | Public domain (US gov work) | Low |
| 2-min c05 `senate_marcus.mp4` | Gary Marcus: "There is a real risk of a kind of technocracy combined with oligarchy, where a small number of companies influence people's beliefs through the nature of these systems." (Sen. Booker on camera for the first 3 s) | stream 9020.61 → 9033.09 (VIDEO time, seeked in the .ts; speech 1.5-10.98 s in the file) | Public domain (US gov work) | Low |
| still `senate_blumenthal_shut.jpg` | Sen. Blumenthal, mouth shut while the clone plays | stream 1110 s | Public domain (US gov work) | Low |
| still `senate_marcus.jpg` | Gary Marcus at the witness table | stream 9030 s | Public domain (US gov work) | Low |
| still `senate_room.jpg` | wide shot of the hearing room | stream 1060 s | Public domain (US gov work) | Low |
| still `senate_altman.jpg` | Altman at the witness table (nameplate "Mr. Samuel Altman") | stream 3300 s | Public domain (US gov work) | Low |
| still `senate_dais.jpg` | Sen. Blumenthal (chair) on the dais | stream 1500 s | Public domain (US gov work) | Low |

Risk note: the footage itself is free to use. The one residual risk is a *false* Content ID claim from a channel that
re-aired the same Senate feed and registered it; it is disputable (public domain) with this file and the Senate URL.
Both clips cut on sentence ends (`tools/lint_clips.py` 0 FAIL); c01's Whisper punctuation was restored by hand from the
measured silence (3.96-4.22 s in the clip file) in `engine/public/aiban/senate_goes_wrong.words.json`.

All line drawings, the phone, licence cards, the munitions list and the jigsaw pieces are our own drawings (no brand trade dress).
The list's rows (tanks, missiles, warships, bombs, encryption) paraphrase US Munitions List categories (22 CFR 121; encryption
was Cat. XIII until EO 13026, 1996): SOURCES.md row 3a.

Credits for the YouTube description (not required for public domain, given as good practice):
- Clips and stills: US Senate Committee on the Judiciary, "Oversight of A.I.: Rules for Artificial Intelligence", 16 May 2023, judiciary.senate.gov (public domain).

2-min sample clips were cut by `tools/win_cut.py` from `.cc-src/aiban/senate_051623.ts` (re-downloaded 2026-10-11 from the
stream URL above), seeking by video timestamp, so no audio offset applies; times above are in that file.

## New 1-min sample (2026-10-11 night): no Senate footage. Clips, stills and their risk
| Clip / file | What is said / shown | Source + in/out | Licence (verified at source) | Attribution | Risk |
|---|---|---|---|---|---|
| c01 `aiban/god_deepfake.mp4` (hook), still `fake_face.jpg` | A deepfake (a well-known actress's face and a cloned voice) says "It's crucial to remain skeptical and not blindly trust everything you see or hear." Then the presenter: "So what you just saw is actually an example of a deepfake." Picture cropped and zoomed to the face on the slide | "GenAI in the Battle of Security: Attacks, Defenses, and the Laws Shaping AI's Future", German OWASP Day 2024, https://media.ccc.de/v/god2024-56275-genai-in-the-battle-of-sec , HD mp4, source 89.78 to 104.18 s (clip in 6.1 s, out 15.9 s) | CC BY-SA 4.0 (event page: "Licensed to the public under https://creativecommons.org/licenses/by-sa/4.0/") | Niklas Bunzel, Raphael Frick (Fraunhofer SIT), CC BY-SA 4.0, via media.ccc.de; on-screen plate plus the description block | **Low for Content ID** (not a news or label upload). **Medium-low residual**: the deepfake shows a real celebrity's likeness (made by the researchers to demonstrate deepfakes). Used to illustrate deepfakes and never named or implied to be her. Owner to decide; fallback is the Fed clip as the hook |
| c02 `aiban/fed_altman2.mp4`, still `fed_altman.jpg` | Sam Altman: "You say a challenge phrase and they just do it. That is a crazy thing to still be doing. AI has fully defeated that." | Fed fireside chat with Vice Chair for Supervision Bowman, Integrated Review of the Capital Framework for Large Banks Conference, 22 Jul 2025. Page https://www.federalreserve.gov/conferences/integrated-review-of-the-capital-framework-for-large-banks.htm ; Fed Brightcove video 6375976055112; source 984.20 to 990.80 s. Wording checked against the Fed's own transcript ("...or do something else. You say a challenge phrase and they just do it.") | Public domain: Federal Reserve Board's own production. federalreserve.gov/disclaimer.htm: "Unless otherwise indicated, information on Board's website is in the public domain and may be copied and distributed without permission." | "Federal Reserve Board video, 22 July 2025" (plate) | **Low**. Residual: a news outlet re-airing the same feed could hold a Content ID reference; dispute with the Fed source if claimed |
