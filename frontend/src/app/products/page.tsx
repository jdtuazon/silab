'use client';

import { useState, useMemo } from 'react';
import { Grid, List, ChevronRight } from 'lucide-react';
import { Header } from '@/components/ui/header';
import { Sidebar } from '@/components/ui/sidebar';
import { ProductCard } from '@/components/ui/product-card';
import { ProductListItem } from '@/components/ui/product-list-item';
import { TagFilters } from '@/components/ui/tag-filters';
import { FilterState, ProductStatus } from '@/types/product';
import { mockProducts } from '@/lib/mock-data';

type ViewMode = 'grid' | 'list';

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    selectedTags: []
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Debounced search - in a real app, you'd use useCallback with debounce
  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      // Search filter
      const searchMatch = filters.search === '' || 
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.category.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));

      // Status filter
      const statusMatch = filters.status === 'all' || product.status === filters.status;

      // Tags filter (AND logic)
      const tagsMatch = filters.selectedTags.length === 0 || 
        filters.selectedTags.every(tag => product.tags.includes(tag));

      return searchMatch && statusMatch && tagsMatch;
    });
  }, [filters]);

  // Get all unique tags from filtered products for tag pills
  const availableTags = useMemo(() => {
    const allTags = mockProducts.flatMap(product => product.tags);
    const uniqueTags = Array.from(new Set(allTags));
    // Sort by frequency
    return uniqueTags.sort((a, b) => {
      const aCount = allTags.filter(tag => tag === a).length;
      const bCount = allTags.filter(tag => tag === b).length;
      return bCount - aCount;
    });
  }, []);

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const handleStatusChange = (status: ProductStatus | "all") => {
    setFilters(prev => ({ ...prev, status }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter(t => t !== tag)
        : [...prev.selectedTags, tag]
    }));
  };

  const handleClearTags = () => {
    setFilters(prev => ({ ...prev, selectedTags: [] }));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        searchValue={filters.search}
        onSearchChange={handleSearchChange}
        onMenuToggle={() => setSidebarOpen(true)}
      />
      
      <div className="flex">
        <Sidebar 
          selectedStatus={filters.status}
          onStatusChange={handleStatusChange}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className="flex-1 p-6">
          {/* Breadcrumb and toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center text-sm text-neutral-600">
              <span>Conversation Designer</span>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-neutral-900 font-medium">All Products</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid' 
                    ? 'bg-orange-100 text-orange-600' 
                    : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list' 
                    ? 'bg-orange-100 text-orange-600' 
                    : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tag filters */}
          <TagFilters
            availableTags={availableTags}
            selectedTags={filters.selectedTags}
            onTagToggle={handleTagToggle}
            onClearTags={handleClearTags}
          />

          {/* Products display */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-neutral-400 mb-4">
                <Grid className="w-12 h-12 mx-auto mb-4 opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No products found</h3>
              <p className="text-neutral-600">
                No products match your current filters. Try adjusting your search or filters.
              </p>
            </div>
          ) : viewMode === 'grid' ? (
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
              {/* List header */}
              <div className="flex items-center px-4 py-2 text-xs font-medium text-neutral-500 uppercase tracking-wider border-b border-neutral-200">
                <div className="flex-1 min-w-0 pl-4">Name</div>
                <div className="flex-shrink-0 w-32 px-4">Category</div>
                <div className="flex-shrink-0 w-24 px-4">Status</div>
                <div className="flex-shrink-0 w-48 px-4">Tags</div>
                <div className="flex-shrink-0 w-32 px-4 text-right">Modified</div>
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
    </div>
  );
}