// Legacy status for backward compatibility with existing UI
export type ProductStatus = "in-dev" | "qa" | "prod" | "archived";

// New product types based on financial products
export type ProductType = "CreditCard" | "PersonalLoan" | "MicrofinanceLoan";
// Compliance status
export type ComplianceStatus =
  | "PendingReview"
  | "Compliant"
  | "ViolationsFound";

// Common enums
export type RewardsType = "Cashback" | "Points" | "Miles" | "Other";
export type TargetSegment =
  | "Students"
  | "YoungProfessionals"
  | "Families"
  | "Affluent"
  | "MassMarket";
export type DistributionChannel = "Branch" | "Agent" | "MobileApp" | "Online";
export type LoanPurpose =
  | "Education"
  | "Emergency"
  | "DebtConsolidation"
  | "HomeImprovement"
  | "Other";
export type RepaymentSchedule = "Weekly" | "BiWeekly" | "Monthly" | "Flexible";
export type TargetDemographics =
  | "Rural"
  | "UrbanPoor"
  | "Women"
  | "InformalWorkers"
  | "Farmers";

// Range types
export type AmountRange = {
  min: number;
  max: number;
};

export type TenureRange = {
  min: number;
  max: number;
};

// Product-specific attributes
export type CreditCardAttributes = {
  creditLimitRange: AmountRange;
  annualFee: number;
  interestRateAPR: number;
  rewardsType: RewardsType;
  targetSegment: TargetSegment[];
  distributionChannel: DistributionChannel[];
};

export type PersonalLoanAttributes = {
  loanAmountRange: AmountRange;
  interestRateAPR: number;
  tenureRangeMonths: TenureRange;
  collateralRequired: boolean;
  purpose: LoanPurpose[];
  distributionChannel: Exclude<DistributionChannel, "Online">[];
};

export type MicrofinanceLoanAttributes = {
  loanAmountRange: AmountRange;
  groupLending: boolean;
  collateralRequired: boolean;
  repaymentSchedule: RepaymentSchedule;
  distributionChannel: ("Agent" | "MobileApp" | "NGO" | "Coop")[];
  targetDemographics: TargetDemographics[];
  financialLiteracySupport: boolean;
};

export type SavingsAccountAttributes = {
  // Add attributes specific to savings accounts as needed
  minimumBalance?: number;
  interestRate?: number;
};

// Base product interface
export interface BaseProduct {
  id: string;
  name: string;
  type: ProductType;
  description: string;
  targetPersonas: string[];
  complianceStatus: ComplianceStatus;
  createdAt: string;
  updatedAt?: string;
}

// Discriminated union for different product types
export type Product = BaseProduct &
  (
    | { type: "CreditCard"; attributes: CreditCardAttributes }
    | { type: "PersonalLoan"; attributes: PersonalLoanAttributes }
    | { type: "MicrofinanceLoan"; attributes: MicrofinanceLoanAttributes }
    | { type: "SavingsAccount"; attributes: SavingsAccountAttributes }
  );

// Legacy product type for backward compatibility with existing components
export type LegacyProduct = {
  _id: string;
  name: string;
  category: string;
  tags: string[];
  status: ProductStatus;
  description: string;
  createdAt: string;
  updatedAt?: string;
};

// Filter state - updated to work with new types
export type FilterState = {
  search: string;
  complianceStatus: ComplianceStatus | "all";
  selectedTags: string[];
  type?: ProductType | "all";
};

// Helper type to convert between legacy and new product formats
export type ProductAdapter = {
  toLegacy: (product: Product) => LegacyProduct;
  fromLegacy: (legacyProduct: LegacyProduct) => Partial<Product>;
};
