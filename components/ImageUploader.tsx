"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import ImageSelector from "./ImageSelector";

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  currentImageUrl?: string;
  label?: string;
  folder?: string;
}

export default function ImageUploader({
  onUploadSuccess,
  currentImageUrl,
  label = "Subir Imagen",
  folder = "domp",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [showSelector, setShowSelector] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {currentImageUrl && (
        <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden border border-gray-300">
          <Image
            src={currentImageUrl}
            alt="Preview"
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="flex gap-2">
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          options={{
            folder: folder,
            maxFiles: 1,
            sources: ["local", "camera"],
            multiple: false,
            resourceType: "image",
            clientAllowedFormats: ["jpg", "png", "webp", "jpeg"],
          }}
          onUpload={(result: any) => {
            console.log("📤 Cloudinary upload event:", result?.event, result);
            
            if (result?.event === "success") {
              const url = result.info?.secure_url || result.info?.url;
              if (url) {
                console.log("✅ Imagen subida exitosamente a Cloudinary:", url);
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
            console.log("📂 Abriendo widget de Cloudinary...");
            setUploading(true);
          }}
        >
          {({ open }) => {
            return (
              <button
                type="button"
                onClick={() => open()}
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "Subiendo..." : "Subir Nueva"}
              </button>
            );
          }}
        </CldUploadWidget>

        <button
          type="button"
          onClick={() => setShowSelector(true)}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Seleccionar Existente
        </button>
      </div>

      {showSelector && (
        <ImageSelector
          folder={folder}
          onSelect={(url) => {
            console.log("🖼️ Imagen seleccionada:", url);
            onUploadSuccess(url);
          }}
          onClose={() => setShowSelector(false)}
        />
      )}

      <p className="text-xs text-gray-500 mt-1">
        Sube una nueva imagen o selecciona una que ya tengas en Cloudinary
      </p>
    </div>
  );
}

