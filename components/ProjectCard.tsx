import Link from "next/link";
import Image from "next/image";
import { Project } from "@/lib/admin-storage";

interface ProjectCardProps {
  project: Project;
  showDetail?: boolean;
}

export default function ProjectCard({
  project,
  showDetail = false,
}: ProjectCardProps) {
  const statusLabels = {
    publicado: "Publicado",
    borrador: "Borrador",
    terminado: "Terminado",
    en_proceso: "En proceso",
  };

  const statusColors = {
    publicado: "bg-green-100 text-green-800",
    borrador: "bg-gray-100 text-gray-800",
    terminado: "bg-green-100 text-green-800",
    en_proceso: "bg-blue-100 text-blue-800",
  };

  const typeLabels = {
    residencial: "Residencial",
    comercial: "Comercial",
    industrial: "Industrial",
  };

  const content = (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      {project.imageUrl ? (
        <div className="relative h-48 w-full">
          <Image
            src={project.imageUrl}
            alt={project.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="h-48 bg-primary flex items-center justify-center">
          <span className="text-6xl">🏗️</span>
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-accent uppercase">
            {typeLabels[project.type]}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[project.status]}`}
          >
            {statusLabels[project.status]}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{project.description}</p>
        <div className="flex items-center text-sm text-gray-500">
          <span className="mr-2">📍</span>
          {project.city}
          {project.year && (
            <>
              <span className="mx-2">•</span>
              {project.year}
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (showDetail) {
    return (
      <Link href={`/proyectos/${project.slug}`} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

