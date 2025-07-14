"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Download, FileText, Filter, Printer } from "lucide-react"
import { useCurrency } from "@/hooks/use-currency"

// Mock data for reports
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
  {
    id: "PO-2024-003",
    date: "2024-01-20",
    supplier: "Global Imports Inc",
    items: [
      { id: "5", name: "Rice 5kg", quantity: 15, unitPrice: 3000, total: 45000 },
      { id: "6", name: "Cooking Oil 1L", quantity: 20, unitPrice: 1000, total: 20000 },
    ],
    status: "received",
    total: 65000,
  },
  {
    id: "PO-2024-004",
    date: "2024-01-22",
    supplier: "ABC Suppliers Ltd",
    items: [
      { id: "1", name: "Coca Cola 35cl", quantity: 100, unitPrice: 120, total: 12000 },
      { id: "7", name: "Sprite 35cl", quantity: 50, unitPrice: 120, total: 6000 },
    ],
    status: "received",
    total: 18000,
  },
  {
    id: "PO-2024-005",
    date: "2024-01-25",
    supplier: "Local Distributors",
    items: [
      { id: "8", name: "Sugar 1kg", quantity: 30, unitPrice: 800, total: 24000 },
      { id: "9", name: "Salt 500g", quantity: 40, unitPrice: 300, total: 12000 },
    ],
    status: "pending",
    total: 36000,
  },
]

const salesReports = [
  {
    id: "INV-2024-001",
    date: "2024-01-15",
    customer: "Walk-in Customer",
    items: [
      { id: "1", name: "Coca Cola 35cl", quantity: 2, unitPrice: 200, total: 400 },
      { id: "2", name: "Indomie Noodles", quantity: 3, unitPrice: 150, total: 450 },
    ],
    paymentMethod: "cash",
    total: 850,
  },
  {
    id: "INV-2024-002",
    date: "2024-01-15",
    customer: "Walk-in Customer",
    items: [
      { id: "3", name: "Peak Milk 400g", quantity: 1, unitPrice: 800, total: 800 },
      { id: "4", name: "Bread Loaf", quantity: 2, unitPrice: 500, total: 1000 },
    ],
    paymentMethod: "card",
    total: 1800,
  },
  {
    id: "INV-2024-003",
    date: "2024-01-16",
    customer: "John Doe",
    items: [
      { id: "5", name: "Rice 5kg", quantity: 1, unitPrice: 3500, total: 3500 },
      { id: "6", name: "Cooking Oil 1L", quantity: 2, unitPrice: 1200, total: 2400 },
    ],
    paymentMethod: "cash",
    total: 5900,
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
  {
    id: "3",
    name: "Peak Milk 400g",
    category: "Dairy",
    currentStock: 29,
    minStock: 10,
    costPrice: 600,
    sellingPrice: 800,
    value: 17400,
    lastRestocked: "2024-01-18",
  },
  {
    id: "4",
    name: "Bread Loaf",
    category: "Bakery",
    currentStock: 23,
    minStock: 10,
    costPrice: 400,
    sellingPrice: 500,
    value: 9200,
    lastRestocked: "2024-01-18",
  },
  {
    id: "5",
    name: "Rice 5kg",
    category: "Grains",
    currentStock: 14,
    minStock: 5,
    costPrice: 3000,
    sellingPrice: 3500,
    value: 42000,
    lastRestocked: "2024-01-20",
  },
]

export default function ReportsModule() {
  const { formatCurrency } = useCurrency()
  const [activeTab, setActiveTab] = useState("purchases")
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

  const handleExportReport = (format: string) => {
    alert(`Exporting report as ${format}...`)
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
          <Select onValueChange={handleExportReport}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Export Report" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">Export as PDF</SelectItem>
              <SelectItem value="excel">Export as Excel</SelectItem>
              <SelectItem value="csv">Export as CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="purchases">Purchase Reports</TabsTrigger>
          <TabsTrigger value="sales">Sales Reports</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
          <TabsTrigger value="financial">Financial Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="purchases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Reports</CardTitle>
              <CardDescription>View and analyze purchase orders and invoices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={new Date()}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Supplier</Label>
                  <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Suppliers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Suppliers</SelectItem>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier} value={supplier}>
                          {supplier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Apply Filters
                  </Button>
                </div>
              </div>

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

          {/* Purchase Report Details */}
          {showReportDetails && selectedReport && (
            <Card className="print:block" id="report-details">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Purchase Order Details</CardTitle>
                  <CardDescription>Order ID: {selectedReport.id}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setShowReportDetails(false)}>
                    Close
                  </Button>
                  <Button variant="outline" size="sm" onClick={handlePrintReport}>
                    <Printer className="h-4 w-4 mr-1" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExportReport("pdf")}>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Order Information</h3>
                    <div className="mt-1 space-y-1">
                      <p>
                        <span className="font-medium">Order ID:</span> {selectedReport.id}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span> {selectedReport.date}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        <Badge className={getStatusColor(selectedReport.status)}>{selectedReport.status}</Badge>
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Supplier Information</h3>
                    <div className="mt-1 space-y-1">
                      <p>
                        <span className="font-medium">Supplier:</span> {selectedReport.supplier}
                      </p>
                      <p>
                        <span className="font-medium">Contact:</span> +234 123 456 7890
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> contact@
                        {selectedReport.supplier.toLowerCase().replace(/\s+/g, "")}.com
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Items</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedReport.items.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Subtotal
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(selectedReport.total)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Tax (0%)
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(0)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-bold">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(selectedReport.total)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                  <p className="text-sm text-muted-foreground">
                    This purchase order was created on {selectedReport.date}. Please contact the supplier for any
                    inquiries regarding this order.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Reports</CardTitle>
              <CardDescription>View and analyze sales transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Sales reports are available but not shown in this preview.</p>
                <p className="text-sm text-muted-foreground">
                  The structure is similar to purchase reports with sales-specific data.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Reports</CardTitle>
              <CardDescription>View and analyze inventory levels and values</CardDescription>
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
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>View and analyze financial performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Financial reports are available but not shown in this preview.</p>
                <p className="text-sm text-muted-foreground">
                  These would include profit & loss statements, expense reports, and more.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
