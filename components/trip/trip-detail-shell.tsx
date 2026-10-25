"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarPlus2,
  CirclePlus,
  Crown,
  ListChecks,
  UserRoundPlus,
  X,
} from "lucide-react";
import { SegmentedTabs } from "@/components/shared/segmented-tabs";
import { TripSplit } from "@/components/trip/trip-split";
import { TripSummary } from "@/components/trip/trip-summary";
import { Button } from "@/components/ui/button";
import { useTripDetail } from "@/lib/hooks/trip/use-trip-detail";

export function TripDetailShell({ tripId }: { tripId: string }) {
  const { status, error, retry, detail, summary, activeTab, tabs } = useTripDetail(tripId);

  if (status === "loading") {
    return (
      <main className="grid min-h-dvh place-items-center" aria-busy="true">
        <p role="status">กำลังโหลดทริป…</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6">
        <p role="alert">{error}</p>
        <Button onClick={retry}>ลองอีกครั้ง</Button>
        <Link href="/dashboard">กลับไปทริปของฉัน</Link>
      </main>
    );
  }

  if (!detail || !summary) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center px-6 text-center">
        <h1 className="text-sm font-black sm:text-2xl">ไม่พบทริปนี้</h1>
        <p className="mt-2 text-xs text-black/50 sm:text-sm">ทริปอาจถูกลบหรือที่อยู่ไม่ถูกต้อง</p>
        <Link
          href="/dashboard#trips"
          className="mt-6 rounded-xl bg-black px-5 py-3 text-xs font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:text-sm"
        >
          กลับไปทริปของฉัน
        </Link>
      </main>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white text-[#11120f]">
      <header className="sticky top-0 z-20 border-b border-[#f0f0ed] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-1.5 px-6 max-[359px]:h-auto max-[359px]:flex-wrap max-[359px]:py-2 sm:h-20 sm:gap-3">
          <Link
            href="/dashboard#trips"
            className="grid size-7 shrink-0 place-items-center rounded-full text-black/60 hover:bg-black/5 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:size-9"
            aria-label="กลับไปทริปของฉัน"
          >
            <ArrowLeft className="size-4 sm:size-5" />
          </Link>
          <h1 className="min-w-0 flex-1 truncate text-sm font-black tracking-[-0.035em] sm:text-2xl">
            {detail.name}
          </h1>
          <div className="flex shrink-0 items-center gap-1 max-[359px]:w-full max-[359px]:justify-end sm:gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled
              aria-label="อัปเกรด ยังไม่เปิดใช้งาน"
              className="h-7 gap-1 rounded-full border-black/15 bg-white px-2 text-[11px] font-bold text-black shadow-none disabled:opacity-100 sm:h-8 sm:px-3 sm:text-sm"
            >
              <Crown className="size-3.5 text-black" /> อัปเกรด
            </Button>
            <Button
              type="button"
              size="sm"
              disabled
              className="h-7 gap-1 rounded-full bg-primary px-2 text-[11px] font-bold text-primary-foreground hover:bg-[#b8ed37] sm:h-8 sm:px-3 sm:text-sm"
            >
              <UserRoundPlus className="size-3.5" /> แชร์เพื่อน
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled
              aria-label="ปิดทริป ยังไม่เปิดใช้งาน"
              className="h-7 rounded-full px-1 text-[11px] font-semibold text-black/45 disabled:opacity-100 sm:h-8 sm:px-2 sm:text-sm"
            >
              ปิดทริป
            </Button>
          </div>
        </div>
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-6 pb-2.5 sm:gap-4 sm:pb-4">
          <div className="min-w-0 flex-1">
            <SegmentedTabs tabs={tabs} activeId={activeTab} label="เมนูทริป" />
          </div>
          {activeTab === "items" && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled
              aria-label="ล้างรายการค่าใช้จ่ายทั้งหมด"
              className="h-8 shrink-0 px-1 text-[11px] font-semibold text-black/45 hover:bg-black/[0.025] hover:text-black disabled:opacity-40 sm:text-sm"
            >
              ล้าง
            </Button>
          )}
        </div>
      </header>

      <main
        className={`mx-auto w-full max-w-5xl flex-1 px-6 ${activeTab === "summary" ? "pb-8" : "pb-36"}`}
      >
        <p role="note" className="my-4 text-xs text-black/50">
          ข้อมูลจากบัญชีของคุณ · ส่วนแก้ไขภายในทริปยังไม่เปิดใช้งาน
        </p>
        {activeTab === "items" && (
          <>
            <section
              aria-label="สกุลเงินหลักของทริป"
              className="mt-5 flex items-center justify-between border-y border-black/10 bg-[#f5f6f7] px-4 py-3 text-sm"
            >
              <span>{detail.currencyLabel}</span>
              <Button variant="outline" size="sm" disabled>
                เปลี่ยนสกุลเงิน
              </Button>
            </section>

            <div className="flex min-h-11 items-center justify-between border-b border-[#f0f0ed] px-4 py-3 text-xs font-bold text-black/45 sm:text-sm">
              <span>รายการ</span>
              <span>ราคา · {detail.currency}</span>
            </div>

            {detail.days.map((day) => (
              <section key={day.id} aria-labelledby={`day-${day.id}`}>
                <div className="flex min-h-14 items-center justify-between border-b border-[#f0f0ed] bg-primary px-4 py-3 text-sm font-bold text-primary-foreground sm:text-base">
                  <h2 id={`day-${day.id}`}>{day.name}</h2>
                  <span className="tabular-nums">{day.totalLabel}</span>
                </div>

                {day.expenses.length > 0 ? (
                  <ul className="border-b border-[#f0f0ed]">
                    {day.expenses.map((expense) => (
                      <li
                        key={expense.id}
                        className="grid min-h-17 grid-cols-[minmax(0,1fr)_6rem_2.5rem] items-stretch border-b border-[#f0f0ed] text-xs last:border-b-0 sm:grid-cols-[minmax(0,1fr)_8rem_2.5rem] sm:text-lg"
                      >
                        <span className="flex min-w-0 items-center px-3 py-4">{expense.name}</span>
                        <span className="flex flex-col items-end justify-center border-l border-[#f0f0ed] px-3 py-4 text-sm font-semibold tabular-nums sm:text-lg">
                          {expense.amountLabel}
                          {expense.convertedLabel && (
                            <small className="text-[11px] font-medium text-black/45 sm:text-xs">
                              {expense.convertedLabel}
                            </small>
                          )}
                        </span>
                        <span className="flex items-center justify-center border-l border-[#f0f0ed]">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            disabled
                            aria-label={`ลบรายการ ${expense.name}`}
                            className="text-black/35 hover:bg-red-50 hover:text-red-600"
                          >
                            <X className="size-4" />
                          </Button>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                    <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
                      <ListChecks className="size-6" />
                    </span>
                    <p className="mt-4 text-sm font-bold sm:text-base">ยังไม่มีรายการค่าใช้จ่าย</p>
                    <p className="mt-1 text-xs text-black/45 sm:text-sm">
                      รายการในทริปนี้จะแสดงที่นี่
                    </p>
                  </div>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  disabled
                  className="flex min-h-16 w-full justify-start rounded-none border-b border-[#f0f0ed] px-4 text-xs font-semibold text-black/55 sm:text-base"
                >
                  <CirclePlus className="size-5" /> เพิ่มรายการ
                </Button>
              </section>
            ))}

            <Button
              type="button"
              variant="ghost"
              disabled
              className="flex min-h-16 w-full rounded-none text-sm font-bold text-black hover:bg-primary/15 sm:text-base"
            >
              <CalendarPlus2 className="size-5" /> เพิ่มวัน
            </Button>
          </>
        )}

        {activeTab === "summary" && <TripSummary summary={summary} />}
        {activeTab === "split" && <TripSplit detail={detail} />}
      </main>

      {activeTab !== "summary" && (
        <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-[#f0f0ed] bg-[#f7f8f6]/95 backdrop-blur-xl">
          <div className="mx-auto max-w-5xl px-6 pt-5 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="flex items-end justify-between gap-4">
              <span className="text-xs font-semibold text-black/50 sm:text-sm">ยอดรวม</span>
              <strong className="text-sm font-black tracking-[-0.04em] tabular-nums sm:text-4xl">
                {detail.totalLabel}
              </strong>
            </div>
            <div className="mt-4 flex justify-between border-t border-[#f0f0ed] pt-3 text-[11px] text-black/45 sm:text-xs">
              <span>{detail.expenseCount} รายการ</span>
              <span>เฉลี่ย {detail.averageLabel} ต่อรายการ</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
