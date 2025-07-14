import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { sql } from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization")
  const token = authHeader?.split(" ")[1]

  if (!token) {
    return NextResponse.json({ isAuthenticated: false, error: "No token provided" }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      userIdString: string
      role: string
      permissions: string[]
    }

    // Fetch user from DB to ensure data is fresh and user is active
    const users = await sql`
      SELECT id, user_id, name, email, role, permissions, status
      FROM users 
      WHERE id = ${decoded.userId}
    `

    if (users.length === 0 || users[0].status !== "active") {
      return NextResponse.json({ isAuthenticated: false, error: "User not found or inactive" }, { status: 401 })
    }

    const user = users[0]

    return NextResponse.json({
      isAuthenticated: true,
      user: {
        id: user.id,
        userId: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        status: user.status,
      },
    })
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ isAuthenticated: false, error: "Invalid or expired token" }, { status: 401 })
  }
}
