"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { Currency } from "@/lib/hooks/dashboard/dashboard-data";
import { convertLedgerCurrency, parseExchangeRate } from "@/lib/hooks/trip/currency-conversion";
import type { TripExpense, TripLedger } from "@/lib/hooks/trip/trip-types";
import { mockTripExpenses } from "@/lib/mock-data/trip";

const STORAGE_PREFIX = "aokkorn-trip-ledger-v1-";
const CHANGE_EVENT = "aokkorn-trip-ledger-change";
const SERVER_SNAPSHOT = "__server__";
const memorySnapshots = new Map<number, string>();

function storageKey(tripId: number) {
  return `${STORAGE_PREFIX}${tripId}`;
}

function getSnapshot(tripId: number) {
  const fallback = memorySnapshots.get(tripId);
  if (fallback !== undefined) return fallback;

  try {
    return window.localStorage.getItem(storageKey(tripId));
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

function initialLedger(tripId: number): TripLedger {
  const expenses = mockTripExpenses.filter((expense) => expense.tripId === tripId);
  return {
    dayCount: Math.max(1, ...expenses.map((expense) => expense.day)),
    expenses,
  };
}

function isExpense(value: unknown, tripId: number, dayCount: number): value is TripExpense {
  if (!value || typeof value !== "object") return false;

  const expense = value as Partial<TripExpense>;
  return (
    Number.isSafeInteger(expense.id) &&
    expense.tripId === tripId &&
    Number.isSafeInteger(expense.day) &&
    typeof expense.day === "number" &&
    expense.day >= 1 &&
    expense.day <= dayCount &&
    typeof expense.name === "string" &&
    Number.isSafeInteger(expense.amountMinor) &&
    typeof expense.amountMinor === "number" &&
    expense.amountMinor > 0 &&
    (expense.currency === undefined ||
      expense.currency === "THB" ||
      expense.currency === "JPY" ||
      expense.currency === "USD") &&
    (expense.convertedAmountMinor === undefined ||
      (Number.isSafeInteger(expense.convertedAmountMinor) && expense.convertedAmountMinor >= 0)) &&
    (expense.conversionHistory === undefined ||
      (Array.isArray(expense.conversionHistory) &&
        expense.conversionHistory.every(
          (conversion) =>
            conversion !== null &&
            typeof conversion === "object" &&
            (conversion.fromCurrency === "THB" ||
              conversion.fromCurrency === "JPY" ||
              conversion.fromCurrency === "USD") &&
            (conversion.toCurrency === "THB" ||
              conversion.toCurrency === "JPY" ||
              conversion.toCurrency === "USD") &&
            typeof conversion.rate === "string" &&
            parseExchangeRate(conversion.rate) !== null &&
            conversion.source === "manual" &&
            typeof conversion.capturedAt === "string" &&
            Number.isSafeInteger(conversion.convertedAmountMinor) &&
            conversion.convertedAmountMinor >= 0,
        )))
  );
}

function parseLedger(snapshot: string | null, tripId: number): TripLedger {
  if (!snapshot) return initialLedger(tripId);

  try {
    const parsed: unknown = JSON.parse(snapshot);
    if (!parsed || typeof parsed !== "object") return initialLedger(tripId);

    const ledger = parsed as Partial<TripLedger>;
    if (
      !Number.isSafeInteger(ledger.dayCount) ||
      typeof ledger.dayCount !== "number" ||
      ledger.dayCount < 1 ||
      !Array.isArray(ledger.expenses) ||
      !ledger.expenses.every((expense) => isExpense(expense, tripId, ledger.dayCount!))
    ) {
      return initialLedger(tripId);
    }

    return ledger as TripLedger;
  } catch {
    return initialLedger(tripId);
  }
}

function writeLedger(tripId: number, ledger: TripLedger) {
  const snapshot = JSON.stringify(ledger);

  try {
    window.localStorage.setItem(storageKey(tripId), snapshot);
    memorySnapshots.delete(tripId);
  } catch {
    memorySnapshots.set(tripId, snapshot);
  }

  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useTripLedger(tripId: number) {
  const readSnapshot = useCallback(() => getSnapshot(tripId), [tripId]);
  const snapshot = useSyncExternalStore(subscribe, readSnapshot, () => SERVER_SNAPSHOT);
  const ledger = useMemo(
    () => parseLedger(snapshot === SERVER_SNAPSHOT ? null : snapshot, tripId),
    [snapshot, tripId],
  );

  const addExpense = useCallback(
    (day: number, name: string, amountMinor: number, currency: Currency) => {
      const current = parseLedger(getSnapshot(tripId), tripId);
      const next: TripLedger = {
        ...current,
        expenses: [
          ...current.expenses,
          {
            id: Math.max(0, ...current.expenses.map((expense) => expense.id)) + 1,
            tripId,
            day,
            name,
            amountMinor,
            currency,
            convertedAmountMinor: amountMinor,
          },
        ],
      };
      writeLedger(tripId, next);
      return next;
    },
    [tripId],
  );

  const removeExpense = useCallback(
    (expenseId: number) => {
      const current = parseLedger(getSnapshot(tripId), tripId);
      const next: TripLedger = {
        ...current,
        expenses: current.expenses.filter((expense) => expense.id !== expenseId),
      };
      writeLedger(tripId, next);
      return next;
    },
    [tripId],
  );

  const clearExpenses = useCallback(() => {
    const current = parseLedger(getSnapshot(tripId), tripId);
    const next: TripLedger = { ...current, expenses: [] };
    writeLedger(tripId, next);
    return next;
  }, [tripId]);

  const addDay = useCallback(() => {
    const current = parseLedger(getSnapshot(tripId), tripId);
    const next: TripLedger = { ...current, dayCount: current.dayCount + 1 };
    writeLedger(tripId, next);
    return next.dayCount;
  }, [tripId]);

  const changeCurrency = useCallback(
    (currentBase: Currency, target: Currency, rates: Partial<Record<Currency, string>>) => {
      const current = parseLedger(getSnapshot(tripId), tripId);
      const next = convertLedgerCurrency(
        current,
        currentBase,
        target,
        rates,
        new Date().toISOString(),
      );
      if (!next) return null;
      writeLedger(tripId, next);
      return next;
    },
    [tripId],
  );

  return {
    ledger,
    ready: snapshot !== SERVER_SNAPSHOT,
    addExpense,
    removeExpense,
    clearExpenses,
    addDay,
    changeCurrency,
  };
}
