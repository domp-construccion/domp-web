"use client";

import Image from "next/image";
import { useState } from "react";

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  fallback?: React.ReactNode;
}

export default function SafeImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  fallback,
}: SafeImageProps) {
  const [error, setError] = useState(false);

  // Normalizar la ruta
  const getImageSrc = () => {
    if (!src) return null;
    
    // Limpiar espacios en blanco
    const cleanSrc = src.trim();
    
    // Si ya empieza con / o http, usarla tal cual
    if (cleanSrc.startsWith('/') || cleanSrc.startsWith('http')) {
      return cleanSrc;
    }
    
    // Si no, agregar / al inicio
    return `/${cleanSrc}`;
  };

  const imageSrc = getImageSrc();
  const isLocalImage = imageSrc && !imageSrc.startsWith('http');

  if (!imageSrc || error) {
    return (
      <div className={fill ? "absolute inset-0" : ""} style={!fill ? { width, height } : undefined}>
        {fallback || (
          <div className="bg-gray-200 flex items-center justify-center w-full h-full">
            <span className="text-4xl">📷</span>
          </div>
        )}
      </div>
    );
  }

  const imageProps = fill
    ? { fill: true, className }
    : { width: width || 400, height: height || 300, className };

  return (
    <Image
      src={imageSrc}
      alt={alt}
      {...imageProps}
      onError={(e) => {
        console.error("Error cargando imagen:", imageSrc, e);
        setError(true);
      }}
      unoptimized={isLocalImage || imageSrc.startsWith('http')}
      priority={false}
    />
  );
}

