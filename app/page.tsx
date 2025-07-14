"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Package, TrendingUp, AlertTriangle } from "lucide-react"
import LoginForm from "@/components/login-form"
import SalesModule from "@/components/sales-module"
import PurchaseModule from "@/components/purchase-module"
import EnhancedUserManagement from "@/components/enhanced-user-management"
import SettingsModule from "@/components/settings-module"
import InventoryModule from "@/components/inventory-module"
import ReportsModule from "@/components/reports-module"
import SupplierModule from "@/components/supplier-module"
import { useAuth } from "@/hooks/use-auth"
import { useCurrency } from "@/hooks/use-currency"

export default function POSSystem() {
  const { user, logout } = useAuth()
  const { formatCurrency } = useCurrency()
  const [activeTab, setActiveTab] = useState("sales")

  // Mock data for dashboard
  const dashboardStats = {
    todaySales: 125000,
    totalProducts: 450,
    lowStockItems: 12,
    pendingOrders: 8,
  }

  if (!user) {
    return <LoginForm />
  }

  const hasPermission = (permission: string) => {
    return user.permissions.includes(permission) || user.role === "manager"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">POS System</h1>
              <Badge variant="secondary" className="ml-3">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(dashboardStats.todaySales)}</div>
              <p className="text-xs text-muted-foreground">+12% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">Active inventory items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{dashboardStats.lowStockItems}</div>
              <p className="text-xs text-muted-foreground">Items need restocking</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Purchase orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            {hasPermission("purchase") && <TabsTrigger value="purchase">Purchase</TabsTrigger>}
            {hasPermission("supplier_management") && <TabsTrigger value="suppliers">Suppliers</TabsTrigger>}
            {hasPermission("reports") && <TabsTrigger value="reports">Reports</TabsTrigger>}
            {hasPermission("user_management") && <TabsTrigger value="users">Users</TabsTrigger>}
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-4">
            <SalesModule />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <InventoryModule />
          </TabsContent>

          {hasPermission("purchase") && (
            <TabsContent value="purchase" className="space-y-4">
              <PurchaseModule />
            </TabsContent>
          )}

          {hasPermission("supplier_management") && (
            <TabsContent value="suppliers" className="space-y-4">
              <SupplierModule />
            </TabsContent>
          )}

          {hasPermission("reports") && (
            <TabsContent value="reports" className="space-y-4">
              <ReportsModule />
            </TabsContent>
          )}

          {hasPermission("user_management") && (
            <TabsContent value="users" className="space-y-4">
              <EnhancedUserManagement />
            </TabsContent>
          )}

          <TabsContent value="settings" className="space-y-4">
            <SettingsModule />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
