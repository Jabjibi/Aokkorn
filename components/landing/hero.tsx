import Image from "next/image";
import { ArrowDownRight, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroTrustPoints } from "@/lib/landing-content";

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[820px] overflow-hidden bg-black text-white"
      aria-labelledby="hero-title"
      data-hero
    >
      <Image
        src="/trip.png"
        alt="นักเดินทางพร้อมกระเป๋าและพาสปอร์ต ท่ามกลางเครื่องบินและบรรยากาศท่องเที่ยว"
        fill
        sizes="100vw"
        className="object-cover object-[62%_center] sm:object-center"
        preload
        data-hero-image
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.94)_0%,rgba(0,0,0,0.76)_35%,rgba(0,0,0,0.16)_72%,rgba(0,0,0,0.06)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.82)_0%,transparent_42%,rgba(0,0,0,0.2)_100%)]" />

      <div className="relative mx-auto flex w-full max-w-7xl items-center px-5 pt-32 pb-20 sm:px-8 sm:pt-40 lg:px-12">
        <div className="max-w-2xl" data-hero-content>
          <h1
            id="hero-title"
            className="mt-7 text-[clamp(3.2rem,8vw,7.2rem)] leading-[0.9] font-black tracking-[-0.065em] text-white"
            data-hero-item
          >
            เที่ยวให้สุด
            <br />
            <span className="text-[#cfff47]">หารให้ชัด</span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-white/72 sm:text-lg" data-hero-item>
            จดค่าใช้จ่าย เลือกคนหาร และดูว่าใครต้องคืนใคร
            <br className="hidden sm:block" />
            ครบในที่เดียว แม้ทริปนั้นจะมีหลายสกุลเงิน
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row" data-hero-item>
            <Button
              asChild
              size="lg"
              className="h-12 rounded-xl bg-[#cfff47] px-6 text-black hover:bg-[#b8ed37]"
            >
              <a href="#demo">
                ลองจดรายการ
                <ArrowRight />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-white/25 bg-white/8 px-6 text-white backdrop-blur-sm hover:bg-white hover:text-black"
            >
              <a href="#features">
                ดูว่าทำอะไรได้บ้าง
                <ArrowDownRight />
              </a>
            </Button>
          </div>

          <div
            className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-white/66"
            data-hero-item
          >
            {heroTrustPoints.map((point) => (
              <span className="flex items-center gap-1.5" key={point}>
                <Check className="size-3.5 text-[#cfff47]" />
                {point}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        className="absolute right-5 bottom-5 hidden rounded-2xl border border-white/15 bg-black/55 px-5 py-4 text-sm text-white/70 backdrop-blur-xl sm:block lg:right-10 lg:bottom-10"
        data-hero-float
      >
        <p className="text-[10px] font-bold tracking-[0.22em] text-[#cfff47] uppercase">
          Next stop
        </p>
        <p className="mt-1 font-semibold text-white">ความทรงจำดี ๆ ที่ไม่มีบิลค้าง</p>
      </div>
    </section>
  );
}
