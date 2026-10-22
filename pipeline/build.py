"""Single source of truth build: tokens.json -> tokens.css + tokens.ts + client.js.

Usage: python pipeline/build.py
"""
from __future__ import annotations

import json
import re
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TOKENS = ROOT / "tokens" / "tokens.json"
PKG = ROOT / "packages" / "dph-archive"
RUN = ROOT / "runs" / "BV1rr4y1b7sz"


def resolve(node, root):
    if isinstance(node, str) and node.startswith("{") and node.endswith("}"):
        cur = root
        for part in node[1:-1].split("."):
            cur = cur[part]
        return resolve(cur, root)
    if isinstance(node, dict):
        return {k: resolve(v, root) for k, v in node.items()}
    if isinstance(node, list):
        return [resolve(v, root) for v in node]
    return node


def kebab(name: str) -> str:
    return re.sub(r"([a-z0-9])([A-Z])", r"\1-\2", name).lower()


def css_vars(flat: dict[str, str], indent: str = "  ") -> str:
    return "\n".join(f"{indent}--dph-{k}: {v};" for k, v in flat.items())


def human_size(n: int) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024 or unit == "GB":
            return f"{n:.0f} {unit}" if unit == "B" else f"{n:.1f} {unit}"
        n /= 1024.0
    return f"{n:.1f} GB"


def brand() -> dict:
    """DPH's own brand facts, read from the running profile's startup config."""
    fallback = {
        "identity": "Dr.",
        "identityId": "0000",
        "accessLevel": "0",
        "brand1": "DEEPSEEK",
        "brand2": "SYNTHESIZE INTELLIGENCE",
        "brand3a": "HARNESS",
        "brand3b": "OS",
        "orgZh": "深度求索",
        "orgEn": "DEEPSEEK",
        "orgSub": "DEEPSEEK HARNESS",
        "welcomeBox": "DEEPSEEK HARNESS",
        "footer": "POWERED BY DEEPSEEK",
        "accent": "#FF7500",
        "glitchA": "#FF3B30",
        "glitchB": "#2971B8",
    }
    p = Path.home() / ".dsh" / "dsh-startup.json"
    try:
        raw = json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return fallback
    out = dict(fallback)
    for k in list(fallback):
        v = raw.get(k)
        if isinstance(v, str) and v.strip():
            out[k] = v.strip()
    return out


ARCHIVE_SPEC = [
    ("runs/BV1rr4y1b7sz/source/video.mp4", "S-01", "Source reel", "源影像", "size", "LOCK"),
    ("runs/BV1rr4y1b7sz/frames/all", "F-02", "Frame sweep 1 fps", "抽帧 1fps", "count", "DONE"),
    ("runs/BV1rr4y1b7sz/frames/ui", "F-03", "Key frames 1080p", "关键帧", "count", "DONE"),
    ("runs/BV1rr4y1b7sz/analysis/sheets", "F-04", "Contact sheets", "联系表", "count", "DONE"),
    ("docs/style-report.md", "R-05", "Style report", "风格报告", "size", "DONE"),
    ("tokens/tokens.json", "T-06", "Token set", "设计变量", "size", "DONE"),
    ("packages/dph-archive/client.js", "P-07", "Panel build", "面板构建", "size", "LIVE"),
    ("docs/replace-matrix.md", "M-08", "Replacement matrix", "替换矩阵", "size", "DONE"),
]


def archive_entries() -> list[dict]:
    out = []
    for rel, code, en, zh, mode, state in ARCHIVE_SPEC:
        p = ROOT / rel
        if not p.exists():
            continue
        if mode == "size":
            meta = human_size(p.stat().st_size)
        else:
            meta = str(len(list(p.glob("*"))))
        out.append({"code": code, "en": en, "zh": zh, "meta": meta, "state": state})
    return out


def spec_swatches(data) -> list[dict]:
    sem = data["color"]["semantic"]["light"]
    prim = data["color"]["primitive"]
    picks = [
        ("paper", "bg-paper"),
        ("raised", "bg-raised"),
        ("ink", "fg-primary"),
        ("accent", "accent"),
        ("system", "system"),
        ("alert", "alert"),
    ]
    out = []
    for name, key in picks:
        value = sem[key]
        if isinstance(value, str) and value.startswith("#"):
            out.append({"name": name, "value": f"var(--dph-{kebab(key)})", "hex": value.upper()})
        else:
            out.append({"name": name, "value": f"var(--dph-{kebab(key)})", "hex": value})
    return out


def build() -> None:
    raw = json.loads(TOKENS.read_text(encoding="utf-8"))
    data = resolve(raw, raw)

    light = {kebab(k): v for k, v in data["color"]["semantic"]["light"].items()}
    dark = {kebab(k): v for k, v in data["color"]["semantic"]["dark"].items()}
    light_elev = {f"elev-{k}": v for k, v in data["elevation"]["light"].items()}
    dark_elev = {f"elev-{k}": v for k, v in data["elevation"]["dark"].items()}

    base: dict[str, str] = {}
    for k, v in data["typography"]["family"].items():
        base[f"font-{k}"] = v
    for k, v in data["typography"]["weight"].items():
        base[f"fw-{k}"] = str(v)
    for group, prefix in (("size", "fs"), ("leading", "lh"), ("tracking", "ls")):
        for k, v in data["typography"][group].items():
            base[f"{prefix}-{k}"] = str(v)
    for k, v in data["space"].items():
        base[f"space-{k}"] = v
    for k, v in data["radius"].items():
        base[f"r-{k}"] = v
    for k, v in data["border"].items():
        base[f"bw-{k}"] = v
    for k, v in data["motion"]["duration"].items():
        base[f"dur-{k}"] = v
    for k, v in data["motion"]["ease"].items():
        base[f"ease-{k}"] = v
    for k, v in data["icon"]["size"].items():
        base[f"icon-{k}"] = v
    for k, v in data["layout"].items():
        base[f"layout-{kebab(k)}"] = v

    with (ROOT / "tokens" / "tokens.css").open("w", encoding="utf-8", newline="\n") as f:
        f.write(f"/* generated by pipeline/build.py on {datetime.now():%Y-%m-%d %H:%M} - do not edit */\n")
        f.write(".dpa-root {\n")
        f.write(css_vars(base))
        f.write("\n}\n\n")
        f.write('.dpa-root[data-mode="light"] {\n')
        f.write(css_vars({**light, **light_elev}))
        f.write("\n}\n\n")
        f.write('.dpa-root[data-mode="dark"] {\n')
        f.write(css_vars({**dark, **dark_elev}))
        f.write("\n}\n")

    ts_lines = ["// generated by pipeline/build.py - do not edit", "export const tokens = {"]
    for k, v in base.items():
        ts_lines.append(f"  '{k}': {json.dumps(v)},")
    ts_lines.append("} as const;")
    (ROOT / "tokens" / "tokens.ts").write_text("\n".join(ts_lines) + "\n", encoding="utf-8")

    template = (PKG / "client.template.js").read_text(encoding="utf-8")
    css = (ROOT / "tokens" / "tokens.css").read_text(encoding="utf-8")

    subs = {
        '/*__TOKENS_CSS__*/""': json.dumps(css),
        "/*__ARCHIVE__*/[]": json.dumps(archive_entries(), ensure_ascii=False),
        "/*__SPEC__*/[]": json.dumps(spec_swatches(data), ensure_ascii=False),
        "/*__BRAND__*/{}": json.dumps(brand(), ensure_ascii=False),
        "/*__SKIN__*/{}": json.dumps(data.get("app", {}), ensure_ascii=False),
    }
    out = template
    for marker, value in subs.items():
        if marker not in out:
            raise SystemExit(f"marker missing in client.template.js: {marker}")
        out = out.replace(marker, value)
    (PKG / "client.js").write_text(out, encoding="utf-8", newline="\n")

    print(f"tokens.css  {len(base) + len(light) + len(dark)} vars")
    print(f"archive     {len(archive_entries())} entries")
    print(f"client.js   {len(out)} bytes")


if __name__ == "__main__":
    build()
