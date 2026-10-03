import type { ChangeEvent, FormEvent } from "react";
import { CirclePlus } from "lucide-react";
import { RemovableChip } from "@/components/shared/removable-chip";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export type ParticipantsCardForm = {
  open: boolean;
  name: string;
  error: string;
  onOpen: () => void;
  onClose: () => void;
  onNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function ParticipantsCard({
  participants,
  friendForm,
}: {
  participants: { id: number; name: string; onRemove: () => void }[];
  friendForm: ParticipantsCardForm;
}) {
  return (
    <Card className="mt-5 gap-0 rounded-[1.75rem] border-black/10 p-4 shadow-none sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold sm:text-lg">เพื่อนร่วมทริป</h3>
        <span className="rounded-full bg-[#f2f2f0] px-3 py-1 text-[11px] font-semibold text-black/50 sm:text-xs">
          {participants.length} คน
        </span>
      </div>

      {participants.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {participants.map((participant) => (
            <li key={participant.id}>
              <RemovableChip
                label={participant.name}
                onRemove={participant.onRemove}
                removeLabel={`นำ ${participant.name} ออกจากทริป`}
              />
            </li>
          ))}
        </ul>
      )}

      {friendForm.open ? (
        <form onSubmit={friendForm.onSubmit} className="mt-4 flex flex-wrap items-start gap-2">
          <div className="min-w-36 flex-1">
            <label htmlFor="split-friend-name" className="sr-only">
              ชื่อเพื่อน
            </label>
            <Input
              id="split-friend-name"
              value={friendForm.name}
              onChange={friendForm.onNameChange}
              maxLength={50}
              placeholder="ชื่อเพื่อน"
              className="h-9 rounded-full text-xs focus-visible:border-black/30 focus-visible:ring-0 sm:text-sm"
            />
            {friendForm.error && (
              <p role="alert" className="mt-1 pl-3 text-[11px] text-red-600">
                {friendForm.error}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="h-9 rounded-full bg-primary px-4 text-xs text-black hover:bg-[#b8ed37] sm:text-sm"
          >
            เพิ่ม
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={friendForm.onClose}
            className="h-9 rounded-full px-3 text-xs sm:text-sm"
          >
            ยกเลิก
          </Button>
        </form>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={friendForm.onOpen}
          className="mt-4 h-9 rounded-full border-dashed border-black/15 px-4 text-xs text-black/55 shadow-none hover:border-black/30 hover:bg-[#f8f8f6] sm:text-sm"
        >
          <CirclePlus className="size-3.5" /> เพิ่มเพื่อน
        </Button>
      )}
    </Card>
  );
}
