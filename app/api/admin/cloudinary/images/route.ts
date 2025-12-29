import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { v2 as cloudinary } from "cloudinary";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === "ok";
}

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { ok: false, message: "No autorizado" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder") || "domp";
    const maxResults = parseInt(searchParams.get("maxResults") || "50");

    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { 
          ok: false, 
          message: "Cloudinary no está configurado correctamente. Faltan credenciales en variables de entorno." 
        },
        { status: 500 },
      );
    }

    // Listar recursos de Cloudinary usando la API de administración
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: maxResults,
      sort_by: [{ created_at: 'desc' }],
    });

    // Extraer las URLs de las imágenes
    const images = ((result as any).resources || []).map((resource: any) => ({
      url: resource.secure_url,
      publicId: resource.public_id,
      format: resource.format,
      width: resource.width,
      height: resource.height,
      bytes: resource.bytes,
      createdAt: resource.created_at,
    }));

    return NextResponse.json({
      ok: true,
      data: images,
    });
  } catch (error) {
    console.error("❌ Error al obtener imágenes de Cloudinary:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        ok: false,
        message: `Error al obtener imágenes: ${errorMessage}`,
      },
      { status: 500 },
    );
  }
}

