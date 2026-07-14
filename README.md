# conqueingredientes-legacy

Rescate del sitio `conqueingredientes.com` desde Wayback Machine.

- Snapshot de referencia: https://web.archive.org/web/20181107235414/http://conqueingredientes.com/
- Fecha del snapshot: 2018-11-07

## Por que hay solo scripts en el repo (por ahora)

Este repositorio se inicio desde un entorno remoto sin acceso de red a
`web.archive.org` (bloqueado por politica de egress del entorno). No es
posible descargar el snapshot desde ahi. Los scripts de este repo estan
listos para ejecutarse desde una maquina con acceso normal a internet
(por ejemplo, una sesion local de Claude Code en tu propio equipo).

## Como recuperar el sitio

Requisitos: Ruby (para `wayback_machine_downloader`) y Python 3.

```bash
# 1. Descargar el snapshot (respeta la fecha de cada asset: toma la
#    version mas reciente de cada URL capturada en/antes del timestamp)
./scripts/download_wayback_site.sh

# 2. Reescribir rutas absolutas/wayback a relativas y verificar assets rotos
python3 scripts/rewrite_and_verify.py site conqueingredientes.com

# 3. Revisar el informe generado
cat BROKEN_ASSETS.md

# 4. Servir en local para comprobar visualmente
cd site && python3 -m http.server 8000
# abrir http://localhost:8000
```

Si `BROKEN_ASSETS.md` reporta referencias colgantes o assets 404, prueba
a re-descargar con el flag `--all` (incluye tambien redirecciones/errores
capturados por Wayback):

```bash
wayback_machine_downloader http://conqueingredientes.com \
  -t 20181107235414 -d site -a
python3 scripts/rewrite_and_verify.py site conqueingredientes.com
```

## Estructura

```
scripts/
  download_wayback_site.sh   # descarga el snapshot con wayback_machine_downloader
  rewrite_and_verify.py      # relativiza rutas y detecta assets rotos
site/                        # (generado) contenido recuperado del sitio
BROKEN_ASSETS.md             # (generado) informe de assets/enlaces rotos
```
