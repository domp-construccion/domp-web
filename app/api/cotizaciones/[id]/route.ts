import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { cookies } from "next/headers";

const ALLOWED_STATUS = ["nuevo", "contactado", "cotizado", "cerrado"] as const;
type QuoteStatus = (typeof ALLOWED_STATUS)[number];

async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === "ok";
}

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { ok: false, message: "No autorizado" },
      { status: 401 },
    );
  }

  const { id } = await params;

  let parsedId: InstanceType<typeof ObjectId>;
  try {
    parsedId = new ObjectId(id);
  } catch {
    return NextResponse.json(
      { ok: false, message: "ID de cotización inválido" },
      { status: 400 },
    );
  }

  const body = (await request.json()) as { status?: string };
  const { status } = body;

  if (!status || !ALLOWED_STATUS.includes(status as QuoteStatus)) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Status inválido. Valores permitidos: nuevo, contactado, cotizado, cerrado.",
      },
      { status: 400 },
    );
  }

  try {
    const db = await getDb();
    const result = await db
      .collection("cotizaciones")
      .updateOne({ _id: parsedId }, { $set: { status } });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { ok: false, message: "Cotización no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Estatus actualizado correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar cotización:", error);
    return NextResponse.json(
      {
        ok: false,
        message:
          "Ocurrió un error al actualizar la cotización. Intenta nuevamente más tarde.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { ok: false, message: "No autorizado" },
      { status: 401 },
    );
  }

  const { id } = await params;

  let parsedId: InstanceType<typeof ObjectId>;
  try {
    parsedId = new ObjectId(id);
  } catch {
    return NextResponse.json(
      { ok: false, message: "ID de cotización inválido" },
      { status: 400 },
    );
  }

  try {
    const db = await getDb();
    const result = await db
      .collection("cotizaciones")
      .deleteOne({ _id: parsedId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { ok: false, message: "Cotización no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Cotización eliminada correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar cotización:", error);
    return NextResponse.json(
      {
        ok: false,
        message:
          "Ocurrió un error al eliminar la cotización. Intenta nuevamente más tarde.",
      },
      { status: 500 },
    );
  }
}


