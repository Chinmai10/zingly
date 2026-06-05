const { generateKeyPair, publicKeyFingerprint } = require('../crypto/keyPair');
const { Transaction } = require('./Transaction');

class Wallet {
  constructor(keyPair = null) {
    this.keyPair = keyPair || generateKeyPair();
    this.address = publicKeyFingerprint(this.keyPair.publicKey);
  }

  createTransaction(recipientAddress, amount, utxos) {
    const tx = Transaction.create(this.address, recipientAddress, amount, utxos, this.address);
    tx.sign(this.keyPair.privateKey, this.keyPair.publicKey);
    return tx;
  }

  getPublicKey() {
    return this.keyPair.publicKey;
  }
}

module.exports = { Wallet };
