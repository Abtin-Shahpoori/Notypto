const hexToBinary = require('hex-to-binary');
const { GENESIS_DATA, MINE_RATE } = require('../config')
const { cryptoHash } = require('../util')

class Block {
    constructor({ hash, lasthash, Data, timestamp, nonce, difficulty }) {
        this.hash = hash
        this.lasthash = lasthash
        this.Data = Data
        this.timestamp = timestamp
        this.nonce = nonce
        this.difficulty = difficulty
    }

    static genesis() {
        return new this(GENESIS_DATA)
    }

    static mineblock({ lastblock, Data }) {  
        let hash, timestamp;
        hash = "";
        const lasthash = lastblock.hash;
        let { difficulty } = lastblock;
        let nonce = 0;

        do {
            nonce += 1;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({ originalBlock: lastblock, timestamp});
            hash = cryptoHash(nonce, difficulty, lasthash, Data, timestamp);
        } while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));
        
        return new this({
            timestamp,
            lasthash,
            Data,
            difficulty,
            nonce,
            hash,
        });
    }

    static adjustDifficulty({ originalBlock, timestamp }) {
        const { difficulty } = originalBlock;
        if(difficulty < 1 ) return 1;

        if((timestamp - originalBlock.timestamp) > MINE_RATE) {
            return difficulty -1;
        }
        return difficulty + 1;
    }

}

module.exports = Block;
