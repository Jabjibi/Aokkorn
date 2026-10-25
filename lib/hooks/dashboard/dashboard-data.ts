export { currencyOptions } from "@/lib/hooks/dashboard/currency-data";

export type { Currency } from "@/lib/hooks/dashboard/currency-data";

export type TripView = {
  id: string;
  name: string;
  createdAt: string;
  totalLabel: string;
  expenseCount: number;
  peopleCount: number;
  status: "active" | "draft";
};
