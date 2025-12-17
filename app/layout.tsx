import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ColorProvider from "@/components/ColorProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DomP | Construcción en México",
  description:
    "DomP es una empresa líder en construcción en México. Especialistas en construcción residencial, comercial e industrial, remodelaciones y dirección de obra.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX">
      <body className={inter.className}>
        <ColorProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ColorProvider>
      </body>
    </html>
  );
}

