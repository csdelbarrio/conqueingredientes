#!/usr/bin/env python3
"""Descarga un snapshot de Wayback Machine usando la API CDX directamente.

Sustituto de `wayback_machine_downloader` (la gema Ruby sufre errores 400/503
intermitentes contra la API CDX paginada en este entorno). Usa una sola
consulta CDX con matchType=domain y descarga cada asset con el sufijo `id_`
(contenido tal cual, sin la barra de navegacion de Wayback).

Uso:
    python3 wayback_fetch.py <domain> <timestamp> <out_dir> [--all]

--all incluye tambien capturas con codigo de error (404/403/50x) y
redirecciones cuando no hay una captura 200 disponible para esa ruta.
"""
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

CDX_URL = "https://web.archive.org/cdx/search/cdx"
MAX_WORKERS = 3
MAX_RETRIES = 5


def cdx_query(domain, timestamp):
    params = {
        "output": "json",
        "url": domain,
        "matchType": "domain",
        "fl": "timestamp,original,statuscode,digest",
        "to": timestamp,
    }
    url = CDX_URL + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.load(resp)
    if not data:
        return []
    return data[1:]  # descarta la fila de cabecera


def file_id_for(original_url):
    parts = original_url.split("/", 3)
    if len(parts) < 4:
        return ""
    path = parts[3].split("?", 1)[0]
    return urllib.parse.unquote(path)


def target_path(out_dir, file_id, original_url):
    if file_id == "":
        return os.path.join(out_dir, "index.html")
    elements = file_id.split("/")
    last = elements[-1]
    if original_url.endswith("/") or "." not in last:
        return os.path.join(out_dir, *elements, "index.html")
    return os.path.join(out_dir, *elements)


def pick_best_captures(rows, include_all):
    best = {}
    for timestamp, original, statuscode, digest in rows:
        if not include_all and statuscode not in ("200", "-"):
            continue
        fid = file_id_for(original)
        if fid is None:
            continue
        cur = best.get(fid)
        if cur is None or timestamp > cur["timestamp"]:
            best[fid] = {
                "timestamp": timestamp,
                "original": original,
                "statuscode": statuscode,
            }
    return best


def download_one(out_dir, file_id, info):
    path = target_path(out_dir, file_id, info["original"])
    if os.path.exists(path):
        return file_id, "skip", None
    fetch_url = f"https://web.archive.org/web/{info['timestamp']}id_/{info['original']}"

    body = None
    last_err = None
    for attempt in range(MAX_RETRIES):
        try:
            req = urllib.request.Request(fetch_url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=60) as resp:
                body = resp.read()
            last_err = None
            break
        except urllib.error.HTTPError as e:
            body = e.read()
            if body:
                last_err = None
            else:
                last_err = f"{e.code} {e.reason}"
            break
        except Exception as e:
            last_err = str(e)
            time.sleep(min(2 ** attempt, 20))

    if last_err is not None:
        return file_id, "error", last_err

    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(body)
    return file_id, "ok", None


def main():
    if len(sys.argv) < 4:
        print(__doc__)
        sys.exit(1)

    domain = sys.argv[1]
    timestamp = sys.argv[2]
    out_dir = sys.argv[3]
    include_all = "--all" in sys.argv[4:]

    print(f"Consultando CDX para {domain} (<= {timestamp})...")
    rows = cdx_query(domain, timestamp)
    print(f"  {len(rows)} capturas encontradas en total.")

    best = pick_best_captures(rows, include_all)
    print(f"  {len(best)} ficheros unicos a descargar (include_all={include_all}).")

    os.makedirs(out_dir, exist_ok=True)

    ok, skipped, errors = 0, 0, []
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = {
            pool.submit(download_one, out_dir, fid, info): fid
            for fid, info in best.items()
        }
        for fut in as_completed(futures):
            fid, status, err = fut.result()
            if status == "ok":
                ok += 1
            elif status == "skip":
                skipped += 1
            else:
                errors.append((fid, err))

    print(f"Descargados: {ok}, ya existentes: {skipped}, errores: {len(errors)}")
    if errors:
        print("Errores (primeros 20):")
        for fid, err in errors[:20]:
            print(f"  - {fid}: {err}")


if __name__ == "__main__":
    main()
