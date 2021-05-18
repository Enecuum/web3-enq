const Eth = function Eth(web) {
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
    let lastResult = ''

    function getProvider(fullUrl = false) {
        return new Promise((async (resolve, reject) => {
            // let taskId = Math.random().toString(36)
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
        // let taskId = Math.random().toString(36)
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
            // let taskId = Math.random().toString(36)
            let taskId = window.origin + '/enable'
            let event = new CustomEvent('ENQContent', {
                detail: {
                    type: 'enable',
                    data: {date: Date.now(), version: web.version},
                    cb: {cb: cb, url: window.origin, taskId: taskId}
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
        })

    }
    this.balanceOf = async function (obj, cb) {
        //address, token, cb
        return new Promise(async (resolve, reject) => {
            // let taskId = Math.random().toString(36)
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

    this.serialize = function (data){
        return ENQWeb.Utils.dfo(data);
    }

    this.fee_counter = async function (tokenHash, amount){
        let tokenInfo = await web.Net.get.token_info(tokenHash);
        if(tokenInfo.length ===0){
            return false
        }
        else{
            if(tokenInfo[0].fee_type === 0){
                return tokenInfo[0].fee_value
            }
            if(tokenInfo[0].fee_type === 1){
                let checkAmount = (amount*tokenInfo[0].fee)/1e4
                if(checkAmount > tokenInfo[0].fee_min){
                    return  checkAmount
                }else{
                    return tokenInfo[0].fee_min
                }
            }
            return false
        }
    }

    this.sendTransaction = async function (obj, cb) {
        //from, to, value, tokenHash, cb
        return new Promise(async (resolve, reject) => {
            // let taskId = Math.random().toString(36)
            let taskId = ''
            if (!obj.nonce) {
                obj.nonce = Math.floor(Math.random() * 1e10)
            }
            if (obj.fee_use !== undefined && obj.fee_use) {
                obj.value = await this.fee_counter(obj.tokenHash, obj.value)
            }
            let tx = {
                from: obj.from,
                to: obj.to,
                amount: obj.value,
                ticker: obj.tokenHash,
                nonce: obj.nonce,
                data: obj.data ||'',
            }
            if (obj.log !== undefined) {
                console.log(tx);
            }
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
                        txHash: txHash,
                        date: Date.now(),
                    },
                    cb: {cb: cb, url: window.origin, taskId: taskId}
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
        })
    }

    this.getVersion = getVersion

    this.hash_tx_fields = async function (tx) {
        return await web.Utils.Sign.hash_tx_fields(tx);
    }
}

module.exports = Eth;
