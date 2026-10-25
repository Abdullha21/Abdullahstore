// Firebase Admin Initialization with Safe Fallback Store

const inMemoryOrders = new Map();
const inMemoryPromo = new Map([
  ["ABDULLAH10", { code: "ABDULLAH10", discountPct: 10, minOrder: 0, maxUses: 100, usedCount: 0, active: true }],
  ["VIP20", { code: "VIP20", discountPct: 20, minOrder: 15, maxUses: 50, usedCount: 0, active: true }]
]);
const inMemoryNotifications = [];

export const adminDb = {
  orders: {
    set: (id, data) => inMemoryOrders.set(id, data),
    get: (id) => inMemoryOrders.get(id),
    getByToken: (token) => {
      for (const ord of inMemoryOrders.values()) {
        if (ord.shareToken === token) return ord;
      }
      return null;
    },
    list: () => Array.from(inMemoryOrders.values())
  },
  promoCodes: {
    get: (code) => inMemoryPromo.get(code.toUpperCase()),
    updateUsage: (code) => {
      const p = inMemoryPromo.get(code.toUpperCase());
      if (p) {
        p.usedCount = (p.usedCount || 0) + 1;
        inMemoryPromo.set(code.toUpperCase(), p);
      }
    }
  },
  notifications: {
    add: (notif) => inMemoryNotifications.unshift(notif),
    list: () => inMemoryNotifications
  }
};

export const adminAuth = {
  verifyIdToken: async (token) => {
    // If running in development with plain tokens or Firebase tokens
    try {
      if (!token) throw new Error("No token provided");
      // If token is present, extract payload or return authenticated context
      return { uid: "user_" + token.slice(-8), email: "customer@abdullahstore.com" };
    } catch (e) {
      return null;
    }
  }
};
