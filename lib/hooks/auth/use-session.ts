"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { endSession, readSession, type Session, type SessionResult } from "./auth-api";

type SessionAccount = {
  session: Session;
  logout: () => Promise<void>;
  loggingOut: boolean;
  logoutError: string;
};
export const SessionAccountContext = createContext<SessionAccount | null>(null);

/** อ่าน session ที่ boundary ตรวจแล้ว; ไม่มี fetch ซ้ำในแต่ละ component */
export function useSessionAccount(): SessionAccount {
  const account = useContext(SessionAccountContext);
  if (!account) throw new Error("ต้องใช้ useSessionAccount ภายใน SessionBoundary");
  return account;
}

/** I/O + state: ตรวจ me ก่อน mount dashboard; backend ล่มให้ retry, 401 กลับ modal หน้าเดิม */
export function useSessionBoundary() {
  const router = useRouter();
  const [result, setResult] = useState<SessionResult | { status: "loading" }>({
    status: "loading",
  });
  const [attempt, setAttempt] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const logoutPending = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    void readSession(controller.signal).then((next) => {
      if (controller.signal.aborted) return;
      setResult(next);
      if (next.status === "anonymous") router.replace("/?login=required");
    });
    return () => controller.abort();
  }, [router, attempt]);

  function retry() {
    setResult({ status: "loading" });
    setAttempt((value) => value + 1);
  }
  async function logout() {
    if (result.status !== "authenticated" || logoutPending.current) return;
    logoutPending.current = true;
    setLoggingOut(true);
    setLogoutError("");
    const success = await endSession(result.session.csrfToken);
    logoutPending.current = false;
    if (!success) {
      setLoggingOut(false);
      setLogoutError("ออกจากระบบไม่สำเร็จ กรุณาลองอีกครั้ง");
      return;
    }
    // ถอดหน้าจอข้อมูลก่อนนำทาง; ไม่ลบหรือย้ายข้อมูลทริปใน localStorage
    setResult({ status: "anonymous" });
    router.replace("/");
    router.refresh();
  }
  return { result, retry, logout, loggingOut, logoutError };
}
