# -*- coding: utf-8 -*-
"""Curate real obra photos into assets/img/casos-reais/*.webp"""
from pathlib import Path
from PIL import Image
import shutil
import json
import sys

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
        "dirs": [
            Path(r"C:\Users\User 1\Pictures\ENGENHARIA\PROJETO GABRIEL"),
            Path(r"C:\Users\FSantos\Pictures\Imagens\ENGENHARIA\PROJETO GABRIEL"),
        ],
        "extra": [
            Path(r"C:\Users\User 1\Pictures\ENGENHARIA\PROJETO GABRIEL\fachada finalizada.jpeg"),
            Path(r"C:\Users\FSantos\Pictures\Imagens\ENGENHARIA\PROJETO GABRIEL\fachada finalizada.jpeg"),
        ],
        "n": 1,
        "prefer": "fachada",
    },
    # Avell — fotos de campo de projetos FSantos (Amazon Aço / Sol Master). Sem render nem inspeção.
    "ponte-rolante-40t": {
        "dirs": [
            Path(r"D:\Engenharia\03_Projetos\Eng. Felipe Nicolas\Projetos Itamar\Ponte Rolante 40t Dupla\Fotos")
        ],
        "n": 8,
        "only_jpg": True,
    },
    "berco-bobinas": {
        "dirs": [
            Path(r"D:\Engenharia\03_Projetos\Eng. Felipe Nicolas\Projetos Itamar\Berço das Bobinas\Imagens")
        ],
        "n": 8,
        "only_jpg": True,
    },
    "viga-rolamento": {
        "dirs": [
            Path(r"D:\Engenharia\03_Projetos\Eng. Felipe Nicolas\Projetos Itamar\Novo projeto linha de vida\fotos")
        ],
        "n": 8,
        "only_jpg": True,
    },
    "galpao-amazon-aco": {
        "dirs": [
            Path(r"D:\Engenharia\03_Projetos\Eng. Felipe Nicolas\Projetos Itamar\Projeto Galpão Amazon Aço\IMAGENS")
        ],
        "n": 1,
        "only_jpg": True,
        "prefer": "wa0060",
    },
    "balancim-ponte": {
        "dirs": [
            Path(r"D:\Engenharia\03_Projetos\Eng. Felipe Nicolas\Projetos Itamar\Projeto Novo Balancim\fotos")
        ],
        "n": 8,
        "only_jpg": True,
    },
    "casa-mosaico": {
        "dirs": [
            Path(r"D:\Engenharia\03_Projetos\Eng. Rafael Caputti\Projeto Mosaico\IMAGENS\fotos dia 22102022"),
            Path(r"D:\Engenharia\03_Projetos\Eng. Rafael Caputti\Projeto Mosaico\IMAGENS\fotos dia 11112022"),
            Path(r"D:\Engenharia\03_Projetos\Eng. Rafael Caputti\Projeto Mosaico\IMAGENS\fotos - 29032023"),
            Path(r"D:\Engenharia\03_Projetos\Eng. Rafael Caputti\Projeto Mosaico\IMAGENS\fotos - 23052023"),
        ],
        "n": 8,
        "only_jpg": True,
        "per_dir": 2,
    },
    "edicula-caputti": {
        "dirs": [
            Path(r"D:\Engenharia\03_Projetos\Eng. Rafael Caputti\Projeto Edicula\imagem")
        ],
        "n": 6,
        "only_jpg": True,
    },
    "galpao-metalico": {
        "dirs": [
            Path(r"D:\Engenharia\03_Projetos\Eng. Harlen\Projeto Galpão Estrutura Metálica\IMAGENS")
        ],
        "n": 8,
        "only_jpg": True,
        "prefer": "img-",
    },
    "casa-flavia": {
        "dirs": [
            Path(r"D:\Engenharia\03_Projetos\Eng. Flavia\Projeto Casa da Flavia\projetos\fotos")
        ],
        "n": 8,
        "only_jpg": True,
        "prefer": "img-",
    },
    "galpao-alvorada": {
        "dirs": [
            Path(r"D:\Engenharia\03_Projetos\Eng. Felipe Nicolas\Projetos Itamar\Projeto Alvorada e Cidade Nova\imagens")
        ],
        "n": 8,
        "only_jpg": True,
    },
    "linha-de-vida": {
        "dirs": [
            Path(r"D:\Engenharia\03_Projetos\Eng. Felipe Nicolas\Projetos Itamar\Linha de vida\FOTOS")
        ],
        "n": 8,
        "only_jpg": True,
    },
    "muro-contencao": {
        "files": [
            Path(r"D:\Engenharia\03_Projetos\Eng. Israel Brito\Muro de Contenção\fotos\IMG-20240418-WA0080.jpg"),
            Path(r"D:\Engenharia\03_Projetos\Eng. Israel Brito\Muro de Contenção\fotos\Imagem do WhatsApp de 2024-04-17 à(s) 15.29.03_463bab98.jpg"),
            Path(r"D:\Engenharia\03_Projetos\Eng. Israel Brito\Muro de Contenção\fotos\Imagem do WhatsApp de 2024-04-17 à(s) 15.37.27_2c0a3510.jpg"),
        ],
        "n": 3,
        "only_jpg": True,
    },
    "vestiario-fabril": {
        "dirs": [
            Path(r"D:\Engenharia\03_Projetos\Eng. Harlen\Projeto Fabril\EST_VESTIARIO_FABRIL\IMAGENS")
        ],
        "n": 8,
        "only_jpg": True,
        "prefer": "img-",
    },
    "escada-dom-pedro": {
        "files": [
            Path(r"G:\Meu Drive\ENGENHARIA\03_Projetos\06_Eng_Altemir\PROJETO ESTRUTURAL ESCADA DOM PEDRO\IMAGENS\WhatsApp Unknown 2021-04-29 at 20.32.11\WhatsApp Image 2021-04-10 at 10.49.29 (1).jpeg"),
            Path(r"G:\Meu Drive\ENGENHARIA\03_Projetos\06_Eng_Altemir\PROJETO ESTRUTURAL ESCADA DOM PEDRO\IMAGENS\WhatsApp Unknown 2021-04-29 at 20.32.11\WhatsApp Image 2021-04-10 at 10.49.29 (2).jpeg"),
            Path(r"G:\Meu Drive\ENGENHARIA\03_Projetos\06_Eng_Altemir\PROJETO ESTRUTURAL ESCADA DOM PEDRO\IMAGENS\WhatsApp Unknown 2021-04-29 at 20.32.11\WhatsApp Image 2021-04-12 at 10.04.03.jpeg"),
            Path(r"G:\Meu Drive\ENGENHARIA\03_Projetos\06_Eng_Altemir\PROJETO ESTRUTURAL ESCADA DOM PEDRO\IMAGENS\WhatsApp Unknown 2021-04-29 at 20.32.11\WhatsApp Image 2021-04-12 at 10.04.02 (1).jpeg"),
            Path(r"G:\Meu Drive\ENGENHARIA\03_Projetos\06_Eng_Altemir\PROJETO ESTRUTURAL ESCADA DOM PEDRO\IMAGENS\WhatsApp Unknown 2021-04-29 at 20.32.11\WhatsApp Image 2021-04-27 at 10.24.14 (1).jpeg"),
        ],
        "n": 5,
    },
    "escritorio-concreto": {
        "files": [
            Path(r"G:\Meu Drive\ENGENHARIA\03_Projetos\17_Eng_Jose_Junior\CONST ESCRITÓRIO\PROJETOS ESCRITORIO SRA MARLUCE\fotos\WhatsApp Image 2022-04-14 at 18.37.07.jpeg"),
            Path(r"G:\Meu Drive\ENGENHARIA\03_Projetos\17_Eng_Jose_Junior\CONST ESCRITÓRIO\PROJETOS ESCRITORIO SRA MARLUCE\fotos\WhatsApp Image 2022-04-01 at 11.32.16.jpeg"),
            Path(r"G:\Meu Drive\ENGENHARIA\03_Projetos\17_Eng_Jose_Junior\CONST ESCRITÓRIO\PROJETOS ESCRITORIO SRA MARLUCE\fotos\WhatsApp Image 2022-03-25 at 13.04.37.jpeg"),
            Path(r"G:\Meu Drive\ENGENHARIA\03_Projetos\17_Eng_Jose_Junior\CONST ESCRITÓRIO\PROJETOS ESCRITORIO SRA MARLUCE\fotos\WhatsApp Image 2022-03-23 at 09.57.49 (1).jpeg"),
        ],
        "n": 4,
    },
    "ponte-rolante-5-10t": {
        "files": [
            Path(r"G:\Meu Drive\ENGENHARIA\03_Projetos\11_Eng_Felipe_Nicolas\PROJETO DE PONTE ROLANTE EM AÇO\PROJETO ITAMAR - PONTE ROLANTE\IMAGENS\FOTOS DA PONTE ROLANTE\IMG_2607.JPEG"),
            Path(r"G:\Meu Drive\ENGENHARIA\03_Projetos\11_Eng_Felipe_Nicolas\PROJETO DE PONTE ROLANTE EM AÇO\PROJETO ITAMAR - PONTE ROLANTE\IMAGENS\FOTOS DA PONTE ROLANTE\IMG_2610.JPEG"),
            Path(r"G:\Meu Drive\ENGENHARIA\03_Projetos\11_Eng_Felipe_Nicolas\PROJETO DE PONTE ROLANTE EM AÇO\PROJETO ITAMAR - PONTE ROLANTE\IMAGENS\FOTOS DA PONTE ROLANTE\IMG_2611.JPEG"),
            Path(r"G:\Meu Drive\ENGENHARIA\03_Projetos\11_Eng_Felipe_Nicolas\PROJETO DE PONTE ROLANTE EM AÇO\PROJETO ITAMAR - PONTE ROLANTE\IMAGENS\FOTOS DA PONTE ROLANTE\IMG_2615.JPEG"),
            Path(r"G:\Meu Drive\ENGENHARIA\03_Projetos\11_Eng_Felipe_Nicolas\PROJETO DE PONTE ROLANTE EM AÇO\PROJETO ITAMAR - PONTE ROLANTE\IMAGENS\FOTOS DA PONTE ROLANTE\IMG_2617.JPEG"),
        ],
        "n": 5,
    },
    "casa-portinari": {
        "files": [
            Path(r"D:\Engenharia\03_Projetos\Eng. Francirley Santos\Casa 65B - Portinari\imagens\area-gourmet-concluida.jpg"),
            Path(r"D:\Engenharia\03_Projetos\Eng. Francirley Santos\Casa 65B - Portinari\imagens\IMG-20250322-WA0013.jpg"),
            Path(r"D:\Engenharia\03_Projetos\Eng. Francirley Santos\Casa 65B - Portinari\imagens\IMG-20250323-WA0009.jpg"),
            Path(r"D:\Engenharia\03_Projetos\Eng. Francirley Santos\Casa 65B - Portinari\imagens\IMG-20250323-WA0012.jpg"),
        ],
        "n": 4,
    },
    "oficina-empilhadeiras": {
        "files": [
            Path(r"D:\Engenharia\03_Projetos\Eng. Hudson Smith\Projeto Oficina de Empilhadeiras\fotos\WhatsApp Image 2026-07-01 at 12.22.12.jpeg"),
            Path(r"D:\Engenharia\03_Projetos\Eng. Hudson Smith\Projeto Oficina de Empilhadeiras\fotos\WhatsApp Image 2026-07-01 at 12.22.07.jpeg"),
            Path(r"D:\Engenharia\03_Projetos\Eng. Hudson Smith\Projeto Oficina de Empilhadeiras\fotos\WhatsApp Image 2026-07-01 at 12.22.06.jpeg"),
            Path(r"D:\Engenharia\03_Projetos\Eng. Hudson Smith\Projeto Oficina de Empilhadeiras\fotos\WhatsApp Image 2026-07-01 at 12.22.04.jpeg"),
            Path(r"D:\Engenharia\03_Projetos\Eng. Hudson Smith\Projeto Oficina de Empilhadeiras\fotos\WhatsApp Image 2026-07-01 at 12.22.11.jpeg"),
        ],
        "n": 5,
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
            if any(k in name for k in ("banner", "captura", "collage", "render", "archirender", "croqui")):
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


def main(only=None):
    manifest_path = OUT / "_manifest.json"
    manifest = {}
    if manifest_path.exists():
        try:
            manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            manifest = {}
    chosen = {k: v for k, v in CASES.items() if not only or k in only}
    for slug, cfg in chosen.items():
        if cfg.get("per_dir"):
            files = []
            for d in cfg.get("dirs") or []:
                chunk = collect([d], None)
                if cfg.get("only_jpg"):
                    chunk = [p for p in chunk if p.suffix.lower() in {".jpg", ".jpeg"}]
                files.extend(pick(chunk, cfg["per_dir"], slug, cfg.get("prefer")))
            picked = files[: cfg["n"]]
        elif cfg.get("files"):
            picked = [p for p in cfg["files"] if p.exists()][: cfg["n"]]
        else:
            files = collect(cfg.get("dirs"), cfg.get("extra"))
            if cfg.get("only_jpg"):
                files = [p for p in files if p.suffix.lower() in {".jpg", ".jpeg"}]
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
    main(sys.argv[1:])
