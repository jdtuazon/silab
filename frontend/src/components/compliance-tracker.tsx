"use client";

import { useState, useEffect } from "react";
import { UploadPanel } from "./upload-panel";
import { DocumentViewer } from "./document-viewer";
import { AnalysisPanel } from "./analysis-panel";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  Upload,
  FileText,
  BarChart3,
  Search,
  Download,
  Keyboard,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export interface ViolationData {
  id: string;
  lineNumber: number;
  startChar: number;
  endChar: number;
  severity: "high" | "medium" | "low";
  violatedText: string;
  regulatorySource: {
    law: string;
    section: string;
    document: string;
    authority: string;
    directQuote: string;
  };
  explanation: string;
  workarounds: Array<{
    title: string;
    description: string;
    steps: string[];
    benefit: string;
  }>;
  category: "AML" | "DataPrivacy" | "Banking" | "Securities";
}

export interface AnalysisSummary {
  complianceScore: number;
  totalViolations: number;
  linesAnalyzed: number;
  analysisDate: string;
  violationsByCategory: Record<string, number>;
  violationsByAuthority: Record<string, number>;
  severityDistribution: Record<string, number>;
  status: "COMPLIANT" | "NON-COMPLIANT";
}

export function ComplianceTracker() {
  const [documentContent, setDocumentContent] = useState<string>("");
  const [violations, setViolations] = useState<ViolationData[]>([]);
  const [analysisSummary, setAnalysisSummary] =
    useState<AnalysisSummary | null>(null);
  const [selectedViolation, setSelectedViolation] =
    useState<ViolationData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredViolations, setFilteredViolations] = useState<ViolationData[]>(
    []
  );

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
          case "f":
            e.preventDefault();
            const searchInput = document.querySelector(
              "[data-search-input]"
            ) as HTMLInputElement;
            searchInput?.focus();
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
  }, [documentContent]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredViolations(violations);
    } else {
      const filtered = violations.filter(
        (violation) =>
          violation.violatedText
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          violation.category
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          violation.regulatorySource.law
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
      setFilteredViolations(filtered);
    }
  }, [violations, searchQuery]);

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
    } catch (_) {
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

  const startAnalysis = async () => {
    if (!documentContent.trim()) {
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
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const mockViolations: ViolationData[] = [
      {
        id: "1",
        lineNumber: 15,
        startChar: 245,
        endChar: 312,
        severity: "high",
        violatedText:
          "customer data will be shared with third-party marketing partners",
        regulatorySource: {
          law: "RA 10173",
          section: "Section 12",
          document: "Data Privacy Act of 2012",
          authority: "NPC",
          directQuote:
            "Personal data shall not be processed without the consent of the data subject",
        },
        explanation:
          "This statement violates the Data Privacy Act by indicating data sharing without explicit consent.",
        workarounds: [
          {
            title: "Obtain Explicit Consent",
            description: "Implement a clear consent mechanism for data sharing",
            steps: [
              "Add consent checkbox",
              "Provide clear disclosure",
              "Allow opt-out",
            ],
            benefit: "Full compliance with DPA requirements",
          },
        ],
        category: "DataPrivacy",
      },
      {
        id: "2",
        lineNumber: 28,
        startChar: 567,
        endChar: 634,
        severity: "medium",
        violatedText:
          "transactions above PHP 500,000 require additional verification",
        regulatorySource: {
          law: "BSP Circular 950",
          section: "Section 4.2",
          document: "Anti-Money Laundering Guidelines",
          authority: "BSP",
          directQuote:
            "Covered transactions exceeding PHP 500,000 must be reported within 5 banking days",
        },
        explanation:
          "The threshold is correct but missing the mandatory reporting requirement.",
        workarounds: [
          {
            title: "Add Reporting Clause",
            description: "Include BSP reporting requirements in the policy",
            steps: ["Add reporting timeline", "Specify BSP submission process"],
            benefit: "Ensures AML compliance",
          },
        ],
        category: "AML",
      },
    ];

    const mockSummary: AnalysisSummary = {
      complianceScore: 72,
      totalViolations: 2,
      linesAnalyzed: 156,
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
      status: "NON-COMPLIANT",
    };

    clearInterval(progressInterval);
    setAnalysisProgress(100);
    setViolations(mockViolations);
    setAnalysisSummary(mockSummary);
    setIsAnalyzing(false);

    toast({
      title: "Analysis complete",
      description: `Found ${mockViolations.length} compliance violations in ${mockSummary.linesAnalyzed} lines.`,
    });
  };

  const handleViolationClick = (violation: ViolationData) => {
    setSelectedViolation(violation);
    setRightPanelOpen(true);
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
            <span className="font-medium text-foreground">
              Document Analysis
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportReport}
              disabled={!analysisSummary}
            >
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
                  <AnalysisPanel
                    analysisSummary={analysisSummary}
                    selectedViolation={selectedViolation}
                    onBackToOverview={() => setSelectedViolation(null)}
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
          <AnalysisPanel
            analysisSummary={analysisSummary}
            selectedViolation={selectedViolation}
            onBackToOverview={() => setSelectedViolation(null)}
          />
        </div>
      </div>
    </div>
  );
}
