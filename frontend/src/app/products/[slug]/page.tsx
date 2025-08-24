"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  MapPin,
  Settings,
  MoreHorizontal,
} from "lucide-react";
import { Header } from "@/components/ui/header";
import { Product } from "@/types/product";
import { mockProducts } from "@/lib/mock-data";
import {
  findProductBySlug,
  getProductUrl,
  formatProductType,
  formatComplianceStatus,
} from "@/lib/utils";
import { useMemo } from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // Find the product by slug
  const product = useMemo(() => {
    return findProductBySlug(mockProducts, slug);
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header searchValue="" onSearchChange={() => {}} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
              Product Not Found
            </h1>
            <p className="text-neutral-600 mb-4">
              The product you're looking for doesn't exist.
            </p>
            <button
              onClick={() => router.push("/products")}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getComplianceStatusStyle = (status: Product["complianceStatus"]) => {
    switch (status) {
      case "Compliant":
        return "bg-green-100 text-green-800";
      case "PendingReview":
        return "bg-yellow-100 text-yellow-800";
      case "ViolationsFound":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header searchValue="" onSearchChange={() => {}} />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Back button and breadcrumb */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-neutral-600 hover:text-neutral-900 transition-colors mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <div className="text-sm text-neutral-500">
            <span
              className="hover:text-neutral-700 cursor-pointer"
              onClick={() => router.push("/products")}
            >
              Products
            </span>
            <span className="mx-2">/</span>
            <span className="text-neutral-900">{product.name}</span>
          </div>
        </div>

        {/* Product header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h1 className="text-3xl font-bold text-neutral-900 mr-4">
                {product.name}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getComplianceStatusStyle(
                  product.complianceStatus
                )}`}
              >
                {formatComplianceStatus(product.complianceStatus)}
              </span>
            </div>
            <p className="text-lg text-neutral-600 mb-4">
              {product.description ||
                "No description available for this product."}
            </p>

            {/* Meta information */}
            <div className="flex items-center space-x-6 text-sm text-neutral-500">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{formatProductType(product.type)}</span>
              </div>
              {product.updatedAt && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Updated {formatDate(product.updatedAt)}</span>
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Created {formatDate(product.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Target Personas section */}
        {product.targetPersonas.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center">
              <Tag className="w-5 h-5 mr-2" />
              Target Personas
            </h2>
            <div className="flex flex-wrap gap-2">
              {product.targetPersonas.map((persona) => (
                <span
                  key={persona}
                  className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors cursor-pointer"
                >
                  {persona}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Content sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                Overview
              </h2>
              <div className="prose prose-neutral max-w-none">
                <p className="text-neutral-700 leading-relaxed">
                  {product.description ||
                    `${product.name} is a ${formatProductType(
                      product.type
                    ).toLowerCase()} that provides essential functionality for your business needs. This product is currently ${formatComplianceStatus(
                      product.complianceStatus
                    ).toLowerCase()}.`}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                Technical Details
              </h2>
              <div className="bg-neutral-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
                      Product ID
                    </dt>
                    <dd className="mt-1 text-sm text-neutral-900 font-mono">
                      {product.id}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
                      Product Type
                    </dt>
                    <dd className="mt-1 text-sm text-neutral-900">
                      {formatProductType(product.type)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
                      Compliance Status
                    </dt>
                    <dd className="mt-1 text-sm text-neutral-900">
                      {formatComplianceStatus(product.complianceStatus)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
                      Target Personas
                    </dt>
                    <dd className="mt-1 text-sm text-neutral-900">
                      {product.targetPersonas.join(", ")}
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-neutral-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  Edit Product
                </button>
                <button className="w-full px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors">
                  View Analytics
                </button>
                <button className="w-full px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors">
                  Export Data
                </button>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Related Products
              </h3>
              <div className="space-y-3">
                {mockProducts
                  .filter((p) => p.id !== product.id && p.type === product.type)
                  .slice(0, 3)
                  .map((relatedProduct) => (
                    <button
                      key={relatedProduct.id}
                      onClick={() => {
                        router.push(getProductUrl(relatedProduct));
                      }}
                      className="w-full text-left p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      <div className="text-sm font-medium text-neutral-900">
                        {relatedProduct.name}
                      </div>
                      <div className="text-xs text-neutral-500 mt-1">
                        {formatProductType(relatedProduct.type)}
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
