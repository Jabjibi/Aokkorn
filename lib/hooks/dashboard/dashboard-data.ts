export const MAX_TRIPS = 5;

export const currencyOptions = [
  { value: "THB", label: "THB — บาทไทย" },
  { value: "JPY", label: "JPY — เยนญี่ปุ่น" },
  { value: "USD", label: "USD — ดอลลาร์สหรัฐ" },
] as const;

export type Currency = (typeof currencyOptions)[number]["value"];

export type TripParticipant = { id: number; name: string };

export type Trip = {
  id: number;
  name: string;
  emoji: string;
  createdAt: string;
  amountMinor: number;
  currency: Currency;
  expenseCount: number;
  peopleCount: number;
  participants?: TripParticipant[];
  status: "active" | "draft";
  tone: "lime" | "blue" | "peach";
};

export type TripView = Trip & { totalLabel: string };
