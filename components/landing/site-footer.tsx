import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brand } from "./site-header";

export function SiteFooter() {
  return (
    <footer className="bg-[var(--landing-lime)] px-5 pt-12 pb-6 text-black sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-6 pb-10 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-[10px] font-bold tracking-[0.18em]">
              NEXT STOP: YOUR NEXT TRIP
            </p>
            <h2 className="text-3xl leading-snug font-extrabold tracking-tight sm:text-4xl">
              พร้อมออกทริปต่อไปหรือยัง?
            </h2>
          </div>
          <Button
            asChild
            size="lg"
            className="h-12 rounded-full bg-black px-6 text-white hover:bg-black/80"
          >
            <Link href="/dashboard">
              เริ่มทริปของคุณ <ArrowUpRight />
            </Link>
          </Button>
        </div>
        <div className="flex flex-col gap-5 border-t border-black/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Brand />
          <p className="text-xs text-black/65">ออกก่อน แล้วไปสนุกด้วยกัน</p>
          <a
            className="flex items-center gap-2 text-xs font-bold underline-offset-4 hover:underline"
            href="#top"
          >
            กลับด้านบน <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
