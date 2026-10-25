export const tripId = "11111111-1111-4111-8111-111111111111";

export const dayId = "22222222-2222-4222-8222-222222222222";

export const ownerId = "33333333-3333-4333-8333-333333333333";

export const guestId = "44444444-4444-4444-8444-444444444444";

export const currencies = [
  { code: "THB", symbol: "฿", minorUnitDigits: 2 },
  { code: "JPY", symbol: "¥", minorUnitDigits: 0 },
  { code: "USD", symbol: "$", minorUnitDigits: 2 },
];

export const apiTrip = {
  id: tripId,
  name: "ทริปจริง",
  baseCurrency: "THB",
  createdAt: "2026-10-24T00:00:00Z",
  updatedAt: "2026-10-24T00:00:00Z",
  participantCount: 2,
  expenseCount: 1,
  total: { minor: "20000", currency: "THB" },
  originalTotals: [{ minor: "20000", currency: "THB" }],
};

export const tripDetail = {
  ...apiTrip,
  participants: [
    { id: ownerId, displayName: "ฉัน", isOwner: true },
    { id: guestId, displayName: "เพื่อน", isOwner: false },
  ],
  days: [{ id: dayId, name: "วันเดินทาง", expenseCount: 1, total: apiTrip.total }],
};

export const tripList = {
  items: [apiTrip],
  quota: { used: 1, limit: 5, remaining: 4 },
  totalsByCurrency: [apiTrip.total],
};

export const summary = {
  trip: tripDetail,
  expenses: [
    {
      id: "55555555-5555-4555-8555-555555555555",
      tripId,
      dayId,
      name: "อาหาร",
      amount: apiTrip.total,
      fxSnapshot: null,
    },
  ],
  obligations: [
    {
      id: "66666666-6666-4666-8666-666666666666",
      expenseName: "อาหาร",
      debtorParticipantId: guestId,
      creditorParticipantId: ownerId,
      amount: { minor: "10000", currency: "THB" },
      status: "unpaid",
    },
  ],
  obligationTotals: { paid: [], unpaid: [{ minor: "10000", currency: "THB" }] },
};

export const account = {
  session: {
    user: { id: "test-user", displayName: "ผู้ทดสอบ" },
    csrfToken: "a".repeat(64),
    expiresAt: "2030-01-01T00:00:00Z",
  },
  logout: async () => {},
  loggingOut: false,
  logoutError: "",
};
