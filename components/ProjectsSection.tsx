import SectionTitle from "./SectionTitle";
import ProjectCard from "./ProjectCard";
import { getPublishedProjects } from "@/lib/admin-storage";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectsSection() {
  const projects = await getPublishedProjects();
  const featuredProjects = projects.slice(0, 6);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Proyectos Destacados"
          subtitle="Conoce algunos de nuestros proyectos más recientes"
        />
        {featuredProjects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              No hay proyectos disponibles en este momento.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} showDetail />
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/proyectos"
                className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors"
              >
                Ver Todos los Proyectos
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

