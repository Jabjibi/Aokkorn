"use client";

import { Plus, RotateCcw, Split, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useExpenseDemo } from "@/lib/hooks/use-expense-demo";
import { howItWorksItems } from "@/lib/landing-content";
import { formatMoney } from "@/lib/money";

const people = ["คุณ", "มายด์", "พีท"];

export function ExpenseDemo() {
  const demo = useExpenseDemo();

  return (
    <section
      id="demo"
      className="bg-black px-5 py-24 text-white sm:px-8 lg:px-12 lg:py-32"
      data-demo
    >
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div id="how-it-works" data-demo-copy>
          <p className="text-xs font-bold tracking-[0.2em] text-[#cfff47] uppercase">
            ลองก่อนออกเดินทาง
          </p>
          <h2 className="mt-5 text-4xl leading-tight font-black tracking-[-0.045em] sm:text-5xl">
            จาก “เดี๋ยวค่อยคิด”
            <br />
            เป็น “หารเรียบร้อย”
          </h2>
          <p className="mt-6 max-w-lg text-sm leading-7 text-white/55 sm:text-base">
            ลองพิมพ์รายการกับราคาในช่องเดียว ระบบจะแยกตัวเลขและคำนวณส่วนแบ่งให้เห็นทันที
          </p>

          <ol className="mt-10 grid gap-5">
            {howItWorksItems.map((item) => (
              <li className="grid grid-cols-[2.75rem_1fr] items-start gap-4" key={item.number}>
                <span className="grid size-11 place-items-center rounded-full border border-white/15 font-mono text-sm text-[#cfff47]">
                  {item.number}
                </span>
                <div className="pt-1">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm text-white/45">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <Card
          className="gap-0 overflow-hidden rounded-3xl border-0 bg-white py-0 text-black shadow-[0_30px_100px_rgba(207,255,71,0.12)]"
          data-demo-card
        >
          <CardHeader className="flex-row items-center justify-between border-b border-black/8 px-6 py-5 sm:px-8">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-black/35 uppercase">
                ทริปตัวอย่าง
              </p>
              <CardTitle className="mt-2 text-2xl font-black tracking-[-0.04em]">
                หนีไปทะเลกัน
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={demo.reset}
              aria-label="รีเซ็ตรายการตัวอย่าง"
            >
              <RotateCcw />
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <div className="divide-y divide-black/8 px-6 sm:px-8">
              {demo.expenses.map((expense) => (
                <div className="flex items-center gap-4 py-4" key={expense.id}>
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-black text-[#cfff47]">
                    <WalletCards className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{expense.name}</p>
                    <p className="mt-1 text-xs text-black/40">คุณจ่าย · หารเท่ากัน 3 คน</p>
                  </div>
                  <strong className="font-mono text-sm">฿{formatMoney(expense.cents)}</strong>
                </div>
              ))}
            </div>

            <form
              className="border-t border-black/8 bg-black/[0.025] p-6 sm:p-8"
              onSubmit={demo.addExpense}
            >
              <label className="text-xs font-bold text-black/50" htmlFor="expense-demo-input">
                เพิ่มรายการใหม่
              </label>
              <div className="mt-2 flex gap-2">
                <Input
                  id="expense-demo-input"
                  value={demo.draft}
                  onChange={(event) => demo.setDraft(event.target.value)}
                  placeholder="เช่น ต้มยำ 300"
                  className="h-11 rounded-xl border-black/10 bg-white px-4 shadow-none"
                  aria-describedby={demo.error ? "expense-demo-error" : undefined}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="size-11 shrink-0 rounded-xl bg-[#cfff47] text-black hover:bg-[#b8ed37]"
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
              <div className="bg-[#cfff47] p-6 sm:p-8">
                <span className="flex items-center gap-2 text-xs font-bold text-black/55">
                  <Split className="size-4" /> ยอดรวมทั้งหมด
                </span>
                <strong className="mt-3 block text-3xl font-black tracking-[-0.04em]">
                  ฿{formatMoney(demo.total)}
                </strong>
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-xs font-bold text-black/45">หารเท่ากัน 3 คน</p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {people.map((person, index) => (
                    <div key={person}>
                      <span className="grid size-8 place-items-center rounded-full bg-black text-xs font-bold text-white">
                        {person.slice(0, 1)}
                      </span>
                      <p className="mt-2 text-xs text-black/45">{person}</p>
                      <strong className="mt-1 block text-xs">
                        ฿{formatMoney(demo.shares[index])}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
