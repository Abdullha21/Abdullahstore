import { z } from "zod";

export const CreateOrderSchema = z.object({
  idempotencyKey: z.string().min(6),
  userId: z.string().optional().nullable(),
  customer: z.object({
    name: z.string().min(2, "Customer name is required"),
    email: z.string().email("Valid email is required"),
    whatsapp: z.string().min(5, "WhatsApp phone is required"),
    deliveryInfo: z.string().optional().default("")
  }),
  items: z.array(z.object({
    id: z.string().min(1),
    quantity: z.number().int().min(1)
  })).min(1, "At least one item must be in order"),
  currency: z.enum(["USD", "NGN", "BTC", "USDT", "ETH"]).default("USD"),
  promoCode: z.string().nullable().optional(),
  paymentMethod: z.string().min(2)
});

export const ValidatePromoSchema = z.object({
  code: z.string().min(2),
  subtotal: z.number().min(0),
  currency: z.enum(["USD", "NGN", "BTC", "USDT", "ETH"]).default("USD")
});

export const ManualOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    whatsapp: z.string().min(5),
    deliveryInfo: z.string().optional().default("")
  }),
  currency: z.enum(["USD", "NGN", "BTC", "USDT", "ETH"]).default("USD"),
  items: z.array(z.object({
    title: z.string().min(1),
    quantity: z.number().int().min(1),
    lineTotal: z.number().min(0)
  })),
  total: z.number().min(0),
  subtotal: z.number().min(0),
  discount: z.number().default(0),
  paymentStatus: z.enum(["PAID", "PENDING", "FAILED"]).default("PAID"),
  orderStatus: z.enum(["COMPLETED", "PROCESSING", "PENDING", "CANCELLED"]).default("COMPLETED")
});
