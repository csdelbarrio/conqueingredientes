/* ============================================================
   Conqueingredientes — Datos del portfolio
   ------------------------------------------------------------
   CAPACIDADES: cada categoría se corresponde con un perfil
   profesional ISD/OSD/UXA/CNA/DBD/IPM (convalidación UOC).
   El campo `perfil` es solo referencia interna; en la web se
   muestra `nombre`.

   codigo  → ISD  Imperative Software Developer  → Programación imperativa
   cms     → OSD  Object-oriented Software Dev.  → Prog. orientada a objetos
   ux      → UXA  User Experience Analyst        → Experiencia de usuario
   infra   → CNA  Computer Network Admin.        → Administración de redes
   datos   → DBD  Database Developer             → Diseño de bases de datos
   gestion → IPM  IS/IT Project Manager          → Gestión de proyectos
   ============================================================ */

const CAPACIDADES = [
  {
    id: 'codigo',
    num: '01',
    nombre: 'Código en movimiento',
    perfil: 'ISD — Programación imperativa',
    desc: 'Lógica, secuencia y control: piezas interactivas y animación programada paso a paso, del banner al microsite.',
    chips: ['HTML5', 'JavaScript', 'GSAP', 'jQuery', 'Animación']
  },
  {
    id: 'cms',
    num: '02',
    nombre: 'Plataformas & CMS',
    perfil: 'OSD — Programación orientada a objetos',
    desc: 'Desarrollo sobre arquitecturas orientadas a objetos: temas, componentes y tiendas WordPress construidos para crecer.',
    chips: ['WordPress', 'PHP', 'Temas', 'Plugins', 'E-commerce']
  },
  {
    id: 'ux',
    num: '03',
    nombre: 'Experiencia & interfaz',
    perfil: 'UXA — Experiencia de usuario',
    desc: 'Análisis, diseño y maquetación pensados para quien navega: jerarquía clara, usabilidad y adaptación a cualquier pantalla.',
    chips: ['UX', 'Responsive', 'Bootstrap', 'Maquetación', 'Accesibilidad']
  },
  {
    id: 'infra',
    num: '04',
    nombre: 'Infraestructura & despliegue',
    perfil: 'CNA — Administración de redes',
    desc: 'La capa invisible: dominios, servidores, DNS y puesta en producción para que todo esté online, rápido y seguro.',
    chips: ['Hosting', 'Dominios', 'DNS', 'SSL', 'Despliegue']
  },
  {
    id: 'datos',
    num: '05',
    nombre: 'Arquitectura de datos',
    perfil: 'DBD — Diseño de bases de datos',
    desc: 'Modelar la información: catálogos, gestores de contenido y datos estructurados fáciles de mantener y consultar.',
    chips: ['JSON', 'MySQL', 'Gestores de contenido', 'Modelado']
  },
  {
    id: 'gestion',
    num: '06',
    nombre: 'De la idea al lanzamiento',
    perfil: 'IPM — Gestión de proyectos',
    desc: 'Dirección de proyecto de principio a fin: coordinar personas, plazos y presupuesto hasta la entrega.',
    chips: ['Planificación', 'Presupuesto', 'Equipos', 'Briefing', 'Entrega']
  }
];

/* Proyectos — `caps` acepta una o varias capacidades.
   `img` se resuelve como assets/proyectos/{slug}.jpg */

const PROYECTOS = [
  {
    slug: 'coam',
    img: 'content/proyectos/coam/conqueingredientes-coam1.jpg',
    title: 'Coam — Colegio de Arquitectos de Madrid',
    cliente: 'COAM / TF Interactiva',
    caps: ['ux', 'gestion'],
    tags: ['Análisis', 'HTML5', 'Bootstrap', 'Responsive'],
    desc: 'Análisis del proyecto y maquetación HTML5 de la web del Colegio Oficial de Arquitectos de Madrid, con home totalmente responsive.'
  },
  {
    slug: 'movistar-map',
    img: 'content/proyectos/movistar-map/conqueingredientes-movistarmap1.jpg',
    title: 'Movistar Map',
    cliente: 'Territorio Creativo',
    caps: ['datos', 'codigo'],
    tags: ['HTML5', 'jQuery', 'JSON'],
    desc: 'Mapa interactivo desarrollado en HTML5 y jQuery, alimentado por multitud de datos en JSON.'
  },
  {
    slug: 'bmw',
    img: 'content/proyectos/bmw/th_bmw.jpg',
    title: 'BMW Proactividad',
    cliente: 'BMW',
    caps: ['codigo', 'ux'],
    tags: ['HTML5', 'jQuery', 'GreenSock', 'ScrollMagic'],
    desc: 'Microsite de proactividad desarrollado en HTML5 con diversas librerías JavaScript de animación y scroll.'
  },
  {
    slug: 'bmw-serie-3',
    img: 'content/proyectos/bmw-serie-3/th_bmwbanner.jpg',
    title: 'BMW Serie 3',
    cliente: 'BMW',
    caps: ['codigo'],
    tags: ['HTML5', 'GSAP', 'Animación'],
    desc: 'Desarrollo y animación de banner HTML5 con la librería de animación GSAP.'
  },
  {
    slug: 'bmw-serie-3-tap-tap',
    img: 'content/proyectos/bmw-serie-3/th_bmwbanner.jpg',
    title: 'BMW Serie 3 Tap Tap',
    cliente: 'BMW',
    caps: ['codigo'],
    tags: ['HTML5', 'GSAP', 'Animación'],
    desc: 'Pieza interactiva animada en HTML5 con GSAP para la campaña del Serie 3.'
  },
  {
    slug: 'smart',
    img: 'assets/proyectos/smart.jpg',
    title: 'Smart',
    cliente: 'Smart',
    caps: ['codigo'],
    tags: ['HTML5', 'FlashTalking'],
    desc: 'Desarrollo y animación de banner HTML5 sobre la plataforma FlashTalking.'
  },
  {
    slug: 'tu-algo-prestado',
    img: 'content/proyectos/tu-algo-prestado/conqueingredientes-tualgoprestado1.jpg',
    title: 'Tu Algo Prestado',
    cliente: 'Tu Algo Prestado',
    caps: ['cms', 'datos'],
    tags: ['Diseño', 'WordPress', 'Tienda online'],
    desc: 'Diseño y desarrollo WordPress de tienda online, con catálogo de producto y gestión de pedidos.'
  },
  {
    slug: 'ibs-instalaciones',
    img: 'content/proyectos/ibs-instalaciones/conqueingredientes-ibs1-1024x709.jpg',
    title: 'IBS Instalaciones',
    cliente: 'IBS',
    caps: ['cms', 'ux'],
    tags: ['Diseño', 'WordPress', 'Responsive'],
    desc: 'Diseño y desarrollo de site corporativo responsive, realizado en WordPress.'
  },
  {
    slug: 'gyra-architects',
    img: 'content/proyectos/gyra-architects/conqueingredientes-gyra1.jpg',
    title: 'Gyra Architects',
    cliente: 'Gyra Architects',
    caps: ['cms'],
    tags: ['WordPress'],
    desc: 'Desarrollo WordPress del site corporativo del estudio Gyra Architects.'
  },
  {
    slug: 'celia-de-coca',
    img: 'content/proyectos/celia-de-coca/conqueingredientes-celiadecoca1.jpg',
    title: 'Celia de Coca',
    cliente: 'Celia de Coca',
    caps: ['cms'],
    tags: ['WordPress', 'Portfolio'],
    desc: 'Portfolio fotográfico desarrollado en WordPress.'
  },
  {
    slug: 'cosimo-de-monroy',
    img: 'content/proyectos/cosimo-de-monroy/conqueingredientes-cosimo1.jpg',
    title: 'Cósimo de Monroy',
    cliente: 'Cósimo de Monroy',
    caps: ['cms', 'ux'],
    tags: ['WordPress', 'Responsive'],
    desc: 'Desarrollo responsive en WordPress del site Cósimo de Monroy.'
  },
  {
    slug: 'la-perdida',
    img: 'content/proyectos/la-perdida/conqueingredientes-laperdida1.jpg',
    title: 'La Perdida',
    cliente: 'La Perdida',
    caps: ['cms'],
    tags: ['WordPress', 'Portfolio'],
    desc: 'Portfolio personal desarrollado en WordPress.'
  },
  {
    slug: 'trem',
    img: 'content/proyectos/trem/conqueingredientes-tremstudio1.jpg',
    title: 'Trem',
    cliente: 'Trem',
    caps: ['cms'],
    tags: ['WordPress'],
    desc: 'Site corporativo desarrollado en WordPress.'
  },
  {
    slug: 'atlantic',
    img: 'content/proyectos/atlantic/conqueingredientes-atlantic1.jpg',
    title: 'Atlantic Ins Brokers',
    cliente: 'Atlantic Brokers',
    caps: ['infra', 'datos', 'gestion'],
    tags: ['Gestión', 'HTML5', 'CMS'],
    desc: 'Gestión y desarrollo del site corporativo, con gestor de contenidos y mantenimiento continuado.'
  },
  {
    slug: 'bardaji-honrado',
    img: 'content/proyectos/bardaji-honrado/conqueingredientes-bardajihonrado1.jpg',
    title: 'Bardají & Honrado',
    cliente: 'Bardají & Honrado Abogados',
    caps: ['gestion', 'infra'],
    tags: ['Análisis', 'Gestión', 'HTML5'],
    desc: 'Análisis, gestión y desarrollo del site corporativo del despacho de abogados.'
  },
  {
    slug: 'madretierra-catering',
    img: 'content/proyectos/madretierra-catering/conqueingredientes-madretierra1.jpg',
    title: 'Madretierra Catering',
    cliente: 'Madretierra Catering Sostenible',
    caps: ['gestion', 'infra'],
    tags: ['Análisis', 'Gestión', 'HTML5'],
    desc: 'Análisis, gestión y desarrollo del site de Madretierra Catering Sostenible.'
  },
  {
    slug: 'garzon-on-the-road',
    img: 'content/proyectos/garzon-on-the-road/conqueingredientes-gotr1-1024x515.jpg',
    title: 'Garzón on the Road',
    cliente: 'Garzón on the Road',
    caps: ['gestion', 'ux'],
    tags: ['Idea', 'Diseño', 'HTML5', 'CSS3'],
    desc: 'Idea, diseño y programación del site de la serie documental Garzón on The Road.'
  },
  {
    slug: 'jazztel-fibra-optica',
    img: 'content/proyectos/jazztel-fibra-optica/Conqueingredientes-JazztelFibraOptica1-740x512.jpg',
    title: 'Jazztel Fibra Óptica',
    cliente: 'Jazztel',
    caps: ['ux'],
    tags: ['Landing', 'HTML5', 'Responsive'],
    desc: 'Landing page responsive en HTML5 para la campaña de fibra óptica de Jazztel.'
  },
  {
    slug: 'subaru-esqui',
    img: 'content/proyectos/subaru-esqui/Conqueingredientes-SamsungApp-1.jpg',
    title: 'Subaru Esquí',
    cliente: 'Subaru',
    caps: ['ux', 'codigo'],
    tags: ['Microsite', 'Responsive', 'CSS3'],
    desc: 'Maquetación del microsite de la app Subaru Esquí: HTML5, responsive y animaciones CSS3.'
  },
  {
    slug: 'museo-universidad-de-navarra',
    img: 'content/proyectos/museo-universidad-de-navarra/conqueingredientes-unav1.jpg',
    title: 'Museo Universidad de Navarra',
    cliente: 'Universidad de Navarra',
    caps: ['ux'],
    tags: ['HTML5', 'Bootstrap'],
    desc: 'Maquetación HTML5 con Bootstrap del site del Museo de la Universidad de Navarra.'
  },
  {
    slug: 'campus-iker-casillas',
    img: 'content/proyectos/campus-iker-casillas/conqueingredientes-campusiker0.jpg',
    title: 'Campus Iker Casillas',
    cliente: 'Campus de Fútbol Iker Casillas',
    caps: ['ux'],
    tags: ['HTML5', 'Maquetación'],
    desc: 'Maquetación HTML5 del site del campus de fútbol Iker Casillas.'
  },
  {
    slug: 'mt-de-la-plaza',
    img: 'content/proyectos/mt-de-la-plaza/conqueingredientes-mt1.jpg',
    title: 'MT de la Plaza',
    cliente: 'MT de la Plaza',
    caps: ['ux'],
    tags: ['Diseño', 'HTML5', 'Responsive'],
    desc: 'Diseño y maquetación responsive en HTML5 para MT de la Plaza.'
  },
  {
    slug: 'la-tita-rivera',
    img: 'content/proyectos/la-tita-rivera/conqueingredientes-latitarivera1.jpg',
    title: 'La Tita Rivera',
    cliente: 'La Tita Rivera',
    caps: ['ux'],
    tags: ['HTML5', 'Maquetación'],
    desc: 'Maquetación HTML5 para el site de La Tita Rivera.'
  }
];

/* Skills para el ticker */
const SKILLS = [
  'Dirección de proyectos', 'Comunicación', 'Contenidos', 'WordPress',
  'HTML5 & CSS3', 'JavaScript', 'UX & Responsive', 'Analítica',
  'Campañas digitales', 'E-commerce', 'Hosting & DNS', 'Datos estructurados'
];
