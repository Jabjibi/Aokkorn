"use client";

import { useState, useSyncExternalStore, type ChangeEvent, type FormEvent } from "react";
import type { Currency } from "@/lib/hooks/dashboard/dashboard-data";
import { formatAmount, formatAverage } from "@/lib/hooks/dashboard/format-amount";
import { getConvertedAmountMinor, getSourceCurrency } from "@/lib/hooks/trip/currency-conversion";
import type { TripExpense } from "@/lib/hooks/trip/trip-types";

type PaymentMethod = "promptpay" | "bank";
type PaymentAccount = {
  name: string;
  method: PaymentMethod;
  bankName: string;
  number: string;
};

const STORAGE_KEY = "aokkorn-payment-account-v1";
const CHANGE_EVENT = "aokkorn-payment-account-change";
const SERVER_SNAPSHOT = "__server__";
let memorySnapshot: string | null | undefined;

function getSnapshot() {
  if (memorySnapshot !== undefined) return memorySnapshot;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(CHANGE_EVENT, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(CHANGE_EVENT, listener);
  };
}

function parseAccount(snapshot: string | null): PaymentAccount | null {
  if (!snapshot) return null;
  try {
    const value: unknown = JSON.parse(snapshot);
    if (!value || typeof value !== "object") return null;
    const account = value as Partial<PaymentAccount>;
    if (
      typeof account.name !== "string" ||
      (account.method !== "promptpay" && account.method !== "bank") ||
      typeof account.bankName !== "string" ||
      typeof account.number !== "string"
    ) {
      return null;
    }
    return account as PaymentAccount;
  } catch {
    return null;
  }
}

function writeAccount(account: PaymentAccount | null) {
  const snapshot = account ? JSON.stringify(account) : null;
  try {
    if (snapshot) window.localStorage.setItem(STORAGE_KEY, snapshot);
    else window.localStorage.removeItem(STORAGE_KEY);
    memorySnapshot = undefined;
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return true;
  } catch {
    memorySnapshot = snapshot;
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return false;
  }
}

function accountNumber(value: string) {
  return value.replace(/[\s-]/g, "");
}

export function useTripSummary({
  tripName,
  currency,
  expenses,
}: {
  tripName: string;
  currency: Currency;
  expenses: TripExpense[];
}) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
  const savedAccount = parseAccount(snapshot === SERVER_SNAPSHOT ? null : snapshot);
  const [draftName, setDraftName] = useState<string | null>(null);
  const [draftMethod, setDraftMethod] = useState<PaymentMethod | null>(null);
  const [draftBankName, setDraftBankName] = useState<string | null>(null);
  const [draftNumber, setDraftNumber] = useState<string | null>(null);
  const [draftRemember, setDraftRemember] = useState<boolean | null>(null);
  const [currentAccount, setCurrentAccount] = useState<PaymentAccount | null>(null);
  const [accountDirty, setAccountDirty] = useState(false);
  const [accountMessage, setAccountMessage] = useState("");
  const [shareMessage, setShareMessage] = useState("");

  const name = draftName ?? savedAccount?.name ?? "";
  const method = draftMethod ?? savedAccount?.method ?? "promptpay";
  const bankName = draftBankName ?? savedAccount?.bankName ?? "";
  const number = draftNumber ?? savedAccount?.number ?? "";
  const remember = draftRemember ?? savedAccount !== null;
  const digits = accountNumber(number);
  const validNumber =
    method === "promptpay" ? /^(?:\d{10}|\d{13})$/.test(digits) : /^\d{8,15}$/.test(digits);
  const accountValid =
    name.trim().length >= 2 && validNumber && (method !== "bank" || bankName.trim().length > 0);

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setDraftName(event.target.value);
    setAccountDirty(true);
    setAccountMessage("");
  }

  function handleNumberChange(event: ChangeEvent<HTMLInputElement>) {
    setDraftNumber(event.target.value);
    setAccountDirty(true);
    setAccountMessage("");
  }

  function handleBankNameChange(event: ChangeEvent<HTMLInputElement>) {
    setDraftBankName(event.target.value);
    setAccountDirty(true);
    setAccountMessage("");
  }

  function selectMethod(nextMethod: PaymentMethod) {
    setDraftMethod(nextMethod);
    setDraftNumber("");
    setAccountDirty(true);
    setAccountMessage("");
  }

  function handleRememberChange(event: ChangeEvent<HTMLInputElement>) {
    setDraftRemember(event.target.checked);
    setAccountMessage("");
  }

  function handleSaveAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accountValid) {
      setAccountMessage("กรอกชื่อและเลขบัญชีรับเงินให้ครบก่อนบันทึก");
      return;
    }

    const account: PaymentAccount = {
      name: name.trim(),
      method,
      bankName: method === "bank" ? bankName.trim() : "",
      number: digits,
    };
    const persisted = writeAccount(remember ? account : null);
    setCurrentAccount(account);
    setAccountDirty(false);
    setDraftName(account.name);
    setDraftBankName(account.bankName);
    setDraftNumber(account.number);
    setAccountMessage(
      remember && persisted ? "บันทึกบัญชีไว้ในเบราว์เซอร์แล้ว" : "บันทึกสำหรับหน้านี้แล้ว",
    );
  }

  const sortedExpenses = [...expenses].sort(
    (a, b) => getConvertedAmountMinor(b) - getConvertedAmountMinor(a) || a.id - b.id,
  );
  const totalMinor = expenses.reduce((sum, expense) => sum + getConvertedAmountMinor(expense), 0);
  const highest = sortedExpenses[0];
  const totalLabel = formatAmount(totalMinor, currency);
  const breakdown = sortedExpenses.map((expense) => {
    const convertedMinor = getConvertedAmountMinor(expense);
    const sourceCurrency = getSourceCurrency(expense, currency);
    const percentage = totalMinor > 0 ? Math.round((convertedMinor / totalMinor) * 100) : 0;
    return {
      id: expense.id,
      name: expense.name,
      amountLabel: formatAmount(convertedMinor, currency),
      sourceLabel:
        sourceCurrency === currency ? null : formatAmount(expense.amountMinor, sourceCurrency),
      percentageLabel: `${percentage}%`,
      progressWidth: `${Math.max(percentage, 2)}%`,
    };
  });

  async function handleShareSummary() {
    const accountForShare = accountDirty ? null : (currentAccount ?? savedAccount);
    const lines = [
      `สรุปทริป ${tripName}`,
      `ยอดรวม ${totalLabel}`,
      `${expenses.length} รายการ`,
      ...breakdown.map(
        (expense, index) =>
          `${index + 1}. ${expense.name} ${expense.amountLabel}${expense.sourceLabel ? ` (จาก ${expense.sourceLabel})` : ""}`,
      ),
    ];
    if (accountForShare) {
      lines.push(`บัญชีรับเงิน ${accountForShare.name}`);
      lines.push(
        `${accountForShare.method === "promptpay" ? "พร้อมเพย์" : accountForShare.bankName} ${accountForShare.number}`,
      );
    }
    const text = lines.join("\n");
    try {
      if (navigator.share) {
        await navigator.share({ title: `สรุปทริป ${tripName}`, text });
        setShareMessage("แชร์สรุปทริปแล้ว");
      } else {
        await navigator.clipboard.writeText(text);
        setShareMessage("คัดลอกสรุปทริปแล้ว");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareMessage("แชร์สรุปไม่สำเร็จ ลองใหม่อีกครั้ง");
    }
  }

  return {
    totalLabel,
    expenseCount: expenses.length,
    averageLabel: formatAverage(expenses.length ? totalMinor / expenses.length : 0, currency),
    highestLabel: formatAmount(highest ? getConvertedAmountMinor(highest) : 0, currency),
    highestName: highest?.name ?? "ยังไม่มีรายการ",
    breakdown,
    account: {
      name,
      method,
      bankName,
      number,
      remember,
      valid: accountValid,
      message: accountMessage,
      onNameChange: handleNameChange,
      onNumberChange: handleNumberChange,
      onBankNameChange: handleBankNameChange,
      onSelectPromptPay: () => selectMethod("promptpay"),
      onSelectBank: () => selectMethod("bank"),
      onRememberChange: handleRememberChange,
      onSubmit: handleSaveAccount,
    },
    onShare: handleShareSummary,
    shareMessage,
  };
}

export type TripSummaryModel = ReturnType<typeof useTripSummary>;
