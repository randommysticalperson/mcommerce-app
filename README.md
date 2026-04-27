# MCommerce — React Native Mobile Commerce App

> **Built by TerraSept Solutions · Nairobi, Kenya**
> A production-ready, cross-platform mobile commerce application targeting iOS, Android, and Web, with native M-Pesa (Daraja API) integration and full TypeScript coverage.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Environment Setup](#environment-setup)
5. [Running the App](#running-the-app)
6. [Testing on a Physical Device — Expo Go](#testing-on-a-physical-device--expo-go)
7. [Testing on an Emulator / Simulator](#testing-on-an-emulator--simulator)
8. [Building a Distributable APK / IPA](#building-a-distributable-apk--ipa)
9. [Project Structure](#project-structure)
10. [Architecture Overview](#architecture-overview)
11. [M-Pesa Integration Guide](#m-pesa-integration-guide)
12. [State Management](#state-management)
13. [Navigation](#navigation)
14. [Authentication Flow](#authentication-flow)
15. [Available Scripts](#available-scripts)
16. [Environment Variables Reference](#environment-variables-reference)
17. [Deployment Checklist](#deployment-checklist)
18. [Contributing](#contributing)
19. [License](#license)

---

## Overview

MCommerce is a full-featured mobile commerce scaffold designed for the **Kenyan and East African market**. It ships with:

| Feature | Detail |
|---|---|
| **Platforms** | iOS, Android, Web (via Expo) |
| **Language** | TypeScript 5.3 (strict mode, 100% coverage) |
| **State** | Redux Toolkit with 4 typed slices |
| **Payments** | M-Pesa Daraja STK Push + Stripe SDK |
| **Auth** | JWT + Expo SecureStore |
| **Navigation** | React Navigation v6 (Stack + Bottom Tabs) |
| **Currency** | KES primary, USD fallback |
| **Screens** | 8 core screens (Welcome, Login, Register, Home, Search, Cart, Orders, Profile) |

---

## Prerequisites

Before you begin, ensure the following are installed:

| Tool | Version | Install |
|---|---|---|
| **Node.js** | ≥ 18.x | [nodejs.org](https://nodejs.org) |
| **npm** | ≥ 9.x | Bundled with Node.js |
| **Expo CLI** | latest | `npm install -g expo-cli` |
| **EAS CLI** | latest | `npm install -g eas-cli` |
| **Git** | any | [git-scm.com](https://git-scm.com) |

**For Android development (optional):**
- [Android Studio](https://developer.android.com/studio) with an AVD (Android Virtual Device) configured
- Android SDK Platform 34 (API Level 34) or higher

**For iOS development (macOS only, optional):**
- [Xcode](https://developer.apple.com/xcode/) 15 or higher
- iOS Simulator via Xcode

---

## Installation

```bash
# 1. Navigate into the project directory
cd MCommerceApp

# 2. Install all dependencies
npm install

# 3. Copy the environment variable template
cp .env.example .env
# Then open .env and fill in your values (see Environment Setup below)
```

---

## Environment Setup

Open `.env` and fill in the required values:

```env
# ── Backend API ──────────────────────────────────────────────────────────────
API_BASE_URL=https://your-api.example.com/api/v1

# ── M-Pesa (Safaricom Daraja) ─────────────────────────────────────────────────
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://your-api.example.com/payments/mpesa/callback
MPESA_ENV=sandbox          # Change to "production" for live payments

# ── Stripe ────────────────────────────────────────────────────────────────────
STRIPE_PUBLISHABLE_KEY=pk_test_...

# ── App Config ────────────────────────────────────────────────────────────────
APP_ENV=development        # development | staging | production
```

> **M-Pesa Sandbox Credentials:** Register at [developer.safaricom.co.ke](https://developer.safaricom.co.ke) to get free sandbox credentials. Use shortcode `174379` and the test passkey provided in the Daraja portal.

> **Security Note:** M-Pesa `CONSUMER_KEY` and `CONSUMER_SECRET` must only be used server-side. Never expose them in the client app bundle.

---

## Running the App

### Start the Expo development server

```bash
npm start
```

This opens the **Expo DevTools** in your browser and prints a QR code in the terminal. From here you can launch on any platform.

### Run directly on a platform

```bash
# Android (requires Android Studio emulator or connected device)
npm run android

# iOS (macOS only, requires Xcode)
npm run ios

# Web browser (instant, no device needed)
npm run web
```

---

## Testing on a Physical Device — Expo Go

This is the **fastest way** to test — no emulator or build tools required. Your app runs on your real phone in under 5 minutes.

### Step 1 — Install Expo Go on your phone

| Platform | Link |
|---|---|
| **Android** | [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) |
| **iOS** | [Apple App Store](https://apps.apple.com/app/expo-go/id982107779) |

### Step 2 — Start the dev server

```bash
npm start
```

### Step 3 — Scan the QR code

- **Android:** Open the Expo Go app → tap **"Scan QR Code"** → scan the QR code in the terminal.
- **iPhone:** Open the native **Camera app** → point at the QR code → tap the yellow banner that appears.

> **Important:** Your phone and computer must be on the **same Wi-Fi network**. If they are not, run `npm start -- --tunnel` to use a public tunnel instead.

### Troubleshooting Expo Go

| Problem | Solution |
|---|---|
| QR code not scanning | Run `npm start -- --tunnel` for a public URL |
| App crashes on launch | Check `.env` is filled in correctly |
| Network error | Ensure phone and PC are on the same Wi-Fi |
| Module not found | Run `npm install` then `npm start -- --clear` |
| Slow reload | Enable Fast Refresh in the Expo DevTools sidebar |

---

## Testing on an Emulator / Simulator

### Android Emulator (Android Studio)

1. Open **Android Studio** → **Device Manager** → create a new virtual device (recommended: **Pixel 8**, API 34).
2. Click the green **Play** button to start the emulator.
3. In the project directory, run:

```bash
npm run android
```

Expo will automatically detect the running emulator and install the app.

### iOS Simulator (macOS only)

1. Open **Xcode** → **Xcode menu** → **Open Developer Tool** → **Simulator**.
2. Choose a device (e.g. iPhone 15 Pro).
3. In the project directory, run:

```bash
npm run ios
```

---

## Building a Distributable APK / IPA

Use **EAS Build** (Expo Application Services) to generate production-ready binaries without needing Android Studio or Xcode locally.

### Step 1 — Log in to Expo

```bash
eas login
```

### Step 2 — Configure EAS (first time only)

```bash
eas build:configure
```

### Step 3 — Build

```bash
# Android APK — installable directly on any Android device
eas build --platform android --profile preview

# Android AAB — for Google Play Store submission
eas build --platform android --profile production

# iOS IPA — for TestFlight / App Store submission
eas build --platform ios --profile production
```

> **Free tier:** EAS Build provides 30 free builds/month. Builds run in the cloud — no local SDK required.

After the build completes, EAS provides a download link for the `.apk` or `.ipa` file.

---

## Project Structure

```
MCommerceApp/
├── App.tsx                          # Root entry point (Redux Provider + Navigation)
├── app.json                         # Expo app configuration
├── package.json
├── tsconfig.json
├── .env.example                     # Environment variable template
│
└── src/
    ├── types/
    │   └── index.ts                 # All TypeScript domain types (User, Product, Order, Cart)
    │
    ├── store/
    │   ├── index.ts                 # Redux store configuration
    │   └── slices/
    │       ├── authSlice.ts         # User authentication state
    │       ├── productsSlice.ts     # Product catalog state
    │       ├── cartSlice.ts         # Shopping cart state
    │       └── ordersSlice.ts       # Order management state
    │
    ├── services/
    │   ├── api.ts                   # Axios base instance + request/response interceptors
    │   ├── authService.ts           # Login, register, token refresh
    │   ├── productService.ts        # Product listing, search, details
    │   ├── orderService.ts          # Order placement and tracking
    │   └── paymentService.ts        # M-Pesa STK Push + Stripe
    │
    ├── navigation/
    │   ├── AppNavigator.tsx         # Root navigator (Auth vs Main)
    │   ├── AuthNavigator.tsx        # Welcome → Login → Register stack
    │   └── MainTabNavigator.tsx     # Home / Search / Cart / Orders / Profile tabs
    │
    ├── screens/
    │   ├── auth/
    │   │   ├── WelcomeScreen.tsx
    │   │   ├── LoginScreen.tsx
    │   │   └── RegisterScreen.tsx
    │   ├── home/
    │   │   └── HomeScreen.tsx
    │   ├── search/
    │   │   └── SearchScreen.tsx
    │   ├── cart/
    │   │   └── CartScreen.tsx
    │   ├── orders/
    │   │   └── OrderListScreen.tsx
    │   └── profile/
    │       └── ProfileScreen.tsx
    │
    ├── hooks/
    │   ├── useAppDispatch.ts        # Typed Redux dispatch hook
    │   └── useAppSelector.ts        # Typed Redux selector hook
    │
    └── utils/
        └── theme.ts                 # Colors, typography, spacing, shadow constants
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx (Root)                        │
│              Redux Provider + Navigation Container           │
└──────────────────────────┬──────────────────────────────────┘
                           │
          ┌────────────────┴────────────────┐
          │         AppNavigator             │
          │  (checks auth state from Redux)  │
          └────────┬───────────────┬─────────┘
                   │               │
          ┌────────▼───┐   ┌───────▼──────────┐
          │AuthNavigator│   │ MainTabNavigator  │
          │  (3 screens)│   │  (5 tab screens)  │
          └────────────┘   └──────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
             ┌──────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐
             │  Redux Store │ │  Services  │ │   Theme     │
             │  (4 slices)  │ │  (Axios)   │ │  (utils)    │
             └─────────────┘ └───────────┘ └─────────────┘
```

---

## M-Pesa Integration Guide

The app uses the **Safaricom Daraja API** for mobile payments.

### STK Push (Lipa Na M-Pesa Online)

The STK Push flow prompts the customer's phone with a payment PIN dialog:

```typescript
// src/services/paymentService.ts
const initiateStkPush = async (phone: string, amount: number, orderId: string) => {
  const token = await getAccessToken();         // OAuth2 token from Daraja
  const timestamp = getTimestamp();             // YYYYMMDDHHmmss format
  const password = btoa(`${SHORTCODE}${PASSKEY}${timestamp}`);

  return axios.post(`${DARAJA_BASE}/mpesa/stkpush/v1/processrequest`, {
    BusinessShortCode: SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: normalizePhone(phone),             // Must be 2547XXXXXXXX format
    PartyB: SHORTCODE,
    PhoneNumber: normalizePhone(phone),
    CallBackURL: CALLBACK_URL,
    AccountReference: orderId,
    TransactionDesc: `MCommerce Order ${orderId}`,
  }, { headers: { Authorization: `Bearer ${token}` } });
};
```

### Phone Number Normalization

Kenyan phone numbers must be in the `2547XXXXXXXX` format for Daraja:

```typescript
export const normalizePhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0"))   return `254${cleaned.slice(1)}`;
  if (cleaned.startsWith("7"))   return `254${cleaned}`;
  if (cleaned.startsWith("254")) return cleaned;
  throw new Error(`Invalid Kenyan phone number: ${phone}`);
};

// Examples:
// "0712345678"   → "254712345678"
// "712345678"    → "254712345678"
// "254712345678" → "254712345678"
```

### Sandbox vs Production

| Setting | Sandbox | Production |
|---|---|---|
| Base URL | `https://sandbox.safaricom.co.ke` | `https://api.safaricom.co.ke` |
| Shortcode | `174379` | Your assigned shortcode |
| Credentials | From Daraja developer portal | From Safaricom business team |
| `MPESA_ENV` | `sandbox` | `production` |

---

## State Management

The app uses **Redux Toolkit** with four typed slices:

| Slice | Responsibility |
|---|---|
| `authSlice` | User session, JWT token, login/logout |
| `productsSlice` | Product catalog, categories, search results |
| `cartSlice` | Cart items, quantities, totals |
| `ordersSlice` | Order history, order status, active order |

### Typed Hooks

Always use the typed hooks instead of raw `useDispatch`/`useSelector`:

```typescript
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

// In a component:
const dispatch = useAppDispatch();
const cart = useAppSelector((state) => state.cart);
```

---

## Navigation

The navigation tree is:

```
AppNavigator
├── AuthNavigator (when user is NOT logged in)
│   ├── WelcomeScreen
│   ├── LoginScreen
│   └── RegisterScreen
└── MainTabNavigator (when user IS logged in)
    ├── HomeScreen
    ├── SearchScreen
    ├── CartScreen          ← badge shows item count
    ├── OrderListScreen
    └── ProfileScreen
```

`AppNavigator` reads `state.auth.isAuthenticated` from Redux to decide which navigator to render. No manual routing required.

---

## Authentication Flow

```
User opens app
      │
      ▼
Check Expo SecureStore for JWT token
      │
  ┌───┴───┐
  │ Found │──► Validate token expiry ──► Load MainTabNavigator
  └───────┘
      │
  Not found
      │
      ▼
AuthNavigator (Welcome → Login/Register)
      │
  Successful login/register
      │
      ▼
Store JWT in Expo SecureStore (encrypted)
      │
      ▼
Dispatch setUser() to Redux authSlice
      │
      ▼
AppNavigator automatically switches to MainTabNavigator
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start Expo dev server (opens DevTools + QR code) |
| `npm run android` | Run on Android emulator or connected device |
| `npm run ios` | Run on iOS simulator (macOS only) |
| `npm run web` | Run in web browser at localhost:8081 |
| `npm run build:android` | EAS cloud build for Android APK |
| `npm run build:ios` | EAS cloud build for iOS IPA |
| `npm run type-check` | Run TypeScript compiler check (no emit) |

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `API_BASE_URL` | ✅ | Backend REST API base URL |
| `MPESA_CONSUMER_KEY` | ✅ | Daraja API consumer key (server-side only) |
| `MPESA_CONSUMER_SECRET` | ✅ | Daraja API consumer secret (server-side only) |
| `MPESA_SHORTCODE` | ✅ | M-Pesa business shortcode |
| `MPESA_PASSKEY` | ✅ | M-Pesa online passkey |
| `MPESA_CALLBACK_URL` | ✅ | Publicly accessible HTTPS callback URL |
| `MPESA_ENV` | ✅ | `sandbox` or `production` |
| `STRIPE_PUBLISHABLE_KEY` | ✅ | Stripe publishable key (`pk_test_` or `pk_live_`) |
| `APP_ENV` | ✅ | `development`, `staging`, or `production` |

---

## Deployment Checklist

Before submitting to the App Store or Google Play:

- [ ] Set `MPESA_ENV=production` and replace sandbox credentials with live ones
- [ ] Replace `STRIPE_PUBLISHABLE_KEY` with live key (`pk_live_...`)
- [ ] Set `API_BASE_URL` to the production backend URL
- [ ] Update `app.json` with correct `bundleIdentifier` (iOS) and `package` (Android)
- [ ] Run `eas build --platform all --profile production`
- [ ] Test the production build on a real physical device before submission
- [ ] Ensure `MPESA_CALLBACK_URL` is a publicly accessible HTTPS endpoint
- [ ] Review Safaricom's [Go-Live Checklist](https://developer.safaricom.co.ke/Documentation) before enabling live M-Pesa
- [ ] Ensure KRA eTIMS integration is configured if issuing electronic tax invoices
- [ ] Confirm VAT (16%) is correctly calculated and displayed on all receipts

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit using Conventional Commits: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request against the `develop` branch

Please follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

---

## License

MIT License — © 2026 TerraSept Solutions, Nairobi, Kenya.

---

> **Questions?** Contact the TerraSept Solutions team at [hello@terrasept.com](mailto:hello@terrasept.com)
