const hexToBinary = require('hex-to-binary');
const { GENESIS_DATA, MINE_RATE } = require('../config')
const { cryptoHash } = require('../util')

class Block {
    constructor({ hash, lasthash, Data, timestamp, nonce, difficulty, height, mining_reward, Assets }) {
        this.hash = hash;
        this.lasthash = lasthash;
        this.Data = Data;
        this.height = height;
        this.Assets = Assets;
        this.timestamp = timestamp;
        this.nonce = nonce;
        this.difficulty = difficulty;
        this.mining_reward = mining_reward;
    }

    static genesis() {
        return new this(GENESIS_DATA)
    }

    static adjustHalvings({ lastblock }) {
        // the maximum supply planned is 34,454,592
        let Pmining_reward = lastblock.mining_reward;
        if(this.height % 1899072 === 0) {
            Pmining_reward = 0;
        }

        if (this.height % 271296 === 0) {
            Pmining_reward = Pmining_reward/2;
        }
        return Pmining_reward;
    }

    static mineblock({ lastblock, Data, Assets }) {  
        let hash, timestamp;
        hash = "";
        const lasthash = lastblock.hash;
        const height = lastblock.height + 1;
        let mining_reward = this.adjustHalvings({ lastblock });
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
            height,
            Assets,
            difficulty,
            nonce,
            hash,
            mining_reward,
        });
    }

    static adjustDifficulty({ originalBlock, timestamp }) {
        const { difficulty } = originalBlock;
        if(difficulty < 10 ) return 10;

        if((timestamp - originalBlock.timestamp) > MINE_RATE) {
            return difficulty -1;
        }
        return difficulty + 1;
    }

}

module.exports = Block;
