import { Router } from "express";
import { verifyAuth } from "../middleware/auth.js";
import { verifyAdmin } from "../middleware/admin.js";
import { adminDb } from "../firebase-admin.js";
import { ManualOrderSchema } from "../utils/validation.js";
import { generateOrderNumber, generateInvoiceNumber, generateShareToken } from "../utils/ids.js";

const router = Router();
router.use(verifyAuth, verifyAdmin);

// Orders
router.get("/orders", (req, res) => {
  return res.json(adminDb.orders.list());
});

router.put("/orders/:id/status", (req, res) => {
  const { status } = req.body;
  const order = adminDb.orders.get(req.params.id);
  if (order) {
    order.orderStatus = status;
    return res.json({ success: true, order });
  }
  return res.status(404).json({ error: "Order not found" });
});

router.put("/orders/:id/payment-status", (req, res) => {
  const { status } = req.body;
  const order = adminDb.orders.get(req.params.id);
  if (order) {
    order.paymentStatus = status;
    return res.json({ success: true, order });
  }
  return res.status(404).json({ error: "Order not found" });
});

// Manual Order & Invoice
router.post("/manual-orders", (req, res) => {
  const parsed = ManualOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.errors });
  }

  const data = parsed.data;
  const orderNumber = generateOrderNumber();
  const invoiceNo = generateInvoiceNumber();
  const shareToken = generateShareToken();

  const record = {
    orderNumber,
    invoiceNo,
    shareToken,
    ...data,
    createdAt: new Date().toISOString()
  };

  adminDb.orders.set(orderNumber, record);
  return res.status(201).json({
    success: true,
    orderNumber,
    invoiceNo,
    shareToken
  });
});

// Settings
router.get("/settings", (req, res) => {
  return res.json({
    siteName: "ABDULLAH STORE",
    logo: "",
    whatsapp: "+1234567890",
    telegram: "https://t.me/abdullahstore",
    currencies: ["USD", "NGN", "BTC", "USDT", "ETH"],
    defaultCurrency: "USD",
    footerCredit: "Developed by MD ABDULLAH", // Locked
    maintenanceMode: false,
    bannerAutoSlide: 5000
  });
});

router.put("/settings", (req, res) => {
  // Always lock footer credit
  const body = req.body;
  body.footerCredit = "Developed by MD ABDULLAH";
  return res.json({ success: true, settings: body });
});

export default router;
