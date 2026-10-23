export type Session = {
  user: { id: string; displayName: string };
  expiresAt: string;
  csrfToken: string;
};
export type SessionResult =
  | { status: "authenticated"; session: Session }
  | { status: "anonymous" }
  | { status: "unavailable" };

/** Pure: config + endpoint → URL; ค่านี้เป็น public origin ไม่มี credentials ของ LINE/DB */
export function authUrl(endpoint: "me" | "logout" | "line/start"): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5016";
  const url = new URL(base);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/"
  ) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL ต้องเป็น origin ของ backend");
  }
  return new URL(`/api/v1/auth/${endpoint}`, url).href;
}

/** Pure: unknown payload → เฉพาะข้อมูล session ที่ UI ใช้; ไม่เชื่อ response shape */
export function parseSession(value: unknown): Session | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Partial<Session>;
  if (
    !data.user ||
    typeof data.user !== "object" ||
    typeof data.user.id !== "string" ||
    !data.user.id ||
    typeof data.user.displayName !== "string" ||
    !data.user.displayName.trim() ||
    typeof data.expiresAt !== "string" ||
    !Number.isFinite(Date.parse(data.expiresAt)) ||
    typeof data.csrfToken !== "string" ||
    !/^[a-f0-9]{64}$/.test(data.csrfToken) ||
    data.csrfToken.length !== 64
  )
    return null;
  return {
    user: { id: data.user.id, displayName: data.user.displayName },
    expiresAt: data.expiresAt,
    csrfToken: data.csrfToken,
  };
}

/** I/O: browser cookie → GET me → แยกไม่มี session ออกจาก backend ล่ม; ไม่อ่าน document.cookie */
export async function readSession(signal?: AbortSignal): Promise<SessionResult> {
  try {
    const deadline = AbortSignal.timeout(8000);
    const requestSignal = signal ? AbortSignal.any([signal, deadline]) : deadline;
    const response = await fetch(authUrl("me"), {
      credentials: "include",
      cache: "no-store",
      redirect: "error",
      signal: requestSignal,
    });
    if (response.status === 401) return { status: "anonymous" };
    if (!response.ok) return { status: "unavailable" };
    const session = parseSession(await response.json());
    return session ? { status: "authenticated", session } : { status: "unavailable" };
  } catch {
    return { status: "unavailable" };
  }
}

/** I/O: CSRF จาก me + HttpOnly cookie → POST logout; 401 หมายถึง session ใช้ไม่ได้แล้ว */
export async function endSession(csrfToken: string): Promise<boolean> {
  try {
    const response = await fetch(authUrl("logout"), {
      method: "POST",
      credentials: "include",
      redirect: "error",
      signal: AbortSignal.timeout(8000),
      headers: { "X-CSRF-Token": csrfToken },
    });
    return response.status === 204 || response.status === 401;
  } catch {
    return false;
  }
}
