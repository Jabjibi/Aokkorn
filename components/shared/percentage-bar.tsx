export function PercentageBar({ percentage }: { percentage: number }) {
  const width = `${Math.min(100, Math.max(percentage, 2))}%`;

  return (
    <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/5">
      <div className="h-full rounded-full bg-primary" style={{ width }} />
    </div>
  );
}
