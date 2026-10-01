import type { ChangeEventHandler, FormEventHandler } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TripExpenseFormProps = {
  dayId: number;
  dayName: string;
  currency: string;
  name: string;
  amount: string;
  error: string;
  onNameChange: ChangeEventHandler<HTMLInputElement>;
  onAmountChange: ChangeEventHandler<HTMLInputElement>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onCancel: () => void;
};

export function TripExpenseForm({
  dayId,
  dayName,
  currency,
  name,
  amount,
  error,
  onNameChange,
  onAmountChange,
  onSubmit,
  onCancel,
}: TripExpenseFormProps) {
  return (
    <form onSubmit={onSubmit} className="border-b border-[#f0f0ed] bg-[#fafaf8] px-4 py-5">
      <h3 className="text-sm font-bold">เพิ่มรายการใน{dayName}</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <div>
          <label
            htmlFor={`expense-name-${dayId}`}
            className="text-[11px] font-semibold text-black/60 sm:text-xs"
          >
            ชื่อรายการ
          </label>
          <Input
            id={`expense-name-${dayId}`}
            value={name}
            onChange={onNameChange}
            maxLength={80}
            placeholder="เช่น ค่ารถ"
            className="mt-1 h-11 rounded-xl bg-white text-xs sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor={`expense-amount-${dayId}`}
            className="text-[11px] font-semibold text-black/60 sm:text-xs"
          >
            จำนวนเงิน ({currency})
          </label>
          <Input
            id={`expense-amount-${dayId}`}
            value={amount}
            onChange={onAmountChange}
            inputMode="decimal"
            placeholder="0"
            className="mt-1 h-11 rounded-xl bg-white text-xs sm:text-sm"
          />
        </div>
      </div>
      {error && (
        <p className="mt-3 text-xs text-red-600 sm:text-sm" role="alert">
          {error}
        </p>
      )}
      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="text-xs sm:text-sm">
          ยกเลิก
        </Button>
        <Button type="submit" className="rounded-xl text-xs font-bold sm:text-sm">
          บันทึกรายการ
        </Button>
      </div>
    </form>
  );
}
