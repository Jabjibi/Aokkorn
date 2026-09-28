import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: "ทริปของฉัน — Aokkorn",
  description: "จัดการทริป บันทึกค่าใช้จ่าย และดูยอดที่ต้องหารใน Aokkorn",
};

export default function DashboardPage() {
  return <DashboardShell />;
}
