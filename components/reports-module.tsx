"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCurrency } from "@/hooks/use-currency"
import { BarChart, Download, Calendar, TrendingUp, DollarSign, Package } from "lucide-react"

interface SalesReport {
  date: string
  total_sales: number
  transactions: number
  avg_transaction: number
}

interface ProductReport {
  product_name: string
  quantity_sold: number
  revenue: number
  profit: number
}

export default function ReportsModule() {
  const { formatCurrency } = useCurrency()
  const [reportType, setReportType] = useState("sales")
  const [dateRange, setDateRange] = useState("today")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Mock data
  const salesData: SalesReport[] = [
    { date: "2024-01-15", total_sales: 2500.0, transactions: 45, avg_transaction: 55.56 },
    { date: "2024-01-14", total_sales: 1800.0, transactions: 32, avg_transaction: 56.25 },
    { date: "2024-01-13", total_sales: 3200.0, transactions: 58, avg_transaction: 55.17 },
  ]

  const productData: ProductReport[] = [
    { product_name: "Laptop Pro", quantity_sold: 15, revenue: 18000.0, profit: 6000.0 },
    { product_name: "Wireless Mouse", quantity_sold: 120, revenue: 3060.0, profit: 1260.0 },
    { product_name: "Mechanical Keyboard", quantity_sold: 45, revenue: 3825.0, profit: 1575.0 },
  ]

  const handleExportCSV = () => {
    let csvContent = ""
    let filename = ""

    if (reportType === "sales") {
      csvContent = "Date,Total Sales,Transactions,Average Transaction\n"
      salesData.forEach((row) => {
        csvContent += `${row.date},${row.total_sales},${row.transactions},${row.avg_transaction}\n`
      })
      filename = "sales_report.csv"
    } else if (reportType === "products") {
      csvContent = "Product,Quantity Sold,Revenue,Profit\n"
      productData.forEach((row) => {
        csvContent += `${row.product_name},${row.quantity_sold},${row.revenue},${row.profit}\n`
      })
      filename = "product_report.csv"
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getTotalSales = () => salesData.reduce((sum, day) => sum + day.total_sales, 0)
  const getTotalTransactions = () => salesData.reduce((sum, day) => sum + day.transactions, 0)
  const getAverageTransaction = () => {
    const total = getTotalSales()
    const count = getTotalTransactions()
    return count > 0 ? total / count : 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        <Button onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="products">Product Performance</SelectItem>
                  <SelectItem value="inventory">Inventory Report</SelectItem>
                  <SelectItem value="financial">Financial Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {dateRange === "custom" && (
              <>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {reportType === "sales" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Total Sales</p>
                  <p className="text-2xl font-bold">{formatCurrency(getTotalSales())}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Transactions</p>
                  <p className="text-2xl font-bold">{getTotalTransactions()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">Avg Transaction</p>
                  <p className="text-2xl font-bold">{formatCurrency(getAverageTransaction())}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Days Analyzed</p>
                  <p className="text-2xl font-bold">{salesData.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Report Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {reportType === "sales" && "Daily Sales Report"}
            {reportType === "products" && "Product Performance Report"}
            {reportType === "inventory" && "Inventory Status Report"}
            {reportType === "financial" && "Financial Summary Report"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reportType === "sales" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Total Sales</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Average Transaction</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesData.map((day, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(day.date).toLocaleDateString()}</TableCell>
                    <TableCell>{formatCurrency(day.total_sales)}</TableCell>
                    <TableCell>{day.transactions}</TableCell>
                    <TableCell>{formatCurrency(day.avg_transaction)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {reportType === "products" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity Sold</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Profit</TableHead>
                  <TableHead>Profit Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productData.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{product.product_name}</TableCell>
                    <TableCell>{product.quantity_sold}</TableCell>
                    <TableCell>{formatCurrency(product.revenue)}</TableCell>
                    <TableCell>{formatCurrency(product.profit)}</TableCell>
                    <TableCell>{((product.profit / product.revenue) * 100).toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {reportType === "inventory" && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Inventory report data will be displayed here</p>
            </div>
          )}

          {reportType === "financial" && (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Financial summary data will be displayed here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
