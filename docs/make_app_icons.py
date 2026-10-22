#!/usr/bin/env python3
"""Generate home-screen icons so SmoothGo installs like an app.

Outputs (committed, and inlined by build_standalone.py):
    web/icon-192.png          Android / Chrome manifest icon
    web/icon-512.png          Android / Chrome manifest icon (hi-dpi + splash)
    web/icon-maskable-512.png Android adaptive icon (extra safe-zone padding)
    web/apple-touch-icon.png  iOS "Add to Home Screen" (180x180, no alpha)
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

WEB = Path(__file__).resolve().parent.parent / "web"

BG = (11, 42, 35)          # #0B2A23
MINT = (127, 224, 188)     # #7FE0BC
WHITE = (255, 255, 255)
SERIF_BOLD = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"


def draw_icon(px: int, glyph_ratio: float) -> Image.Image:
    """Full-bleed brand square with a centred S and a mint baseline tick."""
    img = Image.new("RGB", (px, px), BG)
    d = ImageDraw.Draw(img)

    # Subtle diagonal lift so the flat green does not look like a dead pixel.
    for i in range(px):
        t = i / (px - 1)
        col = tuple(int(BG[c] + 7 * (1 - t)) for c in range(3))
        d.line((0, i, px, i), fill=col)

    size = int(px * glyph_ratio)
    f = ImageFont.truetype(SERIF_BOLD, size)
    # Optical centring: pin the glyph box, not the font metrics.
    box = d.textbbox((0, 0), "S", font=f)
    w, h = box[2] - box[0], box[3] - box[1]
    d.text(
        ((px - w) / 2 - box[0], (px - h) / 2 - box[1] - px * 0.03),
        "S",
        font=f,
        fill=WHITE,
    )

    # Mint tick under the glyph, the same device used on the scan card.
    tick_w = int(size * 0.62)
    tick_h = max(2, int(px * 0.012))
    ty = int((px + h) / 2 + px * 0.06)
    d.rectangle(
        ((px - tick_w) // 2, ty, (px + tick_w) // 2, ty + tick_h), fill=MINT
    )
    return img


def main() -> None:
    WEB.mkdir(parents=True, exist_ok=True)

    draw_icon(512, 0.62).save(WEB / "icon-512.png", optimize=True)
    draw_icon(192, 0.62).save(WEB / "icon-192.png", optimize=True)
    # Maskable: the OS crops to a circle, so keep the glyph inside the 80% disc.
    draw_icon(512, 0.52).save(WEB / "icon-maskable-512.png", optimize=True)
    draw_icon(180, 0.62).save(WEB / "apple-touch-icon.png", optimize=True)

    for name in (
        "icon-192.png",
        "icon-512.png",
        "icon-maskable-512.png",
        "apple-touch-icon.png",
    ):
        p = WEB / name
        im = Image.open(p)
        print(f"{name:24s} {im.size[0]}x{im.size[1]}  {p.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
