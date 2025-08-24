"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  BarChart3,
  Filter,
  Search,
  ArrowRight,
  CreditCard,
  DollarSign,
  Users,
  Building2,
  Calendar,
  Globe,
  Zap,
} from "lucide-react";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { ProductCard } from "@/components/ui/product-card";
import { FilterState, ComplianceStatus, ProductType } from "@/types/product";
import { mockProducts } from "@/lib/mock-data";
import { generateProductTags, formatProductType } from "@/lib/utils";

export default function ProductManagementDashboard() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    complianceStatus: "all",
    selectedTags: [],
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Calculate analytics
  const analytics = useMemo(() => {
    const total = mockProducts.length;
    const compliant = mockProducts.filter(
      (p) => p.complianceStatus === "Compliant"
    ).length;
    const pending = mockProducts.filter(
      (p) => p.complianceStatus === "PendingReview"
    ).length;
    const violations = mockProducts.filter(
      (p) => p.complianceStatus === "ViolationsFound"
    ).length;

    const byType = mockProducts.reduce((acc, product) => {
      acc[product.type] = (acc[product.type] || 0) + 1;
      return acc;
    }, {} as Record<ProductType, number>);

    return { total, compliant, pending, violations, byType };
  }, []);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const productTags = generateProductTags(product);

      const searchMatch =
        filters.search === "" ||
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.type.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        productTags.some((tag) =>
          tag.toLowerCase().includes(filters.search.toLowerCase())
        ) ||
        product.targetPersonas.some((persona) =>
          persona.toLowerCase().includes(filters.search.toLowerCase())
        );

      const statusMatch =
        filters.complianceStatus === "all" ||
        product.complianceStatus === filters.complianceStatus;

      const tagsMatch =
        filters.selectedTags.length === 0 ||
        filters.selectedTags.every((tag) => productTags.includes(tag));

      return searchMatch && statusMatch && tagsMatch;
    });
  }, [filters]);

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchValue={filters.search}
        onSearchChange={handleSearchChange}
        onMenuToggle={() => setSidebarOpen(true)}
      />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1">
          {/* Hero Section */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Product Management Dashboard
                  </h1>
                  <p className="text-lg text-gray-600">
                    Launch, monitor, and optimize your financial product
                    portfolio
                  </p>
                </div>
                <button className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl">
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Product
                </button>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Products
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {analytics.total}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-600 font-medium">+12%</span>
                    <span className="text-gray-600 ml-1">
                      from last quarter
                    </span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Compliant
                      </p>
                      <p className="text-3xl font-bold text-green-600">
                        {analytics.compliant}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Compliance Rate</span>
                      <span className="font-medium">
                        {(
                          (analytics.compliant / analytics.total) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="mt-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (analytics.compliant / analytics.total) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Under Review
                      </p>
                      <p className="text-3xl font-bold text-yellow-600">
                        {analytics.pending}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <span>Avg review time: </span>
                    <span className="font-medium text-gray-900">5.2 days</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Violations
                      </p>
                      <p className="text-3xl font-bold text-red-600">
                        {analytics.violations}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div className="mt-4 text-sm">
                    <span className="text-red-600 font-medium">
                      Requires attention
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Type Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Product Portfolio
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <CreditCard className="w-5 h-5 text-blue-600 mr-3" />
                        <span className="font-medium text-gray-900">
                          Credit Cards
                        </span>
                      </div>
                      <span className="text-xl font-bold text-blue-600">
                        {analytics.byType.CreditCard || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <DollarSign className="w-5 h-5 text-green-600 mr-3" />
                        <span className="font-medium text-gray-900">
                          Personal Loans
                        </span>
                      </div>
                      <span className="text-xl font-bold text-green-600">
                        {analytics.byType.PersonalLoan || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-purple-600 mr-3" />
                        <span className="font-medium text-gray-900">
                          Microfinance
                        </span>
                      </div>
                      <span className="text-xl font-bold text-purple-600">
                        {analytics.byType.MicrofinanceLoan || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center">
                        <Building2 className="w-5 h-5 text-orange-600 mr-3" />
                        <span className="font-medium text-gray-900">
                          Savings Accounts
                        </span>
                      </div>
                      <span className="text-xl font-bold text-orange-600">
                        {analytics.byType.SavingsAccount || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl group">
                      <div className="flex items-center">
                        <Plus className="w-5 h-5 mr-3" />
                        <span className="font-medium">Launch New Product</span>
                      </div>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                      <div className="flex items-center">
                        <Target className="w-5 h-5 mr-3" />
                        <span className="font-medium">Market Research</span>
                      </div>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                      <div className="flex items-center">
                        <BarChart3 className="w-5 h-5 mr-3" />
                        <span className="font-medium">
                          Performance Analytics
                        </span>
                      </div>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                      <div className="flex items-center">
                        <Globe className="w-5 h-5 mr-3" />
                        <span className="font-medium">Compliance Review</span>
                      </div>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Active Products
              </h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
                <div className="flex items-center space-x-4">
                  <select
                    value={filters.complianceStatus}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        complianceStatus: e.target.value as
                          | ComplianceStatus
                          | "all",
                      }))
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="all">All Compliance Status</option>
                    <option value="Compliant">Compliant</option>
                    <option value="PendingReview">Pending Review</option>
                    <option value="ViolationsFound">Violations Found</option>
                  </select>
                </div>
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to launch your next product?
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Start building innovative financial products that meet your
                  customers' needs and drive business growth.
                </p>
                <button className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    selectedTags={filters.selectedTags}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
