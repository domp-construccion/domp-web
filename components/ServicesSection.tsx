import SectionTitle from "./SectionTitle";
import ServiceCard from "./ServiceCard";
import { services } from "@/lib/data";
import Link from "next/link";

export default function ServicesSection() {
  return (
    <section className="py-16 bg-background-light">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Nuestros Servicios"
          subtitle="Soluciones integrales en construcción para todos tus proyectos"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {services.slice(0, 6).map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/servicios"
            className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors"
          >
            Ver Todos los Servicios
          </Link>
        </div>
      </div>
    </section>
  );
}

