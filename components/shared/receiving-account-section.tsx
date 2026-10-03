import { Building2, Landmark, Smartphone } from "lucide-react";
import { ReceivingAccountCard } from "@/components/shared/receiving-account-card";
import type { ReceivingAccountView } from "@/components/shared/receiving-account-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const accountInputClassName =
  "mt-1 h-10 rounded-xl text-xs focus-visible:border-black/25 focus-visible:ring-0 focus-visible:ring-transparent sm:text-sm";

export function ReceivingAccountSection({
  account,
  embedded = false,
}: {
  account: ReceivingAccountView;
  embedded?: boolean;
}) {
  return (
    <>
      {account.formOpen ? (
        <section
          aria-labelledby="receiving-account-title"
          className={embedded ? "" : "rounded-2xl border border-black/10 p-4 sm:p-6"}
        >
          <h3
            id="receiving-account-title"
            className="flex items-center gap-2 text-sm font-bold sm:text-lg"
          >
            <Landmark className="size-4 sm:size-5" /> บัญชีรับเงิน
          </h3>
          <p className="mt-1 text-xs text-black/50 sm:text-sm">
            เพิ่มช่องทางรับเงินไว้ใช้เมื่อส่งสรุปให้เพื่อน
          </p>

          <form onSubmit={account.onSubmit} autoComplete="off" className="mt-4 space-y-3">
            <div>
              <label
                htmlFor="summary-account-name"
                className="text-[11px] font-semibold sm:text-xs"
              >
                ชื่อบัญชี
              </label>
              <Input
                id="summary-account-name"
                value={account.name}
                onChange={account.onNameChange}
                maxLength={100}
                autoComplete="off"
                spellCheck={false}
                placeholder="ชื่อบัญชี"
                className={accountInputClassName}
              />
            </div>

            <fieldset>
              <legend className="mb-1 text-[11px] font-semibold sm:text-xs">ช่องทางรับเงิน</legend>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  aria-pressed={account.method === "promptpay"}
                  onClick={account.onSelectPromptPay}
                  className={`h-9 rounded-xl text-xs sm:text-sm ${account.method === "promptpay" ? "border-black bg-primary text-black" : "border-black/10 bg-white text-black/50"}`}
                >
                  <Smartphone className="size-4" /> พร้อมเพย์
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  aria-pressed={account.method === "bank"}
                  onClick={account.onSelectBank}
                  className={`h-9 rounded-xl text-xs sm:text-sm ${account.method === "bank" ? "border-black bg-primary text-black" : "border-black/10 bg-white text-black/50"}`}
                >
                  <Building2 className="size-4" /> ธนาคาร
                </Button>
              </div>
            </fieldset>

            {account.method === "bank" && (
              <div>
                <label htmlFor="summary-bank-name" className="text-[11px] font-semibold sm:text-xs">
                  ชื่อธนาคาร
                </label>
                <Input
                  id="summary-bank-name"
                  value={account.bankName}
                  onChange={account.onBankNameChange}
                  maxLength={100}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="ชื่อธนาคาร"
                  className={accountInputClassName}
                />
              </div>
            )}

            <div>
              <label
                htmlFor="summary-account-number"
                className="text-[11px] font-semibold sm:text-xs"
              >
                {account.method === "promptpay" ? "เลขพร้อมเพย์" : "เลขบัญชีธนาคาร"}
              </label>
              <Input
                id="summary-account-number"
                value={account.number}
                onChange={account.onNumberChange}
                inputMode="numeric"
                maxLength={20}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                placeholder={
                  account.method === "promptpay"
                    ? "เบอร์โทรศัพท์หรือเลขบัตรประชาชน"
                    : "เลขบัญชีธนาคาร"
                }
                className={accountInputClassName}
              />
            </div>

            <p className="text-[11px] leading-5 text-black/45 sm:text-xs">
              ข้อมูลบัญชีจะอยู่เฉพาะระหว่างเปิดหน้านี้ และจะหายเมื่อรีเฟรช
            </p>
            <Button
              type="submit"
              disabled={!account.valid}
              className="h-10 w-full rounded-xl bg-black text-xs font-bold text-white hover:bg-black/85 sm:text-sm"
            >
              บันทึก
            </Button>
            {account.isEditing && (
              <Button
                type="button"
                variant="ghost"
                onClick={account.onCancelEdit}
                className="h-9 w-full text-xs sm:text-sm"
              >
                ยกเลิกการแก้ไข
              </Button>
            )}
            {account.message && (
              <p role="status" className="text-xs text-black/60 sm:text-sm">
                {account.message}
              </p>
            )}
          </form>
        </section>
      ) : (
        <ReceivingAccountCard account={account} embedded={embedded} />
      )}
    </>
  );
}
