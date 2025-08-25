import { Product } from "@/types/product";

export const mockProducts: Product[] = [
  // Credit Cards
  {
    id: "cc_student_rewards_001",
    name: "Student Cashback Credit Card",
    type: "CreditCard",
    description:
      "Perfect starter credit card for students with 2% cashback on dining and entertainment, 1% on everything else. No annual fee and credit building tools included.",
    targetPersonas: ["college-students", "young-adults", "first-time-users"],
    complianceStatus: "Compliant",
    createdAt: "2023-12-01T08:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    attributes: {
      creditLimitRange: { min: 500, max: 3000 },
      annualFee: 0,
      interestRateAPR: 19.99,
      rewardsType: "Cashback",
      targetSegment: ["Students"],
      distributionChannel: ["Online", "Branch", "MobileApp"],
    },
  },
  {
    id: "cc_premium_travel_002",
    name: "Platinum Travel Rewards Card",
    type: "CreditCard",
    description:
      "Premium travel credit card with 3x points on travel, airport lounge access, travel insurance, and elite status benefits. For frequent travelers and high spenders.",
    targetPersonas: ["frequent-travelers", "business-executives", "affluent"],
    complianceStatus: "Compliant",
    createdAt: "2023-11-20T09:00:00Z",
    updatedAt: "2024-01-22T14:20:00Z",
    attributes: {
      creditLimitRange: { min: 15000, max: 100000 },
      annualFee: 450,
      interestRateAPR: 16.99,
      rewardsType: "Points",
      targetSegment: ["Affluent"],
      distributionChannel: ["Branch", "Online"],
    },
  },
  {
    id: "cc_family_cashback_003",
    name: "Family Rewards Credit Card",
    type: "CreditCard",
    description:
      "Family-friendly credit card with rotating 5% cashback categories, 2% on groceries and gas, and 1% on other purchases. Includes family expense tracking tools.",
    targetPersonas: ["families", "parents", "household-managers"],
    complianceStatus: "PendingReview",
    createdAt: "2023-10-15T11:30:00Z",
    updatedAt: "2024-01-18T09:15:00Z",
    attributes: {
      creditLimitRange: { min: 5000, max: 25000 },
      annualFee: 95,
      interestRateAPR: 17.99,
      rewardsType: "Cashback",
      targetSegment: ["Families"],
      distributionChannel: ["Online", "Branch", "MobileApp"],
    },
  },

  // Personal Loans
  {
    id: "pl_education_001",
    name: "Education Excellence Loan",
    type: "PersonalLoan",
    description:
      "Competitive personal loans for education expenses including tuition, books, and living costs. Flexible repayment options and grace period for recent graduates.",
    targetPersonas: ["students", "parents", "adult-learners"],
    complianceStatus: "Compliant",
    createdAt: "2023-09-10T14:00:00Z",
    updatedAt: "2024-01-12T16:45:00Z",
    attributes: {
      loanAmountRange: { min: 5000, max: 75000 },
      interestRateAPR: 8.99,
      tenureRangeMonths: { min: 24, max: 84 },
      collateralRequired: false,
      purpose: ["Education"],
      distributionChannel: ["Branch", "Agent", "MobileApp"],
    },
  },
  {
    id: "pl_home_improvement_002",
    name: "Home Renovation Loan",
    type: "PersonalLoan",
    description:
      "Secured loans for home improvement projects with competitive rates. Quick approval process and funds disbursed directly to contractors when needed.",
    targetPersonas: ["homeowners", "property-investors", "families"],
    complianceStatus: "Compliant",
    createdAt: "2023-08-05T10:15:00Z",
    updatedAt: "2024-01-22T11:30:00Z",
    attributes: {
      loanAmountRange: { min: 10000, max: 200000 },
      interestRateAPR: 7.99,
      tenureRangeMonths: { min: 24, max: 120 },
      collateralRequired: true,
      purpose: ["HomeImprovement"],
      distributionChannel: ["Branch", "Agent"],
    },
  },
  {
    id: "pl_debt_consolidation_003",
    name: "Smart Debt Consolidation Loan",
    type: "PersonalLoan",
    description:
      "Consolidate high-interest debt into one manageable payment. Fixed rates, no prepayment penalties, and free credit counseling included.",
    targetPersonas: [
      "debt-consolidators",
      "credit-improvers",
      "young-professionals",
    ],
    complianceStatus: "ViolationsFound",
    createdAt: "2023-07-12T12:00:00Z",
    updatedAt: "2024-01-10T08:30:00Z",
    attributes: {
      loanAmountRange: { min: 7500, max: 50000 },
      interestRateAPR: 12.99,
      tenureRangeMonths: { min: 36, max: 72 },
      collateralRequired: false,
      purpose: ["DebtConsolidation"],
      distributionChannel: ["Branch", "MobileApp"],
    },
  },

  // Microfinance Loans
  {
    id: "mf_women_entrepreneurs_001",
    name: "Women's Business Empowerment Loan",
    type: "MicrofinanceLoan",
    description:
      "Microfinance program specifically for women entrepreneurs with group lending support, business training, and mentorship. Builds community while growing businesses.",
    targetPersonas: [
      "women-entrepreneurs",
      "rural-businesses",
      "micro-enterprises",
    ],
    complianceStatus: "Compliant",
    createdAt: "2023-06-20T15:45:00Z",
    updatedAt: "2024-01-25T13:20:00Z",
    attributes: {
      loanAmountRange: { min: 1000, max: 25000 },
      groupLending: true,
      collateralRequired: false,
      repaymentSchedule: "Monthly",
      distributionChannel: ["Agent", "NGO"],
      targetDemographics: ["Women", "Rural"],
      financialLiteracySupport: true,
    },
  },
  {
    id: "mf_agricultural_002",
    name: "Seasonal Agriculture Credit",
    type: "MicrofinanceLoan",
    description:
      "Flexible microfinance for farmers with seasonal repayment aligned to harvest cycles. Includes crop insurance and agricultural training support.",
    targetPersonas: ["farmers", "agricultural-workers", "rural-communities"],
    complianceStatus: "Compliant",
    createdAt: "2023-05-15T10:30:00Z",
    updatedAt: "2024-01-19T15:10:00Z",
    attributes: {
      loanAmountRange: { min: 500, max: 15000 },
      groupLending: false,
      collateralRequired: false,
      repaymentSchedule: "Flexible",
      distributionChannel: ["Agent", "Coop"],
      targetDemographics: ["Farmers", "Rural"],
      financialLiteracySupport: true,
    },
  },
  {
    id: "mf_urban_micro_003",
    name: "Urban Microenterprise Loan",
    type: "MicrofinanceLoan",
    description:
      "Quick access loans for urban informal workers and small business owners. Mobile app-based with digital payments and rapid approval process.",
    targetPersonas: [
      "informal-workers",
      "urban-entrepreneurs",
      "small-businesses",
    ],
    complianceStatus: "PendingReview",
    createdAt: "2023-04-10T09:00:00Z",
    updatedAt: "2024-01-14T12:30:00Z",
    attributes: {
      loanAmountRange: { min: 2000, max: 35000 },
      groupLending: true,
      collateralRequired: false,
      repaymentSchedule: "Weekly",
      distributionChannel: ["MobileApp", "Agent"],
      targetDemographics: ["UrbanPoor", "InformalWorkers"],
      financialLiteracySupport: false,
    },
  },

  // Savings Accounts
  {
    id: "sa_youth_starter_001",
    name: "Youth Starter Savings",
    type: "SavingsAccount",
    description:
      "High-yield savings account for young professionals and students. No minimum balance, competitive interest rates, and financial education resources included.",
    targetPersonas: ["young-professionals", "students", "first-time-savers"],
    complianceStatus: "Compliant",
    createdAt: "2023-03-25T14:15:00Z",
    updatedAt: "2024-01-23T10:45:00Z",
    attributes: {
      minimumBalance: 0,
      interestRate: 4.25,
    },
  },
  {
    id: "sa_premium_wealth_002",
    name: "Premium Wealth Savings",
    type: "SavingsAccount",
    description:
      "Exclusive savings account for high-net-worth individuals with tiered interest rates, personal banking services, and investment advisory access.",
    targetPersonas: ["high-net-worth", "affluent-customers", "business-owners"],
    complianceStatus: "Compliant",
    createdAt: "2023-02-18T11:20:00Z",
    updatedAt: "2024-01-20T16:30:00Z",
    attributes: {
      minimumBalance: 50000,
      interestRate: 5.75,
    },
  },
  {
    id: "sa_family_goal_003",
    name: "Family Goal Savings",
    type: "SavingsAccount",
    description:
      "Goal-oriented savings account for families with multiple savings buckets, automatic transfers, and financial planning tools for major life events.",
    targetPersonas: ["families", "parents", "goal-savers"],
    complianceStatus: "PendingReview",
    createdAt: "2023-01-12T08:45:00Z",
    updatedAt: "2024-01-17T13:15:00Z",
    attributes: {
      minimumBalance: 1000,
      interestRate: 3.85,
    },
  },
];
