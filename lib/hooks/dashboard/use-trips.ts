"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { Trip, TripParticipant } from "@/lib/hooks/dashboard/dashboard-data";
import { isCurrency } from "@/lib/hooks/dashboard/currency-data";

const STORAGE_KEY = "aokkorn-trips-v1";
const SERVER_SNAPSHOT = "__server__";

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
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

export function useTrips() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
  const trips = useMemo(
    () => parseTrips(snapshot === SERVER_SNAPSHOT ? null : snapshot),
    [snapshot],
  );

  return { trips, ready: snapshot !== SERVER_SNAPSHOT };
}

/** Pure: อ่าน participant ที่อยู่ในข้อมูลเดิม; ไม่เขียนหรือย้ายเข้า account */
export function getTripParticipants(trip: Trip | undefined): TripParticipant[] {
  return trip?.participants ?? [];
}
