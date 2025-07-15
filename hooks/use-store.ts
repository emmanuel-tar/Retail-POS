"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Store {
  id: string
  name: string
  address: string
  phone: string
  email: string
  tax_rate: number
  is_main: boolean
  parent_store_id?: string
  settings: {
    use_main_pricing: boolean
    currency_symbol: string
    timezone: string
    business_hours: {
      open: string
      close: string
      days: string[]
    }
  }
  location: {
    latitude?: number
    longitude?: number
    city: string
    state: string
    country: string
  }
  created_at: string
  status: "active" | "inactive"
}

interface StoreContextType {
  stores: Store[]
  currentStore: Store | null
  setCurrentStore: (store: Store) => void
  addStore: (store: Omit<Store, "id" | "created_at">) => void
  updateStore: (storeId: string, updates: Partial<Store>) => void
  deleteStore: (storeId: string) => void
  getStoreById: (storeId: string) => Store | undefined
  getMainStore: () => Store | undefined
  getChildStores: (parentId: string) => Store[]
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

const defaultStores: Store[] = [
  {
    id: "main-store",
    name: "Main Store",
    address: "123 Main Street, Downtown",
    phone: "+1-555-0123",
    email: "main@store.com",
    tax_rate: 0.085,
    is_main: true,
    settings: {
      use_main_pricing: true,
      currency_symbol: "$",
      timezone: "America/New_York",
      business_hours: {
        open: "09:00",
        close: "21:00",
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      },
    },
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      city: "New York",
      state: "NY",
      country: "USA",
    },
    created_at: "2024-01-01T00:00:00Z",
    status: "active",
  },
  {
    id: "branch-001",
    name: "North Branch",
    address: "456 North Ave, Uptown",
    phone: "+1-555-0124",
    email: "north@store.com",
    tax_rate: 0.085,
    is_main: false,
    parent_store_id: "main-store",
    settings: {
      use_main_pricing: true,
      currency_symbol: "$",
      timezone: "America/New_York",
      business_hours: {
        open: "10:00",
        close: "20:00",
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      },
    },
    location: {
      latitude: 40.7589,
      longitude: -73.9851,
      city: "New York",
      state: "NY",
      country: "USA",
    },
    created_at: "2024-01-15T00:00:00Z",
    status: "active",
  },
]

export function StoreProvider({ children }: { children: ReactNode }) {
  const [stores, setStores] = useState<Store[]>(defaultStores)
  const [currentStore, setCurrentStore] = useState<Store | null>(null)

  useEffect(() => {
    // Load stores from localStorage
    const storedStores = localStorage.getItem("pos_stores")
    if (storedStores) {
      try {
        const parsedStores = JSON.parse(storedStores)
        setStores(parsedStores)
      } catch (error) {
        console.error("Error loading stores:", error)
      }
    }

    // Load current store
    const storedCurrentStore = localStorage.getItem("pos_current_store")
    if (storedCurrentStore) {
      try {
        const parsedCurrentStore = JSON.parse(storedCurrentStore)
        setCurrentStore(parsedCurrentStore)
      } catch (error) {
        console.error("Error loading current store:", error)
      }
    } else {
      // Set main store as default
      const mainStore = stores.find((s) => s.is_main) || stores[0]
      setCurrentStore(mainStore)
    }
  }, [])

  const updateCurrentStore = (store: Store) => {
    setCurrentStore(store)
    localStorage.setItem("pos_current_store", JSON.stringify(store))
  }

  const addStore = (storeData: Omit<Store, "id" | "created_at">) => {
    const newStore: Store = {
      ...storeData,
      id: `store-${Date.now()}`,
      created_at: new Date().toISOString(),
    }

    const updatedStores = [...stores, newStore]
    setStores(updatedStores)
    localStorage.setItem("pos_stores", JSON.stringify(updatedStores))
  }

  const updateStore = (storeId: string, updates: Partial<Store>) => {
    const updatedStores = stores.map((store) => (store.id === storeId ? { ...store, ...updates } : store))
    setStores(updatedStores)
    localStorage.setItem("pos_stores", JSON.stringify(updatedStores))

    // Update current store if it's the one being updated
    if (currentStore?.id === storeId) {
      const updatedCurrentStore = { ...currentStore, ...updates }
      setCurrentStore(updatedCurrentStore)
      localStorage.setItem("pos_current_store", JSON.stringify(updatedCurrentStore))
    }
  }

  const deleteStore = (storeId: string) => {
    const storeToDelete = stores.find((s) => s.id === storeId)
    if (storeToDelete?.is_main) {
      throw new Error("Cannot delete main store")
    }

    const updatedStores = stores.filter((store) => store.id !== storeId)
    setStores(updatedStores)
    localStorage.setItem("pos_stores", JSON.stringify(updatedStores))

    // If current store is deleted, switch to main store
    if (currentStore?.id === storeId) {
      const mainStore = updatedStores.find((s) => s.is_main) || updatedStores[0]
      updateCurrentStore(mainStore)
    }
  }

  const getStoreById = (storeId: string) => {
    return stores.find((store) => store.id === storeId)
  }

  const getMainStore = () => {
    return stores.find((store) => store.is_main)
  }

  const getChildStores = (parentId: string) => {
    return stores.filter((store) => store.parent_store_id === parentId)
  }

  return (
    <StoreContext.Provider
      value={{
        stores,
        currentStore,
        setCurrentStore: updateCurrentStore,
        addStore,
        updateStore,
        deleteStore,
        getStoreById,
        getMainStore,
        getChildStores,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
