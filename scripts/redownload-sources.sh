#!/usr/bin/env bash
# Re-download the raw source talks into .cc-src/ (skips existing files). Sources: .cc-src/urls.txt (Wikimedia Commons)
# and .cc-src/ccc.txt (media.ccc.de: "<id> <url1> <url2>"). All openly licensed (CC BY / CC BY-SA).
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"; DEST="$ROOT/.cc-src"; mkdir -p "$DEST"
UA="All-in-research/1.0 (quartz video project)"
get() {  # get <url> <filename>
  [ -s "$DEST/$2" ] && { echo "skip $2"; return; }
  curl -fL --retry 3 -A "$UA" -o "$DEST/$2.part" "$1" && mv "$DEST/$2.part" "$DEST/$2" && echo "got  $2"
}
# urls.txt: original uploads only (skip the transcoded 480p copies); file name = last path segment without ?query
while read -r url; do
  url="${url%$'\r'}"; [ -z "$url" ] && continue; case "$url" in */transcoded/*) continue;; esac
  get "$url" "$(basename "${url%%\?*}")"
done < "$DEST/urls.txt"
# ccc.txt: second field is the transcript source (opus, or the sd mp4 for 32c3_7324) -> <id>.<ext>.
# Third field (hd mp4) is cut over http by cc_clips.py (remote:true), so it is not downloaded here.
while read -r id u1 _; do
  u1="${u1%$'\r'}"; [ -z "$id" ] && continue
  get "$u1" "$id.${u1##*.}"
done < "$DEST/ccc.txt"
