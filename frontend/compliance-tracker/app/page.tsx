import { ComplianceTracker } from "@/components/compliance-tracker"
import { Shield, FileSearch, TrendingUp } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">SiLab Compliance</h1>
                <p className="text-xs text-muted-foreground">Philippine Financial Regulations Analysis</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <FileSearch className="h-4 w-4" />
                Dashboard
              </a>
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
          <h2 className="text-2xl font-bold text-foreground mb-2">Document Compliance Analysis</h2>
          <p className="text-muted-foreground">
            Upload your documents to analyze compliance with BSP, SEC, NPC, and other Philippine financial regulations.
          </p>
        </div>
        <ComplianceTracker />
      </main>
    </div>
  )
}
