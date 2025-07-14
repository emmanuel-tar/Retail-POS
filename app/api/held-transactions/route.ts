import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cashierId = searchParams.get("cashierId")

    let query = `
      SELECT ht.*, u.name as cashier_name,
             json_agg(
               json_build_object(
                 'id', hti.id,
                 'product_id', hti.product_id,
                 'product_name', hti.product_name,
                 'quantity', hti.quantity,
                 'unit_price', hti.unit_price,
                 'total_price', hti.total_price
               )
             ) as items
      FROM held_transactions ht
      LEFT JOIN users u ON ht.cashier_id = u.id
      LEFT JOIN held_transaction_items hti ON ht.id = hti.held_transaction_id
      WHERE 1=1
    `
    const params: any[] = []

    if (cashierId) {
      query += ` AND ht.cashier_id = $${params.length + 1}`
      params.push(cashierId)
    }

    query += ` GROUP BY ht.id, u.name ORDER BY ht.created_at DESC`

    const heldTransactions = await sql(query, params)

    return NextResponse.json({
      success: true,
      data: heldTransactions,
    })
  } catch (error) {
    console.error("Held transactions fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch held transactions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { holdId, items, subtotal, tax, total, note, cashierId } = await request.json()

    // Insert held transaction
    const heldResult = await sql`
      INSERT INTO held_transactions (hold_id, cashier_id, subtotal, tax, total, note)
      VALUES (${holdId}, ${cashierId}, ${subtotal}, ${tax}, ${total}, ${note})
      RETURNING *
    `

    const heldTransactionId = heldResult[0].id

    // Insert held transaction items
    for (const item of items) {
      await sql`
        INSERT INTO held_transaction_items (held_transaction_id, product_id, product_name, quantity, unit_price, total_price)
        VALUES (${heldTransactionId}, ${item.id}, ${item.name}, ${item.quantity}, ${item.price}, ${item.price * item.quantity})
      `
    }

    return NextResponse.json({
      success: true,
      data: heldResult[0],
    })
  } catch (error) {
    console.error("Hold transaction error:", error)
    return NextResponse.json({ error: "Failed to hold transaction" }, { status: 500 })
  }
}
