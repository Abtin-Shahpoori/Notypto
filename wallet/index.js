const Transaction = require('./transaction')
const { STARTING_BALANCE } = require('../config');
const { ec, cryptoHash, checkExistingToken } = require('../util');
const Assestspool = require('./asset-pool');

class Wallet {
    constructor({ privateKey }) {
        this.balance = STARTING_BALANCE;
		this.keyPair = ec.keyFromPrivate(privateKey, 'hex');
		this.publicKey = this.keyPair.getPublic('hex');
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

	getSeed() {
		return {"Address": this.publicKey, "Seed": this.keyPair.getPrivate('hex')};
	}

	static calculateBalance({ chain, address }) {
		let hasConductedTransaction = false;
		let outputsTotal = 0;
		for(let i=chain.length - 1; i > 0; i--) {
			const block = chain[i];
			for(let transaction of block.Data.Transactions) {
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

	static mintNewToken({ minterWallet, tokenName, tokenAbbr, amount, chain, Assestspool }) {
		const tokenHash = cryptoHash(tokenName);
		minterWallet.createTransaction({ recipient: '0x00', amount: 0.5, chain });
		if(!checkExistingToken({ tokenHash, chain })) {
			return Assestspool.setAsset({ tokenHash: tokenHash, fungibleToken: tokenName, tokenAbbr: tokenAbbr, amount: amount, holder: minterWallet.publicKey });
		} else {
			throw new Error('token already exists');
		}
	}
}

module.exports = Wallet;
