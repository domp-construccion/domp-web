import { NextResponse } from "next/server";
import { getSettings } from "@/lib/admin-storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const settings = await getSettings();
    console.log("📡 API /api/settings - Emails:", settings.emails);
    return NextResponse.json({ ok: true, data: settings });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error al obtener settings:", errorMessage);
    console.error("❌ Stack trace:", error instanceof Error ? error.stack : "No disponible");
    
    // Si es un error de MongoDB, devolver settings por defecto en lugar de error
    if (errorMessage.includes("MONGODB_URI") || errorMessage.includes("conectar") || errorMessage.includes("ENOTFOUND")) {
      console.warn("⚠️ MongoDB no disponible, usando valores por defecto");
      const { DEFAULT_SETTINGS } = await import("@/lib/admin-storage");
      return NextResponse.json({ ok: true, data: DEFAULT_SETTINGS });
    }
    
    return NextResponse.json(
      {
        ok: false,
        message: `Error al obtener la configuración: ${errorMessage}`,
      },
      { status: 500 },
    );
  }
}

