"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { Currency, Trip, TripParticipant } from "@/lib/hooks/dashboard/dashboard-data";
import { isCurrency } from "@/lib/hooks/dashboard/currency-data";

const STORAGE_KEY = "aokkorn-trips-v1";
const LEGACY_LEDGER_PREFIX = "aokkorn-trip-ledger-v1-";
const RESERVED_ID_KEY = "aokkorn-legacy-mock-max-trip-id-v1";
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

  if (archiveLegacyMockTrips()) {
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

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
    typeof trip.createdAt === "string" &&
    typeof trip.amountMinor === "number" &&
    isCurrency(trip.currency) &&
    typeof trip.expenseCount === "number" &&
    typeof trip.peopleCount === "number" &&
    (trip.participants === undefined ||
      (Array.isArray(trip.participants) &&
        trip.participants.every(
          (participant) =>
            participant !== null &&
            typeof participant === "object" &&
            Number.isSafeInteger(participant.id) &&
            typeof participant.name === "string" &&
            participant.name.trim().length > 0,
        ))) &&
    (trip.status === "active" || trip.status === "draft")
  );
}

function parseStoredTrips(snapshot: string | null): Trip[] {
  if (!snapshot) return [];

  try {
    const parsed: unknown = JSON.parse(snapshot);
    return Array.isArray(parsed) && parsed.every(isTrip) ? parsed : [];
  } catch {
    return [];
  }
}

function isLegacyMockTrip(trip: Trip) {
  return (
    trip.createdAt === "21 ก.ย. 69" &&
    ((trip.id === 1 && trip.name === "ทริปเชียงใหม่") ||
      (trip.id === 2 && trip.name === "มื้อเย็นวันศุกร์"))
  );
}

function parseTrips(snapshot: string | null): Trip[] {
  return parseStoredTrips(snapshot).filter((trip) => !isLegacyMockTrip(trip));
}

function archiveLegacyMockTrips() {
  try {
    const storedTrips = parseStoredTrips(window.localStorage.getItem(STORAGE_KEY));
    const legacyTrips = storedTrips.filter(isLegacyMockTrip);
    if (legacyTrips.length === 0) return false;

    const ledgers = Object.fromEntries(
      legacyTrips.map((trip) => [
        trip.id,
        window.localStorage.getItem(`${LEGACY_LEDGER_PREFIX}${trip.id}`),
      ]),
    );
    const reservedId = Number(window.localStorage.getItem(RESERVED_ID_KEY)) || 0;
    const maxId = Math.max(reservedId, ...legacyTrips.map((trip) => trip.id));
    const backupKey = `aokkorn-legacy-mock-backup-${Date.now()}`;

    window.localStorage.setItem(backupKey, JSON.stringify({ trips: legacyTrips, ledgers }));
    window.localStorage.setItem(RESERVED_ID_KEY, String(maxId));
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(storedTrips.filter((trip) => !isLegacyMockTrip(trip))),
    );
    legacyTrips.forEach((trip) => {
      window.localStorage.removeItem(`${LEGACY_LEDGER_PREFIX}${trip.id}`);
    });
    memorySnapshot = null;
    return true;
  } catch {
    return false;
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
  const next = JSON.stringify([...parseStoredTrips(getSnapshot()), trip]);

  try {
    window.localStorage.setItem(STORAGE_KEY, next);
    memorySnapshot = null;
  } catch {
    memorySnapshot = next;
  }

  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function nextTripId() {
  let reservedId = 0;
  try {
    reservedId = Number(window.localStorage.getItem(RESERVED_ID_KEY)) || 0;
  } catch {
    // Browser storage may be unavailable; stored trip IDs are still checked.
  }
  return Math.max(0, reservedId, ...parseStoredTrips(getSnapshot()).map((trip) => trip.id)) + 1;
}

export function getTripParticipants(trip: Trip | undefined): TripParticipant[] {
  return trip?.participants ?? [];
}

export function updateTripParticipants(tripId: number, participants: TripParticipant[]) {
  const trips = parseStoredTrips(getSnapshot());
  if (!trips.some((trip) => trip.id === tripId && !isLegacyMockTrip(trip))) return false;

  const next = JSON.stringify(
    trips.map((trip) =>
      trip.id === tripId ? { ...trip, participants, peopleCount: participants.length + 1 } : trip,
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

export function updateTripCurrency(
  tripId: number,
  currency: Currency,
  amountMinor: number,
  expenseCount: number,
) {
  const trips = parseStoredTrips(getSnapshot());
  const trip = trips.find((candidate) => candidate.id === tripId && !isLegacyMockTrip(candidate));
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
  const trips = parseStoredTrips(getSnapshot());
  if (!trips.some((trip) => trip.id === tripId && !isLegacyMockTrip(trip))) return;

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
