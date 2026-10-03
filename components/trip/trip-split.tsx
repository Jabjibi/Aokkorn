import { ParticipantsCard, type ParticipantsCardForm } from "@/components/shared/participants-card";
import { ReceivingAccountSection } from "@/components/shared/receiving-account-section";
import { SplitOverviewCard } from "@/components/shared/split-overview-card";
import type { TripSummaryModel } from "@/lib/hooks/trip/use-trip-summary";

type SplitDetail = {
  totalLabel: string;
  peopleCount: number;
  perPersonLabel: string;
  splitSharePercent: number;
  participants: { id: number; name: string; onRemove: () => void }[];
};

export function TripSplit({
  detail,
  friendForm,
  summary,
}: {
  detail: SplitDetail;
  friendForm: ParticipantsCardForm;
  summary: TripSummaryModel;
}) {
  return (
    <section aria-labelledby="trip-split-title" className="pt-6">
      <h2 id="trip-split-title" className="sr-only">
        หารค่าใช้จ่าย
      </h2>
      <SplitOverviewCard
        totalLabel={detail.totalLabel}
        peopleCount={detail.peopleCount}
        perPersonLabel={detail.perPersonLabel}
        splitSharePercent={detail.splitSharePercent}
        friendCount={detail.participants.length}
      />
      <div className="mt-5">
        <ReceivingAccountSection account={summary.account} />
      </div>
      <ParticipantsCard participants={detail.participants} friendForm={friendForm} />
    </section>
  );
}
