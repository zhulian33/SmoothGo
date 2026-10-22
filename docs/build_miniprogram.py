#!/usr/bin/env python3
"""Bridge the web app's data and algorithms into the WeChat mini program.

The mini program must never get its own copy of the place library or a
hand-ported version of the planner. Both already exist under web/ and are
covered by the test suite; a second copy would drift within one afternoon.

  1. utils/planner.js and utils/queue-model.js are copied byte for byte.
     They are already written as UMD, and down the `typeof module === "object"`
     branch they export through `module.exports`, which is what the mini
     program's CommonJS loader expects. Verbatim also means `npm test` keeps
     guarding them.
  2. data/places.js is built by docs/mp_extract_places.mjs, which evaluates
     web/app.js's own merge against web/places.poi.js. The count comes out at
     574 -- the same number the web demo puts on its home screen -- and stays
     correct if the dedupe rule changes.
  3. Nothing else is generated. The pages are hand-written because they are UI,
     and UI has to be written for the target rather than translated.

Usage:  python3 docs/build_miniprogram.py
"""

from __future__ import annotations

import os
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / "web"
MP = ROOT / "miniprogram"
EXTRACTOR = ROOT / "docs" / "mp_extract_places.mjs"

# Copied verbatim: UMD modules that already speak CommonJS.
COPIED = ("planner.js", "queue-model.js")


def main() -> None:
    for name in COPIED:
        source = WEB / name
        target = MP / "utils" / name
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)
        # flush: the extractor below writes to the same stdout from a child
        # process, and without this its line prints first.
        print(f"  copied     web/{name} -> miniprogram/utils/{name}  "
              f"({source.stat().st_size:,} B)", flush=True)

    subprocess.run(
        [os.environ.get("NODE", "node"), str(EXTRACTOR)],
        cwd=ROOT,
        check=True,
    )

    slot = sum((MP / p).stat().st_size for p in ("data/places.js", "utils/planner.js",
                                                 "utils/queue-model.js"))
    print(f"  main package so far: {slot / 1024:.0f} KB of the 2 MB budget")


if __name__ == "__main__":
    main()
