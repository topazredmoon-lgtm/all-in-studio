# Sources — why-ai-dumber v3 (2-min sample, 2026-10-13)

Primary source for the whole film, used for every factual claim below:

> Shumailov, I., Shumaylov, Z., Zhao, Y., Papernot, N., Anderson, R., Gal, Y.
> **"AI models collapse when trained on recursively generated data."** *Nature* **631**, 755–759 (24 Jul 2024).
> https://doi.org/10.1038/s41586-024-07566-y · preprint and full figures: arXiv:2305.17493

| Beat | Claim as narrated | Status | Where it comes from |
|---|---|---|---|
| h00, a01 | "Ever get the feeling your AI is a little duller…", "what comes back is … mush" | **Framed as the viewer's own impression**, not asserted as fact about any product. No company or model is named or claimed to have got worse. | — |
| a02 | "There is a paper in Nature about exactly this" | **Fact** | The paper above; peer-reviewed, open access. |
| a03 | "a model has to eat the internet. Every page, every post, every review" | **Fact** (mechanism) | The paper's introduction: models are trained on large web-scraped corpora. |
| a04, a05 | "the internet is not written only by people any more", "machines write an enormous share of it now" | **Fact as to the mechanism, deliberately unquantified** | The paper's discussion of web data increasingly containing model-generated text. **No percentage is used anywhere in the script**: the published "% of the web is AI-written" figures disagree with each other, so the film says "an enormous share" and shows a picture rather than a number. |
| a06, a07 | "the next model learns from pages the last model wrote … drinks it straight back in" | **Fact** (mechanism) | Same: recursive training on model-generated data, the paper's premise. |
| a08 | "Model collapse" | **Fact** (the term) | The paper's own term and title. |
| a09, a10 | "In twenty twenty-four, researchers sealed the loop on purpose … trained a model on its own output. Then trained the next one on that." | **Fact** | The paper's experimental design: generational training, each generation trained on the previous generation's output. |
| a11 | "By the ninth generation, a small model given a passage about English church towers was writing about jackrabbit tail colours." | **Fact**, wording checked | The paper's worked text example (figure "Example of text outputs of an OPT-125m model affected by Model Collapse"): a **continuation** prompt about English medieval parish church towers / Perpendicular architecture; the **Generation 9** output degenerates into a list of jackrabbit tail colours. Checked against the arXiv full text on 2026-10-13 — see `RESEARCH_v3.md`. Two wordings were corrected from the first draft: it is a continuation prompt, not "a question", and the model is **a small language model** (OPT-125m), not "AI" in general. On-screen plate reads "after the experiment in Nature, Shumailov et al. 2024" because the picture is an illustration of the result, not the paper's figure. |
| a12, a13 | "The rare things went first… What survives is the middle." | **Fact** | The paper's central finding: recursive training loses the **tails of the true distribution** first, converging on the mean. |
| a14, a15, a16 | "not a bug anybody can patch", "No hack. No villain." | **Interpretation**, said as such ("it is what happens when…") | Follows from the paper's mechanism: collapse is a property of the training loop, with no attacker. |
| a17 | "already inside the tools you use every day" | **Framed as likelihood, not a measurement** | No specific product is named or claimed to be affected. |
| a18, a19 | "an answer that is slightly, confidently wrong" | **Interpretation** of the degradation the paper measures (increasing perplexity / loss of tails without an error signal). | — |
| a20, a21 | "There are fixes. Keep human writing. Label what the machines made. Pay for the real thing." / "Every one of those costs money." | **Fact** (the mitigations) + **interpretation** (the economics) | The paper's own discussion: preserving access to genuine human-generated data and distinguishing model-generated content at scale are what it says would be needed. The cost argument is ours and is said in our voice. |

## Clips and licences

**No clip is used in this sample.** A targeted search (media.ccc.de, Wikimedia Commons, ICLR/Simons/university
channels, researchers' own uploads) found nothing on model collapse or synthetic training data whose licence could be
verified as CC BY / CC BY-SA / CC0 / public domain on the page itself — the closest topical hit, a 37c3 talk on
self-cannibalising AI, shows no licence string at all. Under the money rule an unverifiable licence is a no, so the
sample stays picture-led. Full search log: `RESEARCH_v3.md`.

Nothing else on screen is licensed material: every image in this film is an original engraving plate drawn in
`engine/src/ds/plates/` (see `design-system/PLATES.md`). No public-domain base art was traced, so there is no
attribution block to carry; `LICENCES.md` is therefore still not needed.
