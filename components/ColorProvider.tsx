"use client";

import { useEffect, useState } from "react";

export default function ColorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [colorsLoaded, setColorsLoaded] = useState(false);

  useEffect(() => {
    const applyColors = async () => {
      try {
        const response = await fetch("/api/settings");
        const result = await response.json();

        if (result.ok && result.data?.colors) {
          const colors = result.data.colors;
          const root = document.documentElement;

          root.style.setProperty("--color-primary", colors.primary);
          root.style.setProperty("--color-accent", colors.accent);
          root.style.setProperty(
            "--color-accent-hover",
            colors.accentHover
          );
          root.style.setProperty(
            "--color-background-light",
            colors.backgroundLight
          );
          root.style.setProperty("--color-text-dark", colors.textDark);
        }
      } catch (error) {
        console.warn("Error al cargar colores:", error);
      } finally {
        setColorsLoaded(true);
      }
    };

    applyColors();
  }, []);

  return <>{children}</>;
}

