import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getDb } from "@/lib/mongodb";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    let emailError: string | null = null;
    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.QUOTES_TO_EMAIL || "constructora.domp@outlook.com";
    const fromEmail = process.env.QUOTES_FROM_EMAIL || "onboarding@resend.dev";

    console.log("📧 Intentando enviar correo...");
    console.log("📧 RESEND_API_KEY configurado:", !!resendApiKey);
    console.log("📧 To email:", toEmail);
    console.log("📧 From email:", fromEmail);

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

        const htmlBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #101932;">Nueva solicitud de cotización</h2>
            <p>Has recibido una nueva solicitud de cotización desde el sitio web de DomP.</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Nombre:</strong> ${nombre}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Teléfono:</strong> ${telefono}</p>
              <p><strong>Tipo de proyecto:</strong> ${tipoProyecto}</p>
              <p><strong>Presupuesto estimado:</strong> ${presupuestoEstimado || "No especificado"}</p>
            </div>
            <div style="margin: 20px 0;">
              <h3>Mensaje:</h3>
              <p style="white-space: pre-wrap;">${mensaje}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">Este correo fue generado automáticamente desde el formulario de contacto de DomP.</p>
          </div>
        `;

        const result = await resend.emails.send({
          from: fromEmail,
          to: toEmail,
          subject,
          text: textBody,
          html: htmlBody,
        });

        console.log("📧 Resultado de Resend:", JSON.stringify(result, null, 2));

        if (result.error) {
          console.error("❌ Error al enviar correo de cotización:", result.error);
          emailError = result.error.message || "Error desconocido al enviar correo";
        } else {
          emailSent = true;
          console.log("✅ Correo enviado exitosamente");
        }
      } catch (emailError) {
        const errorMessage = emailError instanceof Error ? emailError.message : String(emailError);
        console.error("❌ Error al intentar enviar correo:", errorMessage);
        emailError = errorMessage;
      }
    } else {
      console.warn("⚠️ RESEND_API_KEY no está configurado. El correo no se enviará.");
      emailError = "RESEND_API_KEY no está configurado en las variables de entorno";
    }

    // NOTA: Según las instrucciones del usuario, las cotizaciones NO se guardan en MongoDB,
    // solo se envían por correo. Sin embargo, el código original intentaba guardar.
    // Por ahora, solo enviamos el correo y respondemos con éxito si el correo se envió.
    
    // Si el correo no se pudo enviar, devolver un error
    if (!emailSent) {
      return NextResponse.json(
        {
          ok: false,
          message: `No se pudo enviar la cotización por correo. ${emailError || "Error desconocido"}. Verifica que RESEND_API_KEY, QUOTES_TO_EMAIL y QUOTES_FROM_EMAIL estén configurados correctamente en las variables de entorno.`,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message: "Cotización enviada correctamente. Te contactaremos pronto.",
        emailSent: true,
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


