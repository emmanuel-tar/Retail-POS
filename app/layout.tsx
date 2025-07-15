import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/hooks/use-auth"
import { ChangeLogProvider } from "@/hooks/use-change-log"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "POS System MVP",
  description: "A comprehensive Point of Sale system",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ChangeLogProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ChangeLogProvider>
      </body>
    </html>
  )
}
