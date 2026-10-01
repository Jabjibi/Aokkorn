import { UsersRound } from "lucide-react";

type SplitDetail = {
  totalLabel: string;
  peopleCount: number;
  perPersonLabel: string;
  splitExpenses: { id: number; name: string; shareLabel: string }[];
};

export function TripSplit({ detail }: { detail: SplitDetail }) {
  return (
    <section aria-labelledby="trip-split-title" className="pt-6">
      <h2 id="trip-split-title" className="text-sm font-black tracking-tight sm:text-xl">
        หารค่าใช้จ่าย
      </h2>
      <p className="mt-1 text-xs text-black/50 sm:text-sm">เฉลี่ยเท่ากันตามจำนวนคนในทริป</p>

      <div className="mt-5 rounded-2xl bg-primary p-5 text-primary-foreground">
        <div className="flex items-center gap-2 text-xs font-bold text-black/65 sm:text-sm">
          <UsersRound className="size-4" /> ส่วนแบ่งต่อคน
        </div>
        <strong className="mt-2 block text-sm font-black tracking-tight tabular-nums sm:text-4xl">
          {detail.perPersonLabel}
        </strong>
        <p className="mt-2 text-xs text-black/65 sm:text-sm">
          ยอดรวม {detail.totalLabel} · {detail.peopleCount} คน
        </p>
      </div>

      <h3 className="mt-7 text-sm font-bold sm:text-base">ส่วนแบ่งแต่ละรายการ</h3>
      {detail.splitExpenses.length > 0 ? (
        <ul className="mt-2 divide-y divide-black/8">
          {detail.splitExpenses.map((expense) => (
            <li
              key={expense.id}
              className="flex items-center justify-between gap-4 py-4 text-xs sm:text-sm"
            >
              <span>{expense.name}</span>
              <strong className="text-sm font-bold tabular-nums sm:text-base">
                {expense.shareLabel} / คน
              </strong>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-xl border border-black/8 px-4 py-5 text-xs text-black/50 sm:text-sm">
          ยังไม่มีรายการสำหรับหาร
        </p>
      )}

      {detail.splitExpenses.length > 0 && detail.peopleCount > 1 && (
        <p className="mt-6 rounded-xl bg-[#f4f4f1] px-4 py-4 text-xs text-black/60 sm:text-sm">
          ยังสรุปว่าใครต้องคืนใครไม่ได้ เพราะรายการยังไม่มีข้อมูลผู้จ่าย
        </p>
      )}
    </section>
  );
}
