import { Share2, Wallet } from "lucide-react";
import { ReceivingAccountSection } from "@/components/shared/receiving-account-section";
import { PercentageBar } from "@/components/shared/percentage-bar";
import { Button } from "@/components/ui/button";
import type { TripSummaryModel } from "@/lib/hooks/trip/use-trip-summary";

export function TripSummary({ summary }: { summary: TripSummaryModel }) {
  return (
    <section aria-labelledby="trip-summary-title" className="space-y-4 py-5 sm:space-y-5">
      <h2 id="trip-summary-title" className="sr-only">
        สรุปค่าใช้จ่าย
      </h2>

      <div className="rounded-2xl bg-black p-5 text-white sm:p-7">
        <p className="flex items-center gap-2 text-xs font-bold text-primary sm:text-sm">
          <Wallet className="size-4" /> ใช้ไปทั้งหมด
        </p>
        <strong className="mt-2 block text-sm font-black tabular-nums sm:text-4xl">
          {summary.totalLabel}
        </strong>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="min-w-0 rounded-2xl border border-black/10 p-3 sm:p-5">
          <p className="text-[11px] text-black/55 sm:text-sm">รายการ</p>
          <strong className="mt-2 block text-sm font-black tabular-nums sm:text-2xl">
            {summary.expenseCount}
          </strong>
          <p className="mt-1 text-[11px] text-black/45 sm:text-xs">ทั้งหมด</p>
        </div>
        <div className="min-w-0 rounded-2xl border border-black/10 p-3 sm:p-5">
          <p className="text-[11px] text-black/55 sm:text-sm">เฉลี่ย/รายการ</p>
          <strong className="mt-2 block text-sm font-black tabular-nums sm:text-2xl">
            {summary.averageLabel}
          </strong>
        </div>
        <div className="min-w-0 rounded-2xl border border-black/10 p-3 sm:p-5">
          <p className="text-[11px] text-black/55 sm:text-sm">สูงสุด</p>
          <strong className="mt-2 block text-sm font-black tabular-nums sm:text-2xl">
            {summary.highestLabel}
          </strong>
          <p className="mt-1 truncate text-[11px] text-black/45 sm:text-xs">
            {summary.highestName}
          </p>
        </div>
      </div>

      <section
        aria-labelledby="expense-breakdown-title"
        className="rounded-2xl border border-black/10 p-4 sm:p-6"
      >
        <h3 id="expense-breakdown-title" className="text-sm font-bold sm:text-lg">
          รายละเอียด
        </h3>
        <p className="mt-1 text-xs text-black/50 sm:text-sm">
          {summary.expenseCount} รายการ · เรียงจากจ่ายมากไปน้อย
        </p>
        {summary.breakdown.length > 0 ? (
          <ol className="mt-5 space-y-5">
            {summary.breakdown.map((expense, index) => (
              <li key={expense.id}>
                <div className="flex min-w-0 items-baseline gap-2 text-xs sm:text-sm">
                  <span className="w-4 shrink-0 text-black/40">{index + 1}</span>
                  <span className="min-w-0 flex-1 truncate">{expense.name}</span>
                  <strong className="shrink-0 text-sm tabular-nums sm:text-base">
                    {expense.amountLabel}
                  </strong>
                  <span className="shrink-0 text-[11px] text-black/50 sm:text-xs">
                    {expense.percentageLabel}
                  </span>
                </div>
                {expense.sourceLabel && (
                  <p className="mt-1 pl-6 text-[11px] text-black/45 sm:text-xs">
                    ยอดเดิม {expense.sourceLabel}
                  </p>
                )}
                <PercentageBar percentage={expense.percentage} />
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-5 text-xs text-black/45 sm:text-sm">ยังไม่มีรายการค่าใช้จ่าย</p>
        )}
      </section>

      <ReceivingAccountSection account={summary.account} />

      <Button
        type="button"
        onClick={summary.onShare}
        className="h-11 w-full rounded-xl bg-black text-xs font-bold text-white hover:bg-black/85 sm:text-sm"
      >
        <Share2 className="size-4" /> แชร์สรุปทริป
      </Button>
      {summary.shareMessage && (
        <p role="status" className="text-center text-xs text-black/60 sm:text-sm">
          {summary.shareMessage}
        </p>
      )}
    </section>
  );
}
