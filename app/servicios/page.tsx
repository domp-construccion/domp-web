import { Metadata } from "next";
import SectionTitle from "@/components/SectionTitle";
import { services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Servicios | DomP Construcción",
  description:
    "Conoce todos nuestros servicios de construcción: residencial, comercial, industrial, remodelaciones, dirección de obra y consultoría.",
};

export default function ServiciosPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Nuestros Servicios"
          subtitle="Soluciones integrales en construcción para todos tus proyectos"
        />

        <div className="space-y-12">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-md p-8 md:p-10"
            >
              <div className="flex items-start gap-6">
                <div className="text-5xl flex-shrink-0">{service.icon}</div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h2>
                  <p className="text-lg text-gray-700 mb-6">
                    {service.description}
                  </p>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Beneficios:
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {service.benefits.map((benefit, index) => (
                        <li
                          key={index}
                          className="flex items-start text-gray-700"
                        >
                          <span className="text-accent mr-2 mt-1">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-background-light rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      <strong className="text-primary">
                        Cliente ideal:
                      </strong>{" "}
                      {service.idealClient}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700 mb-6">
            ¿No encuentras el servicio que necesitas?
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

