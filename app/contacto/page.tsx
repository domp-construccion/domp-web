import { Metadata } from "next";
import SectionTitle from "@/components/SectionTitle";
import ContactInfo from "@/components/ContactInfo";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contacto | DomP Construcción",
  description:
    "Contáctanos para cotizar tu proyecto de construcción. Estamos en Chihuahua, México.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ContactoPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Contacto"
          subtitle="Estamos listos para hacer realidad tu proyecto"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Formulario */}
          <ContactForm />

          {/* Información de contacto */}
          <ContactInfo />
        </div>
      </div>
    </div>
  );
}

