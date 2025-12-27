import { getSettings } from "@/lib/admin-storage";
import SocialButtonsWrapper from "@/components/SocialButtonsWrapper";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ContactInfo() {
  let settings;
  try {
    settings = await getSettings();
  } catch (error) {
    console.warn("Error al cargar settings en ContactInfo:", error);
    // Valores por defecto si falla
    settings = {
      phones: ["614 2156600"],
      emails: ["domp@contruccion.mx"],
      serviceAreas: ["Chihuahua y alrededores"],
      whatsapp: "",
    };
  }
  
  const phones = settings.phones || [];
  const emails = settings.emails || [];
  const serviceAreas = settings.serviceAreas || [];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Información de contacto
        </h2>
        <div className="space-y-4">
          {phones.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Teléfono</h3>
              <div className="space-y-1">
                {phones.map((phone, index) => (
                  <a
                    key={index}
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="text-accent hover:text-accent-hover block"
                  >
                    {phone}
                  </a>
                ))}
              </div>
            </div>
          )}
          {emails.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <div className="space-y-1">
                {emails.map((email, index) => (
                  <a
                    key={index}
                    href={`mailto:${email}`}
                    className="text-accent hover:text-accent-hover block"
                  >
                    {email}
                  </a>
                ))}
              </div>
            </div>
          )}
          {settings.whatsapp && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">WhatsApp</h3>
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/\s/g, "").replace(/\+/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover"
              >
                {settings.whatsapp}
              </a>
            </div>
          )}
        </div>
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Síguenos en redes sociales</h3>
          <SocialButtonsWrapper />
        </div>
      </div>

      {serviceAreas.length > 0 && (
        <div className="bg-background-light rounded-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Zonas de trabajo
          </h3>
          <p className="text-gray-700 mb-4">
            DomP opera principalmente en {serviceAreas.join(", ")}, cubriendo
            proyectos en toda la región. Estamos abiertos a evaluar
            proyectos en otras zonas de México.
          </p>
          <p className="text-gray-700">
            Para proyectos fuera de nuestra zona habitual, contáctanos para
            evaluar la viabilidad y coordinar la ejecución.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Horario de atención
        </h3>
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Lunes a Viernes:</strong> 9:00 AM - 6:00 PM
          </p>
          <p>
            <strong>Sábados:</strong> 9:00 AM - 2:00 PM
          </p>
          <p>
            <strong>Domingos:</strong> Cerrado
          </p>
        </div>
      </div>
    </div>
  );
}

