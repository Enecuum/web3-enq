
var Eth = function Eth(web){
    Object.defineProperty(this, 'test',{
        get:function(address){
            console.log('address : ',)
            return true;
        },
        set:function(){
            return true;
        },
        enumerable:true,
        configurable:true
    })
    this.balanceOf = function(address, token, cb){
        let event = new CustomEvent('ENQContent',{
            detail:{
                type:'balanceOf',
                data:{
                    address:address,
                    token:token,
                },
                cb:cb
            }
        })
        document.dispatchEvent(event)
    }
    this.enable = function (cb){
        if(global.ENQExt){
            let event = new CustomEvent('ENQContent',{
                detail:{
                    type:'enable',
                    cb:cb
                }
            })
            document.dispatchEvent(event)
        }else{
            console.error('Not enable!')
        }
    }
    this.transaction = function (address, amount, token, cb){
        if(global.ENQExt){
            let event = new CustomEvent('ENQContent',{
                detail:{
                    type:'tx',
                    data:{
                        address:address,
                        amount:amount,
                        token:token
                    },
                    cb:cb
                }
            })
            document.dispatchEvent(event)
        }else{
            console.error('Not enable!')
        }
    }
}

module.exports = Eth;