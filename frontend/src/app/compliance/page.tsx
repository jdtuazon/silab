"use client"

import { RealComplianceTracker } from "@/components/real-compliance-tracker"
import { Shield, FileSearch, TrendingUp, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 flex-shrink-0">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-2 flex-shrink-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg lg:text-xl font-bold text-foreground truncate">SiLab Compliance</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Philippine Financial Regulations Analysis
                </p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 flex-shrink-0">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <FileSearch className="h-4 w-4" />
                <span className="hidden lg:inline">Dashboard</span>
              </Link>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="hidden lg:inline">Reports</span>
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                <span className="hidden lg:inline">Settings</span>
                <span className="lg:hidden">•••</span>
              </a>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 py-4 lg:py-6 h-full flex flex-col">
          <div className="mb-4 lg:mb-6 flex-shrink-0">
            <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-2">
              Document Compliance Analysis
            </h2>
            <p className="text-sm lg:text-base text-muted-foreground">
              Upload documents to analyze compliance with BSP, SEC, NPC, and other Philippine financial regulations.
            </p>
          </div>
          <div className="flex-1 min-h-0">
            <RealComplianceTracker />
          </div>
        </div>
      </main>
    </div>
  )
}