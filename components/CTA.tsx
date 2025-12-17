import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          ¿Listo para comenzar tu proyecto?
        </h2>
        <p className="text-xl mb-8 text-gray-200">
          Contáctanos y recibe una cotización gratuita para tu proyecto de
          construcción.
        </p>
        <Link
          href="/contacto"
          className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors shadow-lg"
        >
          Solicitar Cotización
        </Link>
      </div>
    </section>
  );
}

