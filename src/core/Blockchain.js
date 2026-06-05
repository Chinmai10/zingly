const { notImplemented } = require('../util/notImplemented');
/** @see tests/unit/core/Blockchain*.test.js and tests/integration/* */
class Blockchain {
  constructor(minerAddress, difficulty = 2) {
    this.difficulty = difficulty;
    this.mempool = null;
    this.utxoSet = null;
    this.chain = [];
  }

  createGenesisBlock(minerAddress) {
    notImplemented('Blockchain.createGenesisBlock');
  }

  getLatestBlock() {
    notImplemented('Blockchain.getLatestBlock');
  }

  getDifficultyForNextBlock() {
    notImplemented('Blockchain.getDifficultyForNextBlock');
  }

  validateTransactionInContext(tx, utxoSnapshot) {
    notImplemented('Blockchain.validateTransactionInContext');
  }

  getUtxoSnapshotIncludingMempool(excludeTxId = null) {
    notImplemented('Blockchain.getUtxoSnapshotIncludingMempool');
  }

  addTransaction(transaction) {
    notImplemented('Blockchain.addTransaction');
  }

  minePendingTransactions(minerAddress) {
    notImplemented('Blockchain.minePendingTransactions');
  }

  isChainValid() {
    notImplemented('Blockchain.isChainValid');
  }

  getBalance(address) {
    notImplemented('Blockchain.getBalance');
  }

  replaceChain(newChain) {
    notImplemented('Blockchain.replaceChain');
  }

  toJSON() {
    notImplemented('Blockchain.toJSON');
  }

  static fromJSON(data, minerAddress) {
    notImplemented('Blockchain.fromJSON');
  }
}

module.exports = { Blockchain };
