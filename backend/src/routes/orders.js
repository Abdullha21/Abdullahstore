import { Router } from "express";
import { CreateOrderSchema } from "../utils/validation.js";
import { processOrderCreation } from "../services/order-service.js";
import { verifyAuth } from "../middleware/auth.js";
import { adminDb } from "../firebase-admin.js";

const router = Router();
const idempotencyCache = new Map();

router.post("/create", verifyAuth, async (req, res) => {
  try {
    const parseRes = CreateOrderSchema.safeParse(req.body);
    if (!parseRes.success) {
      return res.status(400).json({
        error: "Validation error",
        details: parseRes.error.errors.map(e => e.message)
      });
    }

    const data = parseRes.data;

    // Check idempotency cache to prevent duplicate charges
    if (idempotencyCache.has(data.idempotencyKey)) {
      return res.json(idempotencyCache.get(data.idempotencyKey));
    }

    if (req.user) {
      data.userId = req.user.uid;
    }

    const orderResult = await processOrderCreation(data);
    idempotencyCache.set(data.idempotencyKey, orderResult);

    return res.status(201).json(orderResult);
  } catch (err) {
    console.error("Order creation route error:", err);
    return res.status(500).json({ error: "Failed to create order securely." });
  }
});

router.get("/:orderId", verifyAuth, (req, res) => {
  const order = adminDb.orders.get(req.params.orderId);
  if (!order) return res.status(404).json({ error: "Order not found" });
  return res.json(order);
});

export default router;
