const { notImplemented } = require('../util/notImplemented');
/** @see tests/unit/core/Transaction*.test.js */
class Transaction {
  constructor(inputs = [], outputs = [], timestamp = Date.now()) {
    this.inputs = inputs;
    this.outputs = outputs;
    this.timestamp = timestamp;
    this.signatures = {};
    this.id = null;
  }

  static coinbase(recipientAddress, amount, timestamp = Date.now()) {
    notImplemented('Transaction.coinbase');
  }

  static create(senderAddress, recipientAddress, amount, utxos, changeAddress) {
    notImplemented('Transaction.create');
  }

  calculateId() {
    notImplemented('Transaction.calculateId');
  }

  getSigningPayload(inputIndex) {
    notImplemented('Transaction.getSigningPayload');
  }

  sign(privateKey, publicKey) {
    notImplemented('Transaction.sign');
  }

  verify() {
    notImplemented('Transaction.verify');
  }

  isCoinbase() {
    notImplemented('Transaction.isCoinbase');
  }

  spendFromSnapshot(utxoSnapshot) {
    notImplemented('Transaction.spendFromSnapshot');
  }

  toJSON() {
    return {
      id: this.id,
      inputs: this.inputs,
      outputs: this.outputs,
      timestamp: this.timestamp,
      signatures: this.signatures,
    };
  }

  static fromJSON(data) {
    notImplemented('Transaction.fromJSON');
  }
}

module.exports = { Transaction };
