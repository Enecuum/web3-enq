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

    this.get = {
        getMyBalance: function (token){
            var api = `balance?id=${enq.User.pubkey}&token=${token}`
            console.log(api);
        },
        getBalance: function (acc, token){
            var api = `balance?id=${acc}&token=${token}`
            console.log(api);
        },
        token_info: function (hash){
            var api = `token_info?hash=${hash}`
            enq.sendAPI(api).then(data=>{
                console.log(data[0].owner);
            })
        },
        height:function (){},
        macroblock:function (hash){},
        macroblockByHieht:function (height){},
        tx:function(hash){}
    }
    this.post = {
        tx: function (to, ticker, amount){
        },
        delegate:function (pos_id,amount){},
        undelegate: function (pos_id,amount){},
        create_pos: function (fee,name){},
        pos_reward: function (){},
        create_token: function (){},
        burn: function (){},
        mint: function (){},
        transfer: function (){
            console.log('hello')
        }
    }
    this.pos = {
        get_pos_total_stake:function (){},
        get_pos_list_count:function (){},
        get_pos_list:function (owner){},
        get_pos_list_all:function (){},
        get_delegators_list:function (pos_id){},
        get_transfer_lock:function (){}
    }
}

module.exports = Net