"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useCurrency } from "@/hooks/use-currency"

const CURRENCIES = [
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh" },
]

export default function SettingsModule() {
  const { currency, setCurrency } = useCurrency()
  const [settings, setSettings] = useState({
    storeName: "My Store",
    storeAddress: "123 Main Street, Lagos, Nigeria",
    storePhone: "+234 123 456 7890",
    storeEmail: "info@mystore.com",
    taxRate: 7.5,
    receiptFooter: "Thank you for your business!",
    autoBackup: true,
    lowStockThreshold: 10,
    enableBarcode: true,
    printReceipts: true,
    requireCustomerInfo: false,
    allowNegativeStock: false,
    enableDiscounts: true,
    maxDiscountPercent: 20,
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = () => {
    // In a real app, this would save to the backend
    alert("Settings saved successfully!")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">System Settings</h2>
        <p className="text-muted-foreground">Configure your POS system preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="currency">Currency</TabsTrigger>
          <TabsTrigger value="receipt">Receipt</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Basic information about your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={settings.storeName}
                    onChange={(e) => handleSettingChange("storeName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Phone Number</Label>
                  <Input
                    id="storePhone"
                    value={settings.storePhone}
                    onChange={(e) => handleSettingChange("storePhone", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeAddress">Address</Label>
                <Input
                  id="storeAddress"
                  value={settings.storeAddress}
                  onChange={(e) => handleSettingChange("storeAddress", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeEmail">Email</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => handleSettingChange("storeEmail", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>Configure system behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Backup</Label>
                  <p className="text-sm text-muted-foreground">Automatically backup data to cloud</p>
                </div>
                <Switch
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => handleSettingChange("autoBackup", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Barcode Scanning</Label>
                  <p className="text-sm text-muted-foreground">Allow barcode scanning for products</p>
                </div>
                <Switch
                  checked={settings.enableBarcode}
                  onCheckedChange={(checked) => handleSettingChange("enableBarcode", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Customer Information</Label>
                  <p className="text-sm text-muted-foreground">Require customer details for all sales</p>
                </div>
                <Switch
                  checked={settings.requireCustomerInfo}
                  onCheckedChange={(checked) => handleSettingChange("requireCustomerInfo", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="currency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Currency Settings</CardTitle>
              <CardDescription>Configure currency and regional settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Primary Currency</Label>
                <Select
                  value={currency.code}
                  onValueChange={(value) => {
                    const selectedCurrency = CURRENCIES.find((c) => c.code === value)
                    if (selectedCurrency) {
                      setCurrency(selectedCurrency)
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.symbol} - {curr.name} ({curr.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Current: {currency.symbol} - {currency.name}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.1"
                  value={settings.taxRate}
                  onChange={(e) => handleSettingChange("taxRate", Number.parseFloat(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">Default tax rate applied to sales</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exchange Rates</CardTitle>
              <CardDescription>Manage currency exchange rates for multi-currency support</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm font-medium">
                  <div>Currency</div>
                  <div>Rate to {currency.code}</div>
                  <div>Last Updated</div>
                </div>
                <Separator />
                {CURRENCIES.filter((c) => c.code !== currency.code)
                  .slice(0, 3)
                  .map((curr) => (
                    <div key={curr.code} className="grid grid-cols-3 gap-4 items-center">
                      <div className="flex items-center space-x-2">
                        <span>{curr.symbol}</span>
                        <span>{curr.code}</span>
                      </div>
                      <Input type="number" step="0.0001" defaultValue="1.0000" className="w-24" />
                      <span className="text-sm text-muted-foreground">Just now</span>
                    </div>
                  ))}
                <Button variant="outline" size="sm">
                  Update Exchange Rates
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receipt" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Receipt Settings</CardTitle>
              <CardDescription>Configure receipt printing and format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Print Receipts</Label>
                  <p className="text-sm text-muted-foreground">Automatically print receipts after each sale</p>
                </div>
                <Switch
                  checked={settings.printReceipts}
                  onCheckedChange={(checked) => handleSettingChange("printReceipts", checked)}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="receiptFooter">Receipt Footer Message</Label>
                <Input
                  id="receiptFooter"
                  value={settings.receiptFooter}
                  onChange={(e) => handleSettingChange("receiptFooter", e.target.value)}
                  placeholder="Thank you message"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Receipt Preview</CardTitle>
              <CardDescription>Preview how receipts will look</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white border-2 border-dashed border-gray-300 p-4 font-mono text-sm max-w-xs">
                <div className="text-center mb-2">
                  <div className="font-bold">{settings.storeName}</div>
                  <div className="text-xs">{settings.storeAddress}</div>
                  <div className="text-xs">{settings.storePhone}</div>
                </div>
                <div className="border-t border-b border-gray-300 py-2 my-2">
                  <div className="flex justify-between">
                    <span>Sample Product</span>
                    <span>{currency.symbol}1,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({settings.taxRate}%)</span>
                    <span>{currency.symbol}113</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold">
                  <span>TOTAL</span>
                  <span>{currency.symbol}1,613</span>
                </div>
                <div className="text-center text-xs mt-2">{settings.receiptFooter}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Settings</CardTitle>
              <CardDescription>Configure inventory management preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  value={settings.lowStockThreshold}
                  onChange={(e) => handleSettingChange("lowStockThreshold", Number.parseInt(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">Alert when stock falls below this number</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Negative Stock</Label>
                  <p className="text-sm text-muted-foreground">Allow sales even when stock is zero or negative</p>
                </div>
                <Switch
                  checked={settings.allowNegativeStock}
                  onCheckedChange={(checked) => handleSettingChange("allowNegativeStock", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Discounts</Label>
                  <p className="text-sm text-muted-foreground">Allow discounts to be applied to sales</p>
                </div>
                <Switch
                  checked={settings.enableDiscounts}
                  onCheckedChange={(checked) => handleSettingChange("enableDiscounts", checked)}
                />
              </div>
              {settings.enableDiscounts && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="maxDiscountPercent">Maximum Discount (%)</Label>
                    <Input
                      id="maxDiscountPercent"
                      type="number"
                      max="100"
                      value={settings.maxDiscountPercent}
                      onChange={(e) => handleSettingChange("maxDiscountPercent", Number.parseInt(e.target.value))}
                    />
                    <p className="text-sm text-muted-foreground">
                      Maximum discount percentage allowed without supervisor approval
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
    </div>
  )
}
