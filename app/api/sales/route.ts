import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    const cashierId = searchParams.get("cashierId")

    let query = `
      SELECT s.*, u.name as cashier_name,
             json_agg(
               json_build_object(
                 'id', si.id,
                 'product_id', si.product_id,
                 'product_name', si.product_name,
                 'quantity', si.quantity,
                 'unit_price', si.unit_price,
                 'total_price', si.total_price,
                 'discount', si.discount
               )
             ) as items
      FROM sales s
      LEFT JOIN users u ON s.cashier_id = u.id
      LEFT JOIN sale_items si ON s.id = si.sale_id
      WHERE s.status = 'completed'
    `
    const params: any[] = []

    if (from) {
      query += ` AND s.created_at >= $${params.length + 1}`
      params.push(from)
    }

    if (to) {
      query += ` AND s.created_at <= $${params.length + 1}`
      params.push(to)
    }

    if (cashierId) {
      query += ` AND s.cashier_id = $${params.length + 1}`
      params.push(cashierId)
    }

    query += ` GROUP BY s.id, u.name ORDER BY s.created_at DESC`

    const sales = await sql(query, params)

    return NextResponse.json({
      success: true,
      data: sales,
    })
  } catch (error) {
    console.error("Sales fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sale, items, cashierId } = await request.json()

    // Insert sale record
    const saleResult = await sql`
      INSERT INTO sales (sale_id, cashier_id, subtotal, tax, total, payment_method, customer_paid, change_amount)
      VALUES (${sale.saleId}, ${cashierId}, ${sale.subtotal}, ${sale.tax}, ${sale.total}, 
              ${sale.paymentMethod}, ${sale.customerPaid}, ${sale.changeAmount})
      RETURNING *
    `

    const saleId = saleResult[0].id

    // Insert sale items
    for (const item of items) {
      await sql`
        INSERT INTO sale_items (sale_id, product_id, product_name, quantity, unit_price, total_price, discount)
        VALUES (${saleId}, ${item.productId}, ${item.productName}, ${item.quantity}, 
                ${item.unitPrice}, ${item.totalPrice}, ${item.discount || 0})
      `

      // Update product stock
      await sql`
        UPDATE products 
        SET stock = stock - ${item.quantity}
        WHERE id = ${item.productId}
      `
    }

    return NextResponse.json({
      success: true,
      data: saleResult[0],
    })
  } catch (error) {
    console.error("Sale creation error:", error)
    return NextResponse.json({ error: "Failed to create sale" }, { status: 500 })
  }
}
