import { NextResponse } from "next/server";

type LoginBody = {
  username?: string;
  password?: string;
};

export async function POST(request: Request) {
  const adminUser = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUser || !adminPassword) {
    console.error("ADMIN_USER o ADMIN_PASSWORD no están configurados");
    return NextResponse.json(
      {
        ok: false,
        message:
          "La autenticación de administrador no está configurada. Contacta al administrador del sistema.",
      },
      { status: 500 },
    );
  }

  const body = (await request.json()) as LoginBody;
  const { username, password } = body;

  if (username !== adminUser || password !== adminPassword) {
    return NextResponse.json(
      { ok: false, message: "Credenciales inválidas" },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set("admin_session", "ok", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 horas
  });

  return response;
}


