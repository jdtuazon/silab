"use client";

import Link from "next/link";
import { Product, ComplianceStatus } from "@/types/product";
import {
  getProductUrl,
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
    color: "text-green-700",
    bg: "bg-green-100",
    stripe: "bg-green-500",
  },
  PendingReview: {
    color: "text-yellow-700",
    bg: "bg-yellow-100",
    stripe: "bg-yellow-500",
  },
  ViolationsFound: {
    color: "text-red-700",
    bg: "bg-red-100",
    stripe: "bg-red-500",
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
      className="group block bg-white rounded-lg border border-neutral-200 hover:border-orange-500 hover:shadow-sm transition-all duration-200 overflow-hidden"
      aria-describedby={`product-${product.id}-status`}
    >
      <div className="relative flex items-center p-4">
        {/* Status stripe */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 ${statusStyle.stripe}`}
        />

        {/* Product name and ID */}
        <div className="flex-1 min-w-0 pl-4">
          <h3 className="font-semibold text-neutral-900 text-lg truncate group-hover:text-orange-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            {product.id.slice(-8)}
          </p>
        </div>

        {/* Product Type */}
        <div className="flex-shrink-0 w-32 px-4">
          <p className="text-sm text-neutral-600">
            {formatProductType(product.type)}
          </p>
        </div>

        {/* Compliance Status */}
        <div className="flex-shrink-0 w-32 px-4">
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

        {/* Tags */}
        <div className="flex-shrink-0 w-48 px-4">
          <div className="flex flex-wrap gap-1">
            {productTags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  selectedTags.includes(tag)
                    ? "bg-orange-100 text-orange-700 border border-orange-200"
                    : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {tag}
              </span>
            ))}
            {productTags.length > 2 && (
              <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-neutral-100 text-neutral-600">
                +{productTags.length - 2}
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
