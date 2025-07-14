"use client"

import { useState, useEffect } from "react"

interface User {
  id: string
  userId: string
  name: string
  email: string
  role: "seller" | "supervisor" | "manager"
  permissions: string[]
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored token and verify it
    const token = localStorage.getItem("pos_token")
    if (token) {
      verifyToken(token)
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        localStorage.removeItem("pos_token")
      }
    } catch (error) {
      console.error("Token verification error:", error)
      localStorage.removeItem("pos_token")
    } finally {
      setLoading(false)
    }
  }

  const login = async (userId: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        localStorage.setItem("pos_token", data.token)
      } else {
        throw new Error(data.error || "Login failed")
      }
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("pos_token")
  }

  const hasPermission = (permission: string) => {
    return user?.permissions.includes(permission) || false
  }

  return {
    user,
    login,
    logout,
    hasPermission,
    loading,
  }
}
