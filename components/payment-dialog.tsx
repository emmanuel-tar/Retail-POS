"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useCurrency } from "@/hooks/use-currency"
import { CreditCard, Banknote, Smartphone, QrCode, Loader2 } from "lucide-react"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  total: number
  onPaymentComplete: (paymentData: any) => void
}

export default function PaymentDialog({ open, onOpenChange, total, onPaymentComplete }: PaymentDialogProps) {
  const { toast } = useToast()
  const { formatCurrency } = useCurrency()

  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [cashAmount, setCashAmount] = useState<string>("")
  const [cardNumber, setCardNumber] = useState<string>("")
  const [expiryDate, setExpiryDate] = useState<string>("")
  const [cvv, setCvv] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)

  const paymentMethods = [
    { id: "cash", name: "Cash", icon: Banknote, color: "bg-green-100 text-green-800" },
    { id: "card", name: "Credit/Debit Card", icon: CreditCard, color: "bg-blue-100 text-blue-800" },
    { id: "mobile", name: "Mobile Payment", icon: Smartphone, color: "bg-purple-100 text-purple-800" },
    { id: "qr", name: "QR Code", icon: QrCode, color: "bg-orange-100 text-orange-800" },
  ]

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method.",
        variant: "destructive",
      })
      return
    }

    if (selectedMethod === "cash") {
      const cashAmountNum = Number.parseFloat(cashAmount)
      if (!cashAmount || cashAmountNum < total) {
        toast({
          title: "Insufficient Cash",
          description: "Please enter a valid cash amount that covers the total.",
          variant: "destructive",
        })
        return
      }
    }

    if (selectedMethod === "card") {
      if (!cardNumber || !expiryDate || !cvv) {
        toast({
          title: "Card Details Required",
          description: "Please fill in all card details.",
          variant: "destructive",
        })
        return
      }
    }

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const paymentData = {
        method: selectedMethod,
        amount: total,
        timestamp: new Date().toISOString(),
        ...(selectedMethod === "cash" && {
          cash_received: Number.parseFloat(cashAmount),
          change: Number.parseFloat(cashAmount) - total,
        }),
        ...(selectedMethod === "card" && {
          card_last_four: cardNumber.slice(-4),
          card_type: "VISA", // This would be determined by card number
        }),
      }

      onPaymentComplete(paymentData)

      // Reset form
      setSelectedMethod("")
      setCashAmount("")
      setCardNumber("")
      setExpiryDate("")
      setCvv("")
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing the payment.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const calculateChange = () => {
    if (selectedMethod === "cash" && cashAmount) {
      const change = Number.parseFloat(cashAmount) - total
      return change > 0 ? change : 0
    }
    return 0
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Payment - {formatCurrency(total)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Select Payment Method</Label>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon
                return (
                  <Card
                    key={method.id}
                    className={`cursor-pointer transition-all ${
                      selectedMethod === method.id ? "ring-2 ring-primary border-primary" : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <CardContent className="p-4 flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${method.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{method.name}</span>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Payment Details */}
          {selectedMethod === "cash" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cash-amount">Cash Amount</Label>
                <Input
                  id="cash-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                />
              </div>
              {cashAmount && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span>Total:</span>
                    <span className="font-medium">{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Cash Received:</span>
                    <span className="font-medium">{formatCurrency(Number.parseFloat(cashAmount) || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold border-t pt-2 mt-2">
                    <span>Change:</span>
                    <span className="text-green-600">{formatCurrency(calculateChange())}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedMethod === "card" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength={19}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          )}

          {selectedMethod === "mobile" && (
            <div className="text-center py-8">
              <Smartphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Mobile Payment</p>
              <p className="text-gray-500">Customer will pay using their mobile payment app</p>
            </div>
          )}

          {selectedMethod === "qr" && (
            <div className="text-center py-8">
              <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">QR Code Payment</p>
              <p className="text-gray-500">Customer will scan QR code to complete payment</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={handlePayment} disabled={!selectedMethod || isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Process Payment - ${formatCurrency(total)}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
