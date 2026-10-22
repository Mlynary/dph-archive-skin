"""Build labelled contact sheets from the 1fps frame dump.

Usage:
  python contact_sheet.py <frames_dir> <out_dir> [cols] [rows] [tile_w]
Index -> timecode: frame f_00001.jpg is t=0s (fps=1 extraction).
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

FONT_CANDIDATES = [
    r"C:\Windows\Fonts\consola.ttf",
    r"C:\Windows\Fonts\arial.ttf",
]


def load_font(size: int):
    for p in FONT_CANDIDATES:
        try:
            return ImageFont.truetype(p, size)
        except OSError:
            continue
    return ImageFont.load_default()


def main() -> int:
    frames_dir = Path(sys.argv[1])
    out_dir = Path(sys.argv[2])
    cols = int(sys.argv[3]) if len(sys.argv) > 3 else 8
    rows = int(sys.argv[4]) if len(sys.argv) > 4 else 5
    tile_w = int(sys.argv[5]) if len(sys.argv) > 5 else 240

    files = sorted(frames_dir.glob("f_*.jpg"))
    if not files:
        print("no frames")
        return 1

    out_dir.mkdir(parents=True, exist_ok=True)
    per_sheet = cols * rows
    tile_h = int(tile_w * 9 / 16)
    font = load_font(max(10, tile_w // 18))

    for sheet_i in range(0, len(files), per_sheet):
        chunk = files[sheet_i:sheet_i + per_sheet]
        sheet = Image.new("RGB", (cols * tile_w, rows * tile_h), (10, 10, 12))
        draw = ImageDraw.Draw(sheet)
        for i, f in enumerate(chunk):
            idx = sheet_i + i
            with Image.open(f) as im:
                im = im.convert("RGB").resize((tile_w, tile_h), Image.LANCZOS)
            x, y = (i % cols) * tile_w, (i // cols) * tile_h
            sheet.paste(im, (x, y))
            label = f"{idx:03d}  {idx // 60:02d}:{idx % 60:02d}"
            tw = draw.textlength(label, font=font)
            draw.rectangle([x, y, x + tw + 6, y + font.size + 4], fill=(0, 0, 0))
            draw.text((x + 3, y + 1), label, fill=(0, 255, 190), font=font)
        name = out_dir / f"sheet_{sheet_i // per_sheet + 1:02d}.jpg"
        sheet.save(name, quality=88)
        print(f"{name.name}: frames {sheet_i + 1}..{sheet_i + len(chunk)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
