export function apiUrl(path: string): string {
  const origin = new URL(process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5016");

  if (
    !["http:", "https:"].includes(origin.protocol) ||
    origin.username ||
    origin.password ||
    origin.search ||
    origin.hash ||
    origin.pathname !== "/"
  ) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL ต้องเป็น origin ของ backend");
  }

  return new URL(`/api/v1/${path}`, origin).href;
}

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly code = "",
  ) {
    super("API request failed");
  }
}

export async function requestApi(
  path: string,
  options: {
    signal?: AbortSignal;
    body?: unknown;
    csrfToken?: string;
  } = {},
): Promise<unknown> {
  const timeout = AbortSignal.timeout(8000);
  const signal = options.signal ? AbortSignal.any([options.signal, timeout]) : timeout;
  let response: Response;

  try {
    response = await fetch(apiUrl(path), {
      method: options.body === undefined ? "GET" : "POST",
      credentials: "include",
      cache: "no-store",
      redirect: "error",
      signal,
      headers:
        options.body === undefined
          ? undefined
          : {
              "Content-Type": "application/json",
              "X-CSRF-Token": options.csrfToken ?? "",
            },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiRequestError(0);
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const code =
      payload &&
      typeof payload === "object" &&
      "errorCode" in payload &&
      typeof payload.errorCode === "string"
        ? payload.errorCode
        : "";

    throw new ApiRequestError(response.status, code);
  }

  return payload;
}

export function apiErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    if (error.status === 401) {
      return "กรุณาเข้าสู่ระบบอีกครั้ง";
    }

    if (error.code === "AOK-2101") {
      return "คุณมีทริปครบแล้ว กรุณาตรวจสอบรายการทริป";
    }

    if (error.status === 403) {
      return "ยืนยันคำขอไม่สำเร็จ กรุณารีเฟรชหน้าแล้วลองอีกครั้ง";
    }

    if (error.status === 400) {
      return "ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบแล้วลองอีกครั้ง";
    }
  }

  return "โหลดข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง";
}
