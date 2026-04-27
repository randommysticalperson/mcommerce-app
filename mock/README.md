# MCommerce Mock Development Environment

> Run the full MCommerce app locally with **zero external API keys**. Everything — M-Pesa, Stripe, Auth, KRA eTIMS — is simulated on your machine.

---

## Quick Start (2 commands)

```bash
# Terminal 1 — Start the mock API server
cd mock && npm install && npm start

# Terminal 2 — Start the Expo app
cd .. && cp .env.mock .env && npm start
```

Or use the one-command script:

```bash
chmod +x scripts/start-mock.sh
./scripts/start-mock.sh
```

---

## What Gets Mocked

| Service | Real (Production) | Mock (Development) |
|---|---|---|
| **Authentication** | JWT via real backend | JWT via local server |
| **Product Catalog** | Real database | 10 Kenyan products in `db.json` |
| **M-Pesa STK Push** | Safaricom Daraja API | Simulated with 1.5s delay, 90% success rate |
| **Stripe Payments** | Stripe API | Simulated payment intents |
| **KRA eTIMS** | KRA API | Simulated invoice acceptance |
| **Orders** | Real database | JSON file (`db.json`) |

---

## Test Credentials

| Field | Value |
|---|---|
| Email | `michael@terrasept.com` |
| Password | `password123` |
| Phone (M-Pesa) | `0712345678` |

A second test user is also available:

| Field | Value |
|---|---|
| Email | `amina@example.com` |
| Password | `password123` |

---

## API Endpoints

The mock server runs at **http://localhost:3001**

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/login` | Login with email + password |
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/refresh` | Refresh JWT token |
| `GET` | `/auth/me` | Get current user profile |

### Products
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/products` | All products |
| `GET` | `/products/:id` | Single product |
| `GET` | `/products/featured` | Featured products |
| `GET` | `/products/search?q=coffee` | Search products |
| `GET` | `/categories` | All categories |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/orders/user` | Orders for logged-in user |
| `POST` | `/orders` | Create new order |
| `PATCH` | `/orders/:id/status` | Update order status |

### M-Pesa
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/mpesa/token` | Get Daraja access token |
| `POST` | `/mpesa/stkpush` | Initiate STK Push |
| `POST` | `/mpesa/stkquery` | Query STK Push status |
| `POST` | `/mpesa/callback` | Receive M-Pesa callback |

### Stripe
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/stripe/payment-intent` | Create payment intent |
| `POST` | `/stripe/confirm` | Confirm payment |

### KRA
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/kra/invoice` | Submit eTIMS invoice |

### Health
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server status and data counts |

---

## Mock Data

All mock data lives in `mock/data/db.json`. You can edit it freely:

- **10 products** across 6 categories (Electronics, Fashion, Home, Groceries, Beauty, Sports)
- **2 users** with Nairobi addresses
- **2 sample orders** (one delivered, one processing)
- **6 vendors** from different Nairobi neighbourhoods

### Adding Products

Open `mock/data/db.json` and add to the `products` array:

```json
{
  "id": "prod_011",
  "name": "Your Product Name",
  "price": 1500,
  "currency": "KES",
  "categoryId": "cat_001",
  "inStock": true,
  ...
}
```

Changes take effect immediately — the server watches the file.

---

## M-Pesa Simulation Details

The mock STK Push simulates the real Daraja flow:

1. `POST /mpesa/stkpush` → returns `CheckoutRequestID` after 1.5s delay
2. `POST /mpesa/stkquery` → returns success (90%) or cancellation (10%) after 0.8s delay
3. On success, returns a mock M-Pesa receipt number (e.g. `QHX7Y2MOCK`)

To simulate a payment failure, call `/mpesa/stkquery` multiple times — it will eventually return `ResultCode: 1032` (cancelled by user).

---

## Switching to Production

When you have real API keys, switch environments by:

1. Copy `.env.example` to `.env`: `cp .env.example .env`
2. Fill in real values for `MPESA_CONSUMER_KEY`, `STRIPE_PUBLISHABLE_KEY`, etc.
3. Change `EXPO_PUBLIC_APP_ENV` from `mock` to `production`
4. Restart the Expo server: `npm start -- --clear`

No code changes required — the app automatically detects the environment.

---

## File Structure

```
mock/
├── data/
│   └── db.json          ← All mock data (products, users, orders)
├── server/
│   └── server.js        ← Express + JSON Server with custom routes
├── package.json         ← Mock server dependencies
└── README.md            ← This file

scripts/
└── start-mock.sh        ← One-command startup script

src/services/
├── api.ts               ← Auto-switches between mock and real API
├── mockInterceptor.ts   ← Mock token storage and client factory
├── authService.ts       ← Auth service (mock-aware)
└── mockMpesaService.ts  ← M-Pesa service with full STK Push flow

.env.mock                ← Mock environment variables (no real keys)
.env.example             ← Production environment variable template
```
