import { Metadata } from "next";
import SectionTitle from "@/components/SectionTitle";
import { getSettings } from "@/lib/admin-storage";
import SafeImage from "@/components/SafeImage";

export const metadata: Metadata = {
  title: "Nosotros | DomP Construcción",
  description:
    "Conoce la historia, misión, visión y valores de DomP. Más de 15 años construyendo en México.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NosotrosPage() {
  const settings = await getSettings();
  const { nosotros } = settings;

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Historia */}
        <section className="mb-16">
          <SectionTitle title="Nuestra Historia" />
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {nosotros.historia}
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
              <p className="text-gray-700 whitespace-pre-line">
                {nosotros.mision}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Visión
              </h3>
              <p className="text-gray-700 whitespace-pre-line">
                {nosotros.vision}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Valores
              </h3>
              <ul className="space-y-2 text-gray-700">
                {nosotros.valores.map((valor, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-accent mr-2">✓</span>
                    {valor}
                  </li>
                ))}
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
              {nosotros.processSteps.map((step) => (
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
            {nosotros.teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 text-center"
              >
                <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                  <SafeImage
                    src={member.imageUrl}
                    alt={member.name || member.role}
                    fill
                    className="object-cover"
                    fallback={
                      <div className="w-24 h-24 bg-background-light rounded-full flex items-center justify-center text-4xl">
                        👤
                      </div>
                    }
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {member.role}
                </h3>
                {member.name && (
                  <p className="text-lg font-semibold text-accent mb-2">
                    {member.name}
                  </p>
                )}
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

