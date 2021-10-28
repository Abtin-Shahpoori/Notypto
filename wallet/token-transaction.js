const { verifySignature, cryptoHash } = require('../util');
const uuid = require('uuid/v1');

class TokenTransaction {
    constructor({ recipient, amount, senderWallet, tokenHash, input, outputMap }) {
        this.id = uuid();
        this.outputMap = outputMap || this.createOutputMap({ senderWallet: senderWallet, recipient, amount, tokenHash: tokenHash });
        this.input = input || this.createInput({ senderWallet: senderWallet, outputMap: this.outputMap, tokenHash: tokenHash });
    }

    createOutputMap({ senderWallet, recipient, amount, tokenHash }) {
        const outputMap = {};
        outputMap['type'] = 'token';
        outputMap['tokenHash'] = tokenHash;
        outputMap[recipient] = amount;
        // TOFIX: below statement returns null
        outputMap[senderWallet.publicKey]  = senderWallet.tokenHoldings[tokenHash] - amount;
        return outputMap;
    }

    createInput({ senderWallet, outputMap, tokenHash }) {
        return ({
            timestamp: Date.now(),
            amount: senderWallet.tokenHoldings[tokenHash],
            address: senderWallet.publicKey,
            token: tokenHash,
            signature: senderWallet.sign(outputMap)
        })
    }

    static validTransaction(tokenTransaction) {
        if(tokenTransaction.input.address === 'MINTED_TOKEN') {
            return true;
        }

        const { input: { address, amount, signature }, outputMap} = tokenTransaction;
        let outputTotal = 0, value = Object.values(outputMap);

        for(let i in value) {
            if(typeof(value[i]) === 'number') { 
                outputTotal += value[i];
            }
        }

        if(amount !== outputTotal) {
            console.log(outputTotal);
            console.error(`Invalid transaction from ${address}`)
            return false;
        }

        if (!verifySignature({ publicKey: address, data: outputMap, signature })){
            console.error(`Invalid signature from ${address}`);
            return false;
        }

        return true;
    } 

    update ({ senderWallet, recipient, amount}) {
        if(amount > this.outputMap[senderWallet.publicKey]) {
            throw new Error('Amount exceeds balance');
        }

        if (!this.outputMap[recipient]) {
            this.outputMap[recipient] = amount;
        } else {
            this.outputMap[recipient] = this.outputMap[recipient] + amount;
        }
        this.outputMap[senderWallet.publicKey] = this.outputMap[senderWallet.publicKey] - amount;
        this.input = this.createInput({ senderWallet, outputMap: this.outputMap, tokenHash: this.outputMap['tokenHash'] });
    }

    static mintToken ({ minterWallet, supply, tokenName }) {
        const tokenHash = cryptoHash(tokenName);
        return new this({ 			
            input: { address: 'MINTED_TOKEN', tokenHash: tokenHash },
			outputMap: { type: 'token', [minterWallet]: supply, tokenHash: tokenHash, tokenName: tokenName}
        })
    }
}

module.exports = TokenTransaction;