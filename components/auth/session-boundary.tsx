"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { AppBrand } from "@/components/shared/app-brand";
import { Button } from "@/components/ui/button";
import { SessionAccountContext, useSessionBoundary } from "@/lib/hooks/auth/use-session";

/** UI gate ก่อน mount children; API ฝั่ง backend ยังต้องใช้ SessionGuard ของตัวเอง */
export function SessionBoundary({ children }: { children: ReactNode }) {
  const auth = useSessionBoundary();
  if (auth.result.status === "unavailable") {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-5 px-6 text-center">
        <AppBrand />
        <p role="alert">ยังเชื่อมต่อระบบไม่ได้ กรุณาลองอีกครั้ง</p>
        <Button onClick={auth.retry}>ลองอีกครั้ง</Button>
        <Link href="/" className="text-sm underline">
          กลับหน้าแรก
        </Link>
      </main>
    );
  }
  if (auth.result.status !== "authenticated") {
    return (
      <main className="grid min-h-dvh place-items-center" aria-busy="true">
        <p role="status">กำลังตรวจสอบการเข้าสู่ระบบ…</p>
      </main>
    );
  }
  return (
    <SessionAccountContext
      value={{
        session: auth.result.session,
        logout: auth.logout,
        loggingOut: auth.loggingOut,
        logoutError: auth.logoutError,
      }}
    >
      {children}
    </SessionAccountContext>
  );
}
