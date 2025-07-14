import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const product = await sql`SELECT * FROM products WHERE id = ${id}`

    if (product.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json(product[0])
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { sku, name, description, price, cost, stock_quantity, category, supplier_id } = await request.json()

    const updatedProduct = await sql`
      UPDATE products
      SET 
        sku = COALESCE(${sku}, sku),
        name = COALESCE(${name}, name),
        description = COALESCE(${description}, description),
        price = COALESCE(${price}, price),
        cost = COALESCE(${cost}, cost),
        stock_quantity = COALESCE(${stock_quantity}, stock_quantity),
        category = COALESCE(${category}, category),
        supplier_id = COALESCE(${supplier_id}, supplier_id),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (updatedProduct.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json(updatedProduct[0])
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const deletedProduct = await sql`DELETE FROM products WHERE id = ${id} RETURNING id`

    if (deletedProduct.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
