import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import type { FormEvent, ReactNode } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SessionAccountContext } from "@/lib/hooks/auth/use-session";
import { useDashboard } from "@/lib/hooks/dashboard/use-dashboard";
import { account, apiTrip, currencies, tripDetail, tripId, tripList } from "../fixtures/api-trips";
import { seedLegacyTrip } from "../fixtures/legacy-trip";

const navigation = vi.hoisted(() => ({ replace: vi.fn(), push: vi.fn() }));

vi.mock("next/navigation", () => ({ useRouter: () => navigation }));
const fetcher = vi.fn<typeof fetch>();

function wrapper({ children }: { children: ReactNode }) {
  return <SessionAccountContext value={account}>{children}</SessionAccountContext>;
}

function formEvent() {
  return { preventDefault: vi.fn() } as unknown as FormEvent<HTMLFormElement>;
}

function mockReads(list = tripList) {
  fetcher.mockImplementation(async (url, options) => {
    if (options?.method === "POST") {
      return Response.json(tripDetail, { status: 201 });
    }

    return Response.json(String(url).endsWith("/currencies") ? currencies : list);
  });
}

beforeEach(() => {
  window.localStorage.clear();
  seedLegacyTrip();
  vi.stubGlobal("fetch", fetcher);
  navigation.replace.mockClear();
  navigation.push.mockClear();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  fetcher.mockReset();
});

it("ใช้รายการ NestJS ไม่อ่านทริปเก่าจากเครื่อง และไม่เขียน storage", async () => {
  mockReads();
  const reads = vi.spyOn(Storage.prototype, "getItem");
  const writes = vi.spyOn(Storage.prototype, "setItem");

  render(<DashboardShell />, { wrapper });
  const link = await screen.findByRole("link", { name: "ดูรายการในทริปจริง" });

  expect(link.getAttribute("href")).toBe(`/dashboard/trips/${tripId}`);
  expect(screen.queryByText("ทริปของฉัน", { selector: "h3" })).toBeNull();
  expect(reads).not.toHaveBeenCalled();
  expect(writes).not.toHaveBeenCalled();
});

it("รอ POST ยืนยันก่อนนำทางและกันส่งซ้ำ รวมถึงการเรียก handler โดยตรง", async () => {
  mockReads();
  const pending = Promise.withResolvers<Response>();
  const view = renderHook(() => useDashboard(), { wrapper });

  await waitFor(() => expect(view.result.current.canCreate).toBe(true));
  act(() => view.result.current.openCreateTrip());
  act(() => view.result.current.onNameChange({ target: { value: " ทริปใหม่ " } } as never));
  fetcher.mockImplementation(async (url, options) =>
    options?.method === "POST"
      ? pending.promise
      : Response.json(String(url).endsWith("/currencies") ? currencies : tripList),
  );
  let saving!: Promise<void>;

  act(() => {
    saving = view.result.current.submitCreateTrip(formEvent());
    void view.result.current.submitCreateTrip(formEvent());
  });
  expect(view.result.current.saving).toBe(true);
  expect(navigation.push).not.toHaveBeenCalled();
  expect(fetcher.mock.calls.filter(([, options]) => options?.method === "POST")).toHaveLength(1);
  await act(async () => {
    pending.resolve(Response.json(tripDetail, { status: 201 }));
    await saving;
  });
  expect(navigation.push).toHaveBeenCalledWith(`/dashboard/trips/${tripId}`);
});

it("ฟอร์มสร้างใช้สกุลเงินจาก backend และแสดงสถานะกำลังบันทึก", async () => {
  mockReads();
  render(<DashboardShell />, { wrapper });
  await screen.findByRole("link", { name: "ดูรายการในทริปจริง" });
  fireEvent.click(screen.getAllByRole("button", { name: /สร้างทริปใหม่/ })[0]);
  const dialog = screen.getByRole("dialog");

  expect(within(dialog).getAllByRole("option")).toHaveLength(currencies.length);
  fireEvent.change(within(dialog).getByLabelText("ชื่อทริปหรือบิล"), {
    target: { value: "ทริปใหม่" },
  });
  const pending = Promise.withResolvers<Response>();

  fetcher.mockReturnValue(pending.promise);
  fireEvent.click(within(dialog).getByRole("button", { name: "สร้างทริป" }));
  expect(
    (within(dialog).getByRole("button", { name: "กำลังบันทึก…" }) as HTMLButtonElement).disabled,
  ).toBe(true);
  await act(async () => {
    pending.resolve(Response.json(tripDetail, { status: 201 }));
  });
});

it("request สร้างขาดการตอบกลับ ไม่แสดงสำเร็จและต้องตรวจรายการก่อนส่งซ้ำ", async () => {
  mockReads();
  const view = renderHook(() => useDashboard(), { wrapper });

  await waitFor(() => expect(view.result.current.canCreate).toBe(true));
  act(() => {
    view.result.current.openCreateTrip();
    view.result.current.onNameChange({ target: { value: "ทริปใหม่" } } as never);
  });
  fetcher.mockRejectedValue(new TypeError("Network failed"));
  await act(async () => {
    await view.result.current.submitCreateTrip(formEvent());
  });
  expect(view.result.current.uncertain).toBe(true);
  expect(view.result.current.canSubmit).toBe(false);
  expect(view.result.current.error).toContain("ยังยืนยันผลการบันทึกไม่ได้");
  expect(navigation.push).not.toHaveBeenCalled();
  mockReads();
  act(() => {
    view.result.current.closeCreateTrip();
    view.result.current.retry();
  });
  await waitFor(() => expect(view.result.current.canCreate).toBe(true));
});

it("backend ล่มแสดง retry ไม่สวมข้อมูล local หรือแสดง empty state", async () => {
  fetcher.mockResolvedValue(new Response(null, { status: 503 }));
  render(<DashboardShell />, { wrapper });
  expect(await screen.findByRole("alert")).toBeTruthy();
  expect(screen.queryByRole("link", { name: /ดูรายการใน/ })).toBeNull();
  expect(screen.queryByText("ยังไม่มีทริป เริ่มสร้างทริปแรกได้เลย")).toBeNull();
  mockReads();
  fireEvent.click(screen.getByRole("button", { name: "โหลดรายการใหม่" }));
  expect(await screen.findByRole("link", { name: "ดูรายการในทริปจริง" })).toBeTruthy();
});

it("session หมดอายุระหว่างโหลดพากลับ login", async () => {
  fetcher.mockResolvedValue(new Response(null, { status: 401 }));
  render(<DashboardShell />, { wrapper });
  await waitFor(() => expect(navigation.replace).toHaveBeenCalledWith("/?login=required"));
  expect(screen.queryByRole("link", { name: /ดูรายการใน/ })).toBeNull();
});

it("โควตาเต็มจาก backend ปิดสร้าง แต่ยังอ่านรายการได้", async () => {
  const items = Array.from({ length: 5 }, (_, i) => ({
    ...apiTrip,
    id: `11111111-1111-4111-8111-11111111111${i}`,
  }));

  mockReads({ ...tripList, items, quota: { used: 5, limit: 5, remaining: 0 } });
  const view = renderHook(() => useDashboard(), { wrapper });

  await waitFor(() => expect(view.result.current.trips).toHaveLength(5));
  expect(view.result.current.canCreate).toBe(false);
  expect(view.result.current.createDisabledMessage).toContain("ครบจำนวน");
});

it("ไม่รวมยอดต่างสกุลเข้ากับ THB และเรียงจาก updatedAt จริง", async () => {
  const second = {
    ...apiTrip,
    id: "77777777-7777-4777-8777-777777777777",
    updatedAt: "2026-10-25T00:00:00Z",
    total: { minor: "1000", currency: "JPY" },
    baseCurrency: "JPY",
  };

  mockReads({
    ...tripList,
    items: [apiTrip, second],
    quota: { used: 2, limit: 5, remaining: 3 },
    totalsByCurrency: [apiTrip.total, second.total],
  });
  const view = renderHook(() => useDashboard(), { wrapper });

  await waitFor(() => expect(view.result.current.trips).toHaveLength(2));
  expect(view.result.current.trips[0].id).toBe(second.id);
  expect(view.result.current.totalLabel).toContain("฿200");
  expect(view.result.current.totalLabel).toContain("1,000");
  act(() => view.result.current.toggleSort());
  expect(view.result.current.trips[0].id).toBe(apiTrip.id);
});

it("ออกจากหน้าระหว่างสร้างแล้วไม่ตามผลไปนำทางภายหลัง", async () => {
  mockReads();
  const view = renderHook(() => useDashboard(), { wrapper });

  await waitFor(() => expect(view.result.current.canCreate).toBe(true));
  act(() => view.result.current.onNameChange({ target: { value: "ทริปใหม่" } } as never));
  const pending = Promise.withResolvers<Response>();

  fetcher.mockReturnValue(pending.promise);
  let request!: Promise<void>;

  act(() => {
    request = view.result.current.submitCreateTrip(formEvent());
  });
  view.unmount();
  await act(async () => {
    pending.resolve(Response.json(tripDetail, { status: 201 }));
    await request;
  });
  expect(navigation.push).not.toHaveBeenCalled();
});
