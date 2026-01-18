import Link from "next/link";
import { getSettings } from "@/lib/admin-storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PoliticasPage() {
  let settings;
  try {
    settings = await getSettings();
  } catch (error) {
    settings = {
      emails: ["domp@contruccion.mx"],
      city: "Chihuahua, Chihuahua",
    };
  }

  const email = settings.emails?.[0] || "domp@contruccion.mx";
  const city = settings.city || "Chihuahua, Chihuahua";

  return (
    <div className="min-h-screen bg-background-light py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <div className="mb-8">
            <Link
              href="/"
              className="text-accent hover:text-accent-hover font-medium mb-4 inline-block"
            >
              ← Volver al inicio
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Políticas y Privacidad
            </h1>
            <p className="text-gray-600">
              Última actualización: {new Date().toLocaleDateString("es-MX", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-12">
            {/* Política de Privacidad */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                1. Política de Privacidad
              </h2>

              {settings.politicas?.privacidad ? (
                <div 
                  className="space-y-4 text-gray-700"
                  dangerouslySetInnerHTML={{ __html: settings.politicas.privacidad }}
                />
              ) : (
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                    1.1. Información que Recopilamos
                  </h3>
                  <p>
                    DomP se compromete a proteger su privacidad. Recopilamos
                    información que usted nos proporciona directamente cuando:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                    <li>Solicita una cotización a través de nuestro formulario</li>
                    <li>Se pone en contacto con nosotros por correo electrónico o teléfono</li>
                    <li>Navega por nuestro sitio web (información técnica como dirección IP, tipo de navegador, etc.)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                    1.2. Uso de la Información
                  </h3>
                  <p>Utilizamos la información recopilada para:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                    <li>Responder a sus consultas y solicitudes de cotización</li>
                    <li>Proporcionarle información sobre nuestros servicios</li>
                    <li>Mejorar nuestro sitio web y servicios</li>
                    <li>Cumplir con obligaciones legales y regulatorias</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                    1.3. Protección de Datos
                  </h3>
                  <p>
                    Implementamos medidas de seguridad técnicas y organizativas
                    apropiadas para proteger sus datos personales contra acceso
                    no autorizado, alteración, divulgación o destrucción.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                    1.4. Compartir Información
                  </h3>
                  <p>
                    No vendemos, alquilamos ni compartimos su información personal
                    con terceros, excepto cuando sea necesario para cumplir con
                    la ley o cuando usted haya dado su consentimiento explícito.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                    1.5. Sus Derechos
                  </h3>
                  <p>Usted tiene derecho a:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                    <li>Acceder a sus datos personales que tenemos en nuestros registros</li>
                    <li>Solicitar la corrección de datos inexactos</li>
                    <li>Solicitar la eliminación de sus datos personales</li>
                    <li>Oponerse al procesamiento de sus datos personales</li>
                  </ul>
                  <p className="mt-3">
                    Para ejercer estos derechos, puede contactarnos en:{" "}
                    <a
                      href={`mailto:${email}`}
                      className="text-accent hover:text-accent-hover underline"
                    >
                      {email}
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                    1.6. Cookies
                  </h3>
                  <p>
                    Nuestro sitio web puede utilizar cookies para mejorar su
                    experiencia de navegación. Puede configurar su navegador
                    para rechazar cookies, aunque esto puede afectar algunas
                    funcionalidades del sitio.
                  </p>
                </div>
              </div>
              )}
            </section>

            {/* Términos y Condiciones */}
            <section className="border-t border-gray-200 pt-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                2. Términos y Condiciones de Uso
              </h2>

              {settings.politicas?.terminos ? (
                <div 
                  className="space-y-4 text-gray-700"
                  dangerouslySetInnerHTML={{ __html: settings.politicas.terminos }}
                />
              ) : (
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                    2.1. Aceptación de los Términos
                  </h3>
                  <p>
                    Al acceder y utilizar el sitio web de DomP, usted acepta
                    cumplir con estos términos y condiciones. Si no está de
                    acuerdo con alguno de estos términos, le pedimos que no
                    utilice nuestro sitio web.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                    2.2. Uso del Sitio Web
                  </h3>
                  <p>Usted se compromete a utilizar nuestro sitio web de manera apropiada y legal. Está prohibido:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                    <li>Usar el sitio para fines ilegales o no autorizados</li>
                    <li>Intentar acceder a áreas restringidas del sitio</li>
                    <li>Transmitir virus o código malicioso</li>
                    <li>Copiar, reproducir o distribuir contenido sin autorización</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                    2.3. Propiedad Intelectual
                  </h3>
                  <p>
                    Todo el contenido del sitio web, incluyendo textos, imágenes,
                    logotipos, gráficos y software, es propiedad de DomP y está
                    protegido por leyes de propiedad intelectual. No está
                    permitida la reproducción sin autorización previa por escrito.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                    2.4. Información del Sitio
                  </h3>
                  <p>
                    Nos esforzamos por mantener la información del sitio web
                    actualizada y precisa, pero no garantizamos la exactitud,
                    integridad o actualidad de toda la información. Los precios,
                    especificaciones y disponibilidad están sujetos a cambios
                    sin previo aviso.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                    2.5. Enlaces a Terceros
                  </h3>
                  <p>
                    Nuestro sitio web puede contener enlaces a sitios web de
                    terceros. No somos responsables del contenido, políticas de
                    privacidad o prácticas de estos sitios externos.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                    2.6. Limitación de Responsabilidad
                  </h3>
                  <p>
                    DomP no se hace responsable de daños directos, indirectos,
                    incidentales o consecuentes que puedan surgir del uso o
                    imposibilidad de usar nuestro sitio web, incluyendo pero no
                    limitado a pérdida de datos o interrupciones en el servicio.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                    2.7. Modificaciones
                  </h3>
                  <p>
                    Nos reservamos el derecho de modificar estos términos y
                    condiciones en cualquier momento. Los cambios entrarán en
                    vigor al ser publicados en esta página. Le recomendamos
                    revisar periódicamente esta sección.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                    2.8. Ley Aplicable
                  </h3>
                  <p>
                    Estos términos y condiciones se rigen por las leyes de
                    México. Cualquier disputa relacionada con estos términos
                    será resuelta en los tribunales competentes de {city}.
                  </p>
                </div>
              </div>
              )}
            </section>

            {/* Contacto */}
            <section className="border-t border-gray-200 pt-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                3. Contacto
              </h2>
              <p className="text-gray-700 mb-4">
                Si tiene preguntas sobre estas políticas de privacidad o términos
                y condiciones, puede contactarnos:
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700">
                  <strong>Email:</strong>{" "}
                  <a
                    href={`mailto:${email}`}
                    className="text-accent hover:text-accent-hover underline"
                  >
                    {email}
                  </a>
                </p>
                {settings.phones && settings.phones.length > 0 && (
                  <p className="text-gray-700 mt-2">
                    <strong>Teléfono:</strong>{" "}
                    {settings.phones.map((phone, index) => (
                      <span key={index}>
                        {index > 0 && " / "}
                        <a
                          href={`tel:${phone.replace(/\s/g, "")}`}
                          className="text-accent hover:text-accent-hover underline"
                        >
                          {phone}
                        </a>
                      </span>
                    ))}
                  </p>
                )}
                {settings.city && (
                  <p className="text-gray-700 mt-2">
                    <strong>Ciudad:</strong> {settings.city}
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

