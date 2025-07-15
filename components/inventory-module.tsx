"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useCurrency } from "@/hooks/use-currency"
import { Plus, Edit, Trash2, Search } from "lucide-react"

interface Product {
  id: string
  sku: string
  name: string
  description: string
  price: number
  cost: number
  stock_quantity: number
  min_stock_level: number
  category: string
  supplier: string
}

export default function InventoryModule() {
  const { toast } = useToast()
  const { formatCurrency } = useCurrency()

  const [products, setProducts] = useState<Product[]>([
    {
      id: "prod-001",
      sku: "LP-001",
      name: "Laptop Pro",
      description: "High-performance laptop",
      price: 1200.0,
      cost: 800.0,
      stock_quantity: 50,
      min_stock_level: 10,
      category: "Electronics",
      supplier: "Tech Corp",
    },
    {
      id: "prod-002",
      sku: "WM-002",
      name: "Wireless Mouse",
      description: "Ergonomic wireless mouse",
      price: 25.5,
      cost: 15.0,
      stock_quantity: 200,
      min_stock_level: 50,
      category: "Accessories",
      supplier: "Peripheral Inc",
    },
    {
      id: "prod-003",
      sku: "MK-003",
      name: "Mechanical Keyboard",
      description: "RGB mechanical keyboard",
      price: 85.0,
      cost: 50.0,
      stock_quantity: 100,
      min_stock_level: 20,
      category: "Accessories",
      supplier: "Peripheral Inc",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<Partial<Product>>({})

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = () => {
    setFormData({})
    setEditingProduct(null)
    setIsAddDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setFormData(product)
    setEditingProduct(product)
    setIsAddDialogOpen(true)
  }

  const handleSaveProduct = () => {
    if (!formData.name || !formData.sku || !formData.price) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (editingProduct) {
      // Update existing product
      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? { ...editingProduct, ...formData } : p)))
      toast({
        title: "Product Updated",
        description: `${formData.name} has been updated successfully.`,
      })
    } else {
      // Add new product
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        sku: formData.sku || "",
        name: formData.name || "",
        description: formData.description || "",
        price: Number(formData.price) || 0,
        cost: Number(formData.cost) || 0,
        stock_quantity: Number(formData.stock_quantity) || 0,
        min_stock_level: Number(formData.min_stock_level) || 0,
        category: formData.category || "",
        supplier: formData.supplier || "",
      }
      setProducts((prev) => [...prev, newProduct])
      toast({
        title: "Product Added",
        description: `${newProduct.name} has been added to inventory.`,
      })
    }

    setIsAddDialogOpen(false)
    setFormData({})
    setEditingProduct(null)
  }

  const handleDeleteProduct = (product: Product) => {
    setProducts((prev) => prev.filter((p) => p.id !== product.id))
    toast({
      title: "Product Deleted",
      description: `${product.name} has been removed from inventory.`,
    })
  }

  const getLowStockProducts = () => {
    return products.filter((product) => product.stock_quantity <= product.min_stock_level)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <Button onClick={handleAddProduct}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Low Stock Alert */}
      {getLowStockProducts().length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700">{getLowStockProducts().length} product(s) are running low on stock:</p>
            <ul className="mt-2 text-sm text-orange-600">
              {getLowStockProducts().map((product) => (
                <li key={product.id}>
                  {product.name} - {product.stock_quantity} remaining (min: {product.min_stock_level})
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search products by name, SKU, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono">{product.sku}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>{formatCurrency(product.cost)}</TableCell>
                  <TableCell>
                    <span
                      className={
                        product.stock_quantity <= product.min_stock_level
                          ? "text-orange-600 font-medium"
                          : "text-green-600"
                      }
                    >
                      {product.stock_quantity}
                    </span>
                  </TableCell>
                  <TableCell>{product.min_stock_level}</TableCell>
                  <TableCell>{product.supplier}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku || ""}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Product SKU"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Product name"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Product description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Cost</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={formData.cost || ""}
                onChange={(e) => setFormData({ ...formData, cost: Number.parseFloat(e.target.value) })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Stock Quantity</Label>
              <Input
                id="stock_quantity"
                type="number"
                value={formData.stock_quantity || ""}
                onChange={(e) => setFormData({ ...formData, stock_quantity: Number.parseInt(e.target.value) })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min_stock_level">Min Stock Level</Label>
              <Input
                id="min_stock_level"
                type="number"
                value={formData.min_stock_level || ""}
                onChange={(e) => setFormData({ ...formData, min_stock_level: Number.parseInt(e.target.value) })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Product category"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                value={formData.supplier || ""}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="Supplier name"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProduct}>{editingProduct ? "Update Product" : "Add Product"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
