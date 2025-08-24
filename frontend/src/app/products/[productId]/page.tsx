"use client";

import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { MarketOpportunity } from "@/components/ui/market-opportunity";
import { SimilarProducts } from "@/components/ui/similar-products";
import { VirtualPersonas } from "@/components/ui/virtual-personas";
import { SiLabInsights } from "@/components/ui/silab-insights";
import { mockProducts } from "@/lib/mock-data";
import { Product } from "@/types/product";
import {
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Shield,
  Eye,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Calendar,
  Building,
  DollarSign,
  TrendingDown,
  Star,
  Zap,
  Lightbulb,
  ArrowRight,
  Filter,
  Search,
  Plus,
  Edit,
  Save,
  X,
} from "lucide-react";

interface ProductDashboardProps {
  params: { productId: string };
}

type TopLevelTab = "synmarket" | "compliance";
type SidebarTab = "opportunity" | "similar" | "personas" | "insights";

export default function ProductDashboard({ params }: ProductDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [topLevelTab, setTopLevelTab] = useState<TopLevelTab>("synmarket");
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("opportunity");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  // Find the product
  const product = mockProducts.find((p) => p.id === params.productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-text mb-2">
            Product Not Found
          </h1>
          <p className="text-secondary-text">
            The requested product could not be found.
          </p>
        </div>
      </div>
    );
  }

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const sidebarTabs = [
    { id: "opportunity", name: "Market Opportunity", icon: TrendingUp },
    { id: "similar", name: "Similar Products", icon: BarChart3 },
    { id: "personas", name: "Virtual Personas", icon: Users },
    { id: "insights", name: "SiLab Insights", icon: Lightbulb },
  ];

  const renderMainContent = () => {
    switch (sidebarTab) {
      case "opportunity":
        return (
          <MarketOpportunity
            product={product}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
          />
        );
      case "similar":
        return <SimilarProducts product={product} />;
      case "personas":
        return (
          <VirtualPersonas
            product={product}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
          />
        );
      case "insights":
        return (
          <SiLabInsights
            product={product}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
          />
        );
      default:
        return (
          <MarketOpportunity
            product={product}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Header */}
      <Header
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex-1">
          {/* Top-Level Navigation */}
          <div className="bg-bg-primary border-b border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-8">
                  <h1 className="text-2xl font-bold text-primary-text">
                    {product.name}
                  </h1>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setTopLevelTab("synmarket")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        topLevelTab === "synmarket"
                          ? "bg-primary text-inverse"
                          : "text-secondary-text hover:text-primary-text"
                      }`}
                    >
                      SynMarket View
                    </button>
                    <button
                      onClick={() => setTopLevelTab("compliance")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        topLevelTab === "compliance"
                          ? "bg-primary text-inverse"
                          : "text-secondary-text hover:text-primary-text"
                      }`}
                    >
                      ComplianceGuard
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-muted-text hover:text-primary transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-muted-text hover:text-primary transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex gap-8">
              {/* Left Sidebar Navigation */}
              <div className="w-64 flex-shrink-0">
                <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-4">
                  <h3 className="text-sm font-semibold text-muted-text uppercase tracking-wider mb-4">
                    Analysis Tools
                  </h3>
                  <div className="space-y-2">
                    {sidebarTabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setSidebarTab(tab.id as SidebarTab)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center ${
                            sidebarTab === tab.id
                              ? "bg-primary text-inverse shadow-lg"
                              : "text-secondary-text hover:text-primary-text hover:bg-neutral-100"
                          }`}
                        >
                          <Icon className="w-4 h-4 mr-3" />
                          {tab.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1">
                {topLevelTab === "synmarket" ? (
                  renderMainContent()
                ) : (
                  <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-8 text-center">
                    <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-primary-text mb-2">
                      ComplianceGuard
                    </h2>
                    <p className="text-secondary-text mb-6">
                      Advanced compliance monitoring and regulatory analysis
                      tools.
                    </p>
                    <p className="text-muted-text">
                      ComplianceGuard features coming soon...
                    </p>
                  </div>
                )}
              </div>

              {/* Right-Side Utility Panel */}
              <div className="w-80 flex-shrink-0">
                <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-4">
                  <h3 className="text-sm font-semibold text-muted-text uppercase tracking-wider mb-4">
                    Context & Tips
                  </h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-primary-light rounded-lg">
                      <h4 className="font-medium text-primary mb-2">
                        Quick Tip
                      </h4>
                      <p className="text-sm text-primary">
                        Use the similarity scores to identify successful
                        patterns from competitors.
                      </p>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <h4 className="font-medium text-primary-text mb-2">
                        Export Options
                      </h4>
                      <div className="space-y-2">
                        <button className="w-full text-left px-3 py-2 text-sm text-secondary-text hover:text-primary-text hover:bg-neutral-100 rounded transition-colors">
                          Export to PDF
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-secondary-text hover:text-primary-text hover:bg-neutral-100 rounded transition-colors">
                          Export to CSV
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-secondary-text hover:text-primary-text hover:bg-neutral-100 rounded transition-colors">
                          Share Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
