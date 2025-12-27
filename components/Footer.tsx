import Link from "next/link";
import Image from "next/image";
import { getSettings } from "@/lib/admin-storage";
import SocialButtons from "@/components/SocialButtons";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  
  let settings;
  try {
    settings = await getSettings();
    console.log("📖 Settings cargados en Footer:", JSON.stringify(settings.emails, null, 2));
  } catch (error) {
    console.error("❌ Error al cargar settings en Footer:", error);
    // Valores por defecto si falla
    settings = {
      phones: ["614 2156600"],
      emails: ["domp@contruccion.mx"],
      serviceAreas: ["Chihuahua y alrededores"],
      address: "",
      city: "",
    };
  }
  
  const serviceAreas = settings.serviceAreas?.join(", ") || "Chihuahua y alrededores";

  return (
    <footer className="bg-[#171719] text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info with Logo */}
          <div>
            <div className="mb-4">
              <Image
                src="/images/logo-abajo.jpg"
                alt="DomP Logo"
                width={300}
                height={150}
                className="h-auto w-auto max-w-full"
              />
            </div>
            <p className="text-gray-400 mb-4">
              Empresa líder en construcción en México. Especialistas en
              construcción residencial, comercial e industrial.
            </p>
            <div className="space-y-2 text-gray-400">
              {settings.phones && settings.phones.length > 0 && (
                <p>
                  <strong className="text-white">Teléfono:</strong>{" "}
                  {settings.phones.map((phone, index) => (
                    <span key={index}>
                      {index > 0 && " / "}
                      <a
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="hover:text-accent transition-colors"
                      >
                        {phone}
                      </a>
                    </span>
                  ))}
                </p>
              )}
              {settings.emails && settings.emails.length > 0 && (
                <p>
                  <strong className="text-white">Email:</strong>{" "}
                  {settings.emails.map((email, index) => (
                    <span key={index}>
                      {index > 0 && " / "}
                      <a
                        href={`mailto:${email}`}
                        className="hover:text-accent transition-colors"
                      >
                        {email}
                      </a>
                    </span>
                  ))}
                </p>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/especialidades"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  Especialidades
                </Link>
              </li>
              <li>
                <Link
                  href="/proyectos"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  Proyectos
                </Link>
              </li>
              <li>
                <Link
                  href="/nosotros"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Información</h4>
            <div className="space-y-2 text-gray-400">
              {settings.address && (
                <>
                  <p>
                    <strong className="text-white">Dirección:</strong>
                  </p>
                  <p>{settings.address}</p>
                </>
              )}
              {settings.city && (
                <>
                  <p>
                    <strong className="text-white">Ciudad:</strong>
                  </p>
                  <p>{settings.city}</p>
                </>
              )}
              {settings.serviceAreas && settings.serviceAreas.length > 0 && (
                <>
                  <p className="mt-4">
                    <strong className="text-white">Zonas de trabajo:</strong>
                  </p>
                  <p>{serviceAreas}</p>
                </>
              )}
            </div>
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4">Síguenos</h4>
              <SocialButtons />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} DomP. Todos los derechos reservados.</p>
          <p className="mt-2">
            <Link
              href="/admin/login"
              className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
            >
              Panel de Administración
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

