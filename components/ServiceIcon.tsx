interface ServiceIconProps {
  serviceId: string;
  className?: string;
  size?: number;
}

// Mapeo de IDs de servicios a IDs de símbolos SVG
const iconMap: Record<string, string> = {
  "vivienda-residencial": "vivienda",
  "locales-bodegas": "bodega",
  "ampliaciones-segundas-plantas": "ampliacion",
  "obra-negra-estructura": "estructura",
  "remodelacion-integral": "remodelacion",
  "cocinas-banos": "cocina-bano",
  "reconfiguracion-espacios": "reconfiguracion",
  "renovacion-fachadas": "fachada",
  "pisos-recubrimientos": "pisos",
  "yeso-tablaroca-plafones": "plafones",
  "pintura-profesional": "pintura",
  "carpinteria-cancelería": "carpinteria",
  "electrica": "electricidad",
  "hidraulica-sanitaria": "hidraulica",
  "gas": "gas",
  "iluminacion-arquitectonica": "iluminacion",
  "bardas-accesos": "bardas",
  "terrazas-cocheras": "cochera",
  "impermeabilizacion": "impermeabilizacion",
  "drenaje-pluvial": "drenaje",
  "presupuestos-costos": "costos",
  "supervision": "supervision",
  "obra-llave-mano": "llave",
};

export default function ServiceIcon({ serviceId, className = "", size = 48 }: ServiceIconProps) {
  const iconId = iconMap[serviceId] || "vivienda"; // fallback a vivienda si no se encuentra
  
  return (
    <svg
      width={size}
      height={size}
      className={className}
      style={{ color: "currentColor" }}
      fill="none"
    >
      <use href={`/icons/domp-icons.svg#${iconId}`} />
    </svg>
  );
}

