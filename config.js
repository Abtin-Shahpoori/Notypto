const INITIAL_DIFICULTY = 20;
const MINE_RATE = 60000;

const STARTING_BALANCE = 200;
const REWARD_INPUT = { address: '*authorized-reward*' };
const MINING_REWARD = 50;

const GENESIS_DATA = {
    hash: "d800cd74fe9fafbdf952443aab54eaa2613bedcb5ff6aadac39461ccb461cf98",
    lasthash: "ff7d5f51b1eb9b4abe78453bf6e6680121431af91e724aa3d8345308546e3e41",
    Data: {Transactions: {id: 'there are no transactions for now'}, Notes: []},
    height: 1,
    timestamp: 1621949514244,
    nonce: 0,
    difficulty: INITIAL_DIFICULTY,
    mining_reward: 64,
};



module.exports = { GENESIS_DATA, MINE_RATE, STARTING_BALANCE, REWARD_INPUT, MINING_REWARD}
