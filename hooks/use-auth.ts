"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useChangeLog } from "./use-change-log"

interface User {
  id: string
  username: string
  email: string
  role: string
  permissions: string[]
  companyId: string
  storeCode: string
  storeName: string
  isMainStore: boolean
}

interface AuthContextType {
  user: User | null
  login: (companyId: string, storeCode: string, password: string) => Promise<void>
  logout: () => void
  checkPermissions: (userRole: string, permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock authentication database with company/store structure
const authDatabase = {
  "12345": {
    // Company ID
    companyName: "RetailCorp Inc.",
    stores: {
      "001": {
        // Store Code
        storeName: "Main Store - Downtown",
        location: "New York, NY",
        isMainStore: true,
        users: {
          "123456": {
            // Password
            id: "user-main-admin",
            username: "admin",
            email: "admin@retailcorp.com",
            role: "admin",
            permissions: [
              "view_sales",
              "view_inventory",
              "view_reports",
              "manage_users",
              "manage_purchases",
              "manage_suppliers",
              "manage_settings",
              "manage_stores",
              "view_all_stores",
              "manage_company",
            ],
          },
        },
      },
      "002": {
        storeName: "North Branch",
        location: "Brooklyn, NY",
        isMainStore: false,
        users: {
          "654321": {
            id: "user-branch-manager",
            username: "manager",
            email: "manager@retailcorp.com",
            role: "manager",
            permissions: ["view_sales", "view_inventory", "view_reports", "manage_purchases", "manage_suppliers"],
          },
        },
      },
      "003": {
        storeName: "Regional Store - West",
        location: "Los Angeles, CA",
        isMainStore: false,
        users: {
          "111222": {
            id: "user-regional-cashier",
            username: "cashier",
            email: "cashier@retailcorp.com",
            role: "cashier",
            permissions: ["view_sales", "view_inventory"],
          },
        },
      },
    },
  },
  "54321": {
    // Another company
    companyName: "TechMart Solutions",
    stores: {
      "001": {
        storeName: "TechMart Main",
        location: "San Francisco, CA",
        isMainStore: true,
        users: {
          "999888": {
            id: "user-tech-admin",
            username: "techadmin",
            email: "admin@techmart.com",
            role: "admin",
            permissions: [
              "view_sales",
              "view_inventory",
              "view_reports",
              "manage_users",
              "manage_purchases",
              "manage_suppliers",
              "manage_settings",
              "manage_stores",
              "view_all_stores",
              "manage_company",
            ],
          },
        },
      },
    },
  },
}

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
    "manage_stores",
    "view_all_stores",
    "manage_company",
  ],
  manager: ["view_sales", "view_inventory", "view_reports", "manage_purchases", "manage_suppliers"],
  cashier: ["view_sales", "view_inventory"],
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const { logChange } = useChangeLog()

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("pos_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error loading user session:", error)
        localStorage.removeItem("pos_user")
      }
    }
  }, [])

  const login = async (companyId: string, storeCode: string, password: string): Promise<void> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Validate company exists
    const company = authDatabase[companyId as keyof typeof authDatabase]
    if (!company) {
      throw new Error("Invalid Company ID")
    }

    // Validate store exists
    const store = company.stores[storeCode as keyof typeof company.stores]
    if (!store) {
      throw new Error("Invalid Store Code")
    }

    // Validate user credentials
    const userData = store.users[password as keyof typeof store.users]
    if (!userData) {
      throw new Error("Invalid Password")
    }

    // Create user session
    const user: User = {
      ...userData,
      companyId,
      storeCode,
      storeName: store.storeName,
      isMainStore: store.isMainStore,
    }

    setUser(user)
    localStorage.setItem("pos_user", JSON.stringify(user))

    // Log the login activity
    logChange({
      action: "USER_LOGIN",
      entity: "Authentication",
      entityId: user.id,
      details: `User ${user.username} logged in to ${store.storeName} (${storeCode})`,
      userId: user.id,
      storeCode: storeCode,
      companyId: companyId,
    })
  }

  const logout = () => {
    if (user) {
      // Log the logout activity
      logChange({
        action: "USER_LOGOUT",
        entity: "Authentication",
        entityId: user.id,
        details: `User ${user.username} logged out from ${user.storeName}`,
        userId: user.id,
        storeCode: user.storeCode,
        companyId: user.companyId,
      })
    }

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
