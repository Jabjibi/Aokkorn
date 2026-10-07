import type { Currency } from "@/lib/hooks/dashboard/dashboard-data";
import { getCurrencyDigits } from "@/lib/hooks/dashboard/currency-data";
import type { TripExpense, TripLedger } from "@/lib/hooks/trip/trip-types";

const MAX_MINOR = BigInt(Number.MAX_SAFE_INTEGER);

export function getSourceCurrency(expense: TripExpense, baseCurrency: Currency) {
  return expense.currency ?? baseCurrency;
}

export function getConvertedAmountMinor(expense: TripExpense) {
  return expense.convertedAmountMinor ?? expense.amountMinor;
}

export function getRequiredRates(ledger: TripLedger, baseCurrency: Currency, target: Currency) {
  return [
    ...new Set(ledger.expenses.map((expense) => getSourceCurrency(expense, baseCurrency))),
  ].filter((currency) => currency !== target);
}

export function parseExchangeRate(value: string) {
  const input = value.trim();
  if (input.length > 32 || !/^\d+(?:\.\d{1,12})?$/.test(input)) return null;
  const [whole, fraction = ""] = input.split(".");
  const scale = BigInt(10) ** BigInt(fraction.length);
  const numerator = BigInt(whole) * scale + BigInt(fraction || "0");
  return numerator > BigInt(0) ? { numerator, scale } : null;
}

export function convertAmountMinor(
  amountMinor: number,
  from: Currency,
  to: Currency,
  rate: string,
) {
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 0) return null;
  if (from === to) return amountMinor;
  const parsed = parseExchangeRate(rate);
  if (!parsed) return null;

  const numerator =
    BigInt(amountMinor) * parsed.numerator * BigInt(10) ** BigInt(getCurrencyDigits(to));
  const denominator = parsed.scale * BigInt(10) ** BigInt(getCurrencyDigits(from));
  const rounded = (numerator + denominator / BigInt(2)) / denominator;
  return rounded <= MAX_MINOR ? Number(rounded) : null;
}

export function convertLedgerCurrency(
  ledger: TripLedger,
  currentBase: Currency,
  target: Currency,
  rates: Partial<Record<Currency, string>>,
  capturedAt: string,
): TripLedger | null {
  const expenses: TripExpense[] = [];
  let totalMinor = 0;

  for (const expense of ledger.expenses) {
    const source = getSourceCurrency(expense, currentBase);
    const rate = source === target ? "1" : rates[source];
    if (!rate) return null;
    const convertedAmountMinor = convertAmountMinor(expense.amountMinor, source, target, rate);
    if (convertedAmountMinor === null) return null;
    totalMinor += convertedAmountMinor;
    if (!Number.isSafeInteger(totalMinor)) return null;

    expenses.push({
      ...expense,
      currency: source,
      convertedAmountMinor,
      conversionHistory:
        source === target
          ? (expense.conversionHistory ?? [])
          : [
              ...(expense.conversionHistory ?? []),
              {
                fromCurrency: source,
                toCurrency: target,
                rate,
                source: "manual",
                capturedAt,
                convertedAmountMinor,
              },
            ],
    });
  }

  return { ...ledger, expenses };
}
