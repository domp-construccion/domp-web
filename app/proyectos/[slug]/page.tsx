import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProjectBySlug } from "@/lib/admin-storage";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Proyecto no encontrado | DomP",
    };
  }

  return {
    title: `${project.name} | DomP Construcción`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

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

  return (
    <div className="py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/proyectos"
          className="text-accent hover:text-accent-hover mb-6 inline-block"
        >
          ← Volver a Proyectos
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {project.imageUrl ? (
            <div className="relative h-64 w-full">
              <Image
                src={project.imageUrl}
                alt={project.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-64 bg-primary flex items-center justify-center">
              <span className="text-8xl">🏗️</span>
            </div>
          )}

          <div className="p-8">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-sm font-semibold text-accent uppercase bg-background-light px-3 py-1 rounded">
                {typeLabels[project.type]}
              </span>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${statusColors[project.status]}`}
              >
                {statusLabels[project.status]}
              </span>
              {project.year && (
                <span className="text-sm text-gray-600">Año: {project.year}</span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {project.name}
            </h1>

            <div className="flex items-center text-gray-600 mb-6">
              <span className="mr-2">📍</span>
              {project.city}
            </div>

            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {project.description}
              </p>

              {/* Aquí se podría agregar más información del proyecto si se tiene
              desde un CMS o base de datos:
              - Galería de imágenes
              - Especificaciones técnicas
              - Fechas de inicio y fin
              - Metros cuadrados
              - Etc.
              */}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link
                href="/contacto"
                className="inline-block bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors"
              >
                Solicitar Proyecto Similar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

