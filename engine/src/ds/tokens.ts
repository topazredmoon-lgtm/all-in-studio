/**
 * All-in design system, layer 1: tokens. Spec + history: design-system/DESIGN.md.
 * Merged from: jolly-bell v3 `src/design/tokens.ts` ("newsprint at night": stage, paper, one red),
 * the v23 film (board, split cards, two-tone caption) and not-so-dark-times grammar v4 (modes, plates, teal = verified).
 * Components never use raw colours, fonts or sizes: they import from here.
 */
export const W = 1920;
export const H = 1080;
export const FPS = 30;

export const color = {
  // v23 minimal print (captchas_v23_PERFECTED + the "minimal" take of the disgn systems project). Values from jolly-bell src/theme.ts.
  stage: '#0E0C0B', // warm deep charcoal black
  stageDeep: '#0A0908',
  raised: '#161411', // warm charcoal card
  raised2: '#1E1B17',
  hair: 'rgba(233,227,211,0.16)', // cream chalk border, quiet
  hairStrong: 'rgba(233,227,211,0.34)',
  ink: '#F4F1EA',
  mute: '#8A8F98',
  red: '#E63946', // the one accent
  cyan: '#8A8F98', // machines are drawn in plain line art; no second accent colour in the minimal print
  yellow: '#E63946',
  go: '#4FB286', // "pass" ticks only
  onYellow: '#F4F1EA',
  // Evidence paper: documents, receipts, prints, book pages only
  paper: '#EEE8DC',
  paperInk: '#1B1812',
  paperMute: '#6B6355',
  redDeep: '#C42A1C',
  marker: 'rgba(255,210,63,0.80)',
  uiBlue: '#4A90E2', // reCAPTCHA's own UI blue, only inside re-created UI
  teal: '#4FB286',
  // V-CRAFT (Nemotron): paper/film textures baked by tools/make_grain.py.
  // Blend per engine/public/tex/tex_manifest.json: multiply 6-10% on parchment
  // cards only (PageQuote / UtilityStatement / receipt-crop frame). NEVER on
  // white UI cards (JobPortalCard stays SaaS-crisp), never on stage/clip.
  tex: {
    grain: 'tex/film_grain_baked.png',
    paper: 'tex/paper_tooth.png',
  } as const,
} as const;

export const font = {
  hand: 'AllinHand, "Comic Sans MS", cursive', // Shantell Sans: v23's caption voice, annotations, hook lines
  mono: 'AllinMono, Consolas, monospace', // IBM Plex Mono: kickers, card text, big numbers (v23)
  body: 'AllinBody, Arial, sans-serif', // Inter: re-created UI only, small body
  display: 'AllinMono, Consolas, monospace',
  serif: 'AllinSerif, Georgia, serif', // Source Serif 4: quotes and documents only
  fraunces: 'AllinFraunces, "Fraunces", Georgia, serif', // V-CRAFT (Nemotron/UPG-R9): receipts & display serif with optical axis; owner ships woff2 to engine/public/fonts offline
  sans: 'AllinBody, Arial, sans-serif',
} as const;

/** Type scale (px @1080p). Nothing readable below 22 (source plates) / 24 (labels). */
export const size = { micro: 22, label: 24, small: 28, body: 36, lead: 44, h3: 56, h2: 72, h1: 96, hero: 136, slam: 216 } as const;

export const space = {
  safe: 140, // nothing outside 140 px on any side except full-bleed photos and clips
  gap: 80, // gutter between the two split panels
  top: 190, // kicker row
  cardTop: 236,
  cardBottom: 776,
  capY: 880, // caption band top
} as const;

/** Split = the v23 duo: an object left, a card right, air around both (owner 2026-10-07: "the minimalist print and simplicity that v23 had"). */
export const split = {
  w: 700,
  h: space.cardBottom - space.cardTop, // 540
  lx: W / 2 - space.gap / 2 - 700, // 220
  rx: W / 2 + space.gap / 2, // 1000
} as const;

export const motion = {
  beat: 12,
  enter: 14, // frames: fade + rise + de-blur
  rise: 18,
  blur: 10,
  stagger: 5,
  cueLead: 4, // a cued element lands 4 frames before its word is heard
  count: 40, // counters
  sweep: 14, // highlighter / underline
  ease: [0.2, 0.7, 0.2, 1] as const,
} as const;

export const shadow = {
  card: '0 1px 0 rgba(255,255,255,0.04) inset, 0 18px 40px rgba(0,0,0,0.45)',
  paper: '0 1px 1px rgba(0,0,0,0.35), 0 8px 18px rgba(0,0,0,0.35), 0 30px 60px rgba(0,0,0,0.35)',
} as const;
