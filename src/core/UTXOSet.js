const { notImplemented } = require('../util/notImplemented');
/** @see tests/unit/core/UTXOSet.test.js */
class UTXOSet {
  constructor() {
    this.utxos = new Map();
  }

  static key(txId, outputIndex) {
    return `${txId}:${outputIndex}`;
  }

  add(tx) {
    notImplemented('UTXOSet.add');
  }

  spend(tx) {
    notImplemented('UTXOSet.spend');
  }

  applyTransaction(tx) {
    notImplemented('UTXOSet.applyTransaction');
  }

  applyBlock(transactions) {
    notImplemented('UTXOSet.applyBlock');
  }

  getBalance(address) {
    notImplemented('UTXOSet.getBalance');
  }

  getUnspentForAddress(address) {
    notImplemented('UTXOSet.getUnspentForAddress');
  }

  has(txId, outputIndex) {
    notImplemented('UTXOSet.has');
  }

  clone() {
    notImplemented('UTXOSet.clone');
  }

  toJSON() {
    notImplemented('UTXOSet.toJSON');
  }

  static fromJSON(entries) {
    notImplemented('UTXOSet.fromJSON');
  }
}

module.exports = { UTXOSet };
