"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCurrency } from "@/hooks/use-currency"
import { useStore } from "@/hooks/use-store"
import { usePrintTemplates } from "@/hooks/use-print-templates"
import { Printer, Download } from "lucide-react"

interface Sale {
  id: string
  transaction_id: string
  cashier_id: string
  store_id: string
  items: any[]
  subtotal: number
  tax_amount: number
  total_amount: number
  payment_method: string
  payment_details: any
  created_at: string
}

interface PrintPreviewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sale: Sale
}

export default function PrintPreview({ open, onOpenChange, sale }: PrintPreviewProps) {
  const { formatCurrency } = useCurrency()
  const { currentStore } = useStore()
  const { templates, defaultTemplate } = usePrintTemplates()
  const [selectedTemplate, setSelectedTemplate] = useState(defaultTemplate?.id || "modern")
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt - ${sale.transaction_id}</title>
              <style>
                body { font-family: 'Courier New', monospace; margin: 0; padding: 20px; }
                .receipt { max-width: 300px; margin: 0 auto; }
                .center { text-align: center; }
                .right { text-align: right; }
                .bold { font-weight: bold; }
                .line { border-top: 1px dashed #000; margin: 10px 0; }
                .item-row { display: flex; justify-content: space-between; margin: 5px 0; }
                .logo { max-width: 100px; margin: 0 auto 20px; }
                @media print { body { margin: 0; padding: 10px; } }
              </style>
            </head>
            <body>
              ${printRef.current.innerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
        printWindow.close()
      }
    }
  }

  const handleDownloadPDF = () => {
    // In a real implementation, you would use a library like jsPDF
    console.log("Download PDF functionality would be implemented here")
  }

  const renderTemplate = () => {
    const template = templates.find((t) => t.id === selectedTemplate) || templates[0]

    switch (template.id) {
      case "modern":
        return <ModernTemplate sale={sale} store={currentStore} formatCurrency={formatCurrency} />
      case "classic":
        return <ClassicTemplate sale={sale} store={currentStore} formatCurrency={formatCurrency} />
      case "minimal":
        return <MinimalTemplate sale={sale} store={currentStore} formatCurrency={formatCurrency} />
      default:
        return <ModernTemplate sale={sale} store={currentStore} formatCurrency={formatCurrency} />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Print Preview - {sale.transaction_id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Selection */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Template:</label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Print Preview */}
          <div className="border rounded-lg p-4 bg-white">
            <div ref={printRef} className="receipt">
              {renderTemplate()}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Template Components
function ModernTemplate({ sale, store, formatCurrency }: any) {
  return (
    <div className="modern-template">
      <div className="center">
        <div className="logo">
          <img src="/placeholder-logo.png" alt="Store Logo" style={{ maxWidth: "80px" }} />
        </div>
        <h2 className="bold" style={{ margin: "10px 0", fontSize: "18px" }}>
          {store?.name || "Store Name"}
        </h2>
        <p style={{ margin: "5px 0", fontSize: "12px" }}>{store?.address || "Store Address"}</p>
        <p style={{ margin: "5px 0", fontSize: "12px" }}>{store?.phone || "Phone Number"}</p>
      </div>

      <div className="line"></div>

      <div style={{ margin: "15px 0" }}>
        <div className="item-row">
          <span>Receipt #:</span>
          <span className="bold">{sale.transaction_id}</span>
        </div>
        <div className="item-row">
          <span>Date:</span>
          <span>{new Date(sale.created_at).toLocaleString()}</span>
        </div>
        <div className="item-row">
          <span>Cashier:</span>
          <span>{sale.cashier_id}</span>
        </div>
      </div>

      <div className="line"></div>

      <div style={{ margin: "15px 0" }}>
        {sale.items.map((item: any, index: number) => (
          <div key={index} style={{ margin: "10px 0" }}>
            <div className="item-row">
              <span className="bold">{item.name}</span>
              <span className="bold">{formatCurrency(item.subtotal)}</span>
            </div>
            <div className="item-row" style={{ fontSize: "12px", color: "#666" }}>
              <span>
                {item.quantity} x {formatCurrency(item.price)}
              </span>
              <span></span>
            </div>
          </div>
        ))}
      </div>

      <div className="line"></div>

      <div style={{ margin: "15px 0" }}>
        <div className="item-row">
          <span>Subtotal:</span>
          <span>{formatCurrency(sale.subtotal)}</span>
        </div>
        <div className="item-row">
          <span>Tax:</span>
          <span>{formatCurrency(sale.tax_amount)}</span>
        </div>
        <div className="item-row bold" style={{ fontSize: "16px" }}>
          <span>TOTAL:</span>
          <span>{formatCurrency(sale.total_amount)}</span>
        </div>
      </div>

      <div className="line"></div>

      <div style={{ margin: "15px 0" }}>
        <div className="item-row">
          <span>Payment Method:</span>
          <span className="bold">{sale.payment_method.toUpperCase()}</span>
        </div>
        {sale.payment_details.cash_received && (
          <>
            <div className="item-row">
              <span>Cash Received:</span>
              <span>{formatCurrency(sale.payment_details.cash_received)}</span>
            </div>
            <div className="item-row">
              <span>Change:</span>
              <span>{formatCurrency(sale.payment_details.change)}</span>
            </div>
          </>
        )}
      </div>

      <div className="line"></div>

      <div className="center" style={{ margin: "20px 0" }}>
        <p style={{ fontSize: "12px" }}>Thank you for your business!</p>
        <p style={{ fontSize: "10px", margin: "10px 0" }}>Visit us again soon</p>
        <div style={{ margin: "15px 0" }}>
          <svg width="100" height="20">
            <rect width="2" height="20" x="0" fill="#000" />
            <rect width="1" height="20" x="3" fill="#000" />
            <rect width="2" height="20" x="5" fill="#000" />
            <rect width="1" height="20" x="8" fill="#000" />
            <rect width="3" height="20" x="10" fill="#000" />
            <rect width="1" height="20" x="14" fill="#000" />
            <rect width="2" height="20" x="16" fill="#000" />
          </svg>
          <p style={{ fontSize: "10px", margin: "5px 0" }}>{sale.transaction_id}</p>
        </div>
      </div>
    </div>
  )
}

function ClassicTemplate({ sale, store, formatCurrency }: any) {
  return (
    <div className="classic-template" style={{ fontFamily: "monospace" }}>
      <div className="center">
        <h1 className="bold" style={{ fontSize: "20px", margin: "10px 0" }}>
          {store?.name || "STORE NAME"}
        </h1>
        <p>{store?.address || "Store Address"}</p>
        <p>{store?.phone || "Phone Number"}</p>
      </div>

      <div style={{ margin: "20px 0", textAlign: "center" }}>
        <p>================================</p>
        <p className="bold">SALES RECEIPT</p>
        <p>================================</p>
      </div>

      <div>
        <p>Receipt #: {sale.transaction_id}</p>
        <p>Date: {new Date(sale.created_at).toLocaleString()}</p>
        <p>Cashier: {sale.cashier_id}</p>
      </div>

      <p style={{ margin: "15px 0" }}>--------------------------------</p>

      {sale.items.map((item: any, index: number) => (
        <div key={index} style={{ margin: "5px 0" }}>
          <p className="bold">{item.name}</p>
          <p>
            {item.quantity} x {formatCurrency(item.price)} = {formatCurrency(item.subtotal)}
          </p>
        </div>
      ))}

      <p style={{ margin: "15px 0" }}>--------------------------------</p>

      <div>
        <p>Subtotal: {formatCurrency(sale.subtotal)}</p>
        <p>Tax: {formatCurrency(sale.tax_amount)}</p>
        <p className="bold" style={{ fontSize: "16px" }}>
          TOTAL: {formatCurrency(sale.total_amount)}
        </p>
      </div>

      <p style={{ margin: "15px 0" }}>--------------------------------</p>

      <div>
        <p>Payment: {sale.payment_method.toUpperCase()}</p>
        {sale.payment_details.cash_received && (
          <>
            <p>Cash: {formatCurrency(sale.payment_details.cash_received)}</p>
            <p>Change: {formatCurrency(sale.payment_details.change)}</p>
          </>
        )}
      </div>

      <div className="center" style={{ margin: "20px 0" }}>
        <p>================================</p>
        <p>THANK YOU FOR YOUR BUSINESS!</p>
        <p>================================</p>
      </div>
    </div>
  )
}

function MinimalTemplate({ sale, store, formatCurrency }: any) {
  return (
    <div className="minimal-template" style={{ fontFamily: "Arial, sans-serif" }}>
      <div className="center">
        <h2 style={{ margin: "10px 0" }}>{store?.name || "Store"}</h2>
        <p style={{ fontSize: "12px" }}>{new Date(sale.created_at).toLocaleString()}</p>
      </div>

      <div style={{ margin: "20px 0" }}>
        {sale.items.map((item: any, index: number) => (
          <div key={index} className="item-row" style={{ margin: "8px 0" }}>
            <span>
              {item.quantity}x {item.name}
            </span>
            <span>{formatCurrency(item.subtotal)}</span>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid #ccc", paddingTop: "10px", margin: "15px 0" }}>
        <div className="item-row">
          <span>Subtotal</span>
          <span>{formatCurrency(sale.subtotal)}</span>
        </div>
        <div className="item-row">
          <span>Tax</span>
          <span>{formatCurrency(sale.tax_amount)}</span>
        </div>
        <div className="item-row bold" style={{ fontSize: "16px", borderTop: "1px solid #000", paddingTop: "5px" }}>
          <span>Total</span>
          <span>{formatCurrency(sale.total_amount)}</span>
        </div>
      </div>

      <div className="center" style={{ margin: "15px 0", fontSize: "12px" }}>
        <p>#{sale.transaction_id}</p>
        <p>Thank you!</p>
      </div>
    </div>
  )
}
