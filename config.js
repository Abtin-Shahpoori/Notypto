const INITIAL_DIFICULTY = 2;
const MINE_RATE = 1000;

const GENESIS_DATA = {
    hash: "d800cd74fe9fafbdf952443aab54eaa2613bedcb5ff6aadac39461ccb461cf98",
    lasthash: "ff7d5f51b1eb9b4abe78453bf6e6680121431af91e724aa3d8345308546e3e41",
    Data: {Transactions: {id: 'there are no transactions for now'}, Notes: []},
    timestamp: 1621949514244,
    nonce: 0,
    difficulty: INITIAL_DIFICULTY,
};

const STARTING_BALANCE = 200;
const REWARD_INPUT = { address: '*authorized-reward*' };
const MINING_REWARD = 50;

module.exports = { GENESIS_DATA, MINE_RATE, STARTING_BALANCE, REWARD_INPUT, MINING_REWARD}
