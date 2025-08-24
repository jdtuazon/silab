export type ProductStatus = "in-dev" | "qa" | "prod" | "archived";

export type Product = {
  _id: string;
  name: string;
  category: string;
  tags: string[];
  status: ProductStatus;
  updatedAt?: string;
};

export type FilterState = {
  search: string;
  status: ProductStatus | "all";
  selectedTags: string[];
};