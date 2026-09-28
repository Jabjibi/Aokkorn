import { BarChart3, Home, Plus } from "lucide-react";

export function MobileNavigation({
  onCreateTrip,
  canCreate,
}: {
  onCreateTrip: () => void;
  canCreate: boolean;
}) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 px-4 pb-[max(0.65rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden"
      aria-label="เมนูมือถือ"
    >
      <div className="mx-auto grid h-[4.65rem] max-w-md grid-cols-3 items-end">
        <a
          href="#trips"
          className="flex h-15 flex-col items-center justify-end gap-1 pb-1 text-[0.68rem] font-bold text-black"
          aria-current="page"
        >
          <Home className="size-5" />
          หน้าหลัก
        </a>
        <button
          type="button"
          className="group flex h-20 flex-col items-center justify-end gap-1 text-[0.68rem] font-bold text-black disabled:opacity-45"
          onClick={onCreateTrip}
          disabled={!canCreate}
        >
          <span className="grid size-14 place-items-center rounded-2xl bg-black text-[#cfff47] shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-transform group-active:scale-95">
            <Plus className="size-7" strokeWidth={2.2} />
          </span>
          ทริปใหม่
        </button>
        <a
          href="#summary"
          className="flex h-15 flex-col items-center justify-end gap-1 pb-1 text-[0.68rem] font-bold text-black/42"
        >
          <BarChart3 className="size-5" />
          สรุปยอด
        </a>
      </div>
    </nav>
  );
}
