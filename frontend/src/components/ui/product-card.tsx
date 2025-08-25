"use client";

import Link from "next/link";
import { Product, ComplianceStatus } from "@/types/product";
import {
  getProductUrl,
  getComplianceStatusStyle,
  formatProductType,
  formatComplianceStatus,
  generateProductTags,
} from "@/lib/utils";
import { Shield } from 'lucide-react';
import {  ProductStatus } from '@/types/product';

interface ProductCardProps {
  product: Product;
  selectedTags: string[];
}

const complianceConfig: Record<
  ComplianceStatus,
  { color: string; bg: string; stripe: string }
> = {
  Compliant: {
    color: "text-success-text",
    bg: "bg-success-light",
    stripe: "bg-success",
  },
  PendingReview: {
    color: "text-warning-text",
    bg: "bg-warning-light",
    stripe: "bg-warning",
  },
  ViolationsFound: {
    color: "text-error-text",
    bg: "bg-error-light",
    stripe: "bg-error",
  },
};

function formatDate(dateString?: string): string {
  if (!dateString) return "Recently";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Recently";
  }
}

export function ProductCard({ product, selectedTags }: ProductCardProps) {
  const statusStyle = complianceConfig[product.complianceStatus];
  const productTags = generateProductTags(product);

  return (
    <Link
      href={getProductUrl(product)}
      className="group block bg-bg-primary rounded-2xl border border-neutral-200 hover:border-primary hover:shadow-md transition-all duration-200 overflow-hidden"
      aria-describedby={`product-${product.id}-status`}
    >
      <div className="relative">
        {/* Status stripe */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 ${statusStyle.stripe}`}
        />

        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="font-semibold text-primary-text text-lg mb-1 truncate group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-muted-text font-mono">
              {product.id.slice(-8)}
            </p>
          </div>

          {/* Compliance Status */}
          <div className="mb-4">
            <span
              id={`product-${product.id}-status`}
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.color} ${statusStyle.bg}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mr-2 ${statusStyle.stripe}`}
              />
              {formatComplianceStatus(product.complianceStatus)}
            </span>
          </div>

          {/* Product Type and Tags */}
          <div className="mb-4">
            <p className="text-sm text-secondary-text mb-2">
              {formatProductType(product.type)}
            </p>
            <div className="flex flex-wrap gap-1">
              {productTags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    selectedTags.includes(tag)
                      ? "bg-primary-light text-primary border border-primary"
                      : "bg-neutral-100 text-secondary-text"
                  }`}
                >
                  {tag}
                </span>
              ))}
              {productTags.length > 3 && (
                <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-neutral-100 text-secondary-text">
                  +{productTags.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Modified date */}
          <p className="text-xs text-muted-text">
            Modified on {formatDate(product.updatedAt)}
          </p>
          {/* Actions */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-neutral-400">
              Modified on {formatDate(product.updatedAt)}
            </p>
            <Link 
              href={`/compliance/${encodeURIComponent(product.name)}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-all duration-200 group/compliance"
              onClick={(e) => e.stopPropagation()}
            >
              <Shield className="h-3 w-3 group-hover/compliance:scale-110 transition-transform" />
              Compliance
            </Link>
          </div>
        </div>
      </div>
    </Link>
  );
}
