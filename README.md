# conqueingredientes-legacy

Rescate de contenido del portfolio `conqueingredientes.com` desde Wayback
Machine, para reconstruir el portfolio con un formato nuevo y sencillo.

- Snapshot de referencia: https://web.archive.org/web/20181107235414/http://conqueingredientes.com/
- Fecha del snapshot: 2018-11-07

## Contenido recuperado (`content/`)

En vez de clonar el WordPress completo (tema y plugins legacy de 2015-2018,
con muchas dependencias rotas), se extrajo solo lo reutilizable para montar
un portfolio nuevo:

```
content/
  proyectos.md          # texto de los 23 proyectos: titulo, cliente, tags, descripcion
  proyectos/<slug>/      # imagenes de cada proyecto, a la mayor resolucion disponible
  pdfs/                  # PDFs recuperados (CV, diptico Madretierra Catering)
```

Dos proyectos (`smart`, `bmw-serie-3-tap-tap`) no tienen imagen: eran
microsites embebidos por iframe (demo externa) sin galeria propia ni
miniatura en ninguna otra pagina del archivo.

## Scripts

```
scripts/
  wayback_fetch.py           # descarga un snapshot completo via API CDX de Wayback
  download_wayback_site.sh   # wrapper de wayback_fetch.py para conqueingredientes.com
  rewrite_and_verify.py      # relativiza rutas y detecta assets rotos (uso con site/)
  extract_portfolio.py       # genera content/ a partir de site/my-portfolio/<slug>/
```

`wayback_fetch.py` sustituye a la gema `wayback_machine_downloader`: su
paginacion contra la API CDX daba errores 400/503 intermitentes en este
entorno. Es reanudable (salta ficheros ya descargados) y reintenta con
backoff ante cortes de conexion.

## Como reproducir la extraccion

Requisito: Python 3 (sin dependencias externas).

```bash
# 1. Descargar el snapshot completo a site/ (no versionado, ~40MB)
./scripts/download_wayback_site.sh

# 2. Extraer texto + imagenes + pdfs a content/
python3 scripts/extract_portfolio.py
```

`site/` es el volcado bruto de Wayback (tema WordPress "freis"/Enfold con
sus plugins) y no esta versionado: se usa solo como fuente intermedia para
`extract_portfolio.py`. Si en el futuro hace falta releer el HTML original
de un proyecto, basta con volver a ejecutar `download_wayback_site.sh`.

### Limitaciones conocidas

- 4 PDFs antiguos (2009, ruta `docs/conqueingredientes.com_*.pdf`, no
  enlazados desde ninguna pagina de la version final del sitio) truncan
  siempre en el mismo punto al descargarlos desde Wayback: es un problema
  del lado del archivo (registro WARC/ARC daniado), no del cliente.
- Los datos de contacto/cliente son los que aparecian en el sitio original
  tal cual (algun enlace de "cliente" apunta a una ruta interna rota del
  propio conqueingredientes.com en vez de a la web externa del cliente).
