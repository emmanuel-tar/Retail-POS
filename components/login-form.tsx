"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Keyboard, Grid3X3 } from "lucide-react"

export function LoginForm() {
  const [companyId, setCompanyId] = useState("")
  const [storeCode, setStoreCode] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [useTouchPad, setUseTouchPad] = useState(true)
  const [activeField, setActiveField] = useState<"company" | "store" | "password" | null>(null)

  const { login } = useAuth()
  const { toast } = useToast()

  const handleNumberPadClick = (digit: string) => {
    if (activeField === "company" && companyId.length < 5) {
      setCompanyId((prev) => prev + digit)
    } else if (activeField === "store" && storeCode.length < 3) {
      setStoreCode((prev) => prev + digit)
    } else if (activeField === "password" && password.length < 6) {
      setPassword((prev) => prev + digit)
    }
  }

  const handleBackspace = () => {
    if (activeField === "company") {
      setCompanyId((prev) => prev.slice(0, -1))
    } else if (activeField === "store") {
      setStoreCode((prev) => prev.slice(0, -1))
    } else if (activeField === "password") {
      setPassword((prev) => prev.slice(0, -1))
    }
  }

  const handleClear = () => {
    if (activeField === "company") {
      setCompanyId("")
    } else if (activeField === "store") {
      setStoreCode("")
    } else if (activeField === "password") {
      setPassword("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (companyId.length !== 5) {
      toast({
        title: "Invalid Company ID",
        description: "Company ID must be exactly 5 digits",
        variant: "destructive",
      })
      return
    }

    if (storeCode.length !== 3) {
      toast({
        title: "Invalid Store Code",
        description: "Store Code must be exactly 3 digits",
        variant: "destructive",
      })
      return
    }

    if (password.length !== 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be exactly 6 digits",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await login(companyId, storeCode, password)
      toast({
        title: "Login Successful",
        description: "Welcome to the POS System",
      })
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const NumberPad = () => (
    <div className="grid grid-cols-3 gap-3 mt-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <Button
          key={num}
          type="button"
          variant="outline"
          size="lg"
          className="h-16 text-xl font-semibold hover:bg-blue-50 active:bg-blue-100 bg-transparent"
          onClick={() => handleNumberPadClick(num.toString())}
          disabled={!activeField}
        >
          {num}
        </Button>
      ))}
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-16 text-lg font-semibold hover:bg-red-50 active:bg-red-100 bg-transparent"
        onClick={handleClear}
        disabled={!activeField}
      >
        Clear
      </Button>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-16 text-xl font-semibold hover:bg-blue-50 active:bg-blue-100 bg-transparent"
        onClick={() => handleNumberPadClick("0")}
        disabled={!activeField}
      >
        0
      </Button>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-16 text-lg font-semibold hover:bg-yellow-50 active:bg-yellow-100 bg-transparent"
        onClick={handleBackspace}
        disabled={!activeField}
      >
        ⌫
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-gray-800">POS System Login</CardTitle>
          <CardDescription className="text-gray-600">Enter your credentials to access the system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company ID Field */}
            <div className="space-y-2">
              <Label htmlFor="companyId" className="text-sm font-medium">
                Company ID (5 digits)
              </Label>
              <div className="relative">
                <Input
                  id="companyId"
                  type={useTouchPad ? "text" : "number"}
                  value={companyId}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 5)
                    setCompanyId(value)
                  }}
                  onFocus={() => setActiveField("company")}
                  placeholder="12345"
                  className={`text-center text-lg font-mono tracking-widest ${
                    activeField === "company" ? "ring-2 ring-blue-500" : ""
                  }`}
                  maxLength={5}
                  readOnly={useTouchPad}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                  {companyId.length}/5
                </div>
              </div>
            </div>

            {/* Store Code Field */}
            <div className="space-y-2">
              <Label htmlFor="storeCode" className="text-sm font-medium">
                Store Code (3 digits)
              </Label>
              <div className="relative">
                <Input
                  id="storeCode"
                  type={useTouchPad ? "text" : "number"}
                  value={storeCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 3)
                    setStoreCode(value)
                  }}
                  onFocus={() => setActiveField("store")}
                  placeholder="001"
                  className={`text-center text-lg font-mono tracking-widest ${
                    activeField === "store" ? "ring-2 ring-blue-500" : ""
                  }`}
                  maxLength={3}
                  readOnly={useTouchPad}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                  {storeCode.length}/3
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password (6 digits)
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                    setPassword(value)
                  }}
                  onFocus={() => setActiveField("password")}
                  placeholder="123456"
                  className={`text-center text-lg font-mono tracking-widest pr-20 ${
                    activeField === "password" ? "ring-2 ring-blue-500" : ""
                  }`}
                  maxLength={6}
                  readOnly={useTouchPad}
                />
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                  {password.length}/6
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Input Method Toggle */}
            <div className="flex justify-center space-x-2">
              <Button
                type="button"
                variant={useTouchPad ? "default" : "outline"}
                size="sm"
                onClick={() => setUseTouchPad(true)}
                className="flex items-center space-x-1"
              >
                <Grid3X3 className="h-4 w-4" />
                <span>Touch Pad</span>
              </Button>
              <Button
                type="button"
                variant={!useTouchPad ? "default" : "outline"}
                size="sm"
                onClick={() => setUseTouchPad(false)}
                className="flex items-center space-x-1"
              >
                <Keyboard className="h-4 w-4" />
                <span>Keyboard</span>
              </Button>
            </div>

            {/* Number Pad */}
            {useTouchPad && (
              <div className="border-t pt-4">
                <div className="text-center text-sm text-gray-600 mb-2">
                  {activeField
                    ? `Entering ${activeField === "company" ? "Company ID" : activeField === "store" ? "Store Code" : "Password"}`
                    : "Select a field to start entering"}
                </div>
                <NumberPad />
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold"
              disabled={isLoading || companyId.length !== 5 || storeCode.length !== 3 || password.length !== 6}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <div className="font-semibold mb-1">Demo Credentials:</div>
            <div>Company: 12345 | Store: 001 | Password: 123456 (Admin)</div>
            <div>Company: 12345 | Store: 002 | Password: 654321 (Manager)</div>
            <div>Company: 12345 | Store: 003 | Password: 111222 (Cashier)</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
