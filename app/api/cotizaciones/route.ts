import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getDb } from "@/lib/mongodb";
import { cookies } from "next/headers";

type QuotePayload = {
  nombre: string;
  email: string;
  telefono: string;
  tipoProyecto: string;
  mensaje: string;
  presupuestoEstimado?: string;
};

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

    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "La base de datos no está configurada. No es posible listar cotizaciones.",
        },
        { status: 500 },
      );
    }

    const db = await getDb();
    const docs = (await db
      .collection("cotizaciones")
      .find()
      .sort({ createdAt: -1 })
      .toArray()) as any[];

    const data = docs.map((doc: any) => ({
      id: String(doc._id),
      nombre: doc.nombre,
      email: doc.email,
      telefono: doc.telefono,
      tipoProyecto: doc.tipoProyecto,
      presupuestoEstimado: doc.presupuestoEstimado ?? null,
      mensaje: doc.mensaje,
      status: doc.status || "nuevo",
      origen: doc.origen || "web",
      createdAt:
        doc.createdAt instanceof Date
          ? doc.createdAt.toISOString()
          : doc.createdAt
            ? new Date(doc.createdAt).toISOString()
            : new Date().toISOString(),
    }));

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("Error al listar cotizaciones:", error);
    return NextResponse.json(
      {
        ok: false,
        message:
          "Ocurrió un error al obtener las cotizaciones. Intenta nuevamente más tarde.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<QuotePayload>;

    const {
      nombre,
      email,
      telefono,
      tipoProyecto,
      mensaje,
      presupuestoEstimado,
    } = body;

    if (!nombre || !email || !telefono || !tipoProyecto || !mensaje) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Faltan campos requeridos. Verifica nombre, email, teléfono, tipo de proyecto y mensaje.",
        },
        { status: 400 },
      );
    }

    // Enviar correo usando Resend
    let emailSent = false;
    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.QUOTES_TO_EMAIL || "constructora.domp@outlook.com";
    const fromEmail = process.env.QUOTES_FROM_EMAIL || "onboarding@resend.dev";

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const subject = `Nueva cotización DomP - ${nombre}`;

        const textBody = [
          "Nueva solicitud de cotización recibida desde el sitio web de DomP.",
          "",
          `Nombre: ${nombre}`,
          `Email: ${email}`,
          `Teléfono: ${telefono}`,
          `Tipo de proyecto: ${tipoProyecto}`,
          presupuestoEstimado
            ? `Presupuesto estimado: ${presupuestoEstimado}`
            : "Presupuesto estimado: No especificado",
          "",
          "Mensaje:",
          mensaje,
          "",
          "-----",
          "Este correo fue generado automáticamente desde el formulario de contacto de DomP.",
        ].join("\n");

        const { error } = await resend.emails.send({
          from: fromEmail,
          to: toEmail,
          subject,
          text: textBody,
        });

        if (!error) {
          emailSent = true;
        } else {
          console.error("Error al enviar correo de cotización:", error);
        }
      } catch (emailError) {
        console.error("Error al intentar enviar correo:", emailError);
      }
    } else {
      console.warn(
        "RESEND_API_KEY no está configurado. El correo no se enviará, pero la cotización se guardará en la base de datos.",
      );
    }

    // Guardar en MongoDB (requerido)
    let saved = false;
    let insertedId: string | undefined;

    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "La base de datos no está configurada. No es posible guardar la cotización.",
        },
        { status: 500 },
      );
    }

    try {
      const db = await getDb();
      const result = await db.collection("cotizaciones").insertOne({
        nombre,
        email,
        telefono,
        tipoProyecto,
        presupuestoEstimado: presupuestoEstimado ?? null,
        mensaje,
        status: "nuevo",
        origen: "web",
        createdAt: new Date(),
      });

      saved = true;
      insertedId = String(result.insertedId);
    } catch (dbError) {
      console.error("Error al guardar cotización en MongoDB:", dbError);
      const errorMessage =
        dbError instanceof Error ? dbError.message : "Error desconocido";
      console.error("Detalles del error:", errorMessage);
      return NextResponse.json(
        {
          ok: false,
          message: `Error al guardar la cotización: ${errorMessage}. Verifica la conexión a la base de datos.`,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message: emailSent
          ? "Cotización enviada y guardada correctamente"
          : "Cotización guardada correctamente (el correo no pudo enviarse)",
        saved,
        emailSent,
        id: insertedId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error inesperado en /api/cotizaciones:", error);
    return NextResponse.json(
      {
        ok: false,
        message:
          "Ocurrió un error inesperado al procesar la solicitud. Intenta nuevamente más tarde.",
      },
      { status: 500 },
    );
  }
}


