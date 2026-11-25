# -*- coding: utf-8 -*-
"""Curate real obra photos into assets/img/casos-reais/*.webp"""
from pathlib import Path
from PIL import Image
import shutil
import json

OUT = Path(r"d:\dev-santos\fsantos-portfolio\assets\img\casos-reais")
OUT.mkdir(parents=True, exist_ok=True)

CASES = {
    "pavimento-chibatao": {
        "dirs": [
            Path(r"D:\ENGENHARIA\13_SEMINF\OBRAS EM ANDAMENTO\PAVIMENTO RÍGIDO - CHIBATÃO\IMAGENS"),
            Path(r"D:\ENGENHARIA\13_SEMINF\OBRAS EM ANDAMENTO\PAVIMENTO RÍGIDO - CHIBATÃO\Pav_Rigido_Qualitech"),
        ],
        "n": 8,
    },
    "passarelas-mindu": {
        "dirs": [
            Path(r"D:\ENGENHARIA\13_SEMINF\AVALIAÇÃO ESTRUTURAL\2024\PASSARELAS DO PARQUE DO MINDÚ\FOTOS")
        ],
        "n": 8,
    },
    "ponte-bilhares": {
        "dirs": [
            Path(
                r"D:\ENGENHARIA\13_SEMINF\AVALIAÇÃO ESTRUTURAL\2024\PONTE DOS BILHARES AV. CONSTANTINO NERY\FOTOS"
            )
        ],
        "n": 8,
    },
    "viaduto-manoa": {
        "dirs": [
            Path(r"D:\ENGENHARIA\13_SEMINF\AVALIAÇÃO ESTRUTURAL\2024\VIADUTO DO MANOA\FOTOS"),
            Path(r"D:\ENGENHARIA\13_SEMINF\AVALIAÇÃO ESTRUTURAL\2025\VIADUTO DO MANOA\FOTOS"),
        ],
        "n": 8,
    },
    "ponte-monte-oliveiras": {
        "dirs": [
            Path(
                r"D:\ENGENHARIA\13_SEMINF\AVALIAÇÃO ESTRUTURAL\2025\PONTE DO MONTES DAS OLIVEIRAS\FOTOS"
            )
        ],
        "n": 8,
    },
    "igarape-frederico": {
        "dirs": [
            Path(
                r"D:\ENGENHARIA\13_SEMINF\AVALIAÇÃO ESTRUTURAL\2024\EROSÃO NO IGARAPE DA RUA FREDERICO\FOTOS"
            )
        ],
        "n": 8,
    },
    "casa-aleixo-erosao": {
        "dirs": [
            Path(r"D:\ENGENHARIA\13_SEMINF\AVALIAÇÃO ESTRUTURAL\2023\CASA ALEIXO\FOTOS"),
            Path(
                r"D:\ENGENHARIA\13_SEMINF\AVALIAÇÃO ESTRUTURAL\2023\EROSÃO NA RUA BEIRA RIO - COL ANTONIO ALEIXO\FOTOS"
            ),
        ],
        "n": 8,
    },
    "clicheria-metalica": {
        "dirs": [
            Path(
                r"D:\ENGENHARIA\03_Projetos\Eng. Kleber\Galpão Distrito\Deposito Clicheria\Imagens"
            )
        ],
        "extra": [
            Path(
                r"D:\ENGENHARIA\03_Projetos\Eng. Kleber\Galpão Distrito\Deposito Clicheria\Imagens\execução da clicheria.jpeg"
            )
        ],
        "n": 2,
        "prefer": "execu",
    },
    "residencia-gabriel": {
        "dirs": [Path(r"C:\Users\User 1\Pictures\ENGENHARIA\PROJETO GABRIEL")],
        "extra": [
            Path(r"C:\Users\User 1\Pictures\ENGENHARIA\PROJETO GABRIEL\fachada finalizada.jpeg")
        ],
        "n": 1,
        "prefer": "fachada",
    },
}

EXTS = {".jpg", ".jpeg", ".png", ".webp"}


def collect(dirs, extra=None):
    files = []
    for d in dirs or []:
        if not d or not d.exists():
            continue
        for p in d.rglob("*"):
            if not p.is_file() or p.suffix.lower() not in EXTS:
                continue
            name = p.name.lower()
            if "banner" in name:
                continue
            try:
                sz = p.stat().st_size
            except OSError:
                continue
            if sz < 40_000:
                continue
            files.append((sz, p))
    for p in extra or []:
        if p and p.exists():
            files.append((p.stat().st_size, p))
    seen, uniq = set(), []
    for sz, p in sorted(files, key=lambda x: -x[0]):
        rp = str(p.resolve())
        if rp in seen:
            continue
        seen.add(rp)
        uniq.append(p)
    return uniq


def to_webp(src: Path, dest: Path, max_side=1600, q=78):
    im = Image.open(src).convert("RGB")
    w, h = im.size
    m = max(w, h)
    if m > max_side:
        s = max_side / m
        im = im.resize((int(w * s), int(h * s)), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "WEBP", quality=q, method=6)


def pick(files, n, slug, prefer=None):
    if prefer:
        pref = [p for p in files if prefer in p.name.lower()]
        rest = [p for p in files if p not in pref]
        files = pref + rest
    if slug == "pavimento-chibatao":
        imgs = [p for p in files if "IMAGENS" in str(p)]
        qual = [p for p in files if p not in imgs]
        return (imgs[:6] + qual[:6])[:n]
    if len(files) <= n:
        return files
    step = max(1, len(files) // n)
    picked = []
    for i in range(n):
        idx = min(i * step, len(files) - 1)
        if files[idx] not in picked:
            picked.append(files[idx])
    if files[0] not in picked:
        picked[0] = files[0]
    return picked[:n]


def main():
    manifest = {}
    for slug, cfg in CASES.items():
        files = collect(cfg.get("dirs"), cfg.get("extra"))
        picked = pick(files, cfg["n"], slug, cfg.get("prefer"))
        dest_dir = OUT / slug
        if dest_dir.exists():
            shutil.rmtree(dest_dir)
        dest_dir.mkdir(parents=True, exist_ok=True)
        outs = []
        for i, src in enumerate(picked, 1):
            dest = dest_dir / f"{i:02d}.webp"
            try:
                to_webp(src, dest)
                outs.append(f"assets/img/casos-reais/{slug}/{i:02d}.webp")
                print(f"OK {slug}/{i:02d} <- {src.name} ({src.stat().st_size // 1024}KB)")
            except Exception as e:
                print(f"FAIL {src}: {e}")
        manifest[slug] = outs
    (OUT / "_manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print("--- MANIFEST ---")
    for k, v in manifest.items():
        print(k, len(v))


if __name__ == "__main__":
    main()
