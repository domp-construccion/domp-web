import { Service } from "./admin-storage";

export const defaultServices: Service[] = [
  // CONSTRUCCIÓN
  {
    id: "vivienda-residencial",
    title: "Vivienda residencial",
    description: "Construcción de casas y viviendas con los más altos estándares de calidad y cumplimiento de normativas.",
    detailedDescription: "Especializados en la construcción de viviendas residenciales desde cero. Trabajamos con diseños personalizados o planos existentes, garantizando calidad en cada etapa del proceso constructivo.",
    benefits: [
      "Diseños personalizados",
      "Materiales de primera calidad",
      "Cumplimiento de normativas",
      "Entrega en tiempo y forma",
      "Supervisión profesional"
    ],
    idealClient: "Familias y desarrolladores inmobiliarios",
    category: "Construcción"
  },
  {
    id: "locales-bodegas",
    title: "Locales y bodegas",
    description: "Construcción de espacios comerciales e industriales adaptados a tus necesidades específicas.",
    detailedDescription: "Desarrollamos locales comerciales y bodegas con enfoque en funcionalidad, eficiencia y cumplimiento de normativas comerciales e industriales.",
    benefits: [
      "Optimización de espacios",
      "Cumplimiento de normativas",
      "Proyectos llave en mano",
      "Planeación estratégica"
    ],
    idealClient: "Empresarios y comerciantes",
    category: "Construcción"
  },
  {
    id: "ampliaciones-segundas-plantas",
    title: "Ampliaciones y segundas plantas",
    description: "Ampliación de espacios existentes mediante segundas plantas o extensiones horizontales.",
    detailedDescription: "Especialistas en ampliar tu vivienda o negocio mediante la construcción de segundas plantas o ampliaciones. Maximizamos el espacio disponible respetando la estructura existente.",
    benefits: [
      "Maximización de espacio",
      "Respeto a estructura existente",
      "Optimización de costos",
      "Mejora de valor inmobiliario"
    ],
    idealClient: "Propietarios que buscan ampliar su espacio",
    category: "Construcción"
  },
  {
    id: "obra-negra-estructura",
    title: "Obra negra y estructura",
    description: "Construcción de estructura y obra negra con los más altos estándares de seguridad.",
    detailedDescription: "Ejecutamos obra negra y estructura completa, incluyendo cimentación, muros de carga, losas y estructura metálica. Garantizamos resistencia y durabilidad.",
    benefits: [
      "Estructuras resistentes",
      "Cumplimiento de normativas de seguridad",
      "Materiales certificados",
      "Supervisión técnica"
    ],
    idealClient: "Desarrolladores y propietarios",
    category: "Construcción"
  },
  
  // REMODELACIÓN
  {
    id: "remodelacion-integral",
    title: "Remodelación integral",
    description: "Transformación completa de espacios existentes, renovando desde la estructura hasta los acabados finales.",
    detailedDescription: "Remodelaciones integrales que transforman completamente tu espacio. Trabajamos en todas las áreas: estructura, instalaciones, acabados y diseño interior.",
    benefits: [
      "Transformación completa",
      "Optimización de espacios",
      "Trabajo coordinado",
      "Valor agregado a la propiedad"
    ],
    idealClient: "Propietarios que buscan renovar completamente",
    category: "Remodelación"
  },
  {
    id: "cocinas-banos",
    title: "Cocinas y baños",
    description: "Remodelación especializada de cocinas y baños con diseño moderno y funcional.",
    detailedDescription: "Especialistas en la remodelación de cocinas y baños. Creamos espacios modernos, funcionales y estéticamente atractivos, optimizando cada centímetro disponible.",
    benefits: [
      "Diseño moderno y funcional",
      "Optimización de espacio",
      "Materiales de calidad",
      "Instalaciones actualizadas"
    ],
    idealClient: "Propietarios que buscan modernizar cocinas y baños",
    category: "Remodelación"
  },
  {
    id: "reconfiguracion-espacios",
    title: "Reconfiguración de espacios",
    description: "Redistribución y optimización de espacios existentes para mejorar funcionalidad y aprovechamiento.",
    detailedDescription: "Reconfiguramos la distribución de tus espacios para maximizar su funcionalidad. Eliminamos, movemos o creamos muros según tus necesidades.",
    benefits: [
      "Mejor aprovechamiento del espacio",
      "Mayor funcionalidad",
      "Diseño personalizado",
      "Sin necesidad de ampliar"
    ],
    idealClient: "Propietarios que buscan optimizar su espacio",
    category: "Remodelación"
  },
  {
    id: "renovacion-venta-renta",
    title: "Renovación para venta o renta",
    description: "Renovación estratégica de propiedades para aumentar su valor de venta o renta.",
    detailedDescription: "Renovamos tu propiedad con un enfoque estratégico para maximizar su valor de mercado. Trabajamos en áreas clave que generan mayor impacto visual y funcional.",
    benefits: [
      "Aumento de valor de mercado",
      "Retorno de inversión",
      "Renovación estratégica",
      "Propiedad lista para venta/renta"
    ],
    idealClient: "Propietarios que buscan vender o rentar",
    category: "Remodelación"
  },
  {
    id: "renovacion-fachadas",
    title: "Renovación de fachadas",
    description: "Renovación y mejoramiento de fachadas para dar nueva imagen a tu propiedad.",
    detailedDescription: "Transformamos la apariencia exterior de tu propiedad mediante la renovación completa de fachadas. Mejoramos estética, protección y valor de la propiedad.",
    benefits: [
      "Mejora estética exterior",
      "Protección contra intemperie",
      "Aumento de valor",
      "Imagen renovada"
    ],
    idealClient: "Propietarios que buscan mejorar la apariencia exterior",
    category: "Remodelación"
  },
  
  // ACABADOS
  {
    id: "pisos-recubrimientos",
    title: "Pisos y recubrimientos",
    description: "Instalación de pisos y recubrimientos de alta calidad: cerámica, porcelanato, madera, laminado y más.",
    detailedDescription: "Especialistas en la instalación de todo tipo de pisos y recubrimientos. Trabajamos con cerámica, porcelanato, madera, laminado, vinílico y materiales premium.",
    benefits: [
      "Amplia variedad de materiales",
      "Instalación profesional",
      "Acabados perfectos",
      "Durabilidad garantizada"
    ],
    idealClient: "Propietarios y constructores",
    category: "Acabados"
  },
  {
    id: "yeso-tablaroca-plafones",
    title: "Yeso, tablaroca y plafones",
    description: "Instalación de sistemas de yeso, tablaroca y plafones para acabados interiores de calidad.",
    detailedDescription: "Instalamos sistemas de yeso, tablaroca y plafones para crear acabados interiores perfectos. Creamos diseños personalizados y acabados de primera calidad.",
    benefits: [
      "Acabados perfectos",
      "Diseños personalizados",
      "Instalación profesional",
      "Múltiples opciones de diseño"
    ],
    idealClient: "Propietarios y constructores",
    category: "Acabados"
  },
  {
    id: "pintura-profesional",
    title: "Pintura profesional",
    description: "Servicio de pintura profesional con preparación adecuada de superficies y acabados perfectos.",
    detailedDescription: "Pintura profesional con preparación exhaustiva de superficies. Aplicamos técnicas especializadas para lograr acabados perfectos y duraderos.",
    benefits: [
      "Preparación profesional de superficies",
      "Acabados perfectos",
      "Materiales de calidad",
      "Técnicas especializadas"
    ],
    idealClient: "Propietarios y constructores",
    category: "Acabados"
  },
  {
    id: "carpinteria-cancelería",
    title: "Carpintería y cancelería",
    description: "Fabricación e instalación de carpintería y cancelería de madera, aluminio y otros materiales.",
    detailedDescription: "Fabricamos e instalamos carpintería y cancelería personalizada. Trabajamos con madera, aluminio, PVC y otros materiales premium según tus necesidades.",
    benefits: [
      "Fabricación personalizada",
      "Materiales de calidad",
      "Instalación profesional",
      "Diseños a medida"
    ],
    idealClient: "Propietarios y constructores",
    category: "Acabados"
  },
  
  // INSTALACIONES
  {
    id: "electrica",
    title: "Eléctrica",
    description: "Instalación y mantenimiento de sistemas eléctricos residenciales, comerciales e industriales.",
    detailedDescription: "Instalamos y mantenemos sistemas eléctricos completos. Garantizamos seguridad, eficiencia y cumplimiento de normativas eléctricas vigentes.",
    benefits: [
      "Cumplimiento de normativas",
      "Seguridad garantizada",
      "Instalación profesional",
      "Mantenimiento disponible"
    ],
    idealClient: "Propietarios y empresas",
    category: "Instalaciones"
  },
  {
    id: "hidraulica-sanitaria",
    title: "Hidráulica y sanitaria",
    description: "Instalación de sistemas hidráulicos y sanitarios completos para agua fría, caliente y drenaje.",
    detailedDescription: "Instalamos sistemas hidráulicos y sanitarios completos. Trabajamos con tuberías, conexiones, calentadores y sistemas de drenaje eficientes.",
    benefits: [
      "Sistemas completos",
      "Materiales de calidad",
      "Instalación profesional",
      "Eficiencia garantizada"
    ],
    idealClient: "Propietarios y constructores",
    category: "Instalaciones"
  },
  {
    id: "gas",
    title: "Gas",
    description: "Instalación segura de sistemas de gas natural y LP para uso residencial y comercial.",
    detailedDescription: "Instalamos sistemas de gas con total seguridad y cumplimiento de normativas. Trabajamos con gas natural y LP, garantizando instalaciones seguras y eficientes.",
    benefits: [
      "Instalación segura",
      "Cumplimiento de normativas",
      "Certificación incluida",
      "Mantenimiento disponible"
    ],
    idealClient: "Propietarios y comercios",
    category: "Instalaciones"
  },
  {
    id: "iluminacion-arquitectonica",
    title: "Iluminación arquitectónica",
    description: "Diseño e instalación de sistemas de iluminación arquitectónica para resaltar espacios.",
    detailedDescription: "Diseñamos e instalamos sistemas de iluminación arquitectónica que resaltan la belleza de tus espacios. Creamos ambientes únicos mediante iluminación estratégica.",
    benefits: [
      "Diseño personalizado",
      "Eficiencia energética",
      "Ambientes únicos",
      "Tecnología LED"
    ],
    idealClient: "Propietarios y diseñadores",
    category: "Instalaciones"
  },
  
  // EXTERIORES
  {
    id: "bardas-accesos",
    title: "Bardas y accesos",
    description: "Construcción de bardas, muros perimetrales y accesos con diseño y seguridad.",
    detailedDescription: "Construimos bardas, muros perimetrales y accesos que combinan seguridad, estética y funcionalidad. Trabajamos con diversos materiales según tus necesidades.",
    benefits: [
      "Seguridad perimetral",
      "Diseño personalizado",
      "Materiales duraderos",
      "Instalación profesional"
    ],
    idealClient: "Propietarios y empresas",
    category: "Exteriores"
  },
  {
    id: "terrazas-cocheras",
    title: "Terrazas y cocheras",
    description: "Construcción de terrazas y cocheras con diseño funcional y materiales de calidad.",
    detailedDescription: "Construimos terrazas y cocheras que maximizan el uso de espacios exteriores. Creamos áreas funcionales y estéticamente atractivas.",
    benefits: [
      "Maximización de espacio exterior",
      "Diseño funcional",
      "Materiales resistentes",
      "Valor agregado"
    ],
    idealClient: "Propietarios",
    category: "Exteriores"
  },
  {
    id: "impermeabilizacion",
    title: "Impermeabilización",
    description: "Servicios de impermeabilización para techos, azoteas y áreas expuestas a la intemperie.",
    detailedDescription: "Aplicamos sistemas de impermeabilización profesionales para proteger tu propiedad. Trabajamos con membranas, recubrimientos y sistemas especializados.",
    benefits: [
      "Protección contra humedad",
      "Materiales de calidad",
      "Garantía de trabajo",
      "Sistemas especializados"
    ],
    idealClient: "Propietarios",
    category: "Exteriores"
  },
  {
    id: "drenaje-pluvial",
    title: "Drenaje pluvial",
    description: "Instalación de sistemas de drenaje pluvial para manejo eficiente de agua de lluvia.",
    detailedDescription: "Instalamos sistemas de drenaje pluvial completos para proteger tu propiedad. Diseñamos soluciones eficientes para el manejo de agua de lluvia.",
    benefits: [
      "Protección contra inundaciones",
      "Sistemas eficientes",
      "Instalación profesional",
      "Mantenimiento de áreas"
    ],
    idealClient: "Propietarios y desarrolladores",
    category: "Exteriores"
  },
  
  // GESTIÓN DE OBRA
  {
    id: "presupuestos-costos",
    title: "Presupuestos y costos",
    description: "Elaboración de presupuestos detallados y control de costos para proyectos constructivos.",
    detailedDescription: "Elaboramos presupuestos detallados y transparentes para tus proyectos. Realizamos control de costos durante toda la ejecución para mantener el proyecto dentro del presupuesto.",
    benefits: [
      "Presupuestos detallados",
      "Transparencia total",
      "Control de costos",
      "Optimización de recursos"
    ],
    idealClient: "Inversionistas y propietarios",
    category: "Gestión de obra"
  },
  {
    id: "supervision",
    title: "Supervisión",
    description: "Supervisión profesional de obras para garantizar calidad, tiempos y cumplimiento de especificaciones.",
    detailedDescription: "Proporcionamos supervisión profesional continua de obras. Garantizamos calidad, cumplimiento de tiempos y especificaciones técnicas en cada etapa del proyecto.",
    benefits: [
      "Control de calidad continuo",
      "Cumplimiento de tiempos",
      "Reportes periódicos",
      "Supervisión técnica"
    ],
    idealClient: "Desarrolladores y propietarios",
    category: "Gestión de obra"
  },
  {
    id: "obra-llave-mano",
    title: "Obra llave en mano",
    description: "Ejecución completa de proyectos desde el diseño hasta la entrega final, sin preocupaciones para el cliente.",
    detailedDescription: "Ofrecemos servicio de obra llave en mano completo. Nos encargamos de todo: diseño, permisos, construcción, instalaciones y acabados. Tú solo recibes tu proyecto terminado.",
    benefits: [
      "Servicio integral",
      "Sin preocupaciones",
      "Un solo responsable",
      "Entrega completa"
    ],
    idealClient: "Inversionistas y propietarios",
    category: "Gestión de obra"
  }
];

