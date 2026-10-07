import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { AppBrand } from "@/components/shared/app-brand";
import { Button } from "@/components/ui/button";
import { navigationItems } from "@/lib/landing-content";

export function Brand({ compact = false }: { compact?: boolean }) {
  return <AppBrand href="#top" compact={compact} />;
}

export function SiteHeader() {
  return (
    <header id="top" className="relative z-20 mx-auto max-w-[1440px] px-5 pt-6 sm:px-8 lg:px-12">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-5 border-b border-white/20 pb-5">
        <div className="rounded-2xl bg-white px-2 py-2 shadow-sm sm:px-3">
          <Brand compact />
        </div>
        <nav
          className="order-3 flex w-full flex-wrap justify-center gap-2 md:order-none md:w-auto"
          aria-label="เมนูหลัก"
        >
          {navigationItems.map((item) => (
            <a
              className="rounded-full border border-white/35 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <Button
          asChild
          variant="outline"
          className="h-10 rounded-full border-white bg-transparent px-4 text-xs text-white hover:bg-white hover:text-[#0038ff] sm:px-5 sm:text-sm"
        >
          <Link href="/dashboard">
            เริ่มใช้งาน <ArrowUpRight />
          </Link>
        </Button>
      </div>
    </header>
  );
}
