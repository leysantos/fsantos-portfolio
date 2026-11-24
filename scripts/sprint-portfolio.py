# -*- coding: utf-8 -*-
"""Sprint: hide stubs + rewrite weak case subtitles in data.js."""
from __future__ import annotations

import json
import re
from pathlib import Path

DATA = Path(__file__).resolve().parents[1] / "assets" / "data.js"

HIDE = {"Casa térrea 10×30 — projeto teste"}

REWRITE_S = {
    "MasterClin": "Clínica em Manaus — fachada, recepção e ambientes em render 3D",
    "Ponte Nova Esperança": "Travessia urbana — estudo e modelagem estrutural da ponte",
    "Contenção Ponta Negra": "Contenção de terreno em Ponta Negra — estrutura de arrimo",
    "Casa geminada": "Residência geminada — volumetria e fachadas em projeção 3D",
    "Clínica Moura": "Clínica médica — projeto de ambientes e circulação",
    "Remoção de pilar — reforço estrutural": "Reforço estrutural com modelagem do antes e do depois",
}


def main() -> None:
    raw = DATA.read_text(encoding="utf-8")
    m = re.search(r"window\.PROJ=(\[.*\]);window\.SW=", raw, re.S)
    if not m:
        raise SystemExit("parse fail")
    data = json.loads(m.group(1))
    tail = raw[m.end() :]

    before = len(data)
    data = [p for p in data if p["t"] not in HIDE]
    print("removed", before - len(data), "kept", len(data))

    for p in data:
        if p["t"] in REWRITE_S:
            p["s"] = REWRITE_S[p["t"]]
            print("s:", p["t"], "->", p["s"])

    new = "window.PROJ=" + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";window.SW="
    DATA.write_text(raw[: m.start()] + new + tail, encoding="utf-8")
    print("ok")


if __name__ == "__main__":
    main()
