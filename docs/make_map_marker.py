#!/usr/bin/env python3
"""Draw the map pin: a small ink dot inside a white ring.

The <map> component's default marker is a fat red teardrop. Fifty-six of them
in the city centre is a red smear that hides the streets, and red is the one
colour the rest of the app does not use. A dot with a white ring stays legible
over both the road map and satellite imagery, and it matches the black-and-
white type the rest of the product is set in.

Same trick as the tab icons: draw at 3x, downsample for clean edges.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "miniprogram" / "images" / "marker-dot.png"

SIZE = 48
SCALE = 3
CANVAS = SIZE * SCALE
INK = (17, 17, 17, 255)
WHITE = (255, 255, 255, 255)

C = CANVAS // 2
RING = 13 * SCALE      # outer edge of the white ring
DOT = 9 * SCALE        # ink dot radius


def main() -> None:
    img = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.ellipse([C - RING, C - RING, C + RING, C + RING], fill=WHITE)
    draw.ellipse([C - DOT, C - DOT, C + DOT, C + DOT], fill=INK)
    img = img.resize((SIZE, SIZE), Image.LANCZOS)
    img.save(OUT, optimize=True)
    print(f"wrote {OUT.relative_to(ROOT)} ({SIZE}x{SIZE})")


if __name__ == "__main__":
    main()
