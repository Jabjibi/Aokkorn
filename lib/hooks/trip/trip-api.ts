import { requestApi } from "@/lib/hooks/api-client";
import { parseCurrencies, parseTripDetail, parseTripList, parseTripSummary } from "./trip-contract";

export async function readTrips(signal?: AbortSignal) {
  return parseTripList(await requestApi("trips", { signal }));
}

export async function readCurrencies(signal?: AbortSignal) {
  return parseCurrencies(await requestApi("currencies", { signal }));
}

export async function createTrip(
  input: {
    name: string;
    baseCurrency: string;
  },
  csrfToken: string,
  signal?: AbortSignal,
) {
  return parseTripDetail(await requestApi("trips", { body: input, csrfToken, signal }));
}

export async function readTripSummary(tripId: string, signal?: AbortSignal) {
  const result = parseTripSummary(
    await requestApi(`trips/${encodeURIComponent(tripId)}/summary`, { signal }),
  );

  if (result.trip.id !== tripId) {
    throw new Error("Trip response does not match request");
  }

  return result;
}
