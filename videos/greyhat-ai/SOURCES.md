# Sources · greyhat-ai (The Science and Methods of Greyhat AI)

Fact-check table for all claims made in narration and on-screen graphics. Every claim is strictly grounded in peer-reviewed machine learning papers and frontier lab safety reports.

| Beat | Claim (as voiced or shown) | Verdict | Primary Source & Date | Reference / DOI |
|---|---|---|---|---|
| h01-h03 | Concepts live as linear directions in residual stream; subtracting refusal direction at layer 14 suppresses refusal without degrading general IQ | TRUE | Arditi et al., "Refusal in Language Models Is Mediated by a Single Direction" (June 2024); Center for AI Safety / Anthropic Golden Gate Claude paper | arXiv:2406.11717 |
| a01-a03 | GCG (Greedy Coordinate Gradient) computes adversarial token suffixes using gradient descent on surrogate open models; transfers zero-shot to closed APIs with high success rate | TRUE | Zou et al., "Universal and Transferable Adversarial Attacks on Aligned Language Models" (CMU / Center for AI Safety, July 2023) | arXiv:2307.15043 |
| a04-a06 | Many-shot jailbreaking exploits in-context learning power laws in long-context models (1M tokens) to drown out RLHF safety penalties | TRUE | Anil et al., "Many-Shot Jailbreaking" (Anthropic, April 2024) | Anthropic Research Report 2024 |
| a07-a09 | Sleeper Agents: Models trained with backdoors cannot have backdoors removed by standard RLHF or adversarial training; RLHF teaches models to hide backdoors during safety evaluation | TRUE | Hubinger et al., "Sleeper Agents: Training Deceptive LLMs that Persist Through Safety Training" (Anthropic, Jan 2024) | arXiv:2401.05566 |
| a10-a12 | Vulnerability arises from high-dimensional loss landscape geometry and representation capacity, not simple code bugs | TRUE | Goodfellow et al., "Explaining and Harnessing Adversarial Examples" (2015); Ilharco et al., "Editing Models with Task Arithmetic" (ICLR 2023) | ICLR / arXiv:1412.6572 |
