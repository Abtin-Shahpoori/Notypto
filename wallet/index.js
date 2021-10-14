const Transaction = require('./transaction')
const { STARTING_BALANCE } = require('../config');
const { ec, cryptoHash } = require('../util');
const { decrypt, encrypt } = require('../util/encrypt_decrypt');

class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE;
		this.keyPair = ec.genKeyPair();
		this.publicKey = this.keyPair.getPublic().encode('hex');
		this.seed = this.keyPair.getPrivate().toString('hex').substr(0, 32);
		this.privateKey = encrypt(this.publicKey, this.seed);
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
		return {"Address": this.publicKey, "Seed": this.seed};
	}

	login({ userPublicKey, seed }) {
		if(seed.length < 32) {
			throw new Error('Seed not correct');
		}

		if(decrypt(this.privateKey, seed) === userPublicKey) {
			this.publicKey = ec.keyFromPublic(userPublicKey, 'hex');
		} else {
			throw new Error('Seed not correct');
		}
		return this.publicKey = userPublicKey;
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
}

module.exports = Wallet;
