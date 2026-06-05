const { notImplemented } = require('../util/notImplemented');
/** @see tests/unit/core/Mempool.test.js */
class Mempool {
  constructor() {
    this.transactions = new Map();
  }

  add(transaction) {
    notImplemented('Mempool.add');
  }

  remove(transactionId) {
    notImplemented('Mempool.remove');
  }

  removeMany(ids) {
    notImplemented('Mempool.removeMany');
  }

  getPending(limit = 100) {
    notImplemented('Mempool.getPending');
  }

  has(transactionId) {
    notImplemented('Mempool.has');
  }

  clear() {
    notImplemented('Mempool.clear');
  }

  size() {
    notImplemented('Mempool.size');
  }
}

module.exports = { Mempool };
