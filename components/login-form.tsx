"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Delete, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface NumberPadProps {
  onNumberClick: (num: string) => void
  onBackspace: () => void
  onClear: () => void
}

function NumberPad({ onNumberClick, onBackspace, onClear }: NumberPadProps) {
  const numbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["Clear", "0", "Back"],
  ]

  return (
    <div className="grid grid-cols-3 gap-2 p-4 bg-gray-50 rounded-lg">
      {numbers.flat().map((item, index) => (
        <Button
          key={index}
          variant={item === "Clear" || item === "Back" ? "destructive" : "outline"}
          size="lg"
          className={cn(
            "h-12 text-lg font-semibold",
            item === "Clear" || item === "Back"
              ? "bg-red-100 hover:bg-red-200 text-red-700"
              : "bg-white hover:bg-blue-50",
          )}
          onClick={() => {
            if (item === "Clear") onClear()
            else if (item === "Back") onBackspace()
            else onNumberClick(item)
          }}
        >
          {item === "Back" ? <Delete className="h-5 w-5" /> : item}
        </Button>
      ))}
    </div>
  )
}

export default function LoginForm() {
  const [companyId, setCompanyId] = useState("")
  const [storeCode, setStoreCode] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeField, setActiveField] = useState<"company" | "store" | "password" | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [useKeyboard, setUseKeyboard] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()

  const handleNumberClick = (num: string) => {
    if (activeField === "company" && companyId.length < 5) {
      setCompanyId((prev) => prev + num)
    } else if (activeField === "store" && storeCode.length < 3) {
      setStoreCode((prev) => prev + num)
    } else if (activeField === "password" && password.length < 6) {
      setPassword((prev) => prev + num)
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
        description: "Welcome to the POS System!",
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

  const formatDisplayValue = (value: string, maxLength: number) => {
    return showPassword || activeField !== "password"
      ? value.padEnd(maxLength, "_")
      : "•".repeat(value.length).padEnd(maxLength, "_")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">POS System</CardTitle>
          <CardDescription className="text-gray-600">Enter your credentials to access the system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company ID Field */}
            <div className="space-y-2">
              <Label htmlFor="companyId" className="text-sm font-medium">
                Company ID (5 digits)
              </Label>
              <div
                className={cn(
                  "relative cursor-pointer border-2 rounded-md p-3 transition-colors",
                  activeField === "company" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300",
                )}
                onClick={() => setActiveField("company")}
              >
                <div className="text-2xl font-mono tracking-widest text-center">{formatDisplayValue(companyId, 5)}</div>
                {useKeyboard && (
                  <Input
                    id="companyId"
                    type="text"
                    maxLength={5}
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value.replace(/\D/g, ""))}
                    className="absolute inset-0 opacity-0"
                    autoFocus={activeField === "company"}
                  />
                )}
              </div>
            </div>

            {/* Store Code Field */}
            <div className="space-y-2">
              <Label htmlFor="storeCode" className="text-sm font-medium">
                Store Code (3 digits)
              </Label>
              <div
                className={cn(
                  "relative cursor-pointer border-2 rounded-md p-3 transition-colors",
                  activeField === "store" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300",
                )}
                onClick={() => setActiveField("store")}
              >
                <div className="text-2xl font-mono tracking-widest text-center">{formatDisplayValue(storeCode, 3)}</div>
                {useKeyboard && (
                  <Input
                    id="storeCode"
                    type="text"
                    maxLength={3}
                    value={storeCode}
                    onChange={(e) => setStoreCode(e.target.value.replace(/\D/g, ""))}
                    className="absolute inset-0 opacity-0"
                    autoFocus={activeField === "store"}
                  />
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password (6 digits)
                </Label>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <div
                className={cn(
                  "relative cursor-pointer border-2 rounded-md p-3 transition-colors",
                  activeField === "password" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300",
                )}
                onClick={() => setActiveField("password")}
              >
                <div className="text-2xl font-mono tracking-widest text-center">
                  {showPassword ? formatDisplayValue(password, 6) : "•".repeat(password.length).padEnd(6, "_")}
                </div>
                {useKeyboard && (
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    maxLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value.replace(/\D/g, ""))}
                    className="absolute inset-0 opacity-0"
                    autoFocus={activeField === "password"}
                  />
                )}
              </div>
            </div>

            {/* Input Method Toggle */}
            <div className="flex justify-center">
              <Button type="button" variant="outline" size="sm" onClick={() => setUseKeyboard(!useKeyboard)}>
                {useKeyboard ? "Use Touch Pad" : "Use Keyboard"}
              </Button>
            </div>

            {/* Number Pad */}
            {!useKeyboard && (
              <NumberPad onNumberClick={handleNumberClick} onBackspace={handleBackspace} onClear={handleClear} />
            )}

            <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>
                <strong>Main Store:</strong> 12345 / 001 / 123456
              </p>
              <p>
                <strong>Branch Store:</strong> 12345 / 002 / 654321
              </p>
              <p>
                <strong>Regional Store:</strong> 12345 / 003 / 111222
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
