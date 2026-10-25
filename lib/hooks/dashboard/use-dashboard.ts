"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
} from "react";
import { useRouter } from "next/navigation";
import { useSessionAccount } from "@/lib/hooks/auth/use-session";
import { ApiRequestError, apiErrorMessage } from "@/lib/hooks/api-client";
import { createTrip } from "@/lib/hooks/trip/trip-api";
import { currencyLabel, formatApiMoney } from "@/lib/hooks/trip/format-api-money";
import { useTrips } from "@/lib/hooks/dashboard/use-trips";

export function useDashboard() {
  const { state, reload } = useTrips();
  const { session } = useSessionAccount();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const pending = useRef(false);
  const createRequest = useRef<AbortController | null>(null);

  useEffect(() => () => createRequest.current?.abort(), []);

  const [uncertain, setUncertain] = useState(false);
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setNameValue] = useState("");
  const [currency, setCurrency] = useState("THB");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const createButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const dialogTitleId = useId();
  const dialogDescriptionId = useId();
  const dialogErrorId = useId();

  const list = state.status === "ready" ? state.list : null;
  const currencies = state.status === "ready" ? state.currencies : [];
  const tripCount = list?.quota.used ?? 0;
  const maxTrips = list?.quota.limit ?? 0;
  const canCreate = Boolean(
    list && list.quota.remaining > 0 && currencies.length && !saving && !uncertain,
  );
  const sortLabel = sortNewestFirst ? "อัปเดตล่าสุด" : "เก่าสุดก่อน";
  const currencyOptions = currencies.map(({ code }) => ({
    value: code,
    label: currencyLabel(code),
  }));
  const totalLabel = list
    ? list.totalsByCurrency.map((total) => formatApiMoney(total, currencies)).join(" · ") ||
      "ยังไม่มีค่าใช้จ่าย"
    : "—";
  const visibleTrips = useMemo(() => {
    if (state.status !== "ready") {
      return [];
    }

    return [...state.list.items]
      .sort(
        (a, b) =>
          (sortNewestFirst ? -1 : 1) *
          (Date.parse(a.updatedAt) - Date.parse(b.updatedAt) || a.id.localeCompare(b.id)),
      )
      .map((trip) => ({
        id: trip.id,
        name: trip.name,
        createdAt: new Intl.DateTimeFormat("th-TH", {
          dateStyle: "medium",
          timeZone: "Asia/Bangkok",
        }).format(new Date(trip.createdAt)),
        expenseCount: trip.expenseCount,
        peopleCount: trip.participantCount,
        status: trip.expenseCount > 0 ? ("active" as const) : ("draft" as const),
        totalLabel: formatApiMoney(trip.total, state.currencies),
      }));
  }, [state, sortNewestFirst]);

  const closeCreateTrip = useCallback(() => {
    if (pending.current) {
      return;
    }

    setIsCreateOpen(false);
    setError("");
  }, []);

  useEffect(() => {
    if (!isCreateOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeCreateTrip();

        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (!focusable?.length) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [isCreateOpen, closeCreateTrip]);

  function openCreateTrip(event?: MouseEvent<HTMLElement>) {
    if (!canCreate) {
      return;
    }

    triggerRef.current = event?.currentTarget ?? createButtonRef.current;
    setNameValue("");
    setCurrency(currencies.some((item) => item.code === "THB") ? "THB" : currencies[0].code);
    setError("");
    setIsCreateOpen(true);
  }

  function setName(value: string) {
    setNameValue(value);
    setError("");
  }

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }

  function handleCurrencyChange(event: ChangeEvent<HTMLSelectElement>) {
    setCurrency(event.target.value);
  }

  async function submitCreateTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending.current || !canCreate) {
      return;
    }

    const trimmedName = name.trim();

    if (!trimmedName || [...trimmedName].length > 80 || /[\p{Cc}\p{Cf}]/u.test(trimmedName)) {
      setError("กรุณาใส่ชื่อทริปไม่เกิน 80 ตัวอักษร และไม่มีอักขระควบคุม");

      return;
    }

    if (!currencies.some((item) => item.code === currency)) {
      setError("กรุณาเลือกสกุลเงินที่รองรับ");

      return;
    }

    pending.current = true;

    const controller = new AbortController();

    createRequest.current = controller;
    setSaving(true);
    setError("");

    try {
      const trip = await createTrip(
        { name: trimmedName, baseCurrency: currency },
        session.csrfToken,
        controller.signal,
      );

      if (controller.signal.aborted) {
        return;
      }

      setIsCreateOpen(false);
      router.push(`/dashboard/trips/${trip.id}`);
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }

      if (error instanceof ApiRequestError && error.status === 401) {
        setIsCreateOpen(false);
        router.replace("/?login=required");
      } else if (!(error instanceof ApiRequestError) || error.status === 0 || error.status >= 500) {
        // คำขออาจบันทึกแล้วแม้ไม่ได้คำตอบ; ต้องตรวจรายการก่อนเปิดให้สร้างซ้ำ
        setUncertain(true);
        setError("ยังยืนยันผลการบันทึกไม่ได้ กรุณาปิดหน้าต่างแล้วกดโหลดรายการใหม่ก่อนสร้างซ้ำ");
      } else {
        setError(apiErrorMessage(error));

        if (error.code === "AOK-2101") {
          reload();
        }
      }
    } finally {
      pending.current = false;

      if (!controller.signal.aborted) {
        setSaving(false);
      }
    }
  }

  function retry() {
    setUncertain(false);
    reload();
  }

  function handleBackdropMouseDown(event: MouseEvent<HTMLDivElement>) {
    if (event.currentTarget === event.target) {
      closeCreateTrip();
    }
  }

  return {
    status: state.status,
    loadError: state.status === "error" ? state.message : "",
    retry,
    saving,
    canSubmit: canCreate && Boolean(name.trim()),
    createDisabledMessage: uncertain
      ? "กรุณาโหลดรายการใหม่เพื่อตรวจผลการบันทึก"
      : list?.quota.remaining === 0
        ? "คุณมีทริปครบจำนวนที่ใช้ได้แล้ว"
        : "",
    uncertain,
    trips: visibleTrips,
    tripCount,
    maxTrips,
    canCreate,
    sortLabel,
    totalLabel,
    isCreateOpen,
    name,
    currency,
    currencyOptions,
    error,
    inputRef,
    dialogRef,
    dialogTitleId,
    dialogDescriptionId,
    dialogErrorId,
    createButtonRef,
    openCreateTrip,
    closeCreateTrip,
    submitCreateTrip,
    handleBackdropMouseDown,
    onNameChange: handleNameChange,
    onCurrencyChange: handleCurrencyChange,
    toggleSort: () => setSortNewestFirst((current) => !current),
  };
}
