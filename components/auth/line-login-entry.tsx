"use client";

import Image from "next/image";
import { Dialog } from "radix-ui";
import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { useLineLogin } from "@/lib/hooks/auth/use-line-login";

/** UI เท่านั้น: ปุ่มใน header + modal เดิม; state และ navigation อยู่ใน hook */
export function LineLoginEntry({ initialMessage = "" }: { initialMessage?: string }) {
  const login = useLineLogin(initialMessage);
  return (
    <Dialog.Root open={login.open} onOpenChange={login.changeOpen}>
      <Dialog.Trigger asChild>
        <Button
          variant="outline"
          className="h-10 rounded-full border-white bg-transparent px-4 text-xs text-white hover:bg-white hover:text-[#0038ff] sm:px-5 sm:text-sm"
        >
          เข้าสู่ระบบด้วย LINE
        </Button>
      </Dialog.Trigger>
      <Modal title="เข้าสู่ระบบ" description="ใช้บัญชี LINE เพื่อเข้าสู่ Aokkorn">
        {login.message && (
          <p role="alert" className="mt-4 text-sm text-red-700">
            {login.message}
          </p>
        )}
        <Button
          onClick={login.startLogin}
          disabled={login.pending}
          aria-busy={login.pending}
          className="mt-7 h-14 w-full rounded-2xl bg-[#06c755] text-base font-bold text-white hover:bg-[#05b34c]"
        >
          <Image src="/line-login-icon.png" alt="" width={28} height={28} />
          {login.pending ? "กำลังเชื่อมต่อ…" : "เข้าสู่ระบบด้วย LINE"}
        </Button>
      </Modal>
    </Dialog.Root>
  );
}
