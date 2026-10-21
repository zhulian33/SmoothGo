#!/usr/bin/env python3
"""Build the single-file SmoothGo demo from the maintained web sources."""

from __future__ import annotations

import os
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / "web"
OUTPUT = ROOT / "SmoothGo-Web-Demo.html"


def read(name: str) -> str:
    return (WEB / name).read_text(encoding="utf-8")


def main() -> None:
    html = read("index.html")
    config_path = WEB / "config.js"
    if not config_path.exists():
        config_path = WEB / "config.example.js"
    config = config_path.read_text(encoding="utf-8")

    # The standalone file is for offline presentations, so it always runs in
    # guest/demo mode, uses the schematic map and never calls a local API.
    config = re.sub(r'amapKey:\s*"[^"]*"', 'amapKey: ""', config)
    config = re.sub(r'amapSecurityJsCode:\s*"[^"]*"', 'amapSecurityJsCode: ""', config)
    config = re.sub(r'apiBaseUrl:\s*"[^"]*"', 'apiBaseUrl: ""', config)
    config = re.sub(r'authMode:\s*"[^"]*"', 'authMode: "demo"', config)

    # Opt-in: the deployed GitHub Pages site needs a real key or the map stays
    # blank, and an Amap JS key is public by design (it is protected by the
    # referrer allowlist in the Amap console, not by secrecy). Setting these
    # two env vars before the build bakes the key into the shipped file so the
    # site works without anyone having to hand-enter repository secrets. Leave
    # them unset and the build stays key-free, as it always has.
    inject_key = os.environ.get("SMOOTHGO_AMAP_KEY", "").strip()
    inject_security = os.environ.get("SMOOTHGO_AMAP_SECURITY", "").strip()
    if inject_key:
        config = re.sub(r'amapKey:\s*""', f'amapKey: "{inject_key}"', config)
        if inject_security:
            config = re.sub(
                r'amapSecurityJsCode:\s*""',
                f'amapSecurityJsCode: "{inject_security}"',
                config,
            )

    replacements = {
        '<link rel="stylesheet" href="styles.css" />': f"<style>\n{read('styles.css')}\n</style>",
        '<script src="config.js"></script>': f"<script>\n{config}\n</script>",
    }
    for marker, content in replacements.items():
        if marker not in html:
            # `defer` on every <script src> means the strict marker no
            # longer matches; fall back to a tolerant regex replace.
            if marker == '<script src="config.js"></script>':
                replaced = re.sub(
                    r'<script src="config\.js"[^>]*></script>',
                    f"<script>\n{config}\n</script>",
                    html,
                    count=1,
                )
                if replaced != html:
                    html = replaced
                    continue
            raise RuntimeError(f"Missing marker in web/index.html: {marker}")
        html = html.replace(marker, content)

    # Everything else in web/ is data (places.poi.js, place-photos.js,
    # place-menus.js) plus app.js / planner.js. Inline them all: the split into
    # separate data files once left the standalone demo pointing at six scripts
    # it does not ship, so the file opened blank offline.
    def inline_script(match: re.Match[str]) -> str:
        src = match.group(1)
        path = WEB / src
        if not path.exists():
            raise RuntimeError(f"Standalone build references missing script: {src}")
        return f"<script>\n{path.read_text(encoding='utf-8')}\n</script>"

    # `[^>]*` lets index.html keep its defer / async attributes; the
    # standalone build inlines everything so the attributes are dropped
    # along with the external reference.
    html = re.sub(r'<script src="([^"/:]+\.js)"[^>]*></script>', inline_script, html)

    if re.search(r'<(?:script|link)[^>]+(?:src|href)="(?:app|planner|styles|config)\.', html):
        raise RuntimeError("Standalone build still references a separate local asset.")
    if re.search(r'<script src="(?!https?:)', html):
        raise RuntimeError("Standalone build still references an external local script.")

    OUTPUT.write_text(html, encoding="utf-8")
    print(f"Wrote {OUTPUT.relative_to(ROOT)} ({OUTPUT.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
