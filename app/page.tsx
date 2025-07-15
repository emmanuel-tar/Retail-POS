"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, ShoppingCart, Package, Users, BarChart, Settings, Truck, Building } from "lucide-react"
import SalesModule from "@/components/sales-module"
import InventoryModule from "@/components/inventory-module"
import AdvancedReports from "@/components/advanced-reports"
import EnhancedUserManagement from "@/components/enhanced-user-management"
import PurchaseModule from "@/components/purchase-module"
import SupplierModule from "@/components/supplier-module"
import SettingsModule from "@/components/settings-module"
import StoreManagement from "@/components/store-management"
import LoginForm from "@/components/login-form"
import { AuthProvider, useAuth } from "@/hooks/use-auth"
import { StoreProvider } from "@/hooks/use-store"

export default function HomeDashboard() {
  return (
    <AuthProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </AuthProvider>
  )
}

function AppContent() {
  const { user, logout } = useAuth()
  const [activeModule, setActiveModule] = useState("sales")

  if (!user) {
    return <LoginForm />
  }

  const renderModule = () => {
    switch (activeModule) {
      case "sales":
        return <SalesModule />
      case "inventory":
        return <InventoryModule />
      case "reports":
        return <AdvancedReports />
      case "users":
        return <EnhancedUserManagement />
      case "purchases":
        return <PurchaseModule />
      case "suppliers":
        return <SupplierModule />
      case "stores":
        return <StoreManagement />
      case "settings":
        return <SettingsModule />
      default:
        return <SalesModule />
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      <aside className="flex flex-col items-center gap-4 border-r bg-background px-2 py-6">
        <nav className="grid gap-1">
          <Button
            variant={activeModule === "sales" ? "secondary" : "ghost"}
            size="icon"
            className="rounded-lg"
            aria-label="Sales"
            onClick={() => setActiveModule("sales")}
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button
            variant={activeModule === "inventory" ? "secondary" : "ghost"}
            size="icon"
            className="rounded-lg"
            aria-label="Inventory"
            onClick={() => setActiveModule("inventory")}
          >
            <Package className="h-5 w-5" />
          </Button>
          <Button
            variant={activeModule === "purchases" ? "secondary" : "ghost"}
            size="icon"
            className="rounded-lg"
            aria-label="Purchases"
            onClick={() => setActiveModule("purchases")}
          >
            <Truck className="h-5 w-5" />
          </Button>
          <Button
            variant={activeModule === "suppliers" ? "secondary" : "ghost"}
            size="icon"
            className="rounded-lg"
            aria-label="Suppliers"
            onClick={() => setActiveModule("suppliers")}
          >
            <Home className="h-5 w-5" />
          </Button>
          <Button
            variant={activeModule === "stores" ? "secondary" : "ghost"}
            size="icon"
            className="rounded-lg"
            aria-label="Stores"
            onClick={() => setActiveModule("stores")}
          >
            <Building className="h-5 w-5" />
          </Button>
          <Button
            variant={activeModule === "reports" ? "secondary" : "ghost"}
            size="icon"
            className="rounded-lg"
            aria-label="Reports"
            onClick={() => setActiveModule("reports")}
          >
            <BarChart className="h-5 w-5" />
          </Button>
          <Button
            variant={activeModule === "users" ? "secondary" : "ghost"}
            size="icon"
            className="rounded-lg"
            aria-label="Users"
            onClick={() => setActiveModule("users")}
          >
            <Users className="h-5 w-5" />
          </Button>
          <Button
            variant={activeModule === "settings" ? "secondary" : "ghost"}
            size="icon"
            className="rounded-lg"
            aria-label="Settings"
            onClick={() => setActiveModule("settings")}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </nav>
        <div className="mt-auto">
          <Button variant="ghost" size="icon" className="rounded-lg" aria-label="Logout" onClick={logout}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-log-out"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="17 16 22 12 17 8" />
              <line x1="22" x2="10" y1="12" y2="12" />
            </svg>
          </Button>
        </div>
      </aside>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardContent className="p-4">{renderModule()}</CardContent>
        </Card>
      </main>
    </div>
  )
}
