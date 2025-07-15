"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface ChangeLogEntry {
  id: string
  timestamp: string
  action: string
  entity: string
  entityId: string
  details: string
  userId: string
  userName?: string
  storeCode: string
  storeName?: string
  companyId: string
  companyName?: string
}

interface ChangeLogContextType {
  logs: ChangeLogEntry[]
  logChange: (entry: Omit<ChangeLogEntry, "id" | "timestamp">) => void
  getLogs: (filters?: {
    storeCode?: string
    userId?: string
    entity?: string
    startDate?: string
    endDate?: string
  }) => ChangeLogEntry[]
  exportLogs: (format: "json" | "csv", filters?: any) => void
}

const ChangeLogContext = createContext<ChangeLogContextType | undefined>(undefined)

export function ChangeLogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<ChangeLogEntry[]>([])

  useEffect(() => {
    // Load existing logs from localStorage
    const storedLogs = localStorage.getItem("pos_change_logs")
    if (storedLogs) {
      try {
        setLogs(JSON.parse(storedLogs))
      } catch (error) {
        console.error("Error loading change logs:", error)
      }
    }
  }, [])

  const logChange = (entry: Omit<ChangeLogEntry, "id" | "timestamp">) => {
    const newEntry: ChangeLogEntry = {
      ...entry,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    }

    setLogs((prevLogs) => {
      const updatedLogs = [newEntry, ...prevLogs]
      // Keep only last 1000 entries to prevent storage overflow
      const trimmedLogs = updatedLogs.slice(0, 1000)
      localStorage.setItem("pos_change_logs", JSON.stringify(trimmedLogs))
      return trimmedLogs
    })
  }

  const getLogs = (filters?: {
    storeCode?: string
    userId?: string
    entity?: string
    startDate?: string
    endDate?: string
  }) => {
    if (!filters) return logs

    return logs.filter((log) => {
      if (filters.storeCode && log.storeCode !== filters.storeCode) return false
      if (filters.userId && log.userId !== filters.userId) return false
      if (filters.entity && log.entity !== filters.entity) return false
      if (filters.startDate && log.timestamp < filters.startDate) return false
      if (filters.endDate && log.timestamp > filters.endDate) return false
      return true
    })
  }

  const exportLogs = (format: "json" | "csv", filters?: any) => {
    const filteredLogs = getLogs(filters)

    if (format === "json") {
      const dataStr = JSON.stringify(filteredLogs, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `change-logs-${new Date().toISOString().split("T")[0]}.json`
      link.click()
    } else if (format === "csv") {
      const headers = ["Timestamp", "Action", "Entity", "Details", "User ID", "Store Code", "Company ID"]
      const csvContent = [
        headers.join(","),
        ...filteredLogs.map((log) =>
          [
            log.timestamp,
            log.action,
            log.entity,
            `"${log.details.replace(/"/g, '""')}"`,
            log.userId,
            log.storeCode,
            log.companyId,
          ].join(","),
        ),
      ].join("\n")

      const dataBlob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `change-logs-${new Date().toISOString().split("T")[0]}.csv`
      link.click()
    }
  }

  return (
    <ChangeLogContext.Provider value={{ logs, logChange, getLogs, exportLogs }}>{children}</ChangeLogContext.Provider>
  )
}

export function useChangeLog() {
  const context = useContext(ChangeLogContext)
  if (context === undefined) {
    throw new Error("useChangeLog must be used within a ChangeLogProvider")
  }
  return context
}
