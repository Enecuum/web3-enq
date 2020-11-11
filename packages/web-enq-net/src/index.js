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
        configurable:true,
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
        configurable:true,
    })
    Object.defineProperty(this, 'ticker',{
        get: function (){
            return enq.ticker;
        },
        set: function (val){
            enq.ticker = val;
            return enq.ticker;
        },
        enumerable:true,
        configurable:true,
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
        configurable:true,
    })
    Object.defineProperty(this, 'User', {
        get:function (){
            return enq.User;
        },
        set:function (obj){
            enq.User.pubkey = obj.pubkey;
            enq.User.prvkey = obj.prvkey;
            return enq.User;
        },
        enumerable:true,
        configurable:true
    })
    Object.defineProperty(this,'userPub',{
        get:function (){
            return enq.User.pubkey
        },
        set:function (value){
            enq.User.pubkey =value
            return enq.User;
        }
    })
    Object.defineProperty(this,'userPvt',{
        get:function (){
            return enq.User.prvkey
        },
        set:function (value){
            enq.User.prvkey =value
            return enq.User;
        }
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
        macroblockByHeight: async function (height){
            var api = `macroblock_by_height?height=${height}`
            return await enq.sendAPI(api);
        },
        tx: async function(hash){
            var api = `tx?hash=${hash}`
            return await enq.sendAPI(api);
        }
    }
    this.post = {
        tx:  async function (to, ticker, amount,data, token){
            var fee = await _this.get.token_info(token)
            var tx = {
                to:to,
                from:enq.User.pubkey,
                ticker:ticker,
                amount:amount + fee[0].fee_value,
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
            return await _this.post.tx(enq.owner,enq.ticker,0,tx_data,enq.token);
        },
        undelegate:  async function (pos_id,amount){
            var tx_data = {
                type:'undelegate',
                parameters:{
                    pos_id:pos_id,
                    amount: BigInt(amount)
                }
            }
            return await _this.post.tx(enq.owner,enq.ticker,0,tx_data,enq.token);
        },
        create_pos:  async function (fee,name){
            var tx_data ={
                type:'create_pos',
                parameters:{
                    fee:BigInt(fee),
                    name:String(name)
                }
            }
            return await _this.post.tx(enq.owner,enq.ticker,0,tx_data,enq.token);
        },
        pos_reward:  async function (pos_id){
            var tx_data = {
                type:'pos_reward',
                parameters:{
                    pos_id:pos_id,
                }
            }
            return await _this.post.tx(enq.owner,enq.ticker,0,tx_data,enq.token);
        },
        create_token:  async function (obj){
            var tx_data = {
                type:'create_token',
                parameters:{
                    fee_type : BigInt(obj.fee_type),
                    fee_value : BigInt(obj.fee_value),
                    fee_min : BigInt(obj.fee_min),
                    decimals : BigInt(obj.decimals),
                    total_supply : BigInt(obj.total_supply),
                    ticker : String(obj.ticker),
                    name : String(obj.name),
                    max_supply : BigInt(obj.max_supply),
                    block_reward : BigInt(obj.block_reward),
                    min_stake : BigInt(obj.min_stake),
                    referrer_stake : BigInt(obj.referrer_stake),
                    ref_share : BigInt(obj.ref_share),
                    reissuable : Number(obj.reissuable),
                    minable : Number(obj.minable)
                }
            }
            return await _this.post.tx(enq.owner,enq.ticker,0,tx_data,enq.token);
        },
        burn:  async function (token_hash,amount){
            var tx_data = {
                type:'burn',
                parameters:{
                    tocken_hash:token_hash,
                    amount: BigInt(amount)
                }
            }
            return await _this.post.tx(enq.owner,enq.ticker,0,tx_data,enq.token);
        },
        mint:  async function (token_hash,amount){
            var tx_data = {
                type:'burn',
                parameters:{
                    tocken_hash:token_hash,
                    amount: BigInt(amount)
                }
            }
            return await _this.post.tx(enq.owner,enq.ticker,0,tx_data,enq.token);
        },
        transfer:  async function (pos_id){
            var tx_data = {
                type:'transfer',
                parameters:{
                    undelegate_id:pos_id,
                }
            }
            return await _this.post.tx(enq.owner,enq.ticker,0,tx_data,enq.token)
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