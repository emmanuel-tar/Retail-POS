"use client"

import { useState, useEffect, createContext } from "react"

interface User {
  id: string
  userId: string
  name: string
  email: string
  role: "seller" | "supervisor" | "manager"
  permissions: string[]
}

interface AuthContextType {
  user: User | null
  login: (userId: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo
const DEMO_USERS: User[] = [
  {
    id: "1",
    userId: "MGR001",
    name: "John Manager",
    email: "manager@pos.com",
    role: "manager",
    permissions: [
      "sales",
      "inventory",
      "purchase",
      "reports",
      "user_management",
      "settings",
      "price_override",
      "discount_approval",
      "void_transactions",
      "cash_management",
      "supplier_management",
      "customer_management",
    ],
  },
  {
    id: "2",
    userId: "SUP001",
    name: "Jane Supervisor",
    email: "supervisor@pos.com",
    role: "supervisor",
    permissions: ["sales", "inventory", "reports", "price_override", "discount_approval", "cash_management"],
  },
  {
    id: "3",
    userId: "SEL001",
    name: "Bob Seller",
    email: "seller@pos.com",
    role: "seller",
    permissions: ["sales", "inventory"],
  },
]

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("pos_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (userId: string, password: string) => {
    // Mock authentication - in real app, this would call an API
    const foundUser = DEMO_USERS.find((u) => u.userId === userId)

    if (!foundUser || password !== "password123") {
      throw new Error("Invalid credentials")
    }

    setUser(foundUser)
    localStorage.setItem("pos_user", JSON.stringify(foundUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("pos_user")
  }

  return { user, login, logout }
}
