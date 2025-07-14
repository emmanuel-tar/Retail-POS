import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const heldTransactionId = params.id

    // Delete held transaction (items will be deleted by CASCADE)
    const result = await sql`
      DELETE FROM held_transactions 
      WHERE id = ${heldTransactionId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Held transaction not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Held transaction deleted successfully",
    })
  } catch (error) {
    console.error("Held transaction deletion error:", error)
    return NextResponse.json({ error: "Failed to delete held transaction" }, { status: 500 })
  }
}
