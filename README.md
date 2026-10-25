# ABDULLAH STORE — Mobile-First Futuristic E-Commerce Platform

A production-oriented digital marketplace for premium accounts (X Premium, ChatGPT Plus, YouTube, Canva Pro, NordVPN), digital utilities, and subscription goods.

Developed by **MD ABDULLAH**.

---

## 1. Architectural Highlights

- **Customer Store (`apps/store/`)**: Mobile-first futuristic dark navy and electric blue/purple marketplace (`#0F172A`, `#030817`, `#6366F1`, `#00B7FF`, `#22D3EE`). Plain HTML5, CSS3, and Vanilla JavaScript ES Modules.
- **Separate Admin Panel (`apps/admin/`)**: Full administrative console for orders fulfillment, manual invoices generation, multi-currency products CRUD, promotional discount codes, hero banners, audience broadcast notifications, user access control, and store settings.
- **Secure Backend (`backend/`)**: Node.js & Express API with Zod validation, in-memory rate limiting, server-side authoritative pricing, idempotency keys, and secure random share token invoice generation.
- **Strict Customer Login Rule**: Placing an order strictly requires customer authentication (`requireAuthForOrder()`). Unauthenticated users attempting checkout are automatically alerted and routed to login.
- **Automated PWA Download Prompt**: Instant web app install banner displayed upon entering the store (`showInstallPopup`), supporting one-click add to home screen.
- **Safe Offline Policy**: Offline mode provides friendly fallback notices; checkout strictly requires live network connection to guarantee stock accuracy and fraud prevention.

---

## 2. Directory Structure

```
abdullah-store/
├── apps/
│   ├── store/          # Public Customer Store (HTML, CSS, JS, PWA)
│   └── admin/          # Dedicated Admin Dashboard (HTML, CSS, JS, PWA)
├── backend/            # Express Backend API, Zod validations & services
├── firebase/           # Firestore & Storage Security Rules and Indexes
├── scripts/            # Bootstrap and deployment scripts
└── README.md
```

---

## 3. Local Development Scripts

```bash
# Install dependencies
npm install

# Start full-stack server (serves Customer Store, Admin Panel, and API on port 3000)
npm run dev

# Run bootstrap script for store admin
node scripts/bootstrap-admin.js kff138241@gmail.com
```

---

## 4. Firebase Configuration

- **Project ID**: `ecommerceproject-ca840`
- **Auth Domain**: `ecommerceproject-ca840.firebaseapp.com`
- **Storage Bucket**: `ecommerceproject-ca840.firebasestorage.app`

---

## 5. Security & Attribution

- **Permanent Locked Attribution**: The footer credit is system-locked to `Developed by MD ABDULLAH` across both public store and admin settings.
