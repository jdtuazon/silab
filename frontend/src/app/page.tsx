"use client";

import { useState, useMemo } from "react";
import {
  Grid,
  List,
  Plus,
  Filter,
  FolderOpen,
  Code,
  TestTube,
  Rocket,
  ArchiveX,
  X,
} from "lucide-react";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { ProductCard } from "@/components/ui/product-card";
import { ProductListItem } from "@/components/ui/product-list-item";
import { CreateProductModal } from "@/components/ui/create-product-modal";
import { AdvancedFilterModal } from "@/components/ui/advanced-filter-modal";
import { FilterState, ProductStatus, Product } from "@/types/product";
import { mockProducts } from "@/lib/mock-data";

type ViewMode = "grid" | "list";

const statusItems = [
  { id: "all" as const, label: "All", icon: FolderOpen },
  { id: "in-dev" as const, label: "In Development", icon: Code },
  { id: "qa" as const, label: "Quality Assurance", icon: TestTube },
  { id: "prod" as const, label: "Production", icon: Rocket },
  { id: "archived" as const, label: "Archived", icon: ArchiveX },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    selectedTags: [],
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [advancedFilterOpen, setAdvancedFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchMatch =
        filters.search === "" ||
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.category.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.tags.some((tag) =>
          tag.toLowerCase().includes(filters.search.toLowerCase())
        );

      const statusMatch =
        filters.status === "all" || product.status === filters.status;

      const tagsMatch =
        filters.selectedTags.length === 0 ||
        filters.selectedTags.every((tag) => product.tags.includes(tag));

      return searchMatch && statusMatch && tagsMatch;
    });
  }, [filters]);

  const availableTags = useMemo(() => {
    const allTags = products.flatMap((product) => product.tags);
    const uniqueTags = Array.from(new Set(allTags));
    return uniqueTags.sort((a, b) => {
      const aCount = allTags.filter((tag) => tag === a).length;
      const bCount = allTags.filter((tag) => tag === b).length;
      return bCount - aCount;
    });
  }, []);

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const handleStatusChange = (status: ProductStatus | "all") => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter((t) => t !== tag)
        : [...prev.selectedTags, tag],
    }));
  };

  const handleClearTags = () => {
    setFilters((prev) => ({ ...prev, selectedTags: [] }));
  };

  const handleCreateProduct = (productData: any) => {
    const newProduct: Product = {
      _id: `product_${Date.now()}`,
      name: productData.name,
      category: productData.category,
      status: productData.status,
      tags: productData.tags,
      description: productData.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProducts((prev) => [newProduct, ...prev]);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        searchValue={filters.search}
        onSearchChange={handleSearchChange}
        onMenuToggle={() => setSidebarOpen(true)}
      />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-6">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-neutral-900 mb-1">
              Products
            </h1>
            <p className="text-neutral-600">
              Manage and track all your products
            </p>
          </div>

          {/* Filters and view controls */}
          <div className="mb-6 space-y-4">
            {/* Filter dropdown and view controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Status filter dropdown */}
                <div className="relative">
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      handleStatusChange(
                        e.target.value as ProductStatus | "all"
                      )
                    }
                    className="appearance-none bg-white border border-neutral-300 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-neutral-700 hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer"
                  >
                    {statusItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-neutral-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Advanced filter button */}
                <button
                  onClick={() => setAdvancedFilterOpen(true)}
                  className={`inline-flex items-center px-3 py-2 border rounded-lg text-sm font-medium bg-white hover:bg-neutral-50 transition-colors ${
                    filters.selectedTags.length > 0
                      ? "border-orange-300 text-orange-700 bg-orange-50"
                      : "border-neutral-300 text-neutral-700"
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Advance Filter
                  {filters.selectedTags.length > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                      {filters.selectedTags.length}
                    </span>
                  )}
                </button>
              </div>

              {/* View mode controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${
                    viewMode === "grid"
                      ? "bg-orange-100 text-orange-600"
                      : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${
                    viewMode === "list"
                      ? "bg-orange-100 text-orange-600"
                      : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Show active tag filters if any */}
            {filters.selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-neutral-600 self-center">
                  Active tags:
                </span>
                {filters.selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                  >
                    {tag}
                    <button
                      onClick={() => handleTagToggle(tag)}
                      className="ml-1 hover:text-orange-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={handleClearTags}
                  className="text-sm text-neutral-500 hover:text-neutral-700 self-center"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Products display */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-neutral-400 mb-4">
                <Grid className="w-12 h-12 mx-auto mb-4 opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                No products found
              </h3>
              <p className="text-neutral-600 mb-4">
                No products match your current filters. Try adjusting your
                search or filters.
              </p>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Product
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  selectedTags={filters.selectedTags}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center px-4 py-2 text-xs font-medium text-neutral-500 uppercase tracking-wider border-b border-neutral-200">
                <div className="flex-1 min-w-0 pl-4">Name</div>
                <div className="flex-shrink-0 w-32 px-4">Category</div>
                <div className="flex-shrink-0 w-24 px-4">Status</div>
                <div className="flex-shrink-0 w-48 px-4">Tags</div>
                <div className="flex-shrink-0 w-32 px-4 text-right">
                  Modified
                </div>
              </div>

              {filteredProducts.map((product) => (
                <ProductListItem
                  key={product._id}
                  product={product}
                  selectedTags={filters.selectedTags}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setCreateModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40"
        aria-label="Create Product"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Create Product Modal */}
      <CreateProductModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateProduct}
      />

      {/* Advanced Filter Modal */}
      <AdvancedFilterModal
        isOpen={advancedFilterOpen}
        onClose={() => setAdvancedFilterOpen(false)}
        availableTags={availableTags}
        selectedTags={filters.selectedTags}
        onTagToggle={handleTagToggle}
        onClearTags={handleClearTags}
      />
    </div>
  );
}
