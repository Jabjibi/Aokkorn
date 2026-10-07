import { Plus, RotateCcw, Split, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ExpenseDemoModel } from "@/lib/hooks/landing/use-expense-demo";
import { howItWorksItems } from "@/lib/landing-content";
import { LandingAnimations } from "./landing-animations";

export function ExpenseDemo({ demo }: { demo: ExpenseDemoModel }) {
  return (
    <section
      id="demo"
      className="border-t border-black/8 bg-[#f5f6fa] px-5 py-16 text-[#141414] sm:px-8 lg:px-12 lg:py-24"
      aria-labelledby="demo-title"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
        <div id="how-it-works">
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#0038ff] uppercase">
            TRY IT. SPLIT IT. LOVE IT.
          </p>
          <h2
            id="demo-title"
            className="mt-5 text-3xl leading-snug font-extrabold tracking-[-0.04em] sm:text-4xl"
          >
            จาก “เดี๋ยวค่อยคิด”
            <br />
            เป็น <span className="text-[#0038ff]">“หารเรียบร้อย”</span>
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-black/60">
            ลองพิมพ์รายการกับราคาในช่องเดียว ระบบจะแยกตัวเลขและคำนวณส่วนแบ่งให้เห็นทันที
          </p>

          <ol className="mt-8 grid gap-5">
            {howItWorksItems.map((item) => (
              <li className="grid grid-cols-[2.75rem_1fr] items-start gap-4" key={item.number}>
                <span className="grid size-11 place-items-center rounded-full border border-[#0038ff]/20 bg-white font-mono text-sm font-bold text-[#0038ff]">
                  {item.number}
                </span>
                <div className="pt-1">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-1 text-xs leading-6 text-black/60">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <LandingAnimations className="min-w-0">
          <Card className="gap-0 overflow-hidden rounded-[2rem] border border-[#0038ff]/10 bg-white py-0 text-black shadow-[0_20px_70px_#0038ff12]">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/15 bg-[#0038ff] px-5 py-5 text-white sm:px-7">
              <div>
                <p className="text-[10px] font-bold tracking-[0.16em] text-white/75 uppercase">
                  ทริปตัวอย่าง
                </p>
                <CardTitle className="mt-2 text-xl font-extrabold tracking-[-0.04em]">
                  {demo.tripName}
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={demo.reset}
                className="rounded-full text-white hover:bg-white/15 hover:text-white"
                aria-label="รีเซ็ตรายการตัวอย่าง"
              >
                <RotateCcw />
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              <div className="divide-y divide-black/8 px-5 sm:px-7">
                {demo.expenses.map((expense) => (
                  <div className="flex items-center gap-4 py-4" key={expense.id}>
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#eef1ff] text-[#0038ff]">
                      <WalletCards className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{expense.name}</p>
                      <p className="mt-1 text-[10px] text-black/60 sm:text-xs">
                        {demo.payerName}จ่าย · หารเท่ากัน {demo.peopleCount} คน
                      </p>
                    </div>
                    <strong className="shrink-0 font-mono text-xs sm:text-sm">
                      ฿{expense.amount}
                    </strong>
                  </div>
                ))}
              </div>

              <form
                className="border-t border-black/8 bg-[#f8f9fc] p-5 sm:p-7"
                onSubmit={demo.addExpense}
              >
                <label className="text-xs font-bold text-black/50" htmlFor="expense-demo-input">
                  เพิ่มรายการใหม่
                </label>
                <div className="mt-2 flex gap-2">
                  <Input
                    id="expense-demo-input"
                    value={demo.draft}
                    onChange={demo.changeDraft}
                    placeholder="เช่น ต้มยำ 300"
                    className="h-11 rounded-xl border-black/10 bg-white px-4 shadow-none"
                    aria-describedby={demo.error ? "expense-demo-error" : undefined}
                    aria-invalid={Boolean(demo.error)}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="size-11 shrink-0 rounded-xl bg-[#0038ff] text-white hover:bg-[#002bcc]"
                    aria-label="เพิ่มรายการ"
                  >
                    <Plus />
                  </Button>
                </div>
                {demo.error && (
                  <p id="expense-demo-error" className="mt-2 text-xs text-red-600" role="alert">
                    {demo.error}
                  </p>
                )}
                <span className="sr-only" role="status">
                  {demo.notice}
                </span>
              </form>

              <div className="grid border-t border-black/8 sm:grid-cols-[0.8fr_1.2fr]">
                <div className="min-w-0 bg-[var(--landing-lime)] p-5 sm:p-7">
                  <span className="flex items-center gap-2 text-xs font-bold text-black/55">
                    <Split className="size-4" /> ยอดรวมทั้งหมด
                  </span>
                  <strong className="mt-3 block font-mono text-2xl font-bold tracking-[-0.06em] break-words">
                    ฿{demo.total}
                  </strong>
                </div>
                <div className="min-w-0 p-5 sm:p-7">
                  <p className="text-xs font-bold text-black/45">
                    หารเท่ากัน {demo.peopleCount} คน
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {demo.people.map((person) => (
                      <div className="min-w-0" key={person.name}>
                        <span className="grid size-8 place-items-center rounded-full bg-[#eef1ff] text-xs font-bold text-[#0038ff]">
                          {person.initial}
                        </span>
                        <p className="mt-2 text-xs text-black/60">{person.name}</p>
                        <strong className="mt-1 block font-mono text-[11px] break-words">
                          ฿{person.share}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </LandingAnimations>
      </div>
    </section>
  );
}
