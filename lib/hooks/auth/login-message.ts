export function loginMessage(code: unknown): string {
  if (code === "failed") {
    return "เข้าสู่ระบบไม่สำเร็จ กรุณาลองอีกครั้ง";
  }

  if (code === "required") {
    return "เข้าสู่ระบบด้วย LINE เพื่อใช้งานต่อ";
  }

  return "";
}
