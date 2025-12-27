import SectionTitle from "./SectionTitle";
import ServiceCard from "./ServiceCard";
import { getServices } from "@/lib/admin-storage";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ServicesSection() {
  const services = await getServices();

  return (
    <section className="py-16 bg-background-light">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Nuestras Especialidades"
          subtitle="Soluciones integrales en construcción para todos tus proyectos"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {services.slice(0, 6).map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/especialidades"
            className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors"
          >
            Ver Todas las Especialidades
          </Link>
        </div>
      </div>
    </section>
  );
}

