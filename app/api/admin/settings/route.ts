import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSettings, saveSettings, DEFAULT_SETTINGS, type SiteSettings } from "@/lib/admin-storage";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Verifica si el usuario está autenticado como admin.
 * Reutiliza la misma lógica de autenticación que /api/admin/login.
 */
async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === "ok";
}

/**
 * GET /api/admin/settings
 * 
 * Devuelve los settings actuales del sitio.
 * Solo accesible para usuarios autenticados como admin.
 */
export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { ok: false, message: "No autorizado" },
        { status: 401 },
      );
    }

    try {
      const settings = await getSettings();
      return NextResponse.json({ ok: true, data: settings });
    } catch (mongoError) {
      console.warn("⚠️ Error de MongoDB, usando valores por defecto:", mongoError);
      return NextResponse.json({ 
        ok: true, 
        data: DEFAULT_SETTINGS,
        warning: "MongoDB no disponible, usando valores por defecto"
      });
    }
  } catch (error) {
    console.error("Error al obtener settings:", error);
    return NextResponse.json(
      {
        ok: false,
        message:
          "Ocurrió un error al obtener la configuración. Intenta nuevamente más tarde.",
      },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/admin/settings
 * 
 * Actualiza los settings del sitio.
 * Solo accesible para usuarios autenticados como admin.
 * 
 * Body esperado (todos los campos opcionales, solo envía los que quieres actualizar):
 * {
 *   phones?: string[];
 *   emails?: string[];
 *   whatsapp?: string;
 *   address?: string;
 *   city?: string;
 *   serviceAreas?: string[];
 *   social?: { instagram?: string, facebook?: string, tiktok?: string, linkedin?: string };
 *   hero?: { headline?: string, subheadline?: string, primaryCtaText?: string, primaryCtaHref?: string, secondaryCtaText?: string, secondaryCtaHref?: string };
 * }
 */
export async function PUT(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { ok: false, message: "No autorizado" },
        { status: 401 },
      );
    }

    const body = (await request.json()) as Partial<SiteSettings>;
    const currentSettings = await getSettings();
    
    console.log("📥 Body recibido:", JSON.stringify(body, null, 2));
    console.log("📋 Settings actuales:", JSON.stringify(currentSettings, null, 2));
    
    // Merge profundo para arrays y objetos anidados
    const updatedSettings: SiteSettings = {
      ...currentSettings,
      // Actualizar campos simples directamente
      whatsapp: body.whatsapp !== undefined ? body.whatsapp : currentSettings.whatsapp,
      address: body.address !== undefined ? body.address : currentSettings.address,
      city: body.city !== undefined ? body.city : currentSettings.city,
      // Preservar arrays si vienen en el body, de lo contrario mantener los actuales
      phones: body.phones !== undefined ? body.phones : currentSettings.phones,
      emails: body.emails !== undefined ? body.emails : currentSettings.emails,
      serviceAreas: body.serviceAreas !== undefined ? body.serviceAreas : currentSettings.serviceAreas,
      // Merge de objetos anidados
      social: body.social !== undefined ? { ...currentSettings.social, ...body.social } : currentSettings.social,
      hero: body.hero !== undefined ? { ...currentSettings.hero, ...body.hero } : currentSettings.hero,
      nosotros: body.nosotros !== undefined ? { ...currentSettings.nosotros, ...body.nosotros } : currentSettings.nosotros,
      colors: body.colors !== undefined ? { ...currentSettings.colors, ...body.colors } : currentSettings.colors,
    };

    console.log("💾 Settings a guardar:", JSON.stringify(updatedSettings, null, 2));
    
    await saveSettings(updatedSettings);
    
    console.log("✅ Settings guardados exitosamente");

    return NextResponse.json({
      ok: true,
      message: "Configuración actualizada correctamente",
      data: updatedSettings,
    });
  } catch (error) {
    console.error("❌ Error al actualizar settings:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Detalles del error:", errorMessage);
    
    // Si es un error de MongoDB, dar un mensaje más específico
    if (errorMessage.includes("MONGODB_URI") || errorMessage.includes("conectar") || errorMessage.includes("ENOTFOUND")) {
      return NextResponse.json(
        {
          ok: false,
          message: "Error de conexión a la base de datos. Verifica que MongoDB esté configurado correctamente en las variables de entorno.",
        },
        { status: 500 },
      );
    }
    
    return NextResponse.json(
      {
        ok: false,
        message: `Error al actualizar la configuración: ${errorMessage}. Intenta nuevamente más tarde.`,
      },
      { status: 500 },
    );
  }
}

