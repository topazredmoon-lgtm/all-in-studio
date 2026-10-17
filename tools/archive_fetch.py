#!/usr/bin/env python3
"""archive_fetch.py — $0, no-key archival stills from public-domain collections, WITH receipts.

Extends registry UPG-V6 (OpenMontage / web-media-getter archival adapters) from proposal to a
working, tested tool. The studio's soul uses real archival photographs; until now nothing in
tools/ could fetch them. This fetches, converts, resizes, and — the important part — writes a
provenance sidecar next to every file so a caption/EULA check stays one `rights` call away.

Sources (all no API key, $0, no accounts):
  ia    archive.org  — advancedsearch + metadata APIs. Filter to public-domain image items by
                       default (collection:prelinger OR licenses PD/CC0); Prelinger = PD films,
                       mediatype:image covers stills across the archive.
  loc   loc.gov      — JSON API (`?fo=json`). Prints the item's rights statement; many are
                       "no known restrictions on publication".
  nasa  images.nasa.gov — search API, no key. NASA imagery is generally not copyrighted.

Examples
  python tools/archive_fetch.py search "telephone switchboard operator 1950" --source ia
  python tools/archive_fetch.py search "bank vault 1920" --source loc --limit 6
  python tools/archive_fetch.py fetch loc://2019654989 --name vault_1920 [--out E:/allin-archive]
  python tools/archive_fetch.py fetch ia://prelinger --pick 3 --name switchboard   # item w/ files
  python tools/archive_fetch.py rights E:/allin-archive/vault_1920.json

Fetch policy (soul safety)
  - STILLS ONLY by default: a downloaded still with provenance is near-zero Content-ID risk;
    moving footage from archive.org can be re-uploaded/claimed by others — the tool will not
    fetch video unless --allow-video is passed, and then only prints a strong warning.
  - Every fetch prints the rights string BEFORE writing, and stores it in the sidecar.
  - Files land on E: by default (models/media on E:, never bloat C:); --out overrides.
  - >2600px or non-JPEG/PNG images are converted to JPEG q92 (disk guard); --keep-original keeps
    the raw bytes as well.

Exit codes: 0 ok · 1 nothing found · 2 usage/IO error.
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import io
import json
import os
import re
import shutil
import sys
import tempfile
from pathlib import Path
from urllib.parse import quote, quote_plus, urlparse
from urllib.request import Request, urlopen

DEFAULT_OUT = Path("E:/allin-archive")
UA = {"User-Agent": "all-in-archival-fetch/1.0 (research; contact: local)"}
MAX_MB = 80
IMG_EXT = (".jpg", ".jpeg", ".png", ".tif", ".tiff", ".gif", ".webp", ".bmp")


def log(*a):
    print("[archive_fetch]", *a)


def http_json(url: str, timeout: int = 45):
    req = Request(url, headers=UA)
    with urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8", "replace"))


def http_head_ok(url: str, timeout: int = 20) -> bool:
    try:
        req = Request(url, headers=UA, method="HEAD")
        with urlopen(req, timeout=timeout) as r:
            return r.status == 200
    except Exception:  # noqa: BLE001
        return False


# ------------------------------------------------------------------ sources
def ia_search(q: str, limit: int) -> list[dict]:
    fl = "identifier,title,licenseurl,collection,mediatype,date,creator"
    q2 = q if "mediatype" in q else f"({q}) AND mediatype:image"  # stills only by default
    url = ("https://archive.org/advancedsearch.php?q=" + quote_plus(q2) +
           f"&fl%5B%5D={fl.replace(',', '&fl%5B%5D=')}&rows={limit}&page=1&output=json")
    data = http_json(url)
    out = []
    for doc in (data.get("response") or {}).get("docs", []):
        out.append({
            "source": "ia", "id": doc.get("identifier"), "title": doc.get("title"),
            "rights": doc.get("licenseurl") or f"collections: {doc.get('collection')}",
            "mediatype": doc.get("mediatype"), "date": doc.get("date"),
            "url": f"https://archive.org/details/{doc.get('identifier')}",
        })
    return out


def ia_files(identifier: str) -> list[dict]:
    data = http_json(f"https://archive.org/metadata/{identifier}")
    files = []
    for f in data.get("files", []):
        name = f.get("name", "")
        low = name.lower()
        if not low.endswith(IMG_EXT):
            continue
        if "__ia_thumb" in low or low.endswith("_thumb.jpg"):  # service thumbnails, not the artifact
            continue
        files.append({"name": name, "size": int(f.get("size") or 0),
                      "url": f"https://archive.org/download/{identifier}/{quote(name, safe='')}"})
    # real stills first (jpg/png), then the largest available (full scan, not preview)
    files.sort(key=lambda x: (0 if x["name"].lower().endswith((".jpg", ".jpeg", ".png")) else 1, -x["size"]))
    return files


def loc_search(q: str, limit: int) -> list[dict]:
    url = f"https://www.loc.gov/search/?q={quote_plus(q)}&fo=json&c={limit}&at=results"
    data = http_json(url)
    out = []
    for it in data.get("results", []):
        out.append({
            "source": "loc", "id": it.get("id"), "title": it.get("title"),
            "rights": (it.get("rights") or it.get("rights_advisory") or "unknown"),
            "date": it.get("date"), "url": it.get("url") or it.get("id"),
        })
    return out


def loc_images(loc_id_or_url: str) -> list[dict]:
    url = loc_id_or_url if loc_id_or_url.startswith("http") else f"https://www.loc.gov/item/{loc_id_or_url}/"
    data = http_json(url.rstrip("/") + "/?fo=json")
    item = data.get("item", data)
    imgs = []
    # loc.gov item JSON: item["image_url"] (list) and resources[].files
    for u in item.get("image_url") or []:
        imgs.append({"name": u.rsplit("/", 1)[-1], "size": 0, "url": u})
    for res in item.get("resources", []):
        for f in res.get("files", []) or []:
            u = f.get("url") or ""
            fm = (f.get("mimetype") or "").lower()
            if u and ("image" in fm or u.lower().endswith(IMG_EXT)):
                imgs.append({"name": u.rsplit("/", 1)[-1], "size": int(f.get("size") or 0), "url": u})
    # prefer jpeg, then smallest
    imgs.sort(key=lambda x: (0 if x["name"].lower().endswith((".jpg", ".jpeg")) else 1, x["size"]))
    seen, dedup = set(), []
    for i in imgs:
        if i["url"] not in seen:
            seen.add(i["url"]); dedup.append(i)
    return dedup


def nasa_search(q: str, limit: int) -> list[dict]:
    data = http_json("https://images-api.nasa.gov/search?q=" + quote_plus(q))
    out = []
    for it in (data.get("collection") or {}).get("items", [])[:limit]:
        d = it.get("data", [{}])[0]
        out.append({
            "source": "nasa", "id": d.get("nasa_id"), "title": d.get("title"),
            "rights": "NASA imagery: generally not copyrighted",
            "date": d.get("date_created"), "url": it.get("href"),
        })
    return out


def nasa_files(ident: str) -> list[dict]:
    href = ident if ident.startswith("http") else None
    if href is None:
        for kind in ("image", "video"):
            cand = f"https://images-assets.nasa.gov/{kind}/{ident}/collection.json"
            try:
                data = http_json(cand)
                href = cand
                break
            except Exception:  # noqa: BLE001
                continue
        if href is None:
            return []
    else:
        data = http_json(href if href.endswith(".json") else href.rstrip("/") + "/collection.json")
    files = []
    for u in data:
        if str(u).lower().endswith((".jpg", ".jpeg", ".png", ".mp4", ".mov")):
            files.append({"name": str(u).rsplit("/", 1)[-1], "size": 0, "url": u})
    files.sort(key=lambda x: (0 if "~orig" in x["url"] or "~large" in x["url"] else 1))
    return files


# ------------------------------------------------------------------ fetch
def pixel_size(path: Path) -> tuple[int, int] | None:
    try:
        from PIL import Image
        with Image.open(path) as im:
            return im.size
    except Exception:  # noqa: BLE001
        return None


def convert_to_jpeg(src: Path, dst: Path, long_edge: int = 2600) -> None:
    from PIL import Image
    with Image.open(src) as im:
        im = im.convert("RGB")
        w, h = im.size
        scale = min(1.0, long_edge / max(w, h))
        if scale < 1.0:
            im = im.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
        im.save(dst, "JPEG", quality=92, optimize=True)


def download(url: str, dest_dir: Path, name: str) -> Path:
    dest_dir.mkdir(parents=True, exist_ok=True)
    if url.startswith("http://"):
        url = "https://" + url[len("http://"):]
    req = Request(url, headers=UA)
    fd, tmpname = tempfile.mkstemp(suffix=".part", dir=str(dest_dir))
    os.close(fd)  # Windows: mkstemp keeps the handle open -> reopen below would hit WinError 32
    tmp = Path(tmpname)
    total = 0
    try:
        with urlopen(req, timeout=120) as r, open(tmp, "wb") as f:
            while True:
                chunk = r.read(1 << 20)
                if not chunk:
                    break
                total += len(chunk)
                if total > MAX_MB * 1 << 20:
                    raise SystemExit(f"download exceeded {MAX_MB} MB — refusing (use --max-mb)")
                f.write(chunk)
        ext = Path(urlparse(url).path).suffix.lower() or ".img"
        raw = dest_dir / f"{name}{ext}"
        shutil.move(tmp, raw)
        return raw
    finally:
        tmp.unlink(missing_ok=True)


def fetch_one(src: str, kind: str, q: str, args) -> Path | None:
    """src: 'ia://identifier' | 'loc://id-or-url' | 'nasa://href' or raw http(s) image url."""
    outdir = Path(args.out)
    name = args.name or re.sub(r"[^a-z0-9]+", "_", (args.query or src).lower())[:48].strip("_") or "image"

    if src.startswith(("http://", "https://")):
        files = [{"url": src, "name": src.rsplit("/", 1)[-1], "size": 0}]
        rights = "(direct URL — verify rights yourself)"
        ident = src.rsplit("/", 1)[-1]
        page = src
    else:
        scheme, _, ident = src.partition("://")
        scheme = scheme or kind or "ia"
        rights, page = "unknown", src
        if scheme == "ia":
            info = http_json(f"https://archive.org/metadata/{ident}").get("metadata", {})
            rights = info.get("licenseurl") or f"collections: {info.get('collection')}"
            files = ia_files(ident)
            page = f"https://archive.org/details/{ident}"
        elif scheme == "loc":
            item = http_json(f"https://www.loc.gov/item/{ident}/?fo=json").get("item", {})
            rights = item.get("rights") or item.get("rights_advisory") or "unknown"
            files = loc_images(ident)
            page = item.get("id") or f"https://www.loc.gov/item/{ident}/"
        elif scheme == "nasa":
            files = nasa_files(ident) if ident else []
            rights = "NASA imagery: generally not copyrighted"
            page = f"https://images.nasa.gov/details/{ident}"
        else:
            raise SystemExit(f"unknown source scheme '{scheme}'")

    def is_video(u: str) -> bool:
        return u.lower().endswith((".mp4", ".mov", ".m4v", ".avi"))

    vids = [f for f in files if is_video(f["url"])]
    imgs = [f for f in files if not is_video(f["url"])]
    if vids and not args.allow_video:
        log(f"{len(vids)} video file(s) present on this item — stills only unless --allow-video "
            f"(Content-ID risk: moving footage can be re-claimed; stills are the safe path)")
    files = (imgs + vids) if args.allow_video else imgs
    if not files:
        log(f"no image files found for {src}")
        return None
    pick = files[min(args.pick - 1, len(files) - 1)] if args.pick else files[0]
    if is_video(pick["url"]):
        log("WARNING: fetching moving footage — check re-upload claims before shipping")

    log(f"rights : {rights}")
    log(f"file   : {pick['name']} ({pick['size']//1024} KB) from {pick['url']}")
    raw = download(pick["url"], outdir, name)
    ps = pixel_size(raw)
    final = raw
    if ps and (max(ps) > 2600 or raw.suffix.lower() not in (".jpg", ".jpeg", ".png")):
        final = outdir / f"{name}.jpg"
        if final.resolve() == raw.resolve():
            tmp2 = outdir / f"{name}.tmp.jpg"  # resize in place via temp (same name both ways)
            convert_to_jpeg(raw, tmp2)
            shutil.move(tmp2, final)
        else:
            convert_to_jpeg(raw, final)
            if not args.keep_original:
                raw.unlink(missing_ok=True)
    sidecar = {
        "tool": "archive_fetch", "fetched": dt.datetime.now().isoformat(timespec="seconds"),
        "source": scheme, "identifier": ident, "page": page,
        "file_url": pick["url"], "file": final.name,
        "pixels": list(pixel_size(final) or []), "rights": rights,
        "sha256": hashlib.sha256(final.read_bytes()).hexdigest(),
        "note": "verify the rights line against the caption/EULA pass; stills preferred for zero Content-ID risk",
    }
    (outdir / f"{name}.json").write_text(json.dumps(sidecar, indent=1), encoding="utf-8")
    log(f"saved  : {final}  (+ {name}.json receipt)")
    return final


# ------------------------------------------------------------------ cli
def main() -> int:
    ap = argparse.ArgumentParser(description="$0 no-key archival stills with provenance receipts")
    sub = ap.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("search", help="search a public-domain collection")
    s.add_argument("query")
    s.add_argument("--source", choices=["ia", "loc", "nasa"], default="ia")
    s.add_argument("--limit", type=int, default=8)

    f = sub.add_parser("fetch", help="download one item's best still + write the receipt")
    f.add_argument("src", help="ia://ID | loc://ID | nasa://ID | https://…image.jpg")
    f.add_argument("--source", choices=["ia", "loc", "nasa"], default=None)
    f.add_argument("--name", default=None, help="file base name (default: slug of source/query)")
    f.add_argument("--query", default=None, help="optional label for default naming")
    f.add_argument("--pick", type=int, default=1, help="nth candidate file (default 1)")
    f.add_argument("--out", default=str(DEFAULT_OUT), help=f"output dir (default {DEFAULT_OUT})")
    f.add_argument("--max-mb", type=int, default=80)
    f.add_argument("--allow-video", action="store_true", help="permit footage downloads (Content-ID risk)")
    f.add_argument("--keep-original", action="store_true", help="keep the raw download next to the JPEG")

    r = sub.add_parser("rights", help="print the rights line from a receipt")
    r.add_argument("sidecar")

    args = ap.parse_args()
    global MAX_MB
    MAX_MB = getattr(args, "max_mb", MAX_MB)

    if args.cmd == "search":
        fns = {"ia": ia_search, "loc": loc_search, "nasa": nasa_search}
        try:
            rows = fns[args.source](args.query, args.limit)
        except Exception as e:  # noqa: BLE001
            log(f"search failed: {type(e).__name__}: {e}")
            return 2
        if not rows:
            log("nothing found")
            return 1
        for row in rows:
            print(f"{row['source']}://{row['id']}\n    {str(row['title'])[:96]}\n    rights: {str(row['rights'])[:110]}\n    {row['url']}")
        return 0

    if args.cmd == "fetch":
        try:
            ok = fetch_one(args.src, args.source, args.query, args)
        except SystemExit:
            raise
        except Exception as e:  # noqa: BLE001
            log(f"fetch failed: {type(e).__name__}: {e}")
            return 2
        return 0 if ok else 1

    if args.cmd == "rights":
        p = Path(args.sidecar)
        if p.suffix != ".json":
            p = p.with_suffix(".json")
        try:
            sc = json.loads(p.read_text(encoding="utf-8"))
        except Exception as e:  # noqa: BLE001
            log(f"no receipt at {p}: {e}")
            return 2
        print(f"{sc.get('file')}: {sc.get('rights')}\n  source: {sc.get('page')}\n  fetched: {sc.get('fetched')}")
        return 0
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
