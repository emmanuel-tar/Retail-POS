"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ShoppingCart,
  Package,
  FileText,
  Users,
  Settings,
  TrendingUp,
  LogOut,
  DollarSign,
  Activity,
  Loader2,
} from "lucide-react"

import SalesModule from "@/components/sales-module"
import InventoryModule from "@/components/inventory-module"
import ReportsModule from "@/components/reports-module"
import EnhancedUserManagement from "@/components/enhanced-user-management"
import PurchaseModule from "@/components/purchase-module"
import SupplierModule from "@/components/supplier-module"
import SettingsModule from "@/components/settings-module"
import LoginForm from "@/components/login-form"
import { useAuth } from "@/hooks/use-auth"
import { useCurrency } from "@/hooks/use-currency"

export default function POSSystem() {
  const { user, logout, hasPermission, loading } = useAuth()
  const { formatCurrency } = useCurrency()
  const [activeModule, setActiveModule] = useState("sales")

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <LoginForm />
  }

  // Mock dashboard data
  const dashboardData = {
    todaySales: 15420.5,
    totalProducts: 156,
    lowStockItems: 8,
    pendingOrders: 3,
    recentSales: [
      { id: "SALE-001", amount: 450.75, time: "10:30 AM" },
      { id: "SALE-002", amount: 1200.0, time: "11:15 AM" },
      { id: "SALE-003", amount: 325.5, time: "12:00 PM" },
    ],
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "manager":
        return "bg-purple-100 text-purple-800"
      case "supervisor":
        return "bg-blue-100 text-blue-800"
      case "seller":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const availableModules = [
    { id: "sales", label: "Sales", icon: ShoppingCart, permission: "sales" },
    { id: "inventory", label: "Inventory", icon: Package, permission: "inventory" },
    { id: "purchase", label: "Purchase", icon: TrendingUp, permission: "purchase" },
    { id: "suppliers", label: "Suppliers", icon: Users, permission: "supplier_management" },
    { id: "reports", label: "Reports", icon: FileText, permission: "reports" },
    { id: "users", label: "User Management", icon: Users, permission: "user_management" },
    { id: "settings", label: "Settings", icon: Settings, permission: "settings" },
  ].filter((module) => hasPermission(module.permission))

  const renderModule = () => {
    switch (activeModule) {
      case "sales":
        return <SalesModule />
      case "inventory":
        return <InventoryModule />
      case "purchase":
        return <PurchaseModule />
      case "suppliers":
        return <SupplierModule />
      case "reports":
        return <ReportsModule />
      case "users":
        return <EnhancedUserManagement />
      case "settings":
        return <SettingsModule />
      default:
        return <SalesModule />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">POS System</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRoleColor(user.role)} variant="secondary">
                      {user.role}
                    </Badge>
                    <span className="text-xs text-gray-500">{user.userId}</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Overview - Only show on sales module */}
        {activeModule === "sales" && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(dashboardData.todaySales)}</div>
                  <p className="text-xs text-muted-foreground">+12% from yesterday</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">Active inventory items</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{dashboardData.lowStockItems}</div>
                  <p className="text-xs text-muted-foreground">Items need restocking</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.pendingOrders}</div>
                  <p className="text-xs text-muted-foreground">Purchase orders</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Sales */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>Latest transactions from today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentSales.map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{sale.id}</p>
                        <p className="text-sm text-muted-foreground">{sale.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(sale.amount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Module Navigation */}
        <Tabs value={activeModule} onValueChange={setActiveModule} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 gap-2">
            {availableModules.map((module) => (
              <TabsTrigger key={module.id} value={module.id} className="flex items-center space-x-2">
                <module.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{module.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {availableModules.map((module) => (
            <TabsContent key={module.id} value={module.id}>
              {renderModule()}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
