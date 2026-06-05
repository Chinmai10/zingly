# Blockchain Home Task — Advanced (Node.js)

**Coding assessment:** implement a blockchain in `src/`. **Tests define the requirements** — your submission is complete when `npm test` passes (89 tests).

## What you must implement (coding)

Implement files under `src/` (stubs throw `Not implemented`). The test suite is your spec.

| Area | Files | Advanced topics |
|------|-------|-----------------|
| Crypto | `src/crypto/hash.js`, `keyPair.js` | SHA-256, ECDSA secp256k1, sign/verify |
| Core | `src/core/*.js` | Blocks, PoW, Merkle root, UTXO, mempool, wallet |
| Chain | `src/core/Blockchain.js` | Genesis, mining, validation, difficulty retargeting, chain replace |
| Network | `src/network/P2PServer.js` | WebSocket sync (longest valid chain) |
| Storage | `src/storage/persistence.js` | Save/load chain JSON |

**Already wired for you** (focus on blockchain logic, not HTTP boilerplate):

- `src/config.js` — constants  
- `src/api/server.js` — REST endpoints  
- `src/index.js` — starts API + P2P  

## Pass criteria

```bash
npm install
npm test    # all 89 tests green
npm start   # API on :3001, P2P on :6001
```

## Suggested order

1. `crypto/hash` → `crypto/keyPair`  
2. `MerkleTree` → `Transaction` → `UTXOSet`  
3. `Block` → `Mempool` → `Wallet` → `Blockchain`  
4. `persistence` → `P2PServer`  
5. Run full suite: `npm test`

Run one group at a time, e.g. `npm test -- tests/unit/crypto`.

## Architecture (add to your submission)

After implementation, add a short **Architecture** section below (or in a comment at the top of this file) describing:

- How a transaction moves: wallet → mempool → block → UTXO set  
- How PoW and difficulty adjustment work  
- How P2P chooses the canonical chain  

This is documentation of **your** code, not a substitute for implementation.

---

## Architecture

### How a transaction moves: wallet → mempool → block → UTXO set

1. **Wallet** calls `Transaction.create(...)` picking UTXOs that cover the amount, building inputs (txId + outputIndex) and outputs (recipient + change). It then calls `tx.sign(privateKey, publicKey)` which signs the payload of each input and stores signatures + publicKey in `tx.signatures`.
2. **Mempool** (`blockchain.addTransaction`) validates the tx against a snapshot of the UTXO set that already includes pending mempool transactions (preventing double-spends). If valid, the tx enters `Mempool.transactions`.
3. **Mining** (`blockchain.minePendingTransactions`) prepends a coinbase tx (miner reward), collects pending txs, builds a `Block`, runs Proof-of-Work (`block.mine()`) incrementing the nonce until `hash.startsWith('0'.repeat(difficulty))`, then appends the block to the chain.
4. **UTXO set** (`utxoSet.applyBlock`) processes every transaction in the new block: for non-coinbase txs, the spent inputs are deleted from the map; for all txs, the new outputs are inserted. `getBalance(address)` and `getUnspentForAddress(address)` query this map directly.

### How PoW and difficulty adjustment work

Each `Block.mine()` loop hashes `{ index, timestamp, merkleRoot, previousHash, nonce, difficulty }` via SHA-256 and increments the nonce until the hash has at least `difficulty` leading zero hex characters. `Block.isValid()` re-hashes all fields and checks both the hash match and the leading-zeros condition.

Difficulty is re-evaluated every `DIFFICULTY_ADJUSTMENT_INTERVAL` blocks (5). At adjustment points `(chainLength - 1) % 5 === 0`, the elapsed time for the last 5 blocks is compared to `TARGET_BLOCK_TIME_MS * 5`. If blocks are mined in less than half the target time, difficulty increases by 1; if more than twice, it decreases by 1 (minimum 1).

### How P2P chooses the canonical chain

`P2PServer` wraps a WebSocket server. On connect, it immediately sends the local chain as a `CHAIN` message. On receiving a `CHAIN` message, it calls `blockchain.replaceChain(newChain)` which accepts only if the incoming chain is strictly longer AND every block passes `isValid(previousBlock)` (hash integrity, PoW, and merkle-root checks). When accepted, the UTXO set is rebuilt by replaying all blocks of the new chain. The mempool is cleared to avoid invalid pending transactions.

---

## To-do list (check off as you complete)

### 1. Project setup

- [x] Node.js project with `package.json` (provided)
- [x] CommonJS (`require`), scripts, `.gitignore` (provided)
- [ ] You can run `npm install`, `npm test`, `npm start` locally

### 2. Cryptography

- [ ] SHA-256 hashing for blocks and data
- [ ] ECDSA key pair generation (secp256k1)
- [ ] Sign transaction payloads
- [ ] Verify signatures before accepting transactions
- [ ] Wallet address derived from public key

### 3. Block & chain

- [ ] `Block`: index, timestamp, transactions, previous hash, nonce, hash, difficulty
- [ ] Merkle root of transaction IDs per block
- [ ] Proof of Work (mine until hash meets difficulty)
- [ ] Genesis block (index 0, previous hash `"0"`)
- [ ] `Blockchain`: append blocks, get latest block
- [ ] Validate block links and PoW
- [ ] Validate full chain (`isChainValid`)

### 4. Transactions & UTXO

- [ ] `Transaction`: inputs, outputs, id, timestamp
- [ ] Coinbase transaction (mining reward)
- [ ] Create transfer transactions (recipient, amount, change)
- [ ] UTXO set: track unspent outputs
- [ ] Spend UTXOs when transaction is confirmed
- [ ] Balance per address from UTXOs
- [ ] Reject spending non-existent or already-spent UTXOs
- [ ] Mempool for pending transactions
- [ ] Prevent double-spend in mempool (same UTXO twice)

### 5. Mining

- [ ] Collect mempool transactions + coinbase reward
- [ ] Mine block with configurable difficulty
- [ ] Clear mined transactions from mempool
- [ ] Difficulty adjustment over time

### 6. Wallet

- [ ] Generate wallet (key pair + address)
- [ ] Create and sign outgoing transactions
- [ ] Select UTXOs to fund a payment

### 7. Network & API

- [ ] REST API works with your blockchain (`npm test -- tests/api`)
- [ ] P2P WebSocket: broadcast chain and transactions
- [ ] Replace local chain with longer valid peer chain
- [ ] Optional peer: `PEER_HOST`, `PEER_PORT`

### 8. Persistence

- [ ] Save blockchain state to JSON file
- [ ] Load blockchain state from JSON file

### 9. Tests

- [ ] All unit, integration, API, P2P, and storage tests pass (`npm test`)

### 10. Submit

- [ ] Clean repo (no secrets, no `node_modules` committed)
- [ ] `npm test` passes on a fresh clone
- [ ] README includes your architecture notes + how to run
- [ ] Optional: curl demo or Postman collection

---

## Quick start

```bash
npm install
npm test
npm start
```

```bash
curl http://localhost:3001/wallet
curl -X POST http://localhost:3001/mine
curl http://localhost:3001/blocks
```

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | HTTP API |
| `P2P_PORT` | 6001 | WebSocket P2P |
| `DIFFICULTY` | 2 | Initial PoW difficulty |
| `PEER_HOST` / `PEER_PORT` | — | Connect to peer |

## API (implemented in `src/api` — uses your blockchain)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/blocks` | Full chain |
| GET | `/chain/length` | Block count |
| GET | `/balance?address=` | UTXO balance |
| GET | `/mempool` | Pending transactions |
| GET | `/wallet` | Miner address |
| POST | `/mine` | Mine block |
| POST | `/transactions` | `{ "recipient", "amount" }` |

## Project layout

```
src/
  crypto/       ← implement
  core/         ← implement
  network/      ← implement
  storage/      ← implement
  api/          provided
  config.js     provided
tests/          provided (do not modify)
```
