# Licences · ai-ban ("THE COMING AI BAN", 1-min sample, 2026-10-11)

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
