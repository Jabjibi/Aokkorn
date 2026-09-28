import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string };

export function FormSelect({
  className,
  options,
  ...props
}: Omit<React.ComponentProps<"select">, "children"> & { options: readonly Option[] }) {
  return (
    <div className={cn("relative", className)}>
      <select
        className="h-12 w-full appearance-none rounded-xl border border-black/12 bg-[#f8f8f5] px-4 pr-11 text-xs transition outline-none focus-visible:border-black focus-visible:ring-3 focus-visible:ring-[#cfff47]/45 lg:text-sm"
        {...props}
      >
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-black/45" />
    </div>
  );
}
