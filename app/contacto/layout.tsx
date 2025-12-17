import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto | DomP Construcción",
  description:
    "Contáctanos para cotizar tu proyecto de construcción. Estamos en Chihuahua, México. Teléfono: 614 2156600",
};

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

