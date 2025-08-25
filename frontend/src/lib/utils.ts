import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}import { Product, ProductType, ComplianceStatus } from "@/types/product";

/**
 * Finds a product by its ID
 */
export function findProductById(
  products: Product[],
  productId: string
): Product | undefined {
  return products.find((product) => product.id === productId);
}

/**
 * Gets the product detail URL using product ID
 */
export function getProductUrl(product: Product): string {
  return `/products/${product.id}`;
}

/**
 * Helper function to get compliance status badge style
 */
export function getComplianceStatusStyle(status: ComplianceStatus) {
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
}

/**
 * Helper function to format product type for display
 */
export function formatProductType(type: ProductType): string {
  switch (type) {
    case "CreditCard":
      return "Credit Card";
    case "PersonalLoan":
      return "Personal Loan";
    case "MicrofinanceLoan":
      return "Microfinance Loan";
    case "SavingsAccount":
      return "Savings Account";
    default:
      return type;
  }
}

/**
 * Helper function to format compliance status for display
 */
export function formatComplianceStatus(status: ComplianceStatus): string {
  switch (status) {
    case "PendingReview":
      return "Pending Review";
    case "Compliant":
      return "Compliant";
    case "ViolationsFound":
      return "Violations Found";
    default:
      return status;
  }
}

/**
 * Helper function to generate tags from product data
 */
export function generateProductTags(product: Product): string[] {
  const tags: string[] = [
    product.type
      .toLowerCase()
      .replace(/([A-Z])/g, "-$1")
      .slice(1),
    ...product.targetPersonas.slice(0, 3),
    product.complianceStatus.toLowerCase(),
  ];

  // Add type-specific tags
  switch (product.type) {
    case "CreditCard":
      tags.push(
        product.attributes.rewardsType.toLowerCase(),
        ...product.attributes.targetSegment.map((s) => s.toLowerCase()),
        product.attributes.annualFee > 0 ? "annual-fee" : "no-annual-fee"
      );
      break;
    case "PersonalLoan":
      tags.push(
        ...product.attributes.purpose.map((p) => p.toLowerCase()),
        product.attributes.collateralRequired ? "secured" : "unsecured"
      );
      break;
    case "MicrofinanceLoan":
      tags.push(
        ...product.attributes.targetDemographics.map((d) => d.toLowerCase()),
        product.attributes.groupLending ? "group-lending" : "individual",
        product.attributes.repaymentSchedule.toLowerCase()
      );
      break;
    case "SavingsAccount":
      tags.push("savings", "deposit");
      if (product.attributes.minimumBalance === 0) {
        tags.push("no-minimum-balance");
      }
      break;
  }

  return tags.filter((tag, index, arr) => arr.indexOf(tag) === index); // Remove duplicates
}
