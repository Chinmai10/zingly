const { WebSocketServer, WebSocket } = require('ws');
const { Block } = require('../core/Block');
const { Transaction } = require('../core/Transaction');

const MSG = { CHAIN: 'CHAIN', TRANSACTION: 'TRANSACTION', REQUEST_CHAIN: 'REQUEST_CHAIN' };

class P2PServer {
  constructor(blockchain, port) {
    this.blockchain = blockchain;
    this.port = port;
    this.sockets = [];
    this.server = null;
  }

  listen() {
    const wss = new WebSocketServer({ port: this.port });
    const origClose = wss.close.bind(wss);
    wss.close = (cb) => {
      wss.clients.forEach(c => c.terminate());
      origClose(cb);
    };
    this.server = wss;
    wss.on('connection', (socket) => this.connectSocket(socket));
    return this;
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    socket.on('message', (data) => this.handleMessage(socket, data));
    socket.on('close', () => { this.sockets = this.sockets.filter(s => s !== socket); });
    socket.on('error', () => {});
    this.sendChain(socket);
  }

  connectToPeer(host, port) {
    const ws = new WebSocket(`ws://${host}:${port}`);
    ws.on('open', () => this.connectSocket(ws));
    ws.on('error', () => {});
  }

  handleMessage(socket, data) {
    try {
      const msg = JSON.parse(data);
      if (msg.type === MSG.CHAIN) {
        const chain = msg.chain.map(b => Block.fromJSON(b));
        this.blockchain.replaceChain(chain);
      } else if (msg.type === MSG.TRANSACTION) {
        try {
          const tx = Transaction.fromJSON(msg.transaction);
          this.blockchain.addTransaction(tx);
        } catch {}
      } else if (msg.type === MSG.REQUEST_CHAIN) {
        this.sendChain(socket);
      }
    } catch {}
  }

  broadcast(data) {
    const msg = JSON.stringify(data);
    for (const socket of this.sockets) {
      if (socket.readyState === WebSocket.OPEN) socket.send(msg);
    }
  }

  broadcastTransaction(transaction) {
    this.broadcast({ type: MSG.TRANSACTION, transaction: transaction.toJSON() });
  }

  broadcastChain() {
    this.broadcast({ type: MSG.CHAIN, chain: this.blockchain.chain.map(b => b.toJSON()) });
  }

  sendChain(socket) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: MSG.CHAIN, chain: this.blockchain.chain.map(b => b.toJSON()) }));
    }
  }
}

module.exports = { P2PServer };
