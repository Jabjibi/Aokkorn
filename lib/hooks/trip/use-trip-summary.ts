"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
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

const LEGACY_STORAGE_KEY = "aokkorn-payment-account-v1";

function accountNumber(value: string) {
  return value.replace(/[\s-]/g, "");
}

function displayAccountNumber(account: PaymentAccount) {
  if (account.method === "promptpay" && account.number.length === 10) {
    return account.number.replace(/^(\d{3})(\d{4})(\d{3})$/, "$1 $2 $3");
  }
  return account.number;
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
  const [draftName, setDraftName] = useState("");
  const [draftMethod, setDraftMethod] = useState<PaymentMethod>("promptpay");
  const [draftBankName, setDraftBankName] = useState("");
  const [draftNumber, setDraftNumber] = useState("");
  const [savedAccount, setSavedAccount] = useState<PaymentAccount | null>(null);
  const [editingAccount, setEditingAccount] = useState(false);
  const [pendingAccountDelete, setPendingAccountDelete] = useState(false);
  const [accountMessage, setAccountMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    try {
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // Browser storage may be unavailable; no account data is read from it.
    }
  }, []);

  const digits = accountNumber(draftNumber);
  const validNumber =
    draftMethod === "promptpay" ? /^(?:\d{10}|\d{13})$/.test(digits) : /^\d{8,15}$/.test(digits);
  const accountValid =
    draftName.trim().length >= 2 &&
    validNumber &&
    (draftMethod !== "bank" || draftBankName.trim().length > 0);

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setDraftName(event.target.value);
    setAccountMessage("");
  }

  function handleNumberChange(event: ChangeEvent<HTMLInputElement>) {
    setDraftNumber(event.target.value);
    setAccountMessage("");
  }

  function handleBankNameChange(event: ChangeEvent<HTMLInputElement>) {
    setDraftBankName(event.target.value);
    setAccountMessage("");
  }

  function selectMethod(nextMethod: PaymentMethod) {
    setDraftMethod(nextMethod);
    setDraftNumber("");
    setAccountMessage("");
  }

  function handleSaveAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accountValid) {
      setAccountMessage("กรอกชื่อและเลขบัญชีรับเงินให้ครบก่อนบันทึก");
      return;
    }

    const account: PaymentAccount = {
      name: draftName.trim(),
      method: draftMethod,
      bankName: draftMethod === "bank" ? draftBankName.trim() : "",
      number: digits,
    };
    setSavedAccount(account);
    setEditingAccount(false);
    setPendingAccountDelete(false);
    setAccountMessage("");
    setCopyMessage("");
  }

  function editAccount() {
    if (!savedAccount) return;
    setDraftName(savedAccount.name);
    setDraftMethod(savedAccount.method);
    setDraftBankName(savedAccount.bankName);
    setDraftNumber(savedAccount.number);
    setEditingAccount(true);
    setPendingAccountDelete(false);
    setAccountMessage("");
    setCopyMessage("");
  }

  function cancelEditAccount() {
    setEditingAccount(false);
    setAccountMessage("");
    setCopyMessage("");
  }

  function confirmDeleteAccount() {
    setSavedAccount(null);
    setDraftName("");
    setDraftMethod("promptpay");
    setDraftBankName("");
    setDraftNumber("");
    setPendingAccountDelete(false);
    setCopyMessage("");
    setAccountMessage("ลบบัญชีรับเงินแล้ว");
  }

  async function copyAccountNumber() {
    if (!savedAccount) return;
    try {
      await navigator.clipboard.writeText(savedAccount.number);
      setCopyMessage("คัดลอกเลขบัญชีแล้ว");
    } catch {
      setCopyMessage("คัดลอกไม่สำเร็จ ลองใหม่อีกครั้ง");
    }
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
      percentage,
    };
  });

  async function handleShareSummary() {
    const lines = [
      `สรุปทริป ${tripName}`,
      `ยอดรวม ${totalLabel}`,
      `${expenses.length} รายการ`,
      ...breakdown.map(
        (expense, index) =>
          `${index + 1}. ${expense.name} ${expense.amountLabel}${expense.sourceLabel ? ` (จาก ${expense.sourceLabel})` : ""}`,
      ),
    ];
    if (savedAccount) {
      lines.push(`บัญชีรับเงิน ${savedAccount.name}`);
      lines.push(
        `${savedAccount.method === "promptpay" ? "พร้อมเพย์" : savedAccount.bankName} ${savedAccount.number}`,
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
      name: draftName,
      method: draftMethod,
      bankName: draftBankName,
      number: draftNumber,
      valid: accountValid,
      message: accountMessage,
      formOpen: savedAccount === null || editingAccount,
      isEditing: editingAccount,
      saved: savedAccount
        ? {
            name: savedAccount.name,
            methodLabel: savedAccount.method === "promptpay" ? "พร้อมเพย์" : savedAccount.bankName,
            method: savedAccount.method,
            displayNumber: displayAccountNumber(savedAccount),
          }
        : null,
      pendingDelete: pendingAccountDelete,
      copyMessage,
      onNameChange: handleNameChange,
      onNumberChange: handleNumberChange,
      onBankNameChange: handleBankNameChange,
      onSelectPromptPay: () => selectMethod("promptpay"),
      onSelectBank: () => selectMethod("bank"),
      onSubmit: handleSaveAccount,
      onEdit: editAccount,
      onCancelEdit: cancelEditAccount,
      onRequestDelete: () => setPendingAccountDelete(true),
      onCancelDelete: () => setPendingAccountDelete(false),
      onConfirmDelete: confirmDeleteAccount,
      onCopy: copyAccountNumber,
    },
    onShare: handleShareSummary,
    shareMessage,
  };
}

export type TripSummaryModel = ReturnType<typeof useTripSummary>;
