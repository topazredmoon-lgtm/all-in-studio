# RESEARCH v3 — why-ai-dumber

## JOB 1 — Shumailov et al. church-tower example

Source checked: arXiv:2305.17493 full text (PDF, "Model Collapse" section, figure captioned "Example of text outputs of an OPT-125m model affected by Model Collapse"). The Nature full text (nature.com, doi 10.1038/s41586-024-07566-y) redirected to an identity-provider login and could not be read, so the Nature version is NOT verified line by line.

(a) Prompt topic: CONFIRMED, with a wording correction. The input is an opening passage about English medieval parish church towers and Perpendicular architecture ("some started before 1360 ... the parish church towers based on early examples of Perpendicular"). It is a text-continuation prompt, not a question. Do not say "asked a simple question".

(b) Generation 9 output: CONFIRMED in substance. Gen 9 reads "architecture. In addition to being home to some of the world's largest populations of black-tailed jackrabbits, white-tailed jackrabbits, blue-tailed jackrabbits, red-tailed jackrabbits, yellow-..." The output lists jackrabbit tail colours. Earlier generations (Gen 0, Gen 1, Gen 7) stay on architecture or drift into unrelated text.

(c) Generation 9: CONFIRMED. The figure shows Gen 0, Gen 1, Gen 7 and Gen 9.

Other corrections:
- The model is OPT-125m, a small language model. Say "a small language model" rather than "AI".
- The Nature correction notice (PMC11981929) concerns a parameter in the theory section (alpha/gamma changed to beta/gamma). It does not touch this example.

Suggested narration (about 20 words, paraphrase, no quotation needed):
"By the ninth generation, a small language model asked to continue a passage about English church towers was producing lists of jackrabbit tail colours."
Shorter alternative: "By the ninth generation, the model that started on English church towers was listing jackrabbit tail colours."

Supporting sentence from the paper (quote under 15 words): "home to some of the world's largest populations of black-tailed jackrabbits" (12 words).

Before publishing: check the Nature Figure 1 caption on nature.com in a browser (logged-out view may show it) to confirm the same OPT-125m example is used there. Cite the arXiv version if the Nature text cannot be checked.

## JOB 2 — Licensed clip of a real person on model collapse / AI training-data limits

Result: NOTHING CLEARS THE RULE. No candidate verified.

Checked:
- media.ccc.de search "model collapse" (46 results, first 25 shown). No talk showed a licence string in the page content. Closest topical hit: "Self-cannibalizing AI", Ting-Chun Liu and Leon-Etienne Kühr, 37c3-12125, 53 min, https://media.ccc.de/v/37c3-12125-self-cannibalizing_ai. Its page shows no CC licence string, only "by Chaos Computer Club e.V.". Topic is recursive image generation, not model collapse as such. REJECTED: licence not verifiable.
- ICLR 2025 virtual page for Sanmi Koyejo, "Model Collapse Does Not Mean What You Think", https://iclr.cc/virtual/2025/37806. No video link and no licence string. REJECTED.
- Simons Institute (Haifeng Xu talk), Shanghai UFE (Caixing Wang talk), Texas A&M TAMIDS seminar: no licence string shown. REJECTED.
- Wikimedia Commons, university channels, researcher uploads: searches returned only papers, news and theses. No video found.
- Papers with CC BY 4.0 found (not video, so not usable for this job): Seddik et al., "How Bad is Training on Synthetic Data?", arXiv:2404.05090 (licence string on arXiv page: "CC BY 4.0"). Reference only.

Not checked because search did not surface them: specific YouTube lectures by Shumailov, Schaeffer, or other researchers; EU/UK/US government recordings on AI training data.

Recommendation: Do not use a clip from this search. Next step would be a targeted search of YouTube's Creative Commons filter with specific researcher names, then verify each YouTube page's "Reuse allowed under CC BY" label before use.
