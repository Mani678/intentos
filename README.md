# IntentOS — Just say what you want to do with money.

> **Encode UXMaxx Hackathon 2026** · Universal Accounts Track · Arbitrum Bounty · Magic Labs Challenge

[![Live Demo](https://img.shields.io/badge/Live%20Demo-theintentos.vercel.app-4f8eff?style=for-the-badge)](https://theintentos.vercel.app)
[![Built on Arbitrum](https://img.shields.io/badge/Built%20on-Arbitrum-2563eb?style=for-the-badge)](https://arbitrum.io)
[![Powered by Particle](https://img.shields.io/badge/Powered%20by-Particle%20Network-7c3aed?style=for-the-badge)](https://particle.network)

---

## What is IntentOS?

IntentOS is an AI-powered intent execution engine that completely eliminates blockchain complexity for everyday users.

Instead of dealing with wallets, gas fees, bridges, or token approvals — users simply describe what they want in plain English. IntentOS handles everything invisibly.

```
"Pay David $20"          → 20 USDC sent on Arbitrum
"Split dinner with Alice" → Bill split and executed
"Donate $10 to UNICEF"   → Donation confirmed on-chain
"Transfer USDC to Base"  → Cross-chain bridge executed
```

No wallet setup. No seed phrases. No gas fees. No blockchain knowledge required.

---

## Live Demo

🌐 **https://theintentos.vercel.app**

---

## How It Works

```
User types intent in plain English
          ↓
Google Gemini AI parses it into structured JSON
          ↓
Backend validates the transaction
          ↓
Particle Universal Accounts executes it on Arbitrum
          ↓
Magic Embedded Wallet signs with EIP-7702
          ↓
Transaction confirmed on Arbitrum One
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Framer Motion |
| Authentication | Magic Embedded Wallets + Google OAuth2 |
| AI | Google Gemini 2.5 Flash |
| Blockchain | Particle Network Universal Accounts + EIP-7702 |
| Primary Network | Arbitrum One |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas |
| Hosting | Vercel (frontend) + AWS Lightsail (backend) |

---

## Hackathon Track Qualifications

### ✅ Universal Accounts Track
- Particle Universal Accounts SDK fully integrated
- EIP-7702 mode enabled with authorization signing
- Real cross-chain value transfer on Arbitrum mainnet

### ✅ Arbitrum Bounty
- Arbitrum One is the primary execution network
- Live mainnet transactions confirmed and verifiable on Arbiscan
- Real USDC transfers executed on-chain

### ✅ Magic Labs Embedded Wallet Challenge
- Magic SDK v33 with Google OAuth2 login
- Embedded wallet creation — zero seed phrases, zero setup
- EIP-7702 authorization signing via `magic.wallet.sign7702Authorization()`

---

## Features

- 🔐 **Google Login** — One-click auth, wallet created automatically
- 🤖 **AI Intent Parsing** — Natural language → structured blockchain transaction
- ⚡ **Universal Execution** — Particle routes the optimal cross-chain path
- ⛽ **Gas Sponsored** — Users pay zero gas on every transaction
- 📱 **Consumer UX** — Feels like an AI assistant, not a crypto wallet
- 📜 **Transaction History** — Full on-chain activity log

---

## Project Structure

```
intentos/
├── frontend/                 # Next.js app
│   └── src/
│       ├── app/              # Pages (landing, dashboard, callback)
│       ├── components/       # UI components
│       ├── context/          # Auth context (Magic SDK)
│       ├── hooks/            # useParticle (Universal Accounts)
│       ├── lib/              # magic.ts, particle.ts, api.ts
│       └── store/            # Zustand global state
└── backend/                  # Node.js + Express API
    └── src/
        ├── routes/           # intent, transactions, users
        ├── services/         # gemini.service.ts
        └── models/           # User, Transaction (MongoDB)
```

---

## Local Setup

### Prerequisites
- Node.js 20+
- MongoDB Atlas account
- Magic.link account
- Particle Network account
- Google Gemini API key

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your environment variables
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Fill in your environment variables
npm run dev
```

### Environment Variables

**Backend `.env`**
```env
PORT=4000
MONGODB_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_key
GOOGLE_API_KEY=your_gemini_key
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
```

**Frontend `.env.local`**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY=your_magic_key
NEXT_PUBLIC_PARTICLE_PROJECT_ID=your_particle_project_id
NEXT_PUBLIC_PARTICLE_CLIENT_KEY=your_particle_client_key
NEXT_PUBLIC_PARTICLE_APP_ID=your_particle_app_id
```

---

## Built With ❤️ for Encode UXMaxx Hackathon 2026
