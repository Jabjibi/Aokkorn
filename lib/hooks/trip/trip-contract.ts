import { ApiRequestError } from "@/lib/hooks/api-client";

export type Money = {
  minor: string;
  currency: string;
};

export type CurrencyInfo = {
  code: string;
  symbol: string;
  minorUnitDigits: number;
};

export type Trip = {
  id: string;
  name: string;
  baseCurrency: string;
  createdAt: string;
  updatedAt: string;
  participantCount: number;
  expenseCount: number;
  total: Money;
  originalTotals: Money[];
};

export type Participant = {
  id: string;
  displayName: string;
  isOwner: boolean;
};

export type TripDay = {
  id: string;
  name: string;
  total: Money;
  expenseCount: number;
};

export type TripDetail = Trip & {
  participants: Participant[];
  days: TripDay[];
};

export type TripList = {
  items: Trip[];
  quota: {
    used: number;
    limit: number;
    remaining: number;
  };
  totalsByCurrency: Money[];
};

export type Expense = {
  id: string;
  dayId: string;
  name: string;
  amount: Money;
  converted: Money;
};

export type Obligation = {
  id: string;
  expenseName: string;
  debtorParticipantId: string;
  creditorParticipantId: string;
  amount: Money;
  status: "paid" | "unpaid";
};

export type TripSummary = {
  trip: TripDetail;
  expenses: Expense[];
  obligations: Obligation[];
  obligationTotals: {
    paid: Money[];
    unpaid: Money[];
  };
};

function invalid(): never {
  throw new ApiRequestError(502, "INVALID_RESPONSE");
}

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return invalid();
  }

  return value as Record<string, unknown>;
}

function text(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) {
    return invalid();
  }

  return value;
}

function uuid(value: unknown): string {
  const id = text(value);

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return invalid();
  }

  return id;
}

function count(value: unknown): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    return invalid();
  }

  return value;
}

function array<T>(value: unknown, parse: (item: unknown) => T): T[] {
  if (!Array.isArray(value)) {
    return invalid();
  }

  return value.map(parse);
}

function currency(value: unknown): string {
  const code = text(value);

  if (!/^[A-Z]{3}$/.test(code)) {
    return invalid();
  }

  return code;
}

function date(value: unknown): string {
  const result = text(value);

  if (!Number.isFinite(Date.parse(result))) {
    return invalid();
  }

  return result;
}

function money(value: unknown): Money {
  const row = object(value);
  const minor = text(row.minor);

  if (!/^(0|[1-9]\d*)$/.test(minor) || minor.length > 30) {
    return invalid();
  }

  return { minor, currency: currency(row.currency) };
}

export function parseCurrencies(value: unknown): CurrencyInfo[] {
  return array(value, (item) => {
    const row = object(item);
    const digits = count(row.minorUnitDigits);

    if (digits > 4) {
      return invalid();
    }

    return { code: currency(row.code), symbol: text(row.symbol), minorUnitDigits: digits };
  });
}

export function parseTrip(value: unknown): Trip {
  const row = object(value);
  const baseCurrency = currency(row.baseCurrency);
  const total = money(row.total);

  if (total.currency !== baseCurrency) {
    return invalid();
  }

  return {
    id: uuid(row.id),
    name: text(row.name),
    baseCurrency,
    total,
    createdAt: date(row.createdAt),
    updatedAt: date(row.updatedAt),
    participantCount: count(row.participantCount),
    expenseCount: count(row.expenseCount),
    originalTotals: array(row.originalTotals, money),
  };
}

export function parseTripDetail(value: unknown): TripDetail {
  const row = object(value);
  const trip = parseTrip(value);

  return {
    ...trip,
    participants: array(row.participants, (item) => {
      const person = object(item);

      if (typeof person.isOwner !== "boolean") {
        return invalid();
      }

      return {
        id: uuid(person.id),
        displayName: text(person.displayName),
        isOwner: person.isOwner,
      };
    }),
    days: array(row.days, (item) => {
      const day = object(item);
      const total = money(day.total);

      if (total.currency !== trip.baseCurrency) {
        return invalid();
      }

      return {
        id: uuid(day.id),
        name: text(day.name),
        total,
        expenseCount: count(day.expenseCount),
      };
    }),
  };
}

export function parseTripList(value: unknown): TripList {
  const row = object(value);
  const quota = object(row.quota);
  const items = array(row.items, parseTrip);
  const used = count(quota.used);
  const limit = count(quota.limit);
  const remaining = count(quota.remaining);

  if (used !== items.length || used > limit || remaining !== limit - used) {
    return invalid();
  }

  return {
    items,
    quota: { used, limit, remaining },
    totalsByCurrency: array(row.totalsByCurrency, money),
  };
}

export function parseTripSummary(value: unknown): TripSummary {
  const row = object(value);
  const trip = parseTripDetail(row.trip);
  const totals = object(row.obligationTotals);
  const expenses = array(row.expenses, (item) => {
    const expense = object(item);
    const amount = money(expense.amount);
    const fx = expense.fxSnapshot == null ? null : object(expense.fxSnapshot);
    const converted = fx ? money(fx.converted) : amount;

    if (converted.currency !== trip.baseCurrency || expense.tripId !== trip.id) {
      return invalid();
    }

    const dayId = uuid(expense.dayId);

    if (!trip.days.some((day) => day.id === dayId)) {
      return invalid();
    }

    return { id: uuid(expense.id), dayId, name: text(expense.name), amount, converted };
  });

  if (expenses.length !== trip.expenseCount) {
    return invalid();
  }

  const obligations = array(row.obligations, (item) => {
    const entry = object(item);

    if (entry.status !== "paid" && entry.status !== "unpaid") {
      return invalid();
    }

    return {
      id: uuid(entry.id),
      expenseName: text(entry.expenseName),
      debtorParticipantId: uuid(entry.debtorParticipantId),
      creditorParticipantId: uuid(entry.creditorParticipantId),
      amount: money(entry.amount),
      status: entry.status,
    } satisfies Obligation;
  });

  return {
    trip,
    expenses,
    obligations,
    obligationTotals: {
      paid: array(totals.paid, money),
      unpaid: array(totals.unpaid, money),
    },
  };
}

export function assertCurrencyMetadata(currencies: CurrencyInfo[], amounts: Money[]): void {
  if (
    !currencies.length ||
    new Set(currencies.map((item) => item.code)).size !== currencies.length
  ) {
    return invalid();
  }

  if (amounts.some((amount) => !currencies.some((item) => item.code === amount.currency))) {
    return invalid();
  }
}
