import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Solicitud no valida." }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const phone = (body.phone || "").trim();
  const email = (body.email || "").trim().toLowerCase();

  if (!name || !phone || !email) {
    return Response.json(
      { error: "Nombre, telefono y correo son obligatorios." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: "El correo no parece valido." }, { status: 400 });
  }

  try {
    const rows = await sql`
      INSERT INTO customers (name, phone, email)
      VALUES (${name}, ${phone}, ${email})
      RETURNING id, name, stamps
    `;
    return Response.json({ customer: rows[0] }, { status: 201 });
  } catch (err) {
    if (err && err.code === "23505") {
      return Response.json({ error: "Ese correo ya esta registrado." }, { status: 409 });
    }
    console.error(err);
    return Response.json({ error: "No se pudo completar el registro." }, { status: 500 });
  }
}
