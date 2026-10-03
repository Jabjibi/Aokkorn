type DonutStatProps = {
  value: string | number;
  label: string;
  fillPercent: number;
  ariaLabel: string;
};

export function DonutStat({ value, label, fillPercent, ariaLabel }: DonutStatProps) {
  const fill = Math.min(100, Math.max(0, fillPercent));
  const background =
    fill === 0
      ? "conic-gradient(#e9ece3 0% 100%)"
      : `conic-gradient(from -90deg, #cfff47 0% ${fill}%, #e9ece3 ${fill}% 100%)`;

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className="grid size-27 shrink-0 place-items-center rounded-full p-3 shadow-[0_6px_20px_rgba(40,60,5,0.13)] sm:size-40 sm:p-4"
      style={{ background }}
    >
      <div className="flex size-full flex-col items-center justify-center rounded-full bg-white text-center shadow-[inset_0_1px_4px_rgba(0,0,0,0.06)]">
        <span className="text-xl font-black tabular-nums sm:text-3xl">{value}</span>
        <span className="text-[10px] text-black/50 sm:text-xs">{label}</span>
      </div>
    </div>
  );
}
