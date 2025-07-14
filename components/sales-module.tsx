"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, Receipt, Pause, Play, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useCurrency } from "@/hooks/use-currency"

interface Product {
  id: string
  name: string
  price: number
  barcode: string
  category: string
  stock: number
  image?: string
}

interface CartItem extends Product {
  quantity: number
  discount?: number
}

interface HeldTransaction {
  id: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  timestamp: Date
  note?: string
}

interface Sale {
  id: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: string
  timestamp: Date
  cashier: string
  customerPaid?: number
  change?: number
}

const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "Coca Cola 500ml", price: 2.5, barcode: "123456789", category: "Beverages", stock: 50 },
  { id: "2", name: "Bread Loaf", price: 3.25, barcode: "987654321", category: "Bakery", stock: 25 },
  { id: "3", name: "Milk 1L", price: 4.75, barcode: "456789123", category: "Dairy", stock: 30 },
  { id: "4", name: "Bananas (1kg)", price: 2.99, barcode: "789123456", category: "Fruits", stock: 40 },
  { id: "5", name: "Chicken Breast (1kg)", price: 12.99, barcode: "321654987", category: "Meat", stock: 15 },
  { id: "6", name: "Rice (2kg)", price: 8.5, barcode: "654987321", category: "Grains", stock: 20 },
]

export default function SalesModule() {
  const { user, hasPermission } = useAuth()
  const { formatCurrency } = useCurrency()
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [customerPaid, setCustomerPaid] = useState("")
  const [heldTransactions, setHeldTransactions] = useState<HeldTransaction[]>([])
  const [showHeldTransactions, setShowHeldTransactions] = useState(false)
  const [holdNote, setHoldNote] = useState("")
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

  // Load held transactions from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem("pos_held_transactions")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setHeldTransactions(
          parsed.map((t: any) => ({
            ...t,
            timestamp: new Date(t.timestamp),
          })),
        )
      } catch (error) {
        console.error("Error loading held transactions:", error)
      }
    }
  }, [])

  // Save held transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("pos_held_transactions", JSON.stringify(heldTransactions))
  }, [heldTransactions])

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.barcode.includes(searchTerm)
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...Array.from(new Set(MOCK_PRODUCTS.map((p) => p.category)))]

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCart([])
    setCustomerPaid("")
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  const holdTransaction = () => {
    if (cart.length === 0) return

    const heldTransaction: HeldTransaction = {
      id: `HOLD-${Date.now()}`,
      items: [...cart],
      subtotal,
      tax,
      total,
      timestamp: new Date(),
      note: holdNote,
    }

    setHeldTransactions((prev) => [...prev, heldTransaction])
    clearCart()
    setHoldNote("")
  }

  const recallTransaction = (heldTransaction: HeldTransaction) => {
    setCart(heldTransaction.items)
    setHeldTransactions((prev) => prev.filter((t) => t.id !== heldTransaction.id))
    setShowHeldTransactions(false)
  }

  const deleteHeldTransaction = (id: string) => {
    setHeldTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const processPayment = () => {
    if (cart.length === 0) return

    const paidAmount = Number.parseFloat(customerPaid) || 0
    const change = paymentMethod === "cash" ? Math.max(0, paidAmount - total) : 0

    const sale: Sale = {
      id: `SALE-${Date.now()}`,
      items: [...cart],
      subtotal,
      tax,
      total,
      paymentMethod,
      timestamp: new Date(),
      cashier: user?.name || "Unknown",
      customerPaid: paidAmount,
      change,
    }

    // Save sale to localStorage
    const existingSales = JSON.parse(localStorage.getItem("pos_sales") || "[]")
    localStorage.setItem("pos_sales", JSON.stringify([...existingSales, sale]))

    // Print receipt (mock)
    console.log("Receipt printed:", sale)

    clearCart()
    setShowPaymentDialog(false)
    setPaymentMethod("cash")
  }

  const canProcessPayment = () => {
    if (paymentMethod === "cash") {
      const paidAmount = Number.parseFloat(customerPaid) || 0
      return paidAmount >= total
    }
    return true // For card payments
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Sales Terminal</h2>
        <div className="flex space-x-2">
          {/* Always show recall button */}
          <Button
            variant="outline"
            onClick={() => setShowHeldTransactions(true)}
            className="flex items-center space-x-2"
          >
            <Play className="h-4 w-4" />
            <span>Recall ({heldTransactions.length})</span>
          </Button>

          {cart.length > 0 && (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                    <Pause className="h-4 w-4" />
                    <span>Hold</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Hold Transaction</DialogTitle>
                    <DialogDescription>Add a note for this held transaction (optional)</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="holdNote">Note</Label>
                      <Textarea
                        id="holdNote"
                        placeholder="Customer name or special instructions..."
                        value={holdNote}
                        onChange={(e) => setHoldNote(e.target.value)}
                      />
                    </div>
                    <Button onClick={holdTransaction} className="w-full">
                      Hold Transaction
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="destructive" onClick={clearCart} className="flex items-center space-x-2">
                <Trash2 className="h-4 w-4" />
                <span>Clear</span>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Search</CardTitle>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input
                    placeholder="Search products or scan barcode..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4" onClick={() => addToCart(product)}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                            <p className="text-lg font-bold text-green-600">{formatCurrency(product.price)}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={product.stock > 10 ? "default" : "destructive"}>
                              Stock: {product.stock}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Shopping Cart */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Current Sale</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Cart is empty</p>
                  <p className="text-sm">Add products to start a sale</p>
                </div>
              ) : (
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{formatCurrency(item.price)} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => removeFromCart(item.id)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}

              {cart.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (10%):</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <Button className="w-full mt-4" onClick={() => setShowPaymentDialog(true)}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Process Payment
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Held Transactions Dialog */}
      <Dialog open={showHeldTransactions} onOpenChange={setShowHeldTransactions}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Held Transactions</DialogTitle>
            <DialogDescription>Select a transaction to recall or delete</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-96">
            {heldTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Pause className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No held transactions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {heldTransactions.map((transaction) => (
                  <Card key={transaction.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline">{transaction.id}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {transaction.timestamp.toLocaleString()}
                            </span>
                          </div>
                          {transaction.note && (
                            <p className="text-sm text-muted-foreground mb-2">Note: {transaction.note}</p>
                          )}
                          <div className="text-sm">
                            <p>{transaction.items.length} items</p>
                            <p className="font-bold">Total: {formatCurrency(transaction.total)}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => recallTransaction(transaction)}>
                            <Play className="h-4 w-4 mr-1" />
                            Recall
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Held Transaction</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this held transaction? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteHeldTransaction(transaction.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>Total amount: {formatCurrency(total)}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="mobile">Mobile Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentMethod === "cash" && (
              <div>
                <Label htmlFor="customerPaid">Amount Paid</Label>
                <Input
                  id="customerPaid"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={customerPaid}
                  onChange={(e) => setCustomerPaid(e.target.value)}
                />
                {customerPaid && (
                  <div className="mt-2 text-sm">
                    <p>Change: {formatCurrency(Math.max(0, Number.parseFloat(customerPaid) - total))}</p>
                  </div>
                )}
              </div>
            )}

            <Button onClick={processPayment} disabled={!canProcessPayment()} className="w-full">
              <Receipt className="h-4 w-4 mr-2" />
              Complete Sale
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
