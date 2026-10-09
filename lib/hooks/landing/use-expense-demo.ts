"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { landingDemo } from "@/lib/landing-demo-data";
import { formatMoney, parseExpenseInput } from "@/lib/money";

export function useExpenseDemo() {
  const [expenses, setExpenses] = useState(landingDemo.expenses);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.cents, 0),
    [expenses],
  );

  const shares = useMemo(
    () =>
      landingDemo.people.map((_, person) =>
        expenses.reduce(
          (sum, expense) =>
            sum +
            Math.floor(expense.cents / landingDemo.people.length) +
            (person < expense.cents % landingDemo.people.length ? 1 : 0),
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
    setExpenses(landingDemo.expenses);
    setDraft("");
    setError("");
    setNotice("รีเซ็ตตัวอย่างแล้ว");
  }

  function changeDraft(event: ChangeEvent<HTMLInputElement>) {
    setDraft(event.target.value);
    setError("");
  }

  return {
    tripName: landingDemo.tripName,
    payerName: landingDemo.payerName,
    people: landingDemo.people.map((name, index) => ({
      name,
      initial: name.slice(0, 1),
      share: formatMoney(shares[index]),
    })),
    peopleCount: landingDemo.people.length,
    expenses: expenses.map((expense) => ({ ...expense, amount: formatMoney(expense.cents) })),
    draft,
    changeDraft,
    error,
    notice,
    total: formatMoney(total),
    addExpense,
    reset,
  };
}

export type ExpenseDemoModel = ReturnType<typeof useExpenseDemo>;
