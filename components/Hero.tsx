import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative bg-white text-text-dark py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* Logo Principal */}
          <div className="mb-8 md:mb-10 flex justify-center">
            <Image
              src="/images/logo-principal.png"
              alt="DomP Logo Principal"
              width={1200}
              height={480}
              className="h-auto w-auto max-w-[90%] md:max-w-[700px] lg:max-w-[1000px] xl:max-w-[1200px]"
              priority
            />
          </div>

          <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-10 text-gray-700 px-4">
            Empresa líder en construcción en México. Transformamos tus ideas en
            realidad con calidad, profesionalismo y compromiso.
          </p>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link
              href="/contacto"
              className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors shadow-lg"
            >
              Cotizar Proyecto
            </Link>
            <Link
              href="/proyectos"
              className="bg-transparent border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Ver Proyectos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

