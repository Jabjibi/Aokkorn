type SegmentedTab = {
  id: string;
  label: string;
  onSelect: () => void;
};

export function SegmentedTabs({
  tabs,
  activeId,
  label,
}: {
  tabs: SegmentedTab[];
  activeId: string;
  label: string;
}) {
  return (
    <nav aria-label={label} className="rounded-2xl bg-[#f2f3f0] p-1.5">
      <div className="grid grid-cols-3 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            aria-pressed={activeId === tab.id}
            onClick={tab.onSelect}
            className={`min-h-8 rounded-xl px-2 py-1.5 text-center text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:min-h-10 sm:py-2 sm:text-sm ${
              activeId === tab.id
                ? "bg-white text-black shadow-sm"
                : "text-black/45 hover:bg-white/50 hover:text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
