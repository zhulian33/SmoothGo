#!/usr/bin/env python3
"""Build the single-file SmoothGo demo from the maintained web sources."""

from __future__ import annotations

import base64
import json
import os
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / "web"
OUTPUT = ROOT / "SmoothGo-Web-Demo.html"

# Where the repo's GitHub Pages site lives. The manifest has to name this
# absolutely: a data: URI manifest cannot resolve a relative start_url, and the
# single-file build ships no sibling files to resolve against.
SITE_URL = "https://zhulian33.github.io/SmoothGo/"


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

    # --- Keep the single file installable without shipping extra files -------
    # A relative manifest would 404 next to a lone .html, and a data: manifest
    # cannot resolve relative URLs, so rewrite start_url/scope to absolute and
    # inline every icon as base64.
    def png_data_uri(name: str) -> str:
        p = WEB / name
        if not p.exists():
            raise RuntimeError(f"Missing app icon: {p.relative_to(ROOT)}")
        return "data:image/png;base64," + base64.b64encode(p.read_bytes()).decode("ascii")

    manifest = json.loads((WEB / "manifest.webmanifest").read_text(encoding="utf-8"))
    manifest["start_url"] = SITE_URL
    manifest["scope"] = SITE_URL
    for icon in manifest["icons"]:
        icon["src"] = png_data_uri(icon["src"])
    manifest_b64 = base64.b64encode(
        json.dumps(manifest, separators=(",", ":")).encode("utf-8")
    ).decode("ascii")

    for old, new in (
        (
            '<link rel="manifest" href="manifest.webmanifest" />',
            '<link rel="manifest" href="'
            f'data:application/manifest+json;base64,{manifest_b64}" />',
        ),
        (
            '<link rel="apple-touch-icon" href="apple-touch-icon.png" />',
            '<link rel="apple-touch-icon" href="'
            f'{png_data_uri("apple-touch-icon.png")}" />',
        ),
    ):
        if old not in html:
            raise RuntimeError(f"Missing marker in web/index.html: {old}")
        html = html.replace(old, new)

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
    if re.search(r'(?:manifest\.webmanifest|apple-touch-icon\.png|icon-\d+\.png)', html):
        raise RuntimeError("Standalone build still references an app icon or manifest file.")

    OUTPUT.write_text(html, encoding="utf-8")
    print(f"Wrote {OUTPUT.relative_to(ROOT)} ({OUTPUT.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
