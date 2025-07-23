"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useCurrency } from "@/hooks/use-currency"
import { Plus, Edit, Trash2, Search, FileText } from "lucide-react"

interface PurchaseOrder {
  id: string
  po_number: string
  supplier_name: string
  order_date: string
  expected_date: string
  status: "pending" | "ordered" | "received" | "cancelled"
  total_amount: number
  items: PurchaseItem[]
}

interface PurchaseItem {
  id: string
  product_name: string
  quantity: number
  unit_cost: number
  total_cost: number
}

export default function PurchaseModule() {
  const { toast } = useToast()
  const { formatCurrency } = useCurrency()

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: "po-001",
      po_number: "PO-2024-001",
      supplier_name: "Tech Corp",
      order_date: "2024-01-10",
      expected_date: "2024-01-20",
      status: "ordered",
      total_amount: 5000.0,
      items: [
        {
          id: "item-001",
          product_name: "Laptop Pro",
          quantity: 5,
          unit_cost: 800.0,
          total_cost: 4000.0,
        },
        {
          id: "item-002",
          product_name: "Wireless Mouse",
          quantity: 50,
          unit_cost: 20.0,
          total_cost: 1000.0,
        },
      ],
    },
    {
      id: "po-002",
      po_number: "PO-2024-002",
      supplier_name: "Peripheral Inc",
      order_date: "2024-01-12",
      expected_date: "2024-01-22",
      status: "pending",
      total_amount: 2500.0,
      items: [
        {
          id: "item-003",
          product_name: "Mechanical Keyboard",
          quantity: 50,
          unit_cost: 50.0,
          total_cost: 2500.0,
        },
      ],
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingPO, setEditingPO] = useState<PurchaseOrder | null>(null)
  const [formData, setFormData] = useState<Partial<PurchaseOrder>>({})

  const filteredPOs = purchaseOrders.filter(
    (po) =>
      po.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddPO = () => {
    setFormData({ status: "pending", items: [] })
    setEditingPO(null)
    setIsAddDialogOpen(true)
  }

  const handleEditPO = (po: PurchaseOrder) => {
    setFormData(po)
    setEditingPO(po)
    setIsAddDialogOpen(true)
  }

  const handleSavePO = () => {
    if (!formData.po_number || !formData.supplier_name || !formData.order_date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (editingPO) {
      // Update existing PO
      setPurchaseOrders((prev) => prev.map((po) => (po.id === editingPO.id ? { ...editingPO, ...formData } : po)))
      toast({
        title: "Purchase Order Updated",
        description: `${formData.po_number} has been updated successfully.`,
      })
    } else {
      // Add new PO
      const newPO: PurchaseOrder = {
        id: `po-${Date.now()}`,
        po_number: formData.po_number || "",
        supplier_name: formData.supplier_name || "",
        order_date: formData.order_date || "",
        expected_date: formData.expected_date || "",
        status: formData.status || "pending",
        total_amount: formData.total_amount || 0,
        items: formData.items || [],
      }
      setPurchaseOrders((prev) => [...prev, newPO])
      toast({
        title: "Purchase Order Created",
        description: `${newPO.po_number} has been created successfully.`,
      })
    }

    setIsAddDialogOpen(false)
    setFormData({})
    setEditingPO(null)
  }

  const handleDeletePO = (po: PurchaseOrder) => {
    setPurchaseOrders((prev) => prev.filter((p) => p.id !== po.id))
    toast({
      title: "Purchase Order Deleted",
      description: `${po.po_number} has been removed.`,
    })
  }

  const updatePOStatus = (po: PurchaseOrder, newStatus: PurchaseOrder["status"]) => {
    setPurchaseOrders((prev) => prev.map((p) => (p.id === po.id ? { ...p, status: newStatus } : p)))
    toast({
      title: "Status Updated",
      description: `${po.po_number} status changed to ${newStatus}.`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "ordered":
        return "bg-blue-100 text-blue-800"
      case "received":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Purchase Orders</h2>
        <Button onClick={handleAddPO}>
          <Plus className="mr-2 h-4 w-4" />
          Create Purchase Order
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total POs</p>
                <p className="text-2xl font-bold">{purchaseOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-yellow-500 rounded-full" />
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold">{purchaseOrders.filter((po) => po.status === "pending").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-blue-500 rounded-full" />
              <div>
                <p className="text-sm font-medium">Ordered</p>
                <p className="text-2xl font-bold">{purchaseOrders.filter((po) => po.status === "ordered").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-green-500 rounded-full" />
              <div>
                <p className="text-sm font-medium">Received</p>
                <p className="text-2xl font-bold">{purchaseOrders.filter((po) => po.status === "received").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by PO number, supplier, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Purchase Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Expected Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPOs.map((po) => (
                <TableRow key={po.id}>
                  <TableCell className="font-medium">{po.po_number}</TableCell>
                  <TableCell>{po.supplier_name}</TableCell>
                  <TableCell>{new Date(po.order_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(po.expected_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(po.status)}>{po.status}</Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(po.total_amount)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Select
                        value={po.status}
                        onValueChange={(value) => updatePOStatus(po, value as PurchaseOrder["status"])}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="ordered">Ordered</SelectItem>
                          <SelectItem value="received">Received</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm" onClick={() => handleEditPO(po)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeletePO(po)}>
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

      {/* Add/Edit PO Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPO ? "Edit Purchase Order" : "Create New Purchase Order"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="po_number">PO Number *</Label>
              <Input
                id="po_number"
                value={formData.po_number || ""}
                onChange={(e) => setFormData({ ...formData, po_number: e.target.value })}
                placeholder="PO-2024-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier_name">Supplier *</Label>
              <Input
                id="supplier_name"
                value={formData.supplier_name || ""}
                onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
                placeholder="Supplier name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order_date">Order Date *</Label>
              <Input
                id="order_date"
                type="date"
                value={formData.order_date || ""}
                onChange={(e) => setFormData({ ...formData, order_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expected_date">Expected Date</Label>
              <Input
                id="expected_date"
                type="date"
                value={formData.expected_date || ""}
                onChange={(e) => setFormData({ ...formData, expected_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || "pending"}
                onValueChange={(value) => setFormData({ ...formData, status: value as PurchaseOrder["status"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="ordered">Ordered</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_amount">Total Amount</Label>
              <Input
                id="total_amount"
                type="number"
                step="0.01"
                value={formData.total_amount || ""}
                onChange={(e) => setFormData({ ...formData, total_amount: Number.parseFloat(e.target.value) })}
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePO}>{editingPO ? "Update Purchase Order" : "Create Purchase Order"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
