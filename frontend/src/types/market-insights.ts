import { Product } from "./product";

// Market Analysis Keywords
export type Keyword = {
  word: string;
  relevanceScore: number; // 0-1 score indicating how relevant this keyword is
  frequency: number; // How often this keyword appears
  sentiment: "positive" | "negative" | "neutral";
};

// Similar Products
export type SimilarProduct = {
  id: string;
  name: string;
  provider: string;
  matchScore: number; // 0-1 score indicating similarity
  keyDifferentiators: string[];
  competitiveAdvantages: string[];
};

// Virtual Persona
export type PersonaDemographics = {
  ageRange: string;
  income: string;
  occupation: string;
  location: string;
  familyStatus: string;
};

export type PersonaBehavior = {
  financialGoals: string[];
  riskTolerance: "low" | "medium" | "high";
  digitalProficiency: "basic" | "intermediate" | "advanced";
  bankingPreferences: string[];
  paymentHabits: string[];
};

export type VirtualPersona = {
  id: string;
  name: string;
  description: string;
  demographics: PersonaDemographics;
  behavior: PersonaBehavior;
  productFitScore: number; // 0-1 score indicating how well the product fits this persona
  painPoints: string[];
  needs: string[];
};

// SWOT Analysis
export type SWOTAnalysis = {
  strengths: {
    points: string[];
    impact: "high" | "medium" | "low";
  };
  weaknesses: {
    points: string[];
    impact: "high" | "medium" | "low";
  };
  opportunities: {
    points: string[];
    potentialValue: "high" | "medium" | "low";
    timeframe: "short-term" | "medium-term" | "long-term";
  };
  threats: {
    points: string[];
    severity: "high" | "medium" | "low";
    probability: "high" | "medium" | "low";
  };
};

// Market Opportunity Insights
export type MarketSize = {
  totalAddressableMarket: number; // in currency
  servicableAddressableMarket: number;
  servicableObtainableMarket: number;
  yearOverYearGrowth: number;
};

export type CompetitiveLandscape = {
  totalCompetitors: number;
  directCompetitors: number;
  indirectCompetitors: number;
  marketConcentration: "high" | "medium" | "low";
  barriers: string[];
};

// Combined Market Insights Type
export type MarketInsights = {
  keywords: Keyword[];
  similarProducts: SimilarProduct[];
  virtualPersonas: VirtualPersona[];
  swotAnalysis: SWOTAnalysis;
  marketOpportunity: {
    marketSize: MarketSize;
    competitiveLandscape: CompetitiveLandscape;
  };
  lastUpdated: string; // ISO date string
  confidence: number; // 0-1 score indicating overall confidence in the analysis
};

// Extension for Product Type
export type ProductWithMarketInsights = {
  product: Product;
  marketInsights: MarketInsights;
};
