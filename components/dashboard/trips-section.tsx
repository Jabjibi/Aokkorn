import type { RefObject } from "react";
import { ChevronDown, Plus } from "lucide-react";
import type { TripView } from "@/lib/hooks/dashboard/dashboard-data";
import { TripCard } from "@/components/dashboard/trip-card";

type TripsSectionProps = {
  trips: TripView[];
  tripCount: number;
  maxTrips: number;
  sortLabel: string;
  onToggleSort: () => void;
  onCreateTrip: () => void;
  canCreate: boolean;
  createButtonRef: RefObject<HTMLButtonElement | null>;
};

export function TripsSection({
  trips,
  tripCount,
  maxTrips,
  sortLabel,
  onToggleSort,
  onCreateTrip,
  canCreate,
  createButtonRef,
}: TripsSectionProps) {
  return (
    <section className="mt-8 scroll-mt-28" id="trips" aria-labelledby="trips-title">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[0.7rem] font-bold tracking-[0.14em] text-black/40 uppercase lg:text-xs">
            Your spaces
          </p>
          <h2 id="trips-title" className="mt-1 text-xl font-black tracking-[-0.035em] lg:text-3xl">
            ทริปของฉัน <span className="text-black/35">({tripCount})</span>
          </h2>
        </div>
        <button
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-black/50 transition-colors hover:bg-black/5 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black lg:text-sm"
          type="button"
          onClick={onToggleSort}
          aria-label={`เรียงทริป: ${sortLabel}`}
        >
          {sortLabel} <ChevronDown className="size-4" />
        </button>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {trips.map((trip) => (
          <TripCard trip={trip} key={trip.id} />
        ))}
      </div>

      <button
        ref={createButtonRef}
        type="button"
        className="group mt-4 flex min-h-24 w-full items-center justify-center gap-3 rounded-[1.4rem] border border-dashed border-black/20 bg-white/55 px-5 text-black/55 transition-all hover:border-black/45 hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-45"
        onClick={onCreateTrip}
        disabled={!canCreate}
      >
        <span className="grid size-9 place-items-center rounded-full bg-black/[0.055] transition-transform group-hover:scale-105">
          <Plus className="size-5" />
        </span>
        <span className="text-left">
          <span className="block text-sm font-bold lg:text-base">สร้างทริปใหม่</span>
          <span className="block text-[0.7rem] text-black/40 lg:text-xs">
            ใช้ได้ทั้งทริปและบิลทั่วไป
          </span>
        </span>
        <span className="rounded-full bg-black/[0.055] px-2.5 py-1 text-[0.7rem] font-bold lg:text-xs">
          {tripCount}/{maxTrips}
        </span>
      </button>
      {!canCreate && (
        <p className="mt-2 text-center text-[0.7rem] text-black/45 lg:text-xs">
          คุณมีทริปครบ {maxTrips} ทริปแล้ว
        </p>
      )}
    </section>
  );
}
