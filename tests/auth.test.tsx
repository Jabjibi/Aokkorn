import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { authUrl, endSession, parseSession, readSession } from "@/lib/hooks/auth/auth-api";
import { loginMessage } from "@/lib/hooks/auth/login-message";
import { useSessionAccount } from "@/lib/hooks/auth/use-session";
import { SessionBoundary } from "@/components/auth/session-boundary";
import { LineLoginEntry } from "@/components/auth/line-login-entry";

const navigation = vi.hoisted(() => ({ replace: vi.fn(), refresh: vi.fn() }));

vi.mock("next/navigation", () => ({ useRouter: () => navigation }));
const session = {
  user: { id: "user-1", displayName: "ผู้ทดสอบ" },
  expiresAt: "2030-01-01T00:00:00.000Z",
  csrfToken: "a".repeat(64),
};
let fetcher: ReturnType<typeof vi.fn<typeof fetch>>;

beforeEach(() => {
  fetcher = vi.fn<typeof fetch>();
  vi.stubGlobal("fetch", fetcher);
  vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "http://localhost:5016");
  navigation.replace.mockClear();
  navigation.refresh.mockClear();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("auth API boundary", () => {
  it("URL ใช้ public backend origin; ปฏิเสธ credentials/path/query ใน config", () => {
    expect(authUrl("line/start")).toBe("http://localhost:5016/api/v1/auth/line/start");

    for (const value of [
      "http://u:secret@localhost:5016",
      "http://localhost:5016/wrong",
      "http://localhost:5016?key=secret",
      "javascript:alert(1)",
    ]) {
      vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", value);
      expect(() => authUrl("me")).toThrow();
    }
  });
  it("pure parser คัดเฉพาะข้อมูลที่ UI ใช้ และปฏิเสธ malformed session", () => {
    expect(
      parseSession({
        ...session,
        rawToken: "private",
        user: { ...session.user, lineSubject: "private" },
      }),
    ).toEqual(session);

    for (const value of [
      null,
      [],
      {},
      { ...session, expiresAt: "bad-date" },
      { ...session, csrfToken: "a".repeat(64) + "\n" },
      { ...session, user: { id: "", displayName: "" } },
    ]) {
      expect(parseSession(value)).toBeNull();
    }

    expect(loginMessage("private-provider-message")).toBe("");
  });
  it("ส่ง cookie โดยไม่ cache และไม่เก็บ tokens ใน localStorage", async () => {
    const storage = vi.spyOn(Storage.prototype, "setItem");

    fetcher.mockResolvedValue(Response.json(session));
    expect(await readSession()).toEqual({ status: "authenticated", session });
    expect(fetcher).toHaveBeenCalledWith(
      "http://localhost:5016/api/v1/auth/me",
      expect.objectContaining({
        credentials: "include",
        cache: "no-store",
        redirect: "error",
        signal: expect.any(AbortSignal),
      }),
    );
    expect(storage).not.toHaveBeenCalled();
  });
  it.each([401, 503])("แยก HTTP %i เป็นสถานะที่ถูกต้อง", async (status) => {
    fetcher.mockResolvedValue(new Response(null, { status }));
    expect(await readSession()).toEqual({ status: status === 401 ? "anonymous" : "unavailable" });
  });
  it("network error และ payload ผิดไม่ถูกมองว่าเข้าสู่ระบบแล้ว", async () => {
    fetcher.mockRejectedValueOnce(new Error("network detail"));
    expect(await readSession()).toEqual({ status: "unavailable" });
    fetcher.mockResolvedValueOnce(Response.json({ user: "wrong" }));
    expect(await readSession()).toEqual({ status: "unavailable" });
  });
  it("logout ส่ง cookie และ CSRF; ไม่ทำเป็นสำเร็จเมื่อ backend ปฏิเสธ", async () => {
    fetcher
      .mockResolvedValueOnce(new Response(null, { status: 403 }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    expect(await endSession(session.csrfToken)).toBe(false);
    expect(await endSession(session.csrfToken)).toBe(true);
    expect(fetcher).toHaveBeenLastCalledWith(
      "http://localhost:5016/api/v1/auth/logout",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        headers: { "X-CSRF-Token": session.csrfToken },
      }),
    );
  });
});

function AccountFixture() {
  const account = useSessionAccount();

  return (
    <>
      <p>{account.session.user.displayName}</p>
      <button onClick={account.logout}>ออกจากระบบ</button>
      {account.logoutError && <p role="alert">{account.logoutError}</p>}
    </>
  );
}

function protectedScreen() {
  return render(
    <SessionBoundary>
      <AccountFixture />
    </SessionBoundary>,
  );
}

describe("session UI gate", () => {
  it("ไม่ mount ข้อมูล dashboard ระหว่างรอ me", async () => {
    const pending = Promise.withResolvers<Response>();

    fetcher.mockReturnValue(pending.promise);
    protectedScreen();
    expect(screen.queryByText(session.user.displayName)).toBeNull();
    await act(async () => {
      pending.resolve(Response.json(session));
    });
    expect(await screen.findByText(session.user.displayName)).toBeTruthy();
  });
  it("401 พากลับ modal หน้าแรก โดยไม่ mount dashboard", async () => {
    fetcher.mockResolvedValue(new Response(null, { status: 401 }));
    protectedScreen();
    await waitFor(() => expect(navigation.replace).toHaveBeenCalledWith("/?login=required"));
    expect(screen.queryByText(session.user.displayName)).toBeNull();
  });
  it("backend ล่มแสดง retry; ไม่วน redirect ไปมา", async () => {
    fetcher
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(Response.json(session));
    protectedScreen();
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(navigation.replace).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "ลองอีกครั้ง" }));
    expect(await screen.findByText(session.user.displayName)).toBeTruthy();
  });
  it("logout ล้มเหลวยังคงข้อมูลบัญชี; สำเร็จจึงนำข้อมูลลงและกลับหน้าแรก", async () => {
    fetcher
      .mockResolvedValueOnce(Response.json(session))
      .mockResolvedValueOnce(new Response(null, { status: 403 }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    protectedScreen();
    await screen.findByText(session.user.displayName);
    fireEvent.click(screen.getByRole("button", { name: "ออกจากระบบ" }));
    await screen.findByRole("alert");
    expect(screen.getByText(session.user.displayName)).toBeTruthy();
    expect(navigation.replace).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "ออกจากระบบ" }));
    await waitFor(() => expect(navigation.replace).toHaveBeenCalledWith("/"));
    expect(screen.queryByText(session.user.displayName)).toBeNull();
  });
});

describe("login ใน modal บนหน้าเดิม", () => {
  it("backend ไม่พร้อมแสดงข้อความใน modal และเปิดให้ลองใหม่", async () => {
    fetcher.mockResolvedValue(new Response(null, { status: 503 }));
    render(<LineLoginEntry />);
    fireEvent.click(screen.getByRole("button", { name: "เข้าสู่ระบบด้วย LINE" }));
    const dialog = screen.getByRole("dialog");

    expect(dialog).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "เข้าสู่ระบบด้วย LINE", hidden: false }));
    expect(await screen.findByRole("alert")).toHaveProperty(
      "textContent",
      "ยังเชื่อมต่อระบบไม่ได้ กรุณาลองอีกครั้ง",
    );
    expect(screen.getByRole("dialog")).toBeTruthy();
  });
  it("callback ล้มเหลวเปิด modal พร้อมข้อความที่กำหนดเอง", () => {
    render(<LineLoginEntry initialMessage={loginMessage("failed")} />);
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByRole("alert").textContent).toBe("เข้าสู่ระบบไม่สำเร็จ กรุณาลองอีกครั้ง");
    expect(fetcher).not.toHaveBeenCalled();
  });
});
