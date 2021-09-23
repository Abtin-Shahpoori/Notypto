const Wallet = require('./index.js');
const uuid = require('uuid/v1');
const Transaction = require('./transaction');
const {encrypt, decrypt } = require('../util/encrypt_decrypt.js');

class Note {
	constructor() {
		this.id = uuid();
	}	

	createPublicOutputMap({ message, timestamp, senderWallet }){
			const outputMap = {};
			outputMap["timestamp"] = Date.now();
			outputMap["publicKey"] = senderWallet.publicKey;
			outputMap["message"] = message.message;
			outputMap["isPublic"] = true;
			return outputMap;	
	}
	
	createPrivateOutputMap({ message, timestamp, senderWallet }){	
			const outputMap = {};
			outputMap["timestamp"] = Date.now();
			const privateKey = senderWallet.privateKey.substr(0, 32);
			outputMap["PublicKey"] = senderWallet.publicKey;
			outputMap["message"] = encrypt(message.message, privateKey);
			outputMap["isPublic"] = false;
			return outputMap;
	}
}

module.exports = Note;
