"""Extract a quantised palette from a frame and report sRGB + OKLCH.

Usage: python palette.py <image> [k]
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image


def srgb_to_linear(c: np.ndarray) -> np.ndarray:
    c = c / 255.0
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def linear_to_oklab(rgb: np.ndarray) -> np.ndarray:
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
    m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
    s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
    l_, m_, s_ = np.cbrt(l), np.cbrt(m), np.cbrt(s)
    return np.stack([
        0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
        1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
        0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
    ], axis=-1)


def oklch(rgb: np.ndarray):
    lab = linear_to_oklab(srgb_to_linear(rgb.astype(np.float64)))
    L = lab[..., 0]
    a, b = lab[..., 1], lab[..., 2]
    C = np.hypot(a, b)
    H = np.degrees(np.arctan2(b, a)) % 360
    return L, C, H


def kmeans(pixels: np.ndarray, k: int, iters: int = 20, seed: int = 7):
    rng = np.random.default_rng(seed)
    centers = pixels[rng.choice(len(pixels), k, replace=False)]
    for _ in range(iters):
        d = ((pixels[:, None, :] - centers[None, :, :]) ** 2).sum(-1)
        labels = d.argmin(1)
        for i in range(k):
            m = labels == i
            if m.any():
                centers[i] = pixels[m].mean(0)
    counts = np.bincount(labels, minlength=k)
    return centers, counts


def main() -> int:
    path = Path(sys.argv[1])
    k = int(sys.argv[2]) if len(sys.argv) > 2 else 8
    with Image.open(path) as im:
        im = im.convert("RGB")
        im.thumbnail((480, 480))
        px = np.asarray(im).reshape(-1, 3).astype(np.float64)
    # drop 2% extremes so subtitles/black bars do not dominate
    centers, counts = kmeans(px, k)
    order = np.argsort(-counts)
    total = counts.sum()
    print(f"# {path.name}  ({k} clusters)")
    for i in order:
        c = np.clip(centers[i], 0, 255).astype(int)
        L, C, H = oklch(c.astype(np.float64))
        hexv = "#%02X%02X%02X" % tuple(c)
        print(f"{hexv}  {counts[i] / total * 100:5.1f}%  oklch({L:.3f} {C:.3f} {H:5.1f})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
