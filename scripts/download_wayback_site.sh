#!/usr/bin/env bash
# Descarga el snapshot de Wayback Machine para conqueingredientes.com
# fijado a (o justo antes de) la fecha del snapshot indicado.
#
# Requiere conexion real a internet a web.archive.org (ejecutar en local,
# no en un entorno remoto con red restringida).
#
# Uso:
#   ./scripts/download_wayback_site.sh
#
# Variables opcionales:
#   OUT_DIR     Carpeta de salida (por defecto: site)
#   TIMESTAMP   Timestamp Wayback (por defecto: 20181107235414)
#   CONCURRENCY Descargas simultaneas (por defecto: 4)

set -euo pipefail

DOMAIN="conqueingredientes.com"
TIMESTAMP="${TIMESTAMP:-20181107235414}"
OUT_DIR="${OUT_DIR:-site}"
CONCURRENCY="${CONCURRENCY:-4}"

if ! command -v wayback_machine_downloader >/dev/null 2>&1; then
  echo "wayback_machine_downloader no encontrado. Instalando via gem..."
  gem install wayback_machine_downloader --no-document
fi

echo "Descargando $DOMAIN (snapshot <= $TIMESTAMP) en ./$OUT_DIR ..."
wayback_machine_downloader "http://${DOMAIN}" \
  --timestamp "${TIMESTAMP}" \
  --directory "${OUT_DIR}" \
  --concurrency "${CONCURRENCY}"

echo
echo "Descarga completa."
echo "Si faltan assets (404 en el reporte de verificacion), reintenta con --all"
echo "para incluir tambien redirecciones/errores capturados por Wayback:"
echo "  wayback_machine_downloader http://${DOMAIN} -t ${TIMESTAMP} -d ${OUT_DIR} -a"
echo
echo "Siguiente paso:"
echo "  python3 scripts/rewrite_and_verify.py ${OUT_DIR} ${DOMAIN}"
