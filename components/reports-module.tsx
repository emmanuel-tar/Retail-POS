"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Printer, FileSpreadsheet } from "lucide-react"
import { useCurrency } from "@/hooks/use-currency"

// Mock data for comprehensive reports
const purchaseReports = [
  {
    id: "PO-2024-001",
    date: "2024-01-15",
    supplier: "ABC Suppliers Ltd",
    items: [
      { id: "1", name: "Coca Cola 35cl", quantity: 50, unitPrice: 120, total: 6000 },
      { id: "2", name: "Indomie Noodles", quantity: 100, unitPrice: 100, total: 10000 },
    ],
    status: "received",
    total: 16000,
  },
  {
    id: "PO-2024-002",
    date: "2024-01-18",
    supplier: "XYZ Trading Co",
    items: [
      { id: "3", name: "Peak Milk 400g", quantity: 30, unitPrice: 600, total: 18000 },
      { id: "4", name: "Bread Loaf", quantity: 25, unitPrice: 400, total: 10000 },
    ],
    status: "pending",
    total: 28000,
  },
]

const salesReports = [
  {
    id: "SALE-2024-001",
    date: "2024-01-15",
    cashier: "John Seller",
    items: [
      { id: "1", name: "Coca Cola 35cl", quantity: 2, unitPrice: 200, total: 400 },
      { id: "2", name: "Indomie Noodles", quantity: 3, unitPrice: 150, total: 450 },
    ],
    paymentMethod: "cash",
    subtotal: 850,
    tax: 63.75,
    total: 913.75,
  },
  {
    id: "SALE-2024-002",
    date: "2024-01-15",
    cashier: "Jane Seller",
    items: [
      { id: "3", name: "Peak Milk 400g", quantity: 1, unitPrice: 800, total: 800 },
      { id: "4", name: "Bread Loaf", quantity: 2, unitPrice: 500, total: 1000 },
    ],
    paymentMethod: "card",
    subtotal: 1800,
    tax: 135,
    total: 1935,
  },
]

const adjustmentReports = [
  {
    id: "ADJ-2024-001",
    date: "2024-01-16",
    product: "Coca Cola 35cl",
    type: "Stock Count",
    previousQty: 50,
    newQty: 48,
    difference: -2,
    reason: "Damaged items",
    adjustedBy: "Manager",
  },
  {
    id: "ADJ-2024-002",
    date: "2024-01-17",
    product: "Rice 5kg",
    type: "Price Adjustment",
    previousPrice: 3500,
    newPrice: 3600,
    difference: 100,
    reason: "Supplier price increase",
    adjustedBy: "Manager",
  },
]

const inventoryReports = [
  {
    id: "1",
    name: "Coca Cola 35cl",
    category: "Beverages",
    currentStock: 148,
    minStock: 20,
    costPrice: 120,
    sellingPrice: 200,
    value: 17760,
    lastRestocked: "2024-01-22",
  },
  {
    id: "2",
    name: "Indomie Noodles",
    category: "Food",
    currentStock: 97,
    minStock: 15,
    costPrice: 100,
    sellingPrice: 150,
    value: 9700,
    lastRestocked: "2024-01-15",
  },
]

const financialReports = {
  revenue: {
    daily: 2848.75,
    weekly: 19941.25,
    monthly: 85632.5,
  },
  expenses: {
    daily: 1200,
    weekly: 8400,
    monthly: 36000,
  },
  profit: {
    daily: 1648.75,
    weekly: 11541.25,
    monthly: 49632.5,
  },
  topProducts: [
    { name: "Coca Cola 35cl", revenue: 8000, quantity: 40 },
    { name: "Rice 5kg", revenue: 7200, quantity: 2 },
    { name: "Peak Milk 400g", revenue: 6400, quantity: 8 },
  ],
}

export default function ReportsModule() {
  const { formatCurrency } = useCurrency()
  const [activeTab, setActiveTab] = useState("sales")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [supplierFilter, setSupplierFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [showReportDetails, setShowReportDetails] = useState(false)

  // Get unique suppliers from purchase reports
  const suppliers = Array.from(new Set(purchaseReports.map((report) => report.supplier)))

  // Filter purchase reports based on selected filters
  const filteredPurchaseReports = purchaseReports.filter((report) => {
    const matchesSupplier = supplierFilter === "all" || report.supplier === supplierFilter
    const matchesStatus = statusFilter === "all" || report.status === statusFilter

    // Date filter
    let matchesDate = true
    if (dateRange.from && dateRange.to) {
      const reportDate = new Date(report.date)
      matchesDate = reportDate >= dateRange.from && reportDate <= dateRange.to
    }

    return matchesSupplier && matchesStatus && matchesDate
  })

  const handleViewReport = (report: any) => {
    setSelectedReport(report)
    setShowReportDetails(true)
  }

  const handlePrintReport = () => {
    window.print()
  }

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            return typeof value === "string" && value.includes(",") ? `"${value}"` : value
          })
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToPDF = (reportType: string) => {
    // In a real application, you would use a library like jsPDF
    alert(`PDF export for ${reportType} would be implemented with a PDF library like jsPDF`)
  }

  const handleExportReport = (format: string, reportType: string) => {
    let data: any[] = []
    let filename = ""

    switch (reportType) {
      case "sales":
        data = salesReports.map((sale) => ({
          ID: sale.id,
          Date: sale.date,
          Cashier: sale.cashier,
          Items: sale.items.length,
          Subtotal: sale.subtotal,
          Tax: sale.tax,
          Total: sale.total,
          Payment: sale.paymentMethod,
        }))
        filename = "sales-report"
        break
      case "purchases":
        data = purchaseReports.map((purchase) => ({
          ID: purchase.id,
          Date: purchase.date,
          Supplier: purchase.supplier,
          Items: purchase.items.length,
          Status: purchase.status,
          Total: purchase.total,
        }))
        filename = "purchase-report"
        break
      case "adjustments":
        data = adjustmentReports.map((adj) => ({
          ID: adj.id,
          Date: adj.date,
          Product: adj.product,
          Type: adj.type,
          Difference: adj.difference,
          Reason: adj.reason,
          AdjustedBy: adj.adjustedBy,
        }))
        filename = "adjustment-report"
        break
      case "inventory":
        data = inventoryReports.map((item) => ({
          Product: item.name,
          Category: item.category,
          CurrentStock: item.currentStock,
          MinStock: item.minStock,
          CostPrice: item.costPrice,
          SellingPrice: item.sellingPrice,
          TotalValue: item.value,
          LastRestocked: item.lastRestocked,
        }))
        filename = "inventory-report"
        break
    }

    if (format === "csv") {
      exportToCSV(data, filename)
    } else if (format === "pdf") {
      exportToPDF(reportType)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "received":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAdjustmentTypeColor = (type: string) => {
    switch (type) {
      case "Stock Count":
        return "bg-blue-100 text-blue-800"
      case "Price Adjustment":
        return "bg-purple-100 text-purple-800"
      case "Damage":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Calculate total value of inventory
  const totalInventoryValue = inventoryReports.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Reports & Analytics</h2>
          <p className="text-muted-foreground">Generate and view detailed reports for your business</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrintReport}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sales">Sales Reports</TabsTrigger>
          <TabsTrigger value="purchases">Purchase Reports</TabsTrigger>
          <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
          <TabsTrigger value="financial">Financial Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Sales Reports</CardTitle>
                  <CardDescription>View and analyze sales transactions</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => handleExportReport("csv", "sales")}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button variant="outline" onClick={() => handleExportReport("pdf", "sales")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{salesReports.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(salesReports.reduce((sum, sale) => sum + sale.total, 0))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(
                        salesReports.length > 0
                          ? salesReports.reduce((sum, sale) => sum + sale.total, 0) / salesReports.length
                          : 0,
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">Total Tax</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(salesReports.reduce((sum, sale) => sum + sale.tax, 0))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sales Reports Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sale ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Cashier</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesReports.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.id}</TableCell>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>{sale.cashier}</TableCell>
                      <TableCell>{sale.items.length} items</TableCell>
                      <TableCell>
                        <Badge variant="outline">{sale.paymentMethod}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(sale.subtotal)}</TableCell>
                      <TableCell>{formatCurrency(sale.tax)}</TableCell>
                      <TableCell>{formatCurrency(sale.total)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleViewReport(sale)}>
                          <FileText className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Purchase Reports</CardTitle>
                  <CardDescription>View and analyze purchase orders and invoices</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => handleExportReport("csv", "purchases")}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button variant="outline" onClick={() => handleExportReport("pdf", "purchases")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">Total Purchase Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{filteredPurchaseReports.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(filteredPurchaseReports.reduce((sum, report) => sum + report.total, 0))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(
                        filteredPurchaseReports.length > 0
                          ? filteredPurchaseReports.reduce((sum, report) => sum + report.total, 0) /
                              filteredPurchaseReports.length
                          : 0,
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Purchase Reports Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPurchaseReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.id}</TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>{report.supplier}</TableCell>
                      <TableCell>{report.items.length} items</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(report.total)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleViewReport(report)}>
                          <FileText className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adjustments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Adjustment Reports</CardTitle>
                  <CardDescription>View inventory and price adjustments</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => handleExportReport("csv", "adjustments")}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button variant="outline" onClick={() => handleExportReport("pdf", "adjustments")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Adjustment ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Difference</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Adjusted By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adjustmentReports.map((adjustment) => (
                    <TableRow key={adjustment.id}>
                      <TableCell className="font-medium">{adjustment.id}</TableCell>
                      <TableCell>{adjustment.date}</TableCell>
                      <TableCell>{adjustment.product}</TableCell>
                      <TableCell>
                        <Badge className={getAdjustmentTypeColor(adjustment.type)}>{adjustment.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={adjustment.difference > 0 ? "text-green-600" : "text-red-600"}>
                          {adjustment.type === "Price Adjustment"
                            ? formatCurrency(adjustment.difference)
                            : adjustment.difference}
                        </span>
                      </TableCell>
                      <TableCell>{adjustment.reason}</TableCell>
                      <TableCell>{adjustment.adjustedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Inventory Reports</CardTitle>
                  <CardDescription>View and analyze inventory levels and values</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => handleExportReport("csv", "inventory")}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button variant="outline" onClick={() => handleExportReport("pdf", "inventory")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{inventoryReports.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalInventoryValue)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {inventoryReports.filter((item) => item.currentStock <= item.minStock).length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Inventory Reports Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Current Stock</TableHead>
                    <TableHead className="text-right">Min Stock</TableHead>
                    <TableHead className="text-right">Cost Price</TableHead>
                    <TableHead className="text-right">Selling Price</TableHead>
                    <TableHead className="text-right">Total Value</TableHead>
                    <TableHead>Last Restocked</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryReports.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          className={
                            item.currentStock <= item.minStock
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {item.currentStock}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{item.minStock}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.costPrice)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.sellingPrice)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.value)}</TableCell>
                      <TableCell>{item.lastRestocked}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Financial Reports</CardTitle>
                  <CardDescription>View and analyze financial performance</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => exportToCSV([financialReports], "financial-report")}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button variant="outline" onClick={() => exportToPDF("financial")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Revenue, Expenses, Profit Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Revenue</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Daily:</span>
                      <span className="font-bold">{formatCurrency(financialReports.revenue.daily)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weekly:</span>
                      <span className="font-bold">{formatCurrency(financialReports.revenue.weekly)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly:</span>
                      <span className="font-bold">{formatCurrency(financialReports.revenue.monthly)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Expenses</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Daily:</span>
                      <span className="font-bold text-red-600">{formatCurrency(financialReports.expenses.daily)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weekly:</span>
                      <span className="font-bold text-red-600">{formatCurrency(financialReports.expenses.weekly)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly:</span>
                      <span className="font-bold text-red-600">
                        {formatCurrency(financialReports.expenses.monthly)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Profit</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Daily:</span>
                      <span className="font-bold text-green-600">{formatCurrency(financialReports.profit.daily)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weekly:</span>
                      <span className="font-bold text-green-600">{formatCurrency(financialReports.profit.weekly)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly:</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(financialReports.profit.monthly)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                        <TableHead className="text-right">Quantity Sold</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {financialReports.topProducts.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.revenue)}</TableCell>
                          <TableCell className="text-right">{product.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
