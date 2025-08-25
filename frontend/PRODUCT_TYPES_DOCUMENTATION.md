# Product Type System Documentation

## Overview

This document describes the updated TypeScript type system for financial products in the SiLab application. The new system supports different types of financial products with their specific attributes while maintaining backward compatibility with existing UI components.

## Type Structure

### Base Product Types

#### `ProductType`

Defines the types of financial products:

- `CreditCard` - Credit card products
- `PersonalLoan` - Personal loan products
- `MicrofinanceLoan` - Microfinance loan products
- `SavingsAccount` - Savings account products

#### `ComplianceStatus`

Tracks the compliance status of products:

- `PendingReview` - Product is under compliance review
- `Compliant` - Product meets all compliance requirements
- `ViolationsFound` - Product has compliance violations

### Product-Specific Attributes

#### Credit Card Attributes (`CreditCardAttributes`)

```typescript
{
  creditLimitRange: { min: number, max: number };
  annualFee: number;
  interestRateAPR: number;
  rewardsType: "Cashback" | "Points" | "Miles" | "Other";
  targetSegment: ("Students" | "YoungProfessionals" | "Families" | "Affluent" | "MassMarket")[];
  distributionChannel: ("Branch" | "Agent" | "MobileApp" | "Online")[];
}
```

#### Personal Loan Attributes (`PersonalLoanAttributes`)

```typescript
{
  loanAmountRange: { min: number, max: number };
  interestRateAPR: number;
  tenureRangeMonths: { min: number, max: number };
  collateralRequired: boolean;
  purpose: ("Education" | "Emergency" | "DebtConsolidation" | "HomeImprovement" | "Other")[];
  distributionChannel: ("Branch" | "Agent" | "MobileApp")[];
}
```

#### Microfinance Loan Attributes (`MicrofinanceLoanAttributes`)

```typescript
{
  loanAmountRange: { min: number, max: number };
  groupLending: boolean;
  collateralRequired: boolean;
  repaymentSchedule: "Weekly" | "BiWeekly" | "Monthly" | "Flexible";
  distributionChannel: ("Agent" | "Coop" | "MobileApp" | "NGO")[];
  targetDemographics: ("Rural" | "UrbanPoor" | "Women" | "InformalWorkers" | "Farmers")[];
  financialLiteracySupport: boolean;
}
```

#### Savings Account Attributes (`SavingsAccountAttributes`)

```typescript
{
  minimumBalance?: number;
  interestRate?: number;
}
```

### Main Product Type

The main `Product` type is a discriminated union that combines the base product with type-specific attributes:

```typescript
type Product = BaseProduct &
  (
    | { type: "CreditCard"; attributes: CreditCardAttributes }
    | { type: "PersonalLoan"; attributes: PersonalLoanAttributes }
    | { type: "MicrofinanceLoan"; attributes: MicrofinanceLoanAttributes }
    | { type: "SavingsAccount"; attributes: SavingsAccountAttributes }
  );
```

## Backward Compatibility

### Legacy Product Type

To maintain compatibility with existing UI components, we have a `LegacyProduct` type:

```typescript
type LegacyProduct = {
  _id: string;
  name: string;
  category: string;
  tags: string[];
  status: ProductStatus;
  description: string;
  createdAt: string;
  updatedAt?: string;
};
```

### Product Adapter

The `productAdapter` utility provides conversion functions between new and legacy formats:

```typescript
// Convert new product to legacy format for UI compatibility
const legacyProduct = productAdapter.toLegacy(newProduct);

// Convert legacy product to new format (partial)
const newProduct = productAdapter.fromLegacy(legacyProduct);
```

## File Structure

```
src/
├── types/
│   └── product.ts                 # All type definitions
├── lib/
│   ├── product-adapter.ts         # Conversion utilities
│   ├── sample-products.ts         # New product examples
│   ├── mock-data.ts              # Legacy format data
│   └── utils.ts                  # Utility functions
└── components/
    └── ui/
        ├── product-card.tsx       # Uses LegacyProduct
        └── product-list-item.tsx  # Uses LegacyProduct
```

## Usage Examples

### Creating a New Credit Card Product

```typescript
import { Product } from "@/types/product";

const creditCard: Product = {
  id: "cc_001",
  name: "Student Cashback Card",
  type: "CreditCard",
  description: "Perfect for students starting their credit journey",
  targetPersonas: ["students", "young-adults"],
  complianceStatus: "Compliant",
  createdAt: "2024-01-01T00:00:00Z",
  attributes: {
    creditLimitRange: { min: 500, max: 3000 },
    annualFee: 0,
    interestRateAPR: 18.99,
    rewardsType: "Cashback",
    targetSegment: ["Students"],
    distributionChannel: ["Online", "MobileApp"],
  },
};
```

### Using Type Guards

```typescript
import { isLegacyProduct, isNewProduct } from "@/lib/utils";

function handleProduct(product: Product | LegacyProduct) {
  if (isLegacyProduct(product)) {
    // Handle legacy product
    console.log(product._id);
  } else if (isNewProduct(product)) {
    // Handle new product
    console.log(product.id, product.type);
  }
}
```

### Filtering Products by Type

```typescript
import { getProductsByType } from "@/lib/sample-products";

const creditCards = getProductsByType("CreditCard");
const loans = getProductsByType("PersonalLoan");
```

## Migration Strategy

1. **Phase 1**: New types are available alongside legacy types
2. **Phase 2**: New product creation uses the new type system
3. **Phase 3**: Existing components can be gradually updated to use new types
4. **Phase 4**: Legacy types can be deprecated once migration is complete

## Benefits

1. **Type Safety**: Discriminated unions ensure type-specific attributes are correctly typed
2. **Extensibility**: Easy to add new product types and attributes
3. **Compliance Tracking**: Built-in compliance status tracking
4. **Backward Compatibility**: Existing UI components continue to work
5. **Rich Product Data**: Structured attributes for each product type
6. **Business Logic**: Type-specific validation and business rules can be implemented

## Best Practices

1. Use the adapter functions when converting between formats
2. Leverage TypeScript's discriminated unions for type-safe operations
3. Use type guards to safely handle mixed product types
4. Keep legacy and new type imports separate for clarity
5. Document any new product attributes or types added
6. Use the sample data as reference for creating new products
