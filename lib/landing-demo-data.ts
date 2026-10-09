export type DemoExpense = { id: number; name: string; cents: number };

export const landingDemo: {
  tripName: string;
  payerName: string;
  people: string[];
  expenses: DemoExpense[];
} = {
  tripName: "หนีไปทะเลกัน",
  payerName: "คุณ",
  people: ["คุณ", "มายด์", "พีท"],
  expenses: [
    { id: 1, name: "อาหารทะเล", cents: 120000 },
    { id: 2, name: "รถไปสนามบิน", cents: 45000 },
  ],
};
