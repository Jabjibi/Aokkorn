import { averageMoney, currencyLabel, formatApiMoney } from "./format-api-money";
import type { CurrencyInfo, TripSummary } from "./trip-contract";

export function tripDetailView(snapshot: TripSummary, currencies: CurrencyInfo[]) {
  const { trip, expenses } = snapshot;

  return {
    name: trip.name,
    currency: trip.baseCurrency,
    currencyLabel: currencyLabel(trip.baseCurrency),
    expenseCount: trip.expenseCount,
    totalLabel: formatApiMoney(trip.total, currencies),
    averageLabel: formatApiMoney(averageMoney(trip.total, trip.expenseCount), currencies),
    participants: trip.participants,
    days: trip.days.map((day) => ({
      id: day.id,
      name: day.name,
      totalLabel: formatApiMoney(day.total, currencies),
      expenses: expenses
        .filter((expense) => expense.dayId === day.id)
        .map((expense) => ({
          id: expense.id,
          name: expense.name,
          amountLabel: formatApiMoney(expense.amount, currencies),
          convertedLabel:
            expense.amount.currency === trip.baseCurrency
              ? null
              : `≈ ${formatApiMoney(expense.converted, currencies)}`,
        })),
    })),
    paidLabels: snapshot.obligationTotals.paid.map((amount) => formatApiMoney(amount, currencies)),
    unpaidLabels: snapshot.obligationTotals.unpaid.map((amount) =>
      formatApiMoney(amount, currencies),
    ),
    obligations: snapshot.obligations.map((entry) => ({
      id: entry.id,
      expenseName: entry.expenseName,
      debtor:
        trip.participants.find((person) => person.id === entry.debtorParticipantId)?.displayName ??
        "ไม่พบผู้ร่วมทริป",
      creditor:
        trip.participants.find((person) => person.id === entry.creditorParticipantId)
          ?.displayName ?? "ไม่พบผู้ร่วมทริป",
      amountLabel: formatApiMoney(entry.amount, currencies),
      statusLabel: entry.status === "paid" ? "จ่ายแล้ว" : "ยังไม่จ่าย",
    })),
  };
}

export function tripSummaryView(snapshot: TripSummary, currencies: CurrencyInfo[]) {
  const { trip, expenses } = snapshot;
  const sorted = [...expenses].sort((a, b) => {
    const left = BigInt(a.converted.minor);
    const right = BigInt(b.converted.minor);

    return left === right ? a.id.localeCompare(b.id) : left > right ? -1 : 1;
  });
  const total = BigInt(trip.total.minor);

  return {
    totalLabel: formatApiMoney(trip.total, currencies),
    expenseCount: trip.expenseCount,
    averageLabel: formatApiMoney(averageMoney(trip.total, trip.expenseCount), currencies),
    highestLabel: sorted[0] ? formatApiMoney(sorted[0].converted, currencies) : "—",
    highestName: sorted[0]?.name ?? "ยังไม่มีรายการ",
    breakdown: sorted.map((expense) => {
      const percentage =
        total === BigInt(0)
          ? 0
          : Number((BigInt(expense.converted.minor) * BigInt(100) + total / BigInt(2)) / total);

      return {
        id: expense.id,
        name: expense.name,
        amountLabel: formatApiMoney(expense.converted, currencies),
        sourceLabel:
          expense.amount.currency === trip.baseCurrency
            ? null
            : formatApiMoney(expense.amount, currencies),
        percentage,
        percentageLabel: `${percentage}%`,
      };
    }),
  };
}

export type TripDetailView = ReturnType<typeof tripDetailView>;
