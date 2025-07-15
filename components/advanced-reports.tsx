"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCurrency } from "@/hooks/use-currency"
import { useStore } from "@/hooks/use-store"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { Download, TrendingUp, DollarSign, Package, ShoppingCart, MapPin } from "lucide-react"

// Mock data for different report types
const salesData = [
  { date: "2024-01-01", sales: 2500, transactions: 45, profit: 750 },
  { date: "2024-01-02", sales: 1800, transactions: 32, profit: 540 },
  { date: "2024-01-03", sales: 3200, transactions: 58, profit: 960 },
  { date: "2024-01-04", sales: 2100, transactions: 38, profit: 630 },
  { date: "2024-01-05", sales: 2800, transactions: 51, profit: 840 },
  { date: "2024-01-06", sales: 3500, transactions: 62, profit: 1050 },
  { date: "2024-01-07", sales: 2900, transactions: 49, profit: 870 },
]

const purchaseData = [
  { date: "2024-01-01", purchases: 1500, orders: 8, suppliers: 3 },
  { date: "2024-01-02", purchases: 2200, orders: 12, suppliers: 4 },
  { date: "2024-01-03", purchases: 1800, orders: 9, suppliers: 3 },
  { date: "2024-01-04", purchases: 2500, orders: 15, suppliers: 5 },
  { date: "2024-01-05", purchases: 1900, orders: 10, suppliers: 4 },
  { date: "2024-01-06", purchases: 2800, orders: 18, suppliers: 6 },
  { date: "2024-01-07", purchases: 2100, orders: 13, suppliers: 4 },
]

const categoryData = [
  { name: "Electronics", value: 35, sales: 15000 },
  { name: "Accessories", value: 25, sales: 8500 },
  { name: "Software", value: 20, sales: 6200 },
  { name: "Hardware", value: 15, sales: 4800 },
  { name: "Others", value: 5, sales: 1500 },
]

const storeComparisonData = [
  { store: "Main Store", sales: 25000, purchases: 15000, profit: 7500 },
  { store: "North Branch", sales: 18000, purchases: 11000, profit: 5400 },
  { store: "South Branch", sales: 22000, purchases: 13500, profit: 6600 },
  { store: "East Branch", sales: 16000, purchases: 9800, profit: 4800 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function AdvancedReports() {
  const { formatCurrency } = useCurrency()
  const { stores, currentStore } = useStore()

  const [reportType, setReportType] = useState("overview")
  const [dateRange, setDateRange] = useState("week")
  const [selectedStore, setSelectedStore] = useState(currentStore?.id || "all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [chartType, setChartType] = useState("bar")

  const handleExport = (format: string) => {
    // Implementation for exporting reports
    console.log(`Exporting ${reportType} report as ${format}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Advanced Analytics & Reports</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("csv")}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport("pdf")}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Business Overview</SelectItem>
                  <SelectItem value="sales">Sales Analytics</SelectItem>
                  <SelectItem value="purchases">Purchase Analytics</SelectItem>
                  <SelectItem value="inventory">Inventory Analytics</SelectItem>
                  <SelectItem value="comparison">Store Comparison</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Store Location</Label>
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stores</SelectItem>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
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

            <div className="space-y-2">
              <Label>Chart Type</Label>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {dateRange === "custom" && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Content */}
      <Tabs value={reportType} onValueChange={setReportType}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Total Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(18700)}</p>
                    <p className="text-xs text-green-600">+12.5% from last week</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Total Orders</p>
                    <p className="text-2xl font-bold">335</p>
                    <p className="text-xs text-blue-600">+8.2% from last week</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">Profit Margin</p>
                    <p className="text-2xl font-bold">28.5%</p>
                    <p className="text-xs text-purple-600">+2.1% from last week</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">Avg Order Value</p>
                    <p className="text-2xl font-bold">{formatCurrency(55.82)}</p>
                    <p className="text-xs text-orange-600">+3.7% from last week</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Combined Sales & Purchase Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Sales vs Purchases Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                {chartType === "bar" && (
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="sales" fill="#8884d8" name="Sales" />
                    <Bar dataKey="profit" fill="#82ca9d" name="Profit" />
                  </BarChart>
                )}
                {chartType === "line" && (
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Sales" />
                    <Line type="monotone" dataKey="profit" stroke="#82ca9d" name="Profit" />
                  </LineChart>
                )}
                {chartType === "area" && (
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Area type="monotone" dataKey="sales" stackId="1" stroke="#8884d8" fill="#8884d8" name="Sales" />
                    <Area type="monotone" dataKey="profit" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Profit" />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Sales Table */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Sales Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date</th>
                      <th className="text-right p-2">Sales</th>
                      <th className="text-right p-2">Transactions</th>
                      <th className="text-right p-2">Avg Order</th>
                      <th className="text-right p-2">Profit</th>
                      <th className="text-right p-2">Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData.map((day, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{new Date(day.date).toLocaleDateString()}</td>
                        <td className="text-right p-2">{formatCurrency(day.sales)}</td>
                        <td className="text-right p-2">{day.transactions}</td>
                        <td className="text-right p-2">{formatCurrency(day.sales / day.transactions)}</td>
                        <td className="text-right p-2">{formatCurrency(day.profit)}</td>
                        <td className="text-right p-2">{((day.profit / day.sales) * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Purchase Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Purchase Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={purchaseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Area type="monotone" dataKey="purchases" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Purchase Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Purchase Orders & Suppliers</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={purchaseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" fill="#8884d8" name="Orders" />
                    <Bar dataKey="suppliers" fill="#82ca9d" name="Suppliers" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Total Products</p>
                    <p className="text-2xl font-bold">1,247</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">In Stock</p>
                    <p className="text-2xl font-bold">1,089</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">Low Stock</p>
                    <p className="text-2xl font-bold">158</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Turnover by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="sales" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          {/* Store Performance Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Store Performance Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={storeComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="store" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" name="Sales" />
                  <Bar dataKey="purchases" fill="#82ca9d" name="Purchases" />
                  <Bar dataKey="profit" fill="#ffc658" name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Store Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Store Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Store</th>
                      <th className="text-right p-2">Sales</th>
                      <th className="text-right p-2">Purchases</th>
                      <th className="text-right p-2">Profit</th>
                      <th className="text-right p-2">Margin</th>
                      <th className="text-right p-2">ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {storeComparisonData.map((store, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{store.store}</td>
                        <td className="text-right p-2">{formatCurrency(store.sales)}</td>
                        <td className="text-right p-2">{formatCurrency(store.purchases)}</td>
                        <td className="text-right p-2">{formatCurrency(store.profit)}</td>
                        <td className="text-right p-2">{((store.profit / store.sales) * 100).toFixed(1)}%</td>
                        <td className="text-right p-2">{((store.profit / store.purchases) * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
