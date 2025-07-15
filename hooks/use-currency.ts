"use client"

import { useState, useEffect } from "react"

interface CurrencySettings {
  symbol: string
  code: string
  position: "before" | "after"
  decimalPlaces: number
}

const defaultCurrency: CurrencySettings = {
  symbol: "$",
  code: "USD",
  position: "before",
  decimalPlaces: 2,
}

export function useCurrency() {
  const [currency, setCurrency] = useState<CurrencySettings>(defaultCurrency)

  useEffect(() => {
    // Load currency settings from localStorage
    const stored = localStorage.getItem("pos_currency_settings")
    if (stored) {
      try {
        setCurrency(JSON.parse(stored))
      } catch (error) {
        console.error("Error loading currency settings:", error)
      }
    }
  }, [])

  const updateCurrency = (newSettings: Partial<CurrencySettings>) => {
    const updated = { ...currency, ...newSettings }
    setCurrency(updated)
    localStorage.setItem("pos_currency_settings", JSON.stringify(updated))
  }

  const formatCurrency = (amount: number): string => {
    const formatted = amount.toFixed(currency.decimalPlaces)
    return currency.position === "before" ? `${currency.symbol}${formatted}` : `${formatted}${currency.symbol}`
  }

  return {
    currency,
    updateCurrency,
    formatCurrency,
  }
}
