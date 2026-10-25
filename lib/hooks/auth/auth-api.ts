import { apiUrl } from "@/lib/hooks/api-client";

export type Session = {
  user: {
    id: string;
    displayName: string;
  };
  expiresAt: string;
  csrfToken: string;
};

export type SessionResult =
  | {
      status: "authenticated";
      session: Session;
    }
  | { status: "anonymous" }
  | { status: "unavailable" };

export function authUrl(endpoint: "me" | "logout" | "line/start"): string {
  return apiUrl(`auth/${endpoint}`);
}

export function parseSession(value: unknown): Session | null {
  if (!value || typeof value !== "object") {
    return null;
  }

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
  ) {
    return null;
  }

  return {
    user: { id: data.user.id, displayName: data.user.displayName },
    expiresAt: data.expiresAt,
    csrfToken: data.csrfToken,
  };
}

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

    if (response.status === 401) {
      return { status: "anonymous" };
    }

    if (!response.ok) {
      return { status: "unavailable" };
    }

    const session = parseSession(await response.json());

    return session ? { status: "authenticated", session } : { status: "unavailable" };
  } catch {
    return { status: "unavailable" };
  }
}

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
