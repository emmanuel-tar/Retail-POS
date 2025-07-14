import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { userId, password } = await request.json()

    if (!userId || !password) {
      return NextResponse.json({ error: "User ID and password are required" }, { status: 400 })
    }

    // Find user by user_id
    const users = await sql`
      SELECT id, user_id, name, email, role, permissions, status, password_hash
      FROM users 
      WHERE user_id = ${userId}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = users[0]

    // Check if user is active
    if (user.status !== "active") {
      return NextResponse.json({ error: "Account is inactive or locked" }, { status: 401 })
    }

    // Simplified password check for demo purposes
    const isValidPassword = password === "password123"

    if (!isValidPassword) {
      // Log failed login attempt
      await sql`
        INSERT INTO user_activities (user_id, action, details)
        VALUES (${user.id}, 'Failed Login', 'Invalid password attempt')
      `

      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Update last login
    await sql`
      UPDATE users 
      SET last_login = CURRENT_TIMESTAMP 
      WHERE id = ${user.id}
    `

    // Log successful login
    await sql`
      INSERT INTO user_activities (user_id, action, details)
      VALUES (${user.id}, 'Login', 'Successful login')
    `

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        userIdString: user.user_id,
        role: user.role,
        permissions: user.permissions,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    )

    // Return user data (without password hash)
    const userData = {
      id: user.id,
      userId: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      status: user.status,
    }

    return NextResponse.json({
      success: true,
      user: userData,
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
