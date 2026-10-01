import type { Metadata } from "next";
import { TripDetailShell } from "@/components/trip/trip-detail-shell";

export const metadata: Metadata = {
  title: "รายละเอียดทริป — Aokkorn",
  description: "ดูรายการค่าใช้จ่ายและยอดรวมของทริป",
};

export default async function TripDetailPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  return <TripDetailShell tripId={tripId} />;
}
