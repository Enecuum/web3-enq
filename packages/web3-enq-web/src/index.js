const Errors = require('./errorCases')


const Web = function Web(web) {
    this.errs = Errors;
    let time = 200
    let _promise = function (id) {
        return new Promise((resolve) => {
            let a = setInterval(() => {
                if (web.Enq.ready[id]) {
                    clearInterval(a)
                    resolve()
                }
            }, time)
        })
    }
    let _waitAnswer = async function (id) {
        return new Promise(async (resolve, reject) => {
            web.Enq.ready[id] = false
            await _promise(id).then(el => {
                if (web.Enq.cb[id].reject) {
                    web.Enq.ready[id] = true
                    reject()
                }
                delete web.Enq.ready[id]
                resolve(web.Enq.cb[id])
            }).catch(err => {
                console.log('ERROR: ', err)
                delete web.Enq.ready[id]
                reject({reject: true, err: err})
            })
        })
    }

    let waitingFunc =  function(taskId, event){
        return new Promise(async (resolve, reject) => {
            if (typeof web.Enq.ready === typeof (Boolean) && web.Enq.ready === false) {
                await _waitAnswer(taskId)
                    .then(result => {
                        resolve(result)
                    })
                    .catch(err => {
                        console.log(err)
                        reject(null)
                    })
            } else {
                document.dispatchEvent(event)
                await _waitAnswer(taskId)
                    .then(result => {
                        resolve(result)
                    })
                    .catch(err => {
                        console.log(err)
                        reject(null)
                    })
            }
        })
    }

    function getProvider(fullUrl = false) {
        return new Promise((async (resolve, reject) => {
            let taskId = window.origin + '/getProvider'
            let event = new CustomEvent('ENQContent', {
                detail: {
                    type: 'getProvider',
                    cb: {url: window.origin, taskId: taskId, fullUrl: fullUrl}
                }
            })
            if (typeof web.Enq.ready === typeof (Boolean) && web.Enq.ready === false) {
                await _waitAnswer(taskId)
                    .then(result => {
                        resolve(result)
                    })
                    .catch(err => {
                        console.log(err)
                        reject(null)
                    })
            } else {
                document.dispatchEvent(event)
                await _waitAnswer(taskId)
                    .then(result => {
                        resolve(result)
                    })
                    .catch(err => {
                        console.log(err)
                        reject(null)
                    })
            }
        }))
    }

    function getVersion() {
        return new Promise((async (resolve, reject) => {
            let taskId = window.origin + '/getVersion'
            let event = new CustomEvent('ENQContent', {
                detail: {
                    type: 'getVersion',
                    cb: {url: window.origin, taskId: taskId}
                }
            })
            if (typeof web.Enq.ready === typeof (Boolean) && web.Enq.ready === false) {
                await _waitAnswer(taskId)
                    .then(result => {
                        resolve(result)
                    })
                    .catch(err => {
                        console.log(err)
                        reject(null)
                    })
            } else {
                document.dispatchEvent(event)
                await _waitAnswer(taskId)
                    .then(result => {
                        resolve(result)
                    })
                    .catch(err => {
                        console.log(err)
                        reject(null)
                    })
            }
        }))
    }

    this.net = {
        getProvider
    }

    this.connect = async function () {
        let taskId = window.origin + '/connect'
        let event = new CustomEvent('ENQConnect', {
            detail: {
                type: 'connect',
                data: {
                    url: window.origin,
                },
                cb: {taskId: taskId}
            }
        })
        document.dispatchEvent(event)
    }

    this.enable = async function (cb) {
        return new Promise(async (resolve, reject) => {
            let taskId = window.origin + '/enable'
            let event = new CustomEvent('ENQContent', {
                detail: {
                    type: 'enable',
                    data: {date: Date.now(), version: web.version},
                    cb: {cb: cb, url: window.origin, taskId: taskId}
                }
            })
            await waitingFunc(taskId, event)
                .then(result=>{
                    resolve(result);
                })
                .catch(err=>{
                    reject(err);
                })
        })

    }
    this.balanceOf = async function (obj, cb) {
        //address, token, cb
        return new Promise(async (resolve, reject) => {
            let taskId = window.origin + '/balanceOf'
            if (obj.tokenHash !== undefined) {
                taskId += '/' + obj.tokenHash;
            }
            let event = new CustomEvent('ENQContent', {
                detail: {
                    type: 'balanceOf',
                    data: {
                        to: obj.to,
                        tokenHash: obj.tokenHash,
                        date: Date.now()
                    },
                    cb: {cb: cb, url: window.origin, taskId: taskId}
                }
            })
            await waitingFunc(taskId, event)
                .then(result=>{
                    resolve(result);
                })
                .catch(err=>{
                    reject(err);
                })
        })


    }

    this.serialize = function (data) {
        return ENQWeb.Utils.dfo(data);
    }

    this.fee_counter = async function (tokenHash, amount) {
        let tokenInfo = await web.Net.get.token_info(tokenHash);
        if (tokenInfo.length === 0) {
            return false
        } else {
            if (tokenInfo[0].fee_type === 0) {
                return tokenInfo[0].fee_value
            }
            if (tokenInfo[0].fee_type === 1) {
                let checkAmount = (BigInt(amount) * BigInt(tokenInfo[0].fee_value)) / BigInt(1e4)
                let fee_min = BigInt(tokenInfo[0].fee_min)
                if (checkAmount > tokenInfo[0].fee_min) {
                    return checkAmount
                } else {
                    return tokenInfo[0].fee_min
                }
            }
            return false
        }
    }

    this.sendTransaction = async function (obj, cb) {
        //from, to, value, tokenHash, cb
        return new Promise(async (resolve, reject) => {
            let taskId = '';
            let fee = '';
            let test;
            if (!obj.nonce) {
                obj.nonce = Math.floor(Math.random() * 1e10);
            }
            if (obj.fee_use !== undefined && obj.fee_use) {
                if (typeof obj.value == 'number' || typeof obj.value == 'string') {
                    obj.value = BigInt(obj.value);
                }
                fee = await this.fee_counter(obj.tokenHash, obj.value);
                if(!fee){
                    console.warn('fee_counter error...');
                }else{
                    obj.value += BigInt(fee);
                    fee = fee.toString();
                }
            }
            if (typeof obj.value === 'number' || typeof obj.value === 'bigint') {
                obj.value = obj.value.toString();
            }
            let tx = {
                from: obj.from,
                to: obj.to,
                amount: obj.value,
                ticker: obj.tokenHash,
                nonce: obj.nonce,
                data: obj.data || '',
            }
            if (obj.log !== undefined) {
                console.log(tx);
            }
            test = await this.errs.inspectTx(tx)
            .then(()=>{
                return false;
            })
            .catch(err=>{
                return(err);
            })
            if(!test){
                let txHash = await this.hash_tx_fields(tx)
                taskId = window.origin + `/tx/${txHash}`
                let event = new CustomEvent('ENQContent', {
                    detail: {
                        type: 'tx',
                        tx: {
                            from: obj.from,
                            to: obj.to,
                            value: obj.value,
                            tokenHash: obj.tokenHash,
                            nonce: obj.nonce,
                            data: tx.data || '',
                        },
                        data: {
                            net: obj.net || '',
                            fee_use: obj.fee_use || false,
                            fee_value: this.fee_use !== false ? fee : false,
                            txHash: txHash,
                            date: Date.now(),
                        },
                        cb: {cb: cb, url: window.origin, taskId: taskId}
                    }
                })
                await waitingFunc(taskId, event)
                    .then(result=>{
                        resolve(result);
                    })
                    .catch(err=>{
                        reject(err);
                    })
            }else{
                console.warn(test);
                reject(test)
            }
        })
    }

    this.typeOfFee = async function (tokenHash){
        let tokenInfo = await web.Net.get.token_info(tokenHash);
        if (tokenInfo.length === 0) {
            return false
        }else{
            return {type:tokenInfo[0].fee_type}
        }
    }

    this.getVersion = getVersion

    this.hash_tx_fields = async function (tx) {
        return await web.Utils.Sign.hash_tx_fields(tx);
    }

    this.hashMessage = function (msg){
        return web.Utils.crypto.sha256(msg)
    }

    this.sign = function (msg){
        return new Promise(async (resolve, reject) => {
            msg = msg.toString()
            let hash = this.hashMessage(msg)
            let taskId = window.origin + '/sign/'+hash
            let event = new CustomEvent('ENQContent', {
                detail: {
                    type: 'sign',
                    data: {date: Date.now(), version: web.version, msg:msg, hash:hash},
                    cb: {url: window.origin, taskId: taskId}
                }
            })
            await waitingFunc(taskId, event)
                .then(result=>{
                    resolve(result);
                })
                .catch(err=>{
                    reject(err);
                })
        })
    }
}

module.exports = Web;
