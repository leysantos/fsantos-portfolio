# -*- coding: utf-8 -*-
"""Restore Casa 10x30 as MCP/Grok modeled project."""
from __future__ import annotations

import json
import re
from pathlib import Path

DATA = Path(__file__).resolve().parents[1] / "assets" / "data.js"

ENTRY = {
    "t": "Casa térrea 10×30 — MCP · agente Grok",
    "s": "Anteprojeto modelado via MCP com agente Grok — lote 10,00 × 30,00 m",
    "c": "res",
    "img": [
        "assets/img/obras/casa-terrea-10x30-r12-01.webp",
        "assets/img/obras/casa-terrea-10x30-r12-02.webp",
        "assets/img/obras/casa-terrea-10x30-r12-03.webp",
        "assets/img/obras/casa-terrea-10x30-r12-04.webp",
        "assets/img/obras/casa-terrea-10x30-r12-05.webp",
        "assets/img/obras/casa-terrea-10x30-r12-06.webp",
        "assets/img/obras/casa-terrea-10x30-r12-07.webp",
    ],
}


def main() -> None:
    raw = DATA.read_text(encoding="utf-8")
    m = re.search(r"window\.PROJ=(\[.*\]);window\.SW=", raw, re.S)
    if not m:
        raise SystemExit("parse fail")
    data = json.loads(m.group(1))
    tail = raw[m.end() :]

    # Drop old titles if present
    drop = {
        "Casa térrea 10×30 — projeto teste",
        "Casa térrea 10×30 — MCP · agente Grok",
    }
    data = [p for p in data if p["t"] not in drop]

    # Insert after Bom Sucesso if present, else at top
    if data and data[0]["t"] == "Edifício Bom Sucesso":
        data.insert(1, ENTRY)
    else:
        data.insert(0, ENTRY)

    new = "window.PROJ=" + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";window.SW="
    DATA.write_text(raw[: m.start()] + new + tail, encoding="utf-8")
    print("ok", ENTRY["t"], "at", next(i for i, p in enumerate(data) if p["t"] == ENTRY["t"]))


if __name__ == "__main__":
    main()
