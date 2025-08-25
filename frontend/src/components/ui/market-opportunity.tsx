"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import {
  TrendingUp,
  CheckCircle,
  Info,
  Edit,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  DollarSign,
  BarChart3,
  Target,
  Zap,
  Activity,
  Users,
  Globe,
  ArrowUpRight,
  Minus,
  Eye,
  Sparkles,
} from "lucide-react";

interface MarketOpportunityProps {
  product: Product;
  expandedSections: Set<string>;
  onToggleSection: (sectionId: string) => void;
}

export function MarketOpportunity({
  product,
  expandedSections,
  onToggleSection,
}: MarketOpportunityProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [productName, setProductName] = useState(product.name);
  const [productDescription, setProductDescription] = useState(
    product.description
  );

  const isExpanded = (sectionId: string) => expandedSections.has(sectionId);

  // Sample trend data for visualization
  const trendData = [
    { month: "Jan", value: 45, change: "+12%" },
    { month: "Feb", value: 52, change: "+15%" },
    { month: "Mar", value: 48, change: "-8%" },
    { month: "Apr", value: 61, change: "+27%" },
    { month: "May", value: 67, change: "+10%" },
    { month: "Jun", value: 73, change: "+9%" },
    { month: "Jul", value: 78, change: "+7%" },
    { month: "Aug", value: 82, change: "+5%" },
    { month: "Sep", value: 89, change: "+9%" },
    { month: "Oct", value: 91, change: "+2%" },
    { month: "Nov", value: 87, change: "-4%" },
    { month: "Dec", value: 94, change: "+8%" },
  ];

  const maxValue = Math.max(...trendData.map((d) => d.value));

  return (
    <div className="space-y-8">
      {/* Header Section - Enhanced */}
      <div className="bg-gradient-to-br from-primary-light/20 to-primary/5 rounded-xl border border-neutral-200 shadow-sm p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              {isEditing ? (
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="text-3xl font-bold text-primary-text bg-white/80 border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              ) : (
                <h1 className="text-3xl font-bold text-primary-text">
                  {productName}
                </h1>
              )}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 text-muted-text hover:text-primary hover:bg-white/50 rounded-lg transition-all duration-200"
              >
                <Edit className="w-5 h-5" />
              </button>
            </div>
            {isEditing ? (
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                className="w-full text-lg text-secondary-text bg-white/80 border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={3}
              />
            ) : (
              <p className="text-lg text-secondary-text leading-relaxed">
                {productDescription}
              </p>
            )}
            <div className="flex flex-wrap gap-3 mt-6">
              {product.targetPersonas.map((persona) => (
                <span
                  key={persona}
                  className="px-4 py-2 bg-white/80 text-primary rounded-full text-sm font-semibold border border-primary/20 shadow-sm"
                >
                  {persona}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button className="p-3 text-muted-text hover:text-primary hover:bg-white/50 rounded-lg transition-all duration-200">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-3 text-muted-text hover:text-primary hover:bg-white/50 rounded-lg transition-all duration-200">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Opportunity Scoring Section - Enhanced */}
      <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-primary-text flex items-center">
            <Target className="w-6 h-6 mr-3 text-primary" />
            Market Opportunity Score
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-text">AI Analysis</span>
            <button className="p-2 text-muted-text hover:text-primary hover:bg-neutral-100 rounded-lg transition-all duration-200">
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="text-center lg:text-left">
            <div className="text-6xl font-bold text-success mb-3">8.2</div>
            <div className="inline-flex items-center px-4 py-2 bg-success-light text-success-text rounded-full text-sm font-semibold shadow-sm">
              <CheckCircle className="w-5 h-5 mr-2" />
              High Opportunity
            </div>
            <div className="mt-4 text-sm text-muted-text">
              Out of 10 possible points
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <p className="text-lg text-secondary-text leading-relaxed">
              Strong market demand with growing consumer interest in{" "}
              <span className="font-semibold text-primary-text">
                {product.type.toLowerCase()}
              </span>{" "}
              products. Positive economic indicators and favorable regulatory
              environment support market entry.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-success-light/30 rounded-lg border border-success/20">
                <TrendingUp className="w-5 h-5 text-success" />
                <div>
                  <div className="text-sm font-semibold text-success">
                    +12% YoY
                  </div>
                  <div className="text-xs text-muted-text">Market Growth</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-warning-light/30 rounded-lg border border-warning/20">
                <Users className="w-5 h-5 text-warning" />
                <div>
                  <div className="text-sm font-semibold text-warning">
                    Medium
                  </div>
                  <div className="text-xs text-muted-text">Competition</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-success-light/30 rounded-lg border border-success/20">
                <CheckCircle className="w-5 h-5 text-success" />
                <div>
                  <div className="text-sm font-semibold text-success">
                    Favorable
                  </div>
                  <div className="text-xs text-muted-text">Regulations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trends & Indicators Section - Enhanced */}
      <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-primary-text flex items-center">
            <Activity className="w-6 h-6 mr-3 text-primary" />
            Market Trends & Economic Indicators
          </h3>
          <button className="text-primary hover:text-primary-hover text-sm font-semibold flex items-center gap-2">
            <Eye className="w-4 h-4" />
            View Full Report
          </button>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Google Trends - Enhanced */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-primary-text flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-success" />
              Google Search Trends
            </h4>
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-primary-text">
                  Interest in &quot;{product.type.toLowerCase()}&quot; products
                </span>
                <span className="text-sm text-success font-semibold">
                  +23% YoY
                </span>
              </div>
              {/* Trend Chart */}
              <div className="h-32 flex items-end justify-between gap-1 mb-4">
                {trendData.map((data, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div
                      className="w-full bg-gradient-to-t from-primary to-primary-light rounded-t-sm"
                      style={{ height: `${(data.value / maxValue) * 100}%` }}
                    ></div>
                    <span className="text-xs text-muted-text mt-1">
                      {data.month}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-primary-light/20 rounded-lg border border-primary/20">
                <p className="text-sm text-primary-text font-medium">
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  <strong>Trend Insight:</strong> Interest in{" "}
                  {product.type.toLowerCase()} products has increased 23% over
                  the past 12 months, with peak interest during Q4 2024.
                </p>
              </div>
            </div>
          </div>

          {/* Economic Indicators - Enhanced */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-primary-text flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-primary" />
              Economic Indicators
            </h4>
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-success-light rounded-lg">
                      <TrendingUp className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <div className="font-semibold text-primary-text">
                        Consumer Confidence Index
                      </div>
                      <div className="text-sm text-muted-text">
                        Latest: 108.7
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-success font-semibold">
                      <ArrowUpRight className="w-4 h-4" />
                      +2.1%
                    </div>
                    <div className="text-xs text-muted-text">vs last month</div>
                  </div>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2">
                  <div
                    className="bg-success h-2 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-success-light rounded-lg">
                      <Globe className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <div className="font-semibold text-primary-text">
                        GDP Growth Rate
                      </div>
                      <div className="text-sm text-muted-text">
                        Annual change
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-success font-semibold">
                      <ArrowUpRight className="w-4 h-4" />
                      +3.2%
                    </div>
                    <div className="text-xs text-muted-text">Q4 2024</div>
                  </div>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2">
                  <div
                    className="bg-success h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-warning-light rounded-lg">
                      <DollarSign className="w-4 h-4 text-warning" />
                    </div>
                    <div>
                      <div className="font-semibold text-primary-text">
                        Inflation Rate
                      </div>
                      <div className="text-sm text-muted-text">CPI change</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-warning font-semibold">
                      <Minus className="w-4 h-4" />
                      2.8%
                    </div>
                    <div className="text-xs text-muted-text">Stable</div>
                  </div>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2">
                  <div
                    className="bg-warning h-2 rounded-full"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Panel - Enhanced */}
      <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-8">
        <button
          onClick={() => onToggleSection("insights")}
          className="flex items-center justify-between w-full mb-6"
        >
          <h3 className="text-xl font-bold text-primary-text flex items-center">
            <Zap className="w-6 h-6 mr-3 text-primary" />
            AI-Powered Market Insights
          </h3>
          {isExpanded("insights") ? (
            <ChevronUp className="w-6 h-6 text-muted-text" />
          ) : (
            <ChevronDown className="w-6 h-6 text-muted-text" />
          )}
        </button>

        {isExpanded("insights") && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-success-light/30 to-success/10 rounded-xl border border-success/20">
                <h4 className="font-semibold text-success-text mb-3 flex items-center text-lg">
                  <Target className="w-5 h-5 mr-2" />
                  Market Heat Check
                </h4>
                <p className="text-success-text font-medium mb-3">
                  🔥 This market is HOT!
                </p>
                <p className="text-sm text-success-text/80 leading-relaxed">
                  Market conditions are exceptionally favorable with strong
                  demand indicators, low competition, and positive economic
                  tailwinds supporting rapid adoption.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-warning-light/30 to-warning/10 rounded-xl border border-warning/20">
                <h4 className="font-semibold text-warning-text mb-3 flex items-center text-lg">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Consumer Confidence Impact
                </h4>
                <p className="text-warning-text font-medium mb-3">
                  📈 Rising confidence = More spending
                </p>
                <p className="text-sm text-warning-text/80 leading-relaxed">
                  The 2.1% increase in consumer confidence suggests consumers
                  are more willing to adopt new financial products and services,
                  creating a favorable environment.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-primary-light/30 to-primary/10 rounded-xl border border-primary/20">
                <h4 className="font-semibold text-primary mb-3 flex items-center text-lg">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Strategic Recommendation
                </h4>
                <p className="text-primary font-medium mb-3">
                  🚀 Double down on market entry
                </p>
                <p className="text-sm text-primary/80 leading-relaxed">
                  With strong market indicators and favorable conditions,
                  recommend aggressive positioning strategy with focus on rapid
                  market penetration and customer acquisition.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
