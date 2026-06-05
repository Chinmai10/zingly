const { generateKeyPairSync, createSign, createVerify, createHash } = require('node:crypto');

function generateKeyPair() {
  const { publicKey, privateKey } = generateKeyPairSync('ec', {
    namedCurve: 'prime256v1',
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  return { publicKey, privateKey };
}

function signData(privateKey, data) {
  const sign = createSign('SHA256');
  sign.update(typeof data === 'string' ? data : JSON.stringify(data));
  return sign.sign(privateKey, 'hex');
}

function verifySignature(publicKey, data, signature) {
  try {
    const verify = createVerify('SHA256');
    verify.update(typeof data === 'string' ? data : JSON.stringify(data));
    return verify.verify(publicKey, signature, 'hex');
  } catch {
    return false;
  }
}

function publicKeyFingerprint(publicKey) {
  return createHash('sha256').update(publicKey).digest('hex').slice(0, 16);
}

module.exports = { generateKeyPair, signData, verifySignature, publicKeyFingerprint };
