"use client";

import { useMemo, useState, type FormEvent } from "react";
import { mockLandingDemo } from "@/lib/mock-data/landing-demo";
import { parseExpenseInput } from "@/lib/money";

export function useExpenseDemo() {
  const [expenses, setExpenses] = useState(mockLandingDemo.expenses);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.cents, 0),
    [expenses],
  );

  const shares = useMemo(
    () =>
      mockLandingDemo.people.map((_, person) =>
        expenses.reduce(
          (sum, expense) =>
            sum +
            Math.floor(expense.cents / mockLandingDemo.people.length) +
            (person < expense.cents % mockLandingDemo.people.length ? 1 : 0),
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
    setExpenses(mockLandingDemo.expenses);
    setDraft("");
    setError("");
    setNotice("รีเซ็ตตัวอย่างแล้ว");
  }

  return {
    tripName: mockLandingDemo.tripName,
    payerName: mockLandingDemo.payerName,
    people: mockLandingDemo.people,
    peopleCount: mockLandingDemo.people.length,
    expenses,
    draft,
    setDraft,
    error,
    notice,
    total,
    shares,
    addExpense,
    reset,
  };
}
