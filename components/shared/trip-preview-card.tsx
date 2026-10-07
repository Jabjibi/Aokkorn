import Image from "next/image";
import { ArrowUpRight, UsersRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type TripPreviewCardProps = {
  image: string;
  imageAlt: string;
  title: string;
  subtitle: string;
  amount: string;
  amountLabel: string;
  className?: string;
};

export function TripPreviewCard({
  image,
  imageAlt,
  title,
  subtitle,
  amount,
  amountLabel,
  className,
}: TripPreviewCardProps) {
  return (
    <Card
      className={cn(
        "gap-0 rounded-[1.75rem] border border-white/40 bg-white/15 p-3 text-white shadow-[0_20px_50px_#001b8060] backdrop-blur-xl",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.15rem] bg-white/10">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 639px) 40vw, 220px"
          className="object-cover"
        />
        <span className="absolute top-2 left-2 rounded-full bg-white px-2.5 py-1 text-[9px] font-bold tracking-wider text-black">
          ทริปตัวอย่าง
        </span>
        <span
          className="absolute right-2 bottom-2 grid size-7 place-items-center rounded-full bg-[var(--landing-lime)] text-black"
          aria-hidden="true"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <div className="px-1 pt-3 pb-1">
        <p className="text-sm font-bold sm:text-base">{title}</p>
        <p className="mt-1 flex items-center gap-1.5 text-[10px] text-white/80 sm:text-xs">
          <UsersRound className="size-3" aria-hidden="true" />
          {subtitle}
        </p>
        <div className="mt-3 flex flex-col items-start justify-between gap-1 border-t border-white/20 pt-3 sm:flex-row sm:items-end sm:gap-2">
          <span className="text-[9px] text-white/80 sm:text-[10px]">{amountLabel}</span>
          <strong className="font-mono text-sm tracking-tight text-[var(--landing-lime)] sm:text-xl">
            {amount}
          </strong>
        </div>
      </div>
    </Card>
  );
}
