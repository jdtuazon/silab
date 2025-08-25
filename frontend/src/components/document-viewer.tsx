"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Target, Shield, Building2, Users, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ViolationData } from "./compliance-tracker";

interface SectionAnalysis {
  sectionTitle: string;
  sectionType: string;
  startLine: number;
  endLine: number;
  status: "VIOLATION" | "COMPLIANT";
  violationCount: number;
  sectionAnalysis: string;
}

interface DocumentViewerProps {
  content: string;
  violations: ViolationData[];
  onViolationClick: (violation: ViolationData) => void;
  selectedViolation: ViolationData | null;
  // New props for semantic analysis
  semanticAnalysisData?: {
    section_analyses: SectionAnalysis[];
  };
  selectedSection?: SectionAnalysis | null;
  onSectionSelect?: (section: SectionAnalysis) => void;
}

export function DocumentViewer({
  content,
  violations,
  onViolationClick,
  selectedViolation,
  semanticAnalysisData,
  selectedSection,
  onSectionSelect,
}: DocumentViewerProps) {
  const getSectionTypeIcon = (type: string) => {
    switch (type) {
      case "feature":
        return <Target className="h-3 w-3" />;
      case "compliance":
        return <Shield className="h-3 w-3" />;
      case "business":
        return <Building2 className="h-3 w-3" />;
      case "data_privacy":
        return <Users className="h-3 w-3" />;
      case "architecture":
        return <FileText className="h-3 w-3" />;
      default:
        return <Info className="h-3 w-3" />;
    }
  };

  const getSectionStyles = (section: SectionAnalysis, isSelected: boolean) => {
    const baseStyles =
      "cursor-pointer transition-all duration-200 border-l-4 hover:bg-opacity-30";

    if (section.status === "VIOLATION") {
      return cn(
        baseStyles,
        "bg-red-50 border-red-400 hover:bg-red-100",
        isSelected && "bg-red-100 ring-2 ring-red-300"
      );
    } else {
      return cn(
        baseStyles,
        "bg-green-50 border-green-400 hover:bg-green-100",
        isSelected && "bg-green-100 ring-2 ring-green-300"
      );
    }
  };

  const findSectionForLine = (lineNumber: number): SectionAnalysis | null => {
    if (!semanticAnalysisData?.section_analyses) return null;

    return (
      semanticAnalysisData.section_analyses.find(
        (section) =>
          lineNumber >= section.startLine && lineNumber <= section.endLine
      ) || null
    );
  };

  const getSeverityStyles = (severity: ViolationData["severity"]) => {
    switch (severity) {
      case "high":
        return "bg-[color:var(--color-violation-high)]/20 border-[color:var(--color-violation-high)]/40 hover:bg-[color:var(--color-violation-high)]/30";
      case "medium":
        return "bg-[color:var(--color-violation-medium)]/20 border-[color:var(--color-violation-medium)]/40 hover:bg-[color:var(--color-violation-medium)]/30";
      case "low":
        return "bg-[color:var(--color-violation-low)]/20 border-[color:var(--color-violation-low)]/40 hover:bg-[color:var(--color-violation-low)]/30";
      default:
        return "";
    }
  };

  const lines = content.split("\n");

  return (
    <Card className="h-full max-h-[calc(100vh-180px)] flex flex-col">
      <CardHeader className="flex-shrink-0 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Viewer
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
        {content ? (
          <div className="h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="p-6">
              <div className="font-mono text-sm lg:text-sm leading-relaxed space-y-0">
                {lines.map((line, index) => {
                  const lineNumber = index + 1;
                  const section = findSectionForLine(lineNumber);
                  const isSelected =
                    selectedSection &&
                    section &&
                    section.sectionTitle === selectedSection.sectionTitle;
                  const isFirstLineOfSection =
                    section && section.startLine === lineNumber;

                  return (
                    <div
                      key={index}
                      className={cn(
                        "flex group",
                        section &&
                          getSectionStyles(section, isSelected || false)
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (section && onSectionSelect) {
                          onSectionSelect(section);
                        }
                      }}
                    >
                      <div className="flex-shrink-0 w-8 lg:w-12 text-right pr-2 lg:pr-4 text-muted-foreground select-none border-r border-border mr-2 lg:mr-4">
                        {lineNumber}
                      </div>
                      <div className="flex-1 min-h-[1.5rem] flex items-center">
                        {isFirstLineOfSection && section && (
                          <div className="inline-flex items-center gap-1 mr-2 px-1.5 py-0.5 rounded text-xs font-medium bg-white bg-opacity-80 border">
                            {getSectionTypeIcon(section.sectionType)}
                            <span className="text-gray-700">
                              {section.sectionTitle}
                            </span>
                            {section.status === "VIOLATION" && (
                              <span className="bg-red-500 text-white px-1 py-0.5 rounded-full text-[10px] font-bold min-w-[16px] text-center">
                                {section.violationCount}
                              </span>
                            )}
                          </div>
                        )}
                        <span className="whitespace-pre-wrap flex-1">
                          {line || "\u00A0"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4 p-6">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground/50" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-foreground">
                  No Document Loaded
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  <span className="lg:hidden">
                    Tap the Upload button to begin compliance analysis.
                  </span>
                  <span className="hidden lg:inline">
                    Upload a document or paste text content in the left panel to
                    begin compliance analysis.
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {content &&
        (semanticAnalysisData?.section_analyses?.length ||
          violations.length > 0) && (
          <div className="flex-shrink-0 border-t border-border p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-0 text-sm">
              {semanticAnalysisData?.section_analyses &&
              semanticAnalysisData.section_analyses.length > 0 ? (
                // Semantic analysis footer
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4">
                  <span className="text-muted-foreground">
                    {semanticAnalysisData.section_analyses.length} section
                    {semanticAnalysisData.section_analyses.length !== 1
                      ? "s"
                      : ""}{" "}
                    analyzed
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-sm bg-red-400"></div>
                      <span className="text-xs text-muted-foreground">
                        Violations
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-sm bg-green-400"></div>
                      <span className="text-xs text-muted-foreground">
                        Compliant
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                // Legacy violation footer
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4">
                  <span className="text-muted-foreground">
                    {violations.length} violation
                    {violations.length !== 1 ? "s" : ""} found
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-sm bg-[color:var(--color-violation-high)]/40"></div>
                      <span className="text-xs text-muted-foreground">
                        High
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-sm bg-[color:var(--color-violation-medium)]/40"></div>
                      <span className="text-xs text-muted-foreground">
                        Medium
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-sm bg-[color:var(--color-violation-low)]/40"></div>
                      <span className="text-xs text-muted-foreground">Low</span>
                    </div>
                  </div>
                </div>
              )}
              <span className="text-muted-foreground">
                {lines.length} lines • Click sections for details
              </span>
            </div>
          </div>
        )}
    </Card>
  );
}
