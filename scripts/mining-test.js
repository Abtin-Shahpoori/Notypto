const Blockchain = require('../blockchain')
const blockchain = new Blockchain();

blockchain.addBlock({ Data: 'INIT' });

let prevTimestamp, nextTimestamp, nextBlock, timeDiff, average;
const times = [];

for(let i = 0; i < 10000; i ++) {
    prevTimestamp = blockchain.chain[blockchain.chain.length -1].timestamp;
    blockchain.addBlock({ Data: `block ${i}`});
    nextBlock = blockchain.chain[blockchain.chain.length - 1];
    nextTimestamp = nextBlock.timestamp;
    timeDiff = nextTimestamp - prevTimestamp;
    times.push(timeDiff);
    average = times.reduce((total, num) => (total + num))/times.length;
    console.log(`time to mine block: ${timeDiff}ms. Difficulty: ${nextBlock.difficulty}. Average time: ${average}ms.`)
}