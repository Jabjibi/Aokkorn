import type { ChangeEventHandler, FormEvent, MouseEvent, RefObject } from "react";
import { MapPin, Plus } from "lucide-react";
import { currencyOptions, type Currency } from "@/lib/hooks/dashboard/dashboard-data";
import { AppDialog } from "@/components/shared/app-dialog";
import { FormSelect } from "@/components/shared/form-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CreateTripDialogProps = {
  name: string;
  currency: Currency;
  error: string;
  tripCount: number;
  maxTrips: number;
  inputRef: RefObject<HTMLInputElement | null>;
  dialogRef: RefObject<HTMLElement | null>;
  titleId: string;
  descriptionId: string;
  errorId: string;
  onNameChange: ChangeEventHandler<HTMLInputElement>;
  onCurrencyChange: ChangeEventHandler<HTMLSelectElement>;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBackdropMouseDown: (event: MouseEvent<HTMLDivElement>) => void;
};

export function CreateTripDialog({
  name,
  currency,
  error,
  tripCount,
  maxTrips,
  inputRef,
  dialogRef,
  titleId,
  descriptionId,
  errorId,
  onNameChange,
  onCurrencyChange,
  onClose,
  onSubmit,
  onBackdropMouseDown,
}: CreateTripDialogProps) {
  return (
    <AppDialog
      titleId={titleId}
      descriptionId={descriptionId}
      dialogRef={dialogRef}
      icon={<MapPin className="size-5" />}
      title="สร้างทริปใหม่"
      description="ใช้พื้นที่เดียวกันได้ทั้งทริปเที่ยว มื้ออาหาร หรือบิลที่อยากหารกับเพื่อน"
      onClose={onClose}
      onBackdropMouseDown={onBackdropMouseDown}
    >
      <form className="mt-6" onSubmit={onSubmit}>
        <label className="text-xs font-bold lg:text-sm" htmlFor="trip-name">
          ชื่อทริปหรือบิล
        </label>
        <Input
          ref={inputRef}
          id="trip-name"
          value={name}
          onChange={onNameChange}
          placeholder="เช่น เชียงใหม่หน้าหนาว"
          maxLength={80}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="mt-2 h-12 rounded-xl border-black/12 bg-[#f8f8f5] px-4 text-xs shadow-none focus-visible:border-black focus-visible:ring-[#cfff47]/45 lg:text-sm"
        />

        <label className="mt-5 block text-xs font-bold lg:text-sm" htmlFor="trip-currency">
          สกุลเงินหลัก
        </label>
        <FormSelect
          id="trip-currency"
          className="mt-2"
          value={currency}
          onChange={onCurrencyChange}
          options={currencyOptions}
        />

        {error && (
          <p
            id={errorId}
            className="mt-3 text-xs font-semibold text-red-600 lg:text-sm"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="mt-7 flex items-center justify-between gap-4 border-t border-black/8 pt-5">
          <p className="text-[0.7rem] font-semibold text-black/38 lg:text-xs">
            ใช้ไปแล้ว {tripCount} จาก {maxTrips} ทริป
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              className="h-11 rounded-xl px-4 text-xs hover:bg-black/5 lg:text-sm"
              onClick={onClose}
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              className="h-11 rounded-xl bg-black px-5 text-xs font-bold text-white hover:bg-black/80 lg:text-sm"
            >
              <Plus /> สร้างทริป
            </Button>
          </div>
        </div>
      </form>
    </AppDialog>
  );
}
