import { UsersRound } from "lucide-react";
import { DonutStat } from "@/components/shared/donut-stat";
import { Card } from "@/components/ui/card";

export function SplitOverviewCard({
  totalLabel,
  peopleCount,
  perPersonLabel,
  splitSharePercent,
  friendCount,
}: {
  totalLabel: string;
  peopleCount: number;
  perPersonLabel: string;
  splitSharePercent: number;
  friendCount: number;
}) {
  return (
    <Card className="gap-0 overflow-hidden rounded-[1.75rem] border-[#e9eae5] bg-[radial-gradient(circle_at_85%_12%,#ebffb6_0%,#ffffff_48%,#f8f9f5_100%)] p-4 shadow-[0_14px_35px_rgba(15,20,7,0.08)] sm:p-7">
      <div className="flex items-center justify-between gap-2 sm:gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-black/55 sm:text-sm">
            <UsersRound className="size-3.5 sm:size-4" aria-hidden="true" /> ส่วนแบ่งต่อคน
          </div>
          <strong className="mt-3 block text-[clamp(1.25rem,5vw,2.75rem)] leading-tight font-black tracking-tight break-all tabular-nums">
            {friendCount > 0 ? perPersonLabel : "—"}
          </strong>
          <p className="mt-2 text-[11px] text-black/50 sm:text-sm">
            {friendCount > 0
              ? `ยอดรวม ${totalLabel} · ${peopleCount} คน`
              : "เพิ่มเพื่อนด้านล่างเพื่อเริ่มหารเงิน"}
          </p>
        </div>
        <DonutStat
          value={friendCount > 0 ? peopleCount : 0}
          label={friendCount > 0 ? "คน" : "เพื่อน"}
          fillPercent={splitSharePercent}
          ariaLabel={
            friendCount > 0
              ? `หารค่าใช้จ่ายเท่ากัน ${peopleCount} คน`
              : "ยังไม่มีเพื่อนร่วมทริปสำหรับหารค่าใช้จ่าย"
          }
        />
      </div>
    </Card>
  );
}
