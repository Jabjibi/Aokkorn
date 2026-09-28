import { ArrowUpRight } from "lucide-react";
import { Brand } from "./site-header";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/10 bg-white px-5 py-10 sm:px-8 lg:px-12" data-footer>
      <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Brand />
          <p className="mt-4 text-sm text-black/45">ออกก่อน แล้วไปสนุกด้วยกัน</p>
        </div>
        <a className="flex items-center gap-2 text-sm font-bold text-black" href="#top">
          กลับด้านบน <ArrowUpRight className="size-4" />
        </a>
      </div>
    </footer>
  );
}
