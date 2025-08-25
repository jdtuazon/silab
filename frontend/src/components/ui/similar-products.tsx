"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import {
  Search,
  CheckCircle,
  AlertCircle,
  Download,
  Share2,
  Building,
  Calendar,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Star,
  XCircle,
} from "lucide-react";

interface SimilarProductsProps {
  product: Product;
}

export function SimilarProducts({ product }: SimilarProductsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("similarity");

  console.log(product);

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
      features: [
        "2% cashback on all purchases",
        "No annual fee first year",
        "Travel insurance included",
      ],
      pricing: "$95 annual fee after first year",
      targetAudience: "Young professionals, frequent travelers",
      marketShare: "12% of credit card market",
      customerRating: 4.6,
      reviewCount: 1247,
      adjustInsights: [
        "High annual fee deterred price-sensitive customers",
        "Complex reward structure confused users",
        "Limited mobile app features reduced adoption",
      ],
      imitateInsights: [
        "Strong brand recognition and trust",
        "Excellent customer service and support",
        "Comprehensive travel benefits package",
      ],
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
      features: [
        "Same-day approval",
        "No collateral required",
        "Flexible repayment terms",
      ],
      pricing: "APR 8.99% - 24.99%",
      targetAudience: "Individuals with good credit, emergency funding needs",
      marketShare: "3% of personal loan market",
      customerRating: 3.2,
      reviewCount: 892,
      adjustInsights: [
        "Aggressive marketing led to poor customer expectations",
        "Insufficient credit assessment resulted in high defaults",
        "Lack of financial education resources",
      ],
      imitateInsights: [
        "Fast application process and approval",
        "Transparent fee structure",
        "Multiple repayment options",
      ],
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
      features: [
        "Group lending model",
        "Financial literacy training",
        "Community support",
      ],
      pricing: "Interest rates 15-25% annually",
      targetAudience: "Underserved communities, small entrepreneurs",
      marketShare: "8% of microfinance market",
      customerRating: 4.8,
      reviewCount: 2156,
      adjustInsights: [
        "Limited digital presence restricted growth",
        "Manual processes increased operational costs",
        "Geographic limitations reduced scalability",
      ],
      imitateInsights: [
        "Strong community engagement and trust",
        "Comprehensive financial education programs",
        "Flexible repayment schedules",
      ],
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
      features: [
        "AI-powered fraud detection",
        "Real-time spending insights",
        "Global acceptance",
      ],
      pricing: "$150 annual fee",
      targetAudience: "High-net-worth individuals, business travelers",
      marketShare: "18% of premium credit card market",
      customerRating: 4.7,
      reviewCount: 3421,
      adjustInsights: [
        "High annual fee limited mass market appeal",
        "Complex feature set overwhelmed some users",
        "Exclusive targeting alienated broader audience",
      ],
      imitateInsights: [
        "Cutting-edge technology and security",
        "Exceptional customer experience",
        "Strong brand positioning and marketing",
      ],
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
      features: [
        "Lowest rates in market",
        "Quick online application",
        "No hidden fees",
      ],
      pricing: "APR 5.99% - 18.99%",
      targetAudience: "Startups, small businesses, entrepreneurs",
      marketShare: "2% of business loan market",
      customerRating: 3.8,
      reviewCount: 567,
      adjustInsights: [
        "Insufficient regulatory compliance framework",
        "Underestimated operational complexity",
        "Poor risk management led to high losses",
      ],
      imitateInsights: [
        "Competitive pricing strategy",
        "Streamlined application process",
        "Transparent fee structure",
      ],
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
      features: [
        "High-yield savings rates",
        "FDIC insurance",
        "Mobile banking",
      ],
      pricing: "No monthly fees, 2.5% APY",
      targetAudience: "Conservative savers, families, retirees",
      marketShare: "15% of savings account market",
      customerRating: 4.4,
      reviewCount: 1893,
      adjustInsights: [
        "Limited digital features compared to fintech",
        "Branch-heavy model increased costs",
        "Conservative approach limited innovation",
      ],
      imitateInsights: [
        "Strong trust and brand recognition",
        "Comprehensive financial services",
        "Excellent customer service and support",
      ],
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

  const currentProduct = sortedProducts[currentIndex];

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev + 1) % sortedProducts.length);
  };

  const prevProduct = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + sortedProducts.length) % sortedProducts.length
    );
  };

  const goToProduct = (index: number) => {
    setCurrentIndex(index);
  };

  if (!currentProduct) {
    return (
      <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-8 text-center">
        <h3 className="text-lg font-semibold text-primary-text mb-2">
          No Similar Products Found
        </h3>
        <p className="text-secondary-text">
          Try adjusting your search criteria.
        </p>
      </div>
    );
  }

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

      {/* Carousel Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevProduct}
          className="p-2 text-muted-text hover:text-primary transition-colors disabled:opacity-50"
          disabled={sortedProducts.length <= 1}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2">
          {sortedProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToProduct(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-primary" : "bg-neutral-300"
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextProduct}
          className="p-2 text-muted-text hover:text-primary transition-colors disabled:opacity-50"
          disabled={sortedProducts.length <= 1}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Main Product Card */}
      <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-8">
        {/* Product Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-primary-text">
                {currentProduct.name}
              </h2>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  currentProduct.status === "successful"
                    ? "bg-success-light text-success-text"
                    : "bg-error-light text-error-text"
                }`}
              >
                {currentProduct.status === "successful" ? (
                  <CheckCircle className="w-4 h-4 mr-1" />
                ) : (
                  <AlertCircle className="w-4 h-4 mr-1" />
                )}
                {currentProduct.status === "successful"
                  ? "Successful"
                  : "Failed"}
              </span>
            </div>
            <p className="text-lg text-secondary-text mb-3">
              {currentProduct.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-text">
              <span className="flex items-center">
                <Building className="w-4 h-4 mr-1" />
                {currentProduct.company}
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Released: {currentProduct.dateReleased}
              </span>
              <span className="flex items-center">
                <Star className="w-4 h-4 mr-1" />
                {currentProduct.customerRating} ({currentProduct.reviewCount}{" "}
                reviews)
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary mb-1">
              {currentProduct.similarity}%
            </div>
            <div className="text-sm text-muted-text">Similarity Score</div>
            <div className="w-full bg-neutral-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full ${
                  currentProduct.similarity >= 80
                    ? "bg-success"
                    : currentProduct.similarity >= 60
                    ? "bg-warning"
                    : "bg-error"
                }`}
                style={{ width: `${currentProduct.similarity}%` }}
              />
            </div>
          </div>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Product Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-primary-text mb-3">
                Product Overview
              </h3>
              <p className="text-secondary-text mb-4">
                {currentProduct.overview}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <span className="text-sm text-secondary-text">
                    Target Audience
                  </span>
                  <span className="text-sm font-medium text-primary-text">
                    {currentProduct.targetAudience}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <span className="text-sm text-secondary-text">
                    Market Share
                  </span>
                  <span className="text-sm font-medium text-primary-text">
                    {currentProduct.marketShare}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <span className="text-sm text-secondary-text">Pricing</span>
                  <span className="text-sm font-medium text-primary-text">
                    {currentProduct.pricing}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-primary-text mb-3">
                Key Features
              </h3>
              <ul className="space-y-2">
                {currentProduct.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-secondary-text">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Insights */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-primary-text mb-3 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-error" />
                Adjust (Avoid Pitfalls)
              </h3>
              <ul className="space-y-2">
                {currentProduct.adjustInsights.map((insight, index) => (
                  <li
                    key={index}
                    className="flex items-start p-3 bg-error-light rounded-lg"
                  >
                    <XCircle className="w-4 h-4 text-error mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-error-text">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-primary-text mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-success" />
                Imitate (Best Practices)
              </h3>
              <ul className="space-y-2">
                {currentProduct.imitateInsights.map((insight, index) => (
                  <li
                    key={index}
                    className="flex items-start p-3 bg-success-light rounded-lg"
                  >
                    <CheckCircle className="w-4 h-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-success-text">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
          <div className="text-sm text-muted-text">
            Product {currentIndex + 1} of {sortedProducts.length}
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-muted-text hover:text-primary transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 text-muted-text hover:text-primary transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
