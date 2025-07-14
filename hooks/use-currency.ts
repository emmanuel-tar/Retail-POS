"use client"

import { useState, useEffect, createContext } from "react"

interface Currency {
  code: string
  name: string
  symbol: string
}

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatCurrency: (amount: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const DEFAULT_CURRENCY: Currency = {
  code: "NGN",
  name: "Nigerian Naira",
  symbol: "₦",
}

export function useCurrency() {
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY)

  useEffect(() => {
    // Load saved currency from localStorage
    const savedCurrency = localStorage.getItem("pos_currency")
    if (savedCurrency) {
      setCurrencyState(JSON.parse(savedCurrency))
    }
  }, [])

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem("pos_currency", JSON.stringify(newCurrency))
  }

  const formatCurrency = (amount: number) => {
    return `${currency.symbol}${amount.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`
  }

  return { currency, setCurrency, formatCurrency }
}
