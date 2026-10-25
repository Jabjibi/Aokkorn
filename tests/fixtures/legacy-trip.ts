export const trip = {
  id: 1,
  name: "ทริปของฉัน",
  createdAt: "วันนี้",
  amountMinor: 12000,
  currency: "THB",
  expenseCount: 1,
  peopleCount: 2,
  participants: [{ id: 1, name: "เพื่อน" }],
  status: "active",
};

export const ledger = {
  dayCount: 1,
  expenses: [{ id: 1, tripId: 1, day: 1, name: "อาหาร", amountMinor: 12000, currency: "THB" }],
};

/** Test fixture เท่านั้น: เติมข้อมูลเดิมก่อน spy เพื่อยืนยันว่าแอปไม่เขียนทับหลังเปิดหน้า */
export function seedLegacyTrip() {
  window.localStorage.setItem("aokkorn-trips-v1", JSON.stringify([trip]));
  window.localStorage.setItem("aokkorn-trip-ledger-v1-1", JSON.stringify(ledger));
  window.localStorage.setItem("aokkorn-payment-account-v1", "existing-private-account");
}
