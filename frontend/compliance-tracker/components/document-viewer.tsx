"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import type { ViolationData } from "./compliance-tracker"

interface DocumentViewerProps {
  content: string
  violations: ViolationData[]
  onViolationClick: (violation: ViolationData) => void
  selectedViolation: ViolationData | null
}

export function DocumentViewer({ content, violations, onViolationClick, selectedViolation }: DocumentViewerProps) {
  const [zoomLevel, setZoomLevel] = useState(100)

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 75))
  }

  const getSeverityStyles = (severity: ViolationData["severity"]) => {
    switch (severity) {
      case "high":
        return "bg-[color:var(--color-violation-high)]/20 border-[color:var(--color-violation-high)]/40 hover:bg-[color:var(--color-violation-high)]/30"
      case "medium":
        return "bg-[color:var(--color-violation-medium)]/20 border-[color:var(--color-violation-medium)]/40 hover:bg-[color:var(--color-violation-medium)]/30"
      case "low":
        return "bg-[color:var(--color-violation-low)]/20 border-[color:var(--color-violation-low)]/40 hover:bg-[color:var(--color-violation-low)]/30"
      default:
        return ""
    }
  }

  const renderHighlightedContent = () => {
    if (!content || violations.length === 0) {
      return content
    }

    // Sort violations by start position to process them in order
    const sortedViolations = [...violations].sort((a, b) => a.startChar - b.startChar)

    const result = []
    let lastIndex = 0

    sortedViolations.forEach((violation) => {
      // Add text before the violation
      if (violation.startChar > lastIndex) {
        result.push(content.slice(lastIndex, violation.startChar))
      }

      // Add the highlighted violation
      const violatedText = content.slice(violation.startChar, violation.endChar)
      const isSelected = selectedViolation?.id === violation.id

      result.push(
        <span
          key={violation.id}
          className={cn(
            "relative cursor-pointer rounded-sm border transition-all duration-200",
            getSeverityStyles(violation.severity),
            isSelected && "ring-2 ring-accent ring-offset-1",
            "touch-manipulation min-h-[44px] inline-flex items-center px-1",
          )}
          onClick={() => onViolationClick(violation)}
          title={`${violation.category} violation - Line ${violation.lineNumber}`}
        >
          {violatedText}
        </span>,
      )

      lastIndex = violation.endChar
    })

    // Add remaining text
    if (lastIndex < content.length) {
      result.push(content.slice(lastIndex))
    }

    return result
  }

  const lines = content.split("\n")

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Viewer
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoomLevel <= 75}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[60px] text-center">{zoomLevel}%</span>
            <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoomLevel >= 200}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        {content ? (
          <div className="h-full overflow-auto">
            <div className="p-6" style={{ fontSize: `${zoomLevel}%` }}>
              <div className="font-mono text-sm lg:text-sm text-xs leading-relaxed">
                {lines.map((line, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 w-8 lg:w-12 text-right pr-2 lg:pr-4 text-muted-foreground select-none border-r border-border mr-2 lg:mr-4">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-h-[1.5rem]">
                      {violations.length > 0 ? (
                        <span className="whitespace-pre-wrap">{renderHighlightedContent()}</span>
                      ) : (
                        line || "\u00A0"
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4 p-6">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground/50" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-foreground">No Document Loaded</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  <span className="lg:hidden">Tap the Upload button to begin compliance analysis.</span>
                  <span className="hidden lg:inline">
                    Upload a document or paste text content in the left panel to begin compliance analysis.
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {content && violations.length > 0 && (
        <div className="flex-shrink-0 border-t border-border p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-0 text-sm">
            <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4">
              <span className="text-muted-foreground">
                {violations.length} violation{violations.length !== 1 ? "s" : ""} found
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-[color:var(--color-violation-high)]/40"></div>
                  <span className="text-xs text-muted-foreground">High</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-[color:var(--color-violation-medium)]/40"></div>
                  <span className="text-xs text-muted-foreground">Medium</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-[color:var(--color-violation-low)]/40"></div>
                  <span className="text-xs text-muted-foreground">Low</span>
                </div>
              </div>
            </div>
            <span className="text-muted-foreground">{lines.length} lines analyzed</span>
          </div>
        </div>
      )}
    </Card>
  )
}
