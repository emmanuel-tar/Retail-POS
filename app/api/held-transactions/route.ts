import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const heldTransactions = await sql`SELECT * FROM held_transactions ORDER BY created_at DESC`
    return NextResponse.json(heldTransactions)
  } catch (error) {
    console.error("Error fetching held transactions:", error)
    return NextResponse.json({ error: "Failed to fetch held transactions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { hold_name, held_data } = await request.json()

    if (!hold_name || !held_data) {
      return NextResponse.json({ error: "Hold name and held data are required" }, { status: 400 })
    }

    const newHeldTransaction = await sql`
      INSERT INTO held_transactions (hold_name, held_data)
      VALUES (${hold_name}, ${JSON.stringify(held_data)}::jsonb)
      RETURNING *
    `
    return NextResponse.json(newHeldTransaction[0], { status: 201 })
  } catch (error) {
    console.error("Error creating held transaction:", error)
    return NextResponse.json({ error: "Failed to create held transaction" }, { status: 500 })
  }
}
