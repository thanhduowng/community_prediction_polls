# 🗳️ Community Prediction Polls

A decentralized Yes/No prediction polling system built on IOTA blockchain using Move smart contracts.

![IOTA](https://img.shields.io/badge/IOTA-Move-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-MIT-green)

**🚀 Testnet Contract Address:** `0x5bda150155a873838a6dae69a812515bb34299c881bfffe429768c42988f457f`
**Explore link: https://explorer.iota.org/object/0x5bda150155a873838a6dae69a812515bb34299c881bfffe429768c42988f457f?network=testnet

## 📋 Overview

**Community Prediction Polls** allows users to create and vote on Yes/No predictions. Each poll tracks voting statistics and ensures fair voting (one vote per address, creator cannot vote on their own poll).

### Features

- ✅ Create polls with title and description
- ✅ Vote YES or NO on any poll
- ✅ One vote per address per poll
- ✅ Real-time vote statistics with progress bars
- ✅ Wallet connection with IOTA dApp Kit
- ✅ Modern, responsive UI

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn**
- **IOTA CLI** (for smart contract deployment)

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Deploy Smart Contract

```bash
# Automated deployment (recommended)
npm run iota-deploy

# Or manual deployment
cd contract/community_prediction_polls
iota move build
iota client publish --gas-budget 100000000
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
community_prediction_polls/
├── app/                          # Next.js App Router
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Main page
│
├── components/                   # React Components
│   ├── Provider.tsx              # IOTA providers wrapper
│   ├── sample.tsx                # Main poll UI component
│   └── Wallet-connect.tsx        # Wallet connection button
│
├── hooks/                        # Custom React Hooks
│   └── useContract.ts            # Contract interaction logic
│
├── lib/                          # Configuration
│   └── config.ts                 # Network & package IDs
│
├── contract/                     # Move Smart Contracts
│   └── community_prediction_polls/
│       ├── Move.toml             # Move package config
│       ├── README.md             # Contract documentation
│       └── sources/
│           └── community_prediction_polls.move  # Main contract
│
├── scripts/                      # Automation Scripts
│   ├── iota-deploy-wrapper.js    # Deployment script
│   └── iota-generate-prompt-wrapper.js
│
├── prompts/                      # AI prompt templates
├── public/                       # Static assets
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── next.config.ts                # Next.js config
└── INSTRUCTION_GUIDE.md          # Detailed guide
```

---

## 🔧 Technical Stack

| Category | Technology |
|----------|------------|
| **Blockchain** | IOTA (Move) |
| **Frontend** | Next.js 16, React 19 |
| **Language** | TypeScript 5 |
| **UI Library** | Radix UI Themes |
| **Wallet** | IOTA dApp Kit |
| **State Management** | TanStack Query |
| **Styling** | Tailwind CSS 4 |

---

## 📜 Smart Contract

### Contract Structure

```move
module community_prediction_polls::contract {
    public struct Poll has key {
        id: UID,
        creator: address,
        title: String,
        description: String,
        yes_count: u64,
        no_count: u64,
        total_votes: u64,
        voters: Table<address, bool>
    }
}
```

### Public Functions

| Function | Description |
|----------|-------------|
| `create_poll(title, description)` | Create a new poll |
| `vote(poll, choice)` | Vote YES (0) or NO (1) |
| `get_title(poll)` | Get poll title |
| `get_description(poll)` | Get poll description |
| `get_yes_count(poll)` | Get YES vote count |
| `get_no_count(poll)` | Get NO vote count |
| `get_total_votes(poll)` | Get total votes |
| `get_creator(poll)` | Get creator address |
| `has_voted(poll, voter)` | Check if address voted |
| `get_poll_info(poll)` | Get all poll info |

### Error Codes

| Code | Constant | Description |
|------|----------|-------------|
| 0 | `E_CREATOR_CANNOT_VOTE` | Creator cannot vote on their poll |
| 1 | `E_ALREADY_VOTED` | Address has already voted |
| 2 | `E_INVALID_CHOICE` | Invalid vote choice (not 0 or 1) |

---

## 🖥️ Frontend Architecture

### Key Components

1. **`components/sample.tsx`** - Main UI component
   - Create poll form
   - Load poll by ID
   - Vote buttons (YES/NO)
   - Results display with progress bars

2. **`hooks/useContract.ts`** - Contract hook
   - `createPoll()` - Create new poll
   - `voteYes()` / `voteNo()` - Cast votes
   - `loadPoll()` - Load poll by ID
   - State: `data`, `isLoading`, `error`

3. **`lib/config.ts`** - Network configuration
   - Package IDs for devnet/testnet/mainnet
   - Network endpoints

---

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Build
npm run build        # Build for production
npm run start        # Start production server

# Deployment
npm run iota-deploy  # Deploy contract & update config

# Utilities
npm run lint         # Run ESLint
npm run generate-prompt  # Generate AI prompt
```

---

## 🌐 Network Configuration

### Deployed Contracts

| Network | Package ID | Status |
|---------|------------|--------|
| **Testnet** | `0x5bda150155a873838a6dae69a812515bb34299c881bfffe429768c42988f457f` | ✅ Active |
| **Devnet** | Not deployed | - |
| **Mainnet** | Not deployed | - |

**Testnet Deployment Details:**
- Transaction: `79XCBdmn59qLT6hcreh46mpaJrhLCCBCoLD4ohkVbiCd`
- Explorer: [View on Explorer](https://explorer.iota.org/txblock/79XCBdmn59qLT6hcreh46mpaJrhLCCBCoLD4ohkVbiCd?network=testnet)
- Deployed: December 7, 2025

Edit `lib/config.ts` to configure package IDs:

```typescript
export const TESTNET_PACKAGE_ID = "0x5bda150155a873838a6dae69a812515bb34299c881bfffe429768c42988f457f"
export const DEVNET_PACKAGE_ID = "0x..."
export const MAINNET_PACKAGE_ID = "0x..."
```

---

## 🧪 Usage Example

### 1. Create a Poll

```bash
iota client call \
  --package 0x5bda150155a873838a6dae69a812515bb34299c881bfffe429768c42988f457f \
  --module contract \
  --function create_poll \
  --args "Will BTC reach 100k?" "Bitcoin price prediction" \
  --gas-budget 10000000
```

### 2. Vote YES

```bash
iota client call \
  --package 0x5bda150155a873838a6dae69a812515bb34299c881bfffe429768c42988f457f \
  --module contract \
  --function vote \
  --args <POLL_ID> 0 \
  --gas-budget 10000000
```

### 3. Vote NO

```bash
iota client call \
  --package 0x5bda150155a873838a6dae69a812515bb34299c881bfffe429768c42988f457f \
  --module contract \
  --function vote \
  --args <POLL_ID> 1 \
  --gas-budget 10000000
```

### 4. Check Results

```bash
iota client object <POLL_ID>
```

---

## 🔗 Resources

- [IOTA Documentation](https://docs.iota.org/)
- [IOTA Move Guide](https://docs.iota.org/developer/iota-move-ctf/)
- [IOTA CLI Reference](https://docs.iota.org/references/cli/)
- [IOTA dApp Kit](https://github.com/iotaledger/dapp-kit)
- [Next.js Documentation](https://nextjs.org/docs)
- [Move Language Book](https://move-book.com/)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

Built with ❤️ for the IOTA community.
