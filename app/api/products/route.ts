import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const category = searchParams.get("category")

    let query = `
      SELECT p.*, s.name as supplier_name
      FROM products p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE 1=1
    `
    const params: any[] = []

    if (search) {
      query += ` AND (p.name ILIKE $${params.length + 1} OR p.barcode ILIKE $${params.length + 1})`
      params.push(`%${search}%`)
    }

    if (category && category !== "all") {
      query += ` AND p.category = $${params.length + 1}`
      params.push(category)
    }

    query += ` ORDER BY p.name`

    const products = await sql(query, params)

    return NextResponse.json({
      success: true,
      data: products,
    })
  } catch (error) {
    console.error("Products fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const product = await request.json()

    const result = await sql`
      INSERT INTO products (name, barcode, price, cost, stock, min_stock, category, supplier_id)
      VALUES (${product.name}, ${product.barcode}, ${product.price}, ${product.cost}, 
              ${product.stock}, ${product.minStock}, ${product.category}, ${product.supplierId})
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      data: result[0],
    })
  } catch (error) {
    console.error("Product creation error:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
