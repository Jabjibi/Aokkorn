"use client";

import { useMemo, useState, type FormEvent } from "react";
import { parseExpenseInput } from "@/lib/money";

type Expense = { id: number; name: string; cents: number };

const initialExpenses: Expense[] = [
  { id: 1, name: "อาหารทะเล", cents: 120000 },
  { id: 2, name: "รถไปสนามบิน", cents: 45000 },
];

export function useExpenseDemo() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.cents, 0),
    [expenses],
  );

  const shares = useMemo(
    () =>
      [0, 1, 2].map((person) =>
        expenses.reduce(
          (sum, expense) =>
            sum + Math.floor(expense.cents / 3) + (person < expense.cents % 3 ? 1 : 0),
          0,
        ),
      ),
    [expenses],
  );

  function addExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = parseExpenseInput(draft);

    if (!parsed) {
      setError("ลองพิมพ์ชื่อรายการตามด้วยราคา เช่น กะเพรา 300");
      return;
    }

    setExpenses((previous) => [
      ...previous,
      {
        id: previous.reduce((highest, expense) => Math.max(highest, expense.id), 0) + 1,
        ...parsed,
      },
    ]);
    setNotice(`เพิ่ม ${parsed.name} แล้ว`);
    setDraft("");
    setError("");
  }

  function reset() {
    setExpenses(initialExpenses);
    setDraft("");
    setError("");
    setNotice("รีเซ็ตตัวอย่างแล้ว");
  }

  return { expenses, draft, setDraft, error, notice, total, shares, addExpense, reset };
}
