import { NextResponse } from "next/server";
import { getPublishedProjects, getProjectBySlug } from "@/lib/admin-storage";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const project = await getProjectBySlug(slug);
      if (!project) {
        return NextResponse.json(
          { ok: false, message: "Proyecto no encontrado" },
          { status: 404 },
        );
      }
      return NextResponse.json({ ok: true, data: project });
    }

    const projects = await getPublishedProjects();
    return NextResponse.json({ ok: true, data: projects });
  } catch (error) {
    console.error("Error al obtener proyectos:", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Error al obtener proyectos",
      },
      { status: 500 },
    );
  }
}

