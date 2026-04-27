/**
 * MCommerce Mock API Server
 * ─────────────────────────
 * A fully self-contained Express + JSON Server that simulates:
 *   - JWT authentication (login / register / refresh)
 *   - Product catalog with search and filtering
 *   - Cart and order management
 *   - M-Pesa STK Push simulation (with configurable delay)
 *   - Stripe payment intent simulation
 *   - KRA eTIMS invoice simulation
 *
 * NO external API keys required. Runs entirely offline.
 *
 * Usage:
 *   node mock/server/server.js
 *   Server starts at http://localhost:3001
 */

const jsonServer = require("json-server");
const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "../data/db.json"));
const middlewares = jsonServer.defaults({ noCors: false });

const PORT = process.env.MOCK_PORT || 3001;
const JWT_SECRET = "mock_jwt_secret_mcommerce_2026";
const JWT_EXPIRES_IN = "7d";

// ── Helpers ──────────────────────────────────────────────────────────────────

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

const generateMpesaRef = () =>
  "Q" +
  Math.random().toString(36).substring(2, 5).toUpperCase() +
  Math.floor(Math.random() * 9000 + 1000) +
  "MOCK";

const generateOrderId = () =>
  "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

const generateInvoiceId = () =>
  "INV-KRA-" + Date.now();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ── Middleware ────────────────────────────────────────────────────────────────

server.use(middlewares);
server.use(express.json());

// CORS headers
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Request logger
server.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ── Auth Middleware (for protected routes) ────────────────────────────────────

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized — no token provided" });
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized — invalid or expired token" });
  }
};

// ── Auth Routes ───────────────────────────────────────────────────────────────

// POST /auth/login
server.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const db = router.db.getState();
  const user = db.users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      error: "Invalid email or password",
    });
  }

  const token = generateToken(user);
  const { password: _, ...safeUser } = user;

  console.log(`✅ Login: ${user.email}`);
  return res.json({
    success: true,
    token,
    user: safeUser,
    expiresIn: JWT_EXPIRES_IN,
  });
});

// POST /auth/register
server.post("/auth/register", (req, res) => {
  const { name, email, password, phone } = req.body;
  const db = router.db.getState();

  if (!name || !email || !password || !phone) {
    return res.status(400).json({ success: false, error: "All fields are required" });
  }

  const existing = db.users.find((u) => u.email === email);
  if (existing) {
    return res.status(409).json({ success: false, error: "Email already registered" });
  }

  const newUser = {
    id: "user_" + Date.now(),
    name,
    email,
    password,
    phone,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    address: { street: "", city: "Nairobi", county: "Nairobi County", country: "Kenya" },
    createdAt: new Date().toISOString(),
  };

  router.db.get("users").push(newUser).write();

  const token = generateToken(newUser);
  const { password: _, ...safeUser } = newUser;

  console.log(`✅ Register: ${newUser.email}`);
  return res.status(201).json({ success: true, token, user: safeUser });
});

// POST /auth/refresh
server.post("/auth/refresh", requireAuth, (req, res) => {
  const db = router.db.getState();
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const token = generateToken(user);
  return res.json({ success: true, token, expiresIn: JWT_EXPIRES_IN });
});

// GET /auth/me
server.get("/auth/me", requireAuth, (req, res) => {
  const db = router.db.getState();
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { password: _, ...safeUser } = user;
  return res.json({ success: true, user: safeUser });
});

// ── Products Routes ───────────────────────────────────────────────────────────

// GET /products/search?q=coffee&category=cat_004&minPrice=100&maxPrice=5000
server.get("/products/search", (req, res) => {
  const { q, category, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;
  const db = router.db.getState();
  let products = [...db.products];

  if (q) {
    const query = q.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  if (category) products = products.filter((p) => p.categoryId === category);
  if (minPrice) products = products.filter((p) => p.price >= Number(minPrice));
  if (maxPrice) products = products.filter((p) => p.price <= Number(maxPrice));

  if (sort === "price_asc") products.sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") products.sort((a, b) => b.price - a.price);
  else if (sort === "rating") products.sort((a, b) => b.rating - a.rating);

  const total = products.length;
  const start = (Number(page) - 1) * Number(limit);
  const paginated = products.slice(start, start + Number(limit));

  return res.json({
    success: true,
    data: paginated,
    pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
  });
});

// GET /products/featured
server.get("/products/featured", (req, res) => {
  const db = router.db.getState();
  const featured = db.products.filter((p) => p.featured);
  return res.json({ success: true, data: featured });
});

// ── M-Pesa Mock Routes ────────────────────────────────────────────────────────

// POST /mpesa/token — simulate Daraja OAuth token
server.post("/mpesa/token", (req, res) => {
  console.log("📱 M-Pesa: Token request");
  return res.json({
    access_token: "mock_daraja_token_" + Date.now(),
    expires_in: "3599",
  });
});

// POST /mpesa/stkpush — simulate STK Push initiation
server.post("/mpesa/stkpush", requireAuth, async (req, res) => {
  const { phone, amount, orderId } = req.body;

  if (!phone || !amount || !orderId) {
    return res.status(400).json({ success: false, error: "phone, amount, and orderId are required" });
  }

  console.log(`📱 M-Pesa STK Push: KES ${amount} from ${phone} for order ${orderId}`);

  // Simulate 1.5s network delay (realistic for Daraja sandbox)
  await sleep(1500);

  const checkoutRequestId = "ws_CO_" + Date.now() + "_MOCK";
  const merchantRequestId = "mock_merchant_" + Math.floor(Math.random() * 99999);

  return res.json({
    success: true,
    MerchantRequestID: merchantRequestId,
    CheckoutRequestID: checkoutRequestId,
    ResponseCode: "0",
    ResponseDescription: "Success. Request accepted for processing",
    CustomerMessage: `A payment request of KES ${amount} has been sent to ${phone}. Enter your M-Pesa PIN to complete.`,
  });
});

// POST /mpesa/stkquery — simulate STK Push status query
server.post("/mpesa/stkquery", requireAuth, async (req, res) => {
  const { checkoutRequestId } = req.body;
  console.log(`📱 M-Pesa Query: ${checkoutRequestId}`);

  await sleep(800);

  // Simulate 90% success rate
  const success = Math.random() > 0.1;

  if (success) {
    return res.json({
      success: true,
      ResultCode: "0",
      ResultDesc: "The service request is processed successfully.",
      MpesaReceiptNumber: generateMpesaRef(),
      TransactionDate: new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14),
    });
  } else {
    return res.json({
      success: false,
      ResultCode: "1032",
      ResultDesc: "Request cancelled by user.",
    });
  }
});

// POST /mpesa/callback — receive M-Pesa callback (for backend use)
server.post("/mpesa/callback", (req, res) => {
  console.log("📱 M-Pesa Callback received:", JSON.stringify(req.body, null, 2));
  return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
});

// ── Stripe Mock Routes ────────────────────────────────────────────────────────

// POST /stripe/payment-intent
server.post("/stripe/payment-intent", requireAuth, async (req, res) => {
  const { amount, currency = "kes", orderId } = req.body;

  if (!amount || !orderId) {
    return res.status(400).json({ success: false, error: "amount and orderId are required" });
  }

  console.log(`💳 Stripe: Payment intent KES ${amount / 100} for order ${orderId}`);
  await sleep(600);

  return res.json({
    success: true,
    clientSecret: "pi_mock_" + Date.now() + "_secret_mock",
    paymentIntentId: "pi_mock_" + Date.now(),
    amount,
    currency,
    status: "requires_payment_method",
  });
});

// POST /stripe/confirm — simulate payment confirmation
server.post("/stripe/confirm", requireAuth, async (req, res) => {
  const { paymentIntentId } = req.body;
  console.log(`💳 Stripe: Confirm ${paymentIntentId}`);
  await sleep(1000);

  return res.json({
    success: true,
    paymentIntentId,
    status: "succeeded",
    receiptUrl: `https://mock-receipt.example.com/${paymentIntentId}`,
  });
});

// ── Orders Routes ─────────────────────────────────────────────────────────────

// POST /orders — create a new order
server.post("/orders", requireAuth, (req, res) => {
  const { items, deliveryAddress, paymentMethod } = req.body;

  if (!items || !items.length || !deliveryAddress || !paymentMethod) {
    return res.status(400).json({ success: false, error: "items, deliveryAddress, and paymentMethod are required" });
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vat = subtotal * 0.16;
  const deliveryFee = subtotal > 5000 ? 0 : 250;
  const total = subtotal + vat + deliveryFee;

  const newOrder = {
    id: generateOrderId(),
    userId: req.user.id,
    items,
    subtotal: Math.round(subtotal * 100) / 100,
    vat: Math.round(vat * 100) / 100,
    vatRate: 0.16,
    deliveryFee,
    total: Math.round(total * 100) / 100,
    currency: "KES",
    status: "pending",
    paymentMethod,
    mpesaRef: null,
    deliveryAddress,
    createdAt: new Date().toISOString(),
    deliveredAt: null,
  };

  router.db.get("orders").push(newOrder).write();
  console.log(`📦 Order created: ${newOrder.id} — KES ${newOrder.total}`);

  return res.status(201).json({ success: true, order: newOrder });
});

// PATCH /orders/:id/status — update order status
server.patch("/orders/:id/status", requireAuth, (req, res) => {
  const { id } = req.params;
  const { status, mpesaRef } = req.body;
  const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
  }

  const order = router.db.get("orders").find({ id }).value();
  if (!order) return res.status(404).json({ success: false, error: "Order not found" });

  const updates = { status };
  if (mpesaRef) updates.mpesaRef = mpesaRef;
  if (status === "delivered") updates.deliveredAt = new Date().toISOString();

  router.db.get("orders").find({ id }).assign(updates).write();
  const updated = router.db.get("orders").find({ id }).value();

  console.log(`📦 Order ${id} → ${status}`);
  return res.json({ success: true, order: updated });
});

// GET /orders/user — get orders for the authenticated user
server.get("/orders/user", requireAuth, (req, res) => {
  const db = router.db.getState();
  const userOrders = db.orders.filter((o) => o.userId === req.user.id);
  return res.json({ success: true, data: userOrders, total: userOrders.length });
});

// ── KRA eTIMS Mock Route ───────────────────────────────────────────────────────

// POST /kra/invoice — simulate eTIMS invoice submission
server.post("/kra/invoice", requireAuth, async (req, res) => {
  const { orderId, items, total, vat } = req.body;
  console.log(`🧾 KRA eTIMS: Invoice for order ${orderId}`);
  await sleep(500);

  return res.json({
    success: true,
    invoiceId: generateInvoiceId(),
    orderId,
    total,
    vat,
    vatRate: "16%",
    submittedAt: new Date().toISOString(),
    kraStatus: "ACCEPTED",
    qrCode: `https://mock-kra-qr.example.com/${orderId}`,
  });
});

// ── Health Check ──────────────────────────────────────────────────────────────

server.get("/health", (req, res) => {
  const db = router.db.getState();
  return res.json({
    status: "ok",
    environment: "mock",
    timestamp: new Date().toISOString(),
    data: {
      users: db.users.length,
      products: db.products.length,
      orders: db.orders.length,
      categories: db.categories.length,
    },
    endpoints: {
      auth: ["POST /auth/login", "POST /auth/register", "POST /auth/refresh", "GET /auth/me"],
      products: ["GET /products", "GET /products/featured", "GET /products/search", "GET /products/:id"],
      orders: ["GET /orders/user", "POST /orders", "PATCH /orders/:id/status"],
      mpesa: ["POST /mpesa/token", "POST /mpesa/stkpush", "POST /mpesa/stkquery", "POST /mpesa/callback"],
      stripe: ["POST /stripe/payment-intent", "POST /stripe/confirm"],
      kra: ["POST /kra/invoice"],
    },
  });
});

// ── Mount JSON Server router (handles /products, /categories, /orders, etc.) ──
server.use(router);

// ── Start ─────────────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log("\n╔══════════════════════════════════════════════════╗");
  console.log("║       MCommerce Mock API Server                  ║");
  console.log("╠══════════════════════════════════════════════════╣");
  console.log(`║  🚀 Running at: http://localhost:${PORT}             ║`);
  console.log("║  🔑 Auth:       JWT (no real keys needed)         ║");
  console.log("║  📱 M-Pesa:     Simulated STK Push               ║");
  console.log("║  💳 Stripe:     Simulated payment intents         ║");
  console.log("║  🧾 KRA:        Simulated eTIMS invoices          ║");
  console.log("║  📦 Data:       10 Kenyan products, 2 users       ║");
  console.log("╠══════════════════════════════════════════════════╣");
  console.log("║  Test credentials:                                ║");
  console.log("║    Email:    michael@terrasept.com                ║");
  console.log("║    Password: password123                          ║");
  console.log("╠══════════════════════════════════════════════════╣");
  console.log("║  Health:    GET http://localhost:3001/health      ║");
  console.log("╚══════════════════════════════════════════════════╝\n");
});
