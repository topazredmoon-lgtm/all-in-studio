"""Writes script.json for ai-ban, THE FULL FILM ("THE COMING AI BAN", owner 2026-10-11 late night on sample v5: "i like it xd
now the full video but please do a great job. put urself in the boots of the critical mind viewer.").
Spine = the owner's `owner_script.txt` scenes 01-18, in their order and punch; every line is either a sourced fact
(SOURCES.md) or said as a fear, and the narrator says which (REAL / NOT YET stamps). The opening is sample v5 unchanged.
Rules: LEARNINGS 60-74. Edit VO / SHOTS / CLIPS / ORDER, rerun, then `python tools/tts.py ai-ban`,
`python tools/voice_check.py ai-ban`, `python tools/build.py ai-ban`. The sample lives on in `gen_sample_v5.py`."""
import json
from pathlib import Path

HERE = Path(__file__).parent
A = "aiban/"


def split(L, R, cap=None, at=None, **kw):
    d = {"layout": "split", "L": L, "R": R, **kw}
    if cap: d["cap"] = cap
    if at is not None: d["at"] = at
    return d


def full(hero, cap=None, at=None, **kw):
    d = {"layout": "full", "hero": hero, **kw}
    if cap: d["cap"] = cap
    if at is not None: d["at"] = at
    return d


def icon(name, **kw): return {"v": "LineIcon", "surface": "bare", "name": name, **kw}
def row(name, n, **kw): return {"v": "IconRow", "surface": "bare", "name": name, "n": n, **kw}
def phone(mode, **kw): return {"v": "PhoneChat", "surface": "bare", "mode": mode, **kw}
def licence(kind, **kw): return {"v": "Licence", "surface": "bare", "kind": kind, **kw}
def hearing(img, **kw): return {"v": "Hearing", "surface": "bare", "img": A + img, **kw}
def listdoc(title, rows, **kw): return {"v": "ListDoc", "surface": "bare", "title": title, "rows": [r if isinstance(r, dict) else {"t": r} for r in rows], **kw}
def pieces(ats, **kw):
    return {"v": "Pieces", "surface": "bare", "pieces": [{"icon": i, **({"at": a} if a else {})} for i, a in zip(PIECES, ats)], **kw}
def flow(nodes, **kw): return {"v": "Flow", "surface": "bare", "nodes": [{"icon": n[0], "label": n[1], **({"at": n[2]} if len(n) > 2 else {})} for n in nodes], **kw}
def chat(ask, mode, **kw): return {"v": "ChatBox", "surface": "bare", "ask": ask, "mode": mode, **kw}
def tag(t, at=0): return {"t": t, "at": at}
def flag(country, label, **kw): return {"v": "Flag", "surface": "bare", "country": country, "label": label, **kw}
def cal(year, note=None, **kw): return {"v": "CalendarCard", "surface": "bare", "year": year, **({"note": note} if note else {}), **kw}
def bubble(text, **kw): return {"v": "Bubble", "surface": "bare", "text": text, **kw}
def calls(**kw): return {"v": "CallGrid", "surface": "bare", **kw}
def listing(ic, name, **kw): return {"v": "Listing", "surface": "bare", "icon": ic, "name": name, **kw}
def real(at=0): return {"t": "real", "at": at}
def notyet(at=0): return {"t": "not yet", "at": at}


PIECES = ["idcard", "chip", "brain", "contract", "lock"]  # the five pieces of the trap: your name, the chips, the weights, the licence, the lock
FAKE = "fake_face.jpg"
TRIP = "plan my trip to rome"

VO = {  # id: (vo, say or None). Acts follow owner_script.txt scenes; [Sxx] = owner scene.
    # 01 THE BAN [S01] = sample v5, approved by the owner
    "h01": ("Take a long look at the AI on your phone. Enjoy it while you still can.", "Take a long look at the AI on your phone. Enjoy it, while you still can."),
    "h02": ("Fake faces and voices, made with AI anyone can download. And in Washington and Brussels, a quiet idea is spreading: the public was never supposed to have this kind of power.", None),
    "h03": ("If it wins, open access to AI for ordinary people could be outlawed within a few years. No more free prompts. No more AI running privately on your own computer.", None),
    "h04": ("The golden age of consumer AI could be about to end. And the trap is being set by the very companies that built it.", None),
    "a01": ("Now, I won't feed you rumours. Some of what you're about to hear has already happened, and some hasn't happened yet. Every time, I'll tell you which is which.", None),
    "a02": ("And by the end, you'll see who wins when the trap snaps shut. And it isn't you.", None),
    # 02 THE BLUEPRINT [S02]
    "b01": ("To see why governments are nervous, start with the safety locks. When chatbots launched, their makers promised guardrails: rules that stop the AI from helping with anything dangerous. But those rules live inside the model, and they can be cut out.", None),
    "b02": ("Then the brains got out. An AI's brain is one big file called its weights, and in 2023, Meta put the weights of its Llama 2 model online for anyone to download.", "Then the brains got out. An AI's brain is one big file called its weights, and in twenty twenty-three, Meta put the weights of its Llama two model online, for anyone to download."),
    "b03": ("And researchers did exactly that. They stripped the safety training out of Llama 2 for less than two hundred dollars per model, on a single graphics card.", "And researchers did exactly that. They stripped the safety training out of Llama two, for less than two hundred dollars per model, on a single graphics card."),
    "b04": ("And in 2022, scientists flipped a drug-discovery AI to hunt for poisons instead of medicines. In six hours, it suggested about forty thousand toxic molecules.", "And in twenty twenty-two, scientists flipped a drug discovery AI to hunt for poisons instead of medicines. In six hours, it suggested about forty thousand toxic molecules."),
    "b05": ("So governments learned the hard way: the brain that writes your poem can be pointed at a weapon. You can't separate the teacher from the weapon.", None),
    # 03 THE PLAYBOOK [S03]
    "d01": ("And Washington has done this before. In the nineties, strong encryption, the maths that keeps your messages private, sat on America's munitions list, the same list as missiles.", None),
    "d02": ("When a programmer named Phil Zimmermann gave strong encryption away for free, he was put under criminal investigation for three years.", None),
    "d03": ("His answer was brilliant: he printed the code as a book, because try banning a book. A judge ruled that code is speech, and within a few years, most of those rules were relaxed.", None),
    "d04": ("With AI, Washington reached for the same playbook. In January 2025, the Commerce Department put export controls on the weights of the most powerful closed models. Four months later, the new administration scrapped them.", "With AI, Washington reached for the same playbook. In January twenty twenty-five, the Commerce Department put export controls on the weights of the most powerful closed models. Four months later, the new administration scrapped them."),
    "d05": ("So no, the AI on your computer is not contraband. Not yet. But the playbook hasn't gone anywhere.", None),
    # 04 THE PANIC [S04]
    "h05": ("Governments don't move fast for ethical debates. They move fast when the banking system is on fire.", None),
    "h05b": ("Even Sam Altman, who runs ChatGPT, warned America's central bank: some banks let you move money with just your voice.", "Even Sam Altman, who runs ChatGPT, warned America's central bank. Some banks let you move money using nothing but your voice."),
    "e01": ("Banking runs on one rule: verify the human. A signature, a photo ID, a voice on the phone, a face on a video call. AI can now fake every one of them.", None),
    "e02": ("In November 2024, the US Treasury warned banks about a rise in deepfake fraud, and a Federal Reserve governor called it an arms race.", "In November twenty twenty-four, the US Treasury warned banks about a rise in deepfake fraud, and a Federal Reserve governor called it an arms race."),
    # 05 THE PROOF [S05]
    "f01": ("Here's what that looks like. In early 2024, a finance worker in Hong Kong joined a video call with the company's finance chief and several colleagues. Everyone on that call, except the worker, was a deepfake.", "Here's what that looks like. In early twenty twenty-four, a finance worker in Hong Kong joined a video call with the company's finance chief and several colleagues. Everyone on that call, except the worker, was a deepfake."),
    "f02": ("The worker made fifteen transfers, about twenty-five million dollars, to the criminals. The company was Arup, the engineers behind the Sydney Opera House.", None),
    "f03": ("And faking a voice is the easy part.", None),
    "f04": ("That's the panic. And panic is how bans get written.", None),
    # 06 THE BLACK MARKET [S06]
    "g01": ("So could the companies just patch it? The black market answered. In 2023, a chatbot called WormGPT was sold on a hacker forum, built on a free open model, with every safety rule ripped out.", "So could the companies just patch it? The black market answered. In twenty twenty-three, a chatbot called WormGPT was sold on a hacker forum, built on a free open model, with every safety rule ripped out."),
    "g02": ("And criminals don't even need open models. They steal companies' cloud keys and run the big closed AIs on someone else's bill. Researchers worked out that could cost a victim over forty-six thousand dollars a day.", None),
    "g03": ("So the argument writes itself: as long as anyone can download a model, criminals have ammunition, and filters won't hold. That's the case you'll hear for locking it all down.", None),
    # 07 THE LICENCE [S07]
    "k01": ("So what would a ban actually look like? Nobody comes to switch off your computer. It looks a lot more like a licence.", None),
    "k02": ("In 2023, two US senators, Josh Hawley and Richard Blumenthal, proposed exactly that: a licence from a new oversight body before you build powerful AI.", "In twenty twenty-three, two US senators, Josh Hawley and Richard Blumenthal, proposed exactly that: a licence from a new oversight body, before you build powerful AI."),
    "k03": ("But the ID checks have started. In October 2025, the same two senators introduced a bill to make chatbots check every user's age, with a government ID or something like it. In China, some AI services already need your real identity.", "But the ID checks have started. In October twenty twenty-five, the same two senators introduced a bill to make chatbots check every user's age, with a government ID, or something like it. In China, some AI services already need your real identity."),
    "k04": ("Every prompt tied to your name, every answer logged in a government file? In America and Europe, not yet. But the ID check is the first brick.", None),
    # 08 THE CHIPS [S08]
    "m01": ("Next, the hardware. AI runs on special chips, and a bill in Congress, the Chip Security Act, would make exported AI chips prove where they are.", None),
    "m02": ("Nvidia, which makes most of them, insists its chips have no kill switches. China's internet regulator didn't buy it, and called Nvidia in over possible backdoors.", None),
    "m03": ("A chip that refuses to run any AI the government didn't approve? That doesn't exist. Not yet. But chips that report where they are, are already in a bill.", None),
    # 09 OPEN SOURCE [S09]
    "n01": ("The first target would be open source: free models that anyone can download, inspect, and run at home, with no company watching.", None),
    "n02": ("Now, to be fair, the news here is good, for now. In 2024, a US government report advised against restricting open models, and in 2025, the White House backed them.", "Now, to be fair, the news here is good, for now. In twenty twenty-four, a US government report advised against restricting open models, and in twenty twenty-five, the White House backed them."),
    "n03": ("But read the fine print: that report says keep the option to restrict them later. And one senator already wrote a bill under which downloading a Chinese AI could mean up to twenty years behind bars.", None),
    "n04": ("Today, it's Chinese AI. A law like that only needs one line changed.", None),
    # 10 THE BETRAYAL [S10-S11]
    "p01": ("Now ask the question nobody wants to answer. Who gains the most if public AI gets locked down? In 2023, the head of OpenAI sat in front of the US Senate and asked for this.", "Now ask the question nobody wants to answer. Who gains the most if public AI gets locked down? In twenty twenty-three, the head of OpenAI sat in front of the US Senate, and asked for this."),
    "p02": ("The media called it responsibility. Critics called it something else. AI pioneer Andrew Ng warned that some big tech companies would rather not compete with open source, and Meta's chief AI scientist, Yann LeCun, called it regulatory capture: writing the rules so that only you can follow them.", None),
    "p03": ("Think about what a licence does. OpenAI can afford the lawyers, the lobbyists and the audits. A ten-person startup can't, a university lab can't, and a teenager running a model on a laptop definitely can't.", None),
    "p04": ("Big tech doesn't fear rules it can afford. Rules like that are a moat around the castle, and you're on the outside.", None),
    # 11 THE HEIST [S12]
    "q01": ("And here's the irony. Where did these models come from? They learned from the public internet: books, articles, code and art, made by people who were never asked. When Britain proposed letting AI companies train on people's work for free, thousands of them pushed back.", None),
    "q02": ("Some of it was pirated. In 2025, Anthropic agreed to pay one and a half billion dollars to authors over pirated books. A judge had ruled that training on books you bought can be fair use, but a library of pirated copies was not.", "Some of it was pirated. In twenty twenty-five, Anthropic agreed to pay one and a half billion dollars to authors over pirated books. A judge had ruled that training on books you bought can be fair use, but a library of pirated copies was not."),
    "q03": ("So they took the world's knowledge, and now some of them want a licence system that would lock the door, and charge you rent.", None),
    # 12 THE FUTURE [S13-S15], said as fears
    "r01": ("If public AI were locked behind licences, what would replace it? You'd still have an assistant, but it wouldn't be yours. It would refuse more, it would be watched, and it could nudge what you buy.", None),
    "r02": ("You'd pay a monthly subscription to be supervised by an algorithm.", None),
    "r03": ("And bans have a history. Prohibition didn't stop alcohol in America, it handed it to gangsters. Ban the AI people want, and the black market grows. And the criminals who run these markets already work like real companies.", None),
    "r03b": ("It's already happening with chips: in 2025, the US charged people with smuggling restricted Nvidia chips to China.", "It's already happening with chips. In twenty twenty-five, the US charged people with smuggling restricted Nvidia chips to China."),
    "r04": ("Meanwhile, the powerful keep the strongest models. In 2025, the Pentagon signed deals worth up to two hundred million dollars each with OpenAI, Google, Anthropic and xAI. And armies are already planning around it.", "Meanwhile, the powerful keep the strongest models. In twenty twenty-five, the Pentagon signed deals worth up to two hundred million dollars each, with OpenAI, Google, Anthropic, and xAI. And armies are already planning around it."),
    "r05": ("Exemptions for them, a sanitised toy for you. Some call it cognitive feudalism: a few lords own the thinking machines, and everyone else rents.", None),
    # 13 THE TIMELINE [S16-S17]
    "s01": ("Look at the timeline, and here I have to be straight with you. Europe's AI Act is law, and its rules arrive in waves until 2027. In America, the biggest AI safety order was scrapped, and the White House wants fewer rules, not more.", "Look at the timeline, and here I have to be straight with you. Europe's AI Act is law, and its rules arrive in waves until twenty twenty-seven. In America, the biggest AI safety order was scrapped, and the White House wants fewer rules, not more."),
    "s02": ("So a ban won't come with a big announcement. If it comes, it comes in small steps: an ID check here, a licence there, a chip rule, a payment ban. First the ID, then the licence, then the crime.", None),
    "s03": ("We spent years arguing about whether AI would wake up or destroy the planet. Meanwhile, the real fight was over who gets to use it. A free person with a powerful AI is hard to control. A customer renting it through a filter is easy.", None),
    # 14 THE CHOICE [S18]
    "t01": ("Right now, ordinary people can still download and run powerful AI at home. That window is open. Learn how these models work, keep your own copies, and know your rights.", None),
    "t02": ("Because if this goes the wrong way, running your own AI won't be called programming. It'll be called a crime. And the people who took it away will tell you they did it to keep you safe.", None),
    "t03": ("Take a long look at the AI on your phone. Enjoy it while you still can.", "Take a long look at the AI on your phone. Enjoy it, while you still can."),
}

SHOTS = {
    # 01 THE BAN (sample v5)
    "h01": {"cuts": [
        full(phone("open", ask=TRIP, askAt=0, replyAt="phone"), "the AI on *your phone*"),
        full(phone("off", gateAt="still"), "while you *still can*", at="Enjoy")]},
    "h02": {"cuts": [
        full(hearing(FAKE, pill="not a real person"), "a *fake* face and voice"),
        split(hearing(FAKE, pill="not a real person"), icon("laptop", label="free download"), "AI *anyone* can download", at="made"),
        split(flag("usa", "washington"), flag("eu", "brussels", enter="Brussels"), "a *quiet* idea", at="Washington"),
        split(icon("people", label="the public"), phone("open", ask=TRIP, askAt=0, replyAt="power"), "never meant to have *this power*", at="public")]},
    "h03": {"cuts": [
        split(icon("people", label="ordinary people"), phone("off", gateAt="outlawed", enter="open"), "*outlawed* for ordinary people"),
        split(phone("off", gateAt=0), icon("clock", label="a few years", enter="within"), "within *a few years*", at="within"),
        split(icon("clock", label="a few years"), chat("help me write my cv", "refuse", refusal="Licence required.", askAt=0, replyAt="prompts"), "no more *free* prompts", at="No"),
        split(chat("help me write my cv", "refuse", refusal="Licence required.", replyAt=0), icon("laptop", label="your computer", mark="no", markAt="computer", enter="privately"), "not even on *your own* computer", at="privately")]},
    "h04": {"cuts": [
        split(phone("open", ask=TRIP, askAt=0, replyAt=0), icon("power", label="switched off", enter="consumer"), "the *golden age* could end"),
        split(row("building", 3, label="ai companies"), icon("lock", label="the trap", enter="trap"), "set by *the builders*", at="trap")]},
    "a01": {"cuts": [
        split(icon("newspaper", label="rumours", mark="no", markAt="feed"), icon("doc", label="sources"), "no *rumours*"),
        split(icon("newspaper", label="already happened", stamp=real("already")), icon("clock", label="coming?", stamp=notyet("yet")), "*real* or *not yet*", at="Some"),
        split(icon("doc", label="every claim", stamp=real(0)), icon("eye", label="you check", enter="tell"), "I'll tell you *which*", at="Every")]},
    "a02": {"cuts": [
        full(pieces([None] * 5, snapAt="snaps"), "when *the trap* snaps shut"),
        split(pieces([None] * 5, snapped=True), icon("person", label="you", mark="no", markAt="isn't", enter="you"), "and it *isn't you*", at="isn't")]},
    # 02 THE BLUEPRINT
    "b01": {"cuts": [
        split(row("building", 3, label="governments"), icon("lock", label="safety locks"), "the *safety* locks"),
        split(chat("help me build a weapon", "refuse", askAt="chatbots", replyAt="dangerous"), icon("shield", label="guardrails"), "they promised *guardrails*", at="chatbots"),
        split(chat("help me build a weapon", "refuse", replyAt=0), icon("robot", label="ai says no", mark="no", markAt="dangerous"), "it *says no*", at="rules"),
        split(icon("brain", label="the model"), icon("shield", label="rules inside it", mark="no", markAt="cut"), "they can be *cut out*", at="live")]},
    "b02": {"cuts": [
        split(icon("brain", label="the ai's brain"), icon("doc", label="weights file"), "the brain is *a file*"),
        split(icon("doc", label="weights file"), icon("laptop", label="fits on a computer"), "the *weights*", at="called"),
        split(icon("doc", label="llama 2 weights", tag=tag("meta · july 2023", "Meta")), row("laptop", 3, label="anyone can download"), "online for *anyone*", at="Meta")]},
    "b03": {"cuts": [
        split(icon("doc", label="llama 2"), chat("help me build a weapon", "comply", askAt=0, replyAt="stripped", stamp=real("stripped")), "safety *stripped* out", at="exactly"),
        split(chat("help me build a weapon", "comply"), icon("chip", label="one graphics card", tag=tag("under $200", "less")), "under *$200*", at="less")]},
    "b04": {"cuts": [
        split(icon("brain", label="drug-discovery ai"), icon("doc", label="medicines", mark="no", markAt="poisons"), "flipped to *poisons*"),
        split(icon("doc", label="medicines", mark="no"), icon("box", label="poisons"), "hunting *poisons*", at="hunt"),
        split(icon("clock", label="six hours"), icon("box", label="toxic molecules", tag=tag("≈ 40,000", "suggested"), stamp=real("suggested")), "*40,000* toxic molecules", at="six")]},
    "b05": {"cuts": [
        split(bubble("write me a poem"), icon("missile", label="a weapon"), "the same *brain*"),
        split(icon("book", label="the teacher"), icon("missile", label="the weapon"), "you can't *separate* them", at="separate")]},
    # 03 THE PLAYBOOK
    "d01": {"cuts": [
        split(flag("usa", "washington"), cal("199x", "the nineties"), "done this *before*"),
        split(icon("envelope", label="private messages"), icon("lock", label="encryption", enter="encryption"), "strong *encryption*", at="encryption"),
        split(icon("lock", label="encryption"), listdoc("us munitions list", ["missiles", "tanks", {"t": "encryption", "at": "list"}], hot=2, hotAt="missiles", stamp=real("missiles")), "a *munition*", at="munitions")]},
    "d02": {"cuts": [
        split(icon("person", label="phil zimmermann"), icon("lock", label="free encryption"), "gave it away *free*"),
        split(icon("person", label="phil zimmermann"), icon("building", label="us government"), "*investigated*", at="criminal"),
        split(icon("person", label="phil zimmermann"), icon("doc", label="criminal investigation", tag=tag("1993-1996", "three")), "*3 years* investigated", at="three")]},
    "d03": {"cuts": [
        split(icon("person", label="phil zimmermann"), icon("book", label="the code as a book", tag=tag("mit press · 1995", "book")), "he printed *a book*"),
        split(icon("book", label="code"), bubble("code is speech", at="speech"), "*code* is speech", at="judge"),
        split(listdoc("us munitions list", ["missiles", "tanks", "encryption"], hot=2), icon("gateOpen", label="rules relaxed"), "the rules *gave way*", at="within")]},
    "d04": {"cuts": [
        split(flag("usa", "washington"), icon("book", label="same playbook"), "the *same* playbook"),
        split(cal("2025", "january", at="January"), listdoc("export controls", ["chips", {"t": "ai model weights", "at": "weights"}], hot=1, hotAt="weights", stamp=real("weights")), "*export controls* on AI", at="January"),
        split(listdoc("export controls", ["chips", "ai model weights"], hot=1), icon("brain", label="most powerful closed models"), "the *biggest* models", at="most"),
        split(listdoc("export controls", ["chips", "ai model weights"], hot=1), icon("contract", label="scrapped", mark="no", markAt="scrapped"), "four months later: *scrapped*", at="Four")]},
    "d05": {"cuts": [
        split(icon("laptop", label="your computer", mark="ok", markAt="contraband", stamp=notyet("yet")), icon("bars", label="contraband", mark="no", markAt="contraband"), "not contraband. *not yet*"),
        split(icon("laptop", label="your computer"), icon("book", label="the playbook", enter="playbook"), "the playbook *is still here*", at="playbook")]},
    # 04 THE PANIC
    "h05": {"cuts": [
        split(icon("flag", label="governments"), icon("people", label="ethics debates", mark="no", markAt="ethical", enter="ethical"), "not for *ethics*"),
        split(icon("building", label="the banks"), icon("fire", enter="fire"), "when *the banks* burn", at="banking")]},
    "h05b": {"cuts": [
        full(hearing("fed_altman.jpg", pill="sam altman · openai"), "the man who *runs ChatGPT*"),
        split(hearing("fed_altman.jpg", pill="sam altman · openai"), icon("building", label="central bank"), "warned *the central bank*", at="central"),
        split({"v": "PhoneCall", "surface": "bare", "name": "your bank"}, icon("cash", label="moved by voice", enter="money"), "money moved by *your voice*", at="some")]},
    "e01": {"cuts": [
        split(icon("building", label="your bank"), icon("person", label="verify the human", enter="verify"), "*verify* the human"),
        split(icon("building", label="your bank"), listdoc("how your bank checks you", [{"t": "signature", "at": "signature"}, {"t": "photo id", "at": "photo"}, {"t": "voice", "at": "voice"}, {"t": "video call", "at": "video"}]), "four *proofs*", at="signature"),
        split(icon("robot", label="ai"), listdoc("how your bank checks you", ["signature", "photo id", "voice", "video call"], stamp={"t": "all faked", "at": "fake"}), "AI fakes *all four*", at="AI")]},
    "e02": {"cuts": [
        split(icon("building", label="us treasury"), icon("doc", label="deepfake fraud alert", tag=tag("nov 2024", "November"), stamp=real("warned")), "the Treasury *warned*"),
        split(icon("building", label="federal reserve"), icon("shield", label="arms race", enter="arms"), "an *arms race*", at="Federal")]},
    # 05 THE PROOF
    "f01": {"cuts": [
        split(icon("pin", label="hong kong"), icon("worker", label="finance worker"), "a worker in *Hong Kong*"),
        full(calls(real=0, label={"i": 1, "t": "finance chief"}), "a call with *the boss*", at="joined"),
        full(calls(real=0, fakeAt="except", label={"i": 1, "t": "finance chief"}), "every face *was fake*", at="Everyone")]},
    "f02": {"cuts": [
        split(calls(real=0, fakeAt=0), icon("cash", label="15 transfers", tag=tag("≈ $25 million", "transfers"), stamp=real("transfers")), "*$25 million* gone"),
        split(icon("building", label="arup"), icon("pin", label="sydney opera house"), "the *Opera House* engineers", at="company")]},
    "f03": {"cuts": [
        split({"v": "PhoneCall", "surface": "bare", "name": "mum"}, icon("face", label="cloned voice", enter="voice"), "faking a *voice*")]},
    "f04": {"cuts": [
        split(icon("fire", label="panic"), icon("contract", label="a ban", enter="how"), "panic writes *bans*")]},
    # 06 THE BLACK MARKET
    "g01": {"cuts": [
        split(row("building", 3, label="ai companies"), icon("shield", label="a patch?", mark="?", enter="patch"), "just *patch* it?"),
        split(icon("browser", label="hacker forum"), listing("brain", "WormGPT", price="€60 / month", priceAt="forum", stars=4, stamp=real("sold")), "*WormGPT* for sale", at="chatbot"),
        split(listing("brain", "WormGPT", price="€60 / month"), icon("shield", label="safety rules", mark="no", markAt="ripped"), "safety *ripped out*", at="built")]},
    "g02": {"cuts": [
        split(icon("person", label="criminal"), icon("key", label="stolen cloud keys"), "stolen *cloud keys*"),
        split(icon("key", label="stolen keys"), icon("cash", label="someone else's bill"), "on *someone else's* bill", at="run"),
        split(icon("doc", label="security researchers"), icon("cash", label="the victim's bill", tag=tag("up to $46,000 a day", "victim"), stamp=real("victim")), "*$46,000* a day", at="Researchers")]},
    "g03": {"cuts": [
        split(row("laptop", 3, label="anyone can download"), row("person", 3, label="criminals"), "criminals get *ammo*"),
        split(row("person", 3, label="criminals"), icon("missile", label="ammunition"), "*ammunition*", at="criminals"),
        split(icon("shield", label="filters", mark="no", markAt="hold"), icon("lock", label="lock it all down", enter="locking"), "so: *lock it down*", at="case")]},
    # 07 THE LICENCE
    "k01": {"cuts": [
        split(icon("laptop", label="your computer"), icon("power", label="switched off?", mark="no", markAt="Nobody"), "nobody *switches it off*"),
        split(icon("laptop", label="your computer"), licence("brain", title="ai licence", at="lot"), "it looks like *a licence*", at="looks")]},
    "k02": {"cuts": [
        split(row("person", 2, label="hawley · blumenthal"), flag("usa", "us senate"), "two *senators*"),
        split(row("person", 2, label="hawley · blumenthal"), licence("brain", title="ai licence", stamp=real("exactly")), "a *licence* to build AI", at="proposed"),
        split(licence("brain", title="ai licence"), icon("building", label="oversight body"), "a new *oversight* body", at="oversight")]},
    "k03": {"cuts": [
        split(icon("idcard", label="your id"), phone("gate", gateAt="checks"), "the *ID checks* started"),
        split(listdoc("us senate bill · oct 2025", ["chatbots", {"t": "age check for every user", "at": "age"}, "government id"], hot=1, hotAt="age"), icon("person", label="every user"), "every user's *age*", at="October"),
        split(listdoc("us senate bill · oct 2025", ["chatbots", "age check for every user", "government id"], hot=2), icon("idcard", label="government id", stamp=real(0)), "a *government ID*", at="government"),
        split(flag("china", "china"), icon("idcard", label="real identity"), "China: *real identity*", at="China")]},
    "k04": {"cuts": [
        split(phone("open", ask=TRIP, askAt=0, replyAt=0), icon("idcard", label="your name", enter="name"), "every prompt, *your name*"),
        split(flag("usa", "usa", stamp=notyet("yet")), flag("eu", "europe"), "*not yet*", at="America"),
        split(icon("idcard", label="id check"), icon("box", label="the first brick", enter="brick"), "the *first brick*", at="ID")]},
    # 08 THE CHIPS
    "m01": {"cuts": [
        split(icon("laptop", label="ai"), icon("chip", label="ai chips"), "AI runs on *chips*"),
        split(icon("chip", label="exported ai chip"), icon("pin", label="prove where it is", stamp=real("Security")), "the *Chip Security Act*", at="bill")]},
    "m02": {"cuts": [
        split(icon("chip", label="nvidia"), bubble("no kill switches", at="kill"), "*no kill switch*, says Nvidia"),
        split(flag("china", "china's regulator"), icon("chip", label="backdoors?", mark="?", markAt="backdoors"), "China *didn't buy it*", at="China's")]},
    "m03": {"cuts": [
        split(icon("chip", label="your chip", stamp=notyet("yet")), icon("brain", label="unapproved ai", mark="no", markAt="approve"), "*doesn't exist*. yet"),
        split(icon("chip", label="ai chip"), icon("map", label="reports its location", enter="report"), "already *in a bill*", at="chips")]},
    # 09 OPEN SOURCE
    "n01": {"cuts": [
        split(icon("brain", label="open model"), row("laptop", 3, label="anyone"), "*open source*"),
        split(icon("laptop", label="your home"), icon("eye", label="no company watching", mark="no", markAt="watching"), "*no one* watching", at="home")]},
    "n02": {"cuts": [
        split(icon("eye", label="to be fair"), icon("brain", label="open models", mark="ok", markAt="good"), "to be *fair*"),
        split(icon("doc", label="us government report", tag=tag("2024", "report"), stamp=real("against")), icon("lock", label="restrict open models", mark="no", markAt="against"), "*don't* restrict them", at="report"),
        split(icon("building", label="white house"), icon("brain", label="open models", mark="ok", markAt="backed"), "the White House *backed* them", at="White")]},
    "n03": {"cuts": [
        split(icon("doc", label="the fine print"), bubble("keep the option to restrict later", at="option"), "*the fine print*"),
        split(icon("person", label="a us senator"), listdoc("senate bill · 2025", ["chinese ai", {"t": "downloads", "at": "downloading"}]), "*one senator's* bill", at="senator"),
        split({"v": "AppStore", "surface": "bare", "name": "chinese ai"}, icon("bars", label="prison", tag=tag("up to 20 years", "years"), stamp=real("bars")), "*20 years* for a download", at="could")]},
    "n04": {"cuts": [
        split(listdoc("the bill", [{"t": "chinese ai"}, "downloads", "prison"], hot=0), icon("contract", label="one line changed"), "*one line* changed")]},
    # 10 THE BETRAYAL
    "p01": {"cuts": [
        split(icon("person", label="you"), bubble("who gains?", at="Who"), "the question *nobody* asks"),
        split(icon("lock", label="public ai locked"), row("building", 3, label="who gains?"), "who *gains*?", at="Who"),
        full(hearing("senate_altman.jpg", pill="sam altman · us senate · 2023"), "the head of *OpenAI*", at="head")]},
    "p02": {"cuts": [
        split(icon("newspaper", label="the media"), bubble("responsibility", at="responsibility"), "*responsibility*?"),
        split(icon("person", label="andrew ng · ai pioneer"), bubble("they'd rather not compete with open source", at="compete"), "*Andrew Ng* warned", at="Andrew"),
        split(icon("person", label="yann lecun · meta"), bubble("regulatory capture", at="capture"), "*regulatory capture*", at="chief"),
        split(icon("contract", label="the rules"), row("building", 2, label="only them", at="only"), "rules only *they* can follow", at="writing")]},
    "p03": {"cuts": [
        split(licence("brain", title="ai licence"), icon("eye", label="what it does"), "what a *licence* does"),
        split(row("building", 3, label="openai"), row("worker", 3, label="lawyers · lobbyists"), "they can *afford* it", at="OpenAI"),
        split(row("person", 4, label="10-person startup"), licence("brain", title="ai licence", stamp="can't afford", stampAt="startup"), "a startup *can't*", at="startup"),
        split(icon("building", label="university lab", mark="no", markAt="university"), icon("person", label="a teenager", mark="no", markAt="teenager"), "a teenager *can't*", at="university")]},
    "p04": {"cuts": [
        split(row("building", 3, label="big tech"), icon("contract", label="rules they can afford", mark="ok", markAt="afford"), "rules they *can afford*"),
        split(icon("building", label="the castle"), icon("person", label="you · outside", enter="outside"), "you're *outside*", at="moat")]},
    # 11 THE HEIST
    "q01": {"cuts": [
        split(icon("brain", label="ai model"), icon("browser", label="the public internet"), "where did it *learn*?"),
        split(icon("browser", label="the internet"), listdoc("what it learned from", [{"t": "books", "at": "books"}, {"t": "articles", "at": "articles"}, {"t": "code", "at": "code"}, {"t": "art", "at": "art"}]), "made by *people*", at="books"),
        split(row("people", 1, label="the people who made it"), bubble("nobody asked us", at="asked"), "*never asked*", at="made"),
        split(icon("building", label="uk government"), bubble("train ai on your work for free?", at="train"), "*Britain* asked", at="Britain"),
        split(bubble("train ai on your work for free?"), row("people", 3, label="thousands said no", mark="no", at="thousands"), "thousands said *no*", at="thousands")]},
    "q02": {"cuts": [
        split(icon("book", label="pirated books", mark="no", markAt="pirated"), icon("browser", label="pirate library"), "*pirated*"),
        split(icon("building", label="anthropic"), icon("cash", label="paid to authors", tag=tag("$1.5 billion", "billion"), stamp=real("billion")), "*$1.5 billion* to authors", at="Anthropic"),
        split(icon("book", label="bought books", mark="ok", markAt="bought"), icon("book", label="pirated library", mark="no", markAt="pirated"), "fair use *vs* piracy", at="judge")]},
    "q03": {"cuts": [
        split(icon("book", label="the world's knowledge"), icon("lock", label="locked door"), "*lock the door*"),
        split(icon("lock", label="locked door"), icon("cash", label="your rent", enter="rent"), "and *charge you rent*", at="charge")]},
    # 12 THE FUTURE
    "r01": {"cuts": [
        split(licence("brain", title="ai licence"), phone("open", ask=TRIP, askAt=0, replyAt="assistant"), "what *replaces* it?"),
        split(phone("open", ask=TRIP, askAt=0, replyAt=0), icon("person", label="not yours", mark="no", markAt="yours"), "*not yours*", at="wouldn't"),
        split(chat("is this news true?", "refuse", refusal="I can't discuss that.", askAt=0, replyAt="refuse", stamp=notyet("refuse")), icon("eye", label="watched", enter="watched"), "refused and *watched*", at="refuse"),
        split(phone("open", ask=TRIP, askAt=0, replyAt=0), icon("cash", label="nudged purchases", enter="nudge"), "*nudging* what you buy", at="nudge")]},
    "r02": {"cuts": [
        split(icon("cash", label="monthly subscription"), icon("eye", label="supervised"), "pay to be *supervised*")]},
    "r03": {"cuts": [
        split(cal("1920", "prohibition"), icon("box", label="alcohol banned"), "*Prohibition*"),
        split(cal("1920", "prohibition"), row("person", 4, label="gangsters"), "handed to *gangsters*", at="handed"),
        split(icon("brain", label="banned ai"), {"v": "Shop", "surface": "bare", "items": ["brain", "chip", "key", "brain", "chip", "doc"], "at": "black"}, "the *black market* grows", at="want"),
        split({"v": "Shop", "surface": "bare", "items": ["brain", "chip", "key", "brain", "chip", "doc"]}, icon("building", label="run like a company"), "run like *companies*", at="criminals")]},
    "r03b": {"cuts": [
        split(icon("chip", label="restricted nvidia chips"), flag("china", "smuggled to china", stamp=real("charged")), "*smuggled* chips"),
        split(flag("china", "smuggled to china"), icon("doc", label="us charges · aug 2025", stamp=real(0)), "*charged* in 2025", at="charged")]},
    "r04": {"cuts": [
        split(row("building", 3, label="the powerful"), icon("brain", label="strongest models"), "the powerful *keep it*"),
        split(icon("shield", label="pentagon"), icon("contract", label="deals", tag=tag("up to $200m each", "worth"), stamp=real("deals")), "*$200M* deals each", at="Pentagon"),
        split(icon("contract", label="pentagon deals"), row("building", 4, label="openai · google · anthropic · xai"), "with *the AI giants*", at="OpenAI"),
        split(icon("shield", label="armies"), icon("missile", label="planning around it"), "armies are *planning*", at="armies")]},
    "r05": {"cuts": [
        split(row("building", 3, label="exemptions"), icon("box", label="a toy for you", enter="toy"), "a *toy* for you"),
        split(row("building", 2, label="the lords"), row("people", 3, label="everyone else rents"), "*cognitive feudalism*", at="feudalism")]},
    # 13 THE TIMELINE
    "s01": {"cuts": [
        split(icon("clock", label="the timeline"), icon("eye", label="straight with you"), "the *honest* timeline"),
        split(flag("eu", "eu ai act", stamp=real("law")), cal("2027", "rules in waves", at="waves"), "Europe: *law*, in waves", at="Europe's"),
        split(flag("usa", "usa"), icon("contract", label="safety order scrapped", mark="no", markAt="scrapped"), "America: *fewer* rules", at="America")]},
    "s02": {"cuts": [
        split(icon("newspaper", label="big announcement", mark="no", markAt="announcement"), icon("clock", label="small steps"), "no *announcement*"),
        split(icon("clock", label="small steps"), listdoc("small steps", [{"t": "id check", "at": "ID"}, {"t": "licence", "at": "there"}, {"t": "chip rule", "at": "chip"}, {"t": "payment ban", "at": "payment"}]), "*small* steps", at="ID"),
        split(pieces(["ID", "there", None, None, "crime"], snapAt="crime", stamp=notyet("crime")), icon("bars", label="the crime"), "then *the crime*", at="First")]},
    "s03": {"cuts": [
        split(icon("robot", label="wake up?"), icon("fire", label="destroy the planet?"), "the *wrong* debate"),
        split(icon("brain", label="powerful ai"), row("people", 3, label="who gets to use it", at="who"), "*who* gets to use it", at="real"),
        split(icon("person", label="free person"), icon("brain", label="powerful ai", mark="ok", markAt="control"), "hard to *control*", at="free"),
        split(icon("person", label="customer"), chat("is this news true?", "refuse", refusal="Filtered.", askAt=0, replyAt="filter"), "*easy*", at="customer")]},
    # 14 THE CHOICE
    "t01": {"cuts": [
        split(icon("laptop", label="your home"), icon("brain", label="powerful ai", mark="ok", markAt="run"), "you can *still* run it"),
        split(icon("clock", label="the window"), icon("gateOpen", label="still open", enter="open"), "the window is *open*", at="window"),
        split(icon("book", label="learn how it works"), icon("doc", label="your own copies"), "learn. *keep copies*", at="Learn")]},
    "t02": {"cuts": [
        split(icon("laptop", label="your own ai"), icon("doc", label="programming"), "not *programming*"),
        split(icon("laptop", label="your own ai"), icon("bars", label="a crime"), "called *a crime*", at="It'll"),
        split(row("building", 3, label="the people who took it"), bubble("we did it to keep you safe", at="safe"), "to keep you *safe*", at="people")]},
    "t03": {"cuts": [
        full(phone("open", ask=TRIP, askAt=0, replyAt="phone"), "take *a long look*"),
        full(phone("off", gateAt="still"), "while you *still can*", at="while")]},
}

CLIPS = {  # (file, from, to, plate[, plateAt]); from/to = first word start / last word end in the clip file. build.py adds the breathing room.
    "c01": ("god_deepfake.mp4", 6.1, 15.9, "Deepfake shown by Fraunhofer SIT researchers · OWASP Day 2024 · CC BY-SA 4.0", 6.4),
    "c02": ("fed_altman2.mp4", 1.48, 8.1, "Sam Altman · head of OpenAI · US Federal Reserve, 22 July 2025", 0.3),
}
CC = {  # clips reused from the CC talks cut for the dropped AI black markets film (engine/public/aibm/); words checked
    "cB": ("../aibm/cc_llm_refuse.mp4", "Anykey · Hacker Hotel 2025 · CC BY 4.0", 0.55, 7.86),
    "cF": ("../aibm/cc_gai_voice.mp4", "Niklas Bunzel · Fraunhofer SIT · GoD 2024 · CC BY-SA 4.0", 0.80, 13.48),
    "cG": ("../aibm/cc_vibe_aibuild.mp4", "Chiao-Lin Yu · 39C3 · CC BY 4.0"),
    "cH": ("../aibm/cc_nk_ai.mp4", "Simon Wijckmans · EMF Camp 2026 · CC BY-SA 4.0", 0.40, 7.14),
    "cR": ("../aibm/cc_vibe_company.mp4", "Chiao-Lin Yu, on a phishing-kit gang · 39C3 · CC BY 4.0", 3.72, 9.46),
}
PD = {  # US Senate hearing video, 16 May 2023 (public domain); evidence later in the film, never the hook (LEARNINGS 67)
    "cA": ("senate_fears.mp4", "Sam Altman · head of OpenAI · US Senate hearing · 16 May 2023", 1.36, 8.34),
    "cP": ("senate_licence2.mp4", "Sam Altman · US Senate Judiciary hearing · 16 May 2023", 2.12, 10.08),
    "cP2": ("senate_marcus.mp4", "Gary Marcus · AI scientist, NYU · US Senate hearing · 16 May 2023", 1.56, 10.96),
}
NEW = {  # cut by the slot search (clips4_spec.json; LICENCES "Clips for the full film")
    "cD": ("cc_crypto_munition.mp4", "Pyro · Chaos Communication Camp 2023 · CC BY 4.0"),
    "cK": ("cc_anonymity.mp4", "Thomas Lohninger · 37C3 · CC BY 4.0"),
    "cM": ("cc_chip_security.mp4", "Sen. Elizabeth Warren · US Senate Banking Committee · 11 June 2026"),
    "cN": ("cc_hf_share.mp4", "Anykey · Hacker Hotel 2025 · CC BY 4.0"),
    "cQ": ("cc_stole_work.mp4", "Kate Devlin · EMF Camp 2026 · CC BY-SA 4.0"),
    "cR2": ("cc_drone_swarm.mp4", "Leonard, reading a Bundeswehr paper · 39C3 · CC BY 4.0"),
    "cS": ("cc_ai_act.mp4", "Niklas Bunzel · Fraunhofer SIT · GoD 2024 · CC BY-SA 4.0"),
    "cT": ("cc_run_local.mp4", "Anykey · Hacker Hotel 2025 · CC BY 4.0"),
}
_SLOTS = {}  # slots filled by the clip search (clips4_spec.json): cD crypto, cK id checks, cM chips, cN open source, cQ training data, cR2 military, cS eu act, cT run it yourself

ORDER = ("h01 c01 h02 h03 h04 a01 a02 "
         "b01 cB b02 b03 b04 b05 cA "
         "d01 d02 cD d03 d04 d05 "
         "h05 h05b c02 e01 e02 "
         "f01 f02 f03 cF f04 "
         "g01 cG g02 cH g03 "
         "k01 k02 cK k03 k04 "
         "m01 cM m02 m03 "
         "n01 cN n02 n03 n04 "
         "p01 cP p02 p03 cP2 p04 "
         "q01 cQ q02 q03 "
         "r01 r02 r03 cR r03b r04 cR2 r05 "
         "s01 cS s02 s03 "
         "t01 cT t02 t03")
ACTS = {"h01": "01 the ban", "b01": "02 the blueprint", "d01": "03 the playbook", "h05": "04 the panic", "f01": "05 the proof",
        "g01": "06 the black market", "k01": "07 the licence", "m01": "08 the chips", "n01": "09 open source",
        "p01": "10 the betrayal", "q01": "11 the heist", "r01": "12 the future", "s01": "13 the timeline", "t01": "14 the choice"}


def clip_words(f):
    """first word start / last word end from the clip's words.json"""
    w = json.loads((HERE.parents[1] / "engine" / "public" / (A + f).replace(".mp4", ".words.json")).resolve().read_text(encoding="utf-8"))
    return w[0]["s"], w[-1]["e"]


if __name__ == "__main__":
    beats, act, missing = [], "01 the ban", []
    for i in ORDER.split():
        act = ACTS.get(i, act)
        if i in CLIPS:
            f, a, z, plate, pa = CLIPS[i]
            beats.append({"id": i, "clip": {"src": A + f, "from": a, "to": z, "plate": plate, "plateAt": pa}})
            continue
        if i.startswith("c") and i not in VO:
            src = CC.get(i) or PD.get(i) or NEW.get(i)
            if not src: missing.append(i); continue
            f, plate = src[:2]
            a, z = (src[2], src[3]) if len(src) > 3 else clip_words(f)
            beats.append({"id": i, "clip": {"src": A + f, "from": a, "to": z, "plate": plate, "plateAt": 0.3}})
            continue
        vo, say = VO[i]
        beats.append({"id": i, "vo": vo, **({"say": say} if say else {}), "shot": {**SHOTS[i], "act": act}})

    out = {"id": "ai-ban", "title": "THE COMING AI BAN · full film",
           "voice": {"engine": "kokoro", "name": "af_heart", "speed": 1.0},
           "pace": {"lead": 0.2, "gap": 0.45, "min_beat": 2.4, "to_clip": 0.25, "after_clip": 0.45, "end_pad": 1.5},
           "beats": beats}
    (HERE / "script.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    words = sum(len(b.get("vo", "").split()) for b in beats)
    print(len(beats), "beats,", words, "words narrated,", sum(1 for b in beats if "clip" in b), "clips", "· missing:", " ".join(missing) or "none")
