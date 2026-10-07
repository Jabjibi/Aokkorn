export const MAX_TRIPS = 5;

export { currencyOptions } from "@/lib/hooks/dashboard/currency-data";
export type { Currency } from "@/lib/hooks/dashboard/currency-data";

import type { Currency } from "@/lib/hooks/dashboard/currency-data";

export type TripParticipant = { id: number; name: string };

export type Trip = {
  id: number;
  name: string;
  createdAt: string;
  amountMinor: number;
  currency: Currency;
  expenseCount: number;
  peopleCount: number;
  participants?: TripParticipant[];
  status: "active" | "draft";
};

export type TripView = Trip & { totalLabel: string };
