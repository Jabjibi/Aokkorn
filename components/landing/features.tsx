import { ArrowRight, ArrowUpRight, Check, ReceiptText, UsersRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { featureItems } from "@/lib/landing-content";
import { LandingAnimations } from "./landing-animations";

export function Features() {
  return (
    <section
      id="features"
      className="relative z-20 rounded-t-[2.25rem] bg-white px-5 pt-12 pb-14 text-[#141414] sm:rounded-t-[3.5rem] sm:px-8 sm:py-16 lg:px-12"
      aria-labelledby="features-title"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-[10px] font-bold tracking-[0.2em] text-[#0038ff]">
              LESS CALCULATING. MORE TRAVELING.
            </p>
            <h2
              id="features-title"
              className="text-2xl leading-snug font-extrabold tracking-tight sm:text-3xl"
            >
              ทริปสนุกได้ เรื่องเงินก็ง่ายด้วย
            </h2>
          </div>
          <span className="text-xs text-black/55">ตั้งแต่บิลแรก จนถึงยอดสุดท้าย ↗</span>
        </div>
        <LandingAnimations>
          <div className="grid gap-4 md:grid-cols-3 lg:gap-6">
            <Card className="relative gap-0 rounded-[2rem] border-black/5 bg-[#f6f7fa] py-0 shadow-none">
              <CardContent className="flex h-full min-h-80 flex-col p-6 lg:p-7">
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-black/45">01 / JOT IT DOWN</span>
                  <ReceiptText className="size-5 text-[#0038ff]" />
                </div>
                <h3 className="text-xl font-extrabold">{featureItems[0].title}</h3>
                <p className="mt-2 text-xs leading-6 text-black/60">
                  {featureItems[0].description}
                </p>
                <div className="relative mt-auto pt-7">
                  <div className="-rotate-3 rounded-2xl bg-[#0038ff] p-4 text-white shadow-[0_8px_20px_#0038ff25]">
                    <p className="text-[9px] text-white/70">วันนี้อยากจดอะไร?</p>
                    <p className="mt-2 text-sm font-semibold">
                      กะเพรา 300
                      <span className="ml-1 inline-block h-4 w-px translate-y-0.5 bg-[var(--landing-lime)]" />
                    </p>
                  </div>
                  <span className="absolute right-0 -bottom-3 flex rotate-6 items-center gap-1 rounded-full bg-[var(--landing-lime)] px-3 py-2 text-[10px] font-bold">
                    <Check className="size-3" /> จดให้แล้ว
                  </span>
                </div>
              </CardContent>
              <ArrowRight
                className="absolute top-1/2 -right-6 z-10 hidden size-8 -rotate-12 md:block"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </Card>
            <Card className="relative gap-0 rounded-[2rem] border-black/5 bg-[#f6f7fa] py-0 shadow-none">
              <CardContent className="flex h-full min-h-80 flex-col p-6 lg:p-7">
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-black/45">02 / SPLIT IT FAIR</span>
                  <UsersRound className="size-5 text-[#0038ff]" />
                </div>
                <h3 className="text-xl font-extrabold">{featureItems[1].title}</h3>
                <p className="mt-2 text-xs leading-6 text-black/60">
                  {featureItems[1].description}
                </p>
                <div className="mt-auto flex flex-wrap items-center justify-center gap-2 pt-7">
                  <div className="flex -space-x-2" aria-hidden="true">
                    <span className="grid size-11 place-items-center rounded-full border-[3px] border-[#f6f7fa] bg-[#0038ff] text-sm font-bold text-white">
                      ค
                    </span>
                    <span className="grid size-11 place-items-center rounded-full border-[3px] border-[#f6f7fa] bg-[var(--landing-lime)] text-sm font-bold">
                      ม
                    </span>
                    <span className="grid size-11 place-items-center rounded-full border-[3px] border-[#f6f7fa] bg-[#ced8ff] text-sm font-bold">
                      พ
                    </span>
                  </div>
                  <div className="rotate-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <p className="text-[9px] text-black/55">หาร 3 คน คนละ</p>
                    <p className="mt-1 font-mono text-lg font-bold text-[#0038ff]">฿100.00</p>
                  </div>
                </div>
              </CardContent>
              <ArrowRight
                className="absolute top-1/2 -right-6 z-10 hidden size-8 rotate-12 md:block"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </Card>
            <Card className="gap-0 rounded-[2rem] border-black/5 bg-[#f6f7fa] py-0 shadow-none">
              <CardContent className="flex h-full min-h-80 flex-col p-6 lg:p-7">
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-black/45">03 / ALL SET</span>
                  <Check className="size-5 text-[#0038ff]" />
                </div>
                <h3 className="text-xl font-extrabold">{featureItems[2].title}</h3>
                <p className="mt-2 text-xs leading-6 text-black/60">
                  {featureItems[2].description}
                </p>
                <div className="mt-auto pt-7">
                  <div className="relative mx-auto flex max-w-56 -rotate-3 items-center justify-between rounded-2xl rounded-bl-sm bg-[var(--landing-lime)] px-5 py-4 shadow-sm">
                    <div>
                      <p className="text-[9px] font-semibold">มายด์คืนให้คุณ · ตัวอย่าง</p>
                      <p className="mt-1 font-mono text-2xl font-bold">฿100.00</p>
                    </div>
                    <ArrowUpRight className="size-7" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </LandingAnimations>
      </div>
    </section>
  );
}
