"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  AlertTriangle, 
  Shield, 
  FileText, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  ChevronDown,
  ChevronRight,
  Target,
  Lightbulb,
  Building2,
  AlertCircle,
  Info,
  Award,
  Users,
  DollarSign
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface SectionAnalysis {
  sectionTitle: string
  sectionType: string
  startLine: number
  endLine: number
  status: "VIOLATION" | "COMPLIANT"
  violationCount: number
  analysis: string
  sectionAnalysis: string
  violationDetails?: string[]
  businessImpact?: string
  regulatoryRisk?: string
  workarounds?: Array<{
    title: string
    description: string
    steps: string[]
    regulatoryAlignment: string
    businessBenefit: string
  }>
}

interface RegulatorySummary {
  compliance_score: number
  status: string
  domains_affected: string[]
  business_impact_sections?: Array<{
    section: string
    violations: number
    impact: string
    risk: string
  }>
}

interface SemanticAnalysisData {
  document_name: string
  analysis_date: string
  analysis_type: string
  total_sections_analyzed: number
  sections_with_violations: number
  total_violations: number
  section_analyses: SectionAnalysis[]
  regulatory_summary: RegulatorySummary
  violation_breakdown: Record<string, SectionAnalysis[]>
}

interface SemanticAnalysisPanelProps {
  analysisData: SemanticAnalysisData | null
  selectedSection: SectionAnalysis | null
  onBackToOverview: () => void
  onSectionSelect: (section: SectionAnalysis) => void
}

export function SemanticAnalysisPanel({ 
  analysisData, 
  selectedSection, 
  onBackToOverview,
  onSectionSelect 
}: SemanticAnalysisPanelProps) {

  const getSectionTypeIcon = (type: string) => {
    switch (type) {
      case "feature": return <Target className="h-4 w-4" />
      case "compliance": return <Shield className="h-4 w-4" />
      case "business": return <Building2 className="h-4 w-4" />
      case "data_privacy": return <Users className="h-4 w-4" />
      case "architecture": return <FileText className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const getSectionTypeBadgeColor = (type: string) => {
    switch (type) {
      case "feature": return "bg-blue-100 text-blue-800 border-blue-200"
      case "compliance": return "bg-red-100 text-red-800 border-red-200" 
      case "business": return "bg-green-100 text-green-800 border-green-200"
      case "data_privacy": return "bg-purple-100 text-purple-800 border-purple-200"
      case "architecture": return "bg-orange-100 text-orange-800 border-orange-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getComplianceScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 50) return "text-yellow-600" 
    return "text-red-600"
  }

  if (!analysisData) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent>
          <div className="text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No Analysis Available</p>
            <p className="text-sm">Upload a document and run analysis to see results here.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (selectedSection) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0 border-b">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBackToOverview} className="p-1 h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 flex-1">
              {getSectionTypeIcon(selectedSection.sectionType)}
              <div>
                <CardTitle className="text-lg">{selectedSection.sectionTitle}</CardTitle>
                <p className="text-sm text-muted-foreground">Lines {selectedSection.startLine}-{selectedSection.endLine}</p>
              </div>
            </div>
            <Badge 
              variant={selectedSection.status === "VIOLATION" ? "destructive" : "success"}
              className="shrink-0"
            >
              {selectedSection.status === "VIOLATION" ? (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  {selectedSection.violationCount} Violations
                </>
              ) : (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Compliant
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-auto p-6 space-y-6">
          {/* Section Analysis */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Analysis Summary
            </h3>
            <Alert>
              <AlertDescription className="text-sm leading-relaxed">
                {selectedSection.sectionAnalysis}
              </AlertDescription>
            </Alert>
          </div>

          {/* Violation Details */}
          {selectedSection.violationDetails && selectedSection.violationDetails.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                Regulatory Violations ({selectedSection.violationCount})
              </h3>
              <div className="space-y-3">
                {selectedSection.violationDetails.map((violation, index) => (
                  <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="bg-red-100 text-red-600 rounded-full p-1 shrink-0">
                        <span className="text-xs font-bold w-5 h-5 flex items-center justify-center">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-red-800">{violation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Business Impact */}
          {selectedSection.businessImpact && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-orange-600" />
                Business Impact
              </h3>
              <Alert className="border-orange-200 bg-orange-50">
                <AlertDescription className="text-sm leading-relaxed text-orange-800">
                  {selectedSection.businessImpact}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Regulatory Risk */}
          {selectedSection.regulatoryRisk && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Regulatory Risk
              </h3>
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-sm leading-relaxed text-red-800">
                  {selectedSection.regulatoryRisk}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Workarounds */}
          {selectedSection.workarounds && selectedSection.workarounds.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                Compliance Solutions ({selectedSection.workarounds.length})
              </h3>
              <div className="space-y-4">
                {selectedSection.workarounds.map((workaround, index) => (
                  <Card key={index} className="border-blue-200 bg-blue-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base text-blue-800">{workaround.title}</CardTitle>
                      <p className="text-sm text-blue-700">{workaround.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Implementation Steps:</h4>
                        <ul className="space-y-1">
                          {workaround.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="text-sm flex items-start gap-2">
                              <span className="bg-blue-100 text-blue-600 rounded-full text-xs w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                                {stepIndex + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                          <h5 className="font-medium text-sm text-green-800 mb-1">Regulatory Benefit</h5>
                          <p className="text-xs text-green-700">{workaround.regulatoryAlignment}</p>
                        </div>
                        <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
                          <h5 className="font-medium text-sm text-purple-800 mb-1">Business Benefit</h5>
                          <p className="text-xs text-purple-700">{workaround.businessBenefit}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Compliance Analysis Results</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {analysisData.document_name} • {new Date(analysisData.analysis_date).toLocaleDateString()}
            </p>
          </div>
          <Badge variant="outline" className="shrink-0">
            {analysisData.analysis_type.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto p-6 space-y-6">
        {/* Overall Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Sections Analyzed</p>
                  <p className="text-2xl font-bold text-blue-900">{analysisData.total_sections_analyzed}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Total Violations</p>
                  <p className="text-2xl font-bold text-red-900">{analysisData.total_violations}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            "bg-gradient-to-br border-2",
            analysisData.regulatory_summary.compliance_score >= 80 
              ? "from-green-50 to-green-100 border-green-200" 
              : analysisData.regulatory_summary.compliance_score >= 50
              ? "from-yellow-50 to-yellow-100 border-yellow-200"
              : "from-red-50 to-red-100 border-red-200"
          )}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn(
                    "text-sm font-medium",
                    getComplianceScoreColor(analysisData.regulatory_summary.compliance_score)
                  )}>
                    Compliance Score
                  </p>
                  <p className={cn(
                    "text-2xl font-bold",
                    getComplianceScoreColor(analysisData.regulatory_summary.compliance_score)
                  )}>
                    {analysisData.regulatory_summary.compliance_score}/100
                  </p>
                </div>
                <Award className={cn(
                  "h-8 w-8",
                  getComplianceScoreColor(analysisData.regulatory_summary.compliance_score)
                )} />
              </div>
              <Progress 
                value={analysisData.regulatory_summary.compliance_score} 
                className="mt-2 h-2"
              />
            </CardContent>
          </Card>
        </div>

        {/* Regulatory Status */}
        <Alert className={cn(
          analysisData.regulatory_summary.status === "NON-COMPLIANT" 
            ? "border-red-200 bg-red-50" 
            : "border-green-200 bg-green-50"
        )}>
          <AlertCircle className={cn(
            "h-4 w-4",
            analysisData.regulatory_summary.status === "NON-COMPLIANT" ? "text-red-600" : "text-green-600"
          )} />
          <AlertDescription>
            <span className="font-medium">
              Status: {analysisData.regulatory_summary.status}
            </span>
            {analysisData.regulatory_summary.domains_affected && (
              <span className="ml-2">
                • Affected domains: {analysisData.regulatory_summary.domains_affected.join(', ')}
              </span>
            )}
          </AlertDescription>
        </Alert>

        {/* Section Analysis */}
        <div>
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Section-by-Section Analysis ({analysisData.section_analyses.length})
          </h3>
          
          <div className="space-y-3">
            {analysisData.section_analyses.map((section, index) => (
              <Card key={index} className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                section.status === "VIOLATION" ? "border-red-200" : "border-green-200"
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getSectionTypeIcon(section.sectionType)}
                      <div>
                        <h4 className="font-medium">{section.sectionTitle}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs", getSectionTypeBadgeColor(section.sectionType))}
                          >
                            {section.sectionType.replace('_', ' ')}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Lines {section.startLine}-{section.endLine}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {section.status === "VIOLATION" ? (
                        <Badge variant="destructive" className="shrink-0">
                          <XCircle className="h-3 w-3 mr-1" />
                          {section.violationCount} violations
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="shrink-0 border-green-200 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Compliant
                        </Badge>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onSectionSelect(section)}
                        className="p-2 h-8"
                      >
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                {section.status === "VIOLATION" && (
                  <CardContent className="pt-0">
                    <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-md">
                      <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm text-red-800 leading-relaxed">
                          {section.sectionAnalysis}
                        </p>
                        {section.violationDetails && section.violationDetails.length > 0 && (
                          <div className="text-xs text-red-700">
                            <strong>Key violations:</strong> {section.violationDetails[0].substring(0, 120)}...
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}