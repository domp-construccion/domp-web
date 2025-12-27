import { Metadata } from "next";
import { getServices, type Service } from "@/lib/admin-storage";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const services = await getServices();
    const service = services.find((s) => s.id === id);
    
    if (!service) {
      return {
        title: "Especialidad no encontrada | DomP Construcción",
      };
    }

    return {
      title: `${service.title} | DomP Construcción`,
      description: service.description,
    };
  } catch (error) {
    return {
      title: "Especialidad | DomP Construcción",
    };
  }
}

export default async function EspecialidadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let services: Service[] = [];
  
  try {
    services = await getServices();
  } catch (error) {
    console.error("Error al cargar servicios:", error);
  }
  
  // Si no hay servicios, intentar cargar por defecto directamente
  if (services.length === 0) {
    try {
      const { defaultServices } = await import("@/lib/default-services");
      services = defaultServices;
    } catch (error) {
      console.error("Error al importar servicios por defecto:", error);
    }
  }
  
  const service = services.find((s) => s.id === id);

  if (!service) {
    console.error(`Servicio no encontrado: ${id}. Servicios disponibles:`, services.map(s => s.id));
    notFound();
  }

  const detailedDescription = service.detailedDescription || service.description;

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-accent">Inicio</Link>
          <span className="mx-2">/</span>
          <Link href="/especialidades" className="hover:text-accent">
            Especialidades
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{service.title}</span>
        </nav>

        {/* Main Content - Layout: Image Left, Text Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Side - Image */}
          <div className="order-2 lg:order-1">
            {service.imageUrl ? (
              <SafeImage
                src={service.imageUrl}
                alt={service.title}
                width={800}
                height={600}
                className="w-full h-auto rounded-lg shadow-lg object-cover"
              />
            ) : (
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-primary to-accent rounded-lg shadow-lg flex items-center justify-center">
                <div className="text-6xl lg:text-9xl opacity-50 text-white">📋</div>
              </div>
            )}
          </div>

          {/* Right Side - Text Content */}
          <div className="order-1 lg:order-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {service.title}
            </h1>

            {/* Three dots separator */}
            <div className="flex gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              <div className="w-2 h-2 rounded-full bg-accent"></div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                {detailedDescription}
              </p>
            </div>

            {/* Benefits */}
            {service.benefits && service.benefits.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Beneficios:
                </h2>
                <ul className="space-y-3">
                  {service.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <span className="text-accent mr-3 mt-1 text-xl">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ideal Client */}
            {service.idealClient && (
              <div className="mb-8 bg-background-light rounded-lg p-4">
                <p className="text-gray-700">
                  <strong className="text-primary">Cliente ideal:</strong>{" "}
                  {service.idealClient}
                </p>
              </div>
            )}

            {/* Call to Action Button */}
            <div className="mt-8">
              <Link
                href="/contacto"
                className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors text-lg"
              >
                → Cotiza Ahora
              </Link>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12">
          <Link
            href="/especialidades"
            className="inline-flex items-center text-gray-600 hover:text-accent transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Volver a Especialidades
          </Link>
        </div>
      </div>
    </div>
  );
}

