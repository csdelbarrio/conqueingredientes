# Conqueingredientes — Portfolio

Portfolio de Carlos Sánchez del Barrio. Diseño inspirado en el template Azurio
(software development company), adaptado a HTML/CSS/JS estático sin dependencias.

## Estructura

```
├── index.html          Estructura de la página
├── css/style.css       Sistema visual (tokens al inicio del archivo)
├── js/data.js          ★ CAPACIDADES + PROYECTOS (editar aquí)
├── js/main.js          Render, filtros, animaciones
└── assets/
    ├── logo.png
    └── proyectos/      Placeholders puntuales
└── content/proyectos/  Imágenes originales por proyecto
```

## Capacidades ↔ Perfiles UOC (CEPRAL)

| Categoría en la web            | Perfil | Asignatura                        |
|--------------------------------|--------|-----------------------------------|
| Código en movimiento           | ISD    | Programación imperativa           |
| Plataformas & CMS              | OSD    | Programación orientada a objetos  |
| Experiencia & interfaz         | UXA    | Experiencia de usuario            |
| Infraestructura & despliegue   | CNA    | Administración de redes           |
| Arquitectura de datos          | DBD    | Diseño de bases de datos          |
| De la idea al lanzamiento      | IPM    | Gestión de proyectos              |

## Añadir o quitar proyectos

Editar el array `PROYECTOS` en `js/data.js`. Cada proyecto necesita:
- `slug` e `img` (ruta de la imagen, normalmente `content/proyectos/{slug}/...`)
- `caps`: una o varias capacidades (`codigo`, `cms`, `ux`, `infra`, `datos`, `gestion`)
- `title`, `cliente`, `tags`, `desc`

## Despliegue en GitHub Pages

Subir el contenido a un repo y activar Pages (Settings → Pages → Deploy from branch).
No requiere build: es 100% estático.
