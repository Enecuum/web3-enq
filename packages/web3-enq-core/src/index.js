const request = require('request');
const {format} = require('url');

const Enq = function Enq(web) {
    let _this = this;
    let provider = 'https://bit.enecuum.com';
    let ticker = '0000000000000000000000000000000000000000000000000000000000000001';
    let token = {
        'https://pulse.enecuum.com': '0000000000000000000000000000000000000000000000000000000000000000',
        'https://bit.enecuum.com': '0000000000000000000000000000000000000000000000000000000000000001'
    };
    let url = {
        'pulse': 'https://pulse.enecuum.com',
        'bit': 'https://bit.enecuum.com',
    }
    let mnemonic = {
        'https://pulse.enecuum.com': 'pulse',
        'https://bit.enecuum.com': 'bit',
    }
    let user = {};
    let owner = '';
    let cb = [];
    let ready = [];
    let connect = false
    let iframe = false

    const iframeSend = (msg)=>{
        window.parent.postMessage(msg, "*")
    }

    try {
        if (window.location.protocol === "chrome-extension:") {
            let networks = JSON.parse(localStorage.getItem('networks'))
            for (let i in networks) {
                console.log()
                token[networks[i].host] = networks[i].token
            }
        }
    } catch (e) {
        // console.warn("networks not loaded")
    }

    const iframeMessageHandler = (event)=>{
        let data = event.data

        if(data.iframe !== undefined){
            iframe = data.iframe
            ready['extConnect'] = true
        }
        if(data.answer !== undefined){
            ready[data.answer.taskId] = true
            cb[data.answer.taskId] = data.answer.data
        }
    }

    try{
        window.removeEventListener('message', iframeMessageHandler, false)
        window.addEventListener('message', iframeMessageHandler, false)
        iframeSend({'checkConnect':'knock-knock'})
    }catch (e){
        //console.error(e)
    }


    Object.defineProperty(this, 'provider', {
        get: function () {
            return provider;
        },
        set: function (net) {
            if (url[net] !== undefined) {
                provider = url[net]
            } else {
                provider = net;
            }
            if (token[provider] !== undefined) {
                ticker = token[provider]
            } else {
                this.native_token(net)
                    .then(data => {
                        provider = net
                        if (data) {
                            token[net] = data
                            ticker = data
                        } else {
                            ticker = ""
                        }

                    })
                    .catch(() => {})
            }
            return provider;
        },
        enumerable: true,
        configurable: true
    })
    Object.defineProperty(this, 'currentProvider', {
        get: function () {
            if (mnemonic[web.Enq.provider])
                return mnemonic[web.Enq.provider]
            else
                return web.Enq.provider
        }
    })
    Object.defineProperty(this, 'token', {
        get: function () {
            return token;
        },
        set: function (val) {
            token = val;
            return token;
        },
        enumerable: true,
        configurable: true
    })
    Object.defineProperty(this, 'ticker', {
        get: function () {
            return ticker;
        },
        set: function (val) {
            ticker = val;
            return ticker;
        },
        enumerable: true,
        configurable: true
    })
    Object.defineProperty(this, 'owner', {
        get: function () {
            return owner;
        },
        set: function (val) {
            owner = val;
            return owner;
        },
        enumerable: true,
        configurable: true
    })
    Object.defineProperty(this, 'User', {
        get: function () {
            return user;
        },
        set: function (obj) {
            user = obj
            return user;
        },
        enumerable: true,
        configurable: true
    })
    Object.defineProperty(this, 'cb', {
        get: function () {
            return cb;
        },
        set: function (val) {
            cb = val;
            return cb;
        },
        enumerable: true,
        configurable: true
    })
    Object.defineProperty(this, 'ready', {
        get: function () {
            return ready;
        },
        set: function (val) {
            ready = val;
            return ready;
        },
        enumerable: true,
        configurable: true
    })
    Object.defineProperty(this, 'urls', {
        get: function () {
            return Object.keys(token)
        }
    })

    Object.defineProperty(this, 'Connect', {
        get: function () {
            return connect
        },
        set: function (val) {
            connect = val;
            return connect;
        },
        enumerable: true,
        configurable: true
    })

    Object.defineProperty(this, 'iframe', {
        get: function () {
            return iframe
        },
        enumerable: true,
        configurable: true
    })

    this.native_token = function (net) {
        return new Promise((resolve, reject) => {
            net = net[net.length - 1] === "/" ? net.substr(0, net.length - 1) : net;
            fetch(net + "/api/v1/native_token")
                .then(response => response.json())
                .then(data => {
                    if (data.hash !== undefined) {
                        resolve(data.hash)
                    } else {
                        console.warn('Not valid for this network')
                        reject()
                    }
                })
                .catch(e => {
                    fetch(net + '/api/v1/stats')
                        .then(response => response.json())
                        .then(data => {
                            resolve(false)
                        })
                        .catch(e => {
                            console.warn('Not valid for this network')
                            reject()
                        })
                })
        })

    }

    this.setProvider = function(net){
        if (url[net] !== undefined) {
            provider = url[net]
        } else {
            provider = net;
        }
        if (token[provider] !== undefined) {
            ticker = token[provider]
        } else {
            this.native_token(net)
                .then(data => {
                    provider = net
                    if (data) {
                        token[net] = data
                        ticker = data
                    } else {
                        ticker = ""
                    }

                })
                .catch(() => {})
        }
        return provider;
    }

    this.setProviderWithToken = function(net, nativeToken){
        token[net] = nativeToken
        return this.setProvider(net)
    }

    this.sendTx = function (tx) {
        return new Promise(function (resolve, reject) {
            request({url: `${provider}/api/v1/tx`, method: 'POST', json: [tx]}, function (err, resp, body) {
                if (err) {
                    console.error(`Failed to send transaction`);
                    console.log(err);
                    reject();
                } else {
                    if (body.err != 0) {
                        console.error(`Transaction rejected by remote node. error code ${body.err}`);
                        console.error(body);
                        reject(body.message);
                    } else {
                        // console.log(`Transaction sent, hash = ${body.result[0].hash}`);
                        if (body.result[0].hash) {
                            resolve({hash: body.result[0].hash});
                        } else {
                            resolve(body);
                        }
                    }
                }
            });
        });
    }
    this.sendAPI = function (api, fields) {
        return new Promise((resolve, reject) => {
            // bp.urlencoded();
            request({url: `${provider}/api/v1/${api}`, method: 'GET', json: [fields]}, (err, resp, body) => {
                if (err) {
                    console.log(`[ERROR] send get ${api}. ${err}`);
                    reject();
                } else {
                    if (body.err) {
                        console.log(`[ERROR] node-trinity err. get '${api}' failed ${body}`)
                        reject();
                    } else {
                        resolve(body);
                    }
                }
            })
        })
    }
    this.sendRequest = function (url, method, fields) {
        return new Promise((resolve, reject) => {
            // bp.urlencoded();
            request({url: `${url}`, method: method || 'GET', json: [fields]}, (err, resp, body) => {
                if (err) {
                    console.warn(err)
                    reject()
                } else {
                    resolve(body)
                }
            })
        })
    }

    this.sendToParent = iframeSend
}

module.exports = Enq
