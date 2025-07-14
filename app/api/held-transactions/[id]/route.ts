import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const heldTransaction = await sql`SELECT * FROM held_transactions WHERE id = ${id}`

    if (heldTransaction.length === 0) {
      return NextResponse.json({ error: "Held transaction not found" }, { status: 404 })
    }
    return NextResponse.json(heldTransaction[0])
  } catch (error) {
    console.error("Error fetching held transaction:", error)
    return NextResponse.json({ error: "Failed to fetch held transaction" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const deletedTransaction = await sql`DELETE FROM held_transactions WHERE id = ${id} RETURNING id`

    if (deletedTransaction.length === 0) {
      return NextResponse.json({ error: "Held transaction not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Held transaction deleted successfully" })
  } catch (error) {
    console.error("Error deleting held transaction:", error)
    return NextResponse.json({ error: "Failed to delete held transaction" }, { status: 500 })
  }
}
