import { Metadata } from "next";
import SectionTitle from "@/components/SectionTitle";
import ProjectCard from "@/components/ProjectCard";
import { getPublishedProjects } from "@/lib/admin-storage";

export const metadata: Metadata = {
  title: "Proyectos | DomP Construcción",
  description:
    "Conoce nuestros proyectos de construcción: residenciales, comerciales e industriales en Chihuahua y alrededores.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProyectosPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Nuestros Proyectos"
          subtitle="Portafolio de obras realizadas y en proceso"
        />

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No hay proyectos disponibles en este momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} showDetail />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

