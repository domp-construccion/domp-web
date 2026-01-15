"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("/images/logo-secundario.png");
  const [headerBackground, setHeaderBackground] = useState("#F18121");
  const [headerText, setHeaderText] = useState("#FFFFFF");
  const [headerTextHover, setHeaderTextHover] = useState("#101932");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        const result = await response.json();
        console.log("🎨 Header - Settings cargados:", result.data?.logos);
        if (result.ok && result.data) {
          if (result.data.logos?.secundario) {
            console.log("🎨 Header - Actualizando logo a:", result.data.logos.secundario);
            setLogoUrl(result.data.logos.secundario);
          }
          if (result.data.colors?.headerBackground) {
            setHeaderBackground(result.data.colors.headerBackground);
          } else if (result.data.colors?.accent) {
            setHeaderBackground(result.data.colors.accent);
          }
          if (result.data.colors?.headerText) {
            setHeaderText(result.data.colors.headerText);
          }
          if (result.data.colors?.headerTextHover) {
            setHeaderTextHover(result.data.colors.headerTextHover);
          } else if (result.data.colors?.primary) {
            setHeaderTextHover(result.data.colors.primary);
          }
        }
      } catch (error) {
        console.warn("Error al cargar settings:", error);
      }
    };
    loadSettings();
  }, []);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/especialidades", label: "Especialidades" },
    { href: "/proyectos", label: "Proyectos" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "/contacto", label: "Contacto" },
  ];

  return (
    <header 
      className="sticky top-0 z-50 shadow-md"
      style={{ backgroundColor: headerBackground }}
    >
      <nav className="container mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between">
          {/* Logo Secundario */}
          <Link href="/" className="flex items-center">
            <Image
              src={logoUrl}
              alt="DomP Logo"
              width={120}
              height={60}
              className="h-auto w-auto max-w-[100px] md:max-w-[120px]"
              priority
              unoptimized={logoUrl.startsWith("http")}
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors font-medium"
                style={{ 
                  color: headerText,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = headerTextHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = headerText;
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            style={{ color: headerText }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2.5 pb-2.5">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors font-medium py-1"
                  style={{ 
                    color: headerText,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = headerTextHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = headerText;
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

