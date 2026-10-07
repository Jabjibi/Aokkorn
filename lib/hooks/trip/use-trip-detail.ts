"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { currencyOptions, type Currency } from "@/lib/hooks/dashboard/dashboard-data";
import { getCurrencyDigits, getCurrencyLabel } from "@/lib/hooks/dashboard/currency-data";
import {
  formatAmount,
  formatAverage,
  formatNumber,
  formatShare,
} from "@/lib/hooks/dashboard/format-amount";
import {
  getTripParticipants,
  updateTripCurrency,
  updateTripParticipants,
  updateTripStats,
  useTrips,
} from "@/lib/hooks/dashboard/use-trips";
import {
  convertLedgerCurrency,
  getConvertedAmountMinor,
  getRequiredRates,
  getSourceCurrency,
  parseExchangeRate,
} from "@/lib/hooks/trip/currency-conversion";
import { useTripLedger } from "@/lib/hooks/trip/use-trip-ledger";
import { useTripSummary } from "@/lib/hooks/trip/use-trip-summary";
import type { TripExpense, TripLedger } from "@/lib/hooks/trip/trip-types";

export type TripTab = "items" | "summary" | "split";

function parseAmountMinor(value: string, currency: Currency) {
  const input = value.trim();
  const fractionDigits = getCurrencyDigits(currency);
  const whole = "(?:\\d+|\\d{1,3}(?:,\\d{3})+)";
  const valid =
    fractionDigits === 0
      ? new RegExp(`^${whole}$`).test(input)
      : new RegExp(`^${whole}(?:\\.\\d{1,${fractionDigits}})?$`).test(input);
  if (!valid) return null;

  const [wholeAmount, fraction = ""] = input.replace(/,/g, "").split(".");
  const amount =
    Number(wholeAmount) * 10 ** fractionDigits + Number(fraction.padEnd(fractionDigits, "0"));
  return Number.isSafeInteger(amount) && amount > 0 ? amount : null;
}

function syncTripStats(tripId: number, ledger: TripLedger) {
  updateTripStats(
    tripId,
    ledger.expenses.reduce((sum, expense) => sum + getConvertedAmountMinor(expense), 0),
    ledger.expenses.length,
  );
}

export function useTripDetail(tripId: string) {
  const numericTripId = Number(tripId);
  const { trips, ready: tripsReady } = useTrips();
  const {
    ledger,
    ready: ledgerReady,
    addExpense,
    removeExpense,
    clearExpenses,
    addDay,
    changeCurrency,
  } = useTripLedger(numericTripId);
  const [activeTab, setActiveTab] = useState<TripTab>("items");
  const [formDay, setFormDay] = useState<number | null>(null);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [formError, setFormError] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [pendingClear, setPendingClear] = useState(false);
  const [notice, setNotice] = useState("");
  const [currencyEditorOpen, setCurrencyEditorOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [currencyError, setCurrencyError] = useState("");
  const [currencyRates, setCurrencyRates] = useState<Partial<Record<Currency, string>>>({});
  const [friendFormOpen, setFriendFormOpen] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [friendError, setFriendError] = useState("");

  const trip = trips.find((candidate) => candidate.id === numericTripId);
  const participants = getTripParticipants(trip);
  const selectedBase = selectedCurrency ?? trip?.currency ?? "THB";
  const requiredRates =
    trip && selectedBase !== trip.currency
      ? getRequiredRates(ledger, trip.currency, selectedBase)
      : [];
  const ratesValid = requiredRates.every((source) =>
    parseExchangeRate(currencyRates[source] ?? ""),
  );
  const previewLedger =
    trip && selectedBase !== trip.currency && ratesValid
      ? convertLedgerCurrency(ledger, trip.currency, selectedBase, currencyRates, "")
      : null;
  const previewTotalMinor = previewLedger?.expenses.reduce(
    (sum, expense) => sum + getConvertedAmountMinor(expense),
    0,
  );

  function openCurrencyEditor() {
    if (!trip) return;
    setSelectedCurrency(trip.currency);
    setCurrencyRates({});
    setCurrencyError("");
    setCurrencyEditorOpen(true);
  }

  function closeCurrencyEditor() {
    setCurrencyEditorOpen(false);
    setCurrencyError("");
  }

  function saveCurrency(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trip || !selectedCurrency) return;
    if (selectedCurrency === trip.currency) {
      closeCurrencyEditor();
      return;
    }
    if (!ratesValid) {
      setCurrencyError("กรอกอัตราแลกเปลี่ยนที่มากกว่า 0 ให้ครบทุกสกุลเงิน");
      return;
    }
    const next = changeCurrency(trip.currency, selectedCurrency, currencyRates);
    if (!next) {
      setCurrencyError("คำนวณยอดในสกุลเงินใหม่ไม่สำเร็จ กรุณาตรวจอัตราแลกเปลี่ยน");
      return;
    }
    const total = next.expenses.reduce((sum, expense) => sum + getConvertedAmountMinor(expense), 0);
    updateTripCurrency(trip.id, selectedCurrency, total, next.expenses.length);
    setNotice(`เปลี่ยนสกุลเงินหลักเป็น ${getCurrencyLabel(selectedCurrency)} แล้ว`);
    closeCurrencyEditor();
  }

  function openExpenseForm(day: number) {
    setPendingClear(false);
    setFormDay(day);
    setExpenseName("");
    setExpenseAmount("");
    setFormError("");
  }

  function closeExpenseForm() {
    setFormDay(null);
    setFormError("");
  }

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setExpenseName(event.target.value);
    setFormError("");
  }

  function handleAmountChange(event: ChangeEvent<HTMLInputElement>) {
    setExpenseAmount(event.target.value);
    setFormError("");
  }

  function handleAddExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trip || formDay === null) return;

    const name = expenseName.trim();
    if (!name) {
      setFormError("ใส่ชื่อรายการก่อนบันทึก");
      return;
    }

    const amountMinor = parseAmountMinor(expenseAmount, trip.currency);
    if (amountMinor === null) {
      setFormError(
        getCurrencyDigits(trip.currency) === 0
          ? "ใส่จำนวนเงินเต็มที่มากกว่า 0"
          : `ใส่จำนวนเงินที่มากกว่า 0 และทศนิยมไม่เกิน ${getCurrencyDigits(trip.currency)} ตำแหน่ง`,
      );
      return;
    }

    const nextTotal = ledger.expenses.reduce(
      (sum, expense) => sum + getConvertedAmountMinor(expense),
      amountMinor,
    );
    if (!Number.isSafeInteger(nextTotal)) {
      setFormError("ยอดรวมสูงเกินช่วงจำนวนเงินที่รองรับ");
      return;
    }

    const next = addExpense(formDay, name, amountMinor, trip.currency);
    syncTripStats(trip.id, next);
    setNotice(`เพิ่ม “${name}” ในวัน ${formDay} แล้ว`);
    closeExpenseForm();
  }

  function confirmRemoveExpense(expense: TripExpense) {
    if (!trip) return;

    const next = removeExpense(expense.id);
    syncTripStats(trip.id, next);
    setPendingDeleteId(null);
    setPendingClear(false);
    setNotice(`ลบ “${expense.name}” แล้ว`);
  }

  function handleAddDay() {
    const day = addDay();
    setNotice(`เพิ่มวัน ${day} แล้ว`);
    setFormDay(null);
    setPendingClear(false);
  }

  function requestClearExpenses() {
    if (ledger.expenses.length === 0) return;
    setPendingDeleteId(null);
    closeExpenseForm();
    setPendingClear(true);
  }

  function selectTab(tab: TripTab) {
    setPendingClear(false);
    setActiveTab(tab);
  }

  function openFriendForm() {
    setFriendName("");
    setFriendError("");
    setFriendFormOpen(true);
  }

  function closeFriendForm() {
    setFriendFormOpen(false);
    setFriendError("");
  }

  function handleFriendNameChange(event: ChangeEvent<HTMLInputElement>) {
    setFriendName(event.target.value);
    setFriendError("");
  }

  function handleAddFriend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trip) return;
    const name = friendName.trim();
    if (!name) {
      setFriendError("ใส่ชื่อเพื่อนก่อนเพิ่ม");
      return;
    }
    if (
      participants.some(
        (participant) => participant.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
      )
    ) {
      setFriendError("ชื่อนี้อยู่ในทริปแล้ว");
      return;
    }

    const next = [
      ...participants,
      { id: Math.max(0, ...participants.map((participant) => participant.id)) + 1, name },
    ];
    if (updateTripParticipants(trip.id, next)) {
      setNotice(`เพิ่ม ${name} เข้าทริปแล้ว`);
      closeFriendForm();
    }
  }

  function handleRemoveFriend(participantId: number) {
    if (!trip) return;
    const removed = participants.find((participant) => participant.id === participantId);
    if (!removed) return;
    if (
      updateTripParticipants(
        trip.id,
        participants.filter((participant) => participant.id !== participantId),
      )
    ) {
      setNotice(`นำ ${removed.name} ออกจากทริปแล้ว`);
    }
  }

  function confirmClearExpenses() {
    if (!trip) return;

    const clearedCount = ledger.expenses.length;
    const next = clearExpenses();
    syncTripStats(trip.id, next);
    setPendingClear(false);
    setPendingDeleteId(null);
    closeExpenseForm();
    setActiveTab("items");
    setNotice(`ล้างรายการ ${clearedCount} รายการแล้ว`);
  }

  async function handleShareTrip() {
    if (!trip) return;

    try {
      if (navigator.share) {
        await navigator.share({ title: trip.name, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setNotice("คัดลอกลิงก์ทริปแล้ว");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setNotice("แชร์ทริปไม่สำเร็จ ลองใหม่อีกครั้ง");
    }
  }

  const expenses = ledger.expenses;
  const totalMinor = expenses.reduce((sum, expense) => sum + getConvertedAmountMinor(expense), 0);
  const averageMinor = expenses.length ? totalMinor / expenses.length : 0;
  const peopleCount = participants.length + 1;
  const summary = useTripSummary({
    tripName: trip?.name ?? "",
    currency: trip?.currency ?? "THB",
    expenses,
  });

  const detail = trip
    ? {
        name: trip.name,
        createdAt: trip.createdAt,
        currency: trip.currency,
        currencyLabel: getCurrencyLabel(trip.currency),
        expenseCount: expenses.length,
        peopleCount,
        totalLabel: formatAmount(totalMinor, trip.currency),
        averageLabel: formatAverage(averageMinor, trip.currency),
        perPersonLabel: formatShare(totalMinor / peopleCount, trip.currency),
        splitSharePercent: peopleCount > 1 ? 100 / peopleCount : 0,
        participants: participants.map((participant) => ({
          ...participant,
          onRemove: () => handleRemoveFriend(participant.id),
        })),
        days: Array.from({ length: ledger.dayCount }, (_, index) => {
          const dayNumber = index + 1;
          const dayExpenses = expenses.filter((expense) => expense.day === dayNumber);
          return {
            id: dayNumber,
            name: `วัน ${dayNumber}`,
            totalLabel: formatAmount(
              dayExpenses.reduce((sum, expense) => sum + getConvertedAmountMinor(expense), 0),
              trip.currency,
            ),
            onAddExpense: () => openExpenseForm(dayNumber),
            formOpen: formDay === dayNumber,
            expenses: dayExpenses.map((expense) => ({
              id: expense.id,
              name: expense.name,
              amountLabel:
                getSourceCurrency(expense, trip.currency) === trip.currency
                  ? formatNumber(expense.amountMinor, trip.currency)
                  : formatAmount(expense.amountMinor, getSourceCurrency(expense, trip.currency)),
              convertedLabel:
                getSourceCurrency(expense, trip.currency) === trip.currency
                  ? null
                  : `≈ ${formatAmount(getConvertedAmountMinor(expense), trip.currency)}`,
              pendingDelete: pendingDeleteId === expense.id,
              onRemove: () => setPendingDeleteId(expense.id),
              onConfirmRemove: () => confirmRemoveExpense(expense),
              onCancelRemove: () => setPendingDeleteId(null),
            })),
          };
        }),
      }
    : null;

  return {
    ready: tripsReady && ledgerReady,
    detail,
    summary,
    activeTab,
    tabs: [
      { id: "items", label: "รายการ", onSelect: () => selectTab("items") },
      { id: "summary", label: "สรุป", onSelect: () => selectTab("summary") },
      { id: "split", label: "หาร", onSelect: () => selectTab("split") },
    ] satisfies { id: TripTab; label: string; onSelect: () => void }[],
    expenseForm: {
      name: expenseName,
      amount: expenseAmount,
      error: formError,
      onNameChange: handleNameChange,
      onAmountChange: handleAmountChange,
      onSubmit: handleAddExpense,
      onCancel: closeExpenseForm,
    },
    currencyEditor: {
      open: currencyEditorOpen,
      current: trip?.currency ?? "THB",
      selected: selectedBase,
      options: currencyOptions,
      rateFields: requiredRates.map((source) => ({
        source,
        target: selectedBase,
        value: currencyRates[source] ?? "",
        onChange: (event: ChangeEvent<HTMLInputElement>) => {
          setCurrencyRates((current) => ({ ...current, [source]: event.target.value }));
          setCurrencyError("");
        },
      })),
      previewLabel:
        previewTotalMinor === undefined ? null : formatAmount(previewTotalMinor, selectedBase),
      canSave: selectedCurrency !== null && previewLedger !== null,
      error: currencyError,
      onClose: closeCurrencyEditor,
      onToggle: currencyEditorOpen ? closeCurrencyEditor : openCurrencyEditor,
      onSelect: (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedCurrency(event.target.value as Currency);
        setCurrencyRates({});
        setCurrencyError("");
      },
      onSubmit: saveCurrency,
    },
    friendForm: {
      open: friendFormOpen,
      name: friendName,
      error: friendError,
      onOpen: openFriendForm,
      onClose: closeFriendForm,
      onNameChange: handleFriendNameChange,
      onSubmit: handleAddFriend,
    },
    onAddDay: handleAddDay,
    onShareTrip: handleShareTrip,
    pendingClear,
    onRequestClear: requestClearExpenses,
    onCancelClear: () => setPendingClear(false),
    onConfirmClear: confirmClearExpenses,
    notice,
  };
}
