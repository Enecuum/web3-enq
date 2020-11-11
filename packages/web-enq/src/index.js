const jq = require('jquery')
const bp = require('body-parser')
const request = require('request')

var Enq = function Enq(){
    var _this = this
    var provider = 'https://pulse.enecuum.com'


    Object.defineProperty(this,'provider',{
        get:function (){
            return provider
        },
        set: function (net){
          provider = net;
          return provider;
        },
        enumerable:true,
        configurable:true
    })
    Object.defineProperty(this,'hello',{
        get:function (){
            return 'hello'
        },
        set:function (val){
            return val;
        },
        enumerable:true,
        configurable:true
    })
    this.sendTx = function (tx){
        this.sendTx.use(bp.urlencoded({extended:false}))
        this.sendTx.use(bp.json())
        return new Promise(function(resolve, reject){
            request({url:`${provider}/api/v1/tx`, method:"POST", json:[tx]}, function(err, resp, body){
                if (err){
                    console.error(`Failed to send transaction`);
                    console.log(err)
                    reject();
                } else {
                    if (body.err != 0){
                        console.error(`Transaction rejected by remote node. error code ${body.err}`);
                        reject(body.message);
                    } else {
                        // console.log(`Transaction sent, hash = ${body.result[0].hash}`);
                        if(body.result[0].hash){
                            resolve({hash:body.result[0].hash});
                        }else{
                            resolve(body)
                        }
                    }
                }
            });
        });
    }
    this.sendAPI = function (api,fields){
        this.sendAPI.use(bp.urlencoded({extended:false}))
        this.sendAPI.use(bp.json())
        return new Promise((resolve,reject)=>{

            request({url:`${provider}/api/v1/${api}`,method:'GET',json:[fields]},(err,resp,body)=>{
                if(err){
                    console.log(`[ERROR] send get ${api}. ${err}`);
                    reject();
                }else{
                    if(body.err){
                        console.log(`[ERROR] node-trinity err. get '${api}' failed ${body}`)
                        reject();
                    }else{
                        resolve(body)
                    }
                }
            })
        })
    }
}

module.exports = Enq