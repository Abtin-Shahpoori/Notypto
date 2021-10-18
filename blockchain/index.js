const Block = require("./block");
const { cryptoHash }  =require("../util")
const Wallet = require('../wallet')
const { REWARD_INPUT, MINING_REWARD } = require('../config');
const Transaction = require('../wallet/transaction');

class Blockchain {
	constructor() {
		this.chain = [Block.genesis()];
	}

	addBlock({ Data, Assets }) {
		const newBlock = Block.mineblock({
			lastblock: this.chain[this.chain.length - 1],
			Data,
			Assets: Assets,
		});
		
		this.chain.push(newBlock);
	}

	validTransactionData({ chain }) {
		for (let i=1; i < chain.length; i ++) {
			const block = chain[i];
			const transactionSet = new Set();
			let rewardTransactionCount = 0;

			for (let transaction of block.Data.Transactions){
				if(transaction.input.address === REWARD_INPUT.address) {
					rewardTransactionCount ++;

					if(rewardTransactionCount > 1) {
						console.error('Miner reward exceed limit');
						return false;
					}

					if(Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
						console.error('Miner reward amount is invalid');
						return false;
					}
				} else {
					if(!Transaction.validTransaction(transaction)) {
						console.error('Invalid Transaction');
						return false;
					} 

					const trueBalance = Wallet.calculateBalance({
						chain: this.chain,
						address: transaction.input.address
					});

					if(transaction.input.amount !== trueBalance) {
						console.error('Invalid input amount');
						return false;
					}

					if(transactionSet.has(transaction)) {
						console.error('An identical transaction appears more than once in the block');
						return false;
					} else {
						transactionSet.add(transaction);
					}
				}
			}
		}

		return true;
	}

	static isValidChain(chain) {
		if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))  {
			return false;
		}
		for(let i = 1; i < chain.length; i ++) {
			const block = chain[i];
			const actuallLastHash = chain[i - 1].hash;
			const lastDifficulty = chain[i - 1].difficulty;
			const { timestamp, Data, lasthash, hash, nonce, difficulty} = block;
			if(lasthash !== actuallLastHash) {
				return false;
			}
			const validatedHash = cryptoHash(timestamp, lasthash, Data, nonce, difficulty);
			if(hash !== validatedHash) {
				return false;
			}
			if(Math.abs(lastDifficulty - difficulty) > 1) {
				return false;
			}
		}
		return true;
	}

	replaceChain(chain, validateTransactions, onSuccess) {
		if(chain.length <= this.chain.length){
			console.error('The incoming chain should be longer')
			return;
		}
		if(!Blockchain.isValidChain(chain)) {
			console.error('The incoming chain must be valid')
			return;
		}

		if(validateTransactions && !this.validTransactionData({ chain })) {
			console.error('the incoming chain has invalid data');
			return;
		}
		if(onSuccess) onSuccess();
		console.log('replacing chain with', chain)
		this.chain = chain;
	}
}

module.exports = Blockchain;
