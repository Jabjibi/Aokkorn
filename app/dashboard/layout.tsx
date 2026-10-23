import type { ReactNode } from "react";
import { SessionBoundary } from "@/components/auth/session-boundary";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <SessionBoundary>{children}</SessionBoundary>;
}
