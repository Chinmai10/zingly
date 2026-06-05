const { Block, createGenesisBlock } = require('./Block');
const { Transaction } = require('./Transaction');
const { UTXOSet } = require('./UTXOSet');
const { Mempool } = require('./Mempool');
const { MINING_REWARD, DIFFICULTY_ADJUSTMENT_INTERVAL, TARGET_BLOCK_TIME_MS } = require('../config');

class Blockchain {
  constructor(minerAddress, difficulty = 2) {
    this.difficulty = difficulty;
    this.mempool = new Mempool();
    this.utxoSet = new UTXOSet();
    this.chain = [];
    this._initGenesis(minerAddress);
  }

  _initGenesis(minerAddress) {
    const coinbase = Transaction.coinbase(minerAddress, MINING_REWARD);
    const genesis = createGenesisBlock(coinbase, this.difficulty);
    this.chain.push(genesis);
    this.utxoSet.applyBlock(genesis.transactions);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  getDifficultyForNextBlock() {
    const len = this.chain.length;
    if (len <= 1 || (len - 1) % DIFFICULTY_ADJUSTMENT_INTERVAL !== 0) {
      return this.difficulty;
    }
    const startIdx = Math.max(0, len - 1 - DIFFICULTY_ADJUSTMENT_INTERVAL);
    const firstBlock = this.chain[startIdx];
    const lastBlock = this.chain[len - 1];
    const elapsed = lastBlock.timestamp - firstBlock.timestamp;
    const expected = TARGET_BLOCK_TIME_MS * DIFFICULTY_ADJUSTMENT_INTERVAL;
    if (elapsed < expected / 2) return this.difficulty + 1;
    if (elapsed > expected * 2) return Math.max(1, this.difficulty - 1);
    return this.difficulty;
  }

  validateTransactionInContext(tx, utxoSnapshot = null) {
    const snapshot = utxoSnapshot || this.utxoSet;
    if (tx.isCoinbase()) return { valid: true };
    let totalInput = 0;
    for (const input of tx.inputs) {
      const key = UTXOSet.key(input.txId, input.outputIndex);
      const utxo = snapshot.utxos.get(key);
      if (!utxo) return { valid: false, reason: 'Referenced UTXO not found' };
      totalInput += utxo.amount;
    }
    const totalOutput = tx.outputs.reduce((sum, o) => sum + o.amount, 0);
    if (totalOutput > totalInput) return { valid: false, reason: 'Outputs exceed inputs' };
    if (!tx.verify()) return { valid: false, reason: 'Invalid signature' };
    return { valid: true };
  }

  getUtxoSnapshotIncludingMempool(excludeTxId = null) {
    const snapshot = this.utxoSet.clone();
    for (const tx of this.mempool.getPending()) {
      if (tx.id === excludeTxId) continue;
      snapshot.spend(tx);
      snapshot.add(tx);
    }
    return snapshot;
  }

  addTransaction(transaction) {
    const snapshot = this.getUtxoSnapshotIncludingMempool();
    const result = this.validateTransactionInContext(transaction, snapshot);
    if (!result.valid) throw new Error(result.reason);
    this.mempool.add(transaction);
  }

  minePendingTransactions(minerAddress) {
    const coinbase = Transaction.coinbase(minerAddress, MINING_REWARD);
    const pendingTxs = this.mempool.getPending();
    const transactions = [coinbase, ...pendingTxs];
    const difficulty = this.getDifficultyForNextBlock();
    const block = new Block(
      this.chain.length,
      Date.now(),
      transactions,
      this.getLatestBlock().hash,
      0,
      difficulty,
      null
    );
    block.mine();
    this.chain.push(block);
    this.utxoSet.applyBlock(transactions);
    this.mempool.removeMany(pendingTxs.map(tx => tx.id));
    this.difficulty = difficulty;
    return block;
  }

  isChainValid() {
    if (!this.chain[0].isValid(null)) return false;
    for (let i = 1; i < this.chain.length; i++) {
      if (!this.chain[i].isValid(this.chain[i - 1])) return false;
    }
    return true;
  }

  getBalance(address) {
    return this.utxoSet.getBalance(address);
  }

  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) return false;
    if (!newChain[0].isValid(null)) return false;
    for (let i = 1; i < newChain.length; i++) {
      if (!newChain[i].isValid(newChain[i - 1])) return false;
    }
    const newUtxoSet = new UTXOSet();
    for (const block of newChain) {
      newUtxoSet.applyBlock(block.transactions);
    }
    this.chain = newChain;
    this.utxoSet = newUtxoSet;
    this.difficulty = newChain[newChain.length - 1].difficulty;
    this.mempool.clear();
    return true;
  }

  toJSON() {
    return {
      chain: this.chain.map(b => b.toJSON()),
      difficulty: this.difficulty,
      utxoSet: this.utxoSet.toJSON(),
    };
  }

  static fromJSON(data, minerAddress) {
    const bc = Object.create(Blockchain.prototype);
    bc.difficulty = data.difficulty;
    bc.mempool = new Mempool();
    bc.utxoSet = UTXOSet.fromJSON(data.utxoSet);
    bc.chain = data.chain.map(b => Block.fromJSON(b));
    return bc;
  }
}

module.exports = { Blockchain };
