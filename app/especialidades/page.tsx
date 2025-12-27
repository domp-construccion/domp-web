import { Metadata } from "next";
import SectionTitle from "@/components/SectionTitle";
import { getServices, type Service } from "@/lib/admin-storage";
import Link from "next/link";
import ServiceIcon from "@/components/ServiceIcon";

export const metadata: Metadata = {
  title: "Especialidades | DomP Construcción",
  description:
    "Conoce todas nuestras especialidades de construcción: residencial, comercial, industrial, remodelaciones, dirección de obra y consultoría.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EspecialidadesPage() {
  let services: Service[] = [];
  try {
    services = await getServices();
  } catch (error) {
    console.error("Error al cargar servicios:", error);
  }

  // Si no hay servicios, intentar cargar por defecto
  if (!services || services.length === 0) {
    try {
      const { defaultServices } = await import("@/lib/default-services");
      services = defaultServices;
    } catch (error) {
      console.error("Error al importar servicios por defecto:", error);
    }
  }

  // Si aún no hay servicios, mostrar mensaje
  if (!services || services.length === 0) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="Nuestras Especialidades"
            subtitle="Soluciones integrales en construcción para todos tus proyectos"
          />
          <div className="text-center py-12">
            <p className="text-gray-600">No hay especialidades disponibles en este momento.</p>
          </div>
        </div>
      </div>
    );
  }

  // Agrupar servicios por categoría
  const servicesByCategory = services.reduce((acc, service) => {
    const category = service.category || "Otros";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, typeof services>);

  const categories = Object.keys(servicesByCategory);

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Nuestras Especialidades"
          subtitle="Soluciones integrales en construcción para todos tus proyectos"
        />

        <div className="space-y-16 mt-12">
          {categories.map((category) => (
            <div key={category} className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-accent pb-2">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servicesByCategory[category].map((service) => (
                  <Link
                    key={service.id}
                    href={`/especialidades/${service.id}`}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
                  >
                    <div className="flex justify-center mb-4">
                      <ServiceIcon name={service.id} size={48} className="text-gray-900" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {service.description}
                    </p>
                    <div className="mt-4 text-center">
                      <span className="inline-block bg-accent text-white px-6 py-2 rounded-lg font-semibold hover:bg-accent-hover transition-colors">
                        Ver más →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700 mb-6">
            ¿No encuentras la especialidad que necesitas?
          </p>
          <a
            href="/contacto"
            className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors"
          >
            Contáctanos para una solución personalizada
          </a>
        </div>
      </div>
    </div>
  );
}

