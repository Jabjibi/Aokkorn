export function ProfileChip({
  profile,
  compact = false,
}: {
  profile: { name: string; initial: string };
  compact?: boolean;
}) {
  return (
    <div className="flex h-11 items-center gap-2 rounded-xl bg-black/[0.045] px-2.5 pr-3 text-sm font-bold">
      <span className="grid size-7 place-items-center rounded-lg bg-black text-xs font-black text-[#cfff47]">
        {profile.initial}
      </span>
      {!compact && profile.name}
    </div>
  );
}
