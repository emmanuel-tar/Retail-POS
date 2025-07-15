"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Search, Building } from "lucide-react"

interface Supplier {
  id: string
  name: string
  contact_person: string
  email: string
  phone: string
  address: string
  status: "active" | "inactive"
  created_at: string
}

export default function SupplierModule() {
  const { toast } = useToast()

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: "sup-001",
      name: "Tech Corp",
      contact_person: "John Smith",
      email: "john@techcorp.com",
      phone: "+1-555-0123",
      address: "123 Tech Street, Silicon Valley, CA 94000",
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
    },
    {
      id: "sup-002",
      name: "Peripheral Inc",
      contact_person: "Jane Doe",
      email: "jane@peripheral.com",
      phone: "+1-555-0456",
      address: "456 Hardware Ave, Austin, TX 78701",
      status: "active",
      created_at: "2024-01-02T00:00:00Z",
    },
    {
      id: "sup-003",
      name: "Office Supplies Co",
      contact_person: "Bob Johnson",
      email: "bob@officesupplies.com",
      phone: "+1-555-0789",
      address: "789 Business Blvd, New York, NY 10001",
      status: "inactive",
      created_at: "2024-01-03T00:00:00Z",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [formData, setFormData] = useState<Partial<Supplier>>({})

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddSupplier = () => {
    setFormData({ status: "active" })
    setEditingSupplier(null)
    setIsAddDialogOpen(true)
  }

  const handleEditSupplier = (supplier: Supplier) => {
    setFormData(supplier)
    setEditingSupplier(supplier)
    setIsAddDialogOpen(true)
  }

  const handleSaveSupplier = () => {
    if (!formData.name || !formData.contact_person || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (editingSupplier) {
      // Update existing supplier
      setSuppliers((prev) => prev.map((s) => (s.id === editingSupplier.id ? { ...editingSupplier, ...formData } : s)))
      toast({
        title: "Supplier Updated",
        description: `${formData.name} has been updated successfully.`,
      })
    } else {
      // Add new supplier
      const newSupplier: Supplier = {
        id: `sup-${Date.now()}`,
        name: formData.name || "",
        contact_person: formData.contact_person || "",
        email: formData.email || "",
        phone: formData.phone || "",
        address: formData.address || "",
        status: formData.status || "active",
        created_at: new Date().toISOString(),
      }
      setSuppliers((prev) => [...prev, newSupplier])
      toast({
        title: "Supplier Added",
        description: `${newSupplier.name} has been added successfully.`,
      })
    }

    setIsAddDialogOpen(false)
    setFormData({})
    setEditingSupplier(null)
  }

  const handleDeleteSupplier = (supplier: Supplier) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== supplier.id))
    toast({
      title: "Supplier Deleted",
      description: `${supplier.name} has been removed.`,
    })
  }

  const toggleSupplierStatus = (supplier: Supplier) => {
    const newStatus = supplier.status === "active" ? "inactive" : "active"
    setSuppliers((prev) => prev.map((s) => (s.id === supplier.id ? { ...s, status: newStatus } : s)))
    toast({
      title: "Status Updated",
      description: `${supplier.name} is now ${newStatus}.`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Supplier Management</h2>
        <Button onClick={handleAddSupplier}>
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Suppliers</p>
                <p className="text-2xl font-bold">{suppliers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-green-500 rounded-full" />
              <div>
                <p className="text-sm font-medium">Active Suppliers</p>
                <p className="text-2xl font-bold">{suppliers.filter((s) => s.status === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-red-500 rounded-full" />
              <div>
                <p className="text-sm font-medium">Inactive Suppliers</p>
                <p className="text-2xl font-bold">{suppliers.filter((s) => s.status === "inactive").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search suppliers by name, contact person, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Suppliers Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.contact_person}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>
                    <Badge variant={supplier.status === "active" ? "default" : "secondary"}>{supplier.status}</Badge>
                  </TableCell>
                  <TableCell>{new Date(supplier.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => toggleSupplierStatus(supplier)}>
                        {supplier.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditSupplier(supplier)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteSupplier(supplier)}>
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

      {/* Add/Edit Supplier Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingSupplier ? "Edit Supplier" : "Add New Supplier"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_person">Contact Person *</Label>
              <Input
                id="contact_person"
                value={formData.contact_person || ""}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                placeholder="Contact person name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Phone number"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address || ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full address"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSupplier}>{editingSupplier ? "Update Supplier" : "Add Supplier"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
