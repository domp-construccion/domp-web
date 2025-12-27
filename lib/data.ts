export interface Service {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  idealClient: string;
  icon: string;
  imageUrl?: string;
  detailedDescription?: string;
  category?: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  type: "residencial" | "comercial" | "industrial";
  city: string;
  description: string;
  status: "terminado" | "en_proceso";
  year?: number;
}

export const services: Service[] = [
  {
    id: "residencial",
    title: "Construcción de Vivienda Residencial",
    description:
      "Construcción de casas y departamentos con los más altos estándares de calidad, cumpliendo con todas las normativas vigentes.",
    benefits: [
      "Diseños personalizados",
      "Materiales de primera calidad",
      "Cumplimiento de normativas",
      "Entrega en tiempo y forma",
    ],
    idealClient: "Familias y desarrolladores inmobiliarios",
    icon: "🏠",
  },
  {
    id: "comercial",
    title: "Obras Comerciales e Industriales",
    description:
      "Construcción de edificios comerciales, oficinas, bodegas y plantas industriales con enfoque en eficiencia y funcionalidad.",
    benefits: [
      "Planeación estratégica",
      "Optimización de espacios",
      "Cumplimiento de normativas industriales",
      "Proyectos llave en mano",
    ],
    idealClient: "Empresas y empresarios",
    icon: "🏢",
  },
  {
    id: "remodelaciones",
    title: "Remodelaciones y Ampliaciones",
    description:
      "Transformamos y ampliamos espacios existentes, mejorando funcionalidad y valor de tu propiedad.",
    benefits: [
      "Minimización de tiempos de obra",
      "Trabajo en espacios habitados",
      "Optimización de costos",
      "Mejora de valor inmobiliario",
    ],
    idealClient: "Propietarios y administradores",
    icon: "🔨",
  },
  {
    id: "direccion",
    title: "Dirección y Supervisión de Obra",
    description:
      "Supervisión profesional de proyectos de construcción, asegurando calidad, tiempos y cumplimiento de presupuestos.",
    benefits: [
      "Control de calidad continuo",
      "Cumplimiento de tiempos",
      "Gestión de proveedores",
      "Reportes periódicos",
    ],
    idealClient: "Desarrolladores y propietarios",
    icon: "👷",
  },
  {
    id: "consultoria",
    title: "Consultoría y Planeación de Proyectos",
    description:
      "Asesoría especializada en la planeación, diseño y ejecución de proyectos constructivos de cualquier escala.",
    benefits: [
      "Análisis de viabilidad",
      "Optimización de presupuestos",
      "Asesoría técnica especializada",
      "Gestión de permisos",
    ],
    idealClient: "Inversionistas y desarrolladores",
    icon: "📋",
  },
  {
    id: "infraestructura",
    title: "Infraestructura y Urbanización",
    description:
      "Desarrollo de infraestructura urbana, obras públicas y urbanización de fraccionamientos.",
    benefits: [
      "Experiencia en obras públicas",
      "Cumplimiento de normativas urbanas",
      "Coordinación con autoridades",
      "Proyectos de gran escala",
    ],
    idealClient: "Gobiernos y desarrolladores urbanos",
    icon: "🛣️",
  },
];

export const projects: Project[] = [
  {
    id: "1",
    slug: "residencial-vista-hermosa",
    name: "Residencial Vista Hermosa",
    type: "residencial",
    city: "Chihuahua, Chihuahua",
    description:
      "Desarrollo residencial de 24 viviendas con acabados de primera calidad, áreas comunes y diseño moderno.",
    status: "terminado",
    year: 2023,
  },
  {
    id: "2",
    slug: "plaza-comercial-norte",
    name: "Plaza Comercial Norte",
    type: "comercial",
    city: "Chihuahua, Chihuahua",
    description:
      "Centro comercial de 8,000 m² con estacionamiento, locales comerciales y áreas de servicio.",
    status: "terminado",
    year: 2023,
  },
  {
    id: "3",
    slug: "bodega-logistica-central",
    name: "Bodega Logística Central",
    type: "industrial",
    city: "Chihuahua, Chihuahua",
    description:
      "Bodega industrial de 12,000 m² con oficinas administrativas y áreas de carga y descarga.",
    status: "en_proceso",
    year: 2024,
  },
  {
    id: "4",
    slug: "remodelacion-edificio-historic",
    name: "Remodelación Edificio Histórico",
    type: "comercial",
    city: "Chihuahua, Chihuahua",
    description:
      "Remodelación integral de edificio histórico manteniendo fachada original y modernizando interiores.",
    status: "terminado",
    year: 2023,
  },
  {
    id: "5",
    slug: "fraccionamiento-las-lomas",
    name: "Fraccionamiento Las Lomas",
    type: "residencial",
    city: "Chihuahua, Chihuahua",
    description:
      "Desarrollo de 80 lotes con infraestructura completa, áreas verdes y servicios urbanos.",
    status: "en_proceso",
    year: 2024,
  },
  {
    id: "6",
    slug: "planta-manufacturera",
    name: "Planta Manufacturera",
    type: "industrial",
    city: "Chihuahua, Chihuahua",
    description:
      "Planta industrial de 15,000 m² con áreas de producción, almacén y oficinas administrativas.",
    status: "terminado",
    year: 2022,
  },
  {
    id: "7",
    slug: "torre-residencial-centro",
    name: "Torre Residencial Centro",
    type: "residencial",
    city: "Chihuahua, Chihuahua",
    description:
      "Torre de 12 pisos con 48 departamentos, amenidades y estacionamiento subterráneo.",
    status: "en_proceso",
    year: 2024,
  },
  {
    id: "8",
    slug: "ampliacion-hospital",
    name: "Ampliación Hospital Regional",
    type: "comercial",
    city: "Chihuahua, Chihuahua",
    description:
      "Ampliación de 3,500 m² con nuevas salas de cirugía y áreas de terapia intensiva.",
    status: "terminado",
    year: 2023,
  },
];

export const whyUs = [
  {
    title: "Más de 15 años de experiencia",
    description:
      "Trayectoria sólida en construcción residencial, comercial e industrial en México.",
  },
  {
    title: "Calidad garantizada",
    description:
      "Utilizamos materiales de primera calidad y cumplimos con todas las normativas vigentes.",
  },
  {
    title: "Equipo profesional",
    description:
      "Arquitectos, ingenieros y supervisores certificados con amplia experiencia en el sector.",
  },
  {
    title: "Compromiso con tiempos",
    description:
      "Cumplimos con los plazos acordados sin comprometer la calidad de la obra.",
  },
];

export const teamRoles = [
  {
    role: "Director de Obra",
    description:
      "Responsable de la coordinación general, gestión de recursos y cumplimiento de objetivos.",
  },
  {
    role: "Arquitecto",
    description:
      "Diseño arquitectónico, supervisión de acabados y coordinación con el cliente.",
  },
  {
    role: "Ingeniero Residente",
    description:
      "Supervisión técnica diaria, control de calidad y cumplimiento de especificaciones.",
  },
  {
    role: "Coordinador de Proyectos",
    description:
      "Planeación, seguimiento de avances y gestión de proveedores y subcontratistas.",
  },
];

export const processSteps = [
  {
    step: 1,
    title: "Análisis y Consultoría",
    description:
      "Evaluamos tus necesidades, analizamos el terreno y definimos la viabilidad del proyecto.",
  },
  {
    step: 2,
    title: "Diseño y Planeación",
    description:
      "Desarrollamos el diseño arquitectónico y la planeación detallada del proyecto.",
  },
  {
    step: 3,
    title: "Presupuesto y Contratación",
    description:
      "Presentamos un presupuesto detallado y transparente. Al aprobarlo, formalizamos la contratación.",
  },
  {
    step: 4,
    title: "Construcción",
    description:
      "Ejecutamos la obra con supervisión constante, reportes periódicos y comunicación fluida.",
  },
  {
    step: 5,
    title: "Entrega y Garantía",
    description:
      "Entregamos el proyecto terminado con la documentación correspondiente y garantía de obra.",
  },
];

