import { CalendarDays, CircleDollarSign, ListChecks, UsersRound } from "lucide-react";
import type { TripView } from "@/lib/hooks/dashboard/dashboard-data";
import { MetricTile } from "@/components/shared/metric-tile";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const tripToneClass: Record<TripView["tone"], string> = {
  lime: "bg-[#efffc5] text-[#172000]",
  blue: "bg-[#e9efff] text-[#1b3c8c]",
  peach: "bg-[#fff0e3] text-[#8a3e10]",
};

export function TripCard({ trip }: { trip: TripView }) {
  return (
    <Card className="gap-0 rounded-[1.5rem] border-black/8 bg-white p-5 shadow-[0_8px_28px_rgba(0,0,0,0.055)] sm:p-6">
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "grid size-12 shrink-0 place-items-center rounded-2xl text-xl lg:size-14 lg:text-2xl",
            tripToneClass[trip.tone],
          )}
          aria-hidden="true"
        >
          {trip.emoji}
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-base font-black tracking-[-0.025em] lg:text-xl">
                {trip.name}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-[0.7rem] text-black/40 lg:text-xs">
                <CalendarDays className="size-3.5" /> สร้าง {trip.createdAt}
              </p>
            </div>
            <Badge
              className={cn(
                "hidden items-center gap-1.5 border-0 px-2.5 py-1.5 text-xs font-bold sm:inline-flex",
                trip.status === "active"
                  ? "bg-[#efffc5] text-[#4d6800]"
                  : "bg-black/[0.045] text-black/45",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  trip.status === "active" ? "bg-[#77a000]" : "bg-black/30",
                )}
              />
              {trip.status === "active" ? "กำลังใช้งาน" : "ยังไม่เริ่ม"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-[1.3fr_0.85fr_0.85fr] gap-2.5">
        <MetricTile icon={CircleDollarSign} label="ยอดรวม" value={trip.totalLabel} prominent />
        <MetricTile icon={ListChecks} label="รายการ" value={trip.expenseCount} />
        <MetricTile icon={UsersRound} label="คน" value={trip.peopleCount} />
      </div>
    </Card>
  );
}
