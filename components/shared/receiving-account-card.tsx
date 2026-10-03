import { Building2, Copy, Landmark, Pencil, Smartphone, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ReceivingAccountView } from "@/components/shared/receiving-account-types";

export function ReceivingAccountCard({
  account,
  embedded = false,
}: {
  account: ReceivingAccountView;
  embedded?: boolean;
}) {
  if (!account.saved) return null;

  return (
    <Card
      className={
        embedded
          ? "gap-0 rounded-none border-0 bg-transparent py-0 text-black shadow-none"
          : "gap-0 overflow-hidden rounded-2xl border-white/10 bg-[radial-gradient(circle_at_85%_15%,rgba(207,255,71,0.28),transparent_42%),linear-gradient(115deg,#050605_0%,#0b1006_58%,#17250a_100%)] py-0 text-white shadow-xl"
      }
    >
      <div className={embedded ? "flex items-start gap-3" : "flex items-start gap-3 p-4 sm:p-6"}>
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-black">
          <Landmark className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={
              embedded
                ? "text-[11px] font-semibold text-black/50 sm:text-xs"
                : "text-[11px] font-semibold text-white/60 sm:text-xs"
            }
          >
            บัญชีรับเงิน
          </p>
          <h3
            className={
              embedded
                ? "truncate text-sm font-bold text-black sm:text-lg"
                : "truncate text-sm font-bold text-white sm:text-lg"
            }
          >
            {account.saved.name}
          </h3>
        </div>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={account.onEdit}
            aria-label="แก้ไขบัญชีรับเงิน"
            className={
              embedded
                ? "text-black/50 hover:bg-black/5 hover:text-black"
                : "text-white/65 hover:bg-white/10 hover:text-primary"
            }
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={account.onRequestDelete}
            aria-label="ลบบัญชีรับเงิน"
            className={
              embedded
                ? "text-black/50 hover:bg-red-50 hover:text-red-600"
                : "text-white/65 hover:bg-white/10 hover:text-red-300"
            }
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <div className={embedded ? "pt-4" : "px-4 pb-4 sm:px-6 sm:pb-6"}>
        <p
          className={
            embedded
              ? "flex items-center gap-2 text-xs font-semibold text-black/50 sm:text-sm"
              : "flex items-center gap-2 text-xs font-semibold text-white/60 sm:text-sm"
          }
        >
          {account.saved.method === "promptpay" ? (
            <Smartphone className="size-4" />
          ) : (
            <Building2 className="size-4" />
          )}
          {account.saved.methodLabel}
        </p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
          <strong
            className={
              embedded
                ? "text-lg font-black tracking-tight text-black tabular-nums sm:text-2xl"
                : "text-lg font-black tracking-tight text-white tabular-nums sm:text-2xl"
            }
          >
            {account.saved.displayNumber}
          </strong>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={account.onCopy}
            className={
              embedded
                ? "h-8 rounded-full border-black/15 bg-white/70 text-[11px] font-semibold text-black shadow-none hover:bg-primary sm:text-xs"
                : "h-8 rounded-full border-white/25 bg-white/5 text-[11px] font-semibold text-primary shadow-none hover:border-primary hover:bg-primary hover:text-black sm:text-xs"
            }
          >
            <Copy className="size-3.5" /> คัดลอกเลข
          </Button>
        </div>
        {account.copyMessage && (
          <p
            role="status"
            className={embedded ? "mt-2 text-xs text-black/60" : "mt-2 text-xs text-primary"}
          >
            {account.copyMessage}
          </p>
        )}
      </div>

      {account.pendingDelete && (
        <div
          className={
            embedded
              ? "mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-black/10 py-3 text-xs sm:text-sm"
              : "flex flex-wrap items-center justify-end gap-2 border-t border-white/15 bg-black/30 px-4 py-3 text-xs sm:px-6 sm:text-sm"
          }
        >
          <span
            className={
              embedded ? "mr-auto font-semibold text-red-600" : "mr-auto font-semibold text-red-200"
            }
          >
            ลบบัญชีรับเงินนี้?
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={account.onCancelDelete}
            className={
              embedded
                ? "text-black hover:bg-black/5"
                : "text-white hover:bg-white/10 hover:text-white"
            }
          >
            ยกเลิก
          </Button>
          <Button type="button" variant="destructive" size="sm" onClick={account.onConfirmDelete}>
            ลบ
          </Button>
        </div>
      )}

      <p
        className={
          embedded
            ? "mt-4 border-t border-dashed border-black/10 pt-3 text-[11px] text-black/45 sm:text-xs"
            : "border-t border-dashed border-white/20 px-4 py-3 text-[11px] text-white/55 sm:px-6 sm:text-xs"
        }
      >
        ชื่อ: {account.saved.name}
      </p>
    </Card>
  );
}
