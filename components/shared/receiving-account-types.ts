import type { ChangeEventHandler, FormEventHandler } from "react";

export type ReceivingAccountView = {
  name: string;
  method: "promptpay" | "bank";
  bankName: string;
  number: string;
  valid: boolean;
  message: string;
  formOpen: boolean;
  isEditing: boolean;
  saved: {
    name: string;
    methodLabel: string;
    method: "promptpay" | "bank";
    displayNumber: string;
  } | null;
  pendingDelete: boolean;
  copyMessage: string;
  onNameChange: ChangeEventHandler<HTMLInputElement>;
  onNumberChange: ChangeEventHandler<HTMLInputElement>;
  onBankNameChange: ChangeEventHandler<HTMLInputElement>;
  onSelectPromptPay: () => void;
  onSelectBank: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onEdit: () => void;
  onCancelEdit: () => void;
  onRequestDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  onCopy: () => void;
};
