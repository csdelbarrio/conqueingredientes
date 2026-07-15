#!/usr/bin/env python3
"""Extrae texto, imagenes y PDFs del portfolio recuperado en site/ hacia una
estructura limpia y manejable en content/, para poder reconstruir el
portfolio con otro formato/plantilla mas adelante.

Fuente: site/my-portfolio/<slug>/index.html (version final del sitio,
enlazada desde la home a fecha del snapshot 2018-11-07). Para cada proyecto
extrae titulo, cliente, descripcion, tags e imagenes de la galeria (a la
mayor resolucion disponible en disco).

Salida:
  content/proyectos.md          Un unico fichero con el texto de todos
                                 los proyectos (una seccion por proyecto).
  content/proyectos/<slug>/     Carpeta con las imagenes de cada proyecto.

Uso:
    python3 scripts/extract_portfolio.py
"""
import html
import os
import re
import shutil

SITE_DIR = "site"
PORTFOLIO_DIR = os.path.join(SITE_DIR, "my-portfolio")
OUT_DIR = "content/proyectos"

DETAIL_SECTION_RE = re.compile(
    r'<section[^>]*id="portfolio-detail".*?</section>', re.DOTALL
)
H1_RE = re.compile(r'<h1 class="page-title[^"]*">\s*(.*?)\s*</h1>', re.DOTALL)
TITLE_TAG_RE = re.compile(r'<title>\s*(.*?)\s*(?:&raquo;.*)?</title>', re.DOTALL)
GALLERY_RE = re.compile(
    r'<div class="wpb_gallery.*?</ul></div>', re.DOTALL
)
SLIDE_RE = re.compile(r'<li[^>]*>(.*?)</li>', re.DOTALL)
PRETTYPHOTO_RE = re.compile(r'<a class="prettyphoto" href="([^"]+)"')
IMG_SRC_RE = re.compile(r'<img[^>]+src="([^"]+)"')
SIZE_SUFFIX_RE = re.compile(r'-\d+x\d+(?=\.\w+$)')
TEXT_COLUMN_RE = re.compile(
    r'<div class="wpb_text_column wpb_content_element">\s*'
    r'<div class="wpb_wrapper">(.*?)</div>\s*</div>',
    re.DOTALL,
)
TAG_STRIP_RE = re.compile(r'<[^>]+>')
LINK_RE = re.compile(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', re.DOTALL)
IFRAME_RE = re.compile(r'<iframe[^>]+src="([^"]+)"')
HOME_THUMB_RE = re.compile(
    r'<img[^>]+src="([^"]+)"[^>]*/>.*?<a href="my-portfolio/([\w-]+)"', re.DOTALL
)


def clean_text(fragment):
    text = html.unescape(fragment)
    text = TAG_STRIP_RE.sub("", text)
    return re.sub(r"\s+", " ", text).strip()


def extract_title(text):
    m = H1_RE.search(text)
    if m:
        return clean_text(m.group(1))
    m = TITLE_TAG_RE.search(text)
    if m:
        return clean_text(m.group(1))
    return None


def best_variant(candidates, base_dir):
    """De entre varias rutas relativas candidatas (thumbnail, resize,
    original) para la misma imagen, elige la de mayor tamaño en disco.
    Tambien prueba la variante sin sufijo -WxH (el original sin recortar)."""
    all_candidates = list(candidates)
    for rel in candidates:
        stripped = SIZE_SUFFIX_RE.sub("", rel)
        if stripped != rel:
            all_candidates.append(stripped)

    best_rel, best_size = None, -1
    for rel in all_candidates:
        path = os.path.normpath(os.path.join(base_dir, rel))
        if os.path.isfile(path):
            size = os.path.getsize(path)
            if size > best_size:
                best_rel, best_size = rel, size
    return best_rel


def extract_images(text, base_dir):
    m = GALLERY_RE.search(text)
    block = m.group(0) if m else text

    result = []
    seen = set()
    for slide in SLIDE_RE.findall(block):
        candidates = []
        href_m = PRETTYPHOTO_RE.search(slide)
        if href_m:
            candidates.append(href_m.group(1))
        src_m = IMG_SRC_RE.search(slide)
        if src_m:
            candidates.append(src_m.group(1))
        if not candidates:
            continue
        chosen = best_variant(candidates, base_dir) or candidates[0]
        if chosen not in seen:
            seen.add(chosen)
            result.append({"rel": chosen, "base_dir": base_dir})
    return result


def build_home_thumbnails(site_dir):
    home_path = os.path.join(site_dir, "index.html")
    if not os.path.isfile(home_path):
        return {}
    with open(home_path, "r", encoding="utf-8", errors="ignore") as f:
        text = f.read()
    thumbs = {}
    for src, slug in HOME_THUMB_RE.findall(text):
        thumbs.setdefault(slug, src)
    return thumbs


def extract_columns(text):
    return TEXT_COLUMN_RE.findall(text)


def parse_project(slug, html_path, home_thumbs, site_dir):
    with open(html_path, "r", encoding="utf-8", errors="ignore") as f:
        text = f.read()

    title = extract_title(text) or slug
    base_dir = os.path.dirname(html_path)

    detail_m = DETAIL_SECTION_RE.search(text)
    detail_text = detail_m.group(0) if detail_m else text

    images = extract_images(detail_text, base_dir)

    demo_url = None
    iframe_m = IFRAME_RE.search(detail_text)
    if iframe_m:
        demo_url = iframe_m.group(1)

    if not images and slug in home_thumbs:
        images = [{"rel": home_thumbs[slug], "base_dir": site_dir}]

    columns = extract_columns(detail_text)

    client_name, client_url = None, None
    description_parts = []
    tags = []

    for col in columns:
        stripped = col.strip()
        if stripped.startswith("<h4"):
            m = LINK_RE.search(stripped)
            if m:
                client_url = m.group(1)
                client_name = clean_text(m.group(2))
            else:
                client_name = clean_text(stripped)
        elif "<blockquote" in stripped:
            tags_text = clean_text(stripped)
            tags = [t.strip() for t in tags_text.split(",") if t.strip()]
        elif stripped.startswith("<p"):
            para = clean_text(stripped)
            if para and not description_parts and not client_name and para.lower() == title.lower():
                client_name = para
                continue
            if para:
                description_parts.append(para)

    return {
        "slug": slug,
        "title": title,
        "client_name": client_name,
        "client_url": client_url,
        "demo_url": demo_url,
        "description": description_parts,
        "tags": tags,
        "images": images,
    }


def copy_images(project, out_images_dir):
    os.makedirs(out_images_dir, exist_ok=True)
    copied = []
    for img in project["images"]:
        src = os.path.normpath(os.path.join(img["base_dir"], img["rel"]))
        if not os.path.isfile(src):
            continue
        name = os.path.basename(src)
        dst = os.path.join(out_images_dir, name)
        if not os.path.exists(dst):
            shutil.copy2(src, dst)
        copied.append(name)
    return copied


def project_section(project, image_files):
    lines = [f'## {project["title"]}', ""]
    if project["client_name"]:
        client = project["client_name"]
        if project["client_url"]:
            client = f'[{client}]({project["client_url"]})'
        lines.append(f"**Cliente:** {client}  ")
    if project["tags"]:
        lines.append(f'**Tags:** {", ".join(project["tags"])}  ')
    if project["demo_url"]:
        lines.append(f'**Demo original:** {project["demo_url"]}  ')
    lines.append(f"**Imagenes:** `proyectos/{project['slug']}/` ({len(image_files)})  ")
    lines.append("")
    for para in project["description"]:
        lines.append(para)
        lines.append("")
    lines.append("---")
    lines.append("")
    return lines


def main():
    if not os.path.isdir(PORTFOLIO_DIR):
        print(f"No existe {PORTFOLIO_DIR}")
        return

    slugs = sorted(
        d for d in os.listdir(PORTFOLIO_DIR)
        if os.path.isdir(os.path.join(PORTFOLIO_DIR, d))
    )

    home_thumbs = build_home_thumbnails(SITE_DIR)

    os.makedirs(OUT_DIR, exist_ok=True)
    doc_lines = ["# Proyectos del portfolio", "", ""]
    summary = []
    for slug in slugs:
        html_path = os.path.join(PORTFOLIO_DIR, slug, "index.html")
        if not os.path.isfile(html_path):
            continue
        project = parse_project(slug, html_path, home_thumbs, SITE_DIR)
        images_out_dir = os.path.join(OUT_DIR, slug)
        image_files = copy_images(project, images_out_dir)
        doc_lines.extend(project_section(project, image_files))
        summary.append((slug, project["title"], len(image_files), len(project["description"])))

    doc_path = os.path.join(os.path.dirname(OUT_DIR), "proyectos.md")
    with open(doc_path, "w", encoding="utf-8") as f:
        f.write("\n".join(doc_lines).rstrip() + "\n")

    print(f"{len(summary)} proyectos extraidos.")
    print(f"Texto consolidado en {doc_path}")
    print(f"Imagenes organizadas en {OUT_DIR}/<slug>/")
    print()
    for slug, title, n_images, n_desc in summary:
        flag = "" if (title and n_images) else "  <-- revisar"
        print(f"  - {slug}: \"{title}\" | {n_images} imagenes | {n_desc} parrafos{flag}")


if __name__ == "__main__":
    main()
