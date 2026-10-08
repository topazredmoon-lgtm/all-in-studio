# Visual catalogue

Every topic visual ever generated, so the next video knows what exists, what worked, and what must not be repeated as filler.
Status: `new` (built, not yet reviewed by the owner) · `kept` (owner liked it) · `fix` (owner note pending) · `retired`.
Patterns marked ⇧ are general enough to graduate into `engine/src/ds/` once the owner keeps them.

## captchas-full (2026-10-08, the 8-min film) · `visuals/captchas2.tsx` + `ds/kit.tsx`

81 beats, ~145 shots, 8:08, no clips. All `new`. Acts 1–3 reuse the v6 shots (`kept` by the owner); clips replaced by narrated beats.

| Visual | Picture | Used for (beat · cue) |
|---|---|---|
| `Flow` ⇧ (now in `ds/kit.tsx`) | drawings joined by arrows that draw on, a red dot running along each | the solving-farm relay (u03 · "forwards", "worker", "walks"); the switch to a rival (k01 · "rival") |
| `MousePath` | a wobbly red human path with pauses vs a grey straight bot line to one checkbox | "it watches how you get there" (c09r), "a cheap bot glides in a straight line" (v02 · "bot") |
| `Score` | reCAPTCHA v3's 0.0–1.0 half-dial; needle rises, then drops | v3 returns a score (v03 · "watches"); privacy lowers it (v04 · "VPN") |
| `HouseNumber` | an invented blurry house number in the old reCAPTCHA strip | Street View house numbers (m02 · "House") |
| `PhotoType` | a photo with an answer box; typed answer, red squiggle on a typo | von Ahn's first idea, people couldn't spell (m03b, c13r · "spell") |
| `Labels` ⇧ | a street photo with red training-data boxes ("bus", "car", "person") | every square became a label (c07r · "square", "label") |
| `Outline` | square photo crop, ring draws around the object whose edge is argued | where the hydrant ends (m07 · "ends") |
| `Blocked` | our own "access denied" card with a crossed-out appeal button | no appeal (v05 · "appeal") |
| `PageQuote` ⇧ | a few quoted words on paper, typed on their word | Google's own terms (v03b · "hardware") |
| `Captcha4` with new photos | buses (NYC), crosswalks (SF, CC0), hydrants (Miami, New Orleans) | m03, m04, m06, u01b, c10r, f02b |
| `IconRow marks` / `morph` ⇧ | per-item ✓/✗ (votes); robots turning into people one by one | most people decide (c08r); "the robots a little more human" (f03) |
| `TwoWords redact` | the offensive second word as a black bar | the "Christians" pair (b06) |
| 25 new `LineIcon`s | cash, church, car (camera mast), camera, flag, pin, map, box, grid, checkbox, checkbox2, cloud, building, browser, clock, worker, monitor, laptop, fingerprint, shield, cookie, key, face, iris, newspaper | throughout acts 4–9 |

## captchas-3min v5 (2026-10-07 evening) · `engine/src/visuals/captchas.tsx` + `ds/kit.tsx`

48 shots. All `new`. The v4 visuals below are `retired` (owner: too many words, off-topic corner, wrong captcha).

| Beat · shot | Picture | Lands on |
|---|---|---|
| h00 (new line "Select all squares with traffic lights. Simple, right?") | `Captcha4`: real 4 × 4 challenge, 7 squares picked with clicks; then the cursor hesitates on square 10, ringed | "traffic", "right" |
| a02 | `Captcha4` (ring on square 10) + `Square`: that square big, the red sliver ringed, "count?" | "stared", "corner" |
| a03 | doc drawing → 819,000,000 hours + checkbox → 90,000+ years | "819", "90" |
| a04 | hourglass draining → hand on mouse photo | "someone" |
| o01 | calendar 2000 + envelope "yahoo mail" → 12 robots + 12 envelopes popping in | "2000", "Yahoo", "Robots" |
| o02 | CMU photo + desk drawing → Polaroid "luis von ahn" | "student", "His" |
| o03 | one warped word → person ✓ / robot ✗ | "human", "computer" |
| o04 | calendar 2003 → CAPTCHA (red C) | "name" |
| o05 | 10 s ring + two-word captcha → 200,000,000 a day | "10", "200" |
| o06 | 63 years | "63" |
| o06b | Polaroid on stage + speech bubble "so then I started feeling bad." | "number" |
| o07 | red "?" → bubble "what if it did real work?" | "what" |
| b00 | checkbox ticked by a cursor | "box" |
| b01 | two-word reCAPTCHA → known word ✓ (teal ring) / book word (red ring) | "One", "test", "book" |
| b02 | book scanner photo + 30% missed → eye ✓ | "30", "Your" |
| b03 | known ✓ / mystery word → 5 strangers ✓ → open book | "guess", "strangers", "book" |
| b04 | 1,000,000,000+ people + 15 people | "billion" |
| b05 | contract ✗ / coin ✗ → checkbox ticked | "signed", "paid", "logging" |
| g01 | calendar 2009 + Google Blog headline boxed → "Teaching computers to read" underlined | "Google", "words" |
| g02 | receipt PRICE stamped UNDISCLOSED → 100,000+ websites / 200 million answers a day | "paid", "look" |
| g04 | Polaroid with notes "same play", "again" → calendar 2011 + Wikipedia Duolingo "Founded 2011" boxed | "same", "2011" |
| g05 | desk + EN → ES docs → CNN / BuzzFeed with coins (plain type, no logos) | "translated", "CNN" |
| g03 | six books → Street View car photo | "Next" |

## captchas-3min v4 (2026-10-07) · retired

| Beat | Visual | Shows | Lands on | Status |
|---|---|---|---|---|
| a02 | `ImageGrid` | reCAPTCHA v2 grid re-created around real street photos; the corner square gets a red ring | "stared" | new |
| a02 | `Loupe` | that square pulled out big, "does this corner count?" | "stared" / "corner" | new |
| a03 | `StudyCard` ⇧ | the UC Irvine paper's title block on paper, 819,000,000 counting up | "819" | new |
| a03 | `YearsMath` ⇧ | hours ÷ 8,766 = years, plus 94 cells (1 cell = 1,000 years) filling | "90" | new |
| a04 | `Kinetic` (full, red glow, over a hand-on-mouse photo) | three lines landing on their words | "All", "vanish", "someone" | new |
| a05 | chapter | Internet Archive book scanner photo, act title | "dark" | new |
| o01 | `SignupForm` | a free-email sign-up form refilled by a script, faster and faster (illustration) | frame 0 | new |
| o01 | `AccountLog` | server log of new accounts, counter to 1,000,000, every row flagged BOT | "Yahoo", "robots", "millions" | new |
| o02 | `Photo` + `AnnotatedPrint` | Carnegie Mellon campus; polaroid of von Ahn with handwritten red arrows "first-year phd", "carnegie mellon" | "first", "Carnegie" | new (v3, replaces SubjectFile) |
| o03 | `Reader` × 2 | same warped word: a human types it (PASS), a computer garbles it (FAILED stamp) | "human", "computer" | new |
| o04 | `Acronym` | C A P T C H A, then the full name with initials in red | "2003", "CAPTCHA" | new |
| o05 | `Stopwatch` + `BigCount` ⇧ | 10 s ring; 200,000,000 puzzles a day | "10", "200" | new |
| o06 | `NumberSlam` ⇧ | 63 years, "every single day", our arithmetic plate | "63", "every" | new |
| o06b | `Photo` + `QuoteSlip` ⇧ | Luis on stage; "So then I started feeling bad." with a highlighter sweep | "said", "feel" | new |
| o07 | `BigCount` + `QuestionBubble` | 555,556 hours a day thrown away; the question typed into an outline bubble | "dangerous", "what" | new |
| b00 | `CheckboxJob` | the real "I'm not a robot" box; job 1 "stop the robots", job 2 "a second job" | "box", "second" | new |
| b01 | `TwoWord` + `Legend` | two-word reCAPTCHA; word 1 ringed teal (the test), word 2 ringed red (from a book) | "test", "book" | new |
| b02 | `ScannedPage` + `Percent` | Dickens line where OCR fails on 7 words; ≈30 %; "your eyes read them" | "missed", "30", "eyes" | new |
| b03 | `VoteFlow` ⇧ | 4-step flow: known word, guess, strangers agree, the book gets its word | "known", "guess", "strangers", "book" | new |
| b04 | `PeopleDots` ⇧ | 1,100 dots = 1.1 billion people, filling as the number is said | "billion" | new |
| b05 | `Ledger` + `LoginBox` | "signed up: nobody", "got paid: nobody"; a login box clicked "Log in" | "signed", "paid", "logging" | new |
| g01 | `BlogProof` ⇧ | the real 2009 Google Blog page, red box on the headline; verbatim quote slip | "Google", "words" | new |
| g02 | `Receipt` + `CameWith` | the sale receipt with UNDISCLOSED stamp; 100,000+ sites, 200 million answers a day | "Google", "paid", "came" | new |
| g04 | `Track` ⇧ | 2000 → 2003 → 2009 → 2011 Duolingo | "same", "2011" | new |
| g05 | `Translate` + `Invoice` | an article translated by learners; CNN and BuzzFeed paid, learners got free lessons | "translated", "CNN", "paid" | new |
| g03 | chapter | Street View car photo, "Next: eyes on the street" | "eyes" | new |
