"use client";

import { useExpenseDemo } from "@/lib/hooks/landing/use-expense-demo";
import { ExpenseDemo } from "./expense-demo";

export function ExpenseDemoContainer() {
  const demo = useExpenseDemo();
  return <ExpenseDemo demo={demo} />;
}
