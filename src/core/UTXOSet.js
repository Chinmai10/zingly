class UTXOSet {
  constructor() {
    this.utxos = new Map();
  }

  static key(txId, outputIndex) {
    return `${txId}:${outputIndex}`;
  }

  add(tx) {
    tx.outputs.forEach((output, index) => {
      const key = UTXOSet.key(tx.id, index);
      this.utxos.set(key, { txId: tx.id, outputIndex: index, address: output.address, amount: output.amount });
    });
  }

  spend(tx) {
    for (const input of tx.inputs) {
      this.utxos.delete(UTXOSet.key(input.txId, input.outputIndex));
    }
  }

  applyTransaction(tx) {
    if (!tx.isCoinbase()) this.spend(tx);
    this.add(tx);
  }

  applyBlock(transactions) {
    for (const tx of transactions) {
      this.applyTransaction(tx);
    }
  }

  getBalance(address) {
    let total = 0;
    for (const utxo of this.utxos.values()) {
      if (utxo.address === address) total += utxo.amount;
    }
    return total;
  }

  getUnspentForAddress(address) {
    return Array.from(this.utxos.values()).filter(u => u.address === address);
  }

  has(txId, outputIndex) {
    return this.utxos.has(UTXOSet.key(txId, outputIndex));
  }

  clone() {
    const copy = new UTXOSet();
    copy.utxos = new Map(this.utxos);
    return copy;
  }

  toJSON() {
    return Array.from(this.utxos.values());
  }

  static fromJSON(entries) {
    const set = new UTXOSet();
    for (const entry of entries) {
      set.utxos.set(UTXOSet.key(entry.txId, entry.outputIndex), entry);
    }
    return set;
  }
}

module.exports = { UTXOSet };
