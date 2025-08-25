"use client"

import { useState, useEffect } from "react"
import { UploadPanel } from "./upload-panel"
import { DocumentViewer } from "./document-viewer" 
import { AnalysisPanel } from "./analysis-panel"
import { SemanticAnalysisPanel } from "./semantic-analysis-panel"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Upload, FileText, BarChart3, Search, Download, Keyboard } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { BackendAnalysisResponse, BackendViolationData, FrontendViolationData, AnalysisSummary } from "@/types/compliance"

const API_BASE_URL = "http://localhost:8000"

export function RealComplianceTracker() {
  const [documentContent, setDocumentContent] = useState<string>("")
  const [violations, setViolations] = useState<FrontendViolationData[]>([])
  const [analysisSummary, setAnalysisSummary] = useState<AnalysisSummary | null>(null)
  const [selectedViolation, setSelectedViolation] = useState<FrontendViolationData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [leftPanelOpen, setLeftPanelOpen] = useState(false)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredViolations, setFilteredViolations] = useState<FrontendViolationData[]>([])
  const [debugInfo, setDebugInfo] = useState<string>("")
  const [showDebug, setShowDebug] = useState(false)
  
  // New state for semantic analysis
  const [semanticAnalysisData, setSemanticAnalysisData] = useState<any>(null)
  const [selectedSection, setSelectedSection] = useState<any>(null)
  const [showSemanticAnalysis, setShowSemanticAnalysis] = useState(true)

  const addDebugInfo = (info: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setDebugInfo(prev => `[${timestamp}] ${info}\n${prev}`)
    console.log(`[DEBUG] ${info}`)
  }

  const testConnection = async () => {
    addDebugInfo("🔍 Testing backend connection...")
    
    try {
      // Test basic connectivity
      addDebugInfo(`🌐 Testing connection to: ${API_BASE_URL}`)
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      
      addDebugInfo(`📡 Health check response status: ${response.status}`)
      
      if (response.ok) {
        const data = await response.text()
        addDebugInfo(`✅ Backend is reachable! Response: ${data}`)
        toast({
          title: "Connection successful",
          description: "Backend is reachable and responding.",
        })
      } else {
        addDebugInfo(`⚠️ Health check failed with status: ${response.status}`)
        toast({
          title: "Connection issue",
          description: `Backend responded with status ${response.status}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      addDebugInfo(`❌ Connection test failed: ${errorMsg}`)
      
      // Try to determine the type of error
      if (errorMsg.includes("CORS")) {
        addDebugInfo("🚨 CORS error detected - backend may need CORS headers")
      } else if (errorMsg.includes("fetch")) {
        addDebugInfo("🚨 Network error - backend may be down or unreachable")
      }
      
      toast({
        title: "Connection failed",
        description: "Cannot reach the backend. Check debug info for details.",
        variant: "destructive",
      })
    }
  }

  const testEndpoints = async () => {
    addDebugInfo("🔍 Testing possible API endpoints...")
    
    // List of possible endpoint paths
    const endpoints = [
      "/compliance/analyze-line-by-line",
      "/compliance/analyze",
      "/rag/analyze",
      "/analyze-line-by-line",
      "/analyze",
      "/api/compliance/analyze-line-by-line",
      "/api/compliance/analyze",
      "/v1/compliance/analyze-line-by-line"
    ]
    
    for (const endpoint of endpoints) {
      try {
        addDebugInfo(`🧪 Testing: ${API_BASE_URL}${endpoint}`)
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: "GET", // Try GET first to see if endpoint exists
        })
        
        if (response.status !== 404) {
          addDebugInfo(`✅ Found endpoint: ${endpoint} (status: ${response.status})`)
          if (response.status === 405) {
            addDebugInfo(`📝 Method not allowed - endpoint exists but needs POST`)
          }
        } else {
          addDebugInfo(`❌ Not found: ${endpoint}`)
        }
      } catch (error) {
        addDebugInfo(`❌ Error testing ${endpoint}: ${error}`)
      }
    }
    
    toast({
      title: "Endpoint scan complete",
      description: "Check debug info for available endpoints.",
    })
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "u":
            e.preventDefault()
            setLeftPanelOpen(true)
            break
          case "r":
            e.preventDefault()
            if (documentContent.trim()) {
              startAnalysis()
            }
            break
          case "f":
            e.preventDefault()
            const searchInput = document.querySelector("[data-search-input]") as HTMLInputElement
            searchInput?.focus()
            break
        }
      }
      if (e.key === "Escape") {
        setLeftPanelOpen(false)
        setRightPanelOpen(false)
        setSelectedViolation(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [documentContent])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredViolations(violations)
    } else {
      const filtered = violations.filter(
        (violation) =>
          violation.violatedText.toLowerCase().includes(searchQuery.toLowerCase()) ||
          violation.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          violation.regulatorySource.law.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredViolations(filtered)
    }
  }, [violations, searchQuery])

  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text()
      setDocumentContent(text)
      setViolations([])
      setAnalysisSummary(null)
      setSelectedViolation(null)
      toast({
        title: "File uploaded successfully",
        description: `${file.name} is ready for analysis.`,
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error reading the file. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleTextInput = (text: string) => {
    setDocumentContent(text)
    setViolations([])
    setAnalysisSummary(null)
    setSelectedViolation(null)
  }

  // Transform new section analysis format to frontend violations
  const transformSectionAnalysesToViolations = (sectionAnalyses: any[]): FrontendViolationData[] => {
    console.log("🔧 Transform section analyses input:", sectionAnalyses)
    const violations: FrontendViolationData[] = []
    
    sectionAnalyses.forEach((section, sectionIndex) => {
      if (section.status === "VIOLATION" && section.violationDetails) {
        // Create violations for each violation detail in the section
        section.violationDetails.forEach((violationDetail: string, detailIndex: number) => {
          // Extract category from section type
          let category: "AML" | "DataPrivacy" | "Banking" | "Securities" = "Banking"
          if (section.sectionType === 'data_privacy' || violationDetail.toLowerCase().includes("data privacy")) {
            category = "DataPrivacy"
          } else if (violationDetail.toLowerCase().includes("aml") || violationDetail.toLowerCase().includes("9160")) {
            category = "AML"
          } else if (violationDetail.toLowerCase().includes("sec") || violationDetail.toLowerCase().includes("securities")) {
            category = "Securities"
          }

          // Determine severity based on business impact
          let severity: "high" | "medium" | "low" = "medium"
          if (section.regulatoryRisk?.toLowerCase().includes("enforcement") || section.businessImpact?.toLowerCase().includes("high")) {
            severity = "high"
          } else if (section.regulatoryRisk?.toLowerCase().includes("warning") || section.businessImpact?.toLowerCase().includes("moderate")) {
            severity = "medium"
          } else {
            severity = "low"
          }

          violations.push({
            id: `section_${sectionIndex}_violation_${detailIndex}`,
            lineNumber: section.startLine,
            startChar: 0,
            endChar: 100, // Approximate
            severity,
            violatedText: `${section.sectionTitle}: ${violationDetail}`,
            regulatorySource: {
              law: violationDetail.split(" - ")[1] || "Philippine Financial Regulations",
              section: section.sectionType,
              document: "Section Analysis",
              authority: category === "AML" ? "BSP" : category === "DataPrivacy" ? "NPC" : category === "Securities" ? "SEC" : "BSP",
              directQuote: section.sectionAnalysis || violationDetail
            },
            explanation: section.businessImpact || violationDetail,
            category
          })
        })
      }
    })
    
    console.log("🔧 Transformed section violations:", violations.length)
    return violations
  }

  // Transform backend data to frontend format (legacy line-by-line)
  const transformBackendToFrontend = (backendData: BackendViolationData[]): FrontendViolationData[] => {
    console.log("🔧 Transform input:", backendData)
    const violations = backendData.filter(item => item.status === "VIOLATION")
    console.log("🔧 Filtered violations:", violations.length, "out of", backendData.length)
    
    return violations.map((item, index) => {
        // Extract regulatory info from the regulatorySource string
        const regParts = item.regulatorySource.split(", ")
        const lawMatch = regParts[0]
        const sectionMatch = regParts[1] || ""
        
        // Determine category based on regulatory source
        let category: "AML" | "DataPrivacy" | "Banking" | "Securities" = "Banking"
        if (item.regulatorySource.includes("RA No. 9160") || item.regulatorySource.includes("AML")) {
          category = "AML"
        } else if (item.regulatorySource.includes("Data Privacy") || item.regulatorySource.includes("RA No. 10173")) {
          category = "DataPrivacy"
        } else if (item.regulatorySource.includes("SEC") || item.regulatorySource.includes("Securities")) {
          category = "Securities"
        }

        // Determine severity based on violations count and content
        let severity: "high" | "medium" | "low" = "medium"
        if (item.violations > 1 || item.complianceIssue.toLowerCase().includes("money laundering")) {
          severity = "high"
        } else if (item.violations === 1) {
          severity = "medium"
        } else {
          severity = "low"
        }

        return {
          id: `violation_${index}`,
          lineNumber: item.lineNumber,
          startChar: 0, // We'll need to calculate this based on line content
          endChar: item.originalText.length,
          severity,
          violatedText: item.originalText,
          regulatorySource: {
            law: lawMatch || "Unknown Law",
            section: sectionMatch || "Unknown Section",
            document: item.regulatorySource,
            authority: category === "AML" ? "BSP" : category === "DataPrivacy" ? "NPC" : category === "Securities" ? "SEC" : "BSP",
            directQuote: item.complianceIssue // Using compliance issue as the quote for now
          },
          explanation: item.complianceIssue,
          category
        }
      })
  }

  const startAnalysis = async () => {
    addDebugInfo("🚀 Starting analysis...")
    addDebugInfo(`Document content length: ${documentContent.length}`)
    addDebugInfo(`Document preview: ${documentContent.substring(0, 200)}`)
    
    if (!documentContent.trim()) {
      addDebugInfo("❌ No document content")
      toast({
        title: "No content to analyze",
        description: "Please upload a document or enter text before starting analysis.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 90) {
          return 90
        }
        return prev + Math.random() * 10
      })
    }, 500)

    try {
      addDebugInfo(`📡 Making API request to: ${API_BASE_URL}/compliance/analyze`)
      addDebugInfo(`Request payload preview: ${documentContent.substring(0, 100)}...`)
      
      // Call your backend API
      const response = await fetch(`${API_BASE_URL}/compliance/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: "uploaded-document.txt",
          content: documentContent
        }),
      })

      addDebugInfo(`📥 Response status: ${response.status}`)

      if (!response.ok) {
        const errorText = await response.text()
        addDebugInfo(`❌ Response error text: ${errorText}`)
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }

      const data: any = await response.json()
      addDebugInfo(`✅ Backend response received: ${JSON.stringify(data)}`)
      
      // Store semantic analysis data
      setSemanticAnalysisData(data)
      addDebugInfo(`💾 Stored semantic analysis data with ${data.section_analyses?.length || 0} sections`)
      
      // Auto-download the raw JSON response for inspection
      const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const jsonUrl = URL.createObjectURL(jsonBlob)
      const jsonLink = document.createElement("a")
      jsonLink.href = jsonUrl
      jsonLink.download = `backend-response-${new Date().toISOString().split("T")[0]}-${Date.now()}.json`
      document.body.appendChild(jsonLink)
      jsonLink.click()
      document.body.removeChild(jsonLink)
      URL.revokeObjectURL(jsonUrl)
      addDebugInfo(`📁 Auto-downloaded backend response as JSON file`)
      
      // Check if this is the new section analysis format or legacy format
      let frontendViolations: FrontendViolationData[] = []
      let totalViolations = 0
      let linesAnalyzed = 0
      let complianceScore = 100
      
      if (data.section_analyses) {
        // NEW FORMAT: Semantic section analysis
        addDebugInfo(`🔄 Processing semantic sections: ${data.section_analyses?.length || 0} sections`)
        frontendViolations = transformSectionAnalysesToViolations(data.section_analyses || [])
        addDebugInfo(`✅ Transformed to ${frontendViolations.length} violations from sections`)
        
        totalViolations = data.total_violations || frontendViolations.length
        linesAnalyzed = data.total_sections_analyzed || 0
        complianceScore = data.regulatory_summary?.compliance_score || 100
        
      } else if (data.analysis_results) {
        // LEGACY FORMAT: Line-by-line analysis
        addDebugInfo(`🔄 Transforming legacy format: ${data.analysis_results?.length || 0} items`)
        frontendViolations = transformBackendToFrontend(data.analysis_results || [])
        addDebugInfo(`✅ Transformed violations: ${frontendViolations.length}`)
        
        totalViolations = frontendViolations.length
        linesAnalyzed = data.analysis_results?.length || 0
        complianceScore = linesAnalyzed > 0 ? Math.max(0, Math.round(((linesAnalyzed - totalViolations) / linesAnalyzed) * 100)) : 100
        
      } else {
        // Handle placeholder or error response
        addDebugInfo(`⚠️ Unrecognized response format: ${data.status || 'Unknown'}`)
        addDebugInfo(`Message: ${data.message || 'No message provided'}`)
        
        // Show a message to user that backend is not fully implemented yet
        clearInterval(progressInterval)
        setIsAnalyzing(false)
        setAnalysisProgress(100)
        
        toast({
          title: "Backend response received",
          description: `Status: ${data.status || 'Unknown'}. Check debug info for details.`,
          variant: "default",
        })
        return
      }
      
      addDebugInfo(`📊 Analysis summary: ${totalViolations} violations, ${linesAnalyzed} lines, ${complianceScore}% score`)
      
      const violationsByCategory = frontendViolations.reduce((acc, violation) => {
        acc[violation.category] = (acc[violation.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const violationsByAuthority = frontendViolations.reduce((acc, violation) => {
        acc[violation.regulatorySource.authority] = (acc[violation.regulatorySource.authority] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const severityDistribution = frontendViolations.reduce((acc, violation) => {
        acc[violation.severity] = (acc[violation.severity] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const summary: AnalysisSummary = {
        complianceScore,
        totalViolations,
        linesAnalyzed,
        analysisDate: new Date().toISOString(),
        violationsByCategory,
        violationsByAuthority,
        severityDistribution,
        status: totalViolations > 0 ? "NON-COMPLIANT" : "COMPLIANT"
      }

      clearInterval(progressInterval)
      setAnalysisProgress(100)
      setViolations(frontendViolations)
      setAnalysisSummary(summary)
      setIsAnalyzing(false)

      toast({
        title: "Analysis complete",
        description: `Found ${totalViolations} compliance violations in ${linesAnalyzed} lines.`,
      })

    } catch (error) {
      clearInterval(progressInterval)
      setIsAnalyzing(false)
      setAnalysisProgress(0)
      
      addDebugInfo(`❌ Analysis error: ${error instanceof Error ? error.message : String(error)}`)
      console.error("Analysis error:", error)
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing the document. Check the debug info for details.",
        variant: "destructive",
      })
    }
  }

  const handleViolationClick = (violation: FrontendViolationData) => {
    setSelectedViolation(violation)
    setRightPanelOpen(true)
  }

  const handleExportReport = () => {
    if (!analysisSummary) {
      toast({
        title: "No analysis to export",
        description: "Please run an analysis first before exporting.",
        variant: "destructive",
      })
      return
    }

    const reportData = {
      summary: analysisSummary,
      violations: violations,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `compliance-report-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Report exported",
      description: "Compliance report has been downloaded successfully.",
    })
  }

  return (
    <div className="h-[calc(100vh-200px)]">
      <div className="lg:hidden flex flex-col gap-3 p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <Sheet open={leftPanelOpen} onOpenChange={setLeftPanelOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:w-96 p-0">
              <div className="h-full overflow-auto p-4">
                <UploadPanel
                  onFileUpload={handleFileUpload}
                  onTextInput={handleTextInput}
                  onAnalyze={startAnalysis}
                  isAnalyzing={isAnalyzing}
                  analysisProgress={analysisProgress}
                  documentContent={documentContent}
                />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-foreground">Document Analysis</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportReport} disabled={!analysisSummary}>
              <Download className="h-4 w-4" />
            </Button>
            <Sheet open={rightPanelOpen} onOpenChange={setRightPanelOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analysis
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-96 p-0">
                <div className="h-full overflow-auto p-4">
                  <SemanticAnalysisPanel
                    analysisData={semanticAnalysisData}
                    selectedSection={selectedSection}
                    onBackToOverview={() => setSelectedSection(null)}
                    onSectionSelect={(section) => setSelectedSection(section)}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {violations.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              data-search-input
              placeholder="Search violations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        )}
      </div>

      <div className="h-full lg:grid lg:grid-cols-12 lg:gap-6 lg:p-6">
        <div className="hidden lg:block lg:col-span-3">
          <div className="space-y-4">
            <UploadPanel
              onFileUpload={handleFileUpload}
              onTextInput={handleTextInput}
              onAnalyze={startAnalysis}
              isAnalyzing={isAnalyzing}
              analysisProgress={analysisProgress}
              documentContent={documentContent}
            />

            {violations.length > 0 && (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    data-search-input
                    placeholder="Search violations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportReport}
                  disabled={!analysisSummary}
                  className="w-full bg-transparent"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            )}

            <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 font-medium">
                <Keyboard className="h-3 w-3" />
                Keyboard Shortcuts
              </div>
              <div>Ctrl+U: Upload</div>
              <div>Ctrl+R: Analyze</div>
              <div>Ctrl+F: Search</div>
              <div>Esc: Close panels</div>
            </div>

            {/* Debug Panel */}
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDebug(!showDebug)}
                className="w-full text-xs"
              >
                {showDebug ? "Hide" : "Show"} Debug Info
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={testConnection}
                className="w-full text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
              >
                🔍 Test Backend Connection
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={testEndpoints}
                className="w-full text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
              >
                🧪 Find API Endpoints
              </Button>
              
              {showDebug && (
                <div className="bg-neutral-900 text-green-400 p-3 rounded-lg text-xs font-mono max-h-60 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{debugInfo || "No debug info yet..."}</pre>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-full lg:col-span-6 lg:px-0 px-4 pb-4 lg:pb-0">
          <DocumentViewer
            content={documentContent}
            violations={filteredViolations}
            onViolationClick={handleViolationClick}
            selectedViolation={selectedViolation}
          />
        </div>

        <div className="hidden lg:block lg:col-span-3">
          <SemanticAnalysisPanel
            analysisData={semanticAnalysisData}
            selectedSection={selectedSection}
            onBackToOverview={() => setSelectedSection(null)}
            onSectionSelect={(section) => setSelectedSection(section)}
          />
        </div>
      </div>
    </div>
  )
}