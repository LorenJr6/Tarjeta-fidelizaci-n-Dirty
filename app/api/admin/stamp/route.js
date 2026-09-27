import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { REWARD_THRESHOLD } from "@/lib/config";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud no valida." }, { status: 400 });
  }

  const id = Number(body.id);
  const action = body.action;

  if (!id || !["stamp", "redeem"].includes(action)) {
    return NextResponse.json({ error: "Solicitud no valida." }, { status: 400 });
  }

  if (action === "stamp") {
    const rows = await sql`
      UPDATE customers
      SET stamps = LEAST(stamps + 1, ${REWARD_THRESHOLD})
      WHERE id = ${id}
      RETURNING id, name, stamps, rewards
    `;
    if (!rows.length) {
      return NextResponse.json({ error: "Cliente no encontrado." }, { status: 404 });
    }
    return NextResponse.json({ customer: rows[0] });
  }

  const rows = await sql`
    UPDATE customers
    SET stamps = 0, rewards = rewards + 1
    WHERE id = ${id} AND stamps >= ${REWARD_THRESHOLD}
    RETURNING id, name, stamps, rewards
  `;
  if (!rows.length) {
    return NextResponse.json(
      { error: "Este cliente todavia no ha llegado al premio." },
      { status: 409 }
    );
  }
  return NextResponse.json({ customer: rows[0] });
}
