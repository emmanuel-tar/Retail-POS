"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { LoginForm } from "@/components/login-form"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalesModule } from "@/components/sales-module"
import { InventoryModule } from "@/components/inventory-module"
import { ReportsModule } from "@/components/reports-module"
import { UserManagement } from "@/components/user-management"
import { PurchaseModule } from "@/components/purchase-module"
import { SupplierModule } from "@/components/supplier-module"
import { SettingsModule } from "@/components/settings-module"
import { StoreManagement } from "@/components/store-management"
import { ChangeLogViewer } from "@/components/change-log-viewer"
import { AdvancedReports } from "@/components/advanced-reports"
import {
  ShoppingCart,
  Package,
  BarChart3,
  Users,
  ShoppingBag,
  Truck,
  Settings,
  LogOut,
  Store,
  Activity,
  TrendingUp,
} from "lucide-react"

export default function Home() {
  const { user, logout, checkPermissions } = useAuth()
  const [activeTab, setActiveTab] = useState("sales")

  if (!user) {
    return <LoginForm />
  }

  const handleLogout = () => {
    logout()
  }

  const tabs = [
    {
      id: "sales",
      label: "Sales",
      icon: ShoppingCart,
      component: SalesModule,
      permission: "view_sales",
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: Package,
      component: InventoryModule,
      permission: "view_inventory",
    },
    {
      id: "reports",
      label: "Reports",
      icon: BarChart3,
      component: ReportsModule,
      permission: "view_reports",
    },
    {
      id: "advanced-reports",
      label: "Analytics",
      icon: TrendingUp,
      component: AdvancedReports,
      permission: "view_reports",
    },
    {
      id: "purchases",
      label: "Purchases",
      icon: ShoppingBag,
      component: PurchaseModule,
      permission: "manage_purchases",
    },
    {
      id: "suppliers",
      label: "Suppliers",
      icon: Truck,
      component: SupplierModule,
      permission: "manage_suppliers",
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      component: UserManagement,
      permission: "manage_users",
    },
    {
      id: "stores",
      label: "Stores",
      icon: Store,
      component: StoreManagement,
      permission: "manage_stores",
    },
    {
      id: "activity",
      label: "Activity Log",
      icon: Activity,
      component: ChangeLogViewer,
      permission: "view_reports",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      component: SettingsModule,
      permission: "manage_settings",
    },
  ]

  const availableTabs = tabs.filter((tab) => checkPermissions(user.role, tab.permission))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">POS System</h1>
              <Badge variant="outline" className="text-xs">
                {user.storeName}
              </Badge>
              {user.isMainStore && (
                <Badge variant="default" className="text-xs">
                  Main Store
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{user.username}</span>
                <span className="mx-2">•</span>
                <span className="capitalize">{user.role}</span>
                <span className="mx-2">•</span>
                <span>Company: {user.companyId}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
            {availableTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {availableTabs.map((tab) => {
            const Component = tab.component
            return (
              <TabsContent key={tab.id} value={tab.id}>
                <Component />
              </TabsContent>
            )
          })}
        </Tabs>
      </main>
    </div>
  )
}
