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

  // Mock persona data
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
      goals: ["Build credit", "Save money", "Digital banking"],
      painPoints: ["Limited income", "No credit history", "High fees"],
      adoptionBarriers: ["High Price", "Trust Issues", "Complex Process"],
      adoptionEnablers: ["Peer Recommendations", "Ease of Use", "Mobile App"],
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
    },
  ];

  const customerJourney = [
    {
      stage: "Awareness",
      icon: Eye,
      description: "Digital ads, social media, referrals",
      touchpoints: ["Social Media", "Online Ads", "Word of Mouth"],
      metrics: ["Impressions", "Click-through Rate", "Brand Recognition"],
    },
    {
      stage: "Consideration",
      icon: Target,
      description: "Product comparison, reviews, demos",
      touchpoints: ["Website", "Reviews", "Comparison Tools"],
      metrics: ["Time on Site", "Comparison Views", "Review Engagement"],
    },
    {
      stage: "Purchase",
      icon: CheckCircle,
      description: "Online application, verification",
      touchpoints: ["Application Form", "Verification", "Approval"],
      metrics: ["Application Completion", "Approval Rate", "Time to Approval"],
    },
    {
      stage: "Retention",
      icon: Star,
      description: "Ongoing support, rewards, upgrades",
      touchpoints: ["Customer Support", "Rewards Program", "Upgrades"],
      metrics: ["Retention Rate", "Usage Frequency", "Satisfaction Score"],
    },
  ];

  const getFitScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 80) return "text-warning";
    return "text-error";
  };

  const getFitScoreBg = (score: number) => {
    if (score >= 90) return "bg-success-light";
    if (score >= 80) return "bg-warning-light";
    return "bg-error-light";
  };

  return (
    <div className="space-y-6">
      {/* Persona Overview Section */}
      <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary-text">
            Top 3 Target Personas
          </h3>
          <div className="flex gap-2">
            <button className="p-2 text-muted-text hover:text-primary transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 text-muted-text hover:text-primary transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {personas.map((persona) => (
            <div
              key={persona.id}
              className={`border border-neutral-200 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedPersona === persona.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() =>
                setSelectedPersona(
                  selectedPersona === persona.id ? null : persona.id
                )
              }
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-primary-text">
                  {persona.name}
                </h4>
                <div className="text-right">
                  <div
                    className={`text-lg font-bold ${getFitScoreColor(
                      persona.fitScore
                    )}`}
                  >
                    {persona.fitScore}%
                  </div>
                  <div className="text-xs text-muted-text">Fit Score</div>
                </div>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full ${getFitScoreColor(
                    persona.fitScore
                  ).replace("text-", "bg-")}`}
                  style={{ width: `${persona.fitScore}%` }}
                />
              </div>
              <p className="text-sm text-secondary-text mb-3">
                {persona.description}
              </p>
              <div className="space-y-2 text-xs text-muted-text">
                <div className="flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  <span>{persona.demographics}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-3 h-3 mr-1" />
                  <span>{persona.income}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span>{persona.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Journey Mapping */}
      <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-primary-text mb-4">
          Customer Journey Mapping
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {customerJourney.map((stage, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mx-auto mb-3">
                <stage.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium text-primary-text mb-2">
                {stage.stage}
              </h4>
              <p className="text-sm text-secondary-text mb-3">
                {stage.description}
              </p>
              <div className="space-y-1">
                <p className="text-xs font-medium text-primary-text">
                  Touchpoints:
                </p>
                {stage.touchpoints.map((touchpoint, i) => (
                  <p key={i} className="text-xs text-muted-text">
                    {touchpoint}
                  </p>
                ))}
              </div>
              <div className="mt-3 space-y-1">
                <p className="text-xs font-medium text-primary-text">
                  Metrics:
                </p>
                {stage.metrics.map((metric, i) => (
                  <p key={i} className="text-xs text-muted-text">
                    {metric}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STP Persona Model Breakdown */}
      <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-6">
        <button
          onClick={() => onToggleSection("stp")}
          className="flex items-center justify-between w-full mb-4"
        >
          <h3 className="text-lg font-semibold text-primary-text">
            STP Persona Model Breakdown
          </h3>
          {isExpanded("stp") ? (
            <ChevronUp className="w-5 h-5 text-muted-text" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-text" />
          )}
        </button>

        {isExpanded("stp") && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-medium text-primary-text mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Segmentation
              </h4>
              <div className="space-y-2 text-sm text-secondary-text">
                <p>
                  <strong>Demographics:</strong> Age, income, education,
                  location
                </p>
                <p>
                  <strong>Psychographics:</strong> Lifestyle, values, interests
                </p>
                <p>
                  <strong>Behavioral:</strong> Usage patterns, brand loyalty
                </p>
                <p>
                  <strong>Geographic:</strong> Urban vs rural, regional
                  preferences
                </p>
              </div>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-medium text-primary-text mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Targeting
              </h4>
              <div className="space-y-2 text-sm text-secondary-text">
                <p>
                  <strong>Primary:</strong> Young professionals (25-35)
                </p>
                <p>
                  <strong>Secondary:</strong> Students and small business owners
                </p>
                <p>
                  <strong>Criteria:</strong> Digital adoption, income level
                </p>
                <p>
                  <strong>Approach:</strong> Differentiated targeting strategy
                </p>
              </div>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-medium text-primary-text mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Positioning
              </h4>
              <div className="space-y-2 text-sm text-secondary-text">
                <p>
                  <strong>Value Prop:</strong> "Smart financial solutions for
                  modern life"
                </p>
                <p>
                  <strong>Differentiation:</strong> Technology-first approach
                </p>
                <p>
                  <strong>Benefits:</strong> Convenience, transparency, rewards
                </p>
                <p>
                  <strong>Personality:</strong> Innovative, trustworthy,
                  accessible
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Adoption Factors Panel */}
      <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-primary-text mb-4">
          Adoption Factors Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-error-text mb-3 flex items-center">
              <XCircle className="w-4 h-4 mr-2" />
              Adoption Barriers
            </h4>
            <div className="space-y-3">
              {[
                "High Price",
                "Trust Issues",
                "Complex Process",
                "Limited Features",
                "Poor Support",
              ].map((barrier, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 bg-neutral-50 rounded-lg"
                >
                  <AlertCircle className="w-4 h-4 text-error mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="text-sm text-secondary-text font-medium">
                      {barrier}
                    </span>
                    <div className="w-full bg-neutral-200 rounded-full h-1 mt-1">
                      <div
                        className="bg-error h-1 rounded-full"
                        style={{ width: `${Math.random() * 40 + 60}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-success-text mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Adoption Enablers
            </h4>
            <div className="space-y-3">
              {[
                "Peer Recommendations",
                "Ease of Use",
                "Competitive Pricing",
                "Mobile App",
                "Excellent Support",
              ].map((enabler, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 bg-neutral-50 rounded-lg"
                >
                  <CheckCircle className="w-4 h-4 text-success mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="text-sm text-secondary-text font-medium">
                      {enabler}
                    </span>
                    <div className="w-full bg-neutral-200 rounded-full h-1 mt-1">
                      <div
                        className="bg-success h-1 rounded-full"
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

      {/* Persona Goals & Pain Points */}
      {selectedPersona && (
        <div className="bg-bg-primary rounded-xl border border-neutral-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-primary-text mb-4">
            {personas.find((p) => p.id === selectedPersona)?.name} - Deep Dive
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-success-text mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Goals & Motivations
              </h4>
              <div className="space-y-2">
                {personas
                  .find((p) => p.id === selectedPersona)
                  ?.goals.map((goal, index) => (
                    <div
                      key={index}
                      className="flex items-center p-2 bg-success-light rounded"
                    >
                      <CheckCircle className="w-4 h-4 text-success mr-2" />
                      <span className="text-sm text-success-text">{goal}</span>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-error-text mb-3 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Pain Points & Challenges
              </h4>
              <div className="space-y-2">
                {personas
                  .find((p) => p.id === selectedPersona)
                  ?.painPoints.map((pain, index) => (
                    <div
                      key={index}
                      className="flex items-center p-2 bg-error-light rounded"
                    >
                      <XCircle className="w-4 h-4 text-error mr-2" />
                      <span className="text-sm text-error-text">{pain}</span>
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
