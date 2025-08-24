'use client';

import Link from 'next/link';
import { Product, ProductStatus } from '@/types/product';

interface ProductListItemProps {
  product: Product;
  selectedTags: string[];
}

const statusConfig: Record<ProductStatus, { color: string; bg: string; stripe: string }> = {
  'in-dev': { color: 'text-neutral-600', bg: 'bg-neutral-100', stripe: 'bg-neutral-400' },
  'qa': { color: 'text-orange-700', bg: 'bg-orange-100', stripe: 'bg-orange-500' },
  'prod': { color: 'text-green-700', bg: 'bg-green-100', stripe: 'bg-green-500' },
  'archived': { color: 'text-neutral-500', bg: 'bg-neutral-50', stripe: 'bg-neutral-300' },
};

function formatDate(dateString?: string): string {
  if (!dateString) return 'Recently';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Recently';
  }
}

export function ProductListItem({ product, selectedTags }: ProductListItemProps) {
  const statusStyle = statusConfig[product.status];
  
  return (
    <Link 
      href={`/products/${product._id}`}
      className="group block bg-white rounded-lg border border-neutral-200 hover:border-orange-500 hover:shadow-sm transition-all duration-200 overflow-hidden"
      aria-describedby={`product-${product._id}-status`}
    >
      <div className="relative flex items-center p-4">
        {/* Status stripe */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusStyle.stripe}`} />
        
        {/* Product name and ID */}
        <div className="flex-1 min-w-0 pl-4">
          <h3 className="font-semibold text-neutral-900 text-lg truncate group-hover:text-orange-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            {product._id.slice(-8)}
          </p>
        </div>

        {/* Category */}
        <div className="flex-shrink-0 w-32 px-4">
          <p className="text-sm text-neutral-600">{product.category}</p>
        </div>

        {/* Status */}
        <div className="flex-shrink-0 w-24 px-4">
          <span 
            id={`product-${product._id}-status`}
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.color} ${statusStyle.bg}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${statusStyle.stripe}`} />
            {product.status}
          </span>
        </div>

        {/* Tags */}
        <div className="flex-shrink-0 w-48 px-4">
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  selectedTags.includes(tag)
                    ? 'bg-orange-100 text-orange-700 border border-orange-200'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {tag}
              </span>
            ))}
            {product.tags.length > 2 && (
              <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-neutral-100 text-neutral-600">
                +{product.tags.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Modified date */}
        <div className="flex-shrink-0 w-32 px-4 text-right">
          <p className="text-xs text-neutral-400">
            Modified on {formatDate(product.updatedAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}