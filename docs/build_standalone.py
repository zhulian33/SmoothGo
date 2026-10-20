#!/usr/bin/env python3
"""Build the single-file SmoothGo demo from the maintained web sources."""

from __future__ import annotations

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

    replacements = {
        '<link rel="stylesheet" href="styles.css" />': f"<style>\n{read('styles.css')}\n</style>",
        '<script src="config.js"></script>': f"<script>\n{config}\n</script>",
        '<script src="planner.js"></script>': f"<script>\n{read('planner.js')}\n</script>",
        '<script src="app.js"></script>': f"<script>\n{read('app.js')}\n</script>",
    }
    for marker, content in replacements.items():
        if marker not in html:
            raise RuntimeError(f"Missing marker in web/index.html: {marker}")
        html = html.replace(marker, content)

    if re.search(r'<(?:script|link)[^>]+(?:src|href)="(?:app|planner|styles|config)\.', html):
        raise RuntimeError("Standalone build still references a separate local asset.")

    OUTPUT.write_text(html, encoding="utf-8")
    print(f"Wrote {OUTPUT.relative_to(ROOT)} ({OUTPUT.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
