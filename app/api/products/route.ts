import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const products = await sql`SELECT * FROM products ORDER BY name ASC`
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sku, name, description, price, cost, stock_quantity, category, supplier_id } = await request.json()

    if (!sku || !name || !price) {
      return NextResponse.json({ error: "SKU, name, and price are required" }, { status: 400 })
    }

    const newProduct = await sql`
      INSERT INTO products (sku, name, description, price, cost, stock_quantity, category, supplier_id)
      VALUES (${sku}, ${name}, ${description}, ${price}, ${cost}, ${stock_quantity}, ${category}, ${supplier_id})
      RETURNING *
    `
    return NextResponse.json(newProduct[0], { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
