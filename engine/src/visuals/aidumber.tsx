/**
 * Topic visuals: why-ai-dumber v2 (2026-10-13). v1 leaned entirely on the generic icon grammar (robot/doc rows,
 * one Flow, one Bars) repeated beat after beat — the owner's note on v1: needs new designs, more visual diversity,
 * smart metaphors, not the same icon grammar repeated. v2 adds three new reusable kit primitives built for this:
 * `Loop` (a closed feedback ring — the mechanism no `Flow` can show, since `Flow` only runs one way), `Copier`
 * (a photocopy of a photocopy: the same page re-scanned generation after generation, fine print fading first —
 * "rare facts vanish first" as a picture, not a bar chart) and `FieldCard` (a quiet spec-sheet of label → value
 * rows, filling in on their words — the structured-card look S's own reference uses). Catalogue: VISUALS.md.
 */
export { LineIcon, IconRow, Bars, Flow, Loop, Copier, FieldCard, CalendarCard, Bubble } from '../ds/kit';
