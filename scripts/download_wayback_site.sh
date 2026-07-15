#!/usr/bin/env bash
# Descarga el snapshot de Wayback Machine para conqueingredientes.com
# fijado a (o justo antes de) la fecha del snapshot indicado.
#
# Requiere conexion real a internet a web.archive.org (ejecutar en local,
# no en un entorno remoto con red restringida).
#
# Usa scripts/wayback_fetch.py (consulta directa a la API CDX) en lugar de
# la gema `wayback_machine_downloader`, cuya paginacion da errores 400/503
# intermitentes contra la API CDX.
#
# Uso:
#   ./scripts/download_wayback_site.sh
#
# Variables opcionales:
#   OUT_DIR     Carpeta de salida (por defecto: site)
#   TIMESTAMP   Timestamp Wayback (por defecto: 20181107235414)

set -euo pipefail

DOMAIN="conqueingredientes.com"
TIMESTAMP="${TIMESTAMP:-20181107235414}"
OUT_DIR="${OUT_DIR:-site}"

echo "Descargando $DOMAIN (snapshot <= $TIMESTAMP) en ./$OUT_DIR ..."
python3 "$(dirname "$0")/wayback_fetch.py" "${DOMAIN}" "${TIMESTAMP}" "${OUT_DIR}"

echo
echo "Descarga completa."
echo "Si faltan assets (404 en el reporte de verificacion), reintenta con --all"
echo "para incluir tambien redirecciones/errores capturados por Wayback:"
echo "  python3 scripts/wayback_fetch.py ${DOMAIN} ${TIMESTAMP} ${OUT_DIR} --all"
echo
echo "Siguiente paso:"
echo "  python3 scripts/rewrite_and_verify.py ${OUT_DIR} ${DOMAIN}"
