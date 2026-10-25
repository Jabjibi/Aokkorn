"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiRequestError, apiErrorMessage } from "@/lib/hooks/api-client";
import { readCurrencies, readTrips } from "@/lib/hooks/trip/trip-api";
import { assertCurrencyMetadata } from "@/lib/hooks/trip/trip-contract";
import type { CurrencyInfo, TripList } from "@/lib/hooks/trip/trip-contract";

type TripsState =
  | { status: "loading" }
  | {
      status: "error";
      message: string;
    }
  | {
      status: "ready";
      list: TripList;
      currencies: CurrencyInfo[];
    };

export function useTrips() {
  const router = useRouter();
  const [state, setState] = useState<TripsState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    void Promise.all([readTrips(controller.signal), readCurrencies(controller.signal)])
      .then(([list, currencies]) => {
        assertCurrencyMetadata(currencies, [
          ...list.items.map((trip) => trip.total),
          ...list.totalsByCurrency,
        ]);

        if (!controller.signal.aborted) {
          setState({ status: "ready", list, currencies });
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setState({ status: "error", message: apiErrorMessage(error) });

        if (error instanceof ApiRequestError && error.status === 401) {
          router.replace("/?login=required");
        }
      });

    return () => controller.abort();
  }, [router, attempt]);

  function reload() {
    setState({ status: "loading" });
    setAttempt((value) => value + 1);
  }

  return { state, reload };
}
