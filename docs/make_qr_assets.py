#!/usr/bin/env python3
"""Generate the scan-to-try QR codes and the closing presentation card.

Run with Pillow + segno installed:

    python3 docs/make_qr_assets.py

Outputs (all committed, so the deck never has to be regenerated offline):
    docs/assets/qr-demo.png     QR pointing at the live GitHub Pages demo
    docs/assets/qr-repo.png     QR pointing at the public repository
    docs/assets/scan-card.png   1920x1080 closing slide with the demo QR

The demo URL is the one GitHub Pages will serve once the repository owner
switches Settings > Pages > Source to "GitHub Actions"; see STATUS.md.
"""

from __future__ import annotations

import io
from pathlib import Path

import segno
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "docs" / "assets"

DEMO_URL = "https://zhulian33.github.io/SmoothGo/"
REPO_URL = "https://github.com/zhulian33/SmoothGo"
DEMO_URL_PRETTY = "zhulian33.github.io/SmoothGo"

BG = (11, 42, 35)
BG_LIFT = (18, 58, 49)
MINT = (127, 224, 188)
MUTED = (140, 164, 157)
PALE = (201, 221, 213)
WHITE = (255, 255, 255)
INK = (11, 42, 35)
INK_SOFT = (107, 127, 121)

SERIF_BOLD = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
SERIF = "/System/Library/Fonts/Supplemental/Georgia.ttf"
SANS = "/System/Library/Fonts/Supplemental/Arial.ttf"
SANS_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def tracked(draw, xy, text, f, fill, tracking=0.0, anchor_left=True):
    """Draw text with manual letter-spacing (PIL has no tracking option)."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=f, fill=fill, anchor="ls" if anchor_left else "lm")
        x += draw.textlength(ch, font=f) + tracking
    return x


def make_qr(url: str, path: Path, scale: int = 20) -> Image.Image:
    qr = segno.make(url, error="h")
    qr.save(path, scale=scale, border=3, dark="#0B2A23", light="#FFFFFF")
    return Image.open(path).convert("RGB")


def rounded_card(size, radius, fill, shadow=True) -> Image.Image:
    """White card with a soft drop shadow on transparent background."""
    w, h = size
    pad = 60
    canvas = Image.new("RGBA", (w + pad * 2, h + pad * 2), (0, 0, 0, 0))
    if shadow:
        sh = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
        ImageDraw.Draw(sh).rounded_rectangle(
            (pad, pad + 14, pad + w, pad + h + 14), radius=radius, fill=(0, 0, 0, 110)
        )
        canvas.alpha_composite(sh.filter(ImageFilter.GaussianBlur(28)))
    ImageDraw.Draw(canvas).rounded_rectangle(
        (pad, pad, pad + w, pad + h), radius=radius, fill=fill
    )
    return canvas


def make_scan_card(demo_qr: Image.Image) -> Image.Image:
    W, H = 1920, 1080

    # Flat vertical gradient only. A radial blob was tried first and read as a
    # rendering artifact on a 1080p projector, so keep this dead simple.
    strip = Image.new("RGB", (1, H))
    sp = strip.load()
    for y in range(H):
        t = y / (H - 1)
        sp[0, y] = tuple(int(BG_LIFT[c] + (BG[c] - BG_LIFT[c]) * t) for c in range(3))
    img = strip.resize((W, H), Image.BILINEAR)

    d = ImageDraw.Draw(img)

    # ---- right: white card holding the QR -----------------------------------
    card_w, card_h = 760, 820
    card = rounded_card((card_w, card_h), 32, WHITE)
    cx, cy = 1030, 130
    img.paste(card, (cx - 60, cy - 60), card)

    # 49 modules x 13 px = 637 px: an integer scale keeps the squares crisp, and
    # the code stays readable when the deck is projected below 1920 px wide.
    qr_px = 637
    buf = io.BytesIO()
    segno.make(DEMO_URL, error="h").save(
        buf, kind="png", scale=13, border=3, dark="#0B2A23", light="#FFFFFF"
    )
    buf.seek(0)
    qr = Image.open(buf).convert("RGB")
    qr_top = cy + 55
    img.paste(qr, (cx + (card_w - qr_px) // 2, qr_top))

    f_cap = font(SANS_BOLD, 25)
    f_cap2 = font(SANS, 20)
    cap_x = cx + card_w // 2
    d.text((cap_x, qr_top + qr_px + 50), "Point your camera here",
           font=f_cap, fill=INK, anchor="ma")
    d.text((cap_x, qr_top + qr_px + 86), "No sign-up  ·  works on any phone",
           font=f_cap2, fill=INK_SOFT, anchor="ma")

    # ---- left: the words ----------------------------------------------------
    x = 130
    tracked(d, (x, 300), "TRY IT LIVE  ·  CHANGCHUN", font(SANS_BOLD, 21), MINT, tracking=3.4)
    d.text((x, 400), "Try it on", font=font(SERIF_BOLD, 96), fill=WHITE, anchor="ls")
    d.text((x, 512), "your phone.", font=font(SERIF_BOLD, 96), fill=WHITE, anchor="ls")

    f_sub = font(SANS, 27)
    sub_lines = [
        "574 real places, live queue estimates, and a",
        "day plan that replans itself when the queues move.",
    ]
    for i, line in enumerate(sub_lines):
        d.text((x, 590 + i * 42), line, font=f_sub, fill=PALE, anchor="ls")

    # URL, with a mint rule under it
    f_url = font(SANS_BOLD, 33)
    url_w = d.textlength(DEMO_URL_PRETTY, font=f_url)
    d.text((x, 720), DEMO_URL_PRETTY, font=f_url, fill=WHITE, anchor="ls")
    d.rectangle((x, 736, x + url_w, 741), fill=MINT)

    f_foot = font(SANS, 19)
    d.text((x, 800), "Illustrative data  ·  no real bookings  ·  MIT licensed",
           font=f_foot, fill=MUTED, anchor="ls")
    return img


def main() -> None:
    ASSETS.mkdir(parents=True, exist_ok=True)
    demo_qr = make_qr(DEMO_URL, ASSETS / "qr-demo.png")
    make_qr(REPO_URL, ASSETS / "qr-repo.png")

    card = make_scan_card(demo_qr)
    card.save(ASSETS / "scan-card.png", optimize=True)

    for name in ("qr-demo.png", "qr-repo.png", "scan-card.png"):
        p = ASSETS / name
        im = Image.open(p)
        print(f"{name:16s} {im.size[0]}x{im.size[1]}  {p.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
