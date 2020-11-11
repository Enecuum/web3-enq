const Enq = require('../../web-enq')
const Utils = require('../../web-enq-utils')

var Net = function Net(){

    enq = new Enq(this);
    utils = new Utils(this);

    var _this = this;

    Object.defineProperty(this,'provider',{
        get:function (){
            return enq.provider
        },
        set:function (val){
            enq.provider = val
            return enq.provider;
        },
        enumerable:true,
        configurable:true
    })
    Object.defineProperty(this, 'token',{
        get: function (){
            return enq.token;
        },
        set: function (val){
            enq.token = val;
            return enq.token;
        },
        enumerable:true,
        configurable:true
    })
    Object.defineProperty(this, 'owner',{
        get: function (){
            return enq.owner;
        },
        set: function (val){
            enq.owner = val;
            return enq.owner;
        },
        enumerable:true,
        configurable:true
    })
    Object.defineProperty(this, 'User', {
        get:function (){
            return enq.user;
        },
        set:function (obj){
            enq.user.pubkey = obj.pubkey;
            enq.user.prvkey = obj.prvkey;
        },
        enumerable:true,
        configurable:true
    })


    this.get = {
        getMyBalance:  async function (token){
            var api = `balance?id=${enq.User.pubkey}&token=${token}`
            enq.sendAPI(api).then(data=>{
                return data
            })
        },
        getBalance:  async function (acc, token){
            var api = `balance?id=${acc}&token=${token}`
            enq.sendAPI(api).then(data=>{
                return data
            })
        },
        token_info:  async function (hash){
            var api = `token_info?hash=${hash}`
            return await enq.sendAPI(api)
        },
        height: async function (){
            return await enq.sendAPI('height')
        },
        macroblock: async function (hash){
            var api = `macroblock?hash=${hash}`
            return await enq.sendAPI(api);
        },
        macroblockByHeight: async function (height){},
        tx: async function(hash){
            var api = `macroblock_by_height?hash=${hash}`
            return await enq.sendAPI(api);
        }
    }
    this.post = {
        tx:  async function (to, ticker, amount,data){
            var tx = {
                to:to,
                from:enq.User.pubkey,
                ticker:ticker,
                amount:amount,
                nonce:Math.floor(Math.random() * 1e10)
            };
            if(data){
                tx.data = await utils.dfo(data)
            }else{
                tx.data = '';
            }
            tx.hash = utils.Utils.hash_tx_fields(tx)
            tx.sign = utils.Utils.ecdsa_sign(enq.User.prvkey,tx.hash);
            return await enq.sendTx(tx)
        },
        delegate: async function (pos_id,amount){
            var tx_data = {
                type:'delegate',
                parameters:{
                    pos_id:pos_id,
                    amount: BigInt(amount)
                }
            }
            var fee = await _this.get.token_info(enq.token);
            return await _this.post.tx(enq.owner,enq.ticker,fee[0].value,tx_data);
        },
        undelegate:  async function (pos_id,amount){
            var tx_data = {
                type:'undelegate',
                parameters:{
                    pos_id:pos_id,
                    amount: BigInt(amount)
                }
            }
            var fee = await _this.get.token_info(enq.token);
            return await _this.post.tx(enq.owner,enq.ticker,fee[0].value,tx_data);
        },
        create_pos:  async function (fee,name){},
        pos_reward:  async function (){},
        create_token:  async function (){},
        burn:  async function (){},
        mint:  async function (){},
        transfer:  async function (){
            console.log('hello')
        }
    }
    this.pos = {
        get_pos_total_stake: async function (){
            return await enq.sendAPI('get_pos_total_stake')
        },
        get_pos_list_count: async function (){
            return await enq.sendAPI('get_pos_list_count')
        },
        get_pos_list: async function (owner){
            var api = `get_pos_list?owner=${owner}`
            return await enq.sendAPI(api);
        },
        get_pos_list_all: async function (){
            return await enq.sendAPI('get_pos_list_all')
        },
        get_delegators_list: async function (pos_id){
            var api = `get_delegators_list?pos_id=${pos_id}`
            return await enq.sendAPI(api)
        },
        get_transfer_lock: async function (){
            return await enq.sendAPI('get_transfer_lock')
        }
    }
}

module.exports = Net