const utils = require('../../web-enq-utils')
const Enq = require('../../web-enq')
const Net = require('../../web-enq-net')
const web = require('../../web-enq-web')
const version = require('../package.json').version

var Web = function Web(){
    let _this = this
    this.version = version;
    this.Enq = new Enq(this);
    this.Utils = new utils(this);
    this.Net = new Net(this);
    this.Web = new web(this);
}

Web.version = version;
Web.modules ={
    Utils:utils,
    Enq:Enq,
    Net:Net,
    Web:web,
}

module.exports = Web;
