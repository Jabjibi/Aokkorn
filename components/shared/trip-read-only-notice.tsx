import { Card } from "@/components/ui/card";

/** UI อย่างเดียว: ระบุแหล่งข้อมูลเดิม ไม่แสดงเสมือนว่าบันทึกเข้าบัญชีแล้ว */
export function TripReadOnlyNotice({ message }: { message: string }) {
  return (
    <Card
      className="mb-5 gap-1 border-amber-200 bg-amber-50 p-4 text-amber-950 shadow-none"
      role="note"
    >
      <p className="text-sm font-bold">ข้อมูลเดิมจากเบราว์เซอร์ · ดูได้อย่างเดียว</p>
      <p className="text-xs leading-6 sm:text-sm">{message}</p>
      <p className="text-xs text-amber-800">ข้อมูลนี้ยังไม่ได้บันทึกเข้าบัญชีของคุณ</p>
    </Card>
  );
}
