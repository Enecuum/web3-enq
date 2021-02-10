
var Net = function Net(web){

    var _this = this;
    Object.defineProperty(this,'provider',{
        get:function (){
            return web.Enq.provider
        },
        set:function (val){
            web.Enq.provider = val
            return web.Enq.provider;
        },
        enumerable:true,
        configurable:true,
    })
    Object.defineProperty(this, 'token',{
        get: function (){
            return web.Enq.token;
        },
        set: function (val){
            web.Enq.token = val;
            return web.Enq.token;
        },
        enumerable:true,
        configurable:true,
    })
    Object.defineProperty(this, 'ticker',{
        get: function (){
            return web.Enq.ticker;
        },
        set: function (val){
            web.Enq.ticker = val;
            return web.Enq.ticker;
        },
        enumerable:true,
        configurable:true,
    })
    Object.defineProperty(this, 'owner',{
        get: function (){
            return web.Enq.owner;
        },
        set: function (val){
            web.Enq.owner = val;
            return web.Enq.owner;
        },
        enumerable:true,
        configurable:true,
    })
    Object.defineProperty(this, 'User', {
        get:function (){
            return web.Enq.User;
        },
        set:function (obj){
            web.Enq.User.pubkey = obj.pubkey;
            web.Enq.User.prvkey = obj.prvkey;
            return web.Enq.User;
        },
        enumerable:true,
        configurable:true
    })
    Object.defineProperty(this,'userPub',{
        get:function (){
            return web.Enq.User.pubkey
        },
        set:function (value){
            web.Enq.User.pubkey =value
            return web.Enq.User;
        }
    })
    Object.defineProperty(this,'userPvt',{
        get:function (){
            return web.Enq.User.prvkey
        },
        set:function (value){
            web.Enq.User.prvkey =value
            return web.Enq.User;
        }
    })



    this.get = {
        getMyBalance:  async function (token){
            var api = `balance?id=${web.Enq.User.pubkey}&token=${token}`
            return await web.Enq.sendAPI(api)
        },
        getBalance:  async function (acc, token){
            var api = `balance?id=${acc}&token=${token}`
            return await web.Enq.sendAPI(api)
        },
        token_info:  async function (hash){
            var api = `token_info?hash=${hash}`
            return await web.Enq.sendAPI(api)
        },
        height: async function (){
            return await web.Enq.sendAPI('height')
        },
        macroblock: async function (hash){
            var api = `macroblock?hash=${hash}`
            return await web.Enq.sendAPI(api);
        },
        macroblockByHeight: async function (height){
            var api = `macroblock_by_height?height=${height}`
            return await web.Enq.sendAPI(api);
        },
        tx: async function(hash){
            var api = `tx?hash=${hash}`
            return await web.Enq.sendAPI(api);
        }
    }
    this.post = {
        tx:  async function (from,to, ticker, amount,data, token){
            var fee = await _this.get.token_info(token)
            var tx = {
                to:to,
                from:from.pubkey,
                ticker:ticker,
                amount:amount + fee[0].fee_value,
                nonce:Math.floor(Math.random() * 1e10)
            };
            if(data){
                tx.data = await web.Utils.dfo(data)
            }else{
                tx.data = '';
            }
            tx.hash = await web.Utils.Sign.hash_tx_fields(tx)
            tx.sign = await web.Utils.Sign.ecdsa_sign(from.prvkey,tx.hash);
            return await web.Enq.sendTx(tx)
        },
        delegate: async function (from,pos_id,amount){
            var tx_data = {
                type:'delegate',
                parameters:{
                    pos_id:pos_id,
                    amount: BigInt(amount)
                }
            }
            return await _this.post.tx(from,web.Enq.owner,web.Enq.ticker,0,tx_data,web.Enq.token);
        },
        undelegate:  async function (from, pos_id,amount){
            var tx_data = {
                type:'undelegate',
                parameters:{
                    pos_id:pos_id,
                    amount: BigInt(amount)
                }
            }
            return await _this.post.tx(from, web.Enq.owner,web.Enq.ticker,0,tx_data,web.Enq.token);
        },
        create_pos:  async function (from, fee,name){
            var tx_data ={
                type:'create_pos',
                parameters:{
                    fee:BigInt(fee),
                    name:String(name)
                }
            }
            return await _this.post.tx(from, web.Enq.owner,web.Enq.ticker,0,tx_data,web.Enq.token);
        },
        pos_reward:  async function (from, pos_id){
            var tx_data = {
                type:'pos_reward',
                parameters:{
                    pos_id:pos_id,
                }
            }
            return await _this.post.tx(from, web.Enq.owner,web.Enq.ticker,0,tx_data,web.Enq.token);
        },
        create_token:  async function (from ,obj){
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
            return await _this.post.tx(from, web.Enq.owner,web.Enq.ticker,0,tx_data,web.Enq.token);
        },
        burn:  async function (from, token_hash,amount){
            var tx_data = {
                type:'burn',
                parameters:{
                    tocken_hash:token_hash,
                    amount: BigInt(amount)
                }
            }
            return await _this.post.tx(from, web.Enq.owner,web.Enq.ticker,0,tx_data,web.Enq.token);
        },
        mint:  async function (from, token_hash,amount){
            var tx_data = {
                type:'burn',
                parameters:{
                    tocken_hash:token_hash,
                    amount: BigInt(amount)
                }
            }
            return await _this.post.tx(from, web.Enq.owner,web.Enq.ticker,0,tx_data,web.Enq.token);
        },
        transfer:  async function (from, pos_id){
            var tx_data = {
                type:'transfer',
                parameters:{
                    undelegate_id:pos_id,
                }
            }
            return await _this.post.tx(from, web.Enq.owner,web.Enq.ticker,0,tx_data,web.Enq.token)
        }
    }
    this.pos = {
        get_pos_total_stake: async function (){
            return await web.Enq.sendAPI('get_pos_total_stake')
        },
        get_pos_list_count: async function (){
            return await web.Enq.sendAPI('get_pos_list_count')
        },
        get_pos_list: async function (owner){
            var api = `get_pos_list?owner=${owner}`
            return await web.Enq.sendAPI(api);
        },
        get_pos_list_all: async function (){
            return await web.Enq.sendAPI('get_pos_list_all')
        },
        get_delegators_list: async function (pos_id){
            var api = `get_delegators_list?pos_id=${pos_id}`
            return await web.Enq.sendAPI(api)
        },
        get_transfer_lock: async function (){
            return await web.Enq.sendAPI('get_transfer_lock')
        }
    }
}

module.exports = Net