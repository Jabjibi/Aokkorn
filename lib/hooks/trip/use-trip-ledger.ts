"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { isCurrency } from "@/lib/hooks/dashboard/currency-data";
import { parseExchangeRate } from "@/lib/hooks/trip/currency-conversion";
import type { TripExpense, TripLedger } from "@/lib/hooks/trip/trip-types";

const STORAGE_PREFIX = "aokkorn-trip-ledger-v1-";
const SERVER_SNAPSHOT = "__server__";

function storageKey(tripId: number) {
  return `${STORAGE_PREFIX}${tripId}`;
}

function getSnapshot(tripId: number) {
  try {
    return window.localStorage.getItem(storageKey(tripId));
  } catch {
    return null;
  }
}

function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener("storage", listener);
  };
}

function initialLedger(): TripLedger {
  return { dayCount: 1, expenses: [] };
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
    (expense.currency === undefined || isCurrency(expense.currency)) &&
    (expense.convertedAmountMinor === undefined ||
      (Number.isSafeInteger(expense.convertedAmountMinor) && expense.convertedAmountMinor >= 0)) &&
    (expense.conversionHistory === undefined ||
      (Array.isArray(expense.conversionHistory) &&
        expense.conversionHistory.every(
          (conversion) =>
            conversion !== null &&
            typeof conversion === "object" &&
            isCurrency(conversion.fromCurrency) &&
            isCurrency(conversion.toCurrency) &&
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
  if (!snapshot) return initialLedger();

  try {
    const parsed: unknown = JSON.parse(snapshot);
    if (!parsed || typeof parsed !== "object") return initialLedger();

    const ledger = parsed as Partial<TripLedger>;
    if (
      !Number.isSafeInteger(ledger.dayCount) ||
      typeof ledger.dayCount !== "number" ||
      ledger.dayCount < 1 ||
      !Array.isArray(ledger.expenses) ||
      !ledger.expenses.every((expense) => isExpense(expense, tripId, ledger.dayCount!))
    ) {
      return initialLedger();
    }

    return ledger as TripLedger;
  } catch {
    return initialLedger();
  }
}

/** อ่าน ledger เดิมจาก browser เท่านั้น; ไม่มี mutation API หรือ localStorage fallback สำหรับการบันทึก */
export function useTripLedger(tripId: number) {
  const readSnapshot = useCallback(() => getSnapshot(tripId), [tripId]);
  const snapshot = useSyncExternalStore(subscribe, readSnapshot, () => SERVER_SNAPSHOT);
  const ledger = useMemo(
    () => parseLedger(snapshot === SERVER_SNAPSHOT ? null : snapshot, tripId),
    [snapshot, tripId],
  );
  return { ledger, ready: snapshot !== SERVER_SNAPSHOT };
}
