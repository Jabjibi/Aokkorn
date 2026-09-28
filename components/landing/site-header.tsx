import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { AppBrand } from "@/components/shared/app-brand";
import { Button } from "@/components/ui/button";
import { navigationItems } from "@/lib/landing-content";

export function Brand() {
  return <AppBrand href="#top" />;
}

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 px-4 pt-4 sm:px-6 sm:pt-6" data-site-header>
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between rounded-2xl border border-black/10 bg-white/95 px-4 shadow-[0_20px_60px_rgba(0,0,0,0.16)] backdrop-blur-xl sm:px-6">
        <Brand />

        <nav
          className="hidden items-center gap-8 text-sm font-medium text-black/60 md:flex"
          aria-label="เมนูหลัก"
        >
          {navigationItems.map((item) => (
            <a className="transition-colors hover:text-black" href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <Button asChild className="rounded-xl bg-black px-4 text-white hover:bg-black/80">
          <Link href="/dashboard">
            เริ่มใช้งาน
            <ArrowUpRight />
          </Link>
        </Button>
      </div>
    </header>
  );
}
