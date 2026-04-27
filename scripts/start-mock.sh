#!/bin/bash
# ══════════════════════════════════════════════════════════════════════════════
# MCommerce — Start Mock Development Environment
# ══════════════════════════════════════════════════════════════════════════════
# Starts both the mock API server and the Expo dev server in parallel.
# No external API keys required.
#
# Usage:
#   chmod +x scripts/start-mock.sh
#   ./scripts/start-mock.sh
# ══════════════════════════════════════════════════════════════════════════════

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MOCK_DIR="$ROOT_DIR/mock"

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║     MCommerce Mock Environment Setup             ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# ── Step 1: Copy .env.mock to .env ────────────────────────────────────────────
if [ ! -f "$ROOT_DIR/.env" ] || ! grep -q "APP_ENV=mock" "$ROOT_DIR/.env"; then
  echo "📋 Copying .env.mock → .env"
  cp "$ROOT_DIR/.env.mock" "$ROOT_DIR/.env"
else
  echo "✅ .env already configured for mock mode"
fi

# ── Step 2: Install app dependencies ─────────────────────────────────────────
echo ""
echo "📦 Installing app dependencies..."
cd "$ROOT_DIR" && npm install --silent

# ── Step 3: Install mock server dependencies ──────────────────────────────────
echo ""
echo "📦 Installing mock server dependencies..."
cd "$MOCK_DIR" && npm install --silent

# ── Step 4: Start mock server in background ───────────────────────────────────
echo ""
echo "🚀 Starting mock API server on port 3001..."
cd "$MOCK_DIR" && node server/server.js &
MOCK_PID=$!

# Wait for server to be ready
sleep 2

# Verify server is running
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
  echo "✅ Mock server is running at http://localhost:3001"
else
  echo "⚠️  Mock server may not be ready yet — continuing anyway"
fi

# ── Step 5: Start Expo dev server ─────────────────────────────────────────────
echo ""
echo "📱 Starting Expo dev server..."
echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║  Test credentials:                               ║"
echo "║    Email:    michael@terrasept.com               ║"
echo "║    Password: password123                         ║"
echo "╠══════════════════════════════════════════════════╣"
echo "║  Mock API:  http://localhost:3001                ║"
echo "║  Health:    http://localhost:3001/health         ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

cd "$ROOT_DIR" && npm start

# Cleanup on exit
trap "kill $MOCK_PID 2>/dev/null; echo 'Mock server stopped.'" EXIT
