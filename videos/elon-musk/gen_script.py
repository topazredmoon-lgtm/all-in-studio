"""Writes script.json for elon-musk (2-minute cinema sample, 2026-10-13).

Owner note: "in the sample i also did not find the spirit of the original videos when it showed lot of stuff
side to side, instead u just draw one drawing in the center... you are right so then fix everything,
then improve everything and do not do mistakes again. also make sure that if another model or another
harness works on this folder, that it wont make mistakes. after skeleton refining and polish is done
and verified. give a 2min sample"

Key architecture:
- 100% Left/Right split (side-to-side evidence rhythm)
- Left = the subject on screen from frame 0
- Right = the concrete evidence landing on its cue word (enter)
- "Say the line, point at the thing it names": bespoke vector drawings (StarlinkShell,
  PayloadRatio, SensorPurge, GeofenceMap, BetaWaiver, DragonDependency, PowerCluster)
- Voice: Chatterbox cinema voice with " | " breaks for dramatic weight
- Mastering: "master": "cinema" in script.json
"""
import json
from pathlib import Path

HERE = Path(__file__).parent


def split(L, R, cap=None, at=None, **kw):
    d = {"layout": "split", "L": L, "R": R, **kw}
    if cap: d["cap"] = cap
    if at is not None: d["at"] = at
    return d


def icon(name, **kw): return {"v": "LineIcon", "surface": "bare", "name": name, **kw}
def row(name, n, **kw): return {"v": "IconRow", "surface": "bare", "name": name, "n": n, **kw}
def field(title, k1, v1, k2, v2, **kw):
    rows = [{"label": k1, "value": v1}, {"label": k2, "value": v2}]
    return {"v": "FieldCard", "surface": "bare", "kicker": title, "rows": rows, **kw}

# Bespoke Musk visuals
def geofence(**kw): return {"v": "GeofenceMap", "surface": "bare", **kw}
def starlink(**kw): return {"v": "StarlinkShell", "surface": "bare", **kw}
def payload(**kw): return {"v": "PayloadRatio", "surface": "bare", **kw}
def sensor(**kw): return {"v": "SensorPurge", "surface": "bare", **kw}
def waiver(**kw): return {"v": "BetaWaiver", "surface": "bare", **kw}
def dragon(**kw): return {"v": "DragonDependency", "surface": "bare", **kw}
def cluster(**kw): return {"v": "PowerCluster", "surface": "bare", **kw}


VO = {
    # --- ACT 1: THE SWITCH (BLACK SEA) ---
    "h00": (
        "In September 2022, a secret naval assault crossed the Black Sea. Submarine drones, packed with explosives, were closing in on the Russian fleet.",
        "In September 2022, a secret naval assault crossed the Black Sea. || Submarine drones, packed with explosives, were closing in on the Russian fleet.",
        0.75
    ),
    "h01": (
        "Then, miles from the target, the screens went dead. The drones lost signal, stalled in the water, and washed ashore harmlessly.",
        "Then, miles from the target, the screens went dead. | The drones lost signal, stalled in the water, and washed ashore harmlessly.",
        0.8
    ),
    "a01": (
        "No military jammed them. The Ukrainian commanders didn't call it off. One private citizen in Texas simply turned off the satellites.",
        "No military jammed them. | The Ukrainian commanders didn't call it off. || One private citizen in Texas, simply turned off the satellites.",
        0.75
    ),

    # --- ACT 2: THE ORBITAL CAGE ---
    "a02": (
        "We are told competition drives technology. But look up tonight. There are roughly ten thousand active satellites orbiting planet Earth.",
        "We are told competition drives technology. | But look up tonight. || There are roughly ten thousand active satellites orbiting planet Earth.",
        0.7
    ),
    "a03": (
        "SpaceX owns more than sixty percent of them. More than all other nations, militaries, and corporations on Earth combined.",
        "Space X owns more than sixty percent of them. || More than all other nations, militaries, and corporations on Earth, combined.",
        0.8
    ),

    # --- ACT 3: THE LAUNCH CHOKEPOINT ---
    "a04": (
        "And it is not just internet dishes. It is the ability to leave the planet.",
        "And it is not just internet dishes. || It is the ability to leave the planet.",
        0.75
    ),
    "a05": (
        "Last year, SpaceX launched eighty-seven percent of all payload mass into orbit globally. China launched ten percent. The rest of the world shared scraps.",
        "Last year, Space X launched eighty-seven percent of all payload mass into orbit globally. | China launched ten percent. | The rest of the world, shared scraps.",
        0.8
    ),
    "a06": (
        "When NASA needs to fly American astronauts to the Space Station, Boeing failed. The United States government has zero alternative.",
        "When NASA needs to fly American astronauts to the Space Station, Boeing failed. || The United States government has zero alternative.",
        0.75
    ),

    # --- ACT 4: THE TERRESTRIAL GAMBLE (TESLA SENSORS) ---
    "a07": (
        "Down on the highway, the exact same unilateral gamble sits in traffic next to you.",
        "Down on the highway, the exact same unilateral gamble sits in traffic next to you.",
        0.7
    ),
    "a08": (
        "In May 2021, Elon ordered radar stripped from every Tesla vehicle. In 2022, he purged the ultrasonic sonar sensors.",
        "In May 2021, Elon ordered radar stripped from every Tesla vehicle. || In 2022, he purged the ultrasonic sonar sensors.",
        0.75
    ),
    "a09": (
        "His engineers warned him cameras alone get blinded by direct sunlight, fog, and rain. The sensors were removed anyway.",
        "His engineers warned him cameras alone get blinded by direct sunlight, fog, and rain. || The sensors were removed anyway.",
        0.75
    ),
    "a10": (
        "Federal investigators logged hundreds of phantom braking crashes where cars slammed the brakes at highway speeds for shadows.",
        "Federal investigators logged hundreds of phantom braking crashes, where cars slammed the brakes at highway speeds, for shadows.",
        0.8
    ),

    # --- ACT 5: THE LEGAL TRAP (FSD WAIVER) ---
    "a11": (
        "He calls it Full Self-Driving. But open the beta agreement you tap accept on.",
        "He calls it Full Self-Driving. || But open the beta agreement you tap accept on.",
        0.75
    ),
    "a12": (
        "Section four: you must maintain control every microsecond. If the car crashes, you are one hundred percent legally liable.",
        "Section four: you must maintain control every microsecond. || If the car crashes, you are one hundred percent legally liable.",
        0.8
    ),
    "a13": (
        "If the algorithm succeeds, it is his genius. When it fails on the highway, you take the felony.",
        "If the algorithm succeeds, it is his genius. || When it fails on the highway, you take the felony.",
        0.85
    ),

    # --- ACT 6: THE UNCHECKED EMPIRE ---
    "a14": (
        "Satellites. Rockets. Cars. The public square. Artificial intelligence.",
        "Satellites. | Rockets. | Cars. | The public square. || Artificial intelligence.",
        0.75
    ),
    "a15": (
        "In history, power this vast was held by empires with treaties and parliaments. Today, it sits with one man and no board of directors.",
        "In history, power this vast was held by empires with treaties and parliaments. || Today, it sits with one man, and no board of directors.",
        0.8
    ),
    "a16": (
        "The dark reality isn't that he might fail. It's that our world has built no backup if he does.",
        "The dark reality isn't that he might fail. || It's that our world has built no backup, if he does.",
        0.85
    ),
}

ORDER = [
    "h00", "h01", "a01",
    "a02", "a03",
    "a04", "a05", "a06",
    "a07", "a08", "a09", "a10",
    "a11", "a12", "a13",
    "a14", "a15", "a16"
]

SHOTS = {
    # 01 THE SWITCH
    "h00": {"cuts": [
        split(
            geofence(droneAt="naval"),
            icon("radar", label="naval radar", plate="black sea · crimea naval corridor"),
            cap="a *secret strike* in the dark"
        ),
        split(
            geofence(droneAt="drones"),
            icon("target", label="russian fleet", plate="sevastopol harbor"),
            cap="closing in on the *fleet*",
            at="Submarine"
        )
    ]},
    "h01": {"cuts": [
        split(
            geofence(cutAt="dead"),
            starlink(lockAt="target", plate="starlink orbital link"),
            cap="the screens *went dead*"
        ),
        split(
            geofence(cutAt="signal"),
            icon("crosshair", mark="no", label="signal lost", plate="crimea exclusion zone"),
            cap="the drones *lost signal*",
            at="drones"
        )
    ]},
    "a01": {"cuts": [
        split(
            icon("person", label="commanders", plate="defense forces"),
            icon("warning", mark="no", label="not jammed", plate="no electronic warfare"),
            cap="no military *jammed them*"
        ),
        split(
            icon("person", label="private citizen", plate="walter isaacson · 2023"),
            starlink(monopolyAt="satellites", tag={"t": "geofence cutoff", "at": "turned"}),
            cap="one man *turned off* the sky",
            at="One"
        )
    ]},

    # 02 THE ORBITAL CAGE
    "a02": {"cuts": [
        split(
            icon("eye", label="competition"),
            icon("globe", label="planet earth", plate="orbital space"),
            cap="look up *tonight*"
        ),
        split(
            starlink(satAt="satellites"),
            field("ACTIVE ORBIT", "SATELLITES", "10,000 TOTAL", "ALTITUDE", "550 KM LEO", plate="celestrak catalog 2024"),
            cap="ten thousand *satellites* above",
            at="There"
        )
    ]},
    "a03": {"cuts": [
        split(
            starlink(monopolyAt="60"),
            field("ORBITAL SHARE", "SPACEX", "6,400+ SATS", "REST OF WORLD", "3,800 SATS", plate="brycetech · orbital data 2024"),
            cap="*sixty percent* in one hand"
        ),
        split(
            starlink(monopolyAt="combined"),
            row("globe", 8, highlight=5, plate="combined sovereign states"),
            cap="more than *all nations combined*",
            at="more#2"
        )
    ]},

    # 03 THE LAUNCH CHOKEPOINT
    "a04": {"cuts": [
        split(
            icon("radar", label="starlink dish"),
            icon("globe", label="planet earth"),
            cap="not just *internet dishes*"
        ),
        split(
            icon("globe", label="planet earth"),
            payload(rocketAt="leave", plate="mass to orbit"),
            cap="the only way *off the planet*",
            at="It#2"
        )
    ]},
    "a05": {"cuts": [
        split(
            payload(massAt="87"),
            field("GLOBAL LAUNCH MASS", "SPACEX", "87% OF TOTAL", "REST OF WORLD", "13% TOTAL", plate="brycetech 2024 launch index"),
            cap="*eighty-seven percent* of all mass"
        ),
        split(
            payload(massAt="87", ratioAt="scraps"),
            row("rocket", 10, highlight=9, plate="brycetech launch reports"),
            cap="the rest shared *scraps*",
            at="China"
        )
    ]},
    "a06": {"cuts": [
        split(
            dragon(crewAt="astronauts"),
            icon("person", label="astronauts", plate="nasa commercial crew"),
            cap="when boeing *failed*"
        ),
        split(
            dragon(zeroAt="zero"),
            field("US CREW ACCESS", "CREW DRAGON", "ONLY FLIGHT OPTION", "DOMESTIC BACKUP", "ZERO VEHICLES", plate="nasa inspector general report"),
            cap="*zero* domestic backup",
            at="United"
        )
    ]},

    # 04 THE TERRESTRIAL GAMBLE
    "a07": split(
        icon("car", label="fleet"),
        sensor(enter="exact", plate="tesla vision transition"),
        cap="the gamble *next to you*"
    ),
    "a08": {"cuts": [
        split(
            sensor(radarAt="radar"),
            field("RADAR REMOVED", "MODEL 3 / Y", "MAY 2021", "HARDWARE", "PURGED", plate="tesla safety update"),
            cap="radar *stripped away*"
        ),
        split(
            sensor(sonarAt="ultrasonic"),
            field("SONAR REMOVED", "12 ULTRASONICS", "OCT 2022", "PROXIMITY", "DELETED", plate="tesla vision bulletin"),
            cap="sonar sensors *purged*",
            at="In#2"
        )
    ]},
    "a09": {"cuts": [
        split(
            sensor(glareAt="blinded"),
            icon("warning", mark="no", label="blinded", plate="internal engineering memo"),
            cap="cameras *blinded* by rain"
        ),
        split(
            sensor(radarAt="sensors", sonarAt="sensors"),
            icon("contract", mark="no", label="unilateral", plate="decision override"),
            cap="removed *anyway*",
            at="sensors"
        )
    ]},
    "a10": {"cuts": [
        split(
            field("NHTSA PROBE", "INVESTIGATION", "PE22-022", "REPORTS", "750+ INCIDENTS", plate="federal crash registry"),
            icon("car", label="tesla fleet"),
            cap="hundreds of *phantom crashes*"
        ),
        split(
            sensor(glareAt="brakes"),
            icon("warning", mark="no", label="optical shadow", plate="unexpected deceleration"),
            cap="slamming brakes *for shadows*",
            at="where"
        )
    ]},

    # 05 THE LEGAL TRAP
    "a11": {"cuts": [
        split(
            waiver(nagAt="full"),
            icon("car", label="supervised"),
            cap="he calls it *self-driving*"
        ),
        split(
            waiver(nagAt="beta"),
            icon("contract", plate="beta terms section 4"),
            cap="the *beta agreement* trap",
            at="But"
        )
    ]},
    "a12": {"cuts": [
        split(
            waiver(reactAt="control"),
            field("SECTION 4", "DRIVER OBLIGATION", "MONITORING", "TIMEFRAME", "EVERY MICROSECOND", plate="fsd agreement"),
            cap="maintain control *every moment*"
        ),
        split(
            waiver(waiverAt="100"),
            field("LIABILITY SHIFT", "MARKETING", "SELF-DRIVING", "LEGAL CONTRACT", "100% DRIVER LIABLE", plate="fsd beta terms"),
            cap="you take *all the blame*",
            at="If"
        )
    ]},
    "a13": {"cuts": [
        split(
            icon("person", label="his genius", plate="commercial PR"),
            icon("car", label="fsd beta"),
            cap="his algorithm, *his genius*"
        ),
        split(
            waiver(waiverAt="felony"),
            icon("lock", plate="legal liability clause", label="driver felony"),
            cap="his genius, *your felony*",
            at="When"
        )
    ]},

    # 06 THE UNCHECKED EMPIRE
    "a14": {"cuts": [
        split(
            cluster(hubAt="satellites"),
            row("rocket", 3, cols=3),
            cap="satellites, *rockets, cars*"
        ),
        split(
            cluster(hubAt="artificial"),
            field("UNCHECKED ASSETS", "PUBLIC SQUARE", "X / TWITTER", "FRONTIER AI", "xAI COMPUTE", plate="conglomerate map"),
            cap="an *empire* of infrastructure",
            at="the"
        )
    ]},
    "a15": {"cuts": [
        split(
            icon("building", label="parliaments", plate="sovereign states"),
            icon("contract", label="treaties"),
            cap="empires held by *parliaments*"
        ),
        split(
            cluster(hubAt="one"),
            icon("person", mark="no", label="no board", plate="corporate filings · no board"),
            cap="no treaties, *no board*",
            at="Today"
        )
    ]},
    "a16": {"cuts": [
        split(
            geofence(cutAt="dark"),
            icon("warning", mark="?", label="might fail", plate="single point of failure"),
            cap="the *dark reality*"
        ),
        split(
            geofence(cutAt="backup"),
            starlink(monopolyAt="backup", plate="zero fallback systems"),
            cap="we built *no backup*",
            at="It's"
        )
    ]},
}

if __name__ == "__main__":
    beats = []
    for bid in ORDER:
        vo, say, ex = VO[bid]
        b = {
            "id": bid,
            "vo": vo,
            "say": say,
            "ex": ex,
            "shot": SHOTS[bid]
        }
        beats.append(b)

    data = {
        "id": "elon-musk",
        "title": "THE DARK REALITY OF ELON MUSK",
        "voice": {
            "engine": "chatterbox",
            "ref": "assets/voice/narrator_ref.wav",
            "ex": 0.75,
            "cfg": 0.35,
            "temp": 0.8
        },
        "master": "cinema",
        "pace": {
            "lead": 0.2,
            "gap": 0.45,
            "min_beat": 2.4,
            "to_clip": 0.25,
            "after_clip": 0.45,
            "end_pad": 1.8
        },
        "beats": beats
    }

    (HERE / "script.json").write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(f"Wrote script.json for elon-musk with {len(beats)} beats (100% Left/Right split)")
