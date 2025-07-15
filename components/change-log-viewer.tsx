"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useChangeLog } from "@/hooks/use-change-log"
import { useAuth } from "@/hooks/use-auth"
import { Download, Search, Filter, Calendar } from "lucide-react"
import { format } from "date-fns"

export function ChangeLogViewer() {
  const { logs, getLogs, exportLogs } = useChangeLog()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStore, setFilterStore] = useState("all")
  const [filterEntity, setFilterEntity] = useState("all")
  const [filterAction, setFilterAction] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const filteredLogs = useMemo(() => {
    let filtered = getLogs({
      storeCode: filterStore === "all" ? undefined : filterStore,
      entity: filterEntity === "all" ? undefined : filterEntity,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })

    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.entity.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterAction !== "all") {
      filtered = filtered.filter((log) => log.action === filterAction)
    }

    // If user is not admin and not from main store, only show their store's logs
    if (user && !user.isMainStore && user.role !== "admin") {
      filtered = filtered.filter((log) => log.storeCode === user.storeCode)
    }

    return filtered
  }, [logs, searchTerm, filterStore, filterEntity, filterAction, startDate, endDate, user, getLogs])

  const uniqueStores = useMemo(() => {
    const stores = [...new Set(logs.map((log) => log.storeCode))]
    return stores.sort()
  }, [logs])

  const uniqueEntities = useMemo(() => {
    const entities = [...new Set(logs.map((log) => log.entity))]
    return entities.sort()
  }, [logs])

  const uniqueActions = useMemo(() => {
    const actions = [...new Set(logs.map((log) => log.action))]
    return actions.sort()
  }, [logs])

  const getActionBadgeVariant = (action: string) => {
    if (action.includes("CREATE")) return "default"
    if (action.includes("UPDATE")) return "secondary"
    if (action.includes("DELETE")) return "destructive"
    if (action.includes("LOGIN")) return "outline"
    return "secondary"
  }

  const handleExport = (format: "json" | "csv") => {
    const filters = {
      storeCode: filterStore === "all" ? undefined : filterStore,
      entity: filterEntity === "all" ? undefined : filterEntity,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }
    exportLogs(format, filters)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Activity Filters</span>
          </CardTitle>
          <CardDescription>Filter and search through system activity logs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Store</Label>
              <Select value={filterStore} onValueChange={setFilterStore}>
                <SelectTrigger>
                  <SelectValue placeholder="All stores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All stores</SelectItem>
                  {uniqueStores.map((store) => (
                    <SelectItem key={store} value={store}>
                      Store {store}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Entity</Label>
              <Select value={filterEntity} onValueChange={setFilterEntity}>
                <SelectTrigger>
                  <SelectValue placeholder="All entities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All entities</SelectItem>
                  {uniqueEntities.map((entity) => (
                    <SelectItem key={entity} value={entity}>
                      {entity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Action</Label>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger>
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actions</SelectItem>
                  {uniqueActions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("json")}
              className="flex items-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>Export JSON</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("csv")}
              className="flex items-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Logs ({filteredLogs.length} entries)</CardTitle>
          <CardDescription>Recent system activities and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No activity logs found matching your criteria</div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={getActionBadgeVariant(log.action)}>{log.action}</Badge>
                        <Badge variant="outline">{log.entity}</Badge>
                        <Badge variant="secondary">Store {log.storeCode}</Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{log.details}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>User: {log.userId}</span>
                        <span>Company: {log.companyId}</span>
                        <span>{format(new Date(log.timestamp), "MMM dd, yyyy HH:mm:ss")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
