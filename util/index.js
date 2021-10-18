const EC = require('elliptic').ec;
const cryptoHash = require('./crypto-hash');

const ec = new EC('secp256k1');

const verifySignature = ({ publicKey, data, signature }) => {
    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex');

    return keyFromPublic.verify(cryptoHash(data), signature);
};

const checkExistingToken = ({ tokenHash, chain }) => {
    let existingToken = false;
    for(let i=chain.length - 1; i > 0; i--) {
        const block = chain[i];
        for(let i of block.Assets) {
           if(block.Assets[i].tokenHash === tokenHash) {
               existingToken = true;
           }
        }
    }

    if(existingToken) {
        return true;
    } else {
        return false;
    }
}

module.exports = { ec, verifySignature, cryptoHash, checkExistingToken };
