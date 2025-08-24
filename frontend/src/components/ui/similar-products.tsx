"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import {
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Download,
  Share2,
  Building,
  Calendar,
  TrendingUp,
  TrendingDown,
  Target,
  Copy,
  AlertTriangle,
} from "lucide-react";

interface SimilarProductsProps {
  product: Product;
}

export function SimilarProducts({ product }: SimilarProductsProps) {
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("similarity");

  // Mock similar products data
  const similarProducts = [
    {
      id: "1",
      name: "Competitor Credit Card Pro",
      company: "Competitor Bank",
      description: "Premium credit card with competitive rewards and low fees",
      dateReleased: "Jan 2024",
      similarity: 87,
      status: "successful" as const,
      overview:
        "High-performing credit card with strong customer adoption and positive reviews.",
    },
    {
      id: "2",
      name: "Rival Loan Express",
      company: "Rival Financial",
      description: "Quick personal loan with flexible terms",
      dateReleased: "Mar 2024",
      similarity: 76,
      status: "failed" as const,
      overview:
        "Faced challenges with customer acquisition and high default rates.",
    },
    {
      id: "3",
      name: "Alternative Micro Credit",
      company: "Alternative Finance",
      description: "Microfinance solution for underserved communities",
      dateReleased: "Dec 2023",
      similarity: 92,
      status: "successful" as const,
      overview:
        "Successful community-focused lending with strong repayment rates.",
    },
    {
      id: "4",
      name: "Market Leader Card",
      company: "Market Leader Bank",
      description: "Industry-leading credit card with innovative features",
      dateReleased: "Feb 2024",
      similarity: 68,
      status: "successful" as const,
      overview:
        "Market leader with excellent customer satisfaction and retention.",
    },
    {
      id: "5",
      name: "Startup Loan Initiative",
      company: "Startup Finance",
      description: "New entrant with aggressive pricing strategy",
      dateReleased: "Apr 2024",
      similarity: 81,
      status: "failed" as const,
      overview:
        "Struggled with regulatory compliance and operational challenges.",
    },
    {
      id: "6",
      name: "Established Savings Plus",
      company: "Established Bank",
      description: "Traditional savings account with modern features",
      dateReleased: "Nov 2023",
      similarity: 73,
      status: "successful" as const,
      overview:
        "Steady performer with loyal customer base and consistent growth.",
    },
  ];

  const filteredProducts = similarProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      p.company.toLowerCase().includes(searchValue.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "similarity":
        return b.similarity - a.similarity;
      case "date":
        return (
          new Date(b.dateReleased).getTime() -
          new Date(a.dateReleased).getTime()
        );
      case "success":
        return a.status === "successful" ? -1 : 1;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-primary-text">
            Similar Products Analysis
          </h3>
          <div className="flex items-center gap-3">
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
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="similarity">Sort by Similarity</option>
              <option value="date">Sort by Date</option>
              <option value="success">Sort by Success</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.map((similarProduct) => (
          <div
            key={similarProduct.id}
            className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-primary-text">
                  {similarProduct.name}
                </h4>
                <p className="text-sm text-muted-text flex items-center">
                  <Building className="w-3 h-3 mr-1" />
                  {similarProduct.company}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  {similarProduct.similarity}%
                </div>
                <div className="text-xs text-muted-text">Similarity</div>
              </div>
            </div>
            <p className="text-sm text-secondary-text mb-3">
              {similarProduct.description}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-text mb-3">
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                Released: {similarProduct.dateReleased}
              </span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                  similarProduct.status === "successful"
                    ? "bg-success-light text-success-text"
                    : "bg-error-light text-error-text"
                }`}
              >
                {similarProduct.status === "successful" ? (
                  <CheckCircle className="w-3 h-3 mr-1" />
                ) : (
                  <AlertCircle className="w-3 h-3 mr-1" />
                )}
                {similarProduct.status === "successful"
                  ? "Successful"
                  : "Failed"}
              </span>
            </div>
            <p className="text-xs text-secondary-text mb-3">
              {similarProduct.overview}
            </p>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  similarProduct.similarity >= 80
                    ? "bg-success"
                    : similarProduct.similarity >= 60
                    ? "bg-warning"
                    : "bg-error"
                }`}
                style={{ width: `${similarProduct.similarity}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Insights */}
      <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-primary-text mb-4">
          Adjust vs. Imitate Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-error-text mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Adjust (Avoid Pitfalls)
            </h4>
            <ul className="space-y-2 text-sm text-secondary-text">
              <li className="flex items-start">
                <AlertCircle className="w-4 h-4 text-error mr-2 mt-0.5 flex-shrink-0" />
                <span>High annual fees deter price-sensitive customers</span>
              </li>
              <li className="flex items-start">
                <AlertCircle className="w-4 h-4 text-error mr-2 mt-0.5 flex-shrink-0" />
                <span>Complex application process increases abandonment</span>
              </li>
              <li className="flex items-start">
                <AlertCircle className="w-4 h-4 text-error mr-2 mt-0.5 flex-shrink-0" />
                <span>Limited mobile features reduce adoption</span>
              </li>
              <li className="flex items-start">
                <AlertCircle className="w-4 h-4 text-error mr-2 mt-0.5 flex-shrink-0" />
                <span>Poor customer support leads to high churn</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-success-text mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Imitate (Best Practices)
            </h4>
            <ul className="space-y-2 text-sm text-secondary-text">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                <span>Simple, transparent fee structure</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                <span>Streamlined digital onboarding</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                <span>Strong mobile-first approach</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                <span>Excellent customer support and education</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Success vs Failure Analysis */}
      <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-primary-text mb-4">
          Success vs Failure Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-success-light rounded-lg">
            <h4 className="font-medium text-success-text mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Successful Products (3)
            </h4>
            <div className="space-y-2 text-sm text-success-text">
              <p>• Average similarity score: 84%</p>
              <p>
                • Common factors: Strong mobile experience, transparent pricing
              </p>
              <p>• Average time to market: 2.3 months</p>
            </div>
          </div>
          <div className="p-4 bg-error-light rounded-lg">
            <h4 className="font-medium text-error-text mb-3 flex items-center">
              <TrendingDown className="w-4 h-4 mr-2" />
              Failed Products (2)
            </h4>
            <div className="space-y-2 text-sm text-error-text">
              <p>• Average similarity score: 78%</p>
              <p>• Common factors: Complex processes, poor compliance</p>
              <p>• Average time to market: 3.1 months</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
