import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getServices,
  saveServices,
  type Service,
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

    const services = await getServices();
    return NextResponse.json({ ok: true, data: services });
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Error al obtener servicios",
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

    const body = (await request.json()) as Omit<Service, "id">;
    const { title, description, detailedDescription, benefits, idealClient, icon, imageUrl, category } = body;

    if (!title || !description || !benefits || !idealClient || !icon) {
      return NextResponse.json(
        { ok: false, message: "Faltan campos requeridos" },
        { status: 400 },
      );
    }

    const services = await getServices();

    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);

    const newService: Service = {
      id,
      title: title.trim(),
      description: description.trim(),
      detailedDescription: detailedDescription?.trim() || undefined,
      benefits: benefits.filter(b => b.trim() !== ""),
      idealClient: idealClient.trim(),
      icon: icon.trim(),
      imageUrl: imageUrl?.trim() || undefined,
      category: category?.trim() || undefined,
    };

    services.push(newService);
    await saveServices(services);

    return NextResponse.json({
      ok: true,
      message: "Servicio creado correctamente",
      data: newService,
    });
  } catch (error) {
    console.error("❌ Error al crear servicio:", error);
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
        message: `Error al crear el servicio: ${errorMessage}`,
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

    const body = (await request.json()) as Service;
    const { id, title, description, detailedDescription, benefits, idealClient, icon, imageUrl, category } = body;

    if (!id || !title || !description || !benefits || !idealClient || !icon) {
      return NextResponse.json(
        { ok: false, message: "Faltan campos requeridos" },
        { status: 400 },
      );
    }

    const services = await getServices();
    const index = services.findIndex((s) => s.id === id);

    if (index === -1) {
      return NextResponse.json(
        { ok: false, message: "Servicio no encontrado" },
        { status: 404 },
      );
    }

    services[index] = {
      ...services[index],
      title: title.trim(),
      description: description.trim(),
      detailedDescription: detailedDescription?.trim() || undefined,
      benefits: benefits.filter(b => b.trim() !== ""),
      idealClient: idealClient.trim(),
      icon: icon.trim(),
      imageUrl: imageUrl?.trim() || undefined,
      category: category?.trim() || undefined,
    };

    await saveServices(services);

    return NextResponse.json({
      ok: true,
      message: "Servicio actualizado correctamente",
      data: services[index],
    });
  } catch (error) {
    console.error("❌ Error al actualizar servicio:", error);
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
        message: `Error al actualizar el servicio: ${errorMessage}`,
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
        { ok: false, message: "ID de servicio requerido" },
        { status: 400 },
      );
    }

    const services = await getServices();
    const filtered = services.filter((s) => s.id !== id);

    if (services.length === filtered.length) {
      return NextResponse.json(
        { ok: false, message: "Servicio no encontrado" },
        { status: 404 },
      );
    }

    await saveServices(filtered);

    return NextResponse.json({
      ok: true,
      message: "Servicio eliminado correctamente",
    });
  } catch (error) {
    console.error("❌ Error al eliminar servicio:", error);
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
        message: `Error al eliminar el servicio: ${errorMessage}`,
      },
      { status: 500 },
    );
  }
}

