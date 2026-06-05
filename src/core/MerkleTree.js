const { sha256 } = require('../crypto/hash');

class MerkleTree {
  constructor(leaves = []) {
    this.leaves = leaves.slice();
    if (leaves.length === 0) {
      this.root = null;
      this._layers = [];
      return;
    }
    this._layers = this._buildLayers(leaves.map(l => sha256(String(l))));
    this.root = this._layers[this._layers.length - 1][0];
  }

  _buildLayers(hashes) {
    const layers = [hashes.slice()];
    let current = hashes.slice();
    while (current.length > 1) {
      if (current.length % 2 !== 0) current.push(current[current.length - 1]);
      const next = [];
      for (let i = 0; i < current.length; i += 2) {
        next.push(sha256(current[i] + current[i + 1]));
      }
      layers.push(next);
      current = next;
    }
    return layers;
  }

  getProof(index) {
    if (index < 0 || index >= this.leaves.length) return null;
    const proof = [];
    let idx = index;
    for (let i = 0; i < this._layers.length - 1; i++) {
      const layer = this._layers[i];
      const isLeft = idx % 2 === 0;
      const pairIdx = isLeft ? idx + 1 : idx - 1;
      const sibling = layer[pairIdx] !== undefined ? layer[pairIdx] : layer[idx];
      proof.push({ position: isLeft ? 'right' : 'left', hash: sibling });
      idx = Math.floor(idx / 2);
    }
    return proof;
  }

  static verify(leaf, proof, root) {
    if (!proof || !root) return false;
    let hash = sha256(String(leaf));
    for (const { position, hash: siblingHash } of proof) {
      hash = position === 'right'
        ? sha256(hash + siblingHash)
        : sha256(siblingHash + hash);
    }
    return hash === root;
  }
}

module.exports = { MerkleTree };
