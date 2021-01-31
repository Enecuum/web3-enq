
var Eth = function Eth(web){
    let time = 200
    let _promise = function (){
        return new Promise( (resolve)=>{
            let a = setInterval(()=>{
                if(web.Enq.ready){
                    clearInterval(a)
                    resolve()
                }
            }, time)
        })
    }
    let _waitAnswer = async function (){
        return new Promise(async (resolve, reject) => {
            ENQWeb.Enq.ready = false
            await _promise().then(el=>{
                resolve(web.Enq.cb)
            }).catch(err=>{
                console.log('ERROR: ', err)
                reject()
            })
        })
    }
    let lastResult = ''
    this.enable = async function (cb){
        if(ENQExt){
            let event = new CustomEvent('ENQContent',{
                detail:{
                    type:'enable',
                    cb:cb
                }
            })
            document.dispatchEvent(event)
            await _waitAnswer()
                .then(result=>{
                    lastResult = result
                })
                .catch(err=>{
                    console.log(err)
                    lastResult = null
                })
            return lastResult
        }else{
            console.error('Not enable!')
            return null
        }
    }
    this.balanceOf = async function(address, token, cb){
        if(ENQExt){
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
            await _waitAnswer()
                .then(result=>{
                    lastResult = result
                })
                .catch(err=>{
                    console.log(err)
                    lastResult = null
                })
            return lastResult
        }else{
            console.error('Not enable!')
            return null
        }

    }

    this.sendTransaction = async function (address, amount, token, cb){
        if(ENQExt){
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
            await _waitAnswer()
                .then(result=>{
                    lastResult = result
                })
                .catch(err=>{
                    console.log(err)
                    lastResult = null
                })
            return lastResult
        }else{
            console.error('Not enable!')
            return null
        }
    }
}

module.exports = Eth;