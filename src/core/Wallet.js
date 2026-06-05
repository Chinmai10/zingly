const { notImplemented } = require('../util/notImplemented');
/** @see tests/unit/core/Wallet.test.js */
class Wallet {
  constructor(keyPair = null) {
    this.keyPair = keyPair;
    this.address = null;
  }

  createTransaction(recipientAddress, amount, utxos) {
    notImplemented('Wallet.createTransaction');
  }

  getPublicKey() {
    notImplemented('Wallet.getPublicKey');
  }
}

module.exports = { Wallet };
