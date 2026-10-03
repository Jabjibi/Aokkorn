import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RemovableChip({
  label,
  onRemove,
  removeLabel,
}: {
  label: string;
  onRemove: () => void;
  removeLabel: string;
}) {
  return (
    <span className="flex items-center gap-1 rounded-full border border-black/10 bg-[#f8f8f6] py-1 pr-1 pl-3 text-xs sm:text-sm">
      <span>{label}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onRemove}
        aria-label={removeLabel}
        className="size-6 rounded-full text-black/45 hover:bg-black/5 hover:text-black"
      >
        <X className="size-3.5" />
      </Button>
    </span>
  );
}
