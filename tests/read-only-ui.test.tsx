import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { TripDetailShell } from "@/components/trip/trip-detail-shell";
import { SessionAccountContext } from "@/lib/hooks/auth/use-session";
import { seedLegacyTrip } from "./fixtures/legacy-trip";

beforeEach(() => {
  window.localStorage.clear();
  seedLegacyTrip();
});
afterEach(() => cleanup());

it("dashboard แสดงแหล่งข้อมูลเดิมและปิดทุกปุ่มสร้าง โดยยังเรียง/เปิดดูทริปได้", () => {
  render(
    <SessionAccountContext
      value={{
        session: {
          user: { id: "test-user", displayName: "ผู้ทดสอบ" },
          csrfToken: "a".repeat(64),
          expiresAt: "2030-01-01T00:00:00Z",
        },
        logout: vi.fn().mockResolvedValue(undefined),
        loggingOut: false,
        logoutError: "",
      }}
    >
      <DashboardShell />
    </SessionAccountContext>,
  );
  expect(screen.getByRole("note").textContent).toContain("ดูได้อย่างเดียว");
  const createButtons = screen.getAllByRole("button", { name: /สร้างทริป|ทริปใหม่/ });
  expect(createButtons.length).toBeGreaterThanOrEqual(3);
  for (const button of createButtons) expect((button as HTMLButtonElement).disabled).toBe(true);
  expect(screen.queryByText(/คุณมีทริปครบ/)).toBeNull();
  expect(screen.getByRole("link", { name: "ดูรายการในทริปของฉัน" }).getAttribute("href")).toBe(
    "/dashboard/trips/1",
  );
  const sort = screen.getByRole("button", { name: /เรียงทริป/ });
  expect((sort as HTMLButtonElement).disabled).toBe(false);
});

it("หน้าทริปปิดปุ่มแก้ข้อมูลทั้งหมด แต่ยังสลับแท็บและอ่านสรุปได้", () => {
  const writes = [
    vi.spyOn(Storage.prototype, "setItem"),
    vi.spyOn(Storage.prototype, "removeItem"),
    vi.spyOn(Storage.prototype, "clear"),
  ];
  render(<TripDetailShell tripId="1" />);
  expect(screen.getByRole("note").textContent).toContain("ยังไม่ได้บันทึกเข้าบัญชี");
  for (const name of [
    "แชร์เพื่อน",
    "ล้างรายการค่าใช้จ่ายทั้งหมด",
    "เปลี่ยนสกุลเงิน",
    "เพิ่มรายการ",
    "เพิ่มวัน",
    "ลบรายการ อาหาร",
  ]) {
    expect((screen.getByRole("button", { name }) as HTMLButtonElement).disabled).toBe(true);
  }
  fireEvent.click(screen.getByRole("button", { name: "หาร" }));
  expect((screen.getByRole("button", { name: "เพิ่มเพื่อน" }) as HTMLButtonElement).disabled).toBe(
    true,
  );
  expect(
    (screen.getByRole("button", { name: "นำ เพื่อน ออกจากทริป" }) as HTMLButtonElement).disabled,
  ).toBe(true);
  expect(screen.getByText("ยังไม่เปิดการบันทึกบัญชีรับเงิน")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "สรุป" }));
  expect(screen.getByRole("heading", { name: "สรุปค่าใช้จ่าย" })).toBeTruthy();
  for (const spy of writes) expect(spy).not.toHaveBeenCalled();
});
