"use client";

import { useState } from "react";
import { tripSummaryView } from "./trip-view";
import type { CurrencyInfo, TripSummary } from "./trip-contract";

export function useTripSummary(snapshot: TripSummary | null, currencies: CurrencyInfo[]) {
  const [shareMessage, setShareMessage] = useState("");
  const view = snapshot ? tripSummaryView(snapshot, currencies) : null;

  async function onShare() {
    if (!snapshot || !view) {
      return;
    }

    const title = `สรุปทริป ${snapshot.trip.name}`;
    const text = [
      title,
      `ยอดรวม ${view.totalLabel}`,
      `${view.expenseCount} รายการ`,
      ...view.breakdown.map((entry) => `${entry.name} ${entry.amountLabel}`),
    ].join("\n");

    try {
      if (navigator.share) {
        await navigator.share({ title, text });
        setShareMessage("แชร์สรุปทริปแล้ว");
      } else {
        await navigator.clipboard.writeText(text);
        setShareMessage("คัดลอกสรุปทริปแล้ว");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setShareMessage("แชร์สรุปไม่สำเร็จ กรุณาลองอีกครั้ง");
    }
  }

  return view ? { ...view, onShare, shareMessage } : null;
}

export type TripSummaryModel = NonNullable<ReturnType<typeof useTripSummary>>;
