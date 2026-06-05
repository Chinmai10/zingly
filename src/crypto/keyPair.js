const { notImplemented } = require('../util/notImplemented');
/** @see tests/unit/crypto/keyPair.test.js */
function generateKeyPair() {
  notImplemented('generateKeyPair');
}

function signData(privateKey, data) {
  notImplemented('signData');
}

function verifySignature(publicKey, data, signature) {
  notImplemented('verifySignature');
}

function publicKeyFingerprint(publicKey) {
  notImplemented('publicKeyFingerprint');
}

module.exports = { generateKeyPair, signData, verifySignature, publicKeyFingerprint };
