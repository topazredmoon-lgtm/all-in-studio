# font LICENCES — engine/public/fonts

All faces in this folder are SIL Open Font License 1.1 or later. Every file is licensed
for embedding in rendered video (print/permitted) and redistribution WITH the OFL
(notice preserved). This manifest was created by the T-R2B typographic completion
(UPG-R9/DEF-L3 close, glm-5.3-flash-free round 2, 2026-10-17).

| file | licence | source | sha256 (prefix) | note |
|---|---|---|---|---|
| fraunces-var-full.ttf | OFL-1.1 | https://raw.githubusercontent.com/google/fonts/main/ofl/fraunces/Fraunces[SOFT,WONK,opsz,wght].ttf | `177ff6c0…` | full-axis variable (opsz+wght+SOFT+WONK); the receipts/display serif; OFL.txt sits next to this file (OFL-fraunces.txt) |
| source-serif-4-latin-standard-normal.woff2 | OFL-1.1 | Adobe Source Serif 4 (carried by studio) | `f2ea9c12…` | quotes & documents |
| source-serif-4-latin-standard-italic.woff2 | OFL-1.1 | Adobe Source Serif 4 (carried by studio) | `96e63932…` | quotes & documents |
| archivo-latin-standard-normal.woff2 | OFL-1.1 | Omnibus-Type Archivo (carried by studio) | `e3a28ead…` | caption voice (split shots) |
| shantell-sans-var.woff2 | OFL-1.1 | Shantell Sans (carried by studio) | `f15631ab…` | hand annotations / hook lines |
| inter-400.woff2 | OFL-1.1 | Rasmus Andersson Inter (carried by studio) | `34b9c504…` | re-created UI body |
| inter-600.woff2 | OFL-1.1 | Rasmus Andersson Inter (carried by studio) | `f9a06e79…` | re-created UI strong |
| ibm-plex-mono-400.woff2 | OFL-1.1 | IBM Plex Mono (carried by studio) | `08949f72…` | kickers, card text, big numbers |
| ibm-plex-mono-700.woff2 | OFL-1.1 | IBM Plex Mono (carried by studio) | `4f84d86c…` | kickers, card text, big numbers |

Offline rule (DESIGN.md): fonts load from `staticFile()` at render time; no network
fetches inside the render. Replacing any of these requires an owner-approved token
change in `engine/src/ds/tokens.ts` (a font IS a design-system decision).

`tools/type_audit.py` cross-checks tokens ↔ registered faces ↔ files on disk;
`tools/font_pull.py` re-fetches with exact pinned URLs only when a face is missing.
