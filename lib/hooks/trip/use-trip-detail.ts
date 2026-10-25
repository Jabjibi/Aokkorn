"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiRequestError, apiErrorMessage } from "@/lib/hooks/api-client";
import { readCurrencies, readTripSummary } from "./trip-api";
import { tripDetailView } from "./trip-view";
import { useTripSummary } from "./use-trip-summary";
import { assertCurrencyMetadata } from "./trip-contract";
import type { CurrencyInfo, TripSummary } from "./trip-contract";

export type TripTab = "items" | "summary" | "split";

type DetailState =
  | { status: "loading" }
  | {
      status: "error";
      message: string;
    }
  | { status: "not-found" }
  | {
      status: "ready";
      tripId: string;
      snapshot: TripSummary;
      currencies: CurrencyInfo[];
    };

export function useTripDetail(tripId: string) {
  const router = useRouter();
  const [state, setState] = useState<DetailState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [activeTab, setActiveTab] = useState<TripTab>("items");

  useEffect(() => {
    const controller = new AbortController();

    void Promise.all([
      readTripSummary(tripId, controller.signal),
      readCurrencies(controller.signal),
    ])
      .then(([snapshot, currencies]) => {
        assertCurrencyMetadata(currencies, [
          snapshot.trip.total,
          ...snapshot.trip.days.map((day) => day.total),
          ...snapshot.expenses.flatMap((expense) => [expense.amount, expense.converted]),
          ...snapshot.obligations.map((entry) => entry.amount),
          ...snapshot.obligationTotals.paid,
          ...snapshot.obligationTotals.unpaid,
        ]);

        if (!controller.signal.aborted) {
          setState({ status: "ready", tripId, snapshot, currencies });
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        if (error instanceof ApiRequestError && error.status === 404) {
          setState({ status: "not-found" });
        } else {
          setState({ status: "error", message: apiErrorMessage(error) });

          if (error instanceof ApiRequestError && error.status === 401) {
            router.replace("/?login=required");
          }
        }
      });

    return () => controller.abort();
  }, [tripId, router, attempt]);

  const loaded = state.status === "ready" && state.tripId === tripId ? state : null;
  const detail = loaded ? tripDetailView(loaded.snapshot, loaded.currencies) : null;
  const summary = useTripSummary(loaded?.snapshot ?? null, loaded?.currencies ?? []);

  function retry() {
    setState({ status: "loading" });
    setAttempt((value) => value + 1);
  }

  return {
    status: state.status === "ready" && !loaded ? "loading" : state.status,
    error: state.status === "error" ? state.message : "",
    retry,
    detail,
    summary,
    activeTab,
    tabs: [
      { id: "items", label: "รายการ", onSelect: () => setActiveTab("items") },
      { id: "summary", label: "สรุป", onSelect: () => setActiveTab("summary") },
      { id: "split", label: "หาร", onSelect: () => setActiveTab("split") },
    ] satisfies {
      id: TripTab;
      label: string;
      onSelect: () => void;
    }[],
  };
}
