export interface BackendViolationData {
  lineNumber: number
  originalText: string
  status: "VIOLATION" | "COMPLIANT"
  violations: number
  analysis: string
  complianceIssue: string
  regulatorySource: string
}

export interface BackendAnalysisResponse {
  analysis_results: BackendViolationData[]
  summary?: {
    total_violations: number
    total_lines: number
    compliance_score?: number
  }
}

export interface FrontendViolationData {
  id: string
  lineNumber: number
  startChar: number
  endChar: number
  severity: "high" | "medium" | "low"
  violatedText: string
  regulatorySource: {
    law: string
    section: string
    document: string
    authority: string
    directQuote: string
  }
  explanation: string
  category: "AML" | "DataPrivacy" | "Banking" | "Securities"
}

export interface AnalysisSummary {
  complianceScore: number
  totalViolations: number
  linesAnalyzed: number
  analysisDate: string
  violationsByCategory: Record<string, number>
  violationsByAuthority: Record<string, number>
  severityDistribution: Record<string, number>
  status: "COMPLIANT" | "NON-COMPLIANT"
}