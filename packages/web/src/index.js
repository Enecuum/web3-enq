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


let b = async function (){
    a.Net.provider = 'http://95.216.207.173'
    let test = await a.Net.ticker
    console.log(test);
}

b();