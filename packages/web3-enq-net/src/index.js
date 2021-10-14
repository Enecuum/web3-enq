const Net = function Net(web) {
    let _this = this;

    Object.defineProperty(this, 'provider', {
        get: function () {
            return web.Enq.provider
        },
        set: function (val) {
            web.Enq.provider = val
            return web.Enq.provider;
        },
        enumerable: true,
        configurable: true,
    })
    Object.defineProperty(this, 'currentProvider', {
        get: function () {
            return web.Enq.currentProvider
        }
    })


    this.get = {
        getMyBalance: async function (token) {
            let api = `balance?id=${web.Enq.User.pubkey}&token=${token}`
            return new Promise((resolve, reject) => {
                web.Enq.sendAPI(api)
                    .then(answer => {
                        resolve(answer)
                    })
                    .catch(() => {
                        reject(false)
                    })
            })
        },
        getBalance: async function (acc, token) {
            let api = `balance?id=${acc}&token=${token}`
            return new Promise((resolve, reject) => {
                web.Enq.sendAPI(api)
                    .then(answer => {
                        resolve(answer)
                    })
                    .catch(() => {
                        reject(false)
                    })
            })
        },
        getBalanceAll: async function (acc) {
            let api = `balance_all?id=${acc}`
            return new Promise((resolve, reject) => {
                web.Enq.sendAPI(api)
                    .then(answer => {
                        resolve(answer)
                    })
                    .catch(() => {
                        reject(false)
                    })
            })
        },
        token_info: async function (hash) {
            let api = `token_info?hash=${hash}`
            return new Promise((resolve, reject) => {
                web.Enq.sendAPI(api)
                    .then(answer => {
                        resolve(answer)
                    })
                    .catch(() => {
                        reject(false)
                    })
            })
        },
        height: async function () {
            return new Promise((resolve, reject) => {
                web.Enq.sendAPI('height')
                    .then(answer => {
                        resolve(answer)
                    })
                    .catch(() => {
                        reject(false)
                    })
            })
        },
        macroblock: async function (hash) {
            let api = `macroblock?hash=${hash}`
            return new Promise((resolve, reject) => {
                web.Enq.sendAPI(api)
                    .then(answer => {
                        resolve(answer)
                    })
                    .catch(() => {
                        reject(false)
                    })
            })
        },
        macroblockByHeight: async function (height) {
            let api = `macroblock_by_height?height=${height}`
            return new Promise((resolve, reject) => {
                web.Enq.sendAPI(api)
                    .then(answer => {
                        resolve(answer)
                    })
                    .catch(() => {
                        reject(false)
                    })
            })
        },
        tx: async function (hash) {
            let api = `tx?hash=${hash}`
            return new Promise((resolve, reject) => {
                web.Enq.sendAPI(api)
                    .then(answer => {
                        resolve(answer)
                    })
                    .catch(() => {
                        reject(false)
                    })
            })
        },
        getOwner: async function (hash) {
            let api = `token_info?hash=${hash}`
            return new Promise((resolve, reject) => {
                web.Enq.sendAPI(api)
                    .then(answer => {
                        resolve(answer[0].owner)
                    })
                    .catch(() => {
                        reject(false)
                    })
            })
        },
        accountTransactions: async function (id, page = 0) {
            let api = `account_transactions?id=${id}&page=${page}`
            return new Promise((resolve, reject) => {
                web.Enq.sendAPI(api)
                    .then(answer => {
                        resolve(answer)
                    })
                    .catch(() => {
                        reject(false)
                    })
            })
        },
        get_tickers_all: async function () {
            let api = `get_tickers_all`
            return new Promise((resolve, reject) => {
                web.Enq.sendAPI(api)
                    .then(answer => {
                        resolve(answer)
                    })
                    .catch(() => {
                        reject(false)
                    })
            })
        }
    }
    this.post = {
        tx: async function (obj) {
            // from, to, tokenHash, amount, data, nonce
            let fee = await _this.get.token_info(obj.tokenHash)
            let tx = {
                to: obj.to,
                from: obj.from.pubkey,
                ticker: obj.tokenHash || web.Enq.token[web.Enq.provider],
                amount: obj.amount + fee[0].fee_value,
                nonce: obj.nonce || Math.floor(Math.random() * 1e10)
            };
            if (obj.data) {
                tx.data = obj.data
            } else {
                tx.data = '';
            }
            tx.hash = await web.Utils.Sign.hash_tx_fields(tx)
            tx.sign = await web.Utils.Sign.ecdsa_sign(obj.from.prvkey, tx.hash);
            // return await web3-enq.Enq.sendTx(tx)
            return new Promise((resolve, reject) => {
                web.Enq.sendTx(tx)
                    .then(answer => {
                        resolve(answer)
                    })
                    .catch(() => {
                        reject(false)
                    })
            })
        },
        tx_fee_off: async function (obj) {
            // from, to, tokenHash, amount, data, nonce
            let tx = {
                to: obj.to,
                from: obj.from.pubkey,
                ticker: obj.tokenHash || web.Enq.token[web.Enq.provider],
                amount: obj.amount,
                nonce: obj.nonce || Math.floor(Math.random() * 1e10)
            };
            if (obj.data) {
                tx.data = obj.data
            } else {
                tx.data = '';
            }
            tx.hash = await web.Utils.Sign.hash_tx_fields(tx)
            tx.sign = await web.Utils.Sign.ecdsa_sign(obj.from.prvkey, tx.hash);
            // return await web3-enq.Enq.sendTx(tx)
            return new Promise((resolve, reject) => {
                web.Enq.sendTx(tx)
                    .then(answer => {
                        resolve(answer)
                    })
                    .catch(() => {
                        reject(false)
                    })
            })
        }
    }
    this.pos = {
        get_pos_total_stake: async function () {
            return await web.Enq.sendAPI('get_pos_total_stake')
        },
        get_pos_list_count: async function () {
            return await web.Enq.sendAPI('get_pos_list_count')
        },
        get_pos_list: async function (owner) {
            var api = `get_pos_list?owner=${owner}`
            return await web.Enq.sendAPI(api);
        },
        get_pos_list_all: async function () {
            return await web.Enq.sendAPI('get_pos_list_all')
        },
        get_delegators_list: async function (pos_id) {
            var api = `get_delegators_list?pos_id=${pos_id}`
            return await web.Enq.sendAPI(api)
        },
        get_transfer_lock: async function () {
            return await web.Enq.sendAPI('get_transfer_lock')
        }
    }
}

module.exports = Net
