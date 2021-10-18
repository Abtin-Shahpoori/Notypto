const Transaction = require('../wallet/transaction');

class TransactionMiner {
	constructor({ blockchain, transactionPool, wallet, pubsub, pubNotePool, AssetsPool }) {
		this.blockchain = blockchain;
		this.transactionPool = transactionPool;
		this.wallet = wallet;
		this.pubsub = pubsub;
		this.pubNotePool = pubNotePool;
		this.AssetsPool = AssetsPool;
	}

	mineTransaction({ wallet }) {
		const validTransactions = this.transactionPool.validTransaction();
		const Assets = this.AssetsPool.assetsPool;

		validTransactions.push(
			Transaction.rewardTransaction({ minerWallet: wallet.publicKey })	
		);
		
		this.blockchain.addBlock({ Data: { Transactions: validTransactions, Notes: this.pubNotePool.NoteMap }, Assets: Assets  });
		this.pubsub.broadcastChain();
		this.pubNotePool.clear();
		this.transactionPool.clear();
		this.assetsPool.clear();
	}
}

module.exports = TransactionMiner;
