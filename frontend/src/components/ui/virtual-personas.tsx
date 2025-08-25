"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import {
  Users,
  Target,
  Eye,
  CheckCircle,
  Star,
  Calendar,
  MapPin,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  XCircle,
  UserCheck,
  UserX,
  ArrowRight,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Heart,
  Shield,
  Zap,
  Lightbulb,
  GraduationCap,
  Briefcase,
  Building,
  Smartphone,
  CreditCard,
  PiggyBank,
  TrendingUp as TrendingUpIcon,
  Clock,
  Award,
  BookOpen,
  Globe,
  Home,
  Car,
  ShoppingCart,
  Coffee,
  Plane,
  Heart as HeartIcon,
  Users as UsersIcon,
  Target as TargetIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  Activity,
  PieChart,
  Layers,
  Compass,
  Sparkles,
} from "lucide-react";

interface VirtualPersonasProps {
  product: Product;
  expandedSections: Set<string>;
  onToggleSection: (sectionId: string) => void;
}

export function VirtualPersonas({
  product,
  expandedSections,
  onToggleSection,
}: VirtualPersonasProps) {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);

  const isExpanded = (sectionId: string) => expandedSections.has(sectionId);

  // Mock persona data with enhanced visual elements
  const personas = [
    {
      id: "student",
      name: "Urban Budget-Conscious Student",
      description:
        "Tech-savvy students seeking affordable financial solutions with digital-first features",
      fitScore: 92,
      fitLevel: "Excellent",
      demographics: "18-24 years, College students",
      income: "$15K-35K annually",
      location: "Urban areas, University towns",
      icon: GraduationCap,
      color: "blue",
      goals: ["Build credit", "Save money", "Digital banking"],
      painPoints: ["Limited income", "No credit history", "High fees"],
      adoptionBarriers: ["High Price", "Trust Issues", "Complex Process"],
      adoptionEnablers: ["Peer Recommendations", "Ease of Use", "Mobile App"],
      lifestyle: ["Coffee shops", "Public transport", "Student discounts"],
      interests: ["Technology", "Social media", "Budgeting apps"],
    },
    {
      id: "professional",
      name: "Young Professional",
      description:
        "Career-focused individuals looking for premium features and rewards programs",
      fitScore: 87,
      fitLevel: "Strong",
      demographics: "25-35 years, Early career professionals",
      income: "$45K-85K annually",
      location: "Metropolitan areas",
      icon: Briefcase,
      color: "green",
      goals: ["Earn rewards", "Build wealth", "Convenience"],
      painPoints: ["Time constraints", "High expectations", "Complex choices"],
      adoptionBarriers: [
        "High Expectations",
        "Time Constraints",
        "Feature Overload",
      ],
      adoptionEnablers: [
        "Rewards Programs",
        "Premium Features",
        "Excellent Support",
      ],
      lifestyle: ["Business travel", "Fine dining", "Fitness"],
      interests: ["Career growth", "Travel", "Investments"],
    },
    {
      id: "business",
      name: "Small Business Owner",
      description:
        "Entrepreneurs needing flexible financing options for business growth",
      fitScore: 78,
      fitLevel: "Good",
      demographics: "30-50 years, Business owners",
      income: "$60K-150K annually",
      location: "Mixed urban/rural",
      icon: Building,
      color: "purple",
      goals: ["Business growth", "Cash flow management", "Tax benefits"],
      painPoints: [
        "Unpredictable income",
        "Complex requirements",
        "Risk assessment",
      ],
      adoptionBarriers: [
        "Complex Requirements",
        "Risk Assessment",
        "Documentation",
      ],
      adoptionEnablers: ["Flexible Terms", "Business Support", "Tax Benefits"],
      lifestyle: ["Networking events", "Business meetings", "Family time"],
      interests: ["Business strategy", "Market trends", "Networking"],
    },
  ];

  const customerJourney = [
    {
      stage: "Awareness",
      icon: Eye,
      description: "Digital ads, social media, referrals",
      touchpoints: ["Social Media", "Online Ads", "Word of Mouth"],
      metrics: ["Impressions", "Click-through Rate", "Brand Recognition"],
      color: "blue",
      duration: "1-2 weeks",
    },
    {
      stage: "Consideration",
      icon: Target,
      description: "Product comparison, reviews, demos",
      touchpoints: ["Website", "Reviews", "Comparison Tools"],
      metrics: ["Time on Site", "Comparison Views", "Review Engagement"],
      color: "green",
      duration: "2-4 weeks",
    },
    {
      stage: "Purchase",
      icon: CheckCircle,
      description: "Online application, verification",
      touchpoints: ["Application Form", "Verification", "Approval"],
      metrics: ["Application Completion", "Approval Rate", "Time to Approval"],
      color: "orange",
      duration: "1-3 days",
    },
    {
      stage: "Retention",
      icon: Star,
      description: "Ongoing support, rewards, upgrades",
      touchpoints: ["Customer Support", "Rewards Program", "Upgrades"],
      metrics: ["Retention Rate", "Usage Frequency", "Satisfaction Score"],
      color: "purple",
      duration: "Ongoing",
    },
  ];

  const getFitScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 80) return "text-warning";
    return "text-error";
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "green":
        return "bg-green-100 text-green-600 border-green-200";
      case "purple":
        return "bg-purple-100 text-purple-600 border-purple-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getStageColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-500 text-white";
      case "green":
        return "bg-green-500 text-white";
      case "orange":
        return "bg-orange-500 text-white";
      case "purple":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="space-y-8">
      {/* Persona Overview Section - Enhanced */}
      <div className="bg-gradient-to-br from-primary-light/10 to-primary/5 rounded-xl border border-neutral-200 shadow-sm p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-primary-text flex items-center">
            <Users className="w-6 h-6 mr-3 text-primary" />
            Top 3 Target Personas
          </h3>
          <div className="flex gap-3">
            <button className="p-3 text-muted-text hover:text-primary hover:bg-white/50 rounded-lg transition-all duration-200">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-3 text-muted-text hover:text-primary hover:bg-white/50 rounded-lg transition-all duration-200">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {personas.map((persona) => {
            const Icon = persona.icon;
            return (
              <div
                key={persona.id}
                className={`bg-white rounded-xl border-2 transition-all duration-300 hover:shadow-xl cursor-pointer h-full flex flex-col ${
                  selectedPersona === persona.id
                    ? "border-primary shadow-lg ring-4 ring-primary/10"
                    : "border-neutral-200 hover:border-primary/50"
                }`}
                onClick={() =>
                  setSelectedPersona(
                    selectedPersona === persona.id ? null : persona.id
                  )
                }
              >
                {/* Persona Header with Icon */}
                <div className="p-6 border-b border-neutral-100 flex-shrink-0">
                  <div className="flex items-start mb-4">
                    <div
                      className={`p-3 rounded-lg ${getColorClasses(
                        persona.color
                      )} mr-4 shadow-sm flex-shrink-0`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-bold text-primary-text mb-2 leading-tight">
                        {persona.name}
                      </h4>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-semibold w-fit ${getColorClasses(
                            persona.color
                          )}`}
                        >
                          {persona.fitLevel}
                        </span>
                        <span className="text-xs text-muted-text">
                          {persona.demographics}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Fit Score */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center">
                      <div
                        className={`text-3xl font-bold ${getFitScoreColor(
                          persona.fitScore
                        )}`}
                      >
                        {persona.fitScore}%
                      </div>
                      <div className="text-xs text-muted-text font-medium">
                        Fit Score
                      </div>
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="w-full bg-neutral-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${getFitScoreColor(
                            persona.fitScore
                          ).replace("text-", "bg-")}`}
                          style={{ width: `${persona.fitScore}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-secondary-text leading-relaxed">
                    {persona.description}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div className="space-y-2">
                    <div className="flex items-center p-2 bg-neutral-50 rounded-lg">
                      <DollarSign className="w-4 h-4 text-success mr-2 flex-shrink-0" />
                      <span className="text-sm font-medium text-primary-text truncate">
                        {persona.income}
                      </span>
                    </div>
                    <div className="flex items-center p-2 bg-neutral-50 rounded-lg">
                      <MapPin className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      <span className="text-sm font-medium text-primary-text truncate">
                        {persona.location}
                      </span>
                    </div>
                  </div>

                  {/* Lifestyle & Interests */}
                  <div className="space-y-3 flex-1">
                    <div>
                      <h5 className="text-xs font-semibold text-primary-text mb-2 flex items-center">
                        <Coffee className="w-3 h-3 mr-1 text-warning" />
                        Lifestyle
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {persona.lifestyle.slice(0, 2).map((item, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-warning-light/30 text-warning-text rounded-full font-medium"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-primary-text mb-2 flex items-center">
                        <Heart className="w-3 h-3 mr-1 text-error" />
                        Interests
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {persona.interests.slice(0, 2).map((item, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-error-light/30 text-error-text rounded-full font-medium"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer Journey Timeline - Enhanced */}
      <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-8">
        <h3 className="text-xl font-bold text-primary-text mb-8 flex items-center">
          <Activity className="w-6 h-6 mr-3 text-primary" />
          Customer Journey Timeline
        </h3>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary to-primary-light"></div>

          <div className="space-y-12">
            {customerJourney.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <div key={index} className="relative flex items-start">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-10 w-6 h-6 rounded-full ${getStageColorClasses(
                      stage.color
                    )} transform -translate-x-3 z-10 shadow-lg flex items-center justify-center`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className="ml-20 flex-1">
                    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-primary-text flex items-center">
                          <span
                            className={`w-4 h-4 rounded-full ${getStageColorClasses(
                              stage.color
                            )} mr-3`}
                          ></span>
                          {stage.stage}
                        </h4>
                        <span className="text-sm text-muted-text bg-neutral-100 px-3 py-1 rounded-full font-medium">
                          {stage.duration}
                        </span>
                      </div>

                      <p className="text-secondary-text mb-6 leading-relaxed">
                        {stage.description}
                      </p>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-neutral-50 rounded-lg p-4">
                          <h5 className="text-sm font-semibold text-primary-text mb-3 flex items-center">
                            <Target className="w-4 h-4 mr-2 text-primary" />
                            Touchpoints
                          </h5>
                          <div className="space-y-2">
                            {stage.touchpoints.map((touchpoint, i) => (
                              <div
                                key={i}
                                className="flex items-center text-sm text-secondary-text"
                              >
                                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                                {touchpoint}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-neutral-50 rounded-lg p-4">
                          <h5 className="text-sm font-semibold text-primary-text mb-3 flex items-center">
                            <BarChart3 className="w-4 h-4 mr-2 text-primary" />
                            Key Metrics
                          </h5>
                          <div className="space-y-2">
                            {stage.metrics.map((metric, i) => (
                              <div
                                key={i}
                                className="flex items-center text-sm text-secondary-text"
                              >
                                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                                {metric}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* STP Persona Model Breakdown - Enhanced */}
      <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-8">
        <button
          onClick={() => onToggleSection("stp")}
          className="flex items-center justify-between w-full mb-6"
        >
          <h3 className="text-xl font-bold text-primary-text flex items-center">
            <PieChart className="w-6 h-6 mr-3 text-primary" />
            STP Persona Model Breakdown
          </h3>
          {isExpanded("stp") ? (
            <ChevronUp className="w-6 h-6 text-muted-text" />
          ) : (
            <ChevronDown className="w-6 h-6 text-muted-text" />
          )}
        </button>

        {isExpanded("stp") && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-500 rounded-lg mr-4">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-blue-700">
                  Segmentation
                </h4>
              </div>
              <div className="space-y-4 text-sm">
                <div className="bg-white/70 rounded-lg p-3">
                  <h5 className="font-semibold text-blue-700 mb-2">
                    Demographics
                  </h5>
                  <p className="text-blue-600">
                    Age, income, education, location
                  </p>
                </div>
                <div className="bg-white/70 rounded-lg p-3">
                  <h5 className="font-semibold text-blue-700 mb-2">
                    Psychographics
                  </h5>
                  <p className="text-blue-600">Lifestyle, values, interests</p>
                </div>
                <div className="bg-white/70 rounded-lg p-3">
                  <h5 className="font-semibold text-blue-700 mb-2">
                    Behavioral
                  </h5>
                  <p className="text-blue-600">Usage patterns, brand loyalty</p>
                </div>
                <div className="bg-white/70 rounded-lg p-3">
                  <h5 className="font-semibold text-blue-700 mb-2">
                    Geographic
                  </h5>
                  <p className="text-blue-600">
                    Urban vs rural, regional preferences
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-500 rounded-lg mr-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-green-700">Targeting</h4>
              </div>
              <div className="space-y-4 text-sm">
                <div className="bg-white/70 rounded-lg p-3">
                  <h5 className="font-semibold text-green-700 mb-2">Primary</h5>
                  <p className="text-green-600">Young professionals (25-35)</p>
                </div>
                <div className="bg-white/70 rounded-lg p-3">
                  <h5 className="font-semibold text-green-700 mb-2">
                    Secondary
                  </h5>
                  <p className="text-green-600">
                    Students and small business owners
                  </p>
                </div>
                <div className="bg-white/70 rounded-lg p-3">
                  <h5 className="font-semibold text-green-700 mb-2">
                    Criteria
                  </h5>
                  <p className="text-green-600">
                    Digital adoption, income level
                  </p>
                </div>
                <div className="bg-white/70 rounded-lg p-3">
                  <h5 className="font-semibold text-green-700 mb-2">
                    Approach
                  </h5>
                  <p className="text-green-600">
                    Differentiated targeting strategy
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-500 rounded-lg mr-4">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-purple-700">
                  Positioning
                </h4>
              </div>
              <div className="space-y-4 text-sm">
                <div className="bg-white/70 rounded-lg p-3">
                  <h5 className="font-semibold text-purple-700 mb-2">
                    Value Prop
                  </h5>
                  <p className="text-purple-600">
                    "Smart financial solutions for modern life"
                  </p>
                </div>
                <div className="bg-white/70 rounded-lg p-3">
                  <h5 className="font-semibold text-purple-700 mb-2">
                    Differentiation
                  </h5>
                  <p className="text-purple-600">Technology-first approach</p>
                </div>
                <div className="bg-white/70 rounded-lg p-3">
                  <h5 className="font-semibold text-purple-700 mb-2">
                    Benefits
                  </h5>
                  <p className="text-purple-600">
                    Convenience, transparency, rewards
                  </p>
                </div>
                <div className="bg-white/70 rounded-lg p-3">
                  <h5 className="font-semibold text-purple-700 mb-2">
                    Personality
                  </h5>
                  <p className="text-purple-600">
                    Innovative, trustworthy, accessible
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Adoption Factors Panel - Enhanced */}
      <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-8">
        <h3 className="text-xl font-bold text-primary-text mb-6 flex items-center">
          <Zap className="w-6 h-6 mr-3 text-primary" />
          Adoption Factors Analysis
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h4 className="font-semibold text-error-text mb-4 flex items-center text-lg">
              <XCircle className="w-5 h-5 mr-2" />
              Adoption Barriers
            </h4>
            <div className="space-y-4">
              {[
                "High Price",
                "Trust Issues",
                "Complex Process",
                "Limited Features",
                "Poor Support",
              ].map((barrier, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-error-light/20 rounded-lg border border-error/20"
                >
                  <AlertCircle className="w-5 h-5 text-error mr-4 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="text-sm text-error-text font-semibold">
                      {barrier}
                    </span>
                    <div className="w-full bg-neutral-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-error h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.random() * 40 + 60}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h4 className="font-semibold text-success-text mb-4 flex items-center text-lg">
              <CheckCircle className="w-5 h-5 mr-2" />
              Adoption Enablers
            </h4>
            <div className="space-y-4">
              {[
                "Peer Recommendations",
                "Ease of Use",
                "Competitive Pricing",
                "Mobile App",
                "Excellent Support",
              ].map((enabler, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-success-light/20 rounded-lg border border-success/20"
                >
                  <CheckCircle className="w-5 h-5 text-success mr-4 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="text-sm text-success-text font-semibold">
                      {enabler}
                    </span>
                    <div className="w-full bg-neutral-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-success h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.random() * 40 + 60}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Persona Goals & Pain Points - Enhanced */}
      {selectedPersona && (
        <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-8">
          <h3 className="text-xl font-bold text-primary-text mb-6 flex items-center">
            <Sparkles className="w-6 h-6 mr-3 text-primary" />
            {personas.find((p) => p.id === selectedPersona)?.name} - Deep Dive
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h4 className="font-semibold text-success-text mb-4 flex items-center text-lg">
                <Target className="w-5 h-5 mr-2" />
                Goals & Motivations
              </h4>
              <div className="space-y-3">
                {personas
                  .find((p) => p.id === selectedPersona)
                  ?.goals.map((goal, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-success-light/20 rounded-lg border border-success/20"
                    >
                      <CheckCircle className="w-5 h-5 text-success mr-3" />
                      <span className="text-sm text-success-text font-medium">
                        {goal}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h4 className="font-semibold text-error-text mb-4 flex items-center text-lg">
                <AlertCircle className="w-5 h-5 mr-2" />
                Pain Points & Challenges
              </h4>
              <div className="space-y-3">
                {personas
                  .find((p) => p.id === selectedPersona)
                  ?.painPoints.map((pain, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-error-light/20 rounded-lg border border-error/20"
                    >
                      <XCircle className="w-5 h-5 text-error mr-3" />
                      <span className="text-sm text-error-text font-medium">
                        {pain}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
