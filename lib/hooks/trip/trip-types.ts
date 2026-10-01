import type { Currency } from "@/lib/hooks/dashboard/dashboard-data";

export type ExpenseConversion = {
  fromCurrency: Currency;
  toCurrency: Currency;
  rate: string;
  source: "manual";
  capturedAt: string;
  convertedAmountMinor: number;
};

export type TripExpense = {
  id: number;
  tripId: number;
  day: number;
  name: string;
  amountMinor: number;
  currency?: Currency;
  convertedAmountMinor?: number;
  conversionHistory?: ExpenseConversion[];
};

export type TripLedger = {
  dayCount: number;
  expenses: TripExpense[];
};
