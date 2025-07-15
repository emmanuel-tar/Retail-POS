"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useCurrency } from "@/hooks/use-currency"
import { Loader2, PlusCircle, MinusCircle, XCircle, DollarSign, Save, RotateCcw } from "lucide-react"

interface Product {
  id: string
  sku: string
  name: string
  price: number
  stock_quantity: number
}

interface CartItem extends Product {
  quantity: number
  subtotal: number
}

interface HeldTransaction {
  id: string
  transaction_name: string
  cashier_id: string
  items: CartItem[]
  total_amount: number
  held_at: string
  notes?: string
}

export default function SalesModule() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { formatCurrency } = useCurrency()

  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<Product[]>([
    { id: "prod-001", sku: "LP-001", name: "Laptop Pro", price: 1200.0, stock_quantity: 50 },
    { id: "prod-002", sku: "WM-002", name: "Wireless Mouse", price: 25.5, stock_quantity: 200 },
    { id: "prod-003", sku: "MK-003", name: "Mechanical Keyboard", price: 85.0, stock_quantity: 100 },
    { id: "prod-004", sku: "UCH-004", name: "USB-C Hub", price: 40.0, stock_quantity: 150 },
    { id: "prod-005", sku: "SSD-005", name: "External SSD 1TB", price: 150.0, stock_quantity: 75 },
  ])
  const [cart, setCart] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [isProcessingSale, setIsProcessingSale] = useState(false)
  const [heldTransactions, setHeldTransactions] = useState<HeldTransaction[]>([])
  const [isHoldingSale, setIsHoldingSale] = useState(false)
  const [holdName, setHoldName] = useState("")
  const [isRecallingSale, setIsRecallingSale] = useState(false)

  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + item.subtotal, 0)
    setTotal(newTotal)
  }, [cart])

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1
        if (newQuantity > product.stock_quantity) {
          toast({
            title: "Out of Stock",
            description: `Cannot add more ${product.name}. Only ${product.stock_quantity} left in stock.`,
            variant: "destructive",
          })
          return prevCart
        }
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.price } : item,
        )
      } else {
        if (product.stock_quantity === 0) {
          toast({
            title: "Out of Stock",
            description: `${product.name} is currently out of stock.`,
            variant: "destructive",
          })
          return prevCart
        }
        return [...prevCart, { ...product, quantity: 1, subtotal: product.price }]
      }
    })
    setSearchTerm("") // Clear search after adding
  }

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) => {
          if (item.id === itemId) {
            const newQuantity = item.quantity + delta
            const productInStock = products.find((p) => p.id === itemId)
            if (!productInStock) return item // Should not happen

            if (newQuantity > productInStock.stock_quantity) {
              toast({
                title: "Out of Stock",
                description: `Cannot add more ${item.name}. Only ${productInStock.stock_quantity} left in stock.`,
                variant: "destructive",
              })
              return item
            }

            if (newQuantity <= 0) {
              return null // Mark for removal
            }
            return { ...item, quantity: newQuantity, subtotal: newQuantity * item.price }
          }
          return item
        })
        .filter(Boolean) as CartItem[] // Remove nulls

      return updatedCart
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId))
  }

  const clearCart = () => {
    setCart([])
    setTotal(0)
    setPaymentMethod("cash")
  }

  const processSale = async () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to the cart before processing a sale.",
        variant: "destructive",
      })
      return
    }

    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "Cashier ID not found. Please log in again.",
        variant: "destructive",
      })
      return
    }

    setIsProcessingSale(true)
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update product stock in local state
      setProducts((prevProducts) =>
        prevProducts.map((product) => {
          const cartItem = cart.find((item) => item.id === product.id)
          if (cartItem) {
            return { ...product, stock_quantity: product.stock_quantity - cartItem.quantity }
          }
          return product
        }),
      )

      toast({
        title: "Sale Processed",
        description: `Sale completed successfully! Total: ${formatCurrency(total)}`,
      })
      clearCart()
    } catch (error) {
      console.error("Error processing sale:", error)
      toast({
        title: "Sale Failed",
        description: "There was an error processing the sale.",
        variant: "destructive",
      })
    } finally {
      setIsProcessingSale(false)
    }
  }

  const holdSale = async () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to the cart before holding a sale.",
        variant: "destructive",
      })
      return
    }

    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "Cashier ID not found. Please log in again.",
        variant: "destructive",
      })
      return
    }

    setIsHoldingSale(true)
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newHeldTransaction: HeldTransaction = {
        id: Date.now().toString(), // Simple unique ID
        transaction_name: holdName || `Held Sale ${new Date().toLocaleString()}`,
        cashier_id: user.id,
        items: cart,
        total_amount: total,
        held_at: new Date().toISOString(),
        notes: `Held by ${user.username}`,
      }
      setHeldTransactions((prev) => [...prev, newHeldTransaction])

      toast({
        title: "Sale Held",
        description: `Transaction "${newHeldTransaction.transaction_name}" has been held.`,
      })
      clearCart()
      setHoldName("")
    } catch (error) {
      console.error("Error holding sale:", error)
      toast({
        title: "Hold Failed",
        description: "There was an error holding the sale.",
        variant: "destructive",
      })
    } finally {
      setIsHoldingSale(false)
    }
  }

  const recallSale = async (heldTransaction: HeldTransaction) => {
    setIsRecallingSale(true)
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      setCart(heldTransaction.items)
      setTotal(heldTransaction.total_amount)
      setPaymentMethod("cash") // Reset payment method
      setHeldTransactions((prev) => prev.filter((t) => t.id !== heldTransaction.id)) // Remove from held list

      toast({
        title: "Sale Recalled",
        description: `Transaction "${heldTransaction.transaction_name}" recalled successfully.`,
      })
    } catch (error) {
      console.error("Error recalling sale:", error)
      toast({
        title: "Recall Error",
        description: "Could not recall sale.",
        variant: "destructive",
      })
    } finally {
      setIsRecallingSale(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
      {/* Product Search & List */}
      <Card className="lg:col-span-2 flex flex-col">
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <Input
            placeholder="Search products by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
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
                      disabled={product.stock_quantity === 0}
                    >
                      Add to Cart
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Cart & Checkout */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Current Sale</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          {cart.length === 0 ? (
            <p className="text-center text-muted-foreground">Cart is empty.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => updateCartQuantity(item.id, -1)}>
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <span>{item.quantity}</span>
                      <Button variant="ghost" size="icon" onClick={() => updateCartQuantity(item.id, 1)}>
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>{formatCurrency(item.price)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.subtotal)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                        <XCircle className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="flex justify-between w-full text-lg font-bold">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="flex gap-2 w-full">
            <Button className="flex-1" onClick={processSale} disabled={isProcessingSale || cart.length === 0}>
              {isProcessingSale ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <DollarSign className="mr-2 h-4 w-4" />
              )}
              Process Sale
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={clearCart}
              disabled={cart.length === 0}
            >
              Clear Cart
            </Button>
          </div>
          <div className="flex gap-2 w-full">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1 bg-transparent" disabled={cart.length === 0}>
                  <Save className="mr-2 h-4 w-4" /> Hold Sale
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Hold Current Sale</DialogTitle>
                  <DialogDescription>Enter a name for this held transaction.</DialogDescription>
                </DialogHeader>
                <Input
                  placeholder="e.g., Customer A's order"
                  value={holdName}
                  onChange={(e) => setHoldName(e.target.value)}
                  className="mb-4"
                />
                <Button onClick={holdSale} disabled={isHoldingSale}>
                  {isHoldingSale ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirm Hold"}
                </Button>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1 bg-transparent" disabled={heldTransactions.length === 0}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Recall Sale
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Recall Held Sale</DialogTitle>
                  <DialogDescription>Select a held transaction to recall.</DialogDescription>
                </DialogHeader>
                {heldTransactions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No held transactions available.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Held At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {heldTransactions.map((held) => (
                        <TableRow key={held.id}>
                          <TableCell>{held.transaction_name}</TableCell>
                          <TableCell>{formatCurrency(held.total_amount)}</TableCell>
                          <TableCell>{new Date(held.held_at).toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => recallSale(held)}
                              disabled={isRecallingSale}
                            >
                              Recall
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
