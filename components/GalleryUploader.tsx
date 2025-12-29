"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

interface GalleryUploaderProps {
  onUploadSuccess: (url: string) => void;
  currentImages: string[];
  onRemoveImage: (index: number) => void;
}

export default function GalleryUploader({
  onUploadSuccess,
  currentImages,
  onRemoveImage,
}: GalleryUploaderProps) {
  const [uploading, setUploading] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Galería de Imágenes (mínimo 5 recomendado)
      </label>

      {currentImages.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          {currentImages.map((url, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-300">
                <Image
                  src={url}
                  alt={`Galería ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
          folder: "domp/especialidades/galeria",
          maxFiles: 10,
          sources: ["local", "camera"],
          multiple: true,
          resourceType: "image",
          clientAllowedFormats: ["jpg", "png", "webp", "jpeg"],
        }}
        onUpload={(result: any) => {
          console.log("📤 Cloudinary gallery upload event:", result?.event, result);
          
          if (result?.event === "success") {
            const url = result.info?.secure_url || result.info?.url;
            if (url) {
              console.log("✅ Imagen de galería subida exitosamente:", url);
              console.log("📝 Llamando onUploadSuccess con URL:", url);
              onUploadSuccess(url);
              setUploading(false);
            } else {
              console.error("❌ No se recibió URL de la imagen. Result:", result);
            }
          } else if (result?.event === "error") {
            console.error("❌ Error al subir imagen:", result);
            setUploading(false);
          } else if (result?.event === "queues-end") {
            setUploading(false);
          } else if (result?.event === "show-complete") {
            setUploading(false);
          }
        }}
        onOpen={() => {
          console.log("📂 Abriendo widget de Cloudinary para galería...");
          setUploading(true);
        }}
      >
        {({ open }) => {
          return (
            <button
              type="button"
              onClick={() => open()}
              disabled={uploading}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Subiendo..." : "+ Agregar Imagen a Galería"}
            </button>
          );
        }}
      </CldUploadWidget>

      <p className="text-xs text-gray-500 mt-1">
        Haz clic para agregar imágenes a la galería
      </p>
    </div>
  );
}

