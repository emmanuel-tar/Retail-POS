"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface ChangeLogEntry {
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
  metadata?: Record<string, any>
}

interface ChangeLogContextType {
  logs: ChangeLogEntry[]
  logChange: (entry: Omit<ChangeLogEntry, "id" | "timestamp">) => void
  getLogsByStore: (storeCode: string) => ChangeLogEntry[]
  getLogsByUser: (userId: string) => ChangeLogEntry[]
  getLogsByEntity: (entity: string) => ChangeLogEntry[]
  getLogsByDateRange: (startDate: string, endDate: string) => ChangeLogEntry[]
  clearLogs: () => void
  exportLogs: (format: "json" | "csv") => string
}

const ChangeLogContext = createContext<ChangeLogContextType | undefined>(undefined)

export function ChangeLogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<ChangeLogEntry[]>([])

  useEffect(() => {
    // Load logs from localStorage
    const storedLogs = localStorage.getItem("pos_change_logs")
    if (storedLogs) {
      try {
        const parsedLogs = JSON.parse(storedLogs)
        setLogs(parsedLogs)
      } catch (error) {
        console.error("Error loading change logs:", error)
      }
    }
  }, [])

  const logChange = (entry: Omit<ChangeLogEntry, "id" | "timestamp">) => {
    const newEntry: ChangeLogEntry = {
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    }

    const updatedLogs = [newEntry, ...logs].slice(0, 10000) // Keep only last 10,000 entries
    setLogs(updatedLogs)
    localStorage.setItem("pos_change_logs", JSON.stringify(updatedLogs))
  }

  const getLogsByStore = (storeCode: string) => {
    return logs.filter((log) => log.storeCode === storeCode)
  }

  const getLogsByUser = (userId: string) => {
    return logs.filter((log) => log.userId === userId)
  }

  const getLogsByEntity = (entity: string) => {
    return logs.filter((log) => log.entity === entity)
  }

  const getLogsByDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    return logs.filter((log) => {
      const logDate = new Date(log.timestamp)
      return logDate >= start && logDate <= end
    })
  }

  const clearLogs = () => {
    setLogs([])
    localStorage.removeItem("pos_change_logs")
  }

  const exportLogs = (format: "json" | "csv"): string => {
    if (format === "json") {
      return JSON.stringify(logs, null, 2)
    } else {
      const headers = [
        "ID",
        "Timestamp",
        "Action",
        "Entity",
        "Entity ID",
        "Details",
        "User ID",
        "Store Code",
        "Company ID",
      ]
      const csvContent = [
        headers.join(","),
        ...logs.map((log) =>
          [
            log.id,
            log.timestamp,
            log.action,
            log.entity,
            log.entityId,
            `"${log.details.replace(/"/g, '""')}"`,
            log.userId,
            log.storeCode,
            log.companyId,
          ].join(","),
        ),
      ].join("\n")
      return csvContent
    }
  }

  return (
    <ChangeLogContext.Provider
      value={{
        logs,
        logChange,
        getLogsByStore,
        getLogsByUser,
        getLogsByEntity,
        getLogsByDateRange,
        clearLogs,
        exportLogs,
      }}
    >
      {children}
    </ChangeLogContext.Provider>
  )
}

export function useChangeLog() {
  const context = useContext(ChangeLogContext)
  if (context === undefined) {
    throw new Error("useChangeLog must be used within a ChangeLogProvider")
  }
  return context
}
