const Blockchain = require('../blockchain');
const Assetspool = require('./asset-pool');
const Wallet = require('./index')

describe('assetsPool', () => {
    const assetPool = new Assetspool;
    const blockchain = new Blockchain();
    const wallet = new Wallet({ privateKey: 'e99b2615b87da28752022963f7f225f5f0114244da765b06b941ba7ba28ba121' });

    it('returns a value', () => {
        Wallet.mintNewToken({ minterWallet: wallet, tokenName: 'Test Token', tokenAbbr: 'TT', amount: 10000, chain: blockchain.chain });
        console.log(blockchain);
    });
});