import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getProjects,
  saveProjects,
  type Project,
} from "@/lib/admin-storage";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === "ok";
}

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { ok: false, message: "No autorizado" },
        { status: 401 },
      );
    }

    const projects = await getProjects();
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

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { ok: false, message: "No autorizado" },
        { status: 401 },
      );
    }

    const body = (await request.json()) as Omit<Project, "id" | "slug">;
    const { name, type, city, description, status, year, imageUrl } = body;

    if (!name || !type || !city || !description || !status) {
      return NextResponse.json(
        { ok: false, message: "Faltan campos requeridos" },
        { status: 400 },
      );
    }

    const projects = await getProjects();

    // Generar slug único
    const baseSlug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    let slug = baseSlug;
    let counter = 1;
    while (projects.some((p) => p.slug === slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);

    const newProject: Project = {
      id,
      slug,
      name: name.trim(),
      type,
      city: city.trim(),
      description: description.trim(),
      status,
      year: year || undefined,
      imageUrl: imageUrl?.trim() || undefined,
    };

    projects.push(newProject);
    await saveProjects(projects);

    return NextResponse.json({
      ok: true,
      message: "Proyecto creado correctamente",
      data: newProject,
    });
  } catch (error) {
    console.error("❌ Error al crear proyecto:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Detalles del error:", errorMessage);
    
    if (errorMessage.includes("MONGODB_URI") || errorMessage.includes("conectar") || errorMessage.includes("ENOTFOUND")) {
      return NextResponse.json(
        {
          ok: false,
          message: "Error de conexión a la base de datos. Verifica que MongoDB esté configurado correctamente.",
        },
        { status: 500 },
      );
    }
    
    return NextResponse.json(
      {
        ok: false,
        message: `Error al crear el proyecto: ${errorMessage}`,
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { ok: false, message: "No autorizado" },
        { status: 401 },
      );
    }

    const body = (await request.json()) as Project;
    const { id, name, type, city, description, status, year, imageUrl } = body;

    if (!id || !name || !type || !city || !description || !status) {
      return NextResponse.json(
        { ok: false, message: "Faltan campos requeridos" },
        { status: 400 },
      );
    }

    const projects = await getProjects();
    const index = projects.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json(
        { ok: false, message: "Proyecto no encontrado" },
        { status: 404 },
      );
    }

    // Regenerar slug si el nombre cambió
    let slug = projects[index].slug;
    if (projects[index].name !== name.trim()) {
      const baseSlug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      slug = baseSlug;
      let counter = 1;
      while (projects.some((p) => p.slug === slug && p.id !== id)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    projects[index] = {
      ...projects[index],
      name: name.trim(),
      type,
      city: city.trim(),
      description: description.trim(),
      status,
      year: year || undefined,
      imageUrl: imageUrl?.trim() || undefined,
      slug,
    };

    await saveProjects(projects);

    return NextResponse.json({
      ok: true,
      message: "Proyecto actualizado correctamente",
      data: projects[index],
    });
  } catch (error) {
    console.error("❌ Error al actualizar proyecto:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Detalles del error:", errorMessage);
    
    if (errorMessage.includes("MONGODB_URI") || errorMessage.includes("conectar") || errorMessage.includes("ENOTFOUND")) {
      return NextResponse.json(
        {
          ok: false,
          message: "Error de conexión a la base de datos. Verifica que MongoDB esté configurado correctamente.",
        },
        { status: 500 },
      );
    }
    
    return NextResponse.json(
      {
        ok: false,
        message: `Error al actualizar el proyecto: ${errorMessage}`,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { ok: false, message: "No autorizado" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { ok: false, message: "ID de proyecto requerido" },
        { status: 400 },
      );
    }

    const projects = await getProjects();
    const filtered = projects.filter((p) => p.id !== id);

    if (projects.length === filtered.length) {
      return NextResponse.json(
        { ok: false, message: "Proyecto no encontrado" },
        { status: 404 },
      );
    }

    await saveProjects(filtered);

    return NextResponse.json({
      ok: true,
      message: "Proyecto eliminado correctamente",
    });
  } catch (error) {
    console.error("❌ Error al eliminar proyecto:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Detalles del error:", errorMessage);
    
    if (errorMessage.includes("MONGODB_URI") || errorMessage.includes("conectar") || errorMessage.includes("ENOTFOUND")) {
      return NextResponse.json(
        {
          ok: false,
          message: "Error de conexión a la base de datos. Verifica que MongoDB esté configurado correctamente.",
        },
        { status: 500 },
      );
    }
    
    return NextResponse.json(
      {
        ok: false,
        message: `Error al eliminar el proyecto: ${errorMessage}`,
      },
      { status: 500 },
    );
  }
}

