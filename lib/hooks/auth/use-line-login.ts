"use client";

import { useEffect, useRef, useState } from "react";
import { authUrl, readSession } from "./auth-api";

/** UI state + navigation: กดเปิด modal → ตรวจ backend → นำทางไป LINE; ไม่มี token อยู่ใน URL ของแอป */
export function useLineLogin(initialMessage = "") {
  const [open, setOpen] = useState(Boolean(initialMessage));
  const [message, setMessage] = useState(initialMessage);
  const [pending, setPending] = useState(false);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);

  function changeOpen(next: boolean) {
    if (!next) {
      request.current?.abort();
      request.current = null;
      setPending(false);
    }
    setMessage("");
    setOpen(next);
  }
  async function startLogin() {
    if (request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setPending(true);
    setMessage("");
    const result = await readSession(controller.signal);
    if (controller.signal.aborted) return;
    request.current = null;
    if (result.status === "unavailable") {
      setMessage("ยังเชื่อมต่อระบบไม่ได้ กรุณาลองอีกครั้ง");
      setPending(false);
      return;
    }
    // ต้องเป็น navigation เพื่อให้ browser เก็บ flow cookie และไปหน้า LINE ได้
    window.location.assign(
      result.status === "authenticated" ? "/dashboard" : authUrl("line/start"),
    );
  }
  return { open, changeOpen, message, pending, startLogin };
}
