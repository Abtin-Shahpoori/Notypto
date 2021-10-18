const Blockchain = require('.')
const Block = require("./block");
const { cryptoHash } = require("../util")
const Wallet = require('../wallet')
const Transaction = require('../wallet/transaction');

describe('Blockchain', () => {
	let blockchain, newChain, originalChain;

	beforeEach(() => {
		blockchain = new Blockchain();
		newChain = new Blockchain();
		originalChain = blockchain.chain;
		errorMock = jest.fn();

		originalChain = blockchain.chain;
		global.console.error = errorMock;
	});
	
	it('contains a chain Array instance', () => {
		expect(blockchain.chain instanceof Array).toBe(true);
	});
	it('starts with genesis', () => {
		expect(blockchain.chain[0]).toEqual(Block.genesis());
	});
	it('it adds a new block to the chain', () => {
		const newData = "MEOW";
		blockchain.addBlock({ Data: newData });
		expect(blockchain.chain[blockchain.chain.length - 1].Data).toEqual(newData);
	});
	describe('isValidChain()', () => {

		describe('when the chain does not start with genesis', () => {
			it('returns false', () => {
				blockchain.chain[0] = { Data: 'fake-genesis' };
				expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
			});
		});


		describe('when the chain does start with the genesis block and has multiple blocks', () => {
			beforeEach(() => {
				blockchain.addBlock({ Data: 'Bears' });
				blockchain.addBlock({ Data: 'Bears' });
				blockchain.addBlock({ Data: 'Bearsads' });
			});
			describe('last hash has changed', () => {				
				it('returns false', () => {
					blockchain.chain[2].lasthash = 'broken-lastHash';
					expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
				});
			});

			describe('contains a block with an invalid field', () => {
				it('returns false', () => {
					blockchain.chain[2].Data = 'Evil-init';
					expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
				});
			});

			describe('the chain doesnt contain invalid blocks', () => {
				it('returns true', () => {
					expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
				});
			});

			describe('the chain contains a block with a jumped difficulty', () => {
				it('returns false', () => {
					const lastBlock = blockchain.chain[blockchain.chain.length -1];
					const lasthash = lastBlock.hash;
					const timestamp = Date.now();
					const nonce = 0;
					const data = [];
					const difficulty = lastBlock.difficulty - 3;
					const hash = cryptoHash(timestamp, lasthash, difficulty, nonce, data)

					const badBlock = new Block({ timestamp, lasthash, hash, nonce, difficulty, data });
					blockchain.chain.push(badBlock);
					expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
				});
			});
		});
	});
	describe('replaceChain()', () => {
		let logMock;
		beforeEach(() => {
			logMock = jest.fn();
			
			global.console.log = logMock;
		});

		describe('when the new chain is not longer', () => {
			beforeEach(() => {
				newChain.chain[0] = { new: 'chain' };
				blockchain.replaceChain(newChain.chain);
			});
			
			it('doesnt replace chain', () => {
				expect(blockchain.chain).toEqual(originalChain);
			});
			it('logs an error', () => {
				expect(errorMock).toHaveBeenCalled();
			});
		});

		describe('when the new chain is longer', () => {
			beforeEach(() => {
				newChain.addBlock({ Data: 'Bears' });
				newChain.addBlock({ Data: 'Bears' });
				newChain.addBlock({ Data: 'Bearsads' });
			});

			describe('the cahin is invalid', () => { 
				beforeEach(() => {
					newChain.chain[2].hash = 'fake-hash';
					blockchain.replaceChain(newChain.chain);
				});

				it('doesnt replace chain', () => {
					expect(blockchain.chain).toEqual(originalChain);
				});

				it('logs an error', () => {
					expect(errorMock).toHaveBeenCalled();
				});
			});

			describe('the chain is valid', () => {
				beforeEach(() => {
					blockchain.replaceChain(newChain.chain);
				});

				it('replace chain', () => {
					expect(blockchain.chain).toEqual(newChain.chain);
				});

				it('logs about the chain replacement', () => {
					expect(logMock).toHaveBeenCalled()
				});
			});
		});

		describe('and the validateTransaction flag is true', () => {
			it('calls validTransactionData()', () => {
				const validTransactionDataMock = jest.fn();

				blockchain.validTransactionData = validTransactionDataMock;

				newChain.addBlock({ data: 'foo' });
				blockchain.replaceChain(newChain.chain, true);

				expect(validTransactionDataMock).toHaveBeenCalled();
			});
		});
	})

	describe('validTransactionData', () => {
		let transaction, rewardTransaction, wallet;
		beforeEach(() => {
			wallet = new Wallet({ privateKey: 'e99b2615b87da28752022963f7f225f5f0114244da765b06b941ba7ba28ba121'});
			transaction = wallet.createTransaction({ recipient: 'burn', amount: 30 });
			rewardTransaction = Transaction.rewardTransaction({ minerWallet: wallet });
		});

		describe('and the transcation data is valid', () => {
			it('returns true', () => {
				newChain.addBlock({ Data: { Transactions: [transaction, rewardTransaction] } });
				expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(true);
				expect(errorMock).not.toHaveBeenCalled();
			});
		});

		describe('and the transaction data has multiple rewards', () => {
			it('returns false and logs an error', () => {
				newChain.addBlock({ Data: { Transactions: [transaction, rewardTransaction, rewardTransaction] }  })
				expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);
				expect(errorMock).toHaveBeenCalled();
			});
		});

		describe('and the transaction has at least one malformes outputMap', () => {
			describe('the transaction is not a reward transaction', () => {
				it('returns false and logs an error', () => {
					transaction.outputMap[wallet.publicKey] = 6969;
					newChain.addBlock({ Data: { Transactions: [transaction, rewardTransaction] } });
					expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);
					expect(errorMock).toHaveBeenCalled();
				});
			});

			describe('and the transaction is a reward transaction', () => {
				it('returns false and logs an error', () => {
					rewardTransaction.outputMap[wallet.publicKey] = 999999;
					newChain.addBlock({ Data: { Transactions: [transaction, rewardTransaction] } });
					expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);
					expect(errorMock).toHaveBeenCalled();
				});
			});
		});

		describe('and the transaction data has at least one malformed input', () => {	
			it('returns false and logs an error', () => {
				wallet.balance = 9000;
				const evilOutputMap = {
					[wallet.publicKey]: 8900,
					fooRecipient: 100
				};

				const evilTransaction = {
					input: {
						timestamp: Date.now(),
						amount: wallet.balance,
						address: wallet.publicKey,
						signature: wallet.sign(evilOutputMap)
					}, 
					outputMap: evilOutputMap
				};

				newChain.addBlock({ Data: { Transactions: [evilTransaction], rewardTransaction } });
				expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);
				expect(errorMock).toHaveBeenCalled();
			});
		});

		describe('and a block contains multiple identical transactions', () => {	
			it('returns false and logs an error', () => {
				newChain.addBlock({ Data: { Transactions: [transaction, transaction, transaction] } });

				expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);
				expect(errorMock).toHaveBeenCalled();
			});
		});
	});
});
