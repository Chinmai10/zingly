const { notImplemented } = require('../util/notImplemented');
/** @see tests/network/p2p.test.js */
class P2PServer {
  constructor(blockchain, port) {
    this.blockchain = blockchain;
    this.port = port;
    this.sockets = [];
    this.server = null;
  }

  listen() {
    notImplemented('P2PServer.listen');
  }

  connectSocket(socket) {
    notImplemented('P2PServer.connectSocket');
  }

  connectToPeer(host, port) {
    notImplemented('P2PServer.connectToPeer');
  }

  handleMessage(socket, data) {
    notImplemented('P2PServer.handleMessage');
  }

  broadcast(data) {
    notImplemented('P2PServer.broadcast');
  }

  broadcastTransaction(transaction) {
    notImplemented('P2PServer.broadcastTransaction');
  }

  broadcastChain() {
    notImplemented('P2PServer.broadcastChain');
  }

  sendChain(socket) {
    notImplemented('P2PServer.sendChain');
  }
}

module.exports = { P2PServer };
