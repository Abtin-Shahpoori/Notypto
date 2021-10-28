const Transaction = require('../wallet/transaction');

class TransactionMiner {
	constructor({ blockchain, transactionPool, wallet, pubsub, pubNotePool }) {
		this.blockchain = blockchain;
		this.transactionPool = transactionPool;
		this.wallet = wallet;
		this.pubsub = pubsub;
		this.pubNotePool = pubNotePool;
	}

	mineTransaction({ wallet }) {
		const validTransactions = this.transactionPool.validTransaction();
		console.log();
		validTransactions.push(
			Transaction.rewardTransaction({ minerWallet: wallet.publicKey, reward: this.blockchain.chain[this.blockchain.chain.length -1].mining_reward })
		);
		
		this.blockchain.addBlock({ Data: { Transactions: validTransactions, Notes: this.pubNotePool.NoteMap } });
		this.pubsub.broadcastChain();
		this.pubNotePool.clear();
		this.transactionPool.clear();
	}
}

module.exports = TransactionMiner;
