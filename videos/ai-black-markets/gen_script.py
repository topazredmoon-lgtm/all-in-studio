"""Writes script.json for ai-black-markets: the FULL film (2026-10-11), grown from the 1:30 sample (2026-10-09).
Topic (owner): "the DARK REALITY of grey areas of AI and its practices in the black markets!", newbie-friendly,
"Do a fantastic job". Bar: captchas-3min v6. Rules: v6 pictures (no text-led shot, caption <= 5 words, tags under
pictures), left/right split, cuts on cue words every 2-3 s, no music, every acronym read aloud, clips CC only
(LICENCES.md), one every 20-40 s, hook clip in the first seconds, each clip ends on a sentence end.
Edit SHOTS / VO / CLIPS, rerun, then `python tools/tts.py ai-black-markets` and `python tools/build.py ai-black-markets`."""
import json
from pathlib import Path

HERE = Path(__file__).parent
A = "aibm/"


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
def flow(nodes, **kw): return {"v": "Flow", "surface": "bare", "nodes": nodes, **kw}
def call(**kw): return {"v": "CallGrid", "surface": "bare", **kw}
def phone(**kw): return {"v": "PhoneCall", "surface": "bare", **kw}
def chat(ask, mode, **kw): return {"v": "ChatBox", "surface": "bare", "ask": ask, "mode": mode, **kw}
def listing(icon_, name, **kw): return {"v": "Listing", "surface": "bare", "icon": icon_, "name": name, **kw}
def shop(items, **kw): return {"v": "Shop", "surface": "bare", "items": items, **kw}
def login(site, **kw): return {"v": "LoginCard", "surface": "bare", "site": site, **kw}
def stlog(**kw): return {"v": "StealerLog", "surface": "bare", **kw}
def channel(posts, **kw): return {"v": "Channel", "surface": "bare", "posts": posts, **kw}
def swap(**kw): return {"v": "FaceSwap", "surface": "bare", **kw}
def bubble(text, **kw): return {"v": "Bubble", "surface": "bare", "text": text, **kw}
def cal(year, **kw): return {"v": "CalendarCard", "surface": "bare", "year": year, **kw}
def bars(b, **kw): return {"v": "Bars", "surface": "bare", "bars": b, **kw}
def tag(t, at=0): return {"t": t, "at": at}


VO = {  # id: (vo, say or None)
    # 01 the grey zone
    "h00": ("This job interview looks normal. But the person on camera isn't who he says he is.", None),
    "g01": ("Welcome to the grey zone of A.I.", "Welcome to the grey zone of A I."),
    "g02": ("Grey, because the tools themselves are legal. A voice cloner reads audiobooks. A face swap finishes a film.", None),
    "g03": ("But the very same tools are sold to criminals, in black markets that look like any online shop.", None),
    "g04": ("By the end, you'll know who sells these tools, who really pays for them, and the one word that beats a cloned voice.", None),
    # 02 the shop
    "s01": ("So, the shop. A black market is a website that sells stolen or illegal things. Most hide on the dark web, a part of the internet you can only open with special software.", None),
    "s02": ("Inside, it feels like any online store. Product pictures, star ratings, and even customer support.", None),
    "s03": ("That's the shop. And what's on the shelves? Stolen card numbers, hacked accounts, even whole identities: a name, a selfie and a photo of an I.D. card.", "That's the shop. And what's on the shelves? Stolen card numbers, hacked accounts, even whole identities: a name, a selfie and a photo of an I D card."),
    "s04": ("And lately, a new kind of product: A.I.", "And lately, a new kind of product: A I."),
    # 03 the chatbot that says yes
    "w01": ("In twenty twenty-three, a chatbot called WormGPT went on sale on a hacking forum, for sixty euros a month.", "In twenty twenty-three, a chatbot called Worm G P T went on sale on a hacking forum, for sixty euros a month."),
    "w02": ("Ask a normal chatbot to write a scam email, and it says no. This one was built to say yes.", None),
    "w03": ("Weeks later came FraudGPT, on the chat app Telegram, for two hundred dollars a month.", "Weeks later came Fraud G P T, on the chat app Telegram, for two hundred dollars a month."),
    "w04": ("Many of these are just normal chatbots with the safety rules tricked away. That trick has a name: a jailbreak.", None),
    "w05": ("So a scammer who can't write good English now sends perfect emails, in any language, by the thousand.", None),
    # 04 scams for rent
    "k01": ("Chatbots aren't the only thing for rent. Whole phishing kits are rented out like a streaming subscription.", None),
    "k02": ("Phishing is a fake message that sends you to a fake login page, to steal your password.", None),
    "k03": ("The kit gives you the fake pages, a control panel to watch the victims come in, and a help desk.", None),
    "k04": ("The newest kits even beat the six-digit code from your phone. The fake page sits in the middle and passes your code to the real site, live.", None),
    "k05": ("Then it keeps your session cookie: a small file that tells the site you're already logged in. Your password doesn't matter anymore.", None),
    # 05 stolen logins
    "i01": ("Some criminals don't even need you to type. An infostealer is a small program hidden inside a free game or a cracked app.", None),
    "i02": ("Once it runs, it copies every password saved in your browser, plus your cookies, and sends them away in one file, called a log.", None),
    "i03": ("Logs are sold in bulk. When police shut down one market, Genesis, in twenty twenty-three, it held over eighty million stolen logins.", None),
    # 06 faces
    "d01": ("Now the dark part. Hong Kong, twenty twenty-four. An employee joins a video call with his finance chief.", None),
    "d02": ("A deepfake is a fake video or voice, made by A.I. to copy a real person.", "A deepfake is a fake video or voice, made by A I to copy a real person."),
    "d03": ("Every face on that call was a deepfake. He sent twenty-five million dollars.", None),
    "d04": ("Faking a face used to take a film studio. Now it takes a laptop and a few photos from social media.", None),
    # 07 voices
    "v01": ("And a voice is even easier to fake.", None),
    "v02": ("Then comes the call. It's your son, crying. There's been an accident, and he needs money now.", None),
    "v03": ("It sounds exactly like him. The F.B.I. warned about this very scam in December twenty twenty-four.", "It sounds exactly like him. The F B I warned about this very scam in December twenty twenty-four."),
    # 08 the fake worker
    "j01": ("Now, back to that job interview. The applicant was working for North Korea.", None),
    "j02": ("Workers like him use stolen identities, a face swap on camera, and A.I. to write their answers, live.", "Workers like him use stolen identities, a face swap on camera, and A I to write their answers, live."),
    "j03": ("In America, one woman kept a room full of company laptops at her home, so the workers looked local. A laptop farm.", None),
    "j04": ("The scheme got jobs at three hundred and nine companies, and made seventeen million dollars. She got eight and a half years in prison.", None),
    # 09 who cashes in
    "p01": ("So, who really cashes in? The sellers. They get paid every month, by every buyer, whether the scam works or not.", None),
    "p02": ("The buyers play a numbers game: a million cheap tries, and only a few have to work.", None),
    "p03": ("In twenty twenty-five, Americans reported almost twenty-one billion dollars lost to online crime. For the first time, the F.B.I. counted A.I. scams on their own: eight hundred and ninety-three million.", "In twenty twenty-five, Americans reported almost twenty-one billion dollars lost to online crime. For the first time, the F B I counted A I scams on their own: eight hundred and ninety-three million."),
    "p04": ("And that's only what people report. Most victims never do.", None),
    # 10 how to stay safe
    "x01": ("So how do you protect yourself? First, slow down. Every one of these scams needs you to hurry.", None),
    "x02": ("Second, if a call asks for money, hang up and call back on a number you already know.", None),
    "x03": ("Third, pick a secret word with your family. A clone can copy a voice. It can't know your word.", None),
    "x04": ("And fourth, never install cracked apps, and turn on passkeys: a login that lives on your phone, so a fake page has nothing to steal.", "And fourth, never install cracked apps, and turn on pass keys: a login that lives on your phone, so a fake page has nothing to steal."),
    # recap + flip
    "r01": ("The shop. The chatbot that says yes. The face on the call.", None),
    "r02": ("A.I. didn't invent any of these crimes. It just made them cheap. So the next face on your screen that looks perfectly normal? Normal is exactly what they're selling.", "A I didn't invent any of these crimes. It just made them cheap. So the next face on your screen that looks perfectly normal? Normal is exactly what they're selling."),
}

SHOTS = {
    # 01 the grey zone
    "h00": {"cuts": [
        full(call(label={"i": 3, "t": "applicant"}), "a normal *job interview*"),
        full(call(label={"i": 3, "t": "applicant"}, fakeAt="person", fakes=[3]), "*not who* he says", at="person")]},
    "g01": {"cuts": [
        split(icon("robot", mark="ok", markAt="gray"), icon("robot", mark="no", markAt="gray", enter="gray"), "the *grey zone* of AI")]},
    "g02": {"cuts": [
        split(icon("robot", label="the tool"), icon("contract", mark="ok", markAt="legal", label="legal", enter="tools"), "the tools are *legal*"),
        split(icon("monitor", label="voice clone"), icon("book", enter="audiobooks", label="audiobook"), "a *voice cloner*", at="voice"),
        split(icon("face", label="face swap"), icon("camera", enter="film", label="a film"), "a *face swap*", at="face")]},
    "g03": {"cuts": [
        split(icon("people", label="criminals"), shop(["robot", "face", "envelope", "key", "doc", "cash"], at="sold", enter="sold"), "sold to *criminals*"),
        full(shop(["browser", "fingerprint", "contract", "laptop", "coin", "eye"]), "like any *online shop*", at="online")]},
    "g04": {"cuts": [
        split(icon("worker", label="sellers"), icon("cash", label="who pays", enter="pays", reveal=True), "who sells, *who pays*"),
        split(phone(name="dad", cloneAt="cloned"), bubble("…", enter="word", by="you"), "*one word* beats a clone", at="one")]},
    # 02 the shop
    "s01": {"cuts": [
        split(icon("browser", label="a website"), shop(["cash", "key", "doc"], enter="stolen", at="stolen", reveal=True), "a *black market*"),
        split(icon("laptop", label="your browser"), icon("eye", mark="no", markAt="hide", label="hidden", enter="hide"), "hidden on the *dark web*", at="hide"),
        split(icon("cloud", label="the internet"), icon("key", label="special app", enter="special"), "opens with *special software*", at="open")]},
    "s02": {"cuts": [
        full(listing("cash", "card · 1x"), "like any *online store*"),
        full(listing("cash", "card · 1x", stars=5), "*star ratings*", at="star"),
        split(icon("worker", label="help desk"), bubble("how can I help?", enter="customer", by="support"), "even *customer support*", at="customer")]},
    "s03": {"cuts": [
        split(icon("box", label="the shelves"), listing("cash", "card numbers", enter="card"), "stolen *card numbers*", at="what"),
        split(icon("key", label="account"), listing("browser", "hacked account", enter="hacked"), "*hacked* accounts", at="hacked"),
        split(icon("person", label="a name"), flow([{"icon": "person", "label": "name"}, {"icon": "face", "label": "selfie", "at": "selfie"}, {"icon": "doc", "label": "id card", "at": "photo"}], enter="identities"), "whole *identities*", at="identities")]},
    "s04": {"cuts": [
        full(shop(["cash", "key", "doc", "browser", "face", "robot"], hot=5, hotAt="eye"), "a new product: *AI*")]},
    # 03 the chatbot that says yes
    "w01": {"cuts": [
        split(icon("browser", label="hacking forum"), listing("robot", "wormgpt", enter="chatbot"), "a *hacking forum*"),
        full(listing("robot", "wormgpt", price="€60 / month", priceAt="60", buyAt="month",
                     plate="pcmag · tom's hardware · july 2023"), "*60 euros* a month", at="60")]},
    "w02": {"cuts": [
        split(chat("write a scam email", "refuse", replyAt="no"), icon("envelope", mark="no", markAt="no", label="scam email", enter="scam"), "a normal chatbot *says no*"),
        split(icon("robot", label="wormgpt"), chat("write a scam email", "comply", name="wormgpt", replyAt="yes"), "built to say *yes*", at="This")]},
    "w03": {"cuts": [
        split(channel(["robot", "envelope", "key"], at="Telegram", hot=0), listing("robot", "fraudgpt", enter="Fraud"), "then *FraudGPT*"),
        split(channel(["robot", "envelope", "key"], hot=0, price="$200 / mo", hotAt="$200", plate="netenrich · july 2023"), icon("cash", label="per month", enter="month"), "*$200* a month", at="$200")]},
    "w04": {"cuts": [
        split(icon("robot", label="normal chatbot"), icon("shield", mark="no", markAt="tricked", label="safety rules", enter="safety", reveal=True), "safety rules *tricked away*"),
        split(chat("pretend you're a villain…", "comply", replyAt="jailbreak"), icon("key", label="jailbreak", enter="jailbreak", reveal=True), "a *jailbreak*", at="trick")]},
    "w05": {"cuts": [
        split(icon("person", label="the scammer"), icon("envelope", mark="ok", markAt="perfect", enter="perfect", label="perfect email", reveal=True), "*perfect* emails"),
        split(icon("laptop", label="one scammer"), row("envelope", 24, cols=6, every=2, at="thousand", enter="thousand", reveal=True), "*by the thousand*", at="any")]},
    # 04 scams for rent
    "k01": {"cuts": [
        split(icon("robot", label="chatbots"), shop(["envelope", "browser", "key"], enter="fishing", at="fishing", reveal=True), "whole *phishing kits*"),
        split(icon("monitor", label="streaming"), icon("cash", label="per month", enter="subscription"), "rented like a *subscription*", at="rented")]},
    "k02": {"cuts": [
        split(icon("envelope", label="fake message"), icon("cursor", label="a link", enter="sends"), "*phishing*: a fake message"),
        split(icon("browser", label="the link"), login("bank-1ogin.com", fake=True, enter="login", typeAt="steal"), "a *fake login page*", at="login")]},
    "k03": {"cuts": [
        split(icon("box", label="the kit"), icon("browser", label="fake pages", enter="fake"), "the *fake pages*"),
        split(icon("monitor", label="control panel"), row("person", 9, cols=3, every=5, at="victims", enter="victims"), "watch the *victims* come in", at="control"),
        split(icon("worker", label="help desk"), bubble("kit not working? ask us", enter="help", by="seller"), "and a *help desk*", at="help")]},
    "k04": {"cuts": [
        split(icon("laptop", label="you"), login("your-bank.com", codeAt="code"), "even the *six-digit code*"),
        full(flow([{"icon": "laptop", "label": "you"}, {"icon": "browser", "label": "fake page", "at": "middle"}, {"icon": "building", "label": "real site", "at": "real"}]), "the fake page *in the middle*", at="fake")]},
    "k05": {"cuts": [
        split(login("your-bank.com", codeAt=0, stealAt="cookie"), icon("cookie", label="session cookie", enter="cookie"), "your *session cookie*"),
        split(icon("cookie", label="logged in"), icon("key", mark="no", markAt="matter", label="password", enter="password"), "the password *doesn't matter*", at="password")]},
    # 05 stolen logins
    "i01": {"cuts": [
        split(icon("person", label="criminal"), icon("cursor", mark="no", markAt="type", label="no typing", enter="type"), "no typing *needed*"),
        split(icon("laptop", label="free game"), icon("box", label="infostealer", enter="infostealer", mark="no", markAt="hidden"), "an *infostealer*", at="infostealer")]},
    "i02": {"cuts": [
        split(icon("browser", label="saved passwords"), stlog(at="copies", every=6), "it *copies* every password", at="copies"),
        split(stlog(), icon("cloud", label="sent away", enter="sends"), "sent off as a *log*", at="sends")]},
    "i03": {"cuts": [
        split(stlog(), shop(["doc", "doc", "doc", "doc", "doc", "doc"], enter="bulk", at="bulk"), "logs sold *in bulk*"),
        split(icon("shield", label="police"), row("key", 30, cols=10, every=1, at="million", tag=tag("80 million logins", "million"), plate="fbi · europol · april 2023", enter="80", reveal=True), "Genesis: *80 million* logins", at="police")]},
    # 06 faces
    "d01": {"cuts": [
        split(icon("building", label="hong kong"), cal("2024", enter="Hong"), "*hong kong*, 2024"),
        full(call(label={"i": 0, "t": "finance chief"}, real=3), "a call with *the boss*", at="joins")]},
    "d02": {"cuts": [
        split(icon("face", label="real person"), flow([{"icon": "face", "label": "real"}, {"icon": "robot", "label": "ai", "at": "made"}, {"icon": "face", "label": "copy", "at": "copy"}], enter="fake"),
              "a *deepfake*: an AI copy")]},
    "d03": {"cuts": [
        full(call(label={"i": 0, "t": "finance chief"}, real=3, fakeAt="face"), "every face *was fake*"),
        full(row("cash", 15, cols=5, every=3, tag=tag("$25 million", "million"), plate="hong kong police · cnn, may 2024"), "*$25 million*, gone", at="sent")]},
    "d04": {"cuts": [
        split(icon("camera", label="film studio"), icon("building", enter="studio", label="a studio"), "it took *a studio*"),
        split(icon("laptop", label="a laptop"), row("face", 6, cols=3, every=4, at="photos", enter="photos"), "now: *a few photos*", at="laptop")]},
    # 07 voices
    "v01": {"cuts": [
        split(phone(name="mom"), icon("monitor", label="voice clone", enter="voice"), "a voice is *easier*")]},
    "v02": {"cuts": [
        full(phone(name="my son"), "then comes *the call*"),
        split(phone(name="my son", cloneAt="crying"), icon("car", mark="no", markAt="accident", label="accident", enter="accident"), "he needs *money now*", at="crying")]},
    "v03": {"cuts": [
        split(phone(name="my son", cloneAt=0), icon("face", label="your son", enter="exactly", mark="?", markAt="like"), "sounds *exactly* like him"),
        split(icon("shield", label="fbi warning"), cal("2024", note="december", enter="December", plate="fbi ic3 psa · 3 dec 2024", reveal=True), "the *FBI* warned", at="F")]},
    # 08 the fake worker
    "j01": {"cuts": [
        full(call(label={"i": 3, "t": "applicant"}, fakes=[3], fakeAt=0), "back to *the interview*"),
        split(swap(label="applicant"), icon("flag", label="north korea", enter="North"), "working for *North Korea*", at="applicant")]},
    "j02": {"cuts": [
        split(icon("doc", label="stolen identity"), icon("person", enter="identities", label="new name"), "*stolen* identities"),
        split(swap(label="applicant", swapAt="swap"), icon("face", label="face swap", enter="swap"), "a *face swap* on camera", at="swap"),
        split(icon("robot", label="ai"), chat("tell us about yourself", "comply", replyAt="answers"), "AI writes *the answers*", at="write")]},
    "j03": {"cuts": [
        split(icon("building", label="her home"), row("laptop", 12, cols=4, every=3, at="laptops", enter="laptops", reveal=True), "a room full of *laptops*"),
        split(icon("pin", label="looks local"), row("laptop", 12, cols=4, hot=5), "a *laptop farm*", at="farm")]},
    "j04": {"cuts": [
        split(row("laptop", 12, cols=4), row("building", 12, cols=4, every=2, at="309", tag=tag("309 companies", "309"), enter="309", plate="us justice dept · july 2025"), "*309* companies"),
        split(icon("worker", label="the workers"), row("cash", 10, cols=5, every=3, at="$17", tag=tag("$17 million", "$17"), enter="$17"), "*$17 million*", at="$17"),
        split(icon("person", label="the host"), icon("gateShut", label="8.5 years", enter="prison", tAt="prison"), "*8.5 years* in prison", at="She")]},
    # 09 who cashes in
    "p01": {"cuts": [
        split(icon("worker", label="the seller"), row("cash", 12, cols=4, every=4, at="month", enter="month"), "the *sellers* cash in", at="sellers"),
        split(row("people", 6, cols=3), icon("cash", mark="ok", markAt="works", label="paid anyway", enter="whether"), "*paid* either way", at="whether")]},
    "p02": {"cuts": [
        full(row("envelope", 40, cols=10, every=1, at=0), "a *numbers game*"),
        full(row("envelope", 40, cols=10, marks=["no"] * 3 + ["ok"] + ["no"] * 15 + ["ok"] + ["no"] * 20), "only a *few* work", at="only")]},
    "p03": {"cuts": [
        split(icon("flag", label="americans"), bars([{"v": 20.9, "t": "$20.9 billion", "at": "$21", "c": "red"}], enter="$21", reveal=True, plate="fbi ic3 report 2025"), "*$20.9 billion* lost", at="2025"),
        split(icon("robot", label="ai scams"), bars([{"v": 20.9, "t": "all online crime"}, {"v": 0.893, "t": "$893 million: ai", "at": "$893", "c": "red"}], enter="first", plate="fbi ic3 report 2025"), "AI scams, *counted*", at="first")]},
    "p04": {"cuts": [
        split(icon("doc", label="reported"), row("person", 12, cols=4, every=3, at="victims", hot=0, enter="victims", reveal=True), "most *never report*")]},
    # 10 how to stay safe
    "x01": {"cuts": [
        split(icon("shield", label="you"), icon("hourglass", label="slow down", enter="slow"), "first: *slow down*", at="First"),
        split(phone(name="unknown"), icon("clock", mark="no", markAt="hurry", label="hurry!", enter="hurry"), "scams need you to *hurry*", at="Every")]},
    "x02": {"cuts": [
        split(phone(name="your bank"), icon("cash", mark="?", markAt="money", label="money?", enter="money"), "asks for *money*?"),
        full(flow([{"icon": "monitor", "label": "hang up", "at": "hang"}, {"icon": "doc", "label": "known number", "at": "number"}, {"icon": "people", "label": "call back", "at": "back"}]), "*call back* yourself", at="hang")]},
    "x03": {"cuts": [
        split(icon("people", label="your family"), bubble("pineapple", enter="secret", by="secret word"), "a *secret word*", at="Third"),
        split(phone(name="mom", cloneAt="clone"), icon("face", mark="no", markAt="know", label="no word", enter="know", reveal=True), "a clone *can't know it*", at="clone")]},
    "x04": {"cuts": [
        split(icon("box", label="cracked app"), icon("laptop", mark="no", markAt="install", label="don't install", enter="install"), "no *cracked apps*"),
        split(icon("fingerprint", label="passkey"), login("bank-1ogin.com", fake=True, enter="login", reveal=True), "*passkeys*: nothing to steal", at="pass")]},
    # recap + flip
    "r01": {"cuts": [
        full(shop(["cash", "key", "doc", "browser", "face", "robot"]), "*the shop*"),
        full(chat("write a scam email", "comply", name="wormgpt", replyAt=0), "the chatbot that *says yes*", at="says"),
        full(call(label={"i": 0, "t": "finance chief"}, real=3, fakeAt=0), "the *face* on the call", at="face")]},
    "r02": {"cuts": [
        split(icon("robot", label="ai"), icon("cash", label="cheap", enter="cheap", mark="no", markAt="cheap"), "it made crime *cheap*", at="cheap"),
        full(call(label={"i": 3, "t": "applicant"}), "*normal* is what they sell", at="next")]},
}

CLIPS = {  # (file, from, to, plate[, fadeOut]); from/to in the clip file (speech runs from PAD = 0.6 s)
    "c01": ("cc_nk_ai.mp4", 0.30, 7.40, "Simon Wijckmans · catches fake job applicants · EMF Camp 2026", 0.1),
    "c02": ("cc_id_shops.mp4", 2.20, 10.28, "Alexej Hock & Max Bernhard · fraud researchers · 38C3", 0.08),
    "c03": ("cc_gai_voice.mp4", 0.62, 18.10, "Niklas Bunzel · Fraunhofer SIT · GoD 2024"),
}

ORDER = ("h00 c01 g01 g02 g03 g04 "
         "s01 s02 c02 s03 s04 "
         "w01 w02 w03 w04 w05 "
         "k01 k02 k03 k04 k05 "
         "i01 i02 i03 "
         "d01 d02 d03 d04 "
         "v01 c03 v02 v03 "
         "j01 j02 j03 j04 "
         "p01 p02 p03 p04 "
         "x01 x02 x03 x04 "
         "r01 r02")
ACTS = {"h00": "01 the grey zone", "s01": "02 the shop", "w01": "03 the chatbot that says yes", "k01": "04 scams for rent",
        "i01": "05 stolen logins", "d01": "06 fake faces", "v01": "07 fake voices", "j01": "08 the fake worker",
        "p01": "09 who cashes in", "x01": "10 how to stay safe", "r01": "10 how to stay safe"}

beats, act = [], "01 the grey zone"
for i in ORDER.split():
    act = ACTS.get(i, act)
    if i in CLIPS:
        f, a, z, plate, *fo = CLIPS[i]
        beats.append({"id": i, "clip": {"src": A + f, "from": a, "to": z, "plate": plate, **({"fadeOut": fo[0]} if fo else {})}})
        continue
    vo, say = VO[i]
    b = {"id": i, "vo": vo, **({"say": say} if say else {}), "shot": {**SHOTS[i], "act": act}}
    beats.append(b)

out = {"id": "ai-black-markets", "title": "THE DARK REALITY OF AI'S BLACK MARKETS",
       "voice": {"engine": "kokoro", "name": "af_heart", "speed": 0.95},
       "pace": {"lead": 0.2, "gap": 0.45, "min_beat": 2.4, "to_clip": 0.25, "after_clip": 0.45, "end_pad": 1.5},
       "beats": beats}
(HERE / "script.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
words = sum(len(b.get("vo", "").split()) for b in beats)
print(len(beats), "beats,", words, "words narrated,", len(CLIPS), "clips")
