const { notImplemented } = require('../util/notImplemented');
/** @see tests/unit/core/Block*.test.js */
class Block {
  constructor(
    index,
    timestamp,
    transactions,
    previousHash,
    nonce = 0,
    difficulty = 2,
    hash = null
  ) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = nonce;
    this.difficulty = difficulty;
    this.merkleRoot = null;
    this.hash = hash;
  }

  computeMerkleRoot() {
    notImplemented('Block.computeMerkleRoot');
  }

  calculateHash() {
    notImplemented('Block.calculateHash');
  }

  mine() {
    notImplemented('Block.mine');
  }

  isValid(previousBlock) {
    notImplemented('Block.isValid');
  }

  toJSON() {
    notImplemented('Block.toJSON');
  }

  static fromJSON(data) {
    notImplemented('Block.fromJSON');
  }
}

function createGenesisBlock(coinbaseTx, difficulty = 2) {
  notImplemented('createGenesisBlock');
}

module.exports = { Block, createGenesisBlock };
