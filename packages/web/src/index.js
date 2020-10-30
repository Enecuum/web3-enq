const utils = require('../../web-enq-utils')
const Enq = require('../../web-enq')
const version = require('../package.json').version

var Web = function (){
    let _this = this
    this.version = version;
    this.enq = new Enq(this);
    this.enqUtils = utils;
}

Web.version = version;
Web.enqUtils = utils
Web.enq = Enq;

// module.exports = Web;

console.log(Web.enq.why());