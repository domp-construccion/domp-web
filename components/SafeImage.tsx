"use client";

import Image from "next/image";
import { useState, useCallback } from "react";

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

  const handleImageError = useCallback(() => {
    console.error("Error cargando imagen:", src);
    setError(true);
  }, [src]);

  // Normalizar la ruta
  const getImageSrc = () => {
    if (!src) return null;
    
    // Limpiar espacios en blanco
    let cleanSrc = src.trim();
    
    // Remover /public/ si está presente (Next.js sirve public/ sin ese prefijo)
    if (cleanSrc.startsWith('/public/')) {
      cleanSrc = cleanSrc.replace('/public', '');
    } else if (cleanSrc.startsWith('public/')) {
      cleanSrc = '/' + cleanSrc.replace('public/', '');
    }
    
    // Si ya empieza con / o http, usarla tal cual
    if (cleanSrc.startsWith('/') || cleanSrc.startsWith('http')) {
      return cleanSrc;
    }
    
    // Si no, agregar / al inicio
    return `/${cleanSrc}`;
  };

  const imageSrc = getImageSrc();
  const isLocalImage = imageSrc && !imageSrc.startsWith('http');

  // Debug logging
  if (fill && imageSrc) {
    console.log("🖼️ SafeImage render:", { src, imageSrc, isLocalImage, fill, className });
  }

  if (!imageSrc || error) {
    if (fill) {
      console.warn("⚠️ SafeImage: No imageSrc o error", { src, imageSrc, error });
    }
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

  // Para imágenes locales, usar img normal para evitar problemas con Next.js Image
  if (isLocalImage) {
    // Determinar objectFit basado en className
    const hasObjectContain = className.includes('object-contain');
    const defaultObjectFit: 'contain' | 'cover' = hasObjectContain ? 'contain' : 'cover';
    
    if (fill) {
      return (
        <img
          src={imageSrc}
          alt={alt}
          className={className}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: defaultObjectFit,
          }}
          onError={handleImageError}
        />
      );
    }
    
    return (
      <div style={{ width: width || 400, height: height || 300 }}>
        <img
          src={imageSrc}
          alt={alt}
          className={className}
          style={{
            width: '100%',
            height: '100%',
            objectFit: defaultObjectFit,
          }}
          onError={handleImageError}
        />
      </div>
    );
  }

  // Para imágenes remotas, si usamos object-contain con fill, usar img directo
  const hasObjectContain = className.includes('object-contain');
  
  if (fill && hasObjectContain) {
    // Para object-contain con fill, usar img directo para mejor control
    return (
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
        onError={handleImageError}
      />
    );
  }

  // Para imágenes remotas normales, usar Next.js Image
  const imageProps = fill
    ? { fill: true, className }
    : { width: width || 400, height: height || 300, className };

  return (
    <Image
      src={imageSrc}
      alt={alt}
      {...imageProps}
      onError={handleImageError}
      unoptimized={true}
      priority={false}
    />
  );
}

