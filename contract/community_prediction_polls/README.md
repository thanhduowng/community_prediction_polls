# Community Prediction Polls - Smart Contract

## Description

Smart contract for a simple Prediction Polls system on IOTA blockchain using Move language.

### Features:

- ✅ Create polls with title and description
- ✅ Vote YES or NO for each poll
- ✅ Each address can only vote once per poll
- ✅ Creator cannot vote on their own poll
- ✅ Track vote counts (yes_count, no_count, total_votes)
- ✅ Read poll information
- ✅ Event emission for poll tracking

---

## 🛠️ IOTA CLI Installation

### 1. Install IOTA CLI

```bash
# On Linux/macOS
curl -fsSL https://iota.io/install.sh | bash

# Or build from source
cargo install --git https://github.com/iotaledger/iota.git iota
```

### 2. Verify Installation

```bash
iota --version
```

---

## 🚀 Build & Deploy

### 1. Configure Testnet Environment

```bash
# Create testnet environment
iota client new-env --alias testnet --rpc https://api.testnet.iota.cafe:443

# Switch to testnet
iota client switch --env testnet

# Create new address (if you don't have one)
iota client new-address ed25519

# Get gas from faucet
iota client faucet
```

### 2. Build Contract

```bash
cd contract/community_prediction_polls

# Build
iota move build
```

### 3. Deploy Contract

```bash
# Publish to testnet
iota client publish --gas-budget 100000000
```

After successful deployment, you will see output containing the **Package ID**. Save this ID!

Example output:

```
╭──────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ Object Changes                                                                                               │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Published Objects:                                                                                           │
│  ┌──                                                                                                         │
│  │ PackageID: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef                             │
│  │ ...                                                                                                       │
│  └──                                                                                                         │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```

---

## 📝 Usage Guide

### Variable Substitution

In the commands below, replace:

- `<PACKAGE_ID>` = Package ID after deployment
- `<POLL_ID>` = Object ID of the created poll

---

### 1. Create a New Poll

```bash
iota client call \
  --package <PACKAGE_ID> \
  --module contract \
  --function create_poll \
  --args "Will Bitcoin reach 100k in 2025?" "Prediction about Bitcoin price" \
  --gas-budget 10000000
```

**Note:** After creating a poll, save the **Object ID** of the poll from the output (Created Objects section).

---

### 2. Vote on a Poll

```bash
# Vote YES (choice = 0)
iota client call \
  --package <PACKAGE_ID> \
  --module contract \
  --function vote \
  --args <POLL_ID> 0 \
  --gas-budget 10000000

# Vote NO (choice = 1)
iota client call \
  --package <PACKAGE_ID> \
  --module contract \
  --function vote \
  --args <POLL_ID> 1 \
  --gas-budget 10000000
```

**Note:**

- You need to use a different address from the creator to vote
- Each address can only vote once

To vote with a different address:

```bash
# View list of addresses
iota client addresses

# Switch active address
iota client switch --address <ADDRESS>

# Get gas for new address
iota client faucet
```

---

### 3. View Poll Information

```bash
# View object details
iota client object <POLL_ID>

# View dynamic fields (voters table)
iota client dynamic-field <POLL_ID>
```

Output will display:

- `title`: Poll title
- `description`: Poll description
- `yes_count`: YES vote count
- `no_count`: NO vote count
- `total_votes`: Total vote count
- `creator`: Creator's address

---

## 📊 Data Structure

### Poll Struct

```move
public struct Poll has key {
    id: UID,           // Unique ID
    creator: address,  // Creator
    title: String,     // Title
    description: String, // Description
    yes_count: u64,    // YES vote count
    no_count: u64,     // NO vote count
    total_votes: u64,  // Total votes
    voters: Table<address, bool> // Table storing voters
}
```

### Events

```move
public struct PollCreated has copy, drop {
    poll_id: ID,
    creator: address,
    title: String,
    description: String,
}

public struct VoteCast has copy, drop {
    poll_id: ID,
    voter: address,
    choice: u8,
    yes_count: u64,
    no_count: u64,
}
```

### Error Codes

| Code | Constant              | Description                        |
| ---- | --------------------- | ---------------------------------- |
| 0    | E_CREATOR_CANNOT_VOTE | Creator cannot vote on their poll  |
| 1    | E_ALREADY_VOTED       | Address has already voted          |
| 2    | E_INVALID_CHOICE      | Invalid choice (not 0 or 1)        |

---

## 🔧 Public Functions

| Function                          | Description                  |
| --------------------------------- | ---------------------------- |
| `create_poll(title, description)` | Create a new poll            |
| `vote(poll, choice)`              | Vote on poll (0=YES, 1=NO)   |
| `get_title(poll)`                 | Get poll title               |
| `get_description(poll)`           | Get poll description         |
| `get_yes_count(poll)`             | Get YES vote count           |
| `get_no_count(poll)`              | Get NO vote count            |
| `get_total_votes(poll)`           | Get total vote count         |
| `get_creator(poll)`               | Get creator address          |
| `has_voted(poll, voter)`          | Check if address has voted   |
| `get_poll_info(poll)`             | Get all poll information     |

---

## 🧪 Quick Test

```bash
# 1. Deploy contract
cd contract/community_prediction_polls
iota move build
iota client publish --gas-budget 100000000

# Save PACKAGE_ID from output

# 2. Create a poll
iota client call --package <PACKAGE_ID> --module contract --function create_poll \
  --args "Test Poll" "This is a test" --gas-budget 10000000

# Save POLL_ID from output

# 3. Create new address to vote
iota client new-address ed25519
iota client switch --address <NEW_ADDRESS>
iota client faucet

# 4. Vote YES
iota client call --package <PACKAGE_ID> --module contract --function vote \
  --args <POLL_ID> 0 --gas-budget 10000000

# 5. Check results
iota client object <POLL_ID>
```

---

## 📚 References

- [IOTA Move Documentation](https://docs.iota.org/developer/iota-move-ctf/)
- [IOTA CLI Reference](https://docs.iota.org/references/cli/)
- [Move Language Book](https://move-book.com/)
