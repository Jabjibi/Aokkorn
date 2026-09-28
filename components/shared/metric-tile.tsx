import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricTile({
  icon: Icon,
  label,
  value,
  prominent = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  prominent?: boolean;
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-2xl px-3 py-3.5 sm:px-4 sm:py-4",
        prominent ? "bg-[#f0ffd0]" : "bg-[#f6f6f3]",
      )}
    >
      <span className="flex items-center gap-1.5 text-[0.7rem] font-semibold text-black/45 lg:text-xs">
        <Icon className="size-3.5 shrink-0" />
        <span className="truncate">{label}</span>
      </span>
      <strong
        className={cn(
          "mt-1.5 block truncate font-black tracking-[-0.035em]",
          prominent ? "text-lg lg:text-2xl" : "text-lg lg:text-xl",
        )}
      >
        {value}
      </strong>
    </div>
  );
}
