const express = require('express')
const Blockchain = require('./blockchain');
const PubSub = require('./app/pubsub');
const request = require('request');
const { response } = require('express');
const path = require('path');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet');
const Note = require('./wallet/Note');
const NotePool = require('./wallet/PubNote-pool');
const TransactionMiner = require('./app/transaction-miner');
const { decrypt } = require('./util/encrypt_decrypt')

const isDevelopment = process.env.ENV === 'development';
console.log(process.env.ENV);

const REDIS_URL = isDevelopment ?
	'redis://127.0.0.1:6379': 
	'redis://:pcb08107675285379633dd82d3fa9aefbfdeebe7ddd16b646c8caed4d1dfd40ca@ec2-34-239-208-3.compute-1.amazonaws.com:32219'

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`

let app = express();
const blockchain = new Blockchain();
const wallet = new Wallet();
const transactionPool = new TransactionPool();
const note = new Note();
const notePool = new NotePool();
const pubsub = new PubSub({ blockchain, transactionPool, wallet, notePool, REDIS_URL });
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub, pubNotePool: notePool });
let pubNotes = [];




app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine/', (req, res) => {
    const { Data } = req.body;
    blockchain.addBlock({ Data: Data });
    pubsub.broadcastChain();

    res.redirect('/api/blocks');
}); 

app.post('/api/transact', (req, res) => {
    const { amount, recipient } = req.body;
    let transaction = transactionPool.existingTransaction({ inputAddress: wallet.publicKey });
    try {
        if (transaction) {
            transaction.update({ senderWallet: wallet, recipient, amount });
        } else {
            transaction = wallet.createTransaction({ recipient, amount, chain: blockchain.chain });
        }
    } catch(error) {
        return res.status(400).json({ type: 'error', message: error.message });
    }
    
    transactionPool.setTransaction(transaction);
    pubsub.broadcastTransaction(transaction);
    res.json({ type: 'success', transaction });
});

app.get('/api/transaction-pool-map', (req, res) => {
    res.json(transactionPool.transactionMap);
});

app.post('/api/pub-message', (req, res) => {
	const message = req.body;
	let Fnote;
	try {
		Fnote = note.createPublicOutputMap({ message: req.body, timestamp: Date.now(), senderWallet: wallet });
	} catch(error) {
		return res.status(400).json({type: 'error', message: error.message });	
	}	

	notePool.setNote(Fnote);
	pubsub.broadcastNote(Fnote);

	res.json({ type: 'success', Fnote })
});

app.post('/api/priv-message', (req, res) => {
	const { message } = req.body;
	let Fnote;
	try {
		Fnote = note.createPrivateOutputMap({ message: req.body, timetamp: Date.now(), senderWallet: wallet });
	} catch(error) {
		return res.status(400).json({ type: 'error', messsage: error.message });
	}

	notePool.setNote(Fnote);
	pubsub.broadcastNote(Fnote);

	res.json({ type: 'success', Fnote });
});

app.get('/api/note-pool', (req, res) => {
	res.json(notePool.NoteMap);
});

app.get('/api/mine-transactions', (req, res) => {
	transactionMiner.mineTransaction();
	res.redirect('/api/blocks');
});

app.get('/api/wallet-info', (req, res) => {
	const address = wallet.publicKey;
	res.json({ address, balance: Wallet.calculateBalance({ chain: blockchain.chain,  address }) });	
});

app.get('/api/wallet-personal-Notes', (req, res) => {
	let privNotes = [];
	for (let i  = blockchain.chain.length - 1; i > 0; i --) {
		const block = blockchain.chain[i];	
		for(let note in block.Data.Notes) {
			if(block.Data.Notes[note].PublicKey === wallet.publicKey && block.Data.Notes[note].isPublic === false) {
				privNotes.push({ message: decrypt(block.Data.Notes[note].message, wallet.privateKey.substr(0, 32)), timestamp: block.Data.Notes[note].timestamp});
			}
		}
	}
	res.json(privNotes);
});

app.get('/api/public-notes', (req, res) => {
	for(let i = blockchain.chain.length - 1; i > 0; i --){
		const block = blockchain.chain[i];
		for(let note in block.Data.Notes) {
			if(block.Data.Notes[note].isPublic === true) {
				pubNotes.push({ message: block.Data.Notes[note].message, wallet: block.Data.Notes[note].publicKey, timestamp: block.Data.Notes[note].timestamp });
			}
		}
	}
	res.json(pubNotes);
});

app.get('/api/blocks/length', (req, res) => {
	res.json(blockchain.chain.length);
});

app.get('/api/blocks/:id', (req, res) => {
	const { id } = req.params;
	const { length } = blockchain.chain;
	
	const blocksReversed = blockchain.chain.slice().reverse();
	let startIndex = (id - 1) * 9;
	let endIndex = id * 9;

	startIndex = startIndex < length ? startIndex: length;
	endIndex = endIndex < length ? endIndex: length;
	res.json(blocksReversed.slice(startIndex, endIndex));
}); 

app.get('/api/public-notes/length', (req, res) => {
	res.json(pubNotes.length);
});

app.get('/api/public-notes/:id', (req, res) => {
	const { id } = req.params;
	const { length } = pubNotes;
	
	const RevPubNotes= pubNotes.slice().reverse();
	let startIndex = (id - 1) * 9;
	let endIndex = id * 9;
	//res.json(RevPubNotes)
	startIndex = startIndex < length ? startIndex: length;
	endIndex = endIndex < length ? endIndex: length;
	res.json(RevPubNotes.slice(startIndex, endIndex));
}); 

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, './client/dist/index.html'));
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, './client/dist/index.html'));
});

const syncWithRootState = () => {
    request({url: `${ROOT_NODE_ADDRESS}/api/blocks`}, (error, response, body) => {
        if(!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);
            blockchain.replaceChain(rootChain);
            console.log('replace chain on a sync with', rootChain)
        }
    });

    request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map`}, (error, response, body) => {
        if(!error && response.statusCode === 200) {
            const rootTransactionPoolMap = JSON.parse(body);

            console.log('replace transaction pool map on a sync with', rootTransactionPoolMap);
            transactionPool.setMap(rootTransactionPoolMap);
        }
    });
		
		request({ url: `${ROOT_NODE_ADDRESS}/api/note-pool`}, (error, response, body) => {
			if(!error && response.statusCode === 200) {
				let rootNotePool = Object.values(JSON.parse(body));
				console.log('replace note-pool on a sync with', rootNotePool);
				notePool.setPool(rootNotePool);
			}
		});
};

if(isDevelopment) {
	const walletFoo = new Wallet();
	const walletBar = new Wallet();

	const generateWalletTransaction = ({ wallet, recipient, amount }) => {
	const transaction = wallet.createTransaction({
		recipient, amount, chain: blockchain.chain
	});

	transactionPool.setTransaction(transaction);
	};

	const walletAction = () => generateWalletTransaction({
	wallet, recipient: walletFoo.publicKey, amount: 5
	});

	const walletFooAction = () => generateWalletTransaction ({
	wallet: walletFoo, recipient: walletBar.publicKey, amount: 10
	});

	const walletBarAction = () => generateWalletTransaction({
	wallet: walletFoo, recipient: wallet.publivKey, amount: 15
	});

	for (let i=0; i<10; i++) {
	if(i % 3 === 0) {
		walletAction();
		walletFooAction();
	} else if (i%3===1) {
		walletAction();
		walletBarAction();
	} else {
		walletFooAction();
		walletBarAction();
	}

	transactionMiner.mineTransaction();
	}
}

let PEER_PORT;

if(process.env.GENERATE_PEER_PORT == 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 60000);
}

const PORT = process.env.PORT|| PEER_PORT || DEFAULT_PORT; 
app.listen(PORT, () => {
    console.log(`listening at localhost:${PORT}`);

    if(PORT !== DEFAULT_PORT) {
        syncWithRootState();

    }
});

