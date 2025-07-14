"use client"

import { useState } from "react"
import SalesModule from "@/components/sales-module"
import ReportsModule from "@/components/reports-module"
import InventoryModule from "@/components/inventory-module"
import PurchaseModule from "@/components/purchase-module"
import SupplierModule from "@/components/supplier-module"
import EnhancedUserManagement from "@/components/enhanced-user-management"
import SettingsModule from "@/components/settings-module"
import LoginForm from "@/components/login-form"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  MenuIcon,
  LogOutIcon,
  UserIcon,
  SettingsIcon,
  BarChartIcon,
  PackageIcon,
  ShoppingCartIcon,
  UsersIcon,
  TruckIcon,
  Loader2,
} from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DollarSign, Activity, FileText } from "lucide-react"
import { useCurrency } from "@/hooks/use-currency"

export default function Home() {
  const { isAuthenticated, user, isLoading, logout, hasPermission } = useAuth()
  const { formatCurrency } = useCurrency()
  const [activeModule, setActiveModule] = useState("sales") // Default module

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm />
  }

  // Mock dashboard data (will be replaced with real data from DB later)
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
    { id: "sales", label: "Sales", icon: ShoppingCartIcon, permission: "sales" },
    { id: "inventory", label: "Inventory", icon: PackageIcon, permission: "inventory" },
    { id: "purchase", label: "Purchase", icon: TruckIcon, permission: "purchase" },
    { id: "suppliers", label: "Suppliers", icon: UsersIcon, permission: "supplier_management" },
    { id: "reports", label: "Reports", icon: BarChartIcon, permission: "reports" },
    { id: "users", label: "User Management", icon: UsersIcon, permission: "user_management" },
    { id: "settings", label: "Settings", icon: SettingsIcon, permission: "settings" },
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
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <a href="#" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <img src="/placeholder-logo.svg" alt="Logo" className="h-6 w-6" />
            <span className="sr-only">POS System</span>
          </a>
          {availableModules.map((module) => (
            <Button
              key={module.id}
              variant={activeModule === module.id ? "secondary" : "ghost"}
              onClick={() => setActiveModule(module.id)}
              className="flex items-center space-x-2"
            >
              <module.icon className="h-4 w-4" />
              <span>{module.label}</span>
            </Button>
          ))}
        </nav>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden bg-transparent">
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {availableModules.map((module) => (
              <DropdownMenuItem key={module.id} onClick={() => setActiveModule(module.id)}>
                <module.icon className="h-4 w-4 mr-2" /> {module.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial">
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
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <UserIcon className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <UserIcon className="h-4 w-4 mr-2" /> My Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon className="h-4 w-4 mr-2" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                <LogOutIcon className="h-4 w-4 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        {activeModule === "sales" && hasPermission("sales") && (
          <>
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
                    <PackageIcon className="h-4 w-4 text-muted-foreground" />
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
            <SalesModule />
          </>
        )}
        {activeModule === "reports" && hasPermission("reports") && <ReportsModule />}
        {activeModule === "inventory" && hasPermission("inventory") && <InventoryModule />}
        {activeModule === "purchase" && hasPermission("purchase") && <PurchaseModule />}
        {activeModule === "suppliers" && hasPermission("supplier_management") && <SupplierModule />}
        {activeModule === "users" && hasPermission("user_management") && <EnhancedUserManagement />}
        {activeModule === "settings" && hasPermission("settings") && <SettingsModule />}
      </main>
      <Toaster />
    </div>
  )
}
