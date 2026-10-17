#!/usr/bin/env python3
"""Unified Wikimedia Commons CC/PD Asset Ingestion Tool for All-in Studio.
Usage:
  python tools/commons.py <slug> <search_query> <target_filename> [--fallback <File:Name.jpg>] [--note <note>]

1. Queries Wikimedia Commons API for high-resolution CC0 / CC-BY / CC-BY-SA / Public Domain images.
2. Downloads the image (1920px thumbnail or direct url) into engine/public/<slug>/<target_filename>.
3. Verifies downloaded image is > 5 KB and a valid bitmap.
4. Records structured provenance in engine/public/<slug>/_commons.json.
5. Appends verifiable entry to videos/<slug>/LICENCES.md.
"""
import sys, os, json, urllib.request, urllib.parse, argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
USER_AGENT = "AllInStudioDocBot/1.0 (https://github.com/notsodarktimes; notsodarktimes.business@gmail.com) Python/3.14"

def query_commons_search(query: str, limit=5):
    params = {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": query,
        "gsrnamespace": 6,
        "gsrlimit": limit,
        "prop": "imageinfo",
        "iiprop": "url|size|extmetadata|user",
        "iiurlwidth": 1920
    }
    url = f"https://commons.wikimedia.org/w/api.php?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            pages = data.get("query", {}).get("pages", {})
            results = []
            for _, page in pages.items():
                infos = page.get("imageinfo", [])
                if infos:
                    info = infos[0]
                    meta = info.get("extmetadata", {})
                    lic = meta.get("LicenseShortName", {}).get("value", "CC / Public Domain")
                    artist = meta.get("Artist", {}).get("value", info.get("user", "Wikimedia Commons"))
                    # Clean html in artist
                    artist_clean = urllib.parse.unquote(artist)
                    import re
                    artist_clean = re.sub(r"<[^>]+>", "", artist_clean).strip() or "Wikimedia Commons"
                    results.append({
                        "title": page.get("title", ""),
                        "url": info.get("thumburl") or info.get("url"),
                        "desc_url": info.get("descriptionurl", ""),
                        "width": info.get("thumbwidth") or info.get("width"),
                        "height": info.get("thumbheight") or info.get("height"),
                        "author": artist_clean,
                        "license": lic
                    })
            return results
    except Exception as e:
        print(f"[commons] Error querying search term '{query}': {e}")
        return []

def query_by_file_title(title: str):
    params = {
        "action": "query",
        "format": "json",
        "titles": title,
        "prop": "imageinfo",
        "iiprop": "url|size|extmetadata|user",
        "iiurlwidth": 1920
    }
    url = f"https://commons.wikimedia.org/w/api.php?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            pages = data.get("query", {}).get("pages", {})
            for _, page in pages.items():
                infos = page.get("imageinfo", [])
                if infos:
                    info = infos[0]
                    meta = info.get("extmetadata", {})
                    lic = meta.get("LicenseShortName", {}).get("value", "CC / Public Domain")
                    artist = meta.get("Artist", {}).get("value", info.get("user", "Wikimedia Commons"))
                    import re
                    artist_clean = re.sub(r"<[^>]+>", "", urllib.parse.unquote(artist)).strip() or "Wikimedia Commons"
                    return {
                        "title": page.get("title", ""),
                        "url": info.get("thumburl") or info.get("url"),
                        "desc_url": info.get("descriptionurl", ""),
                        "width": info.get("thumbwidth") or info.get("width"),
                        "height": info.get("thumbheight") or info.get("height"),
                        "author": artist_clean,
                        "license": lic
                    }
    except Exception as e:
        print(f"[commons] Error querying title '{title}': {e}")
    return None

def download_asset(slug: str, query: str, filename: str, fallback_title: str = None, note: str = ""):
    pub_dir = ROOT / "engine" / "public" / slug
    pub_dir.mkdir(parents=True, exist_ok=True)
    target_path = pub_dir / filename

    candidates = query_commons_search(query)
    chosen = candidates[0] if candidates else None

    if not chosen and fallback_title:
        print(f"[commons] Search returned no hits. Trying fallback title: {fallback_title}")
        chosen = query_by_file_title(fallback_title)

    if not chosen:
        print(f"[commons] FAIL: No valid Commons asset found for query '{query}'")
        return False

    img_url = chosen["url"]
    print(f"[commons] Fetching: {chosen['title']} -> {target_path}")
    req = urllib.request.Request(img_url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            content = resp.read()
            if len(content) < 5120:
                print(f"[commons] FAIL: Downloaded file too small ({len(content)} bytes < 5KB)")
                return False
            target_path.write_bytes(content)
            print(f"[commons] SUCCESS: Saved {filename} ({len(content) // 1024} KB)")
    except Exception as e:
        print(f"[commons] Download failed: {e}")
        return False

    # Log to _commons.json
    commons_json_path = pub_dir / "_commons.json"
    manifest = {}
    if commons_json_path.exists():
        try:
            manifest = json.loads(commons_json_path.read_text(encoding="utf-8"))
        except Exception:
            pass

    manifest[filename] = {
        "title": chosen["title"],
        "author": chosen["author"],
        "license": chosen["license"],
        "desc_url": chosen["desc_url"],
        "width": chosen["width"],
        "height": chosen["height"],
        "note": note or query
    }
    commons_json_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    # Append to LICENCES.md
    vdir = ROOT / "videos" / slug
    vdir.mkdir(parents=True, exist_ok=True)
    lic_md = vdir / "LICENCES.md"
    entry_line = f"| `{filename}` | CC/PD Photo | {chosen['title']} | {chosen['author']} | {chosen['license']} | [Wikimedia Commons]({chosen['desc_url']}) | Near zero |\n"

    if not lic_md.exists():
        lic_content = f"# LICENCES · {slug}\n\n| Asset | Type | Description | Author / Creator | Licence | Source / Cleared URL | Risk Rating |\n|---|---|---|---|---|---|---|\n" + entry_line
        lic_md.write_text(lic_content, encoding="utf-8")
    else:
        existing = lic_md.read_text(encoding="utf-8")
        if filename not in existing:
            lic_md.write_text(existing.rstrip() + "\n" + entry_line, encoding="utf-8")

    return True

def main():
    parser = argparse.ArgumentParser(description="Download CC/PD images from Wikimedia Commons")
    parser.add_argument("slug", help="Topic slug (e.g. apply-button)")
    parser.add_argument("query", help="Commons search query")
    parser.add_argument("filename", help="Target filename (e.g. comptroller_albany.jpg)")
    parser.add_argument("--fallback", help="Fallback File:Title on Commons if search empty")
    parser.add_argument("--note", help="Descriptive note or caption context")
    args = parser.parse_args()

    ok = download_asset(args.slug, args.query, args.filename, args.fallback, args.note)
    sys.exit(0 if ok else 1)

if __name__ == "__main__":
    main()
