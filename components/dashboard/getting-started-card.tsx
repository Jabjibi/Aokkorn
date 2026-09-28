import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GettingStartedCard({
  onCreateTrip,
  canCreate,
}: {
  onCreateTrip: () => void;
  canCreate: boolean;
}) {
  return (
    <section className="mt-5 grid overflow-hidden rounded-[1.5rem] border border-black/8 bg-white shadow-[0_8px_28px_rgba(0,0,0,0.055)] lg:grid-cols-[1fr_auto] lg:items-center">
      <div className="flex items-start gap-4 px-5 py-5 sm:px-7">
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#efffc5] text-black lg:size-11">
          <Sparkles className="size-5" />
        </span>
        <div>
          <h2 className="text-sm font-black tracking-[-0.02em] lg:text-base">
            เริ่มง่ายในทริปแรกของคุณ
          </h2>
          <p className="mt-1 text-xs leading-5 text-black/45 lg:text-sm lg:leading-6">
            ตั้งชื่อทริป เลือกสกุลเงินหลัก แล้วเพิ่มเพื่อนด้วยชื่อเล่นได้ทันที
          </p>
          <div className="mt-3 hidden flex-wrap gap-2 text-xs font-semibold text-black/50 sm:flex">
            {["สร้างทริป", "เพิ่มเพื่อน", "จดค่าใช้จ่าย"].map((label) => (
              <span
                className="flex items-center gap-1.5 rounded-full bg-black/[0.035] px-2.5 py-1.5"
                key={label}
              >
                <Check className="size-3.5" /> {label}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-black/7 px-5 py-4 lg:border-t-0 lg:border-l lg:px-7">
        <Button
          className="h-11 w-full rounded-xl bg-black px-5 text-xs font-bold text-white hover:bg-black/80 lg:w-auto lg:text-sm"
          onClick={onCreateTrip}
          disabled={!canCreate}
        >
          เริ่มสร้างทริป <ArrowRight />
        </Button>
      </div>
    </section>
  );
}
