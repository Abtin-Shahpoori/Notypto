const Wallet = require('.');
const Blockchain = require('../blockchain');
const TokenTransaction = require('./token-transaction');
const Transaction = require('./transaction');

const wallet = new Wallet({ privateKey: 'e99b2615b87da28752022963f7f225f5f0114244da765b06b941ba7ba28ba121' });
const tx = new TokenTransaction({ recipient: '4a', amount: 10, senderWallet:  wallet, tokenHash: '0x34booojoliumoon' });
const tx1 = new Transaction({ senderWallet: wallet, recipient: '0x0', amount: 10 })
const blockchain = new Blockchain();

tx.update({ senderWallet: wallet, recipient: '4a', amount: 1 })
TokenTransaction.mintToken({ minterWallet: wallet, supply: 1000000, tokenName: 'ACDX'});

// console.log(TokenTransaction.mintToken({ minterWallet: wallet, supply: 1000000, tokenName: 'ACDX'}));
console.log(wallet.calculateTokenBalance({ chain: blockchain.chain, tokenHash: '54e5621975a3c81f165856d555eea94cb148a854f406c4c75f90429b750ec722' }));