"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useChangeLog } from "@/hooks/use-change-log"
import { useAuth } from "@/hooks/use-auth"
import { Download, Filter, RefreshCw, Trash2, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ChangeLogViewer() {
  const { logs, getLogsByStore, getLogsByUser, getLogsByEntity, getLogsByDateRange, clearLogs, exportLogs } =
    useChangeLog()
  const { user } = useAuth()
  const { toast } = useToast()
  const [filteredLogs, setFilteredLogs] = useState(logs)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterValue, setFilterValue] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const applyFilters = () => {
    let filtered = logs

    // Apply filter type
    switch (filterType) {
      case "store":
        filtered = filterValue ? getLogsByStore(filterValue) : logs
        break
      case "user":
        filtered = filterValue ? getLogsByUser(filterValue) : logs
        break
      case "entity":
        filtered = filterValue ? getLogsByEntity(filterValue) : logs
        break
      case "dateRange":
        if (startDate && endDate) {
          filtered = getLogsByDateRange(startDate, endDate)
        }
        break
      default:
        filtered = logs
    }

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.entity.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // If not main store, only show logs from current store
    if (user && !user.isMainStore) {
      filtered = filtered.filter((log) => log.storeCode === user.storeCode)
    }

    setFilteredLogs(filtered)
  }

  const handleExport = (format: "json" | "csv") => {
    const exportData = exportLogs(format)
    const blob = new Blob([exportData], {
      type: format === "json" ? "application/json" : "text/csv",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `change-logs-${new Date().toISOString().split("T")[0]}.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Export Successful",
      description: `Change logs exported as ${format.toUpperCase()}`,
    })
  }

  const handleClearLogs = () => {
    if (user?.role === "admin") {
      clearLogs()
      setFilteredLogs([])
      toast({
        title: "Logs Cleared",
        description: "All change logs have been cleared",
      })
    }
  }

  const getActionBadgeColor = (action: string) => {
    switch (action.split("_")[0]) {
      case "CREATE":
        return "bg-green-100 text-green-800"
      case "UPDATE":
        return "bg-blue-100 text-blue-800"
      case "DELETE":
        return "bg-red-100 text-red-800"
      case "USER":
        return "bg-purple-100 text-purple-800"
      case "SALE":
        return "bg-yellow-100 text-yellow-800"
      case "INVENTORY":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Change Log Viewer
          </CardTitle>
          <CardDescription>
            Track all system activities and changes across stores
            {!user?.isMainStore && " (Current store only)"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="filterType">Filter Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select filter type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Logs</SelectItem>
                  {user?.isMainStore && <SelectItem value="store">By Store</SelectItem>}
                  <SelectItem value="user">By User</SelectItem>
                  <SelectItem value="entity">By Entity</SelectItem>
                  <SelectItem value="dateRange">Date Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filterType === "store" && user?.isMainStore && (
              <div>
                <Label htmlFor="filterValue">Store Code</Label>
                <Input
                  id="filterValue"
                  placeholder="Enter store code"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                />
              </div>
            )}

            {filterType === "user" && (
              <div>
                <Label htmlFor="filterValue">User ID</Label>
                <Input
                  id="filterValue"
                  placeholder="Enter user ID"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                />
              </div>
            )}

            {filterType === "entity" && (
              <div>
                <Label htmlFor="filterValue">Entity Type</Label>
                <Select value={filterValue} onValueChange={setFilterValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Sale">Sale</SelectItem>
                    <SelectItem value="Purchase">Purchase</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Store">Store</SelectItem>
                    <SelectItem value="Authentication">Authentication</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {filterType === "dateRange" && (
              <>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </>
            )}
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={applyFilters} variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
              <Button onClick={() => handleExport("csv")} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button onClick={() => handleExport("json")} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                JSON
              </Button>
              {user?.role === "admin" && (
                <Button onClick={handleClearLogs} variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Logs Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Details</TableHead>
                  {user?.isMainStore && <TableHead>Store</TableHead>}
                  <TableHead>User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={user?.isMainStore ? 6 : 5} className="text-center py-8 text-gray-500">
                      No change logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.slice(0, 100).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">{formatTimestamp(log.timestamp)}</TableCell>
                      <TableCell>
                        <Badge className={getActionBadgeColor(log.action)}>{log.action.replace(/_/g, " ")}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{log.entity}</TableCell>
                      <TableCell className="max-w-xs truncate" title={log.details}>
                        {log.details}
                      </TableCell>
                      {user?.isMainStore && (
                        <TableCell>
                          <Badge variant="outline">{log.storeCode}</Badge>
                        </TableCell>
                      )}
                      <TableCell>{log.userId}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length > 100 && (
            <p className="text-sm text-gray-500 text-center">
              Showing first 100 entries of {filteredLogs.length} total logs
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
