var Eth = function Eth(web) {
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
            ENQWeb.Enq.ready[id] = false
            await _promise(id).then(el => {
                if (web.Enq.cb[id].reject) {
                    web.Enq.ready[id] = true
                    reject()
                }
                delete ENQWeb.Enq.ready[id]
                resolve(web.Enq.cb[id])
            }).catch(err => {
                console.log('ERROR: ', err)
                delete ENQWeb.Enq.ready[id]
                reject({reject: true, err: err})
            })
        })
    }
    let lastResult = ''

    function getProvider() {
        return new Promise((async (resolve, reject) => {
            if (ENQExt) {
                // let taskId = Math.random().toString(36)
                let taskId = window.origin + '/getProvider'
                let event = new CustomEvent('ENQContent', {
                    detail: {
                        type: 'getProvider',
                        cb: {url: window.origin, taskId: taskId}
                    }
                })
                if (typeof ENQWeb.Enq.ready === typeof (Boolean) && ENQWeb.Enq.ready === false) {
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
            } else {
                console.error('Not enable!')
                reject(null)
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
        // await _waitAnswer(taskId)
        //     .then(result =>{
        //         console.log('Wallet connected')
        //         lastResult = result
        //     })
        //     .catch(err=>{
        //         console.log(err)
        //         lastResult = null
        //     })
        // return lastResult
    }

    this.enable = async function (cb) {
        return new Promise(async (resolve, reject) => {
            // let taskId = Math.random().toString(36)
            let taskId = window.origin + '/enable'
            if (ENQExt) {
                let event = new CustomEvent('ENQContent', {
                    detail: {
                        type: 'enable',
                        cb: {cb: cb, url: window.origin, taskId: taskId}
                    }
                })
                if (typeof ENQWeb.Enq.ready === typeof (Boolean) && ENQWeb.Enq.ready === false) {
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
            } else {
                console.error('Not enable!')
                reject(null)
            }
        })

    }
    this.balanceOf = async function (obj, cb) {
        //address, token, cb
        return new Promise(async (resolve, reject) => {
            // let taskId = Math.random().toString(36)
            let taskId = window.origin + '/balanceOf'
            if (ENQExt) {
                let event = new CustomEvent('ENQContent', {
                    detail: {
                        type: 'balanceOf',
                        data: {
                            to: obj.to,
                            tokenHash: obj.tokenHash,
                        },
                        cb: {cb: cb, url: window.origin, taskId: taskId}
                    }
                })
                if (typeof ENQWeb.Enq.ready === typeof (Boolean) && ENQWeb.Enq.ready === false) {
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
            } else {
                console.error('Not enable!')
                reject(null)
            }
        })


    }

    this.sendTransaction = async function (obj, cb) {
        //from, to, value, tokenHash, cb
        return new Promise(async (resolve, reject) => {
            // let taskId = Math.random().toString(36)
            let taskId = window.origin + '/tx'
            if (ENQExt) {
                let event = new CustomEvent('ENQContent', {
                    detail: {
                        type: 'tx',
                        data: {
                            from: obj.from,
                            to: obj.to,
                            value: obj.value,
                            tokenHash: obj.tokenHash,
                            nonce: obj.nonce || Math.floor(Math.random() * 1e10),
                            data: obj.data || '',
                            net: obj.net || ''
                        },
                        cb: {cb: cb, url: window.origin, taskId: taskId}
                    }
                })
                if (typeof ENQWeb.Enq.ready === typeof (Boolean) && ENQWeb.Enq.ready === false) {
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
            } else {
                console.error('Not enable!')
                reject(null)
            }
        })
    }
}

module.exports = Eth;
