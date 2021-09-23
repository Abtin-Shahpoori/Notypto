const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain');

describe('TransactionPool', () => {
	let transactionPool, transaction, senderWallet;

	beforeEach(() => {
		transactionPool = new TransactionPool();
		senderWallet = new Wallet();
		transaction = new Transaction({
			senderWallet,
			recipient: 'myself',
			amount: 3
		});
	});

	describe('setTransaction', () => {
		it('adds a transaction', () => {
			transactionPool.setTransaction(transaction);
			expect(transactionPool.transactionMap[transaction.id]).toBe(transaction);
		});
	});

	describe('existingTransaction()', () => {
		it('returns an exiting transaction given an input address', () => {
			transactionPool.setTransaction(transaction);
			expect(transactionPool.existingTransaction({ inputAddress: senderWallet.publicKey })).toBe(transaction);
		});
	});

	describe('validTransactions()', () => {
		let validTransactions;

		beforeEach(() => {
			validTransactions = [];
			errorMock = jest.fn();
			global.console.error = errorMock;

			for(let i = 0; i< 10; i ++) {	
				transaction = new Transaction({
					senderWallet, 
					recipient: 'burn address',
					amount: 100,
				});
				
				if(i%3 === 0) {
					transaction.input.amount = 999999;
				} else if (i % 3 === 1) {
					transaction.input.signature = new Wallet().sign('foo');
				} else {
					validTransactions.push(transaction);
				}

				transactionPool.setTransaction(transaction);
			}
		});	

		it('returns a valid transaction', () => {
				expect(transactionPool.validTransaction()).toEqual(validTransactions);
		});

		it('logs an error for the invalid transactions', () => {
			transactionPool.validTransaction();
			expect(errorMock).toHaveBeenCalled;
		});
	});	
	
	describe('clear()', () => {
		it('clears the transaction', () => {
			transactionPool.clear();
			expect(transactionPool.transactionMap).toEqual({});
		});
	});

	describe('clearBlockchainTransactions()', () => {
		it('clears the pool', () => {
			const blockchain = new Blockchain();	
			const expectedTransactionMap = {};
			
			for(let i=0; i <6; i ++) {
				const transaction = new Wallet().createTransaction({
					recipient: 'burnAddress', amount: 20
				});

				transactionPool.setTransaction(transaction);
				if(i%2===0) {
					blockchain.addBlock({ Data: {Transactions: [transaction] } });
				} else {
					expectedTransactionMap[transaction.id] = transaction;
				}
			}

			transactionPool.clearBlockchainTransactions({ chain: blockchain.chain });
			expect(transactionPool.transactionMap).toEqual(expectedTransactionMap);
		});
	});
});
