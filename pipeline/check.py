"""Design checks: WCAG contrast, forbidden-IP terms, leftover placeholders.

Usage: python pipeline/check.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PKG = ROOT / "packages" / "dph-archive"
OUT = ROOT / "runs" / "BV1rr4y1b7sz" / "checks" / "checks.json"

FORBIDDEN = [
    "明日方舟", "莱茵生命", "罗德岛", "鹰角", "企鹅物流", "安洁莉娜",
    "Rhine", "RHINE", "Arknights", "ARKNIGHTS", "Kal'tsit", "C-023",
    "PARABOLIC", "DANGLING GATE", "ANALYSIS 08", "Kristen",
]

# (foreground, background, minimum ratio, role)
# The 6px accent square inside the logotype is exempt (WCAG 1.4.11 logotype clause)
# and is therefore not asserted here.
PAIRS = {
    "light": [
        ("fg-primary", "bg-paper", 7.0, "body"),
        ("fg-secondary", "bg-paper", 4.5, "secondary"),
        ("fg-muted", "bg-paper", 4.5, "micro-label"),
        ("fg-muted", "bg-raised", 4.5, "micro-label"),
        ("accent-text", "bg-paper", 4.5, "accent label"),
        ("system-text", "bg-paper", 4.5, "serial"),
        ("alert", "bg-paper", 4.5, "stamp"),
        ("fg-invert", "bg-invert", 7.0, "inverted bar"),
        ("accent-invert", "bg-invert", 3.0, "marker on inverse"),
    ],
    "dark": [
        ("fg-primary", "bg-paper", 7.0, "body"),
        ("fg-secondary", "bg-paper", 4.5, "secondary"),
        ("fg-muted", "bg-paper", 4.5, "micro-label"),
        ("fg-muted", "bg-raised", 4.5, "micro-label"),
        ("accent-text", "bg-paper", 4.5, "accent label"),
        ("system-text", "bg-paper", 4.5, "serial"),
        ("alert", "bg-paper", 4.5, "stamp"),
        ("fg-invert", "bg-invert", 7.0, "inverted bar"),
        ("accent-invert", "bg-invert", 3.0, "marker on inverse"),
    ],
}

SHIPPED = ["index.js", "client.js", "cordis.patch.yml", "icon.svg"]


def resolve(node, root):
    if isinstance(node, str) and node.startswith("{") and node.endswith("}"):
        cur = root
        for part in node[1:-1].split("."):
            cur = cur[part]
        return resolve(cur, root)
    if isinstance(node, dict):
        return {k: resolve(v, root) for k, v in node.items()}
    return node


def parse_color(value: str):
    v = value.strip()
    if v.startswith("#"):
        h = v[1:]
        if len(h) == 3:
            h = "".join(c * 2 for c in h)
        return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4)) + (1.0,)
    m = re.match(r"rgba?\(([^)]+)\)", v)
    if m:
        parts = [p.strip() for p in m.group(1).split(",")]
        r, g, b = (float(parts[i]) for i in range(3))
        a = float(parts[3]) if len(parts) > 3 else 1.0
        return (r, g, b, a)
    raise ValueError(f"unsupported colour: {value}")


def over(fg, bg):
    a = fg[3]
    return tuple(fg[i] * a + bg[i] * (1 - a) for i in range(3)) + (1.0,)


def luminance(rgb):
    def ch(c):
        c = c / 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (ch(rgb[i]) for i in range(3))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(fg, bg):
    a, b = luminance(over(fg, bg) if fg[3] < 1 else fg), luminance(bg)
    hi, lo = max(a, b), min(a, b)
    return round((hi + 0.05) / (lo + 0.05), 2)


def main() -> int:
    raw = json.loads((ROOT / "tokens" / "tokens.json").read_text(encoding="utf-8"))
    data = resolve(raw, raw)

    contrast_rows = []
    failures = 0
    for mode, pairs in PAIRS.items():
        table = data["color"]["semantic"][mode]
        for fg_key, bg_key, minimum, role in pairs:
            fg = parse_color(table[fg_key])
            bg = parse_color(table[bg_key])
            ratio = contrast(fg, bg)
            ok = ratio >= minimum
            if not ok:
                failures += 1
            contrast_rows.append({
                "mode": mode, "pair": f"{fg_key} on {bg_key}", "role": role,
                "ratio": ratio, "minimum": minimum, "pass": ok,
            })

    # --- Harness app skin (ctx.theme.overrideTokens aliases) ---
    app_pairs = [
        ("--dsw-alias-label-primary", "--dsw-alias-bg-base", 7.0, "shell body"),
        ("--dsw-alias-label-secondary", "--dsw-alias-bg-base", 4.5, "shell secondary"),
        ("--dsw-alias-brand-primary", "--dsw-alias-bg-base", 4.5, "shell brand"),
        ("--dsw-alias-label-primary", "--dsw-specific-sidebar-fill", 7.0, "sidebar label"),
        ("--dsw-alias-state-error-primary", "--dsw-alias-bg-base", 4.5, "error"),
        ("--dsw-alias-state-success-primary", "--dsw-alias-bg-base", 4.5, "success"),
        ("--dsw-alias-state-warn-primary", "--dsw-alias-bg-base", 4.5, "warn"),
    ]
    app = data.get("app", {})
    for mode in ("light", "dark"):
        table = app.get(mode, {})
        if not table:
            continue
        for fg_key, bg_key, minimum, role in app_pairs:
            fg = parse_color(table[fg_key])
            bg = parse_color(table[bg_key])
            ratio = contrast(fg, bg)
            ok = ratio >= minimum
            if not ok:
                failures += 1
            contrast_rows.append({
                "mode": mode, "pair": f"{fg_key} on {bg_key}", "role": "app / " + role,
                "ratio": ratio, "minimum": minimum, "pass": ok,
            })

    # --- forbidden terms / placeholders over the shipped package ---
    hits = []
    placeholders = []
    files = [PKG / name for name in SHIPPED] + sorted((PKG / "locale").glob("*.json"))
    for path in files:
        if not path.is_file():
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        for term in FORBIDDEN:
            if term in text:
                hits.append({"file": path.name, "term": term})
        for marker in ("{{", "TODO:", "__TOKENS_CSS__", "__ARCHIVE__", "__SPEC__", "__BRAND__", "__SKIN__"):
            if marker in text:
                placeholders.append({"file": path.name, "marker": marker})

    report = {
        "contrast": contrast_rows,
        "contrastFailures": failures,
        "forbiddenHits": hits,
        "placeholders": placeholders,
        "ok": failures == 0 and not hits and not placeholders,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    for row in contrast_rows:
        flag = "PASS" if row["pass"] else "FAIL"
        print(f"{flag}  {row['mode']:5}  {row['ratio']:5.2f}:1  (min {row['minimum']})  {row['pair']}")
    print(f"\ncontrast failures: {failures}")
    print(f"forbidden hits:    {len(hits)} {hits if hits else ''}")
    print(f"placeholders:      {len(placeholders)} {placeholders if placeholders else ''}")
    print(f"report -> {OUT}")
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
