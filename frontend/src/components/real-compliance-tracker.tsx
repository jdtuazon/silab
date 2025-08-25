"use client";

import { useState, useEffect } from "react";
import { UploadPanel } from "./upload-panel";
import { DocumentViewer } from "./document-viewer";
import { SemanticAnalysisPanel } from "./semantic-analysis-panel";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Upload, FileText, BarChart3, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  BackendViolationData,
  FrontendViolationData,
  AnalysisSummary,
} from "@/types/compliance";
import { ViolationData } from "./compliance-tracker";

const API_BASE_URL = "http://localhost:8000";

interface RealComplianceTrackerProps {
  viewOnly?: boolean;
}

export function RealComplianceTracker({
  viewOnly = false,
}: RealComplianceTrackerProps = {}) {
  const [documentContent, setDocumentContent] = useState<string>(
    viewOnly
      ? `Product Feature Specification
    
1. Digital Payment Processing
   Our platform facilitates digital payments through secure API integrations.
   
2. Customer Data Collection
   We collect customer information including personal identification details.
   
3. International Fund Transfers
   The system supports cross-border money transfers with real-time processing.
   
4. Risk Assessment Module  
   Automated risk scoring for all transactions based on transaction patterns.

5. Compliance Reporting
   Generate regulatory reports for BSP and SEC requirements.`
      : ""
  );
  const [violations, setViolations] = useState<FrontendViolationData[]>(
    viewOnly
      ? [
          {
            id: "demo_violation_1",
            lineNumber: 8,
            startChar: 0,
            endChar: 100,
            severity: "high" as const,
            violatedText:
              "We collect customer information including personal identification details.",
            regulatorySource: {
              law: "RA No. 10173",
              section: "Data Privacy Act - Section 12",
              document: "Data Privacy Act of 2012",
              authority: "NPC",
              directQuote:
                "Personal data must be collected for specified, explicit and legitimate purposes.",
            },
            explanation:
              "Collection of personal data requires explicit consent and clear purpose statement.",
            category: "DataPrivacy" as const,
          },
          {
            id: "demo_violation_2",
            lineNumber: 11,
            startChar: 0,
            endChar: 80,
            severity: "medium" as const,
            violatedText: "The system supports cross-border money transfers",
            regulatorySource: {
              law: "RA No. 9160",
              section: "Anti-Money Laundering Act - Section 7",
              document: "AMLA of 2001",
              authority: "BSP",
              directQuote:
                "Covered institutions shall establish customer due diligence measures.",
            },
            explanation:
              "Cross-border transfers require enhanced due diligence and AML compliance measures.",
            category: "AML" as const,
          },
        ]
      : []
  );
  const [analysisSummary, setAnalysisSummary] =
    useState<AnalysisSummary | null>(
      viewOnly
        ? {
            complianceScore: 73,
            totalViolations: 2,
            linesAnalyzed: 12,
            analysisDate: new Date().toISOString(),
            violationsByCategory: {
              DataPrivacy: 1,
              AML: 1,
              Banking: 0,
              Securities: 0,
            },
            violationsByAuthority: {
              NPC: 1,
              BSP: 1,
              SEC: 0,
            },
            severityDistribution: {
              high: 1,
              medium: 1,
              low: 0,
            },
            status: "NON-COMPLIANT" as const,
          }
        : null
    );
  const [selectedViolation, setSelectedViolation] =
    useState<FrontendViolationData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [, setDebugInfo] = useState<string>("");

  // New state for semantic analysis
  const [semanticAnalysisData, setSemanticAnalysisData] = useState<any>(
    viewOnly
      ? {
          document_name: "Product Feature Specification",
          analysis_date: new Date().toISOString(),
          analysis_type: "semantic_section_analysis",
          total_sections_analyzed: 5,
          sections_with_violations: 2,
          total_violations: 2,
          section_analyses: [
            {
              sectionTitle: "Customer Data Collection",
              sectionType: "data_privacy",
              startLine: 8,
              endLine: 9,
              status: "VIOLATION",
              violationCount: 1,
              sectionAnalysis:
                "This section collects personal data without specifying explicit consent mechanisms.",
              violationDetails: [
                "Missing explicit consent requirements for personal data collection",
              ],
              businessImpact:
                "High risk of NPC penalties and customer trust issues",
              regulatoryRisk:
                "Potential enforcement action by National Privacy Commission",
            },
            {
              sectionTitle: "International Fund Transfers",
              sectionType: "compliance",
              startLine: 11,
              endLine: 12,
              status: "VIOLATION",
              violationCount: 1,
              sectionAnalysis:
                "Cross-border transfers require enhanced AML compliance measures.",
              violationDetails: [
                "Missing enhanced due diligence requirements for international transfers",
              ],
              businessImpact: "Moderate risk of BSP regulatory action",
              regulatoryRisk: "BSP may require additional compliance measures",
            },
            {
              sectionTitle: "Risk Assessment Module",
              sectionType: "feature",
              startLine: 14,
              endLine: 15,
              status: "COMPLIANT",
              violationCount: 0,
              sectionAnalysis:
                "Risk assessment functionality aligns with regulatory requirements.",
            },
          ],
          regulatory_summary: {
            compliance_score: 73,
            status: "NON-COMPLIANT",
            domains_affected: ["Data Privacy", "Anti-Money Laundering"],
          },
        }
      : null
  );
  const [selectedSection, setSelectedSection] = useState<any>(null);

  const addDebugInfo = (info: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugInfo((prev) => `[${timestamp}] ${info}\n${prev}`);
    console.log(`[DEBUG] ${info}`);
  };

  const startAnalysis = async () => {
    addDebugInfo("🚀 Starting analysis...");
    addDebugInfo(`Document content length: ${documentContent.length}`);
    addDebugInfo(`Document preview: ${documentContent.substring(0, 200)}`);

    if (!documentContent.trim()) {
      addDebugInfo("❌ No document content");
      toast({
        title: "No content to analyze",
        description:
          "Please upload a document or enter text before starting analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 90) {
          return 90;
        }
        return prev + Math.random() * 10;
      });
    }, 500);

    try {
      addDebugInfo(
        `📡 Making API request to: ${API_BASE_URL}/compliance/analyze`
      );
      addDebugInfo(
        `Request payload preview: ${documentContent.substring(0, 100)}...`
      );

      // Call your backend API
      const response = await fetch(`${API_BASE_URL}/compliance/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: "uploaded-document.txt",
          content: documentContent,
        }),
      });

      addDebugInfo(`📥 Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        addDebugInfo(`❌ Response error text: ${errorText}`);
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${errorText}`
        );
      }

      const data: any = await response.json();
      addDebugInfo(`✅ Backend response received: ${JSON.stringify(data)}`);

      // Store semantic analysis data
      setSemanticAnalysisData(data);
      addDebugInfo(
        `💾 Stored semantic analysis data with ${
          data.section_analyses?.length || 0
        } sections`
      );

      // Auto-download the raw JSON response for inspection
      const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const jsonUrl = URL.createObjectURL(jsonBlob);
      const jsonLink = document.createElement("a");
      jsonLink.href = jsonUrl;
      jsonLink.download = `backend-response-${
        new Date().toISOString().split("T")[0]
      }-${Date.now()}.json`;
      document.body.appendChild(jsonLink);
      jsonLink.click();
      document.body.removeChild(jsonLink);
      URL.revokeObjectURL(jsonUrl);
      addDebugInfo(`📁 Auto-downloaded backend response as JSON file`);

      // Check if this is the new section analysis format or legacy format
      let frontendViolations: FrontendViolationData[] = [];
      let totalViolations = 0;
      let linesAnalyzed = 0;
      let complianceScore = 100;

      if (data.section_analyses) {
        // NEW FORMAT: Semantic section analysis
        addDebugInfo(
          `🔄 Processing semantic sections: ${
            data.section_analyses?.length || 0
          } sections`
        );
        frontendViolations = transformSectionAnalysesToViolations(
          data.section_analyses || []
        );
        addDebugInfo(
          `✅ Transformed to ${frontendViolations.length} violations from sections`
        );

        totalViolations = data.total_violations || frontendViolations.length;
        linesAnalyzed = data.total_sections_analyzed || 0;
        complianceScore = data.regulatory_summary?.compliance_score || 100;
      } else if (data.analysis_results) {
        // LEGACY FORMAT: Line-by-line analysis
        addDebugInfo(
          `🔄 Transforming legacy format: ${
            data.analysis_results?.length || 0
          } items`
        );
        frontendViolations = transformBackendToFrontend(
          data.analysis_results || []
        );
        addDebugInfo(`✅ Transformed violations: ${frontendViolations.length}`);

        totalViolations = frontendViolations.length;
        linesAnalyzed = data.analysis_results?.length || 0;
        complianceScore =
          linesAnalyzed > 0
            ? Math.max(
                0,
                Math.round(
                  ((linesAnalyzed - totalViolations) / linesAnalyzed) * 100
                )
              )
            : 100;
      } else {
        // Handle placeholder or error response
        addDebugInfo(
          `⚠️ Unrecognized response format: ${data.status || "Unknown"}`
        );
        addDebugInfo(`Message: ${data.message || "No message provided"}`);

        // Show a message to user that backend is not fully implemented yet
        clearInterval(progressInterval);
        setIsAnalyzing(false);
        setAnalysisProgress(100);

        toast({
          title: "Backend response received",
          description: `Status: ${
            data.status || "Unknown"
          }. Check debug info for details.`,
          variant: "default",
        });
        return;
      }

      addDebugInfo(
        `📊 Analysis summary: ${totalViolations} violations, ${linesAnalyzed} lines, ${complianceScore}% score`
      );

      const violationsByCategory = frontendViolations.reduce(
        (acc, violation) => {
          acc[violation.category] = (acc[violation.category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const violationsByAuthority = frontendViolations.reduce(
        (acc, violation) => {
          acc[violation.regulatorySource.authority] =
            (acc[violation.regulatorySource.authority] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const severityDistribution = frontendViolations.reduce(
        (acc, violation) => {
          acc[violation.severity] = (acc[violation.severity] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const summary: AnalysisSummary = {
        complianceScore,
        totalViolations,
        linesAnalyzed,
        analysisDate: new Date().toISOString(),
        violationsByCategory,
        violationsByAuthority,
        severityDistribution,
        status: totalViolations > 0 ? "NON-COMPLIANT" : "COMPLIANT",
      };

      clearInterval(progressInterval);
      setAnalysisProgress(100);
      setViolations(frontendViolations);
      setAnalysisSummary(summary);
      setIsAnalyzing(false);

      toast({
        title: "Analysis complete",
        description: `Found ${totalViolations} compliance violations in ${linesAnalyzed} lines.`,
      });
    } catch (error) {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      setAnalysisProgress(0);

      addDebugInfo(
        `❌ Analysis error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description:
          "There was an error analyzing the document. Check the debug info for details.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "u":
            e.preventDefault();
            setLeftPanelOpen(true);
            break;
          case "r":
            e.preventDefault();
            if (documentContent.trim()) {
              startAnalysis();
            }
            break;
        }
      }
      if (e.key === "Escape") {
        setLeftPanelOpen(false);
        setRightPanelOpen(false);
        setSelectedViolation(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [documentContent, startAnalysis]);

  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      setDocumentContent(text);
      setViolations([]);
      setAnalysisSummary(null);
      setSelectedViolation(null);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} is ready for analysis.`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error reading the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTextInput = (text: string) => {
    setDocumentContent(text);
    setViolations([]);
    setAnalysisSummary(null);
    setSelectedViolation(null);
  };

  // Transform new section analysis format to frontend violations
  const transformSectionAnalysesToViolations = (
    sectionAnalyses: any[]
  ): FrontendViolationData[] => {
    console.log("🔧 Transform section analyses input:", sectionAnalyses);
    const violations: FrontendViolationData[] = [];

    sectionAnalyses.forEach((section, sectionIndex) => {
      if (
        section.status === "VIOLATION" &&
        Array.isArray(section.violationDetails)
      ) {
        // Create violations for each violation detail in the section
        section.violationDetails.forEach(
          (violationDetail: string, detailIndex: number) => {
            // Extract category from section type
            let category: "AML" | "DataPrivacy" | "Banking" | "Securities" =
              "Banking";
            if (
              section.sectionType === "data_privacy" ||
              violationDetail.toLowerCase().includes("data privacy")
            ) {
              category = "DataPrivacy";
            } else if (
              violationDetail.toLowerCase().includes("aml") ||
              violationDetail.toLowerCase().includes("9160")
            ) {
              category = "AML";
            } else if (
              violationDetail.toLowerCase().includes("sec") ||
              violationDetail.toLowerCase().includes("securities")
            ) {
              category = "Securities";
            }

            // Determine severity based on business impact
            let severity: "high" | "medium" | "low" = "medium";
            if (
              section.regulatoryRisk?.toLowerCase().includes("enforcement") ||
              section.businessImpact?.toLowerCase().includes("high")
            ) {
              severity = "high";
            } else if (
              section.regulatoryRisk?.toLowerCase().includes("warning") ||
              section.businessImpact?.toLowerCase().includes("moderate")
            ) {
              severity = "medium";
            } else {
              severity = "low";
            }

            violations.push({
              id: `section_${sectionIndex}_violation_${detailIndex}`,
              lineNumber: section.startLine,
              startChar: 0,
              endChar: 100, // Approximate
              severity,
              violatedText: `${section.sectionTitle}: ${violationDetail}`,
              regulatorySource: {
                law:
                  violationDetail.split(" - ")[1] ||
                  "Philippine Financial Regulations",
                section: section.sectionType,
                document: "Section Analysis",
                authority:
                  category === "AML"
                    ? "BSP"
                    : category === "DataPrivacy"
                    ? "NPC"
                    : category === "Securities"
                    ? "SEC"
                    : "BSP",
                directQuote: section.sectionAnalysis || violationDetail,
              },
              explanation: section.businessImpact || violationDetail,
              category,
            });
          }
        );
      }
    });

    console.log("🔧 Transformed section violations:", violations.length);
    return violations;
  };

  // Transform backend data to frontend format (legacy line-by-line)
  const transformBackendToFrontend = (
    backendData: BackendViolationData[]
  ): FrontendViolationData[] => {
    console.log("🔧 Transform input:", backendData);
    const violations = backendData.filter(
      (item) => item.status === "VIOLATION"
    );
    console.log(
      "🔧 Filtered violations:",
      violations.length,
      "out of",
      backendData.length
    );

    return violations.map((item, index) => {
      // Extract regulatory info from the regulatorySource string
      const regParts = item.regulatorySource.split(", ");
      const lawMatch = regParts[0];
      const sectionMatch = regParts[1] || "";

      // Determine category based on regulatory source
      let category: "AML" | "DataPrivacy" | "Banking" | "Securities" =
        "Banking";
      if (
        item.regulatorySource.includes("RA No. 9160") ||
        item.regulatorySource.includes("AML")
      ) {
        category = "AML";
      } else if (
        item.regulatorySource.includes("Data Privacy") ||
        item.regulatorySource.includes("RA No. 10173")
      ) {
        category = "DataPrivacy";
      } else if (
        item.regulatorySource.includes("SEC") ||
        item.regulatorySource.includes("Securities")
      ) {
        category = "Securities";
      }

      // Determine severity based on violations count and content
      let severity: "high" | "medium" | "low" = "medium";
      if (
        item.violations > 1 ||
        item.complianceIssue.toLowerCase().includes("money laundering")
      ) {
        severity = "high";
      } else if (item.violations === 1) {
        severity = "medium";
      } else {
        severity = "low";
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
          authority:
            category === "AML"
              ? "BSP"
              : category === "DataPrivacy"
              ? "NPC"
              : category === "Securities"
              ? "SEC"
              : "BSP",
          directQuote: item.complianceIssue, // Using compliance issue as the quote for now
        },
        explanation: item.complianceIssue,
        category,
      };
    });
  };

  const handleViolationClick = (violation: FrontendViolationData) => {
    setSelectedViolation(violation);
    setRightPanelOpen(true);
  };

  const handleSectionSelect = (section: any) => {
    setSelectedSection(section);
    setRightPanelOpen(true); // Open the right panel on mobile
  };

  const handleJsonUpload = (jsonData: any) => {
    addDebugInfo(
      `📁 JSON analysis file uploaded: ${JSON.stringify(Object.keys(jsonData))}`
    );

    try {
      // Store the semantic analysis data
      setSemanticAnalysisData(jsonData);

      // Transform data for compatibility
      let frontendViolations: FrontendViolationData[] = [];
      let totalViolations = 0;
      let linesAnalyzed = 0;
      let complianceScore = 100;

      if (jsonData.section_analyses) {
        // NEW FORMAT: Semantic section analysis
        addDebugInfo(
          `🔄 Processing JSON semantic sections: ${
            jsonData.section_analyses?.length || 0
          } sections`
        );
        frontendViolations = transformSectionAnalysesToViolations(
          jsonData.section_analyses || []
        );

        totalViolations =
          jsonData.total_violations || frontendViolations.length;
        linesAnalyzed = jsonData.total_sections_analyzed || 0;
        complianceScore = jsonData.regulatory_summary?.compliance_score || 100;
      } else if (jsonData.analysis_results) {
        // LEGACY FORMAT: Line-by-line analysis
        addDebugInfo(
          `🔄 Processing JSON legacy format: ${
            jsonData.analysis_results?.length || 0
          } items`
        );
        frontendViolations = transformBackendToFrontend(
          jsonData.analysis_results || []
        );

        totalViolations = frontendViolations.length;
        linesAnalyzed = jsonData.analysis_results?.length || 0;
        complianceScore =
          linesAnalyzed > 0
            ? Math.max(
                0,
                Math.round(
                  ((linesAnalyzed - totalViolations) / linesAnalyzed) * 100
                )
              )
            : 100;
      }

      const violationsByCategory = frontendViolations.reduce(
        (acc, violation) => {
          acc[violation.category] = (acc[violation.category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const violationsByAuthority = frontendViolations.reduce(
        (acc, violation) => {
          acc[violation.regulatorySource.authority] =
            (acc[violation.regulatorySource.authority] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const severityDistribution = frontendViolations.reduce(
        (acc, violation) => {
          acc[violation.severity] = (acc[violation.severity] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const summary: AnalysisSummary = {
        complianceScore,
        totalViolations,
        linesAnalyzed,
        analysisDate: jsonData.analysis_date || new Date().toISOString(),
        violationsByCategory,
        violationsByAuthority,
        severityDistribution,
        status: totalViolations > 0 ? "NON-COMPLIANT" : "COMPLIANT",
      };

      setViolations(frontendViolations);
      setAnalysisSummary(summary);

      // Set document content if available in various possible fields
      let documentText = "";
      let reconstructedContent = "";

      // Check for document content in various possible fields
      const possibleContentFields = [
        "document_content",
        "content",
        "original_content",
        "text",
        "document_text",
        "original_document",
        "source_content",
        "raw_content",
      ];

      for (const field of possibleContentFields) {
        if (
          jsonData[field] &&
          typeof jsonData[field] === "string" &&
          jsonData[field].trim().length > 0
        ) {
          documentText = jsonData[field].trim();
          addDebugInfo(
            `📄 Found document content in field: ${field} (${documentText.length} chars)`
          );
          break;
        }
      }

      if (documentText) {
        setDocumentContent(documentText);
        addDebugInfo(
          `📄 Document content loaded: ${documentText.length} characters`
        );
      } else {
        addDebugInfo(
          `⚠️ No document content found in JSON - checking section_analyses for content reconstruction`
        );

        // Try to reconstruct document from section analyses
        if (jsonData.section_analyses && jsonData.section_analyses.length > 0) {
          // Sort sections by line number and try to reconstruct
          const sortedSections = [...jsonData.section_analyses].sort(
            (a, b) => a.startLine - b.startLine
          );

          sortedSections.forEach((section) => {
            if (section.content) {
              reconstructedContent += section.content + "\n";
            } else if (section.text) {
              reconstructedContent += section.text + "\n";
            } else {
              // Add a placeholder based on section info
              reconstructedContent += `[Section: ${section.sectionTitle}]\n[Lines ${section.startLine}-${section.endLine}]\n[Type: ${section.sectionType}]\n\n`;
            }
          });

          if (reconstructedContent.trim()) {
            setDocumentContent(reconstructedContent.trim());
            addDebugInfo(
              `🔧 Document content reconstructed from sections: ${reconstructedContent.length} characters`
            );
          }
        }
      }

      addDebugInfo(
        `✅ JSON analysis loaded: ${totalViolations} violations, ${complianceScore}% compliance`
      );

      toast({
        title: "Analysis loaded from JSON",
        description: `Loaded ${totalViolations} violations with ${complianceScore}% compliance score${
          documentText || reconstructedContent ? " and document content" : ""
        }.`,
      });
    } catch (error) {
      addDebugInfo(
        `❌ Error processing JSON: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      toast({
        title: "JSON processing failed",
        description: "There was an error processing the uploaded JSON file.",
        variant: "destructive",
      });
    }
  };

  const handleExportReport = () => {
    if (!analysisSummary) {
      toast({
        title: "No analysis to export",
        description: "Please run an analysis first before exporting.",
        variant: "destructive",
      });
      return;
    }

    const reportData = {
      summary: analysisSummary,
      violations: violations,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compliance-report-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report exported",
      description: "Compliance report has been downloaded successfully.",
    });
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="lg:hidden flex flex-col gap-3 p-3 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40 flex-shrink-0">
        <div className="flex items-center justify-between">
          <Sheet open={leftPanelOpen} onOpenChange={setLeftPanelOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                <span className="hidden xs:inline">Upload</span>
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
                  onJsonUpload={handleJsonUpload}
                />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2 min-w-0 flex-1 mx-3">
            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium text-foreground text-sm truncate">
              Document Analysis
            </span>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportReport}
              disabled={!analysisSummary}
              className="p-2"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Sheet open={rightPanelOpen} onOpenChange={setRightPanelOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden xs:inline">Analysis</span>
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
      </div>

      <div className="flex-1 min-h-0 flex flex-col lg:p-4">
        {/* Top Control Bar - Desktop Only (hidden in view-only mode) */}
        {!viewOnly && (
          <div className="hidden lg:flex items-center justify-between mb-4 p-3 bg-muted/30 rounded-lg flex-shrink-0">
            <UploadPanel
              onFileUpload={handleFileUpload}
              onTextInput={handleTextInput}
              onAnalyze={startAnalysis}
              isAnalyzing={isAnalyzing}
              analysisProgress={analysisProgress}
              documentContent={documentContent}
              onJsonUpload={handleJsonUpload}
              compact={true}
            />

            {violations.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportReport}
                disabled={!analysisSummary}
                className="ml-4"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            )}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 min-h-0 flex lg:gap-4">
          <div className="flex-1 min-h-0 lg:mx-0 mx-4 mb-4 lg:mb-0">
            <DocumentViewer
              content={documentContent}
              violations={violations.map((v) => ({
                ...v,
                workarounds: (v as any).workarounds ?? [],
              }))}
              onViolationClick={handleViolationClick}
              selectedViolation={
                {
                  ...selectedViolation,
                  workarounds: (selectedViolation as any)?.workarounds ?? [],
                } as ViolationData
              }
              semanticAnalysisData={semanticAnalysisData}
              selectedSection={selectedSection}
              onSectionSelect={handleSectionSelect}
            />
          </div>

          <div className="hidden lg:flex lg:flex-col lg:w-96 lg:flex-shrink-0">
            <div className="flex-1 min-h-0">
              <SemanticAnalysisPanel
                analysisData={semanticAnalysisData}
                selectedSection={selectedSection}
                onBackToOverview={() => setSelectedSection(null)}
                onSectionSelect={(section) => setSelectedSection(section)}
              />
            </div>
          </div>
        </div>

        {/* Debug Panel - Commented out but kept for future debugging
        <div className="hidden lg:block mt-4">
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDebug(!showDebug)}
              className="text-xs"
            >
              {showDebug ? "Hide" : "Show"} Debug Info
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={testConnection}
              className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 ml-2"
            >
              🔍 Test Backend Connection
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={testEndpoints}
              className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 ml-2"
            >
              🧪 Find API Endpoints
            </Button>
            
            {showDebug && (
              <div className="bg-neutral-900 text-green-400 p-3 rounded-lg text-xs font-mono max-h-60 overflow-y-auto mt-2">
                <pre className="whitespace-pre-wrap">{debugInfo || "No debug info yet..."}</pre>
              </div>
            )}
          </div>
        </div>
        */}
      </div>
    </div>
  );
}
