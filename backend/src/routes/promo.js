import { Router } from "express";
import { ValidatePromoSchema } from "../utils/validation.js";
import { validatePromoCode } from "../services/promo-service.js";

const router = Router();

router.post("/validate", (req, res) => {
  const parsed = ValidatePromoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ valid: false, message: "Invalid request payload" });
  }

  const { code, subtotal, currency } = parsed.data;
  const result = validatePromoCode(code, subtotal, currency);
  return res.json(result);
});

export default router;
