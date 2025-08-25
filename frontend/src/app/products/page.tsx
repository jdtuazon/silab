"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { ProductCard } from "@/components/ui/product-card";
import { ProductListItem } from "@/components/ui/product-list-item";
import { CreateProductModal } from "@/components/ui/create-product-modal";
import { AdvancedFilterModal } from "@/components/ui/advanced-filter-modal";
import { mockProducts } from "@/lib/mock-data";
import {
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  BarChart3,
  CheckCircle,
  Calendar,
  AlertTriangle,
  CreditCard,
  TrendingUp,
} from "lucide-react";

export default function ProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchValue, setSearchValue] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterCollapsed, setFilterCollapsed] = useState(false);

  // Generate available tags from all products
  const availableTags = useMemo(() => {
    const allTags = new Set<string>();
    mockProducts.forEach((product) => {
      const productTags = [
        product.type,
        product.complianceStatus,
        ...product.targetPersonas,
      ];
      productTags.forEach((tag) => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  }, []);

  // Filter products based on search and tags
  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesSearch =
        searchValue === "" ||
        product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.description.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.type.toLowerCase().includes(searchValue.toLowerCase());

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => {
          return (
            product.type === tag ||
            product.complianceStatus === tag ||
            product.targetPersonas.includes(tag)
          );
        });

      return matchesSearch && matchesTags;
    });
  }, [searchValue, selectedTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearAllTags = () => {
    setSelectedTags([]);
  };

  const handleCreateProduct = (productData: { name: string; category: string; status: string; tags: string[]; documentBrief: File }) => {
    // Handle product creation logic here
    console.log("Creating product:", productData);
  };

  // Calculate metrics
  const totalProducts = mockProducts.length;
  const compliantProducts = mockProducts.filter(
    (p) => p.complianceStatus === "Compliant"
  ).length;
  const pendingReview = mockProducts.filter(
    (p) => p.complianceStatus === "PendingReview"
  ).length;
  const violations = mockProducts.filter(
    (p) => p.complianceStatus === "ViolationsFound"
  ).length;

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Header */}
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex-1">
          {/* Hero Section */}
          <div className="bg-bg-primary border-b border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-primary-text mb-2">
                    Product Management Dashboard
                  </h1>
                  <p className="text-lg text-secondary-text">
                    Manage your financial product portfolio with intelligent
                    compliance tracking
                  </p>
                </div>
                <div className="mt-4 lg:mt-0">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-hover text-inverse font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Product
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Products */}
              <div className="bg-bg-primary p-6 rounded-xl border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-text">
                      Total Products
                    </p>
                    <p className="text-3xl font-bold text-primary-text">
                      {totalProducts}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-light rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-success mr-1" />
                  <span className="text-success font-medium">+12%</span>
                  <span className="text-secondary-text ml-1">
                    from last month
                  </span>
                </div>
              </div>

              {/* Compliant Products */}
              <div className="bg-bg-primary p-6 rounded-xl border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-text">
                      Compliant
                    </p>
                    <p className="text-3xl font-bold text-success">
                      {compliantProducts}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-success-light rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-success" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-secondary-text">
                    <span>Compliance Rate</span>
                    <span>
                      {Math.round((compliantProducts / totalProducts) * 100)}%
                    </span>
                  </div>
                  <div className="mt-1 bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-success h-2 rounded-full"
                      style={{
                        width: `${(compliantProducts / totalProducts) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Pending Review */}
              <div className="bg-bg-primary p-6 rounded-xl border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-text">
                      Pending Review
                    </p>
                    <p className="text-3xl font-bold text-warning">
                      {pendingReview}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-warning-light rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-warning" />
                  </div>
                </div>
                <div className="mt-4 text-sm text-secondary-text">
                  Average review time:{" "}
                  <span className="font-medium text-primary-text">
                    5.2 days
                  </span>
                </div>
              </div>

              {/* Violations */}
              <div className="bg-bg-primary p-6 rounded-xl border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-text">
                      Violations Found
                    </p>
                    <p className="text-3xl font-bold text-error">
                      {violations}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-error-light rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-error" />
                  </div>
                </div>
                <div className="mt-4 text-sm">
                  <span className="text-error font-medium">
                    {violations > 0
                      ? "Requires immediate attention"
                      : "All clear"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Portfolio Overview */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="bg-bg-primary p-6 rounded-xl border border-neutral-200 shadow-sm">
              <h3 className="text-lg font-semibold text-primary-text mb-4">
                Product Portfolio Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center justify-between p-4 bg-blue-light rounded-lg">
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 text-blue mr-3" />
                    <span className="font-medium text-primary-text">
                      Credit Cards
                    </span>
                  </div>
                  <span className="text-xl font-bold text-blue">
                    {mockProducts.filter((p) => p.type === "CreditCard").length}
                  </span>
                </div>
                {/* Add more product type cards as needed */}
              </div>
            </div>
          </div>

          {/* Active Products Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm">
              {/* Section Header */}
              <div className="p-6 border-b border-neutral-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-primary-text">
                      Active Products
                    </h2>
                    <p className="text-secondary-text mt-1">
                      {filteredProducts.length} of {mockProducts.length}{" "}
                      products
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-text" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      />
                    </div>

                    {/* Filter Toggle */}
                    <button
                      onClick={() => setFilterCollapsed(!filterCollapsed)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        selectedTags.length > 0
                          ? "bg-primary-light text-primary border-primary"
                          : "bg-neutral-100 text-secondary-text border-neutral-300 hover:bg-neutral-200"
                      }`}
                    >
                      <Filter className="w-4 h-4 mr-1 inline" />
                      Filters
                      {selectedTags.length > 0 && (
                        <span className="ml-1 bg-primary text-inverse rounded-full px-1.5 py-0.5 text-xs">
                          {selectedTags.length}
                        </span>
                      )}
                    </button>

                    {/* View Mode Toggle */}
                    <div className="flex border border-neutral-300 rounded-lg">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-l-lg transition-colors ${
                          viewMode === "grid"
                            ? "bg-primary text-inverse"
                            : "bg-neutral-100 text-secondary-text hover:bg-neutral-200"
                        }`}
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-r-lg transition-colors ${
                          viewMode === "list"
                            ? "bg-primary text-inverse"
                            : "bg-neutral-100 text-secondary-text hover:bg-neutral-200"
                        }`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Filter Panel */}
                {filterCollapsed && (
                  <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleTagToggle(tag)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            selectedTags.includes(tag)
                              ? "bg-primary text-inverse"
                              : "bg-neutral-100 text-secondary-text hover:bg-neutral-200"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                      {selectedTags.length > 0 && (
                        <button
                          onClick={handleClearAllTags}
                          className="px-3 py-1.5 rounded-full text-sm font-medium bg-neutral-100 text-secondary-text hover:bg-neutral-200 transition-colors"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Products Grid/List */}
              <div className="p-6">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        selectedTags={selectedTags}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProducts.map((product) => (
                      <ProductListItem
                        key={product.id}
                        product={product}
                        selectedTags={selectedTags}
                      />
                    ))}
                  </div>
                )}

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-secondary-text">
                      No products found matching your criteria.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateProductModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProduct}
      />

      <AdvancedFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        availableTags={availableTags}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        onClearAll={handleClearAllTags}
      />
    </div>
  );
}
