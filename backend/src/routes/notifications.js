import { Router } from "express";
import { adminDb } from "../firebase-admin.js";

const router = Router();

router.post("/send", (req, res) => {
  const { target, title, body, link } = req.body;
  if (!title || !body) {
    return res.status(400).json({ error: "Title and body are required." });
  }

  const notification = {
    target: target || "ALL",
    title,
    body,
    link: link || "",
    read: false,
    createdAt: new Date().toISOString()
  };

  adminDb.notifications.add(notification);
  return res.json({ success: true, message: "Notification delivered." });
});

export default router;
