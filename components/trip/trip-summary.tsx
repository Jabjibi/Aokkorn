import { Building2, Landmark, Share2, Smartphone, Wallet } from "lucide-react";
import { CheckboxField } from "@/components/shared/checkbox-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TripSummaryModel } from "@/lib/hooks/trip/use-trip-summary";

const accountInputClassName =
  "mt-1 h-10 rounded-xl text-xs focus-visible:border-black/25 focus-visible:ring-0 focus-visible:ring-transparent sm:text-sm";

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
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/5">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: expense.progressWidth }}
                  />
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-5 text-xs text-black/45 sm:text-sm">ยังไม่มีรายการค่าใช้จ่าย</p>
        )}
      </section>

      <section
        aria-labelledby="receiving-account-title"
        className="rounded-2xl border border-black/10 p-4 sm:p-6"
      >
        <h3
          id="receiving-account-title"
          className="flex items-center gap-2 text-sm font-bold sm:text-lg"
        >
          <Landmark className="size-4 sm:size-5" /> บัญชีรับเงิน
        </h3>
        <p className="mt-1 text-xs text-black/50 sm:text-sm">
          เพิ่มช่องทางรับเงินไว้ใช้เมื่อส่งสรุปให้เพื่อน
        </p>

        <form onSubmit={summary.account.onSubmit} className="mt-4 space-y-3">
          <div>
            <label htmlFor="summary-account-name" className="text-[11px] font-semibold sm:text-xs">
              ชื่อบัญชี
            </label>
            <Input
              id="summary-account-name"
              value={summary.account.name}
              onChange={summary.account.onNameChange}
              maxLength={100}
              placeholder="ชื่อบัญชี"
              className={accountInputClassName}
            />
          </div>

          <fieldset>
            <legend className="mb-1 text-[11px] font-semibold sm:text-xs">ช่องทางรับเงิน</legend>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                aria-pressed={summary.account.method === "promptpay"}
                onClick={summary.account.onSelectPromptPay}
                className={`h-9 rounded-xl text-xs sm:text-sm ${summary.account.method === "promptpay" ? "border-black bg-primary text-black" : "border-black/10 bg-white text-black/50"}`}
              >
                <Smartphone className="size-4" /> พร้อมเพย์
              </Button>
              <Button
                type="button"
                variant="outline"
                aria-pressed={summary.account.method === "bank"}
                onClick={summary.account.onSelectBank}
                className={`h-9 rounded-xl text-xs sm:text-sm ${summary.account.method === "bank" ? "border-black bg-primary text-black" : "border-black/10 bg-white text-black/50"}`}
              >
                <Building2 className="size-4" /> ธนาคาร
              </Button>
            </div>
          </fieldset>

          {summary.account.method === "bank" && (
            <div>
              <label htmlFor="summary-bank-name" className="text-[11px] font-semibold sm:text-xs">
                ชื่อธนาคาร
              </label>
              <Input
                id="summary-bank-name"
                value={summary.account.bankName}
                onChange={summary.account.onBankNameChange}
                maxLength={100}
                placeholder="ชื่อธนาคาร"
                className={accountInputClassName}
              />
            </div>
          )}

          <div>
            <label
              htmlFor="summary-account-number"
              className="text-[11px] font-semibold sm:text-xs"
            >
              {summary.account.method === "promptpay" ? "เลขพร้อมเพย์" : "เลขบัญชีธนาคาร"}
            </label>
            <Input
              id="summary-account-number"
              value={summary.account.number}
              onChange={summary.account.onNumberChange}
              inputMode="numeric"
              maxLength={20}
              placeholder={
                summary.account.method === "promptpay"
                  ? "เบอร์โทรศัพท์หรือเลขบัตรประชาชน"
                  : "เลขบัญชีธนาคาร"
              }
              className={accountInputClassName}
            />
          </div>

          <CheckboxField
            id="summary-account-remember"
            label="บันทึกไว้สำหรับครั้งต่อไปในเบราว์เซอร์นี้"
            checked={summary.account.remember}
            onChange={summary.account.onRememberChange}
          />
          <Button
            type="submit"
            disabled={!summary.account.valid}
            className="h-10 w-full rounded-xl bg-black text-xs font-bold text-white hover:bg-black/85 sm:text-sm"
          >
            บันทึก
          </Button>
          {summary.account.message && (
            <p role="status" className="text-xs text-black/60 sm:text-sm">
              {summary.account.message}
            </p>
          )}
        </form>
      </section>

      <Button
        type="button"
        onClick={summary.onShare}
        className="h-11 w-full rounded-xl bg-primary text-xs font-bold text-primary-foreground hover:bg-[#b8ed37] sm:text-sm"
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
