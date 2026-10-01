"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { Currency, Trip } from "@/lib/hooks/dashboard/dashboard-data";
import { mockTrips } from "@/lib/mock-data/dashboard";

const STORAGE_KEY = "aokkorn-trips-v1";
const CHANGE_EVENT = "aokkorn-trips-change";
const SERVER_SNAPSHOT = "__server__";

let memorySnapshot: string | null = null;

function getSnapshot() {
  if (memorySnapshot !== null) return memorySnapshot;

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

function isTrip(value: unknown): value is Trip {
  if (!value || typeof value !== "object") return false;

  const trip = value as Partial<Trip>;
  return (
    Number.isInteger(trip.id) &&
    typeof trip.name === "string" &&
    typeof trip.emoji === "string" &&
    typeof trip.createdAt === "string" &&
    typeof trip.amountMinor === "number" &&
    (trip.currency === "THB" || trip.currency === "JPY" || trip.currency === "USD") &&
    typeof trip.expenseCount === "number" &&
    typeof trip.peopleCount === "number" &&
    (trip.status === "active" || trip.status === "draft") &&
    (trip.tone === "lime" || trip.tone === "blue" || trip.tone === "peach")
  );
}

function parseTrips(snapshot: string | null): Trip[] {
  if (!snapshot) return mockTrips;

  try {
    const parsed: unknown = JSON.parse(snapshot);
    return Array.isArray(parsed) && parsed.every(isTrip) ? parsed : mockTrips;
  } catch {
    return mockTrips;
  }
}

export function useTrips() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
  const trips = useMemo(
    () => parseTrips(snapshot === SERVER_SNAPSHOT ? null : snapshot),
    [snapshot],
  );

  return { trips, ready: snapshot !== SERVER_SNAPSHOT };
}

export function addTrip(trip: Trip) {
  const next = JSON.stringify([...parseTrips(getSnapshot()), trip]);

  try {
    window.localStorage.setItem(STORAGE_KEY, next);
    memorySnapshot = null;
  } catch {
    memorySnapshot = next;
  }

  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function updateTripCurrency(
  tripId: number,
  currency: Currency,
  amountMinor: number,
  expenseCount: number,
) {
  const trips = parseTrips(getSnapshot());
  const trip = trips.find((candidate) => candidate.id === tripId);
  if (!trip || !Number.isSafeInteger(amountMinor) || amountMinor < 0) return false;

  const next = JSON.stringify(
    trips.map((candidate) =>
      candidate.id === tripId ? { ...candidate, currency, amountMinor, expenseCount } : candidate,
    ),
  );

  try {
    window.localStorage.setItem(STORAGE_KEY, next);
    memorySnapshot = null;
  } catch {
    memorySnapshot = next;
  }

  window.dispatchEvent(new Event(CHANGE_EVENT));
  return true;
}

export function updateTripStats(tripId: number, amountMinor: number, expenseCount: number) {
  const trips = parseTrips(getSnapshot());
  if (!trips.some((trip) => trip.id === tripId)) return;

  const next = JSON.stringify(
    trips.map((trip) =>
      trip.id === tripId
        ? {
            ...trip,
            amountMinor,
            expenseCount,
            status: expenseCount > 0 ? ("active" as const) : ("draft" as const),
          }
        : trip,
    ),
  );
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
    memorySnapshot = null;
  } catch {
    memorySnapshot = next;
  }

  window.dispatchEvent(new Event(CHANGE_EVENT));
}
