import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { TripDetailShell } from "@/components/trip/trip-detail-shell";
import { currencies, summary, tripId } from "../fixtures/api-trips";
import { seedLegacyTrip } from "../fixtures/legacy-trip";

const navigation = vi.hoisted(() => ({ replace: vi.fn() }));

vi.mock("next/navigation", () => ({ useRouter: () => navigation }));
const fetcher = vi.fn<typeof fetch>();

function mockReads() {
  fetcher.mockImplementation(async (url) =>
    Response.json(String(url).endsWith("/currencies") ? currencies : summary),
  );
}

beforeEach(() => {
  window.localStorage.clear();
  seedLegacyTrip();
  vi.stubGlobal("fetch", fetcher);
  navigation.replace.mockClear();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  fetcher.mockReset();
});

it("แสดงวันและรายการจริง พร้อมสลับสรุป/ภาระจ่าย โดยไม่เขียนหรืออ่าน storage", async () => {
  mockReads();
  const reads = vi.spyOn(Storage.prototype, "getItem");
  const writes = vi.spyOn(Storage.prototype, "setItem");

  render(<TripDetailShell tripId={tripId} />);
  expect(await screen.findByRole("heading", { name: "ทริปจริง" })).toBeTruthy();
  expect(screen.getByRole("heading", { name: "วันเดินทาง" })).toBeTruthy();
  expect(screen.getByText("อาหาร")).toBeTruthy();
  expect(screen.queryByText(/ข้อมูลเดิมจากเบราว์เซอร์/)).toBeNull();

  for (const name of [
    "เพิ่มวัน",
    "เพิ่มรายการ",
    "เปลี่ยนสกุลเงิน",
    "แชร์เพื่อน",
    "ลบรายการ อาหาร",
  ]) {
    expect((screen.getByRole("button", { name }) as HTMLButtonElement).disabled).toBe(true);
  }

  fireEvent.click(screen.getByRole("button", { name: "สรุป" }));
  expect(screen.getByRole("heading", { name: "สรุปค่าใช้จ่าย" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "หาร" }));
  expect(screen.getByText("เพื่อน → ฉัน · ฿100")).toBeTruthy();
  expect(screen.getByText("ฉัน · เจ้าของทริป")).toBeTruthy();
  expect(screen.getByText("ผู้ร่วมทริป (2 คน)")).toBeTruthy();
  expect(reads).not.toHaveBeenCalled();
  expect(writes).not.toHaveBeenCalled();
});

it("404 คือไม่พบ ส่วน 503 ต้องแสดง retry", async () => {
  fetcher.mockImplementation(async (url) =>
    String(url).endsWith("/currencies")
      ? Response.json(currencies)
      : new Response(null, { status: 404 }),
  );
  const view = render(<TripDetailShell tripId={tripId} />);

  expect(await screen.findByRole("heading", { name: "ไม่พบทริปนี้" })).toBeTruthy();
  view.unmount();
  fetcher.mockResolvedValue(new Response(null, { status: 503 }));
  render(<TripDetailShell tripId={tripId} />);
  expect(await screen.findByRole("alert")).toBeTruthy();
  expect(screen.queryByRole("heading", { name: "ไม่พบทริปนี้" })).toBeNull();
  mockReads();
  fireEvent.click(screen.getByRole("button", { name: "ลองอีกครั้ง" }));
  expect(await screen.findByRole("heading", { name: "ทริปจริง" })).toBeTruthy();
});

it("401 ปิดข้อมูลทริปและกลับหน้า login", async () => {
  fetcher.mockResolvedValue(new Response(null, { status: 401 }));
  render(<TripDetailShell tripId={tripId} />);
  await waitFor(() => expect(navigation.replace).toHaveBeenCalledWith("/?login=required"));
  expect(screen.queryByRole("heading", { name: "ทริปจริง" })).toBeNull();
});

it("response ของทริปก่อนหน้าไม่เขียนทับเมื่อเปลี่ยน route", async () => {
  const pending = Promise.withResolvers<Response>();

  fetcher.mockImplementation(async (url) =>
    String(url).endsWith("/currencies") ? Response.json(currencies) : pending.promise,
  );
  const view = render(<TripDetailShell tripId={tripId} />);

  fetcher.mockResolvedValue(new Response(null, { status: 404 }));
  view.rerender(<TripDetailShell tripId="77777777-7777-4777-8777-777777777777" />);
  expect(await screen.findByRole("heading", { name: "ไม่พบทริปนี้" })).toBeTruthy();
  await act(async () => {
    pending.resolve(Response.json(summary));
  });
  expect(screen.queryByRole("heading", { name: "ทริปจริง" })).toBeNull();
});
