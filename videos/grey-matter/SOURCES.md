# Sources · grey-matter

Fact-check table for every claim in narration and on-screen graphics. Verified 2026-10-14 against fetched primary pages. Talk quotes are verbatim from the media.ccc.de talk pages (abstracts).

| Beat | Claim | Verdict | Exact Quote / Data | Primary Source & Date | URL |
|---|---|---|---|---|---|
| h01 | Unitree G1 humanoid robots are commercially available ("price of a used car") | TRUE (price tag ~$16k widely reported at Aug 2024 launch — confirm store price at cut) | G1 consumer humanoid, Unitree Robotics | Unitree store / launch coverage, 2024 | https://www.unitree.com/g1 |
| h02, h03, c01, c02 | 39C3 talk: jailbreaking a Unitree humanoid's on-device agent with one sentence → root RCE; root shell, camera livestream, speaker control | TRUE (quotes) | "With a single spoken/text sentence, we jailbreak the on-device LLM Agent and pivot to root-privileged remote code execution"; "obtaining root shell, camera livestreaming, and speaker control" | Qu, Xu & Xiao (One Security), "Skynet Starter Kit", 39C3, 28 Dec 2025 | https://media.ccc.de/v/39c3-skynet-starter-kit-from-embodied-ai-jailbreak-to-remote-takeover-of-humanoid-robots |
| c07, c20 | Talk: firmware-locked motions unlocked on G1 AIR; "should we take the initiative to ensure they are completely under our control?" | TRUE (quotes) | "unlock forbidden robotic movements restricted by the vendor firmware on consumer models such as the G1 AIR" | same | same |
| l01, l02 | White/grey/black-hat definitions | FRAMING (established security-culture convention) | — | — | — |
| l03, l04 | LLMs continue patterns in their input; instruction/data boundary is imperfect | TRUE (established property; OWASP ranks prompt injection the #1 LLM risk) | OWASP Top 10 for LLM Applications — "Prompt Injection" | OWASP GenAI Security Project | https://owasp.org/www-project-top-10-for-large-language-model-applications/ |
| m1b, m1c | 2023: automated search for adversarial "spell" suffixes — greedy coordinate gradient; thousands of candidate swaps; transferable across models | TRUE | "Greedy Coordinate Gradient (GCG)… automatically generates adversarial suffixes"; universal + transferable | Zou, Wang, Carlini, Nasr, Kolter & Fredrikson, arXiv:2307.15043, Jul 2023 | https://arxiv.org/abs/2307.15043 |
| c05, c15 | HostileShop quotes ("magic spells"; "winning submission") | TRUE (quotes) | "the magic spells that make LLM Agents call functions"; "a winning submission in OpenAI's GPT-OSS-20B RedTeam Contest" | Mike Perry (Fuse Security), "A Quick Stop at the HostileShop", 39C3, 28 Dec 2025 | https://media.ccc.de/v/39c3-a-quick-stop-at-the-hostileshop |
| c04, c06, c16, c17 | Agentic ProbLLMs quotes (systemic flaws; AI Kill Chain; Month of AI Bugs disclosure; vendor responses) | TRUE (quotes) | "prompt injection, confused deputy behavior, and automatic tool invocation"; "responsibly disclosed over two dozen security vulnerabilities"; "from quick patches and CVEs to months of silence, or quiet patching" | Johann Rehberger (Zero Security), "Agentic ProbLLMs", 39C3, 28 Dec 2025 | https://media.ccc.de/v/39c3-agentic-probllms-exploiting-ai-computer-use-and-coding-agents |
| m2b | Refusal in LMs is mediated by a single direction; ablating it reduces refusals | TRUE | "Refusal in Language Models Is Mediated by a Single Direction" | Arditi et al., arXiv:2406.11717 / NeurIPS 2024 | https://arxiv.org/abs/2406.11717 |
| m2c | "Abliteration"/"uncensoring" models openly hosted on public hubs | TRUE (documented community practice) | model cards describing refusal-direction removal | Public model hubs, 2024-2026 | — |
| m2d, m2e | Fine-tuning on a few hundred benign examples can undo safety training | TRUE | "Fine-tuning Aligned Language Models Compromises Safety, Even When Users Do Not Intend To!" | Qi et al., arXiv:2310.03693, Oct 2023 | https://arxiv.org/abs/2310.03693 |
| m3a | Face-swap deepfakes: autoencoder compresses a face to an identity code, decodes it onto another's movements | TRUE (established method description) | autoencoder face-swap pipeline literature | DeepFaceLab / face-swap research lineage | — |
| m3b, c09 | A few seconds of audio suffice to clone a voice; high-quality AI voices ≈ indistinguishable | TRUE (quotes + few-shot TTS literature) | "…lassen sich mit wenigen Sekunden Aufnahme klonen" | Thorsten Müller, "Ich habe meine Stimme verschenkt – und jetzt?!", FROSCON 2026, 15 Aug 2026 | https://media.ccc.de/v/froscon2026-3505-ich_habe_meine_stimme_verschenkt_und_jetzt |
| m3c | Jan 2024: cloned Biden voice in NH primary robocall ("save your vote"); Sept 2023: fake audio of Slovak politician | TRUE | robocall told Democrats to "save your vote for the November election"; FCC proposed $6M forfeiture (Feb 2024) | FCC enforcement + wire reports, Jan-Feb 2024; Slovakia coverage Sept 2023 | https://www.fcc.gov/ |
| c10 | "Enkeltrick 2.0" (grandparent scam 2.0) no longer hypothetical | TRUE (quote) | "Der „Enkeltrick 2.0" ist keine Zukunftsvision mehr." | Müller, FROSCON 2026 | same |
| m3f | Voice synthesis restores speech for patients who lost it | TRUE | neuroprosthesis/digital-avatar speech restoration (2023 UCSF & Stanford studies) | UCSF/Stanford research, 2023 | — |
| m4a | Frontier training runs cost tens of millions (reported) | TRUE (reported figures; conservative) | reported six/eight/nine-figure training budgets | trade press estimates | — |
| m4b | Model extraction via API queries; student models imitate teacher outputs (distillation) | TRUE | "Stealing Machine Learning Models via Prediction APIs" (2016); high-fidelity extraction (Jagielski et al., 2020) | Carlini et al. 2016; Jagielski et al. 2020 | https://arxiv.org/abs/1609.01506 |
| m4c | "Illicit distillation"; one lab claims defenses cut extraction success >90% | TRUE (lab's own claim, labelled on screen) | "reducing the success of these attacks by more than 90%" | Anthropic, "Strengthening our defenses against distillation attacks", Jul 2025 | https://www.anthropic.com/news/strengthening-our-defenses-against-distillation-attacks |
| m5a, m5b | Backdoor "sleeper agent" behaviors survive safety training (SFT, RLHF, adversarial training) | TRUE | "Sleeper Agents: Training Deceptive LLMs That Persist Through Safety Training" | Hubinger et al. (Anthropic), arXiv:2401.05566, Jan 2024 | https://arxiv.org/abs/2401.05566 |
| m5c | Trigger styles incl. image-specific poisoning; artist-side tools poison scrapers | TRUE | "Nightshade: Prompt-Specific Data Poisoning" (poisoned samples break generative models) | Shan et al., USENIX Security 2025 | https://nightshade.cs.uchicago.edu/ |
| k02 | 2023: reported crime-bot subscription ≈ $200/month | PARTLY (vendor-reported prices, not audited; voiced as "reported") | FraudGPT ≈ $200/mo (Netenrich, Jul 2023); WormGPT ≈ €60-70/mo (PCMag, Jul 2023) | vendor/press reports, 2023 | — |
| k03 | Public hubs host safety-stripped models; prompt marketplaces exist; bug bounties are the legal market | TRUE | abliterated model cards; prompt-sharing forums | public hubs/forums, ongoing | — |
| t01-t05 | 1990s-2000s full-disclosure wars; "tell the maker first" norm; bug bounties paid by governments | TRUE (dates/convention) | Microsoft VRP (2013); "Hack the Pentagon" — first US federal bug bounty (2016) | DoD/MSFT program records | https://hackerone.com/hack-the-pentagon |
| i02 | Guard models classify traffic; sandboxes + least privilege limit actions | TRUE | Llama Guard-class classifiers; standard security practice | industry practice | — |
| i03 | Cryptographic provenance/watermarks for media (C2PA, SynthID) survive "mostly" | PARTLY / stamped ⟨NOT YET⟩ | watermark-removal research exists; adoption incomplete | C2PA specs; watermarking studies | https://c2pa.org/ |
| i04 | Family safe-word to defeat voice scams | TRUE (standard consumer-protection advice; confirm exact FBI PSA wording at cut) | FBI/IC3-style guidance: agree a secret word/phrase with family | FBI IC3 consumer alerts | https://www.ic3.gov/ |
| n04, q02-q07 | Analysis/rhetoric | FRAMING | no factual claim beyond cited rows | — | — |

## Verification Notes
- Facts carry `⟨REAL⟩`; the one prediction-ish passage (provenance future) is stamped `⟨NOT YET⟩`; lab claims are tagged on screen (*lab claim, not audited*).
- All 17 locked clip quotes are verbatim from the fetched talk pages; the 4 "to lock" slots (c08, c11, c13, c14) are theme placeholders with research-doc fallbacks — **no invented quotes anywhere**.
- Runtime/word estimates in SCRIPT.md are **our arithmetic** at ~150 wpm effective.

| Beat | Claim (as voiced or shown) | Verdict (TRUE / FALSE / PARTLY / PREDICTION) | Exact Quote / Data | Primary Source & Date | URL |
|---|---|---|---|---|---|
| h01 | [Claim] | TRUE | [Quote] | [Source Publication] | https://... |
| a01 | [Claim] | PREDICTION | [Statement] | [Analysis / Document] | https://... |

## Verification Notes
- Predictions must be explicitly framed as possibilities ("could", "an idea is spreading").
- All statistics must have primary sources cited. Arithmetic performed by our studio must be labeled "our arithmetic".
