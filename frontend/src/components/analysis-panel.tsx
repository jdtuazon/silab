"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, AlertTriangle, Shield, FileText, Calendar, TrendingUp, CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ViolationData, AnalysisSummary } from "./compliance-tracker"

interface AnalysisPanelProps {
  analysisSummary: AnalysisSummary | null
  selectedViolation: ViolationData | null
  onBackToOverview: () => void
}

export function AnalysisPanel({ analysisSummary, selectedViolation, onBackToOverview }: AnalysisPanelProps) {
  const getSeverityColor = (severity: ViolationData["severity"]) => {
    switch (severity) {
      case "high":
        return "text-[color:var(--color-violation-high)]"
      case "medium":
        return "text-[color:var(--color-violation-medium)]"
      case "low":
        return "text-[color:var(--color-violation-low)]"
      default:
        return "text-muted-foreground"
    }
  }

  const getSeverityBadgeVariant = (severity: ViolationData["severity"]) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  if (selectedViolation) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBackToOverview} className="p-1 h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-lg font-semibold">Violation Details</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto space-y-6">
          {/* Violation Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant={getSeverityBadgeVariant(selectedViolation.severity)}>
                {selectedViolation.severity.toUpperCase()}
              </Badge>
              <Badge variant="outline">{selectedViolation.category}</Badge>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Line {selectedViolation.lineNumber}</p>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium text-foreground">"{selectedViolation.violatedText}"</p>
              </div>
            </div>
          </div>

          {/* Regulatory Source */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground">Regulatory Source</h3>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Law:</span>
                <span className="font-medium text-foreground">{selectedViolation.regulatorySource.law}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Section:</span>
                <span className="font-medium text-foreground">{selectedViolation.regulatorySource.section}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Authority:</span>
                <span className="font-medium text-foreground">{selectedViolation.regulatorySource.authority}</span>
              </div>
            </div>

            <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
              <p className="text-sm text-foreground italic">"{selectedViolation.regulatorySource.directQuote}"</p>
              <p className="text-xs text-muted-foreground mt-2">— {selectedViolation.regulatorySource.document}</p>
            </div>
          </div>

          {/* Explanation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground">Explanation</h3>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{selectedViolation.explanation}</p>
          </div>

          {/* Suggested Workarounds */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground">Suggested Solutions</h3>
            </div>

            <div className="space-y-4">
              {selectedViolation.workarounds.map((workaround, index) => (
                <div key={index} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-foreground">{workaround.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      Solution {index + 1}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">{workaround.description}</p>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-foreground">Implementation Steps:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {workaround.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-2">
                          <span className="text-accent">•</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-compliant font-medium">Benefit: {workaround.benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (analysisSummary) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compliance Analysis
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto space-y-6">
          {/* Overall Score */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Compliance Score</h3>
              <div className="flex items-center gap-2">
                {analysisSummary.status === "COMPLIANT" ? (
                  <CheckCircle className="h-4 w-4 text-compliant" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
                <Badge variant={analysisSummary.status === "COMPLIANT" ? "default" : "destructive"}>
                  {analysisSummary.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Score</span>
                <span className="font-bold text-2xl text-foreground">{analysisSummary.complianceScore}/100</span>
              </div>
              <Progress value={analysisSummary.complianceScore} className="h-3" />
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total Violations</p>
              <p className="text-lg font-bold text-foreground">{analysisSummary.totalViolations}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Lines Analyzed</p>
              <p className="text-lg font-bold text-foreground">{analysisSummary.linesAnalyzed}</p>
            </div>
          </div>

          {/* Violation Breakdown */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Violation Breakdown</h3>
            <div className="space-y-2">
              {Object.entries(analysisSummary.violationsByCategory).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{category}</span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Regulatory Bodies */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Regulatory Analysis</h3>
            <div className="space-y-2">
              {Object.entries(analysisSummary.violationsByAuthority).map(([authority, count]) => (
                <div key={authority} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{authority}</span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Severity Distribution */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Severity Distribution</h3>
            <div className="space-y-2">
              {Object.entries(analysisSummary.severityDistribution).map(([severity, count]) => (
                <div key={severity} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-3 h-3 rounded-sm",
                        severity === "high" && "bg-[color:var(--color-violation-high)]",
                        severity === "medium" && "bg-[color:var(--color-violation-medium)]",
                        severity === "low" && "bg-[color:var(--color-violation-low)]",
                      )}
                    ></div>
                    <span className="text-sm text-muted-foreground capitalize">{severity} Risk</span>
                  </div>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Date */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Analyzed on {new Date(analysisSummary.analysisDate).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg font-semibold">Analysis Results</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-16 w-16 mx-auto text-muted-foreground/50" />
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-foreground">No Analysis Available</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Upload a document and run the analysis to see compliance results and violation details.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
