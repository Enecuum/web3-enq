const utils = require('../../web-enq-utils')
const Enq = require('../../web-enq')
const Net = require('../../web-enq-net')
const version = require('../package.json').version

var Web = function Web(){
    let _this = this
    this.version = version;
    this.Enq = new Enq(this);
    this.Utils = new utils(this);
    this.Net = new Net(this)
}

Web.version = version;
Web.modules ={
    Utils:utils,
    Enq:Enq,
    Net:Net
}

// module.exports = Web;

let a = new Web()
a.Net.provider = 'http://95.216.207.173'

let b = async function (){
    console.log()
    console.log(await a.Net.get.getMyBalance(a.Enq.token));
}

b();