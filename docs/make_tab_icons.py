#!/usr/bin/env python3
"""Draw the four tab-bar icons, normal and selected.

WeChat wants a plain local PNG per state at roughly 81x81, and it does not tint
them for you, so both colours have to exist as files. Everything is drawn with
geometry because there is no icon font worth depending on for four glyphs.

Each glyph is drawn at 3x and downsampled, which is the cheapest way to get
antialiased edges out of PIL without relying on platform rendering.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "miniprogram" / "images"

SIZE = 81
SCALE = 3
CANVAS = SIZE * SCALE
INK = (11, 42, 35)        # #0B2A23 selected
MUTED = (140, 164, 157)   # #8CA49D normal
STROKE = 16
C = CANVAS // 2


def new(color: tuple[int, int, int]) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    img = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    return img, ImageDraw.ImageDraw(img)


def finish(img: Image.Image, name: str) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    img.resize((SIZE, SIZE), Image.LANCZOS).save(OUT / name, optimize=True)


def bar(d: ImageDraw.ImageDraw, y: int, x0: int, x1: int, color) -> None:
    d.rounded_rectangle((x0, y - STROKE // 2, x1, y + STROKE // 2), radius=STROKE // 2, fill=color)


def dot(d: ImageDraw.ImageDraw, x: int, y: int, r: int, color) -> None:
    d.ellipse((x - r, y - r, x + r, y + r), fill=color)


def plan(color) -> None:
    """Three rules with a leading bullet: a list, i.e. the day's plan."""
    img, d = new(color)
    for i, y in enumerate((78, 132, 186)):
        dot(d, 62, y, 13, color)
        bar(d, y, 92, 190 if i != 1 else 160, color)
    finish(img, "tab-plan.png" if color == MUTED else "tab-plan-on.png")


def route(color) -> None:
    """Start dot, bent leg, end pin -- the shape of a day's route."""
    img, d = new(color)
    d.line((62, 168, 62, 108, 165, 108), fill=color, width=STROKE, joint="curve")
    d.line((62, 168, 62, 108, 165, 108, 165, 66), fill=color, width=STROKE, joint="curve")
    dot(d, 62, 168, 15, color)
    d.polygon([(165, 44), (187, 74), (143, 74)], fill=color)
    finish(img, "tab-route.png" if color == MUTED else "tab-route-on.png")


def map_pin(color) -> None:
    """Solid teardrop with a punched hole."""
    img, d = new(color)
    d.ellipse((C - 46, 44, C + 46, 172), fill=color)
    d.polygon([(C - 46, 108), (C + 46, 108), (C, 192)], fill=color)
    d.ellipse((C - 17, 82, C + 17, 134), fill=(255, 255, 255, 255))
    finish(img, "tab-map.png" if color == MUTED else "tab-map-on.png")


def queue(color) -> None:
    """A clock face: two hands, no numerals."""
    img, d = new(color)
    d.ellipse((26, 26, CANVAS - 26, CANVAS - 26), outline=color, width=STROKE)
    d.line((C, C, C, C - 44), fill=color, width=STROKE)
    d.line((C, C, C + 34, C), fill=color, width=STROKE)
    finish(img, "tab-queue.png" if color == MUTED else "tab-queue-on.png")


def main() -> None:
    for color in (MUTED, INK):
        plan(color)
        route(color)
        map_pin(color)
        queue(color)
    for path in sorted(OUT.glob("tab-*.png")):
        size = Image.open(path).size
        print(f"  {path.name:18s} {size[0]}x{size[1]} {path.stat().st_size:,} B")


if __name__ == "__main__":
    main()
