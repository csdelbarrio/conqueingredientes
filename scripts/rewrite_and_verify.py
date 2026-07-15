#!/usr/bin/env python3
"""Reescribe rutas absolutas/wayback a rutas relativas y verifica assets rotos.

Uso:
    python3 rewrite_and_verify.py <site_dir> <domain>

Ejemplo:
    python3 rewrite_and_verify.py site conqueingredientes.com

Paso 1 (rewrite): recorre .html/.htm/.css bajo <site_dir> y reescribe:
  - http(s)://[www.]<domain>/ruta  -> ruta relativa al fichero
  - //[www.]<domain>/ruta          -> ruta relativa al fichero
  - restos de web.archive.org (/web/<timestamp>xx_/http://<domain>/ruta) -> ruta relativa

Paso 2 (verify): para cada .html/.htm, extrae referencias locales
(href, src, srcset, url() en <style>/CSS) y comprueba que el fichero
referenciado existe en disco. Escribe un informe en
<site_dir>/../BROKEN_ASSETS.md con lo que falta.
"""
import os
import re
import sys
from urllib.parse import urlsplit

ATTR_RE = re.compile(r'((?:href|src)\s*=\s*)(["\'])(.*?)\2', re.IGNORECASE)
CSS_URL_RE = re.compile(r'url\(\s*(["\']?)(.*?)\1\s*\)', re.IGNORECASE)
SRCSET_RE = re.compile(r'(srcset\s*=\s*)(["\'])(.*?)\2', re.IGNORECASE)

SKIP_SCHEMES = ("mailto:", "tel:", "javascript:", "data:", "#")


def domain_pattern(domain):
    d = re.escape(domain)
    return re.compile(
        r'(?:https?:)?//(?:www\.)?' + d + r'(/[^"\'\s)]*)?',
        re.IGNORECASE,
    )


def wayback_pattern():
    # /web/20181107235414im_/http://conqueingredientes.com/ruta
    return re.compile(
        r'/web/\d{4,14}(?:[a-z]{2}_)?/(https?:)?/?/?([^"\'\s)]*)',
        re.IGNORECASE,
    )


def to_relative(path_from_root, html_file, site_root):
    if not path_from_root or path_from_root == "":
        path_from_root = "/index.html"
    target = os.path.normpath(os.path.join(site_root, path_from_root.lstrip("/")))
    rel = os.path.relpath(target, os.path.dirname(html_file))
    return rel.replace(os.sep, "/")


def rewrite_file(path, site_root, dom_re, way_re):
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        text = f.read()
    original = text

    def repl_domain(m):
        route = m.group(1) or "/"
        return to_relative(route, path, site_root)

    text = dom_re.sub(repl_domain, text)

    # Limpieza de restos de wayback: dejamos solo la parte de ruta tras el dominio
    def repl_way(m):
        rest = m.group(2) or ""
        # rest suele ser "conqueingredientes.com/ruta" o "www.conqueingredientes.com/ruta"
        rest = re.sub(r'^(www\.)?' + re.escape(DOMAIN_GLOBAL) + r'/?', '/', rest)
        if not rest.startswith('/'):
            rest = '/' + rest
        return to_relative(rest, path, site_root)

    text = way_re.sub(repl_way, text)

    if text != original:
        with open(path, "w", encoding="utf-8") as f:
            f.write(text)
        return True
    return False


def iter_target_files(site_root):
    for root, _dirs, files in os.walk(site_root):
        for name in files:
            if name.lower().endswith((".html", ".htm", ".css")):
                yield os.path.join(root, name)


def extract_local_refs(html_path):
    with open(html_path, "r", encoding="utf-8", errors="ignore") as f:
        text = f.read()
    refs = []
    for m in ATTR_RE.finditer(text):
        refs.append(m.group(3))
    for m in SRCSET_RE.finditer(text):
        for part in m.group(3).split(","):
            url = part.strip().split(" ")[0]
            if url:
                refs.append(url)
    for m in CSS_URL_RE.finditer(text):
        refs.append(m.group(2))
    return refs


def verify(site_root):
    missing = []
    for html_path in iter_target_files(site_root):
        if not html_path.lower().endswith((".html", ".htm")):
            continue
        for ref in extract_local_refs(html_path):
            ref = ref.strip()
            if not ref or ref.startswith(SKIP_SCHEMES):
                continue
            parsed = urlsplit(ref)
            if parsed.scheme in ("http", "https") or parsed.netloc:
                continue  # sigue apuntando fuera; se listara aparte si hace falta
            clean = parsed.path
            if not clean:
                continue
            target = os.path.normpath(os.path.join(os.path.dirname(html_path), clean))
            if os.path.isfile(target):
                continue
            if os.path.isfile(os.path.join(target, "index.html")):
                continue  # enlace a directorio sin barra final; el servidor redirige
            missing.append((html_path, ref))
    return missing


def find_external_refs(site_root, domain):
    external = []
    dom = domain.lower()
    for html_path in iter_target_files(site_root):
        if not html_path.lower().endswith((".html", ".htm")):
            continue
        for ref in extract_local_refs(html_path):
            parsed = urlsplit(ref)
            if parsed.scheme in ("http", "https") and parsed.netloc:
                host = parsed.netloc.lower()
                if "web.archive.org" in host or dom in host:
                    external.append((html_path, ref))
    return external


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)

    SITE_DIR = os.path.abspath(sys.argv[1])
    DOMAIN_GLOBAL = sys.argv[2]

    if not os.path.isdir(SITE_DIR):
        print(f"No existe el directorio: {SITE_DIR}")
        sys.exit(1)

    dom_re = domain_pattern(DOMAIN_GLOBAL)
    way_re = wayback_pattern()

    changed = 0
    for f in iter_target_files(SITE_DIR):
        if rewrite_file(f, SITE_DIR, dom_re, way_re):
            changed += 1
    print(f"Reescritos {changed} ficheros con rutas absolutas/wayback -> relativas.")

    missing = verify(SITE_DIR)
    dangling = find_external_refs(SITE_DIR, DOMAIN_GLOBAL)

    report_path = os.path.join(os.path.dirname(SITE_DIR), "BROKEN_ASSETS.md")
    with open(report_path, "w", encoding="utf-8") as rep:
        rep.write("# Informe de verificacion de assets\n\n")
        rep.write(f"Sitio: {SITE_DIR}\n\n")
        rep.write(f"## Referencias locales rotas ({len(missing)})\n\n")
        if missing:
            for html_path, ref in missing:
                rel_html = os.path.relpath(html_path, SITE_DIR)
                rep.write(f"- `{rel_html}` -> `{ref}`\n")
        else:
            rep.write("Ninguna. Todas las referencias locales resuelven a un fichero existente.\n")

        rep.write(f"\n## Referencias que siguen apuntando fuera (dominio original o web.archive.org) ({len(dangling)})\n\n")
        if dangling:
            for html_path, ref in dangling:
                rel_html = os.path.relpath(html_path, SITE_DIR)
                rep.write(f"- `{rel_html}` -> `{ref}`\n")
        else:
            rep.write("Ninguna.\n")

    print(f"Informe escrito en {report_path}")
    print(f"  Referencias locales rotas: {len(missing)}")
    print(f"  Referencias colgantes (dominio original / web.archive.org): {len(dangling)}")
