class Assetspool {
    constructor() {
        this.assetsPool = [];
    }

    setAsset({ tokenHash,  fungibleToken, tokenAbbr, amount, holder }) {
        const asset = { "tokenHash": tokenHash, "fungibleToken": fungibleToken, "tokenAbbr": tokenAbbr, "amount": amount, "holder": holder}
        this.assetsPool.push(asset);
    }

    output() {
        return this.assetsPool;
    }

    setPool(assetPool) {
        this.assetsPool = assetPool;
    }

    clear() {
        this.assetsPool = [];
    }

}

module.exports = Assetspool;