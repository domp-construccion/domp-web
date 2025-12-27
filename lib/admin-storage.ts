import { getDb } from "@/lib/mongodb";

// Settings
export type TeamMember = {
  role: string;
  name: string;
  description: string;
  imageUrl?: string;
};

export type ProcessStep = {
  step: number;
  title: string;
  description: string;
};

export type SiteSettings = {
  phones: string[];
  emails: string[];
  whatsapp: string;
  address: string;
  city: string;
  serviceAreas: string[];
  social: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    linkedin?: string;
    [key: string]: string | undefined; // Permite agregar más redes sociales dinámicamente
  };
  hero: {
    headline: string;
    subheadline: string;
    primaryCtaText: string;
    primaryCtaHref: string;
    secondaryCtaText: string;
    secondaryCtaHref: string;
  };
  nosotros: {
    historia: string;
    mision: string;
    vision: string;
    valores: string[];
    teamMembers: TeamMember[];
    processSteps: ProcessStep[];
  };
  colors: {
    primary: string;
    accent: string;
    accentHover: string;
    backgroundLight: string;
    textDark: string;
    socialButtons?: string;
    socialButtonsHover?: string;
  };
};

const DEFAULT_SETTINGS: SiteSettings = {
  phones: ["614 2156600"],
  emails: ["domp@contruccion.mx"],
  whatsapp: "6142156600",
  address: "",
  city: "Chihuahua, Chihuahua",
  serviceAreas: ["Chihuahua y alrededores"],
  social: {
    instagram: "https://www.instagram.com/domp.mx?igsh=b2xhM3JkdXg3N2p4",
    facebook: "https://www.facebook.com/share/16rTmPc5Zm/?mibextid=wwXIfr",
    tiktok: "",
    linkedin: "",
  },
  hero: {
    headline: "DomP",
    subheadline:
      "Empresa líder en construcción en México. Transformamos tus ideas en realidad con calidad, profesionalismo y compromiso.",
    primaryCtaText: "Cotizar Proyecto",
    primaryCtaHref: "/contacto",
    secondaryCtaText: "Ver Proyectos",
    secondaryCtaHref: "/proyectos",
  },
  nosotros: {
    historia: "DomP nació en 2008 con la visión de ser una empresa de construcción que prioriza la calidad, el compromiso y la satisfacción del cliente. Desde nuestros inicios en Chihuahua, hemos crecido hasta convertirnos en una empresa reconocida por la excelencia en la ejecución de proyectos residenciales, comerciales e industriales.\n\nA lo largo de más de 15 años, hemos completado cientos de proyectos, siempre manteniendo nuestros estándares de calidad y cumplimiento de tiempos. Nuestro equipo está formado por profesionales altamente capacitados que comparten nuestra pasión por la construcción y el servicio al cliente.",
    mision: "Construir proyectos de alta calidad que superen las expectativas de nuestros clientes, utilizando materiales de primera y cumpliendo con los más altos estándares de seguridad y normatividad, siempre con profesionalismo y compromiso.",
    vision: "Ser la empresa de construcción líder en la región, reconocida por nuestra excelencia, innovación y compromiso con la satisfacción del cliente, contribuyendo al desarrollo urbano y al crecimiento de nuestras comunidades.",
    valores: [
      "Calidad en cada proyecto",
      "Integridad y transparencia",
      "Compromiso con tiempos",
      "Trabajo en equipo",
      "Responsabilidad social",
    ],
    teamMembers: [
      {
        role: "Director de Obra",
        name: "Juan Domínguez",
        description: "Responsable de la coordinación general, gestión de recursos y cumplimiento de objetivos.",
        imageUrl: "",
      },
      {
        role: "Arquitecto",
        name: "",
        description: "Diseño arquitectónico, supervisión de acabados y coordinación con el cliente.",
        imageUrl: "",
      },
      {
        role: "Ingeniero Residente",
        name: "",
        description: "Supervisión técnica diaria, control de calidad y cumplimiento de especificaciones.",
        imageUrl: "",
      },
      {
        role: "Coordinador de Proyectos",
        name: "",
        description: "Planeación, seguimiento de avances y gestión de proveedores y subcontratistas.",
        imageUrl: "",
      },
    ],
    processSteps: [
      {
        step: 1,
        title: "Análisis y Consultoría",
        description: "Evaluamos tus necesidades, analizamos el terreno y definimos la viabilidad del proyecto.",
      },
      {
        step: 2,
        title: "Diseño y Planeación",
        description: "Desarrollamos el diseño arquitectónico y la planeación detallada del proyecto.",
      },
      {
        step: 3,
        title: "Presupuesto y Contratación",
        description: "Presentamos un presupuesto detallado y transparente. Al aprobarlo, formalizamos la contratación.",
      },
      {
        step: 4,
        title: "Construcción",
        description: "Ejecutamos la obra con supervisión constante, reportes periódicos y comunicación fluida.",
      },
      {
        step: 5,
        title: "Entrega y Garantía",
        description: "Entregamos el proyecto terminado con la documentación correspondiente y garantía de obra.",
      },
    ],
  },
  colors: {
    primary: "#101932",
    accent: "#F18121",
    accentHover: "#e0771a",
    backgroundLight: "#EDEDED",
    textDark: "#171719",
    socialButtons: "#F18121",
    socialButtonsHover: "#e0771a",
  },
};

// Exportar DEFAULT_SETTINGS para uso en otros módulos
export { DEFAULT_SETTINGS };

export async function getSettings(): Promise<SiteSettings> {
  try {
    const db = await getDb();
    const collection = db.collection("settings");
    
    const settings = await collection.findOne({ _id: "site" });
    
    if (settings) {
      const { _id, ...settingsData } = settings;
      console.log("📊 Settings obtenidos de MongoDB:", JSON.stringify({ emails: settingsData.emails, phones: settingsData.phones }, null, 2));
      return settingsData as SiteSettings;
    }
    
    console.log("📝 No hay settings en MongoDB, insertando valores por defecto");
    await collection.insertOne({ _id: "site", ...DEFAULT_SETTINGS });
    return DEFAULT_SETTINGS;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn("⚠️ MongoDB no disponible, usando valores por defecto para settings:", errorMessage);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  try {
    console.log("💾 Iniciando guardado de settings en MongoDB...");
    const db = await getDb();
    const collection = db.collection("settings");
    
    console.log("💾 Guardando settings en MongoDB:", JSON.stringify({ emails: settings.emails, phones: settings.phones }, null, 2));
    
    const result = await collection.updateOne(
      { _id: "site" },
      { $set: settings },
      { upsert: true }
    );
    
    console.log("✅ Settings guardados en MongoDB correctamente. Resultado:", {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount,
    });
    
    // Verificar que se guardó correctamente
    const verify = await collection.findOne({ _id: "site" });
    if (verify) {
      console.log("✅ Verificación: Settings guardados correctamente. Emails:", verify.emails);
    } else {
      console.warn("⚠️ Advertencia: No se pudo verificar el guardado de settings");
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error al guardar settings en MongoDB:", errorMessage);
    console.error("❌ Stack trace:", error instanceof Error ? error.stack : "No disponible");
    
    if (errorMessage.includes("MONGODB_URI") || errorMessage.includes("conectar") || errorMessage.includes("ENOTFOUND") || errorMessage.includes("querySrv")) {
      const detailedError = `MongoDB no está disponible. Verifica: 1) Que MONGODB_URI esté configurado en las variables de entorno, 2) Que el cluster de MongoDB Atlas esté activo (no pausado), 3) Que tu IP esté en la whitelist de MongoDB Atlas (o usa 0.0.0.0/0 para desarrollo), 4) Tu conexión a internet. Error: ${errorMessage}`;
      console.warn("⚠️", detailedError);
      throw new Error(detailedError);
    }
    
    throw error;
  }
}

// Projects
export type Project = {
  id: string;
  slug: string;
  name: string;
  type: "residencial" | "comercial" | "industrial";
  city: string;
  description: string;
  status: "publicado" | "borrador";
  year?: number;
  imageUrl?: string;
};

export async function getProjects(): Promise<Project[]> {
  try {
    const db = await getDb();
    const collection = db.collection("projects");
    
    const projects = await collection.find({}).toArray();
    
    return projects.map((p: any) => {
      const { _id, ...projectData } = p;
      return {
        ...projectData,
        id: _id.toString(),
      } as Project;
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn("⚠️ MongoDB no disponible, retornando array vacío de proyectos:", errorMessage);
    return [];
  }
}

export async function saveProjects(projects: Project[]): Promise<void> {
  try {
    console.log(`💾 Iniciando guardado de ${projects.length} proyecto(s) en MongoDB...`);
    const db = await getDb();
    const collection = db.collection("projects");
    
    const mongoProjects = projects.map((p: Project) => {
      const { id, ...projectData } = p;
      return {
        _id: id,
        ...projectData,
      };
    });
    
    console.log("💾 Eliminando proyectos existentes...");
    const deleteResult = await collection.deleteMany({});
    console.log(`💾 Proyectos eliminados: ${deleteResult.deletedCount}`);
    
    if (mongoProjects.length > 0) {
      console.log("💾 Insertando nuevos proyectos...");
      await collection.insertMany(mongoProjects);
    }
    console.log(`✅ ${projects.length} proyecto(s) guardado(s) en MongoDB correctamente`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error al guardar proyectos en MongoDB:", errorMessage);
    console.error("❌ Stack trace:", error instanceof Error ? error.stack : "No disponible");
    
    if (errorMessage.includes("MONGODB_URI") || errorMessage.includes("conectar") || errorMessage.includes("ENOTFOUND") || errorMessage.includes("querySrv")) {
      const detailedError = `MongoDB no está disponible. Verifica: 1) Que MONGODB_URI esté configurado en las variables de entorno, 2) Que el cluster de MongoDB Atlas esté activo (no pausado), 3) Que tu IP esté en la whitelist de MongoDB Atlas (o usa 0.0.0.0/0 para desarrollo), 4) Tu conexión a internet. Error: ${errorMessage}`;
      console.warn("⚠️", detailedError);
      throw new Error(detailedError);
    }
    
    throw error;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const projects = await getProjects();
    return projects.find((p) => p.slug === slug && p.status === "publicado") || null;
  } catch (error) {
    console.error("Error al obtener proyecto por slug:", error);
    return null;
  }
}

export async function getPublishedProjects(): Promise<Project[]> {
  try {
    const projects = await getProjects();
    return projects.filter((p) => p.status === "publicado");
  } catch (error) {
    console.error("Error al obtener proyectos publicados:", error);
    return [];
  }
}

// Services (Especialidades)
export type Service = {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  benefits: string[];
  idealClient: string;
  icon: string;
  imageUrl?: string;
  category?: string;
};

export async function getServices(): Promise<Service[]> {
  try {
    const db = await getDb();
    const collection = db.collection("services");
    
    const services = await collection.find({}).toArray();
    
    return services.map((s: any) => {
      const { _id, ...serviceData } = s;
      return {
        ...serviceData,
        id: _id.toString(),
        category: serviceData.category || undefined,
      } as Service;
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn("⚠️ MongoDB no disponible, usando servicios por defecto:", errorMessage);
    // Retornar servicios por defecto desde default-services.ts
    const { defaultServices } = await import("@/lib/default-services");
    return defaultServices;
  }
}

export async function saveServices(services: Service[]): Promise<void> {
  try {
    console.log(`💾 Iniciando guardado de ${services.length} servicio(s) en MongoDB...`);
    const db = await getDb();
    const collection = db.collection("services");
    
    const mongoServices = services.map((s: Service) => {
      const { id, ...serviceData } = s;
      return {
        _id: id,
        ...serviceData,
      };
    });
    
    console.log("💾 Eliminando servicios existentes...");
    const deleteResult = await collection.deleteMany({});
    console.log(`💾 Servicios eliminados: ${deleteResult.deletedCount}`);
    
    if (mongoServices.length > 0) {
      console.log("💾 Insertando nuevos servicios...");
      await collection.insertMany(mongoServices);
    }
    console.log(`✅ ${services.length} servicio(s) guardado(s) en MongoDB correctamente`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error al guardar servicios en MongoDB:", errorMessage);
    console.error("❌ Stack trace:", error instanceof Error ? error.stack : "No disponible");
    
    if (errorMessage.includes("MONGODB_URI") || errorMessage.includes("conectar") || errorMessage.includes("ENOTFOUND") || errorMessage.includes("querySrv")) {
      const detailedError = `MongoDB no está disponible. Verifica: 1) Que MONGODB_URI esté configurado en las variables de entorno, 2) Que el cluster de MongoDB Atlas esté activo (no pausado), 3) Que tu IP esté en la whitelist de MongoDB Atlas (o usa 0.0.0.0/0 para desarrollo), 4) Tu conexión a internet. Error: ${errorMessage}`;
      console.warn("⚠️", detailedError);
      throw new Error(detailedError);
    }
    
    throw error;
  }
}

export async function getServiceById(id: string): Promise<Service | null> {
  try {
    const services = await getServices();
    return services.find((s) => s.id === id) || null;
  } catch (error) {
    console.error("Error al obtener servicio por id:", error);
    return null;
  }
}

