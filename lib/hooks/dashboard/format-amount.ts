import type { Currency } from "@/lib/hooks/dashboard/dashboard-data";
import { getCurrencyDigits } from "@/lib/hooks/dashboard/currency-data";

export function formatAmount(amountMinor: number, currency: Currency) {
  const digits = getCurrencyDigits(currency);
  const scale = 10 ** digits;
  const fractionDigits = amountMinor % scale !== 0 ? digits : 0;
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amountMinor / scale);
}

export function formatNumber(amountMinor: number, currency: Currency) {
  const digits = getCurrencyDigits(currency);
  const scale = 10 ** digits;
  const fractionDigits = amountMinor % scale !== 0 ? digits : 0;
  return new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amountMinor / scale);
}

export function formatAverage(amountMinor: number, currency: Currency) {
  const fractionDigits = getCurrencyDigits(currency);

  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amountMinor / 10 ** fractionDigits);
}

export function formatShare(amountMinor: number, currency: Currency) {
  const digits = getCurrencyDigits(currency);
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(amountMinor / 10 ** digits);
}
