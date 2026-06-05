const { notImplemented } = require('../util/notImplemented');
/** @see tests/unit/core/MerkleTree.test.js */
class MerkleTree {
  constructor(leaves = []) {
    notImplemented('MerkleTree constructor');
  }

  static verify(leaf, proof, root) {
    notImplemented('MerkleTree.verify');
  }
}

module.exports = { MerkleTree };
