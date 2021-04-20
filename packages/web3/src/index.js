const Utils = require('../../web3-enq-utils')
const Enq = require('../../web3-enq')
const Net = require('../../web3-enq-net')
const Web = require('../../web3-enq-web')
const version = require('../package.json').version

const Web3 = function Web3() {
    this.version = version;
    this.Utils = new Utils(this);
    this.Enq = new Enq(this);
    this.Net = new Net(this);
    this.Web = new Web(this);
}

Web3.version = version;
Web3.modules = {
    Utils,
    Enq,
    Net,
    Web,
}

module.exports = Web;
