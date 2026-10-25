import type { CurrencyInfo, Money } from "./trip-contract";

export function formatApiMoney(amount: Money, currencies: CurrencyInfo[]): string {
  const currency = currencies.find((item) => item.code === amount.currency);

  if (!currency) {
    throw new Error("Missing currency metadata");
  }

  const decimalPlaces = currency.minorUnitDigits;
  const minorUnitScale = BigInt(10) ** BigInt(decimalPlaces);

  const amountMinor = BigInt(amount.minor);
  const wholeAmount = amountMinor / minorUnitScale;
  const fractionAmount = amountMinor % minorUnitScale;
  const fractionDigits = fractionAmount === BigInt(0) ? 0 : decimalPlaces;

  const formatter = new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: amount.currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

  // ใช้ BigInt เพื่อรักษาสตางค์ของยอดที่เกินขอบเขต Number
  const parts = formatter.formatToParts(wholeAmount);
  const fractionText = fractionAmount.toString().padStart(decimalPlaces, "0");

  return parts
    .map((part) => {
      if (part.type === "fraction") {
        return fractionText;
      }

      return part.value;
    })
    .join("");
}

export function averageMoney(total: Money, count: number): Money {
  const divisor = BigInt(count || 1);
  const totalMinor = BigInt(total.minor);

  // ปัด half-up สำหรับแสดงค่าเฉลี่ย ไม่ใช้เป็นยอดหนี้
  const roundingOffset = divisor / BigInt(2);
  const averageMinor = (totalMinor + roundingOffset) / divisor;

  return {
    ...total,
    minor: averageMinor.toString(),
  };
}

export function currencyLabel(code: string): string {
  const displayNames = new Intl.DisplayNames(["th"], { type: "currency" });
  const name = displayNames.of(code) ?? code;

  return `${name} (${code})`;
}
