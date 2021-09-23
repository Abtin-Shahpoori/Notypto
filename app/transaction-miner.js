const Transaction = require('../wallet/transaction');

class TransactionMiner {
	constructor({ blockchain, transactionPool, wallet, pubsub, pubNotePool }) {
		this.blockchain = blockchain;
		this.transactionPool = transactionPool;
		this.wallet = wallet;
		this.pubsub = pubsub;
		this.pubNotePool = pubNotePool;
	}

	mineTransaction() {
		const validTransactions = this.transactionPool.validTransaction();

		validTransactions.push(
			Transaction.rewardTransaction({ minerWallet: this.wallet })	
		);
		
		this.blockchain.addBlock({ Data: { Transactions: validTransactions, Notes: this.pubNotePool.NoteMap }  });
		this.pubsub.broadcastChain();
		this.pubNotePool.clear();
		this.transactionPool.clear();
	}
}

module.exports = TransactionMiner;
