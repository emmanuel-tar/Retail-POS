"use client"

import { useState, useEffect, useCallback } from "react"

interface User {
  id: string
  userId: string
  name: string
  email: string
  role: string
  permissions: string[]
  status: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
  error: string | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
  })

  const login = useCallback(async (userId: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }))
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
        localStorage.setItem("token", data.token)
        setAuthState({
          isAuthenticated: true,
          user: data.user,
          isLoading: false,
          error: null,
        })
        return { success: true }
      } else {
        setAuthState((prev) => ({
          ...prev,
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: data.error || "Login failed",
        }))
        return { success: false, error: data.error || "Login failed" }
      }
    } catch (error) {
      console.error("Login API call failed:", error)
      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: "Network error or server unreachable",
      }))
      return { success: false, error: "Network error or server unreachable" }
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("token")
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
    })
  }, [])

  const verifyToken = useCallback(async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      })
      return
    }

    try {
      const response = await fetch("/api/auth/verify", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok && data.isAuthenticated) {
        setAuthState({
          isAuthenticated: true,
          user: data.user,
          isLoading: false,
          error: null,
        })
      } else {
        localStorage.removeItem("token")
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: data.error || "Session expired or invalid",
        })
      }
    } catch (error) {
      console.error("Token verification API call failed:", error)
      localStorage.removeItem("token")
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: "Network error during session verification",
      })
    }
  }, [])

  useEffect(() => {
    verifyToken()
  }, [verifyToken])

  const hasPermission = useCallback(
    (permission: string) => {
      if (!authState.isAuthenticated || !authState.user) {
        return false
      }
      return authState.user.permissions.includes(permission)
    },
    [authState.isAuthenticated, authState.user],
  )

  return { ...authState, login, logout, hasPermission }
}
