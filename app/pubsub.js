const redis = require('redis');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION',
	NOTE: 'NOTE',
};

class PubSub {
    constructor({ blockchain, transactionPool, wallet, notePool, redisUrl }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
		this.notePool = notePool;

        this.pusblisher = redis.createClient(redisUrl);
        this.subscriber = redis.createClient(redisUrl);

        this.subscribeTochannels();

        this.subscriber.on('message', (channel, message) => {
            this.handleMessage(channel, message)
        });
    } 

    handleMessage(channel, message) {
        console.log(`Message recieved, channel ${channel}. Message: ${message}`)

        const parsedMessage = JSON.parse(message);

        switch(channel) {
            case CHANNELS.BLOCKCHAIN: 
						this.blockchain.replaceChain(parsedMessage, true, () => {
							this.transactionPool.clearBlockchainTransactions({
								chain: parsedMessage
							});
							this.notePool.clear();
						});
                break;
            case CHANNELS.TRANSACTION:
                if (!this.transactionPool.existingTransaction({
                    inputAddress: this.wallet.publicKey
                })) {
                    this.transactionPool.setTransaction(parsedMessage);
                }
                break;
							case CHANNELS.NOTE:
								this.notePool.setNote(parsedMessage);
								break;
							default:
                return;
        }
    }

    subscribeTochannels() {
        Object.values(CHANNELS).forEach(channel => {
            this.subscriber.subscribe(channel);
        });
    }

    publish({ channel, message }) {
        this.subscriber.unsubscribe(channel, () => {
            this.pusblisher.publish(channel, message, () => {
                this.subscriber.subscribe(channel);
            });
        });

    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain),
        });
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction),
        });
    }

	broadcastNote(Note) {
		this.publish({
			channel: CHANNELS.NOTE,
			message: JSON.stringify(Note),
		});
	}
}

module.exports = PubSub;
