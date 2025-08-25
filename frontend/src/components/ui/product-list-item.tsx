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

interface ProductListItemProps {
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

export function ProductListItem({
  product,
  selectedTags,
}: ProductListItemProps) {
  const statusStyle = complianceConfig[product.complianceStatus];
  const productTags = generateProductTags(product);

  return (
    <Link
      href={getProductUrl(product)}
      className="group block bg-bg-primary rounded-lg border border-neutral-200 hover:border-primary hover:shadow-sm transition-all duration-200 overflow-hidden"
      aria-describedby={`product-${product.id}-status`}
    >
      <div className="relative">
        {/* Status stripe */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 ${statusStyle.stripe}`}
        />

        <div className="flex items-center p-4">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-primary-text text-lg truncate group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-text font-mono mt-1">
                  {product.id.slice(-8)}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-secondary-text mb-3 line-clamp-2">
              {product.description}
            </p>

            {/* Compliance Status */}
            <div className="mb-3">
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
            <div className="flex items-center gap-3">
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  product.type === "CreditCard"
                    ? "bg-blue-light text-blue-text"
                    : "bg-neutral-100 text-secondary-text"
                }`}
              >
                {formatProductType(product.type)}
              </span>
              <div className="flex flex-wrap gap-1">
                {productTags.slice(0, 2).map((tag) => (
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
                {productTags.length > 2 && (
                  <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-neutral-100 text-secondary-text">
                    +{productTags.length - 2}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Modified date */}
          <div className="flex-shrink-0 w-32 px-4 text-right">
            <p className="text-xs text-muted-text">
              Modified on {formatDate(product.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
