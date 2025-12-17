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
    console.error("Error al obtener settings:", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Error al obtener la configuración",
      },
      { status: 500 },
    );
  }
}

