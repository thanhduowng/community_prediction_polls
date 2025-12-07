# 🗳️ Micro-Debate Arena

A decentralized debate platform built on IOTA blockchain using Move smart contracts. Users can create debates on any topic and join one of two sides (Side A or Side B).

![IOTA](https://img.shields.io/badge/IOTA-Move-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🔗 Deployed Links

### Smart Contract (IOTA Testnet)
- **Package ID**: `0xbb0936af28a0e5bb4079cebbdb604ab9fdd84163f453fb8fe103f6fe6c164008`
- **Contract Address (Testnet)**: `0xbb0936af28a0e5bb4079cebbdb604ab9fdd84163f453fb8fe103f6fe6c164008`
- **Module**: `micro_debate_arena::contract`
- **Explorer**: [View Package on IOTA Explorer](https://explorer.iota.org/testnet/object/0xbb0936af28a0e5bb4079cebbdb604ab9fdd84163f453fb8fe103f6fe6c164008)
- **Deploy Transaction**: [View TX](https://explorer.iota.org/testnet/txblock/2bBBQW3ZyczGMVDgRyCBaWJQWAEwBVEVGNbsVF1sjXk2)
- **Network**: IOTA Testnet
- **Note**: Debate Contract Addresses are created dynamically when users call `create_debate()`. Each debate has its own unique object ID.

### Frontend
- **Live Demo**: Deploy to Vercel to get your live link
- **GitHub Repository**: [micro_debate_arena](https://github.com/thanhduowng/micro_debate_arena)

---

## 📋 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Technical Information](#-technical-information)
- [System Requirements](#-system-requirements)
- [Installation & Setup](#-installation--setup)
- [Usage Guide](#-usage-guide)
- [Smart Contract](#-smart-contract)
- [API Reference](#-api-reference)

---

## ✨ Features

### Smart Contract
- ✅ **Create Debates**: Anyone can create new debates with topic and description
- ✅ **Join Sides**: Choose Side A or Side B to participate
- ✅ **Track Statistics**: Real-time participant count for each side
- ✅ **Fraud Prevention**: Each address can only join one side per debate
- ✅ **Events**: Emit events when debates are created or joined

### Frontend
- 🎨 **Beautiful UI**: Modern design with gradients and animations
- 📱 **Responsive**: Works perfectly on all devices
- 🔄 **Real-time Updates**: Auto-refresh statistics every 10 seconds
- 💼 **Wallet Integration**: Easy IOTA wallet connection
- 🎯 **Status Display**: Clear indication of joined side
- ⚡ **Loading States**: Visual feedback for all actions

---

## 📁 Project Structure

```
micro_debate_arena/
│
├── app/                                    # Next.js App Router
│   ├── layout.tsx                          # Main layout with Provider
│   ├── page.tsx                            # Home page
│   └── globals.css                         # Global styles
│
├── components/                             # React Components
│   ├── Provider.tsx                        # IOTA Wallet Provider
│   ├── Wallet-connect.tsx                  # Wallet connection component
│   ├── sample.tsx                          # Main Micro-Debate Arena UI
│   ├── CreateDebate.tsx                    # Create debate form (unused)
│   ├── DebateList.tsx                      # Debate list (unused)
│   └── DebateCard.tsx                      # Debate card display (unused)
│
├── hooks/                                  # Custom React Hooks
│   └── useContract.ts                      # Contract interaction hook
│
├── lib/                                    # Configurations
│   └── config.ts                           # Network config and Package ID
│
├── contract/micro_debate_arena/            # Move Smart Contract
│   ├── sources/
│   │   └── micro_debate_arena.move         # Main contract file
│   ├── Move.toml                           # Move package configuration
│   ├── DEPLOYMENT_GUIDE.md                 # Detailed deployment guide
│   └── QUICK_REFERENCE.md                  # Quick reference documentation
│
├── scripts/                                # Automation Scripts
│   ├── iota-deploy-wrapper.js              # Auto-deploy script
│   └── iota-generate-prompt-wrapper.js     # Generate prompts
│
├── package.json                            # Dependencies and scripts
├── next.config.ts                          # Next.js configuration
├── tsconfig.json                           # TypeScript configuration
└── README.md                               # This file
```

---

## 🔧 Technical Information

### Technology Stack

#### Frontend
- **Framework**: Next.js 14.2.23 (App Router)
- **Language**: TypeScript 5
- **UI Library**: Radix UI (@radix-ui/themes)
- **Styling**: Tailwind CSS 3.4.1
- **State Management**: React Hooks
- **Blockchain Integration**: @iota/dapp-kit 0.0.8

#### Smart Contract
- **Language**: Move (IOTA Move)
- **Platform**: IOTA Blockchain
- **Network**: Devnet/Testnet/Mainnet
- **Object Model**: Shared Objects
- **Storage**: Table (dynamic storage)

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend (Next.js)                     │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │  sample.tsx│  │ Wallet-connect│  │   Provider.tsx   │    │
│  └─────┬──────┘  └──────┬───────┘  └────────┬─────────┘    │
│        │                 │                    │               │
│        └─────────────────┴────────────────────┘              │
│                          │                                    │
└──────────────────────────┼────────────────────────────────────┘
                           │
                   ┌───────▼────────┐
                   │  @iota/dapp-kit │
                   │  IOTA Client    │
                   └───────┬────────┘
                           │
┌──────────────────────────▼────────────────────────────────────┐
│                   IOTA Blockchain                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │           Smart Contract (Move)                         │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │    Debate    │  │    Events    │  │   Table     │  │  │
│  │  │ (Shared Obj) │  │ DebateCreated│  │ participants│  │  │
│  │  │              │  │ JoinedDebate │  │             │  │  │
│  │  └──────────────┘  └──────────────┘  └─────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Create Debate**:
   ```
   User Input → sample.tsx → signAndExecute → Smart Contract
   → create_debate() → Emit DebateCreated Event → Share Object
   ```

2. **Join Side**:
   ```
   User Click → sample.tsx → signAndExecute → Smart Contract
   → join_debate() → Update Table → Emit JoinedDebate Event
   ```

3. **Display Data**:
   ```
   useEffect → Query DebateCreated Events → Get Debate IDs
   → getObject() for each ID → Query JoinedDebate Events
   → Update UI with statistics
   ```

---

## 💻 System Requirements

### Required Software
- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 or **yarn**
- **IOTA CLI**: Latest version
- **Git**: For cloning repository

### Environment
- **OS**: Windows, macOS, or Linux
- **Browser**: Chrome, Firefox, Edge (Web3 support)
- **Wallet**: IOTA Wallet Extension

### Recommended Knowledge
- React/Next.js basics
- TypeScript basics
- Move language (for smart contract editing)
- Blockchain/Web3 concepts

---

## 🚀 Installation & Setup

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd micro_debate_arena
```

### Step 2: Install Dependencies

```bash
npm install --legacy-peer-deps
```

**Note**: Use `--legacy-peer-deps` due to some package peer dependency conflicts.

### Step 3: Install IOTA CLI

```bash
# Using Cargo (Rust)
cargo install --locked --git https://github.com/iotaledger/iota.git --branch develop iota

# Verify installation
iota --version
```

### Step 4: Configure IOTA Testnet

```bash
# Add testnet environment
iota client new-env --alias testnet --rpc https://api.testnet.iota.cafe:443

# Switch to testnet
iota client switch --env testnet

# Create new address or import existing
iota client new-address ed25519

# Get testnet tokens
iota client faucet
```

### Step 5: Deploy Smart Contract

```bash
# Navigate to contract directory
cd contract/micro_debate_arena

# Build contract
iota move build

# Deploy to testnet
iota client publish --gas-budget 100000000

# Save the Package ID from output!
```

### Step 6: Update Package ID

Open `lib/config.ts` and update the Package ID:

```typescript
export const DEVNET_PACKAGE_ID = "0xYOUR_PACKAGE_ID_HERE"
```

### Step 7: Run Development Server

```bash
# Return to root directory
cd ../..

# Run dev server
npm run dev
```

Open browser at: **http://localhost:3000**

---

## 📖 Usage Guide

### Connect Wallet

1. Click **"Connect Wallet"** button at top
2. Select your IOTA wallet
3. Approve the connection

### Create Debate

1. Click **"+ Create New Debate"**
2. Enter **Topic** (max 100 characters)
3. Enter **Description** (max 500 characters)
4. Click **"Create Debate"**
5. Confirm transaction in wallet
6. Wait for transaction confirmation

### Join Debate

1. Find the debate you want to join
2. Click **"Join Side A"** or **"Join Side B"**
3. Confirm transaction
4. You'll see a badge showing your joined side

### View Statistics

- **Progress Bar**: Shows percentage of each side
- **Participant Count**: Number of participants per side
- **Total**: Total number of participants
- **Your Status**: Colored badge showing your joined side

---

## 🔐 Smart Contract

### Debate Object Structure

```move
public struct Debate has key {
    id: UID,
    topic: String,              // Debate topic
    description: String,        // Detailed description
    side_a_count: u64,         // Side A participant count
    side_b_count: u64,         // Side B participant count
    total_participants: u64,   // Total participants
    participants: Table<address, u8>,  // Map address -> side
}
```

### Functions

#### `create_debate(topic: String, description: String)`
- Creates a new debate
- Shared object, anyone can interact
- Emits `DebateCreated` event

#### `join_debate(debate: &mut Debate, side: u8)`
- Join a debate
- `side`: 0 = Side A, 1 = Side B
- Checks for duplicate joins
- Emits `JoinedDebate` event

### Events

```move
// When debate is created
public struct DebateCreated has copy, drop {
    debate_id: ID,
    topic: String,
    description: String,
    creator: address,
}

// When user joins
public struct JoinedDebate has copy, drop {
    debate_id: ID,
    participant: address,
    side: u8,
}
```

### Error Codes

- **E_ALREADY_JOINED (1)**: Already joined this debate
- **E_INVALID_SIDE (2)**: Side must be 0 or 1

---

## 📚 API Reference

### Frontend Hooks

#### `useIotaClient()`
```typescript
const iotaClient = useIotaClient()
// Methods:
// - queryEvents(): Query blockchain events
// - getObject(): Get object by ID
// - getOwnedObjects(): Get objects owned by address
```

#### `useSignAndExecuteTransaction()`
```typescript
const { mutate: signAndExecute } = useSignAndExecuteTransaction()

signAndExecute(
  { transaction: tx },
  {
    onSuccess: (result) => { /* ... */ },
    onError: (error) => { /* ... */ }
  }
)
```

#### `useCurrentAccount()`
```typescript
const currentAccount = useCurrentAccount()
// Returns: { address: string, ... } | null
```

### Smart Contract View Functions

```move
public fun get_topic(debate: &Debate): String
public fun get_description(debate: &Debate): String
public fun get_side_a_count(debate: &Debate): u64
public fun get_side_b_count(debate: &Debate): u64
public fun get_total_participants(debate: &Debate): u64
public fun has_joined(debate: &Debate, participant: address): bool
```

---

## 🐛 Debugging

### Console Logs

Open DevTools (F12) and check Console:
- `DebateCreated events`: All debate creation events
- `Debate IDs found`: List of debate IDs
- `JoinedDebate events`: Join events
- `Debates loaded`: Final data
- `User joined sides`: Map of joined sides

### Common Issues

**Debates not showing after creation:**
- Check Package ID in `lib/config.ts`
- Check Console logs
- Wait 10 seconds for auto-refresh

**Transaction failed:**
- Check gas in wallet
- Run `iota client faucet` to get more tokens
- Verify you haven't joined this debate yet

**UI not updating:**
- Hard refresh (Ctrl + Shift + R)
- Check network in DevTools
- Look for Console errors

---

## 🚢 Deployment

### Deploy Smart Contract to Mainnet

```bash
# Switch to mainnet
iota client switch --env mainnet

# Deploy
iota client publish --gas-budget 100000000

# Update Package ID in lib/config.ts
export const MAINNET_PACKAGE_ID = "0x..."
```

### Deploy Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

- **Documentation**: [contract/micro_debate_arena/DEPLOYMENT_GUIDE.md](contract/micro_debate_arena/DEPLOYMENT_GUIDE.md)
- **Quick Reference**: [contract/micro_debate_arena/QUICK_REFERENCE.md](contract/micro_debate_arena/QUICK_REFERENCE.md)
- **IOTA Docs**: https://docs.iota.org/
- **Move Book**: https://move-language.github.io/move/

---

## 🎯 Roadmap

- [ ] Add voting system
- [ ] Add comments for each debate
- [ ] Integrate IPFS for long-form content
- [ ] Add badges/achievements for users
- [ ] Trending debates
- [ ] User profiles
- [ ] NFT rewards

---

**Made with ❤️ using IOTA Move & Next.js**
