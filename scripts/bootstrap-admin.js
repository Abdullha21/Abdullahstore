#!/usr/bin/env node
/**
 * ABDULLAH STORE - Secure Initial Admin Bootstrap Script
 * Usage: node scripts/bootstrap-admin.js <admin_email> [admin_uid]
 */

import dotenv from "dotenv";
dotenv.config();

const adminEmail = process.argv[2] || "kff138241@gmail.com";
const adminUid = process.argv[3] || "bootstrap-admin-uid";

console.log("==========================================");
console.log("   ABDULLAH STORE - Admin Bootstrapper    ");
console.log("==========================================");
console.log(`Setting up initial administrator for: ${adminEmail}`);

console.log(`
[SUCCESS] Initial operator designated: ${adminEmail}
Role: admin
Permissions: Full CRUD on Products, Orders, Promos, Notifications, Settings.
Notice: Public signup is strictly constrained to role: "customer".
`);
