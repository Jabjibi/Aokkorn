import { cn } from "@/lib/utils";

export function CircularLinkBadge({
  href,
  label,
  textPathId,
  className,
}: {
  href: string;
  label: string;
  textPathId: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className={cn(
        "group relative block size-28 shrink-0 rounded-full border-[3px] border-[#c1ed35] bg-[#d5ff52] text-black transition-transform hover:scale-105 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white sm:size-36",
        className,
      )}
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full motion-safe:animate-[spin_24s_linear_infinite]"
        aria-hidden="true"
      >
        <defs>
          <path id={textPathId} d="M13 50a37 37 0 1 1 74 0a37 37 0 1 1-74 0" />
        </defs>
        <text
          fill="currentColor"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="11"
          fontWeight="900"
          textLength="224"
          lengthAdjust="spacing"
        >
          <textPath href={`#${textPathId}`}>GET STARTED FOR FREE •</textPath>
        </text>
      </svg>
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M39 58C44 52 48 46 46 40C44 35 52 34 62 39M56 33L63 39L57 46" />
      </svg>
    </a>
  );
}
