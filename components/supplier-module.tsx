"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { Plus, Edit, Trash2, Phone, Mail, MapPin, FileText, Star, Clock } from "lucide-react"

interface Supplier {
  id: string
  name: string
  contactPerson: string
  phone: string
  email: string
  address: string
  status: "active" | "inactive"
  rating: number
  products: number
  lastOrder: string
}

interface SupplierProduct {
  id: string
  name: string
  category: string
  unitPrice: number
  leadTime: string
  minOrder: number
}

interface SupplierOrder {
  id: string
  date: string
  amount: number
  status: "pending" | "received" | "cancelled"
  items: number
}

export default function SupplierModule() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: "1",
      name: "ABC Suppliers Ltd",
      contactPerson: "John Smith",
      phone: "+234 123 456 7890",
      email: "contact@abcsuppliers.com",
      address: "123 Main Street, Lagos, Nigeria",
      status: "active",
      rating: 4,
      products: 25,
      lastOrder: "2024-01-22",
    },
    {
      id: "2",
      name: "XYZ Trading Co",
      contactPerson: "Jane Doe",
      phone: "+234 987 654 3210",
      email: "info@xyztrading.com",
      address: "456 Market Road, Abuja, Nigeria",
      status: "active",
      rating: 3,
      products: 18,
      lastOrder: "2024-01-18",
    },
    {
      id: "3",
      name: "Global Imports Inc",
      contactPerson: "Michael Johnson",
      phone: "+234 555 123 4567",
      email: "sales@globalimports.com",
      address: "789 Harbor Avenue, Port Harcourt, Nigeria",
      status: "inactive",
      rating: 2,
      products: 12,
      lastOrder: "2024-01-10",
    },
    {
      id: "4",
      name: "Local Distributors",
      contactPerson: "Sarah Williams",
      phone: "+234 111 222 3333",
      email: "info@localdistributors.com",
      address: "321 Village Road, Kano, Nigeria",
      status: "active",
      rating: 5,
      products: 30,
      lastOrder: "2024-01-25",
    },
  ])

  const [supplierProducts, setSupplierProducts] = useState<SupplierProduct[]>([
    {
      id: "1",
      name: "Coca Cola 35cl",
      category: "Beverages",
      unitPrice: 120,
      leadTime: "3-5 days",
      minOrder: 50,
    },
    {
      id: "2",
      name: "Indomie Noodles",
      category: "Food",
      unitPrice: 100,
      leadTime: "2-3 days",
      minOrder: 100,
    },
    {
      id: "7",
      name: "Sprite 35cl",
      category: "Beverages",
      unitPrice: 120,
      leadTime: "3-5 days",
      minOrder: 50,
    },
  ])

  const [supplierOrders, setSupplierOrders] = useState<SupplierOrder[]>([
    {
      id: "PO-2024-001",
      date: "2024-01-15",
      amount: 16000,
      status: "received",
      items: 2,
    },
    {
      id: "PO-2024-004",
      date: "2024-01-22",
      amount: 18000,
      status: "received",
      items: 2,
    },
  ])

  const [activeTab, setActiveTab] = useState("suppliers")
  const [searchTerm, setSearchTerm] = useState("")
  const [showSupplierDialog, setShowSupplierDialog] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddSupplier = () => {
    setEditingSupplier(null)
    setShowSupplierDialog(true)
  }

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setShowSupplierDialog(true)
  }

  const handleDeleteSupplier = (supplierId: string) => {
    setSuppliers(suppliers.filter((s) => s.id !== supplierId))
  }

  const handleViewSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setActiveTab("details")
  }

  const handleSaveSupplier = () => {
    // In a real app, this would save to the backend
    setShowSupplierDialog(false)
  }

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "received":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Supplier Management</h2>
          <p className="text-muted-foreground">Manage your suppliers and their products</p>
        </div>
        {activeTab === "suppliers" ? (
          <Button onClick={handleAddSupplier}>
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        ) : (
          <Button variant="outline" onClick={() => setActiveTab("suppliers")}>
            Back to Suppliers
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="suppliers">All Suppliers</TabsTrigger>
          <TabsTrigger value="details" disabled={!selectedSupplier}>
            Supplier Details
          </TabsTrigger>
          <TabsTrigger value="products" disabled={!selectedSupplier}>
            Products & Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Suppliers</CardTitle>
              <CardDescription>Manage your supplier database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Search suppliers by name, contact person, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>{supplier.contactPerson}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1" />
                            {supplier.phone}
                          </div>
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1" />
                            {supplier.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(supplier.status)}>{supplier.status}</Badge>
                      </TableCell>
                      <TableCell>{renderRatingStars(supplier.rating)}</TableCell>
                      <TableCell>{supplier.products}</TableCell>
                      <TableCell>{supplier.lastOrder}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewSupplier(supplier)}>
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEditSupplier(supplier)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Supplier</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {supplier.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteSupplier(supplier.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {selectedSupplier && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedSupplier.name}</CardTitle>
                      <CardDescription>Supplier ID: {selectedSupplier.id}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(selectedSupplier.status)}>{selectedSupplier.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{selectedSupplier.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{selectedSupplier.email}</span>
                          </div>
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-1" />
                            <span>{selectedSupplier.address}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Primary Contact</h3>
                        <div className="mt-2">
                          <p className="font-medium">{selectedSupplier.contactPerson}</p>
                          <p className="text-sm text-muted-foreground">Procurement Manager</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Supplier Rating</h3>
                        <div className="mt-2 flex items-center">
                          {renderRatingStars(selectedSupplier.rating)}
                          <span className="ml-2 text-sm text-muted-foreground">
                            {selectedSupplier.rating}/5 based on performance
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Supplier Statistics</h3>
                        <div className="mt-2 grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-muted-foreground">Products</p>
                            <p className="text-2xl font-bold">{selectedSupplier.products}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-muted-foreground">Last Order</p>
                            <p className="text-lg font-medium">{selectedSupplier.lastOrder}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-muted-foreground">Avg. Lead Time</p>
                            <p className="text-lg font-medium">3-5 days</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-muted-foreground">Payment Terms</p>
                            <p className="text-lg font-medium">Net 30</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                        <Textarea
                          className="mt-2"
                          placeholder="Add notes about this supplier..."
                          defaultValue="Reliable supplier with consistent quality. Offers bulk discounts for orders over 100 units."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => handleEditSupplier(selectedSupplier)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Supplier
                    </Button>
                    <Button onClick={() => setActiveTab("products")}>View Products & Orders</Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          {selectedSupplier && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Products from {selectedSupplier.name}</CardTitle>
                    <CardDescription>Products supplied by this vendor</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Unit Price</TableHead>
                          <TableHead>Lead Time</TableHead>
                          <TableHead className="text-right">Min Order</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {supplierProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell className="text-right">₦{product.unitPrice.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                {product.leadTime}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{product.minOrder} units</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Product
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Purchase History</CardTitle>
                    <CardDescription>Recent orders with this supplier</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">Items</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {supplierOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell className="text-right">₦{order.amount.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{order.items}</TableCell>
                            <TableCell>
                              <Badge className={getOrderStatusColor(order.status)}>{order.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        View All Orders
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Create Purchase Order</CardTitle>
                  <CardDescription>Create a new purchase order for this supplier</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Purchase Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Add/Edit Supplier Dialog */}
      <Dialog open={showSupplierDialog} onOpenChange={setShowSupplierDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingSupplier ? "Edit Supplier" : "Add New Supplier"}</DialogTitle>
            <DialogDescription>
              {editingSupplier ? "Update supplier information" : "Add a new supplier to your database"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Supplier Name</Label>
              <Input id="name" placeholder="Enter supplier name" defaultValue={editingSupplier?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                placeholder="Enter contact person name"
                defaultValue={editingSupplier?.contactPerson}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="Enter phone number" defaultValue={editingSupplier?.phone} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter email address" defaultValue={editingSupplier?.email} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" placeholder="Enter full address" defaultValue={editingSupplier?.address} />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowSupplierDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSupplier}>{editingSupplier ? "Update Supplier" : "Add Supplier"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
