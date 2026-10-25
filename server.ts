import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import ordersRouter from "./backend/src/routes/orders.js";
import promoRouter from "./backend/src/routes/promo.js";
import invoiceRouter from "./backend/src/routes/invoice.js";
import notificationsRouter from "./backend/src/routes/notifications.js";
import adminRouter from "./backend/src/routes/admin.js";
import { rateLimiter } from "./backend/src/middleware/rate-limit.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(rateLimiter(60000, 120));

// API Routes
app.use("/api/orders", ordersRouter);
app.use("/api/promo", promoRouter);
app.use("/api/invoice", invoiceRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/admin", adminRouter);

// Static hosting for Admin Panel at /admin
const adminPath = path.join(__dirname, "apps/admin");
app.use("/admin", express.static(adminPath));

// Static hosting for Customer Store at /
const storePath = path.join(__dirname, "apps/store");
app.use(express.static(storePath));

// Admin route fallback
app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(adminPath, "index.html"));
});

// Store route fallback
app.get("*", (req, res) => {
  const targetFile = path.join(storePath, req.path);
  res.sendFile(path.join(storePath, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ABDULLAH STORE server running on http://0.0.0.0:${PORT}`);
});

export default app;
