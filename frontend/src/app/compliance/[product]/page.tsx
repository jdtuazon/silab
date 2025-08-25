"use client"

import React, { useState, useEffect } from "react"
import { ComplianceTracker } from "@/components/compliance-tracker"
import { Shield, FileSearch, TrendingUp, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"

interface CompliancePageProps {
  params: Promise<{
    product: string
  }>
}

export default function CompliancePage({ params }: CompliancePageProps) {
  const [productName, setProductName] = useState("")
  
  useEffect(() => {
    params.then(({ product }) => {
      setProductName(decodeURIComponent(product))
    })
  }, [params])
  
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="mr-2">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">SiLab Compliance</h1>
                  <p className="text-xs text-muted-foreground">
                    Philippine Financial Regulations Analysis - {productName}
                  </p>
                </div>
              </div>
              <nav className="hidden md:flex items-center space-x-6">
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <FileSearch className="h-4 w-4" />
                  Dashboard
                </Link>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  Reports
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Settings
                </a>
              </nav>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Document Compliance Analysis for {productName}
            </h2>
            <p className="text-muted-foreground">
              Upload your documents to analyze compliance with BSP, SEC, NPC, and other Philippine financial regulations.
            </p>
          </div>
          <ComplianceTracker />
        </main>
        <Toaster />
      </div>
    </ThemeProvider>
  )
}