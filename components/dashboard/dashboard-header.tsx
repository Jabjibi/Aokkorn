import { Plus } from "lucide-react";
import { AppBrand } from "@/components/shared/app-brand";
import { ProfileChip } from "@/components/shared/profile-chip";
import { Button } from "@/components/ui/button";

type DashboardHeaderProps = {
  profile: { name: string; initial: string };
  onCreateTrip: () => void;
  canCreate: boolean;
};

export function DashboardHeader({ profile, onCreateTrip, canCreate }: DashboardHeaderProps) {
  return (
    <>
      <header className="sticky top-0 z-30 hidden border-b border-black/8 bg-white/90 backdrop-blur-xl md:block">
        <div className="mx-auto flex h-20 max-w-7xl items-center px-6 lg:px-8">
          <AppBrand />
          <nav
            className="ml-14 flex items-center gap-8 text-sm font-semibold"
            aria-label="เมนูหลัก"
          >
            <a className="text-black" href="#trips" aria-current="page">
              ทริปของฉัน
            </a>
            <a className="text-black/45 transition-colors hover:text-black" href="#summary">
              สรุปยอด
            </a>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Button
              className="h-11 rounded-xl bg-[#cfff47] px-5 font-bold text-black shadow-none hover:bg-[#bced39]"
              onClick={onCreateTrip}
              disabled={!canCreate}
            >
              <Plus /> สร้างทริป
            </Button>
            <ProfileChip profile={profile} />
          </div>
        </div>
      </header>

      <header className="sticky top-0 z-30 border-b border-black/8 bg-white/92 px-4 backdrop-blur-xl md:hidden">
        <div className="flex h-17 items-center justify-between">
          <AppBrand compact />
          <ProfileChip profile={profile} compact />
        </div>
      </header>
    </>
  );
}
