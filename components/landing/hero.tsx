import { ArrowDown, ArrowDownLeft, ArrowRight, Check, MoveUpRight, Sparkles } from "lucide-react";
import { CircularLinkBadge } from "@/components/shared/circular-link-badge";
import { TripPreviewCard } from "@/components/shared/trip-preview-card";
import { Button } from "@/components/ui/button";
import { heroTrustPoints, heroTripCards } from "@/lib/landing-content";
import { LandingAnimations } from "./landing-animations";

export function Hero() {
  return (
    <section
      className="relative mx-auto max-w-[1440px] px-5 pt-10 pb-14 text-white sm:px-8 sm:pt-12 sm:pb-20 lg:px-12 lg:pt-10"
      aria-labelledby="hero-title"
    >
      <div className="relative mx-auto max-w-6xl">
        <div className="relative z-10 mx-auto text-center">
          <p className="mb-5 flex items-center justify-center gap-2 text-[10px] font-semibold tracking-[0.18em] text-white/80 sm:text-xs">
            <span className="size-1.5 rounded-full bg-[var(--landing-lime)]" />
            GOOD TRIPS. GREAT FRIENDS. ZERO DRAMA.
          </p>
          <h1 id="hero-title" className="landing-headline">
            <span className="block text-[var(--landing-lime)]">ออกก่อน</span>
            <span className="block">เที่ยวให้สุด</span>
            <span className="block">
              หารให้ชัด<span className="text-[var(--landing-lime)]">.</span>
            </span>
          </h1>
          <p className="mx-auto mt-7 max-w-sm text-sm leading-7 text-white/85 sm:max-w-lg sm:text-base">
            จดค่าใช้จ่าย เลือกคนหาร และดูว่าใครต้องคืนใคร
            <br className="hidden sm:block" /> ครบในที่เดียว แม้ทริปนั้นจะมีหลายสกุลเงิน
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-[var(--landing-lime)] px-6 font-bold text-black hover:bg-[#ddff55]"
            >
              <a href="#demo">
                ลองจดรายการ <ArrowRight />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 rounded-full border-white/40 bg-transparent px-5 text-white hover:bg-white hover:text-[#0038ff]"
            >
              <a href="#features">
                ทำอะไรได้บ้าง <ArrowDown className="size-4" />
              </a>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto mt-12 grid max-w-lg grid-cols-2 items-start gap-4 px-1 sm:gap-10 lg:pointer-events-none lg:absolute lg:inset-0 lg:mt-0 lg:block lg:max-w-none">
          <LandingAnimations
            kind="float"
            className="relative z-20 lg:absolute lg:top-44 lg:left-0 lg:w-[218px] xl:top-40 xl:left-3 xl:w-[238px]"
          >
            <TripPreviewCard
              {...heroTripCards[0]}
              className="-rotate-6 transition-transform duration-500 hover:rotate-0 lg:pointer-events-auto lg:-rotate-12"
            />
          </LandingAnimations>
          <LandingAnimations
            kind="float"
            delay={1}
            className="relative z-20 mt-9 lg:absolute lg:top-20 lg:right-0 lg:mt-0 lg:w-[218px] xl:right-3 xl:w-[238px]"
          >
            <TripPreviewCard
              {...heroTripCards[1]}
              className="rotate-6 transition-transform duration-500 hover:rotate-0 lg:pointer-events-auto lg:rotate-12"
            />
          </LandingAnimations>
          <MoveUpRight
            className="absolute -top-6 left-0 size-12 -rotate-12 text-[var(--landing-lime)] sm:size-16 lg:top-16 lg:left-24"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <ArrowDownLeft
            className="absolute -right-1 -bottom-9 size-14 rotate-12 text-[var(--landing-lime)] lg:top-[390px] lg:right-12 lg:bottom-auto lg:size-20"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>

        <div className="relative z-20 mx-auto mt-10 flex max-w-lg items-center justify-center gap-4 lg:absolute lg:right-0 lg:bottom-0 lg:mt-0">
          <p className="-rotate-6 text-xs font-semibold text-white/80 lg:hidden">
            เรื่องเงินเบา ๆ<br />
            เรื่องเที่ยวเต็มที่!
          </p>
          <CircularLinkBadge href="#demo" label="ลองหารเงิน" textPathId="landing-cta-text" />
        </div>
        <Sparkles
          className="absolute top-8 right-2 hidden size-8 rotate-12 text-[var(--landing-lime)] sm:block lg:top-0 lg:right-56"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>
      <div className="relative z-10 mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-3 border-t border-white/20 pt-6 text-[11px] text-white/85 sm:text-xs lg:mt-12">
        {heroTrustPoints.map((point) => (
          <span className="flex items-center gap-2" key={point}>
            <Check className="size-3.5 text-[var(--landing-lime)]" />
            {point}
          </span>
        ))}
      </div>
    </section>
  );
}
