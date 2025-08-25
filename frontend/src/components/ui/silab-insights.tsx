"use client";

import { Product } from "@/types/product";
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  Target,
  BarChart3,
  Users,
  Shield,
  ArrowRight,
  Clock,
  AlertTriangle,
  ThumbsUp,
  Eye,
  Brain,
  Rocket,
  Settings,
  FileText,
} from "lucide-react";

interface SiLabInsightsProps {
  product: Product;
  expandedSections: Set<string>;
  onToggleSection: (sectionId: string) => void;
}

export function SiLabInsights({
  expandedSections,
  onToggleSection,
}: SiLabInsightsProps) {
  const isExpanded = (sectionId: string) => expandedSections.has(sectionId);

  // Mock SWOT analysis data
  const swotAnalysis = {
    strengths: [
      { item: "Strong brand recognition", impact: "High", confidence: 95 },
      { item: "Advanced technology platform", impact: "High", confidence: 88 },
      { item: "Experienced team", impact: "Medium", confidence: 92 },
      { item: "Strong customer relationships", impact: "High", confidence: 85 },
    ],
    weaknesses: [
      { item: "Limited market presence", impact: "High", confidence: 78 },
      { item: "High operational costs", impact: "Medium", confidence: 82 },
      { item: "Regulatory constraints", impact: "High", confidence: 75 },
      { item: "Limited product portfolio", impact: "Medium", confidence: 80 },
    ],
    opportunities: [
      { item: "Growing market demand", impact: "High", confidence: 90 },
      { item: "Digital transformation trend", impact: "High", confidence: 88 },
      { item: "Regulatory changes", impact: "Medium", confidence: 70 },
      { item: "International expansion", impact: "Medium", confidence: 65 },
    ],
    threats: [
      { item: "Intense competition", impact: "High", confidence: 85 },
      { item: "Economic uncertainty", impact: "Medium", confidence: 72 },
      { item: "Technology disruption", impact: "High", confidence: 80 },
      { item: "Regulatory changes", impact: "Medium", confidence: 68 },
    ],
  };

  // Mock integrated insights
  const integratedInsights = {
    marketOpportunity: { score: 8.2, trend: "up", confidence: 85 },
    competitivePosition: { score: 7.1, trend: "stable", confidence: 78 },
    personaFit: { score: 8.5, trend: "up", confidence: 90 },
    complianceRisk: { score: 6.8, trend: "down", confidence: 75 },
  };

  // Mock key action points
  const actionPoints = [
    {
      id: "1",
      title: "Launch Market Campaign",
      description:
        "Capitalize on current market momentum with targeted digital advertising",
      urgency: "High",
      impact: "High",
      effort: "Medium",
      timeline: "2-3 months",
      rationale:
        "Market conditions are favorable with strong demand indicators",
      category: "Marketing",
      status: "pending",
    },
    {
      id: "2",
      title: "Optimize Pricing Strategy",
      description:
        "Review and adjust pricing to improve competitive positioning",
      urgency: "Medium",
      impact: "High",
      effort: "Low",
      timeline: "1-2 months",
      rationale: "Current pricing is 15% above market average",
      category: "Strategy",
      status: "in-progress",
    },
    {
      id: "3",
      title: "Enhance Mobile Experience",
      description: "Improve mobile app features and user experience",
      urgency: "High",
      impact: "Medium",
      effort: "High",
      timeline: "4-6 months",
      rationale: "Mobile usage accounts for 65% of customer interactions",
      category: "Technology",
      status: "pending",
    },
    {
      id: "4",
      title: "Strengthen Compliance Framework",
      description: "Implement enhanced compliance monitoring and reporting",
      urgency: "Medium",
      impact: "Medium",
      effort: "Medium",
      timeline: "3-4 months",
      rationale: "Regulatory requirements are becoming more stringent",
      category: "Compliance",
      status: "pending",
    },
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High":
        return "bg-error-light text-error-text";
      case "Medium":
        return "bg-warning-light text-warning-text";
      case "Low":
        return "bg-success-light text-success-text";
      default:
        return "bg-neutral-light text-neutral-text";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success-light text-success-text";
      case "in-progress":
        return "bg-primary-light text-primary";
      case "pending":
        return "bg-neutral-light text-neutral-text";
      default:
        return "bg-neutral-light text-neutral-text";
    }
  };

  return (
    <div className="space-y-6">
      {/* SWOT Analysis Panel */}
      <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary-text">
            SWOT Analysis
          </h3>
          <div className="flex gap-2">
            <button className="p-2 text-muted-text hover:text-primary transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 text-muted-text hover:text-primary transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="p-4 bg-white border-2 border-success rounded-lg shadow-sm">
              <h4 className="font-medium text-success-text mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Strengths
              </h4>
              <ul className="space-y-3">
                {swotAnalysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-success mr-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-sm text-primary-text font-medium">
                        {strength.item}
                      </span>
                      <div className="flex items-center gap-3 mt-1">
                        <span
                          className={`text-xs px-2 py-1 rounded-full bg-success-light text-success-text font-medium`}
                        >
                          {strength.impact} Impact
                        </span>
                        <span className="text-xs text-muted-text">
                          {strength.confidence}% confidence
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-white border-2 border-error rounded-lg shadow-sm">
              <h4 className="font-medium text-error-text mb-3 flex items-center">
                <TrendingDown className="w-4 h-4 mr-2" />
                Weaknesses
              </h4>
              <ul className="space-y-3">
                {swotAnalysis.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start">
                    <XCircle className="w-4 h-4 text-error mr-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-sm text-primary-text font-medium">
                        {weakness.item}
                      </span>
                      <div className="flex items-center gap-3 mt-1">
                        <span
                          className={`text-xs px-2 py-1 rounded-full bg-error-light text-error-text font-medium`}
                        >
                          {weakness.impact} Impact
                        </span>
                        <span className="text-xs text-muted-text">
                          {weakness.confidence}% confidence
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-white border-2 border-primary rounded-lg shadow-sm">
              <h4 className="font-medium text-primary mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Opportunities
              </h4>
              <ul className="space-y-3">
                {swotAnalysis.opportunities.map((opportunity, index) => (
                  <li key={index} className="flex items-start">
                    <ArrowRight className="w-4 h-4 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-sm text-primary-text font-medium">
                        {opportunity.item}
                      </span>
                      <div className="flex items-center gap-3 mt-1">
                        <span
                          className={`text-xs px-2 py-1 rounded-full bg-primary-light text-primary font-medium`}
                        >
                          {opportunity.impact} Impact
                        </span>
                        <span className="text-xs text-muted-text">
                          {opportunity.confidence}% confidence
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-white border-2 border-warning rounded-lg shadow-sm">
              <h4 className="font-medium text-warning-text mb-3 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Threats
              </h4>
              <ul className="space-y-3">
                {swotAnalysis.threats.map((threat, index) => (
                  <li key={index} className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-warning mr-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-sm text-primary-text font-medium">
                        {threat.item}
                      </span>
                      <div className="flex items-center gap-3 mt-1">
                        <span
                          className={`text-xs px-2 py-1 rounded-full bg-warning-light text-warning-text font-medium`}
                        >
                          {threat.impact} Impact
                        </span>
                        <span className="text-xs text-muted-text">
                          {threat.confidence}% confidence
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Integrated Insights Panels */}
      <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-primary-text mb-4">
          Integrated Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-primary-text flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Market Opportunity
              </h4>
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <div className="text-2xl font-bold text-success mb-1">
              {integratedInsights.marketOpportunity.score}/10
            </div>
            <p className="text-sm text-secondary-text mb-2">
              High opportunity score with strong market indicators
            </p>
            <div className="text-xs text-muted-text">
              {integratedInsights.marketOpportunity.confidence}% confidence
            </div>
          </div>
          <div className="p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-primary-text flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Competitive Position
              </h4>
              <div className="w-4 h-4 text-warning">—</div>
            </div>
            <div className="text-2xl font-bold text-warning mb-1">
              {integratedInsights.competitivePosition.score}/10
            </div>
            <p className="text-sm text-secondary-text mb-2">
              Strong position with room for improvement
            </p>
            <div className="text-xs text-muted-text">
              {integratedInsights.competitivePosition.confidence}% confidence
            </div>
          </div>
          <div className="p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-primary-text flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Persona Fit
              </h4>
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <div className="text-2xl font-bold text-success mb-1">
              {integratedInsights.personaFit.score}/10
            </div>
            <p className="text-sm text-secondary-text mb-2">
              Excellent alignment with target personas
            </p>
            <div className="text-xs text-muted-text">
              {integratedInsights.personaFit.confidence}% confidence
            </div>
          </div>
          <div className="p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-primary-text flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Compliance Risk
              </h4>
              <TrendingDown className="w-4 h-4 text-success" />
            </div>
            <div className="text-2xl font-bold text-success mb-1">
              {integratedInsights.complianceRisk.score}/10
            </div>
            <p className="text-sm text-secondary-text mb-2">
              Low risk with good compliance framework
            </p>
            <div className="text-xs text-muted-text">
              {integratedInsights.complianceRisk.confidence}% confidence
            </div>
          </div>
        </div>
      </div>

      {/* Key Action Points Panel */}
      <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary-text">
            Key Action Points
          </h3>
          <div className="flex gap-2">
            <button className="p-2 text-muted-text hover:text-primary transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 text-muted-text hover:text-primary transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {actionPoints.map((action) => (
            <div
              key={action.id}
              className="flex items-start justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-medium text-primary-text">
                    {action.title}
                  </h4>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(
                      action.urgency
                    )}`}
                  >
                    {action.urgency}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                      action.status
                    )}`}
                  >
                    {action.status}
                  </span>
                </div>
                <p className="text-sm text-secondary-text mb-2">
                  {action.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-text mb-2">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {action.timeline}
                  </span>
                  <span className="flex items-center">
                    <Target className="w-3 h-3 mr-1" />
                    {action.impact} Impact
                  </span>
                  <span className="flex items-center">
                    <Settings className="w-3 h-3 mr-1" />
                    {action.effort} Effort
                  </span>
                  <span className="flex items-center">
                    <FileText className="w-3 h-3 mr-1" />
                    {action.category}
                  </span>
                </div>
                <p className="text-xs text-muted-text">
                  <strong>Rationale:</strong> {action.rationale}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <button className="p-2 text-muted-text hover:text-primary transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 text-muted-text hover:text-primary transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations Summary */}
      <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-6">
        <button
          onClick={() => onToggleSection("ai-recommendations")}
          className="flex items-center justify-between w-full mb-4"
        >
          <h3 className="text-lg font-semibold text-primary-text flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            AI Recommendations Summary
          </h3>
          {isExpanded("ai-recommendations") ? (
            <ChevronUp className="w-5 h-5 text-muted-text" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-text" />
          )}
        </button>

        {isExpanded("ai-recommendations") && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-success-light rounded-lg">
                <h4 className="font-medium text-success-text mb-2 flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Immediate Actions
                </h4>
                <ul className="text-sm text-success-text space-y-1">
                  <li>• Launch market campaign within 30 days</li>
                  <li>• Optimize pricing strategy</li>
                  <li>• Enhance mobile experience</li>
                </ul>
              </div>
              <div className="p-4 bg-warning-light rounded-lg">
                <h4 className="font-medium text-warning-text mb-2 flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  Monitor Closely
                </h4>
                <ul className="text-sm text-warning-text space-y-1">
                  <li>• Competitive pricing changes</li>
                  <li>• Regulatory developments</li>
                  <li>• Customer feedback trends</li>
                </ul>
              </div>
              <div className="p-4 bg-primary-light rounded-lg">
                <h4 className="font-medium text-primary mb-2 flex items-center">
                  <Rocket className="w-4 h-4 mr-2" />
                  Strategic Initiatives
                </h4>
                <ul className="text-sm text-primary space-y-1">
                  <li>• Expand product portfolio</li>
                  <li>• International market entry</li>
                  <li>• Technology platform upgrade</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
