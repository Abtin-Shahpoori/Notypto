const TokenTransaction = require('./token-transaction');
const Transaction = require('./transaction');

class TransactionPool {
	constructor() {
		this.transactionMap = {};
	}

	clear() {
		this.transactionMap = {};
	}

	setTransaction(transaction) {
		this.transactionMap[transaction.id] = transaction;
	}

	setMap(transactionMap) {
		this.transactionMap = transactionMap;
	}

	existingTransaction({ inputAddress, tokenHash }) {
		const transactions = Object.values(this.transactionMap);
		
		return transactions.find(transaction => transaction.outputMap.type === 'token'? transaction.input.address === inputAddress && transaction.input.tokenHash === tokenHash && transaction.input.address != 'MINTED_TOKEN': transaction.input.address === inputAddress);
	}

	validTransaction() {
		return Object.values(this.transactionMap).filter(
			transaction => transaction.outputMap.type === 'token' ? TokenTransaction.validTransaction(transaction) : Transaction.validTransaction(transaction)
		);
	}

	clearBlockchainTransactions({ chain }) {
		for(let i=1; i<chain.length; i++) {
			let block = chain[i];
			for (let transaction of block.Data.Transactions) {
				if (this.transactionMap[transaction.id]) {
					delete this.transactionMap[transaction.id];
				}
			}
		}
	}
}

module.exports = TransactionPool;
