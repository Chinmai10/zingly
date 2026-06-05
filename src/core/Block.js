const { hashObject, meetsDifficulty } = require('../crypto/hash');
const { MerkleTree } = require('./MerkleTree');
const { Transaction } = require('./Transaction');

class Block {
  constructor(index, timestamp, transactions, previousHash, nonce = 0, difficulty = 2, hash = null) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = nonce;
    this.difficulty = difficulty;
    this.merkleRoot = null;
    this.hash = hash;
    if (hash === null) this.calculateHash();
  }

  computeMerkleRoot() {
    const ids = this.transactions.map(tx => String(tx.id));
    this.merkleRoot = new MerkleTree(ids).root;
    return this.merkleRoot;
  }

  calculateHash() {
    this.computeMerkleRoot();
    this.hash = hashObject({
      index: this.index,
      timestamp: this.timestamp,
      merkleRoot: this.merkleRoot,
      previousHash: this.previousHash,
      nonce: this.nonce,
      difficulty: this.difficulty,
    });
    return this.hash;
  }

  mine() {
    this.computeMerkleRoot();
    this.nonce = 0;
    do {
      this.nonce++;
      this.hash = hashObject({
        index: this.index,
        timestamp: this.timestamp,
        merkleRoot: this.merkleRoot,
        previousHash: this.previousHash,
        nonce: this.nonce,
        difficulty: this.difficulty,
      });
    } while (!meetsDifficulty(this.hash, this.difficulty));
  }

  isValid(previousBlock) {
    const ids = this.transactions.map(tx => String(tx.id));
    const computedRoot = new MerkleTree(ids).root;
    if (computedRoot !== this.merkleRoot) return false;

    const expectedHash = hashObject({
      index: this.index,
      timestamp: this.timestamp,
      merkleRoot: this.merkleRoot,
      previousHash: this.previousHash,
      nonce: this.nonce,
      difficulty: this.difficulty,
    });
    if (expectedHash !== this.hash) return false;

    if (!meetsDifficulty(this.hash, this.difficulty)) return false;

    if (previousBlock !== null && this.previousHash !== previousBlock.hash) return false;

    return true;
  }

  toJSON() {
    return {
      index: this.index,
      timestamp: this.timestamp,
      transactions: this.transactions.map(tx => tx.toJSON()),
      previousHash: this.previousHash,
      nonce: this.nonce,
      difficulty: this.difficulty,
      merkleRoot: this.merkleRoot,
      hash: this.hash,
    };
  }

  static fromJSON(data) {
    const txs = data.transactions.map(t => Transaction.fromJSON(t));
    const block = new Block(data.index, data.timestamp, txs, data.previousHash, data.nonce, data.difficulty, data.hash);
    block.merkleRoot = data.merkleRoot;
    return block;
  }
}

function createGenesisBlock(coinbaseTx, difficulty = 2) {
  const block = new Block(0, Date.now(), [coinbaseTx], '0', 0, difficulty, null);
  block.mine();
  return block;
}

module.exports = { Block, createGenesisBlock };
