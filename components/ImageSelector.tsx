"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ImageSelectorProps {
  folder: string;
  onSelect: (url: string) => void;
  onClose: () => void;
}

interface CloudinaryImage {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  createdAt: string;
}

export default function ImageSelector({ folder, onSelect, onClose }: ImageSelectorProps) {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadImages();
  }, [folder]);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/cloudinary/images?folder=${encodeURIComponent(folder)}`);
      const result = await response.json();

      if (result.ok) {
        setImages(result.data || []);
      } else {
        setError(result.message || "Error al cargar imágenes");
      }
    } catch (err) {
      setError("Error al cargar imágenes");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Seleccionar Imagen de Cloudinary
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando imágenes...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4">
              <p>{error}</p>
              <button
                onClick={loadImages}
                className="mt-2 text-sm underline"
              >
                Intentar de nuevo
              </button>
            </div>
          )}

          {!loading && !error && images.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">
                No hay imágenes en la carpeta "{folder}"
              </p>
            </div>
          )}

          {!loading && !error && images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <button
                  key={image.publicId}
                  onClick={() => {
                    onSelect(image.url);
                    onClose();
                  }}
                  className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-accent transition-colors group"
                >
                  <Image
                    src={image.url}
                    alt={image.publicId}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-semibold">
                      Seleccionar
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

