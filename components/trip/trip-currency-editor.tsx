import type { ChangeEvent, FormEvent } from "react";
import { ChevronRight } from "lucide-react";
import { FormSelect } from "@/components/shared/form-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Currency } from "@/lib/hooks/dashboard/dashboard-data";

type CurrencyEditor = {
  open: boolean;
  current: Currency;
  selected: Currency;
  options: readonly { value: Currency; label: string }[];
  canSave: boolean;
  previewLabel: string | null;
  error: string;
  rateFields: {
    source: Currency;
    target: Currency;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  }[];
  onClose: () => void;
  onToggle: () => void;
  onSelect: (event: ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function TripCurrencyEditor({
  currencyLabel,
  editor,
}: {
  currencyLabel: string;
  editor: CurrencyEditor;
}) {
  return (
    <section
      aria-label="สกุลเงินหลักของทริป"
      className="mt-5 border-y border-[#f0f0ed] bg-[#f5f6f7] sm:border-x"
    >
      <div className="flex min-h-14 items-center justify-between gap-2 px-4 py-3 text-xs sm:text-sm">
        <span className="min-w-0 font-medium text-black/65">{currencyLabel}</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={editor.onToggle}
          aria-expanded={editor.open}
          aria-controls="trip-currency-editor"
          className="h-8 gap-1 rounded-full border-black/15 bg-white px-2 text-[11px] font-bold text-black shadow-none hover:border-black/30 hover:bg-white sm:px-3 sm:text-xs"
        >
          เปลี่ยนสกุลเงิน <ChevronRight className="size-3.5" />
        </Button>
      </div>

      {editor.open && (
        <form
          id="trip-currency-editor"
          onSubmit={editor.onSubmit}
          className="border-t border-[#f0f0ed] bg-white px-4 py-4"
        >
          <label htmlFor="trip-base-currency" className="text-xs font-semibold sm:text-sm">
            เลือกสกุลเงินหลักใหม่
          </label>
          <FormSelect
            id="trip-base-currency"
            className="mt-2"
            value={editor.selected}
            onChange={editor.onSelect}
            options={editor.options}
          />
          {editor.rateFields.length > 0 && (
            <div className="mt-4 space-y-3">
              <p className="text-xs leading-5 text-black/60">
                กรอกอัตราที่ต้องการใช้ ยอดเดิมของแต่ละรายการจะยังอยู่ในสกุลเงินต้นทาง
              </p>
              {editor.rateFields.map((rate) => (
                <div key={rate.source}>
                  <label
                    htmlFor={`trip-currency-rate-${rate.source}`}
                    className="text-xs font-semibold sm:text-sm"
                  >
                    1 {rate.source} = กี่ {rate.target}
                  </label>
                  <Input
                    id={`trip-currency-rate-${rate.source}`}
                    inputMode="decimal"
                    maxLength={32}
                    value={rate.value}
                    onChange={rate.onChange}
                    placeholder="เช่น 0.23"
                    className="mt-2 h-11 bg-white text-xs sm:text-sm"
                  />
                </div>
              ))}
            </div>
          )}
          {editor.previewLabel && (
            <p className="mt-4 text-xs font-semibold text-black/70 sm:text-sm">
              ยอดรวมหลังเปลี่ยน: <strong className="text-black">{editor.previewLabel}</strong>
            </p>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={editor.onClose}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={!editor.canSave} className="bg-primary text-black">
              บันทึก
            </Button>
          </div>
          {editor.error && (
            <p role="alert" className="mt-3 text-xs font-semibold text-red-600">
              {editor.error}
            </p>
          )}
        </form>
      )}
    </section>
  );
}
