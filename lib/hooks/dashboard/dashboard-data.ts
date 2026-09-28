export const MAX_TRIPS = 5;

export const currencyOptions = [
  { value: "THB", label: "THB — บาทไทย" },
  { value: "JPY", label: "JPY — เยนญี่ปุ่น" },
  { value: "USD", label: "USD — ดอลลาร์สหรัฐ" },
] as const;

export type Currency = (typeof currencyOptions)[number]["value"];

export type Trip = {
  id: number;
  name: string;
  emoji: string;
  createdAt: string;
  amountMinor: number;
  currency: Currency;
  expenseCount: number;
  peopleCount: number;
  status: "active" | "draft";
  tone: "lime" | "blue" | "peach";
};

export type TripView = Trip & { totalLabel: string };

export const initialTrips: Trip[] = [
  {
    id: 1,
    name: "ทริปเชียงใหม่",
    emoji: "🏔️",
    createdAt: "21 ก.ย. 69",
    amountMinor: 295000,
    currency: "THB",
    expenseCount: 3,
    peopleCount: 2,
    status: "active",
    tone: "lime",
  },
  {
    id: 2,
    name: "มื้อเย็นวันศุกร์",
    emoji: "🍜",
    createdAt: "21 ก.ย. 69",
    amountMinor: 0,
    currency: "THB",
    expenseCount: 0,
    peopleCount: 1,
    status: "draft",
    tone: "blue",
  },
];
