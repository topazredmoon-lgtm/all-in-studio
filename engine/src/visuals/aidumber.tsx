/**
 * Topic visuals: why-ai-dumber **v3** (2026-10-13).
 *
 * v1 and v2 both leaned on `kit`'s pictogram grammar (robot / person / doc, a Flow, a Bars) beat after beat, and the
 * owner rejected it twice — the second time by naming what he wanted instead: "when it talks abt eating its own tail,
 * why not a snake eating its own tail or smthing? ... i want beautifull drawings and designs please. Not slop ...
 * viewer must feel it has been WORKED on."
 *
 * So v3 is cut in a different register entirely: the **engraving plates** (`ds/engrave.tsx`, `ds/plates/`, spec in
 * `design-system/PLATES.md`) — wood-engraving in cream on warm black, three stroke weights, hatched and stippled
 * shading, one red accent, each plate carrying its own motion. One bespoke plate per line of the script; no plate
 * does duty for two meanings. The single deliberate repeat is `Ouroboros`, the film's hero image, brought back in
 * the last beat as the closing callback.
 *
 * `CalendarCard` is the one survivor from `kit`: a date is furniture, not a metaphor, and it pairs with the bell jar
 * rather than standing alone (the "never a number on an empty screen" rule).
 */
export * from '../ds/plates';
export { CalendarCard } from '../ds/kit';
