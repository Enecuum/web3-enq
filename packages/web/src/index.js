const Utils = require('../../web-enq-utils')
const Enq = require('../../web-enq')
const Net = require('../../web-enq-net')
const Eth = require("../../web-enq-web");
const version = require('../package.json').version

const Web = function Web() {
    this.version = version;
    this.Utils = new Utils(this);
    this.Enq = new Enq(this);
    this.Net = new Net(this);
    this.Eth = new Eth(this);
}

Web.version = version;
Web.modules = {
    Utils,
    Enq,
    Net,
    Eth,
}

module.exports = Web;
