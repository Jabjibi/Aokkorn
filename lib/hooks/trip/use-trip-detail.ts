"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { currencyOptions, type Currency } from "@/lib/hooks/dashboard/dashboard-data";
import { getCurrencyLabel } from "@/lib/hooks/dashboard/currency-data";
import {
  formatAmount,
  formatAverage,
  formatNumber,
  formatShare,
} from "@/lib/hooks/dashboard/format-amount";
import { getTripParticipants, useTrips } from "@/lib/hooks/dashboard/use-trips";
import {
  convertLedgerCurrency,
  getConvertedAmountMinor,
  getRequiredRates,
  getSourceCurrency,
  parseExchangeRate,
} from "@/lib/hooks/trip/currency-conversion";
import { useTripLedger } from "@/lib/hooks/trip/use-trip-ledger";
import { useTripSummary } from "@/lib/hooks/trip/use-trip-summary";
import { TRIP_READ_ONLY_MESSAGE } from "@/lib/hooks/trip/trip-availability";

export type TripTab = "items" | "summary" | "split";

export function useTripDetail(tripId: string) {
  const numericTripId = Number(tripId);
  const { trips, ready: tripsReady } = useTrips();
  const { ledger, ready: ledgerReady } = useTripLedger(numericTripId);
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

  function blockWrite() {
    setNotice(TRIP_READ_ONLY_MESSAGE);
  }

  function openCurrencyEditor() {
    blockWrite();
  }

  function closeCurrencyEditor() {
    setCurrencyEditorOpen(false);
    setCurrencyError("");
  }

  function saveCurrency(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCurrencyError(TRIP_READ_ONLY_MESSAGE);
  }

  function openExpenseForm() {
    blockWrite();
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
    setFormError(TRIP_READ_ONLY_MESSAGE);
  }

  function confirmRemoveExpense() {
    blockWrite();
  }
  function handleAddDay() {
    blockWrite();
  }
  function requestClearExpenses() {
    blockWrite();
  }

  function selectTab(tab: TripTab) {
    setPendingClear(false);
    setActiveTab(tab);
  }

  function openFriendForm() {
    blockWrite();
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
    setFriendError(TRIP_READ_ONLY_MESSAGE);
  }

  function handleRemoveFriend() {
    blockWrite();
  }
  function confirmClearExpenses() {
    blockWrite();
  }
  function handleShareTrip() {
    blockWrite();
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
          onRemove: handleRemoveFriend,
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
            onAddExpense: openExpenseForm,
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
              onRemove: blockWrite,
              onConfirmRemove: confirmRemoveExpense,
              onCancelRemove: () => setPendingDeleteId(null),
            })),
          };
        }),
      }
    : null;

  return {
    canEdit: false,
    readOnlyMessage: TRIP_READ_ONLY_MESSAGE,
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
      canEdit: false,
      canSave: false,
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
      disabled: true,
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
