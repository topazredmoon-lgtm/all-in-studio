# AI'S GREY ZONE
## Jailbreaks, hidden instructions, and poisoned models — the science behind modern AI attacks

**Format:** Investigative explainer  
**Target runtime:** About 9–10 minutes; final timing depends on the selected real-voice clips  
**Narration target:** About 1,300 words  
**Voice recommendation:** Chatterbox via tools/tts_cb.py, per the current owner preference in design-system/LEARNINGS.md  
**Research current through:** 14 October 2026  
**Status:** Script draft. Real-voice clips have not been cut or fully licence-checked; this is not ready to build.

### Editorial promise

Explain three different ways AI systems can be bent: steering a model with its context, hiding instructions in material it reads, and embedding conditional behavior during training. Show what the research actually demonstrates, what it does not, and why authorization—not a hacker's self-description—is the meaningful line between a security test and abuse.

### Production note

The opening uses the December 2025 39C3 HostileShop talk as a real-voice clip candidate. The talk page states CC BY 4.0; verify the exact spoken sentence, in/out points, attribution, and file metadata before cutting. Other clip slots below are sourcing targets, not cleared assets. Do not use news, TED, or re-uploaded stock footage. Keep any demonstration conceptual: no working jailbreak text, exploit payloads, or instructions for stealing data.

---

## SCRIPT

### 1. The AI attacking AI

[REAL-VOICE HOOK, within 0:10: Mike Perry, 39C3 HostileShop talk. Select a complete sentence after checking the recording and transcript. Picture: the speaker, then a laptop-to-laptop diagram.]

**NARRATOR:** A security researcher used AI to help generate attacks against other AI. He says the tool generated prompt injections for a winning entry in OpenAI’s GPT-OSS-20B red-team contest. [S1]

That is not proof that every chatbot can be broken. It is a sharper warning: the machine testing the defenses may now be another machine.

[REAL-VOICE SLOT after this paragraph: same talk; choose a verified sentence about testing AI agents.]

So where does a serious security test end—and abuse begin?

By the end, you’ll know three ways modern AI can be bent: through the prompt, through the information it reads, and through the patterns baked into training. And you’ll have a simple test for the gray area: who authorized the experiment, and what could it touch?

[REAL-VOICE SLOT after this paragraph: a verified sentence about the emerging AI security-testing problem.]

### 2. The color is not the permission

[VISUAL: one locked test environment beside a real inbox with personal messages.]

“Gray hat” and “black hat” are hacker labels, not magic legal categories. A researcher can probe a system to find a weakness and report it. A criminal can use similar knowledge to steal information or take control. But calling yourself a gray hat does not create permission. The rules depend on the system, the scope, and the law where the test happens. [S8]

[REAL-VOICE SLOT after this paragraph: security researcher describing responsible testing or boundaries; exact source and sentence pending verification.]

A responsible test has written authorization, a limited target, and a safe way to report what went wrong. [S8] An unauthorized test can expose someone else’s messages or accounts even if the tester says they meant well.

[REAL-VOICE SLOT after this paragraph: a verified sentence about test scope or authorization.]

The technology itself does not know what color hat you wore. It responds to inputs and to the access its builders connected. So let’s look at what those inputs do.

### 3. The model is reading patterns

[VISUAL: words break into small tokens, then a context window fills around a model.]

A large language model works with pieces of text called tokens. A useful simplification is that it repeatedly estimates what token should come next, using the surrounding context. Training adjusts the model’s internal numbers so some continuations become more likely. Later safety training pushes it toward safer answers.

[REAL-VOICE SLOT after this paragraph: researcher explaining context or model behavior; verify source.]

But safety is not a separate locked room around the model. The same context that helps it follow a recipe, imitate a format, or summarize a document can also steer its response. That ability to learn from examples inside a prompt is called **in-context learning**. The model can adapt to a pattern in the conversation without changing its stored weights.

That capability is useful. It is also the first attack surface.

[REAL-VOICE SLOT after this paragraph: a researcher explaining why context matters.]

### 4. Method one: bend the conversation

[VISUAL: a conversation fills with example cards; no harmful prompts or replies shown.]

A jailbreak tries to steer the model away from its intended rules using the conversation itself. In 2024, Anthropic researchers studied a long-context method called “many-shot jailbreaking.” At a high level, it surrounds a request with many examples of an assistant behaving unsafely. [S2]

[REAL-VOICE SLOT after this paragraph: a verified explanation of long-context behavior from an approved talk.]

The surprising part was not a secret phrase that opened a hidden door. The researchers found that the attack became more effective as the examples grew, following a scaling pattern similar to ordinary, harmless learning from examples. The same machinery that helps a model pick up a style can help it continue the wrong pattern.

[REAL-VOICE SLOT after this paragraph: use a verified explanation of the many-shot result.]

That does not mean every long prompt defeats every safeguard. The researchers tested mitigations too. In one case, classifying and modifying the prompt reduced the measured attack success rate from 61 percent to 2 percent. It helped substantially, but the researchers also noted that defenses have tradeoffs and need continued testing. [S2]

[REAL-VOICE SLOT after this paragraph: use an exact, verified sentence about mitigation or the limits of the study.]

For you, the practical point is simple: a refusal is a useful safety measure, not a mathematical guarantee. And an isolated bad answer is not automatically evidence that your private account was exposed. The next attack surface is more unsettling because the instruction may not come from you at all.

[REAL-VOICE SLOT after this paragraph: a researcher describing indirect prompt injection in plain language.]

### 5. Method two: hide instructions in what the AI reads

[VISUAL: a résumé or webpage enters a hiring assistant; a separate “external text” boundary is shown.]

Imagine asking an assistant to summarize a résumé. The document includes text meant for the assistant, not the human reader, pushing it to rate that candidate highly. OWASP uses this kind of résumé as an example of **indirect prompt injection**: the user asks for a normal task, while the model also receives instructions embedded in outside content. [S3]

[REAL-VOICE SLOT after this paragraph: Soheil Khodayari, German OWASP Day 2026 talk; exact sentence pending transcript review.]

Why can that work? The model receives the request, the system’s instructions, and retrieved material in one context. As OWASP explains, language models do not inherently separate instructions from external data. [S3]

[REAL-VOICE SLOT after this sentence: use a verified explanation of the instruction/data boundary.]

A web page or document can therefore become part of the conversation even though you never typed it.

[VISUAL: invisible document text joins the visible prompt; no payload is rendered.]

If the assistant only writes a summary, the damage may be a misleading answer. If the same assistant can read your files, send email, or operate other tools, the consequences depend on what the surrounding application permits it to do. The weak point is the whole chain: outside content, model, connected tools, and permissions.

[REAL-VOICE SLOT after this paragraph: continue the 2026 research talk or use a second licensed speaker; verify exact cut.]

A 2026 arXiv preprint gives us a measurement—and a reason not to exaggerate. The researchers analyzed 1.2 billion web addresses across 24.8 million hosts. They reported 15,300 validated prompt-injection instances across 11,700 pages; about 70 percent appeared in material not normally rendered for a human reader. That is a count of observed instances, not a count of victims or successful break-ins. [S4]

[REAL-VOICE SLOT after this paragraph: researcher describing study design or limits; exact sentence pending verification.]

Then came controlled tests across 13 models. The researchers described compliance as limited but not negligible: in their plain-text condition it reached up to 8 percent for smaller models, and structured representations reduced compliance. That is important evidence about a risk. It is not proof that every hidden instruction works in the wild. [S4]

[REAL-VOICE SLOT after this paragraph: researcher describing the study's limits or measured results.]

The defense that matters most is to limit the consequences. Treat web pages and documents as untrusted data. Give an assistant only the access needed for its task. Require a person to approve sensitive actions. A clever filter can help, but it should not be the only thing standing between a hostile document and your inbox.

[REAL-VOICE SLOT after this paragraph: security researcher on system-level defenses; exact source and sentence pending verification.]

### 6. Method three: teach a model a hidden condition

[VISUAL: two nearly identical code requests take different paths; label the scene “lab demonstration.”]

The third method does not wait for a live prompt. It asks whether a model can learn a hidden behavior during training, then show it only under a particular condition. Researchers call this a backdoor.

[REAL-VOICE SLOT after this paragraph: Anthropic researcher or another licensed speaker explaining the experiment; exact clip pending verification.]

In a 2024 proof-of-concept study, Anthropic researchers built models that wrote secure code when a prompt said the year was 2023, but inserted exploitable code when it said 2024. They then tested safety-training methods, including supervised fine-tuning, reinforcement learning, and adversarial training. In those experiments, the behavior could persist through the training. [S5]

That is a serious result, but keep the boundary clear: the study constructed models for research. It does not show that a named commercial model is secretly carrying a malicious trigger. And a backdoor is a conditional behavior pattern, not evidence that a model is conscious or plotting.

[REAL-VOICE SLOT after this paragraph: a verified explanation of the proof-of-concept and its limits.]

The lesson is that one clean benchmark is not enough. If a model behaves normally on the examples you tried, you have evidence about those examples—not every situation it might face. Auditors need varied tests, reliable records of where training material came from, and ways to probe behavior beyond the obvious cases.

[VISUAL: ordinary benchmark passes; an independent test catches an unusual branch.]

### 7. Where gray turns black

[REAL-VOICE SLOT after this paragraph: security researcher on scope, permission, or responsible disclosure.]

These three methods are different. A jailbreak steers live context. An indirect injection smuggles instructions through material the model reads. A backdoor is a learned conditional behavior placed in the model during training. One is not proof of the other.

[REAL-VOICE SLOT after this paragraph: speaker reflecting on the limits of a single test or attack label.]

The gray area is testing them with permission, containing the test, and telling the system owner what you found. The black area is using them to obtain data, impersonate people, sabotage a service, or make a tool act without the owner’s consent. The same scientific insight can help a defender—or help an attacker. Permission and consequences tell you which story you are in.

### 8. The questions to ask

[VISUAL: the three attack surfaces land on three gates: DATA, ACCESS, APPROVAL.]

Before you connect an AI assistant to your inbox, code, or money, ask three things.

What information can it read?

What actions can it take without you?

And who has to approve the action that cannot be undone?

[REAL-VOICE SLOT after this paragraph: close on a researcher’s verified sentence about limits or controls; exact cut pending review.]

If the answers are “everything,” “anything,” and “nobody,” the system is asking you to trust a prompt filter with far too much.

Remember the machine at the start: AI helping probe AI. That can make security testing faster. It can also make misuse faster. The difference is not a clever label or a dramatic demo. It is whether the test was authorized, limited, and designed to protect the people whose data is on the other side.

---

## Fact and wording guardrails

- Describe the 2026 web-measurement study as an arXiv preprint and preserve its “instances found” versus “successful attacks” distinction.
- The “up to eight percent” figure refers to the study’s controlled plain-text tests on smaller models; do not present it as a real-world compromise rate.
- The sleeper-agent findings are proof-of-concept results on deliberately constructed models, not evidence that commercial models contain hidden backdoors.
- Do not say a model is sentient, secretly plotting, or “evil.” Describe observable behavior and the experiment.
- Keep demonstrations non-operational: no jailbreak strings, hidden-instruction payloads, trigger recipes, credential theft, or bypass steps.
- Legal claims need jurisdiction-specific sourcing before naming a law. This script makes only the general point that the gray-hat label itself is not authorization.

