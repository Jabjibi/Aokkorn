export function formatMoney(cents: number) {
  return new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function parseExpenseInput(value: string) {
  const match = value.trim().match(/^(.*?)\s+(\d[\d,]*(?:\.\d{1,2})?)$/);

  if (!match) return null;

  const [, rawName, rawAmount] = match;
  const name = rawName.trim();
  const normalizedAmount = rawAmount.replaceAll(",", "");

  if (!name || !/^\d{1,7}(?:\.\d{1,2})?$/.test(normalizedAmount)) return null;

  const [whole, fraction = ""] = normalizedAmount.split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));

  if (!Number.isSafeInteger(cents) || cents <= 0) return null;

  return { name, cents };
}
