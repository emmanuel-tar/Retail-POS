"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  username: string
  email: string
  role: string
  permissions: string[]
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  checkPermissions: (userRole: string, permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users data
const mockUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@pos.com",
    role: "admin",
    permissions: [
      "view_sales",
      "view_inventory",
      "view_reports",
      "manage_users",
      "manage_purchases",
      "manage_suppliers",
      "manage_settings",
    ],
  },
  {
    id: "2",
    username: "cashier",
    email: "cashier@pos.com",
    role: "cashier",
    permissions: ["view_sales", "view_inventory"],
  },
  {
    id: "3",
    username: "manager",
    email: "manager@pos.com",
    role: "manager",
    permissions: ["view_sales", "view_inventory", "view_reports", "manage_purchases", "manage_suppliers"],
  },
]

// Role-based permissions
const rolePermissions: Record<string, string[]> = {
  admin: [
    "view_sales",
    "view_inventory",
    "view_reports",
    "manage_users",
    "manage_purchases",
    "manage_suppliers",
    "manage_settings",
  ],
  manager: ["view_sales", "view_inventory", "view_reports", "manage_purchases", "manage_suppliers"],
  cashier: ["view_sales", "view_inventory"],
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("pos_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (username: string, password: string): Promise<void> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simple authentication check
    if (username === "admin" && password === "password") {
      const user = mockUsers[0]
      setUser(user)
      localStorage.setItem("pos_user", JSON.stringify(user))
      return
    }

    if (username === "cashier" && password === "password") {
      const user = mockUsers[1]
      setUser(user)
      localStorage.setItem("pos_user", JSON.stringify(user))
      return
    }

    if (username === "manager" && password === "password") {
      const user = mockUsers[2]
      setUser(user)
      localStorage.setItem("pos_user", JSON.stringify(user))
      return
    }

    throw new Error("Invalid credentials")
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("pos_user")
  }

  const checkPermissions = (userRole: string, permission: string): boolean => {
    const permissions = rolePermissions[userRole] || []
    return permissions.includes(permission)
  }

  return <AuthContext.Provider value={{ user, login, logout, checkPermissions }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
