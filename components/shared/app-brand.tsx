import Link from "next/link";
import { WalletCards } from "lucide-react";

export function AppBrand({ href = "/", compact = false }: { href?: string; compact?: boolean }) {
  return (
    <Link href={href} className="flex items-center gap-2.5" aria-label="Aokkorn หน้าแรก">
      <span
        className={`${compact ? "size-8" : "size-9"} grid place-items-center rounded-xl bg-black text-[#cfff47]`}
      >
        <WalletCards className={compact ? "size-4" : "size-5"} />
      </span>
      <span
        className={`${compact ? "text-lg" : "text-xl"} font-black tracking-[-0.04em] text-black`}
      >
        Aokkorn
      </span>
      <span className="size-1.5 rounded-full bg-[#b8f238]" aria-hidden="true" />
    </Link>
  );
}
