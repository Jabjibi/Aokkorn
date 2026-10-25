import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { TripDetailView } from "@/lib/hooks/trip/trip-view";

/** แสดงภาระจริงจาก backend; ไม่คำนวณหารยอดรวมทุกคนซ้ำในหน้าจอ */
export function TripSplit({ detail }: { detail: TripDetailView }) {
  return (
    <section aria-labelledby="trip-split-title" className="space-y-5 py-6">
      <h2 id="trip-split-title" className="text-lg font-bold">
        หารค่าใช้จ่าย
      </h2>
      <Card className="gap-3 p-5 shadow-none">
        <p>ยังไม่จ่าย: {detail.unpaidLabels.join(" · ") || "ไม่มี"}</p>
        <p>จ่ายแล้ว: {detail.paidLabels.join(" · ") || "ไม่มี"}</p>
        <p className="text-xs text-black/50">ยอดตามผู้จ่ายและคนหารของแต่ละรายการ</p>
      </Card>
      <Card className="p-5 shadow-none">
        <h3 className="font-bold">ใครต้องคืนใคร</h3>
        {detail.obligations.length === 0 && (
          <p className="text-sm text-black/50">ยังไม่มีภาระจ่าย</p>
        )}
        <ul className="divide-y divide-black/10">
          {detail.obligations.map((entry) => (
            <li key={entry.id} className="space-y-1 py-3 text-sm">
              <p>
                {entry.debtor} → {entry.creditor} · {entry.amountLabel}
              </p>
              <p className="text-xs text-black/50">
                {entry.expenseName} · {entry.statusLabel}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-xs text-black/50">ยังไม่เปิดการเปลี่ยนสถานะการจ่าย</p>
      </Card>
      <Card className="p-5 shadow-none">
        <h3 className="font-bold">ผู้ร่วมทริป ({detail.participants.length} คน)</h3>
        <ul className="space-y-2 text-sm">
          {detail.participants.map((person) => (
            <li key={person.id}>
              {person.displayName}
              {person.isOwner && " · เจ้าของทริป"}
            </li>
          ))}
        </ul>
        <Button variant="outline" disabled>
          เพิ่มเพื่อน
        </Button>
      </Card>
      <p className="text-xs text-black/50">ยังไม่เปิดการบันทึกบัญชีรับเงิน</p>
    </section>
  );
}
