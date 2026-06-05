const { createHash } = require('node:crypto');

function sha256(data) {
  return createHash('sha256').update(data).digest('hex');
}

function hashObject(obj) {
  return sha256(JSON.stringify(obj));
}

function meetsDifficulty(hash, difficulty) {
  return hash.startsWith('0'.repeat(difficulty));
}

module.exports = { sha256, hashObject, meetsDifficulty };
