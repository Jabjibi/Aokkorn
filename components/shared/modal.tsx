"use client";

import type { ReactNode } from "react";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type ModalProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function Modal({ title, description, children }: ModalProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm" />
      <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-7 text-[#11120f] shadow-xl sm:p-9">
        <Dialog.Title className="pr-8 text-2xl font-extrabold">{title}</Dialog.Title>
        <Dialog.Description className="mt-3 text-sm leading-relaxed text-black/60">
          {description}
        </Dialog.Description>
        <Dialog.Close asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute top-4 right-4"
            aria-label="ปิดหน้าต่างเข้าสู่ระบบ"
          >
            <X />
          </Button>
        </Dialog.Close>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
