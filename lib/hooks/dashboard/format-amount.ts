import type { Currency } from "@/lib/hooks/dashboard/dashboard-data";

const currencyDecimals: Record<Currency, number> = { THB: 2, JPY: 0, USD: 2 };

export function formatAmount(amountMinor: number, currency: Currency) {
  const fractionDigits = currency !== "JPY" && amountMinor % 100 !== 0 ? 2 : 0;
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amountMinor / 10 ** currencyDecimals[currency]);
}

export function formatNumber(amountMinor: number, currency: Currency) {
  const fractionDigits = currency !== "JPY" && amountMinor % 100 !== 0 ? 2 : 0;
  return new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amountMinor / 10 ** currencyDecimals[currency]);
}

export function formatAverage(amountMinor: number, currency: Currency) {
  const fractionDigits = currency === "JPY" ? 0 : 2;

  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amountMinor / 10 ** currencyDecimals[currency]);
}

export function formatShare(amountMinor: number, currency: Currency) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(amountMinor / 10 ** currencyDecimals[currency]);
}
