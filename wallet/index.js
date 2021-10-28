const Transaction = require('./transaction');
const { STARTING_BALANCE } = require('../config');
const { ec, cryptoHash } = require('../util');
const TokenTransaction = require('./token-transaction');

class Wallet {
    constructor({ privateKey }) {
        this.balance = STARTING_BALANCE;
		this.keyPair = ec.keyFromPrivate(privateKey, 'hex');
		this.publicKey = this.keyPair.getPublic('hex');
		this.tokenHoldings = {};
    }

    sign(data) {
        return this.keyPair.sign(cryptoHash(data));
    }

    createTransaction({ recipient, amount, chain }) {
		if(chain) {
			this.balance = Wallet.calculateBalance({
				chain,
				address: this.publicKey
			})
		}

        if( amount > this.balance ){
            throw new Error('Amount exceeds balance');
        }

        return new Transaction({ senderWallet: this, recipient, amount });
    }

	createTokenTransaction({ recipient, amount, chain, tokenHash }) {
		if(chain) {
			this.tokenHoldings[tokenHash] = this.calculateTokenBalance({ chain, tokenHash }).Amount;
		}

		if (amount > this.tokenHoldings[tokenHash]) {
            throw new Error('Amount exceeds balance');
		}

		return new TokenTransaction({ recipient, amount, senderWallet: this, tokenHash });
	}

	mintToken({ tokenAbbr, amount, chain }) {
		this.createTransaction({ recipient: '0x000', amount: 0.4, chain })
		return TokenTransaction.mintToken({ minterWallet: this.publicKey, supply: amount, tokenName: tokenAbbr });
	}

	getSeed() {
		return {"Address": this.publicKey, "Seed": this.keyPair.getPrivate('hex')};
	}

	static calculateBalance ({ chain, address }) {
		let hasConductedTransaction = false;
		let outputsTotal = 0;
		for(let i=chain.length - 1; i > 0; i--) {
			const block = chain[i];
			for(let transaction of block.Data.Transactions) {
				if (transaction.outputMap.type == 'token') {
					continue;
				}

				if(transaction.input.address === address) {
					hasConductedTransaction = true;
				}

				const addressOutput = transaction.outputMap[address];
				
				if (addressOutput) {
					outputsTotal = outputsTotal + addressOutput;
				}
			}

			if(hasConductedTransaction) {
				break;
			}
		}

		return hasConductedTransaction ? outputsTotal : STARTING_BALANCE + outputsTotal;
	}

	calculateTokenBalance({ chain, tokenHash }) {
		let outputsTotal = 0;
		let hasConductedTransaction = false;
		let tokenName;
		const address = this.publicKey;
		for(let i=chain.length - 1; i > 0; i--) {
			const block = chain[i];
			for(let transaction of block.Data.Transactions) {
				const addressOutput = transaction.outputMap[address];
				if(transaction.input.address === address) {
					hasConductedTransaction = true;
				}
				
				if (addressOutput && transaction.outputMap['tokenHash'] === tokenHash) {
					outputsTotal += addressOutput;
					if (!tokenName) {
						tokenName = transaction.outputMap.tokenName;
					}
				}
			}

			if(hasConductedTransaction) {
				break;
			}
		}
		return { Amount: outputsTotal, tokenName: tokenName };
	}
}

module.exports = Wallet;