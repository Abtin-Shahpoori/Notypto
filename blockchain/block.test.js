const hexToBinary = require("hex-to-binary")
const Block = require("./block");
const { GENESIS_DATA, MINE_RATE } = require("../config");
const { cryptoHash } = require("../util/");

describe('Block', () => {
    const lasthash = 'FOGO'
    const hash = 'fads*'
    const timestamp = 2000;
    const Data = "MEOW!!!"
    const nonce = 1;
    const difficulty = 1;

    block = new Block({ Data, lasthash, hash, timestamp, nonce, difficulty })
    it('contains data, lastblock, hash, timestamp', () => {
        expect(block.timestamp).toEqual(timestamp)
        expect(block.hash).toEqual(hash)
        expect(block.lasthash).toEqual(lasthash)
        expect(block.Data).toEqual(Data)
        expect(block.nonce).toEqual(nonce)
        expect(block.difficulty).toEqual(difficulty)
    });

    describe('genesis()', () => {
        const genesis = Block.genesis();
                
        it('It is instance of the Block', () => {
            expect(genesis instanceof Block).toBe(true)
        });

        it('It Contains genesis data', () => {
            expect(genesis).toEqual(GENESIS_DATA)
        });

    })

    describe('mineblock()', () => {
        const lastblock = Block.genesis();
        const Data = 'mined Data';
        const minedblock = Block.mineblock({ lastblock, Data })

        it('mineblock is an instance of  Block', () => {
            expect(minedblock instanceof Block).toBe(true);
        });

        it('last hash is equal to last blocks hash', () => {
            expect(minedblock.lasthash).toEqual(lastblock.hash);
        });

        it('sets the data', () => {
            expect(minedblock.Data).toEqual(Data)
        });

        it('sets the timestamp', () => {
            expect(minedblock.timestamp).not.toEqual(undefined)
        });

        it('has an SHA256 hash', () => {
            expect(minedblock.hash)
                .toEqual(
                    cryptoHash(
                        minedblock.timestamp,
                        lastblock.hash,
                        minedblock.Data,
                        minedblock.nonce,
                        minedblock.difficulty,
                    )
                );
        });

        it('sets a `hash` that matches the difficulty', () => {
            expect(hexToBinary(minedblock.hash).substring(0, minedblock.difficulty))
                .toEqual('0'.repeat(minedblock.difficulty));
        });

        it('adjusts the difficulty', () => {
            const possibleResults = [lastblock.difficulty + 1, lastblock.difficulty - 1];
            expect(possibleResults.includes(minedblock.difficulty)).toBe(true);
        });
    });


    describe('adjustDifficulty()', () => {
        it('rasie the difficulty for a quick mined block', () => {
            expect(Block.adjustDifficulty({ originalBlock: block, timestamp: block.timestamp + MINE_RATE - 70})).toEqual(block.difficulty+1)
        });

        it('lowers the difficulty for a slower mined block', () => {
            expect(Block.adjustDifficulty({ originalBlock: block, timestamp: block.timestamp + MINE_RATE + 70})).toEqual(block.difficulty-1)
        });

        it('has a lower limit of 1', () => {
            block.difficulty = -1;
            expect(Block.adjustDifficulty({originalBlock: block})).toEqual(1);
        });
    });
});