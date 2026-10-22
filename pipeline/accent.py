"""Report the most saturated (accent) pixels of a frame, clustered.

Usage: python accent.py <image> [min_chroma]
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

from palette import kmeans, oklch, srgb_to_linear, linear_to_oklab


def main() -> int:
    path = Path(sys.argv[1])
    min_c = float(sys.argv[2]) if len(sys.argv) > 2 else 0.045
    with Image.open(path) as im:
        im = im.convert("RGB")
        im.thumbnail((640, 640))
        px = np.asarray(im).reshape(-1, 3).astype(np.float64)
    lab = linear_to_oklab(srgb_to_linear(px))
    chroma = np.hypot(lab[:, 1], lab[:, 2])
    sel = px[chroma > min_c]
    print(f"# {path.name}: {len(sel)} / {len(px)} px above chroma {min_c}")
    if len(sel) < 20:
        return 0
    centers, counts = kmeans(sel, min(4, len(sel) // 10 + 1))
    for i in np.argsort(-counts):
        c = np.clip(centers[i], 0, 255).astype(int)
        L, C, H = oklch(c.astype(np.float64))
        hx = "#%02X%02X%02X" % tuple(c)
        print(f"{hx}  {counts[i] / len(sel) * 100:5.1f}%  oklch({L:.3f} {C:.3f} {H:5.1f})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
