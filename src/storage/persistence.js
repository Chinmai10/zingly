const { writeFile, readFile } = require('node:fs/promises');
const { Blockchain } = require('../core/Blockchain');

async function saveChain(filePath, blockchain) {
  await writeFile(filePath, JSON.stringify(blockchain.toJSON(), null, 2), 'utf8');
}

async function loadChain(filePath, minerAddress) {
  const data = JSON.parse(await readFile(filePath, 'utf8'));
  return Blockchain.fromJSON(data, minerAddress);
}

module.exports = { saveChain, loadChain };
