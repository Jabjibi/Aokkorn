import { act, cleanup, renderHook } from "@testing-library/react";
import type { FormEvent } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { useTrips } from "@/lib/hooks/dashboard/use-trips";
import { useDashboard } from "@/lib/hooks/dashboard/use-dashboard";
import { useTripLedger } from "@/lib/hooks/trip/use-trip-ledger";
import { useTripDetail } from "@/lib/hooks/trip/use-trip-detail";
import { TRIP_READ_ONLY_MESSAGE } from "@/lib/hooks/trip/trip-availability";
import { trip, ledger, seedLegacyTrip as seed } from "./fixtures/legacy-trip";

function watchWrites() {
  return [
    vi.spyOn(Storage.prototype, "setItem"),
    vi.spyOn(Storage.prototype, "removeItem"),
    vi.spyOn(Storage.prototype, "clear"),
  ];
}
function formEvent() {
  return { preventDefault: vi.fn() } as unknown as FormEvent<HTMLFormElement>;
}
beforeEach(() => {
  window.localStorage.clear();
  vi.stubGlobal("fetch", vi.fn());
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it("อ่านข้อมูลเดิมได้หลัง remount โดยไม่เขียน ลบ หรือเรียก business API", () => {
  seed();
  const writes = watchWrites();
  const view = renderHook(() => ({ trips: useTrips(), ledger: useTripLedger(1) }));
  expect(view.result.current.trips.trips).toEqual([trip]);
  expect(view.result.current.ledger.ledger).toEqual(ledger);
  // storage hooks อ่านอย่างเดียว ไม่มี API สำหรับบันทึกใน browser อีก
  expect(view.result.current.ledger).not.toHaveProperty("addExpense");
  view.unmount();
  const reopened = renderHook(() => ({ trips: useTrips(), ledger: useTripLedger(1) }));
  expect(reopened.result.current.trips.trips).toEqual([trip]);
  expect(reopened.result.current.ledger.ledger).toEqual(ledger);
  for (const spy of writes) expect(spy).not.toHaveBeenCalled();
  expect(window.fetch).not.toHaveBeenCalled();
});

it("ส่งฟอร์มสร้างทริปโดยตรงก็ไม่สร้าง local object หรือแสดงผลสำเร็จ", () => {
  seed();
  const writes = watchWrites();
  const view = renderHook(() => useDashboard());
  expect(view.result.current.canCreate).toBe(false);
  act(() => view.result.current.submitCreateTrip(formEvent()));
  expect(view.result.current.error).toBe(TRIP_READ_ONLY_MESSAGE);
  expect(view.result.current.notice).not.toContain("สร้าง “");
  expect(view.result.current.trips).toHaveLength(1);
  for (const spy of writes) expect(spy).not.toHaveBeenCalled();
  expect(window.fetch).not.toHaveBeenCalled();
});

it("ทุก handler แก้ทริปถูกปิด รวม form submit และการลบบัญชีรับเงินเดิม", () => {
  seed();
  const writes = watchWrites();
  const view = renderHook(() => useTripDetail("1"));
  expect(view.result.current.canEdit).toBe(false);
  act(() => {
    const model = view.result.current;
    model.expenseForm.onSubmit(formEvent());
    model.currencyEditor.onSubmit(formEvent());
    model.friendForm.onSubmit(formEvent());
    model.detail!.days[0].onAddExpense();
    model.detail!.days[0].expenses[0].onRemove();
    model.detail!.days[0].expenses[0].onConfirmRemove();
    model.detail!.participants[0].onRemove();
    model.onAddDay();
    model.onRequestClear();
    model.onConfirmClear();
    model.summary.account.onSubmit(formEvent());
    model.summary.account.onConfirmDelete();
    model.onShareTrip();
  });
  expect(view.result.current.expenseForm.error).toBe(TRIP_READ_ONLY_MESSAGE);
  expect(view.result.current.notice).toBe(TRIP_READ_ONLY_MESSAGE);
  expect(window.localStorage.getItem("aokkorn-trips-v1")).toBe(JSON.stringify([trip]));
  expect(window.localStorage.getItem("aokkorn-trip-ledger-v1-1")).toBe(JSON.stringify(ledger));
  expect(window.localStorage.getItem("aokkorn-payment-account-v1")).toBe(
    "existing-private-account",
  );
  for (const spy of writes) expect(spy).not.toHaveBeenCalled();
  expect(window.fetch).not.toHaveBeenCalled();
});

it("ยังอ่านสรุปและสลับแท็บได้ โดยไม่เขียนข้อมูล", () => {
  seed();
  const writes = watchWrites();
  const view = renderHook(() => useTripDetail("1"));
  act(() => view.result.current.tabs[1].onSelect());
  expect(view.result.current.activeTab).toBe("summary");
  expect(view.result.current.summary.expenseCount).toBe(1);
  expect(view.result.current.summary.account.readOnly).toBe(true);
  for (const spy of writes) expect(spy).not.toHaveBeenCalled();
});

it("ไม่อ่าน ย้าย หรือลบข้อมูลที่เคยผูกบัญชี backend", () => {
  const accountKey = "aokkorn-user-alice-trips-v1",
    ledgerKey = "aokkorn-user-alice-ledger-1-v1";
  const accountTrips = JSON.stringify([trip]),
    accountLedger = JSON.stringify(ledger);
  window.localStorage.setItem(accountKey, accountTrips);
  window.localStorage.setItem(ledgerKey, accountLedger);
  const writes = watchWrites();
  const view = renderHook(() => ({ trips: useTrips(), ledger: useTripLedger(1) }));
  expect(view.result.current.trips.trips).toEqual([]);
  expect(view.result.current.ledger.ledger.expenses).toEqual([]);
  expect(window.localStorage.getItem(accountKey)).toBe(accountTrips);
  expect(window.localStorage.getItem(ledgerKey)).toBe(accountLedger);
  for (const spy of writes) expect(spy).not.toHaveBeenCalled();
});
