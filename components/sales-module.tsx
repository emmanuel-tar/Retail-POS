"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Minus, Plus, ShoppingCart, Trash2, CreditCard, Banknote, Receipt } from "lucide-react"
import { useCurrency } from "@/hooks/use-currency"
import { Label } from "@/components/ui/label"

interface Product {
  id: string
  name: string
  price: number
  barcode: string
  stock: number
  category: string
}

interface CartItem extends Product {
  quantity: number
}

export default function SalesModule() {
  const { formatCurrency } = useCurrency()
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showCheckout, setShowCheckout] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash")
  const [amountReceived, setAmountReceived] = useState("")

  const [heldTransactions, setHeldTransactions] = useState<
    Array<{
      id: string
      items: CartItem[]
      timestamp: string
      cashier: string
    }>
  >([])
  const [showHeldTransactions, setShowHeldTransactions] = useState(false)
  const [showVoidDialog, setShowVoidDialog] = useState(false)
  const [voidReason, setVoidReason] = useState("")

  // Mock products data
  const products: Product[] = [
    { id: "1", name: "Coca Cola 35cl", price: 200, barcode: "123456789", stock: 50, category: "Beverages" },
    { id: "2", name: "Indomie Noodles", price: 150, barcode: "987654321", stock: 100, category: "Food" },
    { id: "3", name: "Peak Milk 400g", price: 800, barcode: "456789123", stock: 25, category: "Dairy" },
    { id: "4", name: "Bread Loaf", price: 500, barcode: "789123456", stock: 30, category: "Bakery" },
    { id: "5", name: "Rice 5kg", price: 3500, barcode: "321654987", stock: 15, category: "Grains" },
    { id: "6", name: "Cooking Oil 1L", price: 1200, barcode: "654987321", stock: 40, category: "Cooking" },
  ]

  const filteredProducts = products.filter(
    (product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.barcode.includes(searchTerm),
  )

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(cart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId))
  }

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const getTax = () => {
    return getSubtotal() * 0.075 // 7.5% tax
  }

  const getTotal = () => {
    return getSubtotal() + getTax()
  }

  const getChange = () => {
    const received = Number.parseFloat(amountReceived) || 0
    return received - getTotal()
  }

  const holdTransaction = () => {
    if (cart.length === 0) return

    const heldTransaction = {
      id: `HOLD-${Date.now()}`,
      items: [...cart],
      timestamp: new Date().toLocaleString(),
      cashier: "Current User", // In real app, get from auth context
    }

    setHeldTransactions([...heldTransactions, heldTransaction])
    setCart([])
    alert("Transaction held successfully!")
  }

  const recallTransaction = (heldTransaction: any) => {
    setCart(heldTransaction.items)
    setHeldTransactions(heldTransactions.filter((t) => t.id !== heldTransaction.id))
    setShowHeldTransactions(false)
    alert("Transaction recalled successfully!")
  }

  const voidTransaction = () => {
    if (cart.length === 0) return
    setShowVoidDialog(true)
  }

  const confirmVoid = () => {
    // In real app, log the void transaction with reason
    console.log("Transaction voided:", { items: cart, reason: voidReason })
    setCart([])
    setVoidReason("")
    setShowVoidDialog(false)
    alert("Transaction voided successfully!")
  }

  const printReceipt = () => {
    const receiptContent = generateReceiptContent()

    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt</title>
            <style>
              body { font-family: 'Courier New', monospace; font-size: 12px; margin: 0; padding: 20px; }
              .receipt { width: 300px; margin: 0 auto; }
              .center { text-align: center; }
              .right { text-align: right; }
              .line { border-top: 1px dashed #000; margin: 5px 0; }
              .bold { font-weight: bold; }
            </style>
          </head>
          <body>
            ${receiptContent}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
      printWindow.close()
    }
  }

  const generateReceiptContent = () => {
    const now = new Date()
    const receiptNumber = `RCP-${Date.now()}`

    return `
      <div class="receipt">
        <div class="center bold">MY STORE</div>
        <div class="center">123 Main Street, Lagos, Nigeria</div>
        <div class="center">+234 123 456 7890</div>
        <div class="line"></div>
        <div>Receipt #: ${receiptNumber}</div>
        <div>Date: ${now.toLocaleDateString()}</div>
        <div>Time: ${now.toLocaleTimeString()}</div>
        <div>Cashier: Current User</div>
        <div class="line"></div>
        ${cart
          .map(
            (item) => `
          <div>
            <div>${item.name}</div>
            <div>${item.quantity} x ${formatCurrency(item.price)} = ${formatCurrency(item.price * item.quantity)}</div>
          </div>
        `,
          )
          .join("")}
        <div class="line"></div>
        <div>Subtotal: <span class="right">${formatCurrency(getSubtotal())}</span></div>
        <div>Tax (7.5%): <span class="right">${formatCurrency(getTax())}</span></div>
        <div class="bold">Total: <span class="right">${formatCurrency(getTotal())}</span></div>
        <div class="line"></div>
        <div>Payment: ${paymentMethod === "cash" ? "Cash" : "Card"}</div>
        ${
          paymentMethod === "cash"
            ? `
          <div>Amount Received: <span class="right">${formatCurrency(Number.parseFloat(amountReceived) || 0)}</span></div>
          <div>Change: <span class="right">${formatCurrency(getChange())}</span></div>
        `
            : ""
        }
        <div class="line"></div>
        <div class="center">Thank you for your business!</div>
        <div class="center">Please come again</div>
      </div>
    `
  }

  const handleCheckout = () => {
    // Process the sale
    printReceipt()
    alert("Sale completed successfully!")
    setCart([])
    setShowCheckout(false)
    setAmountReceived("")
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Product Selection */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Product Selection</CardTitle>
            <CardDescription>Search and add products to cart</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Search products by name or scan barcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                        <Badge variant={product.stock > 10 ? "default" : "destructive"}>{product.stock} left</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">{formatCurrency(product.price)}</span>
                        <Button size="sm" onClick={() => addToCart(product)} disabled={product.stock === 0}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shopping Cart */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Cart ({cart.length})
                </CardTitle>
                <CardDescription>Review items before checkout</CardDescription>
              </div>
              {cart.length > 0 && (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={holdTransaction}>
                    On Hold
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowHeldTransactions(true)}>
                    Recall ({heldTransactions.length})
                  </Button>
                  <Button variant="outline" size="sm" onClick={voidTransaction}>
                    Void
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearCart}>
                    Clear All
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Cart is empty</p>
                <p className="text-sm text-muted-foreground">Add products to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">{formatCurrency(item.price)} each</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(getSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (7.5%):</span>
                    <span>{formatCurrency(getTax())}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(getTotal())}</span>
                  </div>
                </div>

                <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Checkout
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Complete Sale</DialogTitle>
                      <DialogDescription>Process payment and complete the transaction</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Payment Method</label>
                        <Select
                          value={paymentMethod}
                          onValueChange={(value: "cash" | "card") => setPaymentMethod(value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">
                              <div className="flex items-center">
                                <Banknote className="h-4 w-4 mr-2" />
                                Cash
                              </div>
                            </SelectItem>
                            <SelectItem value="card">
                              <div className="flex items-center">
                                <CreditCard className="h-4 w-4 mr-2" />
                                Card
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {paymentMethod === "cash" && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Amount Received</label>
                          <Input
                            type="number"
                            placeholder="Enter amount received"
                            value={amountReceived}
                            onChange={(e) => setAmountReceived(e.target.value)}
                          />
                          {amountReceived && (
                            <div className="text-sm">
                              <div className="flex justify-between">
                                <span>Total:</span>
                                <span>{formatCurrency(getTotal())}</span>
                              </div>
                              <div className="flex justify-between font-medium">
                                <span>Change:</span>
                                <span className={getChange() >= 0 ? "text-green-600" : "text-red-600"}>
                                  {formatCurrency(Math.abs(getChange()))}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Order Summary</h4>
                        <div className="space-y-1 text-sm">
                          {cart.map((item) => (
                            <div key={item.id} className="flex justify-between">
                              <span>
                                {item.name} x{item.quantity}
                              </span>
                              <span>{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>{formatCurrency(getTotal())}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={() => setShowCheckout(false)} className="flex-1">
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCheckout}
                          className="flex-1"
                          disabled={paymentMethod === "cash" && getChange() < 0}
                        >
                          <Receipt className="h-4 w-4 mr-2" />
                          Complete Sale
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Held Transactions Dialog */}
      <Dialog open={showHeldTransactions} onOpenChange={setShowHeldTransactions}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Held Transactions</DialogTitle>
            <DialogDescription>Select a transaction to recall</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {heldTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No held transactions</p>
              </div>
            ) : (
              <div className="space-y-2">
                {heldTransactions.map((transaction) => (
                  <Card key={transaction.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{transaction.id}</h4>
                          <p className="text-sm text-muted-foreground">
                            {transaction.timestamp} - {transaction.cashier}
                          </p>
                          <p className="text-sm">
                            {transaction.items.length} items - Total:{" "}
                            {formatCurrency(
                              transaction.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
                            )}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => recallTransaction(transaction)}>
                            Recall
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setHeldTransactions(heldTransactions.filter((t) => t.id !== transaction.id))}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="text-xs space-y-1">
                          {transaction.items.map((item, index) => (
                            <div key={index} className="flex justify-between">
                              <span>
                                {item.name} x{item.quantity}
                              </span>
                              <span>{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Void Transaction Dialog */}
      <Dialog open={showVoidDialog} onOpenChange={setShowVoidDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Void Transaction</DialogTitle>
            <DialogDescription>Please provide a reason for voiding this transaction</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="voidReason">Reason for Void</Label>
              <Select value={voidReason} onValueChange={setVoidReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer_request">Customer Request</SelectItem>
                  <SelectItem value="pricing_error">Pricing Error</SelectItem>
                  <SelectItem value="wrong_items">Wrong Items</SelectItem>
                  <SelectItem value="payment_issue">Payment Issue</SelectItem>
                  <SelectItem value="system_error">System Error</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {voidReason === "other" && (
              <div className="space-y-2">
                <Label htmlFor="customReason">Custom Reason</Label>
                <Input
                  id="customReason"
                  placeholder="Enter custom reason"
                  onChange={(e) => setVoidReason(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowVoidDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmVoid} disabled={!voidReason} className="bg-red-600 hover:bg-red-700">
              Void Transaction
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
