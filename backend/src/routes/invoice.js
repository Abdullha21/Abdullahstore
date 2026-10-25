import { Router } from "express";
import { getInvoiceByShareToken } from "../services/invoice-service.js";

const router = Router();

router.get("/:shareToken", (req, res) => {
  const { shareToken } = req.params;
  const invoice = getInvoiceByShareToken(shareToken);

  if (!invoice) {
    return res.status(404).json({ error: "Invoice not found or link has expired." });
  }

  // Return clean, safe invoice representation
  return res.json({
    orderNumber: invoice.orderNumber,
    invoiceNo: invoice.invoiceNo,
    shareToken: invoice.shareToken,
    customer: {
      name: invoice.customer?.name,
      email: invoice.customer?.email,
      whatsapp: invoice.customer?.whatsapp
    },
    items: invoice.items,
    subtotal: invoice.subtotal,
    discount: invoice.discount,
    total: invoice.total,
    currency: invoice.currency,
    paymentStatus: invoice.paymentStatus,
    orderStatus: invoice.orderStatus,
    paymentMethod: invoice.paymentMethod,
    createdAt: invoice.createdAt,
    footerCredit: "Developed by MD ABDULLAH" // Locked
  });
});

export default router;
