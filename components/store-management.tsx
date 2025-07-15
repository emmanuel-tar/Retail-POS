"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { useStore } from "@/hooks/use-store"
import { Plus, Edit, Trash2, MapPin, Building, Settings, Users } from "lucide-react"

export default function StoreManagement() {
  const { toast } = useToast()
  const { stores, currentStore, addStore, updateStore, deleteStore, setCurrentStore } = useStore()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingStore, setEditingStore] = useState<any>(null)
  const [formData, setFormData] = useState<any>({})

  const handleAddStore = () => {
    setFormData({
      name: "",
      address: "",
      phone: "",
      email: "",
      tax_rate: 0.085,
      is_main: false,
      parent_store_id: stores.find((s) => s.is_main)?.id || "",
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
        city: "",
        state: "",
        country: "USA",
      },
      status: "active",
    })
    setEditingStore(null)
    setIsAddDialogOpen(true)
  }

  const handleEditStore = (store: any) => {
    setFormData(store)
    setEditingStore(store)
    setIsAddDialogOpen(true)
  }

  const handleSaveStore = () => {
    if (!formData.name || !formData.address) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (editingStore) {
      updateStore(editingStore.id, formData)
      toast({
        title: "Store Updated",
        description: `${formData.name} has been updated successfully.`,
      })
    } else {
      addStore(formData)
      toast({
        title: "Store Added",
        description: `${formData.name} has been added successfully.`,
      })
    }

    setIsAddDialogOpen(false)
    setFormData({})
    setEditingStore(null)
  }

  const handleDeleteStore = (store: any) => {
    if (store.is_main) {
      toast({
        title: "Cannot Delete",
        description: "Cannot delete the main store.",
        variant: "destructive",
      })
      return
    }

    try {
      deleteStore(store.id)
      toast({
        title: "Store Deleted",
        description: `${store.name} has been removed.`,
      })
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleSwitchStore = (store: any) => {
    setCurrentStore(store)
    toast({
      title: "Store Switched",
      description: `Now operating from ${store.name}`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Store Management</h2>
        <Button onClick={handleAddStore}>
          <Plus className="mr-2 h-4 w-4" />
          Add Store Location
        </Button>
      </div>

      {/* Current Store Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Building className="h-5 w-5" />
            Current Active Store
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-medium text-blue-900">{currentStore?.name}</p>
              <p className="text-sm text-blue-700">{currentStore?.address}</p>
            </div>
            <div>
              <p className="text-sm text-blue-700">Phone: {currentStore?.phone}</p>
              <p className="text-sm text-blue-700">Email: {currentStore?.email}</p>
            </div>
            <div>
              <p className="text-sm text-blue-700">Tax Rate: {((currentStore?.tax_rate || 0) * 100).toFixed(1)}%</p>
              <Badge variant={currentStore?.is_main ? "default" : "secondary"}>
                {currentStore?.is_main ? "Main Store" : "Branch"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Store Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Stores</p>
                <p className="text-2xl font-bold">{stores.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Active Stores</p>
                <p className="text-2xl font-bold">{stores.filter((s) => s.status === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Branch Stores</p>
                <p className="text-2xl font-bold">{stores.filter((s) => !s.is_main).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Shared Pricing</p>
                <p className="text-2xl font-bold">{stores.filter((s) => s.settings?.use_main_pricing).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stores Table */}
      <Card>
        <CardHeader>
          <CardTitle>Store Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Pricing</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.id} className={currentStore?.id === store.id ? "bg-blue-50" : ""}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <div>
                        <p className="font-medium">{store.name}</p>
                        {currentStore?.id === store.id && (
                          <Badge variant="outline" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">
                        {store.location.city}, {store.location.state}
                      </p>
                      <p className="text-xs text-gray-500">{store.address}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{store.phone}</p>
                      <p className="text-xs text-gray-500">{store.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={store.is_main ? "default" : "secondary"}>
                      {store.is_main ? "Main Store" : "Branch"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={store.settings?.use_main_pricing ? "outline" : "secondary"}>
                      {store.settings?.use_main_pricing ? "Shared" : "Custom"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={store.status === "active" ? "default" : "secondary"}>{store.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {currentStore?.id !== store.id && (
                        <Button variant="ghost" size="sm" onClick={() => handleSwitchStore(store)}>
                          Switch
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleEditStore(store)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!store.is_main && (
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteStore(store)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Store Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingStore ? "Edit Store" : "Add New Store Location"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Store Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Store name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone number"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address || ""}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Full address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                  <Input
                    id="tax_rate"
                    type="number"
                    step="0.001"
                    value={((formData.tax_rate || 0) * 100).toString()}
                    onChange={(e) => setFormData({ ...formData, tax_rate: Number.parseFloat(e.target.value) / 100 })}
                    placeholder="8.5"
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Location Details</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.location?.city || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, city: e.target.value },
                      })
                    }
                    placeholder="City"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.location?.state || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, state: e.target.value },
                      })
                    }
                    placeholder="State"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.location?.country || "USA"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, country: e.target.value },
                      })
                    }
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            {/* Store Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Store Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Use Main Store Pricing</Label>
                    <p className="text-sm text-gray-500">Use pricing from the main store instead of custom pricing</p>
                  </div>
                  <Switch
                    checked={formData.settings?.use_main_pricing || false}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        settings: { ...formData.settings, use_main_pricing: checked },
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency Symbol</Label>
                    <Input
                      id="currency"
                      value={formData.settings?.currency_symbol || "$"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          settings: { ...formData.settings, currency_symbol: e.target.value },
                        })
                      }
                      placeholder="$"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={formData.settings?.timezone || "America/New_York"}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          settings: { ...formData.settings, timezone: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="open_time">Opening Time</Label>
                    <Input
                      id="open_time"
                      type="time"
                      value={formData.settings?.business_hours?.open || "09:00"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          settings: {
                            ...formData.settings,
                            business_hours: {
                              ...formData.settings?.business_hours,
                              open: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="close_time">Closing Time</Label>
                    <Input
                      id="close_time"
                      type="time"
                      value={formData.settings?.business_hours?.close || "21:00"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          settings: {
                            ...formData.settings,
                            business_hours: {
                              ...formData.settings?.business_hours,
                              close: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStore}>{editingStore ? "Update Store" : "Add Store"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
