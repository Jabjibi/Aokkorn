import type { MouseEventHandler, ReactNode, RefObject } from "react";
import { X } from "lucide-react";

type AppDialogProps = {
  titleId: string;
  descriptionId: string;
  dialogRef: RefObject<HTMLElement | null>;
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
  onClose: () => void;
  onBackdropMouseDown: MouseEventHandler<HTMLDivElement>;
};

export function AppDialog({
  titleId,
  descriptionId,
  dialogRef,
  icon,
  title,
  description,
  children,
  onClose,
  onBackdropMouseDown,
}: AppDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="presentation"
      onMouseDown={onBackdropMouseDown}
    >
      <section
        ref={dialogRef}
        className="max-h-[calc(100dvh-1rem)] w-full max-w-lg overflow-y-auto rounded-t-[1.75rem] bg-white p-6 shadow-2xl sm:rounded-[1.75rem] sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <div className="flex items-start justify-between gap-5">
          <div>
            <span className="grid size-11 place-items-center rounded-2xl bg-[#efffc5]">{icon}</span>
            <h2 id={titleId} className="mt-5 text-xl font-black tracking-[-0.035em] lg:text-2xl">
              {title}
            </h2>
            <p
              id={descriptionId}
              className="mt-1.5 text-xs leading-5 text-black/45 lg:text-sm lg:leading-6"
            >
              {description}
            </p>
          </div>
          <button
            type="button"
            className="grid size-9 shrink-0 place-items-center rounded-xl bg-black/[0.045] text-black/55 transition-colors hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            onClick={onClose}
            aria-label="ปิดหน้าต่าง"
          >
            <X className="size-5" />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
