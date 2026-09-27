import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await sql`
    SELECT id, name, phone, email, stamps, rewards, created_at
    FROM customers
    ORDER BY stamps DESC, name ASC
  `;
  return NextResponse.json(
    { customers: rows },
    { headers: { "Cache-Control": "no-store" } }
  );
}
