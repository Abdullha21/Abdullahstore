import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import ordersRouter from "./routes/orders.js";
import promoRouter from "./routes/promo.js";
import invoiceRouter from "./routes/invoice.js";
import notificationsRouter from "./routes/notifications.js";
import adminRouter from "./routes/admin.js";
import { rateLimiter } from "./middleware/rate-limit.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../../");

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(rateLimiter(60000, 100));

// API Routes
app.use("/api/orders", ordersRouter);
app.use("/api/promo", promoRouter);
app.use("/api/invoice", invoiceRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/admin", adminRouter);

// Static hosting for Admin Panel at /admin
const adminPath = path.join(rootDir, "apps/admin");
app.use("/admin", express.static(adminPath));

// Static hosting for Customer Store at /
const storePath = path.join(rootDir, "apps/store");
app.use(express.static(storePath));

// Fallbacks
app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(adminPath, "index.html"));
});

app.get("*", (req, res) => {
  const filePath = path.join(storePath, req.path);
  res.sendFile(path.join(storePath, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ABDULLAH STORE full-stack server running on http://0.0.0.0:${PORT}`);
});

export default app;
