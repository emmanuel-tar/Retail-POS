"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FileText,
  Download,
  CalendarIcon,
  TrendingUp,
  DollarSign,
  Package,
  ShoppingCart,
  AlertTriangle,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { useCurrency } from "@/hooks/use-currency"

interface Sale {
  id: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
  subtotal: number
  tax: number
  total: number
  paymentMethod: string
  timestamp: Date
  cashier: string
  customerPaid?: number
  change?: number
}

interface Purchase {
  id: string
  supplier: string
  items: Array<{
    id: string
    name: string
    quantity: number
    unitCost: number
    total: number
  }>
  subtotal: number
  tax: number
  total: number
  status: string
  orderDate: Date
  deliveryDate?: Date
}

interface Adjustment {
  id: string
  type: "stock" | "price"
  productId: string
  productName: string
  oldValue: number
  newValue: number
  reason: string
  timestamp: Date
  user: string
}

export default function ReportsModule() {
  const { user, hasPermission } = useAuth()
  const { formatCurrency } = useCurrency()
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [reportType, setReportType] = useState("sales")
  const [sales, setSales] = useState<Sale[]>([])
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [adjustments, setAdjustments] = useState<Adjustment[]>([])

  // Load data from localStorage
  useEffect(() => {
    const loadedSales = JSON.parse(localStorage.getItem("pos_sales") || "[]").map((sale: any) => ({
      ...sale,
      timestamp: new Date(sale.timestamp),
    }))
    setSales(loadedSales)

    const loadedPurchases = JSON.parse(localStorage.getItem("pos_purchases") || "[]").map((purchase: any) => ({
      ...purchase,
      orderDate: new Date(purchase.orderDate),
      deliveryDate: purchase.deliveryDate ? new Date(purchase.deliveryDate) : undefined,
    }))
    setPurchases(loadedPurchases)

    const loadedAdjustments = JSON.parse(localStorage.getItem("pos_adjustments") || "[]").map((adj: any) => ({
      ...adj,
      timestamp: new Date(adj.timestamp),
    }))
    setAdjustments(loadedAdjustments)
  }, [])

  // Filter data by date range
  const filterByDateRange = (data: any[], dateField: string) => {
    return data.filter((item) => {
      const itemDate = new Date(item[dateField])
      if (dateFrom && itemDate < dateFrom) return false
      if (dateTo && itemDate > dateTo) return false
      return true
    })
  }

  const filteredSales = filterByDateRange(sales, "timestamp")
  const filteredPurchases = filterByDateRange(purchases, "orderDate")
  const filteredAdjustments = filterByDateRange(adjustments, "timestamp")

  // Calculate summary statistics
  const salesSummary = {
    totalSales: filteredSales.reduce((sum, sale) => sum + sale.total, 0),
    totalTransactions: filteredSales.length,
    averageTransaction:
      filteredSales.length > 0 ? filteredSales.reduce((sum, sale) => sum + sale.total, 0) / filteredSales.length : 0,
    totalTax: filteredSales.reduce((sum, sale) => sum + sale.tax, 0),
  }

  const purchaseSummary = {
    totalPurchases: filteredPurchases.reduce((sum, purchase) => sum + purchase.total, 0),
    totalOrders: filteredPurchases.length,
    pendingOrders: filteredPurchases.filter((p) => p.status === "pending").length,
    completedOrders: filteredPurchases.filter((p) => p.status === "completed").length,
  }

  // Export functions
  const exportToCSV = (data: any[], filename: string) => {
    if (!hasPermission("export_reports")) {
      alert("You don't have permission to export reports")
      return
    }

    const headers = Object.keys(data[0] || {})
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            if (value instanceof Date) {
              return value.toISOString()
            }
            if (typeof value === "object") {
              return JSON.stringify(value)
            }
            return String(value).replace(/,/g, ";")
          })
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}_${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportToPDF = (reportType: string) => {
    if (!hasPermission("export_reports")) {
      alert("You don't have permission to export reports")
      return
    }

    // Mock PDF export - in real app, use a PDF library like jsPDF
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    let content = ""
    const dateRange =
      dateFrom && dateTo ? `${format(dateFrom, "MMM dd, yyyy")} - ${format(dateTo, "MMM dd, yyyy")}` : "All Time"

    switch (reportType) {
      case "sales":
        content = `
          <h1>Sales Report</h1>
          <p>Period: ${dateRange}</p>
          <h2>Summary</h2>
          <p>Total Sales: ${formatCurrency(salesSummary.totalSales)}</p>
          <p>Total Transactions: ${salesSummary.totalTransactions}</p>
          <p>Average Transaction: ${formatCurrency(salesSummary.averageTransaction)}</p>
          <h2>Transactions</h2>
          <table border="1" style="width: 100%; border-collapse: collapse;">
            <tr>
              <th>Sale ID</th>
              <th>Date</th>
              <th>Cashier</th>
              <th>Total</th>
              <th>Payment Method</th>
            </tr>
            ${filteredSales
              .map(
                (sale) => `
              <tr>
                <td>${sale.id}</td>
                <td>${format(sale.timestamp, "MMM dd, yyyy HH:mm")}</td>
                <td>${sale.cashier}</td>
                <td>${formatCurrency(sale.total)}</td>
                <td>${sale.paymentMethod}</td>
              </tr>
            `,
              )
              .join("")}
          </table>
        `
        break
      case "purchases":
        content = `
          <h1>Purchase Report</h1>
          <p>Period: ${dateRange}</p>
          <h2>Summary</h2>
          <p>Total Purchases: ${formatCurrency(purchaseSummary.totalPurchases)}</p>
          <p>Total Orders: ${purchaseSummary.totalOrders}</p>
          <p>Pending Orders: ${purchaseSummary.pendingOrders}</p>
          <h2>Purchase Orders</h2>
          <table border="1" style="width: 100%; border-collapse: collapse;">
            <tr>
              <th>Order ID</th>
              <th>Supplier</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
            ${filteredPurchases
              .map(
                (purchase) => `
              <tr>
                <td>${purchase.id}</td>
                <td>${purchase.supplier}</td>
                <td>${format(purchase.orderDate, "MMM dd, yyyy")}</td>
                <td>${formatCurrency(purchase.total)}</td>
                <td>${purchase.status}</td>
              </tr>
            `,
              )
              .join("")}
          </table>
        `
        break
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
            th { background-color: #f2f2f2; }
            h1, h2 { color: #333; }
          </style>
        </head>
        <body>
          ${content}
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>Select date range and report type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label>From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-[240px] justify-start text-left font-normal", !dateTo && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setDateFrom(undefined)
                setDateTo(undefined)
              }}
            >
              Clear Dates
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs value={reportType} onValueChange={setReportType}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
          <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        {/* Sales Report */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(salesSummary.totalSales)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{salesSummary.totalTransactions}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(salesSummary.averageTransaction)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tax</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(salesSummary.totalTax)}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Sales Transactions</CardTitle>
                  <CardDescription>Detailed list of all sales transactions</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => exportToCSV(filteredSales, "sales_report")}
                    disabled={!hasPermission("export_reports")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => exportToPDF("sales")}
                    disabled={!hasPermission("export_reports")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sale ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Cashier</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.id}</TableCell>
                        <TableCell>{format(sale.timestamp, "MMM dd, yyyy HH:mm")}</TableCell>
                        <TableCell>{sale.cashier}</TableCell>
                        <TableCell>{sale.items.length} items</TableCell>
                        <TableCell>
                          <Badge variant="outline">{sale.paymentMethod}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(sale.total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Purchase Report */}
        <TabsContent value="purchases" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(purchaseSummary.totalPurchases)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{purchaseSummary.totalOrders}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{purchaseSummary.pendingOrders}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{purchaseSummary.completedOrders}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Purchase Orders</CardTitle>
                  <CardDescription>Detailed list of all purchase orders</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => exportToCSV(filteredPurchases, "purchase_report")}
                    disabled={!hasPermission("export_reports")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => exportToPDF("purchases")}
                    disabled={!hasPermission("export_reports")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPurchases.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell className="font-medium">{purchase.id}</TableCell>
                        <TableCell>{purchase.supplier}</TableCell>
                        <TableCell>{format(purchase.orderDate, "MMM dd, yyyy")}</TableCell>
                        <TableCell>
                          <Badge variant={purchase.status === "completed" ? "default" : "secondary"}>
                            {purchase.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(purchase.total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Adjustments Report */}
        <TabsContent value="adjustments" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Inventory Adjustments</CardTitle>
                  <CardDescription>Stock and price adjustments history</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => exportToCSV(filteredAdjustments, "adjustments_report")}
                    disabled={!hasPermission("export_reports")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Old Value</TableHead>
                      <TableHead>New Value</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>User</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAdjustments.map((adjustment) => (
                      <TableRow key={adjustment.id}>
                        <TableCell>{format(adjustment.timestamp, "MMM dd, yyyy HH:mm")}</TableCell>
                        <TableCell>{adjustment.productName}</TableCell>
                        <TableCell>
                          <Badge variant={adjustment.type === "stock" ? "default" : "secondary"}>
                            {adjustment.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {adjustment.type === "price" ? formatCurrency(adjustment.oldValue) : adjustment.oldValue}
                        </TableCell>
                        <TableCell>
                          {adjustment.type === "price" ? formatCurrency(adjustment.newValue) : adjustment.newValue}
                        </TableCell>
                        <TableCell>{adjustment.reason}</TableCell>
                        <TableCell>{adjustment.user}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Report */}
        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status Report</CardTitle>
              <CardDescription>Current stock levels and valuation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Inventory report will show current stock levels</p>
                <p className="text-sm">Connect to inventory module for real-time data</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Report */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(salesSummary.totalSales)}</div>
                <p className="text-sm text-muted-foreground">Total sales revenue</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(purchaseSummary.totalPurchases)}</div>
                <p className="text-sm text-muted-foreground">Total purchase costs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gross Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(salesSummary.totalSales - purchaseSummary.totalPurchases)}
                </div>
                <p className="text-sm text-muted-foreground">Revenue minus expenses</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>Profit and loss overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Revenue:</span>
                  <span className="font-bold text-green-600">{formatCurrency(salesSummary.totalSales)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Expenses:</span>
                  <span className="font-bold text-red-600">{formatCurrency(purchaseSummary.totalPurchases)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tax Collected:</span>
                  <span className="font-bold">{formatCurrency(salesSummary.totalTax)}</span>
                </div>
                <hr />
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold">Gross Profit:</span>
                  <span className="font-bold text-blue-600">
                    {formatCurrency(salesSummary.totalSales - purchaseSummary.totalPurchases)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
