"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useCurrency } from "@/hooks/use-currency"
import { Loader2, PlusCircle, MinusCircle, Trash2, Save, Receipt, XCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface Product {
  id: string
  sku: string
  name: string
  price: number
  stock_quantity: number
}

interface CartItem extends Product {
  quantity: number
  itemTotal: number
}

interface HeldTransaction {
  id: string
  hold_name: string
  held_data: {
    cart: CartItem[]
    total: number
  }
  created_at: string
}

export default function SalesModule() {
  const { user, hasPermission } = useAuth()
  const { toast } = useToast()
  const { formatCurrency } = useCurrency()

  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [isProcessingSale, setIsProcessingSale] = useState(false)
  const [heldTransactions, setHeldTransactions] = useState<HeldTransaction[]>([])
  const [isHoldingSale, setIsHoldingSale] = useState(false)
  const [holdName, setHoldName] = useState("")
  const [isRecallingSale, setIsRecallingSale] = useState(false)

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("/api/products")
      if (!response.ok) throw new Error("Failed to fetch products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      })
      console.error("Error fetching products:", error)
    }
  }, [toast])

  const fetchHeldTransactions = useCallback(async () => {
    try {
      const response = await fetch("/api/held-transactions")
      if (!response.ok) throw new Error("Failed to fetch held transactions")
      const data = await response.json()
      setHeldTransactions(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load held transactions.",
        variant: "destructive",
      })
      console.error("Error fetching held transactions:", error)
    }
  }, [toast])

  useEffect(() => {
    fetchProducts()
    fetchHeldTransactions()
  }, [fetchProducts, fetchHeldTransactions])

  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + item.itemTotal, 0)
    setTotal(newTotal)
  }, [cart])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        const updatedCart = prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, itemTotal: (item.quantity + 1) * item.price }
            : item,
        )
        return updatedCart
      } else {
        return [...prevCart, { ...product, quantity: 1, itemTotal: product.price }]
      }
    })
    setSearchTerm("") // Clear search after adding
  }

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + delta, itemTotal: (item.quantity + delta) * item.price }
            : item,
        )
        .filter((item) => item.quantity > 0) // Remove if quantity drops to 0 or less
      return updatedCart
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  const processSale = async () => {
    if (cart.length === 0) {
      toast({
        title: "No items in cart",
        description: "Please add items to the cart before processing a sale.",
        variant: "warning",
      })
      return
    }

    setIsProcessingSale(true)
    try {
      const saleItems = cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        item_total: item.itemTotal,
      }))

      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          total_amount: total,
          discount_amount: 0, // Placeholder
          tax_amount: 0, // Placeholder
          payment_method: "Cash", // Placeholder
          user_id: user?.id, // Current logged-in user ID
          items: saleItems,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to process sale")
      }

      toast({
        title: "Sale Processed!",
        description: `Total: ${formatCurrency(total)}. Stock updated.`,
      })
      setCart([])
      setTotal(0)
      fetchProducts() // Refresh product stock
    } catch (error) {
      toast({
        title: "Sale Error",
        description: `Failed to process sale: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
      console.error("Error processing sale:", error)
    } finally {
      setIsProcessingSale(false)
    }
  }

  const holdSale = async () => {
    if (cart.length === 0) {
      toast({
        title: "No items to hold",
        description: "Add items to the cart before holding a sale.",
        variant: "warning",
      })
      return
    }

    if (!holdName.trim()) {
      toast({
        title: "Hold Name Required",
        description: "Please provide a name for the held transaction.",
        variant: "warning",
      })
      return
    }

    setIsHoldingSale(true)
    try {
      const response = await fetch("/api/held-transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hold_name: holdName,
          held_data: { cart, total },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to hold sale")
      }

      toast({
        title: "Sale Held",
        description: `Transaction "${holdName}" has been held.`,
      })
      setCart([])
      setTotal(0)
      setHoldName("")
      fetchHeldTransactions() // Refresh held transactions list
    } catch (error) {
      toast({
        title: "Hold Sale Error",
        description: `Failed to hold sale: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
      console.error("Error holding sale:", error)
    } finally {
      setIsHoldingSale(false)
    }
  }

  const recallSale = (heldTransaction: HeldTransaction) => {
    setCart(heldTransaction.held_data.cart)
    setTotal(heldTransaction.held_data.total)
    setHoldName(heldTransaction.hold_name) // Pre-fill hold name for potential re-holding
    toast({
      title: "Sale Recalled",
      description: `Transaction "${heldTransaction.hold_name}" has been loaded.`,
    })
  }

  const deleteHeldTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/held-transactions/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete held transaction")
      }

      toast({
        title: "Held Transaction Deleted",
        description: "The held transaction has been removed.",
      })
      fetchHeldTransactions() // Refresh held transactions list
    } catch (error) {
      toast({
        title: "Delete Error",
        description: `Failed to delete held transaction: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
      console.error("Error deleting held transaction:", error)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
      {/* Product Search & List */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search products by name or SKU..."
            value={searchTerm}
            onChange={handleSearch}
            className="mb-4"
          />
          <div className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>{product.stock_quantity}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addToCart(product)}
                        disabled={product.stock_quantity <= 0}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Cart & Checkout */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Current Sale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[300px] overflow-y-auto mb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No items in cart
                    </TableCell>
                  </TableRow>
                ) : (
                  cart.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="flex items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateCartQuantity(item.id, -1)}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateCartQuantity(item.id, 1)}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell>{formatCurrency(item.price)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.itemTotal)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFromCart(item.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between items-center font-bold text-lg mb-4">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="space-y-2">
            <Button onClick={processSale} className="w-full" disabled={isProcessingSale || cart.length === 0}>
              {isProcessingSale ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Receipt className="mr-2 h-4 w-4" /> Process Sale
                </>
              )}
            </Button>

            <Dialog open={isRecallingSale} onOpenChange={setIsRecallingSale}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full bg-transparent">
                  Recall Held Sale
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Recall Held Transactions</DialogTitle>
                  <DialogDescription>Select a held transaction to recall.</DialogDescription>
                </DialogHeader>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {heldTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No held transactions
                        </TableCell>
                      </TableRow>
                    ) : (
                      heldTransactions.map((held) => (
                        <TableRow key={held.id}>
                          <TableCell>{held.hold_name}</TableCell>
                          <TableCell>{formatCurrency(held.held_data.total)}</TableCell>
                          <TableCell>{new Date(held.created_at).toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                recallSale(held)
                                setIsRecallingSale(false)
                              }}
                            >
                              Recall
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-2 h-8 w-8"
                              onClick={() => deleteHeldTransaction(held.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full bg-transparent" disabled={cart.length === 0}>
                  Hold Sale
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Hold Current Sale</DialogTitle>
                  <DialogDescription>Enter a name to save this transaction for later.</DialogDescription>
                </DialogHeader>
                <Input
                  placeholder="Enter a name for this held sale"
                  value={holdName}
                  onChange={(e) => setHoldName(e.target.value)}
                  className="mb-4"
                />
                <Button onClick={holdSale} className="w-full" disabled={isHoldingSale || !holdName.trim()}>
                  {isHoldingSale ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Holding...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Save Held Sale
                    </>
                  )}
                </Button>
              </DialogContent>
            </Dialog>

            <Button variant="destructive" onClick={() => setCart([])} className="w-full" disabled={cart.length === 0}>
              <XCircle className="mr-2 h-4 w-4" /> Clear Sale
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
