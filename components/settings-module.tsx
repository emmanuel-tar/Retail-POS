"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useCurrency } from "@/hooks/use-currency"
import { Save, Store, DollarSign, Receipt, Package } from "lucide-react"

export default function SettingsModule() {
  const { toast } = useToast()
  const { currency, updateCurrency } = useCurrency()

  // Store Settings
  const [storeSettings, setStoreSettings] = useState({
    name: "My POS Store",
    address: "123 Main Street, City, State 12345",
    phone: "+1-555-0123",
    email: "store@example.com",
    tax_rate: 8.5,
    receipt_footer: "Thank you for your business!",
  })

  // Receipt Settings
  const [receiptSettings, setReceiptSettings] = useState({
    show_logo: true,
    show_barcode: true,
    auto_print: false,
    paper_size: "80mm",
    copies: 1,
  })

  // Inventory Settings
  const [inventorySettings, setInventorySettings] = useState({
    low_stock_alert: true,
    auto_reorder: false,
    track_expiry: true,
    barcode_scanning: true,
  })

  const handleSaveStoreSettings = () => {
    // In a real app, this would save to a database
    toast({
      title: "Settings Saved",
      description: "Store settings have been updated successfully.",
    })
  }

  const handleSaveReceiptSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Receipt settings have been updated successfully.",
    })
  }

  const handleSaveInventorySettings = () => {
    toast({
      title: "Settings Saved",
      description: "Inventory settings have been updated successfully.",
    })
  }

  const handleSaveCurrencySettings = () => {
    toast({
      title: "Settings Saved",
      description: "Currency settings have been updated successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">System Settings</h2>
      </div>

      <Tabs defaultValue="store" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="currency">Currency</TabsTrigger>
          <TabsTrigger value="receipt">Receipt</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Store Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store_name">Store Name</Label>
                  <Input
                    id="store_name"
                    value={storeSettings.name}
                    onChange={(e) => setStoreSettings({ ...storeSettings, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store_phone">Phone Number</Label>
                  <Input
                    id="store_phone"
                    value={storeSettings.phone}
                    onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="store_address">Address</Label>
                  <Input
                    id="store_address"
                    value={storeSettings.address}
                    onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store_email">Email</Label>
                  <Input
                    id="store_email"
                    type="email"
                    value={storeSettings.email}
                    onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                  <Input
                    id="tax_rate"
                    type="number"
                    step="0.1"
                    value={storeSettings.tax_rate}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, tax_rate: Number.parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="receipt_footer">Receipt Footer Message</Label>
                  <Input
                    id="receipt_footer"
                    value={storeSettings.receipt_footer}
                    onChange={(e) => setStoreSettings({ ...storeSettings, receipt_footer: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleSaveStoreSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Store Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="currency">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Currency Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency_symbol">Currency Symbol</Label>
                  <Input
                    id="currency_symbol"
                    value={currency.symbol}
                    onChange={(e) => updateCurrency({ symbol: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency_code">Currency Code</Label>
                  <Input
                    id="currency_code"
                    value={currency.code}
                    onChange={(e) => updateCurrency({ code: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency_position">Symbol Position</Label>
                  <Select
                    value={currency.position}
                    onValueChange={(value) => updateCurrency({ position: value as "before" | "after" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="before">Before Amount ($100.00)</SelectItem>
                      <SelectItem value="after">After Amount (100.00$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="decimal_places">Decimal Places</Label>
                  <Select
                    value={currency.decimalPlaces.toString()}
                    onValueChange={(value) => updateCurrency({ decimalPlaces: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0 (100)</SelectItem>
                      <SelectItem value="1">1 (100.0)</SelectItem>
                      <SelectItem value="2">2 (100.00)</SelectItem>
                      <SelectItem value="3">3 (100.000)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <p className="text-lg font-medium">
                  Sample amount: {currency.formatCurrency ? currency.formatCurrency(1234.56) : "$1,234.56"}
                </p>
              </div>
              <Button onClick={handleSaveCurrencySettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Currency Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receipt">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Receipt Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show_logo">Show Store Logo</Label>
                  <Switch
                    id="show_logo"
                    checked={receiptSettings.show_logo}
                    onCheckedChange={(checked) => setReceiptSettings({ ...receiptSettings, show_logo: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show_barcode">Show Barcode</Label>
                  <Switch
                    id="show_barcode"
                    checked={receiptSettings.show_barcode}
                    onCheckedChange={(checked) => setReceiptSettings({ ...receiptSettings, show_barcode: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto_print">Auto Print Receipt</Label>
                  <Switch
                    id="auto_print"
                    checked={receiptSettings.auto_print}
                    onCheckedChange={(checked) => setReceiptSettings({ ...receiptSettings, auto_print: checked })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paper_size">Paper Size</Label>
                  <Select
                    value={receiptSettings.paper_size}
                    onValueChange={(value) => setReceiptSettings({ ...receiptSettings, paper_size: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="58mm">58mm</SelectItem>
                      <SelectItem value="80mm">80mm</SelectItem>
                      <SelectItem value="A4">A4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="copies">Number of Copies</Label>
                  <Input
                    id="copies"
                    type="number"
                    min="1"
                    max="5"
                    value={receiptSettings.copies}
                    onChange={(e) =>
                      setReceiptSettings({ ...receiptSettings, copies: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>
              <Button onClick={handleSaveReceiptSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Receipt Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventory Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="low_stock_alert">Low Stock Alerts</Label>
                    <p className="text-sm text-gray-500">Get notified when products are running low</p>
                  </div>
                  <Switch
                    id="low_stock_alert"
                    checked={inventorySettings.low_stock_alert}
                    onCheckedChange={(checked) =>
                      setInventorySettings({ ...inventorySettings, low_stock_alert: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto_reorder">Auto Reorder</Label>
                    <p className="text-sm text-gray-500">Automatically create purchase orders for low stock items</p>
                  </div>
                  <Switch
                    id="auto_reorder"
                    checked={inventorySettings.auto_reorder}
                    onCheckedChange={(checked) => setInventorySettings({ ...inventorySettings, auto_reorder: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="track_expiry">Track Expiry Dates</Label>
                    <p className="text-sm text-gray-500">Monitor product expiration dates</p>
                  </div>
                  <Switch
                    id="track_expiry"
                    checked={inventorySettings.track_expiry}
                    onCheckedChange={(checked) => setInventorySettings({ ...inventorySettings, track_expiry: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="barcode_scanning">Barcode Scanning</Label>
                    <p className="text-sm text-gray-500">Enable barcode scanner support</p>
                  </div>
                  <Switch
                    id="barcode_scanning"
                    checked={inventorySettings.barcode_scanning}
                    onCheckedChange={(checked) =>
                      setInventorySettings({ ...inventorySettings, barcode_scanning: checked })
                    }
                  />
                </div>
              </div>
              <Button onClick={handleSaveInventorySettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Inventory Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
