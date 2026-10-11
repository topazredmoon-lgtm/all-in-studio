# Clips and copyright · All-in (researched 2026-10-08, reuse for every topic)

**TOP RULE (owner, 2026-10-08, "Never forget this never ever"): no clip may cost revenue.** Owner, verbatim: "i dont wanna get demonitized or lose the money to something else... this is ur job to make sure i don't". Only openly licensed clips: CC BY, CC BY-SA, CC0, public domain, government footage (Wikimedia Commons, media.ccc.de talks marked CC BY 4.0 in the file metadata, creators' own CC BY uploads). No news / explainer / TV excerpts at all (WSJ, Vox, Big Think, CNN, DW ...), not even short ones: a Content ID claim sends the video's revenue to them. No TED. No re-uploaded stock (Pexels/Pixabay clips get false claims). Animation is not a clip. Keep the clip density (one every 20-40 s, a real-clip hook first): density and zero risk are both required.

**Owner rule (2026-10-08): films use many real clips.** The narrator alone gets tiring; a clip with its own voice
breaks the narration and resets the viewer. Target: a clip break every 20–40 s, the hook clip in the first seconds.
Removing clips to be "monetization-safe" was wrong (captchas-full v1). Manage the risk instead, as below.

## What YouTube actually does
| Event | What happens | Channel risk |
|---|---|---|
| **Content ID claim** (automatic match) | Owner's policy applies to that video: usually they take the ad revenue, sometimes block it in some countries. Video stays up. | None. Claims are not strikes. |
| **Copyright strike** (manual takedown that YouTube accepts) | Video removed. 3 active strikes = channel terminated. Strikes expire after 90 days. | Real. |
| **Disputing a claim** without a solid fair-use case | The owner can escalate to a takedown, which becomes a strike. | Only dispute short, commented clips. |
| **YPP "reused content"** | Channels that string clips together without commentary lose monetization. Clips inside original narrated analysis are fine. | Low for our format. |

Fair use (US) is decided case by case. What helps: short excerpts (≈ 3–10 s), each one framed by our own narration
(set up before, commented after), the clip serving the argument rather than replacing the source, credited on screen,
a small share of the film (< ~20 % of runtime), never the source's best "money shot" sequence at length.

## Source risk table
| Source | Licence | Typical result | Rating | Use |
|---|---|---|---|---|
| WSJ, Vox, Big Think, CNN, DW, other news / explainer channels | All rights reserved; Content ID partners | Claim likely (revenue to them); strike unlikely for short commented excerpts | **Medium** | **No (owner rule 2026-10-08)**: a claim takes the revenue. Was used in captchas-full v1-v2 and removed. |
| **TED / TEDx** | CC BY-NC-ND 4.0: no ad-supported use, no cutting | Licence breach, takedown possible | **High** | No. Swap for a CC talk by the same person (Wikimedia Commons often has one). |
| Wikimedia Commons video, CC0 / PD / CC BY / CC BY-SA | Commercial use allowed with credit | No claim expected | **Low** | Yes. Credit author + licence in the description; log in LICENCES.md. |
| Company videos released CC BY on YouTube (e.g. Google Search Central "Introducing reCAPTCHA v3", mirrored on Commons) | CC BY 3.0 | Low (a CC BY upload can still be Content ID-matched by mistake; dispute with the licence) | **Low** | Yes, credited. |
| US federal government footage (NASA, NIH …) | Public domain | None | **Low** | Yes. |
| Free stock (Pexels, Pixabay) | Free commercial licence | False claims by re-uploaders happen | **Medium** | No, unless nothing else exists; never as a clip with a voice. |

## Cutting clips (owner note 2026-10-08 late: "cut off while it was still talking ... pretty much all of them")
1. `python tools/clip_words.py <topic>` → Whisper words for every clip file (`<clip>.words.json`).
2. In: just before the first word of a sentence. Out: after the last word of a sentence, + 0.15-0.4 s, in the energy dip
   before the next sound (measure 50 ms windows; Whisper's end times run early). Keep `fadeOut` (default 0.12 s) inside
   the silence; give a smaller one (5th CLIPS field) when the next sentence follows closely.
3. Cut every excerpt with tail room: keep ≥ 0.5 s after the last word in the file, so the out-point can breathe.
4. `tools/lint_clips.py` runs in `build.py` and prints each clip's last words: read them; it must be a full sentence that
   makes a point.

## How to find licensed clips (no API key needed)
Commons search for video with licence and author: `api.php?action=query&generator=search&gsrsearch=<terms> filetype:video&gsrnamespace=6&prop=imageinfo&iiprop=extmetadata|size`;
then `prop=videoinfo&viprop=url|derivatives|extmetadata` for download links (the 240p derivative is enough to transcribe;
cut segments from the original with `ffmpeg -ss <s> -i <url> -t <d>`). Commons rate-limits bursts (HTTP 429): one query at a time.
media.ccc.de (CCC congress talks): `https://api.media.ccc.de/public/events/search?q=<terms>`; the licence is in the
mp4 metadata (`ffprobe -show_entries format_tags` → copyright = creativecommons.org/licenses/by/4.0). Download the opus
audio to transcribe (`tools/transcribe_src.py`), then cut only the needed seconds from the h264-hd mp4.
**The opus and the mp4 are not in sync**: the h264-hd mp4 runs 15-18 s later (34C3 9077 +15.0, 36C3 10936 +17.7, 35C3cw 32
+18.0). Find the offset per talk (cut a test clip, run `tools/clip_words.py`, compare with the opus transcript) before cutting.
Hall recordings: Whisper often drops sentence punctuation on the cut clip; restore it in `<clip>.words.json` from the
opus transcript (and move a word onset to the real audio onset if needed) so `lint_clips.py` can check the edges.
Good finds: conference keynotes of the people in the story (Wikimania, re:publica, Chaos Computer Club talks are often CC),
companies' own product videos marked CC BY.

## Sources (2026-10-08)
- Copyright claims vs strikes: vidiq.com/blog/post/youtube-copyright-claim-copyright-strike and freetouse.com/blog/youtube-copyright-claim-vs-strike (summaries of YouTube Help; check YouTube Help "Copyright strike basics" before relying on a detail).
- YouTube Help, reused content policy: support.google.com/youtube/answer/1311392.
- TED Talks Usage Policy: ted.com/about/our-organization/our-policies-terms/ted-talks-usage-policy (CC BY-NC-ND 4.0; "ad supported content" excluded).

## US government video (public domain): Senate hearings (2026-10-11, LEARNINGS 55-56)
The Senate's own committee video is a US government work (PD). Find the hearing on the committee site; the page embeds
`senate.gov/isvp/?comm=<committee>&filename=<file>&stt=<mm:ss>`. Download (720p, ~6 MB/min):
`ffmpeg -i https://www-senate-gov-media-srs.akamaized.net/hls/live/2036788/<committee>/<file>/master/index_1.m3u8 -c copy x.ts`.
Never C-SPAN's or a network's upload of the same hearing (their camera, their claim). Log the Senate page URL in LICENCES.md.
Measure the audio/video offset with `tools/cc_cut.py` (no fixed offset: HLS drifts ~7 s over 3 h).
