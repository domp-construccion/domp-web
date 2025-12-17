import { Metadata } from "next";
import SectionTitle from "@/components/SectionTitle";
import { teamRoles, processSteps } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nosotros | DomP Construcción",
  description:
    "Conoce la historia, misión, visión y valores de DomP. Más de 15 años construyendo en México.",
};

export default function NosotrosPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Historia */}
        <section className="mb-16">
          <SectionTitle title="Nuestra Historia" />
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                DomP nació en 2008 con la visión de ser una empresa de
                construcción que prioriza la calidad, el compromiso y la
                satisfacción del cliente. Desde nuestros inicios en Chihuahua,
                hemos crecido hasta convertirnos en una empresa reconocida por
                la excelencia en la ejecución de proyectos residenciales,
                comerciales e industriales.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                A lo largo de más de 15 años, hemos completado cientos de
                proyectos, siempre manteniendo nuestros estándares de calidad y
                cumplimiento de tiempos. Nuestro equipo está formado por
                profesionales altamente capacitados que comparten nuestra
                pasión por la construcción y el servicio al cliente.
              </p>
            </div>
          </div>
        </section>

        {/* Misión, Visión, Valores */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Misión
              </h3>
              <p className="text-gray-700">
                Construir proyectos de alta calidad que superen las expectativas
                de nuestros clientes, utilizando materiales de primera y
                cumpliendo con los más altos estándares de seguridad y
                normatividad, siempre con profesionalismo y compromiso.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Visión
              </h3>
              <p className="text-gray-700">
                Ser la empresa de construcción líder en la región, reconocida por
                nuestra excelencia, innovación y compromiso con la satisfacción
                del cliente, contribuyendo al desarrollo urbano y al crecimiento
                de nuestras comunidades.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Valores
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-accent mr-2">✓</span>
                  Calidad en cada proyecto
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">✓</span>
                  Integridad y transparencia
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">✓</span>
                  Compromiso con tiempos
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">✓</span>
                  Trabajo en equipo
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">✓</span>
                  Responsabilidad social
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Proceso */}
        <section className="mb-16">
          <SectionTitle
            title="Nuestro Proceso"
            subtitle="Un método probado para garantizar el éxito de tu proyecto"
          />
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {processSteps.map((step) => (
                <div
                  key={step.step}
                  className="bg-white rounded-lg shadow-md p-6 flex gap-6"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center text-xl font-bold">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-700">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Equipo */}
        <section>
          <SectionTitle
            title="Nuestro Equipo"
            subtitle="Profesionales comprometidos con la excelencia"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamRoles.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 text-center"
              >
                <div className="w-24 h-24 bg-background-light rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                  👤
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {member.role}
                </h3>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

