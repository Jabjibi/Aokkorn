import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiRequestError } from "@/lib/hooks/api-client";
import { createTrip, readTrips } from "@/lib/hooks/trip/trip-api";
import {
  parseTripList,
  parseTripSummary,
  assertCurrencyMetadata,
} from "@/lib/hooks/trip/trip-contract";
import { averageMoney, formatApiMoney } from "@/lib/hooks/trip/format-api-money";
import { tripDetailView } from "@/lib/hooks/trip/trip-view";
import { account, currencies, summary, tripDetail, tripList } from "../fixtures/api-trips";

const fetcher = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubGlobal("fetch", fetcher);
  vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "http://localhost:5016");
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  fetcher.mockReset();
});

describe("API boundary", () => {
  it("โหลดรายการด้วย cookie โดยไม่ cache", async () => {
    fetcher.mockResolvedValue(Response.json(tripList));
    expect(await readTrips()).toEqual(tripList);
    expect(fetcher).toHaveBeenCalledWith(
      "http://localhost:5016/api/v1/trips",
      expect.objectContaining({ credentials: "include", cache: "no-store", redirect: "error" }),
    );
  });
  it("สร้างด้วย CSRF และใช้ UUID ที่ backend คืน", async () => {
    fetcher.mockResolvedValue(Response.json(tripDetail, { status: 201 }));
    expect(
      (await createTrip({ name: "ทริปจริง", baseCurrency: "THB" }, account.session.csrfToken)).id,
    ).toBe(tripDetail.id);
    expect(fetcher).toHaveBeenCalledWith(
      "http://localhost:5016/api/v1/trips",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": account.session.csrfToken },
        body: JSON.stringify({ name: "ทริปจริง", baseCurrency: "THB" }),
      }),
    );
  });
  it.each([401, 403, 503])("HTTP %i ไม่ถูกมองว่าสำเร็จ", async (status) => {
    fetcher.mockResolvedValue(Response.json({ errorCode: "TEST", message: "private" }, { status }));
    await expect(readTrips()).rejects.toMatchObject({ status, code: "TEST" });
  });
  it("response ผิดไม่กลายเป็นรายการว่าง", async () => {
    fetcher.mockResolvedValue(Response.json({ items: "invalid" }));
    await expect(readTrips()).rejects.toBeInstanceOf(ApiRequestError);
  });
  it("quota และ UUID เก่าต้องไม่ผ่าน contract", () => {
    expect(() =>
      parseTripList({ ...tripList, quota: { used: 0, limit: 5, remaining: 5 } }),
    ).toThrow();
    expect(() =>
      parseTripList({ ...tripList, items: [{ ...tripList.items[0], id: 1 }] }),
    ).toThrow();
  });
  it("ไม่มี metadata ไม่เดาทศนิยม", () => {
    expect(() => assertCurrencyMetadata([], [tripDetail.total])).toThrow();
    expect(() => assertCurrencyMetadata(currencies, [{ minor: "1", currency: "XXX" }])).toThrow();
  });
});

describe("เงินและข้อมูลหน้าจอ", () => {
  it("ยอดเกิน Number.MAX_SAFE_INTEGER ยังคงสตางค์ครบ", () => {
    expect(formatApiMoney({ minor: "9223372036854775807", currency: "THB" }, currencies)).toBe(
      "฿92,233,720,368,547,758.07",
    );
    expect(formatApiMoney({ minor: "1234", currency: "JPY" }, currencies)).toContain("1,234");
    expect(averageMoney({ minor: "101", currency: "THB" }, 2).minor).toBe("51");
  });
  it("แสดงคนรวมเจ้าของและภาระที่ backend คำนวณ ไม่ใช้ยอดทริปหารทุกคน", () => {
    const parsed = parseTripSummary(summary);
    const view = tripDetailView(parsed, currencies);

    expect(view.participants).toHaveLength(2);
    expect(view.obligations[0]).toMatchObject({
      debtor: "เพื่อน",
      creditor: "ฉัน",
      amountLabel: "฿100",
    });
    expect(view.days[0].name).toBe("วันเดินทาง");
    expect(view.days[0].expenses[0].name).toBe("อาหาร");
  });
  it("snapshot ต่างสกุลต้องมี conversion จริง และวันต้องอยู่ในทริป", () => {
    expect(() =>
      parseTripSummary({
        ...summary,
        expenses: [{ ...summary.expenses[0], amount: { minor: "1", currency: "JPY" } }],
      }),
    ).toThrow();
    expect(() =>
      parseTripSummary({
        ...summary,
        expenses: [{ ...summary.expenses[0], dayId: tripDetail.id }],
      }),
    ).toThrow();
  });
});
