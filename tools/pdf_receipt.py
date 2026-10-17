"""Receipt-to-Highlight tool for All-in Studio (Lesson #81 & UPG-R3).
Renders 300-DPI authentic government, court, and academic PDF pages.
Extracts verbatim quotes, calculates exact bounding box coordinates [x, y, w, h],
and verifies contrast ratio for animated Remotion highlighter sweeps.

Usage:
  python tools/pdf_receipt.py <pdf_path_or_topic> [--phrase "exact quote to highlight"] [--page 0] [--out <output_dir>]
"""
from __future__ import annotations
import argparse
import json
import os
import sys
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent

def calculate_contrast(crop: Image.Image) -> tuple[float, str]:
    """Calculate W3C relative luminance contrast ratio between ink and paper."""
    g = np.asarray(crop.convert("L"), dtype=np.float32) / 255.0
    def rel_gray(v):
        if v.size == 0:
            return 0.0
        v = np.where(v <= 0.04045, v / 12.92, ((v + 0.055) / 1.055) ** 2.4)
        return float(np.clip(v, 0, 1).mean())
    ink_sel = g < np.percentile(g, 15)
    if not ink_sel.any():
        ink_sel = g < np.percentile(g, 45)
    paper_sel = g > np.percentile(g, 60)
    if not paper_sel.any():
        paper_sel = g > np.percentile(g, 40)
    ink = rel_gray(g[ink_sel])
    paper = rel_gray(g[paper_sel])
    lo, hi = (ink, paper) if ink < paper else (paper, ink)
    ratio = (hi + 0.05) / (lo + 0.05)
    verdict = "PASS (>= 4.5)" if ratio >= 4.5 else "REVIEW"
    return round(ratio, 1), verdict

def process_with_fitz(pdf_path: Path, phrase: str, page_idx: int, out_dir: Path) -> dict:
    import fitz  # PyMuPDF
    doc = fitz.open(str(pdf_path))
    if page_idx >= len(doc):
        raise IndexError(f"Page index {page_idx} out of range (total pages: {len(doc)})")
    page = doc[page_idx]
    rects = page.search_for(phrase) if phrase else []
    
    # 300 DPI render matrix (72 * 4.16667 = 300)
    zoom = 300 / 72.0
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    
    full_png = out_dir / f"page_{page_idx}_300dpi.png"
    pix.save(str(full_png))
    im = Image.open(full_png)
    im_w, im_h = im.size
    
    crop_info = {}
    if rects:
        r = rects[0]
        # Coordinates in points, convert to pixels with zoom
        pad_pts = 14
        rx0 = max(0, (r.x0 - pad_pts) * zoom)
        ry0 = max(0, (r.y0 - pad_pts) * zoom)
        rx1 = min(im_w, (r.x1 + pad_pts) * zoom)
        ry1 = min(im_h, (r.y1 + pad_pts) * zoom)
        
        crop = im.crop((int(rx0), int(ry0), int(rx1), int(ry1)))
        crop_png = out_dir / f"receipt_crop_300dpi.png"
        crop.save(crop_png)
        contrast, verdict = calculate_contrast(crop)
        
        # Normalized bounding box inside the crop
        crop_w, crop_h = crop.size
        hl_x = (r.x0 * zoom - rx0) / crop_w
        hl_y = (r.y0 * zoom - ry0) / crop_h
        hl_w = (r.width * zoom) / crop_w
        hl_h = (r.height * zoom) / crop_h
        
        crop_info = {
            "crop_path": str(crop_png.relative_to(ROOT)),
            "crop_dimensions": [crop_w, crop_h],
            "highlight_normalized": [round(hl_x, 4), round(hl_y, 4), round(hl_w, 4), round(hl_h, 4)],
            "contrast_ratio": contrast,
            "contrast_verdict": verdict
        }
    
    return {
        "engine": "PyMuPDF (fitz)",
        "pdf": str(pdf_path),
        "page": page_idx,
        "full_page_path": str(full_png.relative_to(ROOT)),
        "page_dimensions": [im_w, im_h],
        "phrase": phrase,
        "found": len(rects) > 0,
        **crop_info
    }

def process_with_pypdfium2(pdf_path: Path, phrase: str, page_idx: int, out_dir: Path) -> dict:
    import pypdfium2 as pdfium
    doc = pdfium.PdfDocument(str(pdf_path))
    if page_idx >= len(doc):
        raise IndexError(f"Page index {page_idx} out of range (total pages: {len(doc)})")
    page = doc[page_idx]
    tp = page.get_textpage()
    
    scale = 300 / 72.0
    canvas = page.render(scale=scale)
    pil = canvas.to_pil()
    im_w, im_h = pil.size
    full_png = out_dir / f"page_{page_idx}_300dpi.png"
    pil.save(full_png)
    
    crop_info = {}
    hit = tp.search(phrase, match_case=False, match_whole_word=False).get_next() if phrase else None
    if hit is not None:
        start_idx, count = hit
        boxes = [tp.get_charbox(i, loose=True) for i in range(start_idx, start_idx + count)]
        xs = [b[0] for b in boxes] + [b[2] for b in boxes]
        ys = [b[1] for b in boxes] + [b[3] for b in boxes]
        l, r = min(xs), max(xs)
        b, t = min(ys), max(ys)
        pad = 14
        l = max(0, l - pad); r = r + pad; b = max(0, b - pad); t = t + pad
        
        crop = pil.crop((int(l * scale), max(0, int(im_h - t * scale)), int(r * scale), min(im_h, int(im_h - b * scale))))
        crop_png = out_dir / "receipt_crop_300dpi.png"
        crop.save(crop_png)
        contrast, verdict = calculate_contrast(crop)
        
        crop_w, crop_h = crop.size
        crop_info = {
            "crop_path": str(crop_png.relative_to(ROOT)),
            "crop_dimensions": [crop_w, crop_h],
            "contrast_ratio": contrast,
            "contrast_verdict": verdict
        }
        
    return {
        "engine": "pypdfium2",
        "pdf": str(pdf_path),
        "page": page_idx,
        "full_page_path": str(full_png.relative_to(ROOT)),
        "page_dimensions": [im_w, im_h],
        "phrase": phrase,
        "found": hit is not None,
        **crop_info
    }

def process_receipt(target: str, phrase: str | None = None, page_idx: int = 0, out_path: str | None = None) -> int:
    path = Path(target)
    # Check if target is a video slug
    topic_vdir = ROOT / "videos" / target
    if not path.exists() and topic_vdir.is_dir():
        # Look for PDF sources in videos/<slug>/sources
        pdf_candidates = list((topic_vdir / "sources").glob("*.pdf")) + list(topic_vdir.glob("*.pdf"))
        if pdf_candidates:
            path = pdf_candidates[0]
            print(f"Found topic PDF receipt: {path}")
        else:
            print(f"No PDF sources found in {topic_vdir}/sources. Place a PDF document there to extract receipts.")
            return 1
            
    if not path.exists():
        print(f"Error: PDF path not found: {path}")
        return 1

    out_dir = Path(out_path) if out_path else ROOT / "engine" / "public" / "receipts"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    report = None
    try:
        report = process_with_fitz(path, phrase or "", page_idx, out_dir)
    except Exception as e:
        print(f"fitz processing error ({e}), attempting pypdfium2 fallback...")
        try:
            report = process_with_pypdfium2(path, phrase or "", page_idx, out_dir)
        except Exception as e2:
            print(f"Both PDF engines failed: {e2}")
            return 1

    report_file = out_dir / "_receipts.json"
    report_file.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"\n[OK] Receipt extracted successfully:")
    print(f"  Engine:   {report['engine']}")
    print(f"  Full:     {report['full_page_path']}")
    if report.get("crop_path"):
        print(f"  Crop:     {report['crop_path']}")
        print(f"  Contrast: {report.get('contrast_ratio', 0)}:1 ({report.get('contrast_verdict', 'N/A')})")
    print(f"  Report:   {report_file}")
    return 0

def main() -> int:
    parser = argparse.ArgumentParser(description="Extract 300-DPI authentic PDF receipt crops for Remotion widgets")
    parser.add_argument("target", help="Path to PDF file or video topic slug")
    parser.add_argument("--phrase", "-p", help="Exact phrase to locate and highlight", default=None)
    parser.add_argument("--page", type=int, default=0, help="Page index (default: 0)")
    parser.add_argument("--out", "-o", help="Output directory", default=None)
    args = parser.parse_args()
    return process_receipt(args.target, phrase=args.phrase, page_idx=args.page, out_path=args.out)

if __name__ == "__main__":
    raise SystemExit(main())
