"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import {
  TrendingUp,
  CheckCircle,
  AlertCircle,
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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {isEditing ? (
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="text-2xl font-bold text-primary-text bg-transparent border border-neutral-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <h1 className="text-2xl font-bold text-primary-text">
                  {productName}
                </h1>
              )}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-1 text-muted-text hover:text-primary transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
            {isEditing ? (
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                className="w-full text-secondary-text bg-transparent border border-neutral-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
              />
            ) : (
              <p className="text-secondary-text">{productDescription}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              {product.targetPersonas.map((persona) => (
                <span
                  key={persona}
                  className="px-3 py-1 bg-primary-light text-primary rounded-full text-sm font-medium"
                >
                  {persona}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-muted-text hover:text-primary transition-colors">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 text-muted-text hover:text-primary transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Opportunity Scoring Section */}
      <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary-text">
            Market Opportunity Score
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-text">Why?</span>
            <button className="p-1 text-muted-text hover:text-primary transition-colors">
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-success mb-2">8.2</div>
            <div className="inline-flex items-center px-3 py-1 bg-success-light text-success-text rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4 mr-1" />
              High Opportunity
            </div>
          </div>
          <div className="md:col-span-2">
            <p className="text-secondary-text mb-3">
              Strong market demand with growing consumer interest in{" "}
              {product.type.toLowerCase()} products. Positive economic
              indicators and favorable regulatory environment support market
              entry.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-success font-medium">↑ 12% YoY Growth</span>
              <span className="text-warning font-medium">
                Medium Competition
              </span>
              <span className="text-success font-medium">
                Favorable Regulations
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Trends & Indicators Section */}
      <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary-text">
            Trends & Indicators
          </h3>
          <button className="text-primary hover:text-primary-hover text-sm font-medium">
            View Full Report
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-primary-text mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Google Trends
            </h4>
            <div className="h-32 bg-neutral-100 rounded-lg flex items-center justify-center">
              <span className="text-muted-text">Trend Chart Placeholder</span>
            </div>
            <div className="mt-3 p-3 bg-primary-light rounded-lg">
              <p className="text-sm text-primary-text">
                <strong>Based on Google Trends:</strong> Interest in{" "}
                {product.type.toLowerCase()} products has increased 23% over the
                past 12 months.
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-primary-text mb-3 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Economic Indicators
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <span className="text-sm text-secondary-text">
                  Consumer Confidence Index
                </span>
                <span className="text-success font-medium">+2.1%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <span className="text-sm text-secondary-text">GDP Growth</span>
                <span className="text-success font-medium">+3.2%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <span className="text-sm text-secondary-text">
                  Inflation Rate
                </span>
                <span className="text-warning font-medium">2.8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Panel */}
      <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-6">
        <button
          onClick={() => onToggleSection("insights")}
          className="flex items-center justify-between w-full mb-4"
        >
          <h3 className="text-lg font-semibold text-primary-text flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            AI Insights
          </h3>
          {isExpanded("insights") ? (
            <ChevronUp className="w-5 h-5 text-muted-text" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-text" />
          )}
        </button>

        {isExpanded("insights") && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-success-light rounded-lg">
                <h4 className="font-medium text-success-text mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Is this hot?
                </h4>
                <p className="text-sm text-success-text">
                  Yes! Market conditions are favorable with strong demand
                  indicators.
                </p>
              </div>
              <div className="p-4 bg-warning-light rounded-lg">
                <h4 className="font-medium text-warning-text mb-2 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  CCI Impact
                </h4>
                <p className="text-sm text-warning-text">
                  Rising consumer confidence suggests increased willingness to
                  adopt new financial products.
                </p>
              </div>
              <div className="p-4 bg-primary-light rounded-lg">
                <h4 className="font-medium text-primary mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Recommended Action
                </h4>
                <p className="text-sm text-primary">
                  Double down on market entry with aggressive positioning
                  strategy.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
