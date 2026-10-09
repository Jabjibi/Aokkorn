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
import {
  MAX_TRIPS,
  currencyOptions,
  type Currency,
  type Trip,
  type TripView,
} from "@/lib/hooks/dashboard/dashboard-data";
import { formatAmount } from "@/lib/hooks/dashboard/format-amount";
import { addTrip, nextTripId, useTrips } from "@/lib/hooks/dashboard/use-trips";

export function useDashboard() {
  const { trips, ready: tripsReady } = useTrips();
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setNameValue] = useState("");
  const [currency, setCurrency] = useState<Currency>("THB");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const createButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const dialogTitleId = useId();
  const dialogDescriptionId = useId();
  const dialogErrorId = useId();

  const tripCount = trips.length;
  const canCreate = tripsReady && tripCount < MAX_TRIPS;
  const sortLabel = sortNewestFirst ? "อัปเดตล่าสุด" : "เก่าสุดก่อน";

  const totalLabel = useMemo(
    () =>
      formatAmount(
        trips.reduce((sum, trip) => sum + (trip.currency === "THB" ? trip.amountMinor : 0), 0),
        "THB",
      ),
    [trips],
  );

  const visibleTrips = useMemo<TripView[]>(
    () =>
      [...trips]
        .sort((a, b) => (sortNewestFirst ? b.id - a.id : a.id - b.id))
        .map((trip) => ({ ...trip, totalLabel: formatAmount(trip.amountMinor, trip.currency) })),
    [trips, sortNewestFirst],
  );

  const closeCreateTrip = useCallback(() => {
    setIsCreateOpen(false);
    setError("");
  }, []);

  useEffect(() => {
    if (!isCreateOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeCreateTrip();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

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
    if (!canCreate) return;

    triggerRef.current = event?.currentTarget ?? createButtonRef.current;
    setNameValue("");
    setCurrency("THB");
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
    setCurrency(event.target.value as Currency);
  }

  function submitCreateTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedName = name.trim();

    if (!normalizedName) {
      setError("ใส่ชื่อทริปก่อนสร้าง เช่น เชียงใหม่หน้าหนาว");
      inputRef.current?.focus();
      return;
    }

    if (!canCreate) {
      setError("คุณมีทริปครบ 5 ทริปแล้ว ต้องลบทริปเก่าก่อนสร้างใหม่");
      return;
    }

    const trip: Trip = {
      id: nextTripId(),
      name: normalizedName,
      createdAt: "วันนี้",
      amountMinor: 0,
      currency,
      expenseCount: 0,
      peopleCount: 1,
      participants: [],
      status: "draft",
    };

    addTrip(trip);
    setNotice(`สร้าง “${normalizedName}” แล้ว`);
    closeCreateTrip();
  }

  function handleBackdropMouseDown(event: MouseEvent<HTMLDivElement>) {
    if (event.currentTarget === event.target) closeCreateTrip();
  }

  return {
    trips: visibleTrips,
    tripCount,
    maxTrips: MAX_TRIPS,
    canCreate,
    sortLabel,
    totalLabel,
    isCreateOpen,
    name,
    currency,
    currencyOptions,
    error,
    notice,
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
