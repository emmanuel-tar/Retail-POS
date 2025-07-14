import { type NextRequest, NextResponse } from "next/server"
import { sql, executeTransaction } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const sales = await sql`SELECT * FROM sales ORDER BY sale_date DESC`
    return NextResponse.json(sales)
  } catch (error) {
    console.error("Error fetching sales:", error)
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { total_amount, discount_amount, tax_amount, payment_method, user_id, customer_id, notes, items } =
      await request.json()

    if (!total_amount || !user_id || !items || items.length === 0) {
      return NextResponse.json({ error: "Total amount, user ID, and items are required" }, { status: 400 })
    }

    const transactionQueries = []

    // 1. Insert into sales table
    transactionQueries.push({
      query: `
        INSERT INTO sales (total_amount, discount_amount, tax_amount, payment_method, user_id, customer_id, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `,
      params: [total_amount, discount_amount, tax_amount, payment_method, user_id, customer_id, notes],
    })

    const result = await executeTransaction(transactionQueries)

    if (!result.success || !result.data || result.data.length === 0) {
      throw new Error("Failed to create sale record")
    }

    const saleId = result.data[0][0].id // Assuming the first query returns the sale ID

    // 2. Insert into sale_items and update product stock
    for (const item of items) {
      transactionQueries.push({
        query: `
          INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, item_total)
          VALUES ($1, $2, $3, $4, $5)
        `,
        params: [saleId, item.product_id, item.quantity, item.unit_price, item.item_total],
      })
      transactionQueries.push({
        query: `
          UPDATE products
          SET stock_quantity = stock_quantity - $1
          WHERE id = $2
        `,
        params: [item.quantity, item.product_id],
      })
    }

    const finalResult = await executeTransaction(transactionQueries)

    if (!finalResult.success) {
      throw new Error(finalResult.error || "Failed to complete sale transaction")
    }

    return NextResponse.json({ message: "Sale recorded successfully", saleId }, { status: 201 })
  } catch (error) {
    console.error("Error creating sale:", error)
    return NextResponse.json({ error: "Failed to create sale" }, { status: 500 })
  }
}
