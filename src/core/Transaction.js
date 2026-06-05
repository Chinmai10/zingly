const { hashObject } = require('../crypto/hash');
const { signData, verifySignature } = require('../crypto/keyPair');
const { UTXOSet } = require('./UTXOSet');
const { COINBASE_TX_ID } = require('../config');

class Transaction {
  constructor(inputs = [], outputs = [], timestamp = Date.now()) {
    this.inputs = inputs;
    this.outputs = outputs;
    this.timestamp = timestamp;
    this.signatures = {};
    this.id = null;
  }

  static coinbase(recipientAddress, amount, timestamp = Date.now()) {
    const inputs = [{ txId: COINBASE_TX_ID, outputIndex: 0 }];
    const outputs = [{ address: recipientAddress, amount }];
    const tx = new Transaction(inputs, outputs, timestamp);
    tx.id = tx.calculateId();
    return tx;
  }

  static create(senderAddress, recipientAddress, amount, utxos, changeAddress) {
    let totalSelected = 0;
    const selectedUtxos = [];
    for (const utxo of utxos) {
      selectedUtxos.push(utxo);
      totalSelected += utxo.amount;
      if (totalSelected >= amount) break;
    }
    if (totalSelected < amount) throw new Error('Insufficient balance');

    const inputs = selectedUtxos.map(u => ({ txId: u.txId, outputIndex: u.outputIndex }));
    const outputs = [{ address: recipientAddress, amount }];
    const change = totalSelected - amount;
    if (change > 0) outputs.push({ address: changeAddress || senderAddress, amount: change });

    const tx = new Transaction(inputs, outputs);
    tx.id = tx.calculateId();
    return tx;
  }

  calculateId() {
    return hashObject({
      inputs: this.inputs.map(i => ({ txId: i.txId, outputIndex: i.outputIndex })),
      outputs: this.outputs,
      timestamp: this.timestamp,
    });
  }

  getSigningPayload(inputIndex) {
    return hashObject({
      inputs: this.inputs.map(i => ({ txId: i.txId, outputIndex: i.outputIndex })),
      outputs: this.outputs,
      inputIndex,
    });
  }

  sign(privateKey, publicKey) {
    if (this.isCoinbase()) throw new Error('Cannot sign coinbase');
    for (let i = 0; i < this.inputs.length; i++) {
      this.signatures[i] = signData(privateKey, this.getSigningPayload(i));
    }
    this.signatures._publicKey = publicKey;
  }

  verify() {
    if (this.isCoinbase()) return true;
    const pubKey = this.signatures._publicKey;
    if (!pubKey && this.inputs.length > 0) return false;
    for (let i = 0; i < this.inputs.length; i++) {
      const sig = this.signatures[i];
      if (!sig) return false;
      if (!verifySignature(pubKey, this.getSigningPayload(i), sig)) return false;
    }
    return true;
  }

  isCoinbase() {
    return this.inputs[0]?.txId === COINBASE_TX_ID;
  }

  spendFromSnapshot(utxoSnapshot) {
    let totalInput = 0;
    for (const input of this.inputs) {
      const key = UTXOSet.key(input.txId, input.outputIndex);
      const utxo = utxoSnapshot.utxos.get(key);
      if (!utxo) throw new Error('Referenced UTXO not found');
      totalInput += utxo.amount;
    }
    return totalInput;
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
    const tx = new Transaction(data.inputs, data.outputs, data.timestamp);
    tx.id = data.id;
    tx.signatures = data.signatures || {};
    return tx;
  }
}

module.exports = { Transaction };
