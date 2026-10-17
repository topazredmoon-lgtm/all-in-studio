# Engraving plates — how to cut one

The register `ds/kit.tsx` cannot reach. `kit`'s `LineIcon` is a 4 px pictogram: one weight, no interior, no shading.
It is right for a *label* ("a laptop") and wrong for a *metaphor*, and repeating it beat after beat is the thing the
owner rejected twice. A plate is the other register: **wood-engraving**, cream line on warm black, cut the way a
19th-century block is cut.

Owner, 2026-10-13, verbatim: *"i need new visuals and drawings … when it talks abt eating its own tail, why not a
snake eating its own tail or smthing? i dont want the generic human figure with sticks depecting the villain out of
the blue, i want beautifull drawings and designs please. Not slop … viewer must feel it has been WORKED on."*

**Framework**: `engine/src/ds/engrave.tsx`. **Reference cut**: `engine/src/ds/plates/ouroboros.tsx` — read it before
cutting anything; it is the standard, not an example.

## The three rules

1. **Three weights, never one.** `CONTOUR` (4.6, the silhouette) · `INNER` (2.8, structure inside the silhouette) ·
   `DETAIL` (1.5, the fine stuff — scales, grain, stonework, lettering). A one-weight drawing is an icon, not a plate.
2. **Shading is drawn, not filled.** Volume comes from `<Hatch>` and `<Stipple>` clipped into the form, denser where
   the light is not. Light comes from the **upper left** in every plate, so the lower right carries the dark. Flat
   `ink()` fills are reserved for the single red accent and cast shadows.
3. **It is cut, not revealed.** `useCutIn`/`Plate` give you `c.contour → c.inner → c.shade → c.detail → c.accent`.
   Draw the silhouette on `c.contour`, structure on `c.inner`, hatching on `c.shade`, fine grain on `c.detail`, the
   red on `c.accent`. Nothing fades up as a finished picture.

## What a finished plate has

- a **cast shadow** (an `ink()` ellipse) so the subject sits on something rather than floating;
- **at least two hatching passes** at different gaps — one tight pass in the core shadow, one loose pass over the
  whole form — and usually a `Stipple` for tooth;
- **its own motion**: something in the drawing moves over the shot (sand falls, rust climbs, a needle drifts, a jaw
  closes), driven by `c.at(delay, length)`. Never a loop, never a spin. Plus `breathe()` on the outer group.
- **one red element and no more**: the thing the line is about. Not a decoration.
- **no lettering** unless the metaphor is a document, and then it is engraved texture, not readable copy. The narrator
  carries the information; the caption carries the words.

## API you have

```tsx
import { CONTOUR, Clip, Cut, DETAIL, Hatch, INNER, Note, Plate, Stipple, VB, breathe, cut, ink, useIds } from '../engrave';

export const Thing: React.FC<{ w: number; h: number; size?: number; at?: string | number;
  label?: string; labelAt?: string | number; plate?: string }> = ({ w, h, size, at, label, labelAt, plate }) => {
  const [form] = useIds(1);                       // stable <clipPath> ids
  return (
    <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} at={at} plate={plate}>
      {(c) => {                                    // c: Cut — the cutting schedule
        const t = c.at(30, 80);                    // this plate's own motion, 0 → 1
        const body = 'M… Z';
        return (
          <g style={breathe(c.frame)}>
            <Clip id={form} d={body} />
            <ellipse cx={200} cy={352} rx={110} ry={14} {...ink(c.shade, color.stageDeep, 0.9)} />
            <path d={body} {...cut(c.contour, color.ink, CONTOUR)} />
            <path d="…" {...cut(c.inner, color.ink, INNER)} />
            <Hatch clip={form} p={c.shade} angle={40} gap={9} op={0.3} box={[200, 180, 160, 180]} />
            <Hatch clip={form} p={c.shade} angle={40} gap={17} op={0.16} />
            <Stipple clip={form} p={c.detail} n={260} seed={5} op={0.22} />
            <circle cx={…} cy={…} r={6} {...ink(c.accent, color.red)} />
          </g>
        );
      }}
    </Plate>
  );
};
```

- viewBox is **400 × 400**, centre `200,200`. Keep the drawing inside ~`16 … 384` so nothing clips in a split panel.
- `cut(p, colour, weight, dash?)` spreads onto `<path>`, `<circle>`, `<ellipse>`, `<rect>` alike and inks the stroke
  on along its own length. `ink(p, colour, opacity)` is a fill.
- `Hatch box` is `[x, y, w, h]` in viewBox units: the region the burin lines are generated across, *then* clipped to
  the form. A tight box = a local shadow; the default box = the whole form.
- Colours only from `ds/tokens`: `color.ink` (cream), `color.mute`, `color.red`, `color.stageDeep`, `color.paper`.
  Never a hex literal.


## The 22 Engraved Master Plates (`engine/src/ds/plates/index.ts`)

| Plate | Metaphor / Form | Used For |
|---|---|---|
| `Ouroboros` | Serpent swallowing its tail | Recursive AI training on its own output / closed feedback loops (Reference Cut). |
| `Alembic` | Alchemical distillation flask | Distillation attacks, extracting model capabilities into smaller clones. |
| `Balance` | Classical scales of justice | Weighing risk vs utility; regulatory burden favoring monopolies. |
| `BellJar` | Scientific vacuum bell jar | Controlled lab environments, unconsenting public experiments. |
| `BluntPencil` | Worn graphite stub pencil | Deleting the fail-safes; loss of fine human precision. |
| `CastOfACast` | Degraded classical plaster cast | Generation loss across recursive copies; fine details dissolving first. |
| `CloudingGlass` | Oxidized, smoky magnifying glass | Loss of transparency, black-box obscurity. |
| `Compass` | Navigational brass drafting divider | Geofencing, location verification, export control borders. |
| `CopyStack` | Reams of mimeographed paper | Mass generation, synthetic data flooding the open web. |
| `Delta` | Braided river mouth / delta | Divergence between open-source models and closed corporate AI. |
| `DeskLamp` | Vintage green glass shade lamp | Auditing, compliance scrutiny, investigations. |
| `DriftingCourse` | Nautical course drifting off bearing | Satellites, private orbital assets, escaping regulatory orbit. |
| `JournalPlate` | Stitched leather binding ledger | Unbroken chain of custody, unalterable historical logs. |
| `JugCup` | Earthenware jug pouring into cup | Pouring data from one model to another. |
| `Meadow` | Wild tallgrass pasture | The open internet commons before web-scraping enclosures. |
| `PaperRiver` | Winding river made of printed leaves | Continuous flow of documents, leaks, and disclosures. |
| `PressStack` | Heavy iron industrial screw press | Crushing corporate pressure; regulatory capture. |
| `RustingGate` | Ornate iron gate with broken latch | Frictionless borders; perimeter security rules falling apart. |
| `SeedVault` | Vault doors safeguarding seed specimens | Safeguarding human-written heritage from synthetic contamination. |
| `TowerRabbits` | Perpendicular church tower with rabbits | Nature paper finding (OPT-125m model collapse to jackrabbit tails). |
| `TwoHands` | Engraved human hands reaching/clasping | Human authorship, authentic consent, the human touch. |
| `Well` | Deep masonry well with wooden bucket | The foundational training data commons. |

## Checking your work

```
cd engine && npx tsc --noEmit -p .
npx remotion still src/index.ts plate-sheet ../qa/plates.png --frame=90 --scale=0.5
```

`plate-sheet` renders every plate exported from `ds/plates/index.ts` in a grid with its name. **Look at the PNG.**
A plate is done when, with the name covered, you can say what it is in two words — and it still looks cut rather
than drawn with one pen. Fix it until both are true.

## The schedule rule (watch.py: no cut may open on an empty board)

A plate gets its cutting schedule (`contour → inner → shade → detail`) from `Plate`'s `at`, and its own motion
from the cue word the line gives it. These are **two different clocks**: pass the motion cue (e.g. `litAt`,
`spinAt`, `zoneAt`, `noteAt`, `barsAt`) to the component, resolve it with `useCue` in the component body, and
leave `Plate at` unset so the silhouette cuts in at frame 0 of the shot. If the cutting schedule itself waits on
a late word, the panel is empty for seconds at every cut — `watch.py` fails it as a near-empty screen
(ai-power-bill, 2026-10-14: three such moments before the fix). The left panel is the subject from frame 0;
only the red and the movement land on the word.


## Registered Plates Inventory
All plates are exported from `engine/src/ds/plates/index.ts`:
- `Ouroboros` (`ouroboros.tsx`): The gold-standard reference cut. A serpent eating its tail, representing recursive AI model collapse / closed feedback loop.
- To create a new plate: follow the 3 rules above, export from `index.ts`, and render `qa/plates.png` with `npx remotion still src/index.ts plate-sheet ../qa/plates.png`.
