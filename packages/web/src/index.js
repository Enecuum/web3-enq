const Utils = require('../../web-enq-utils')
const Enq = require('../../web-enq')
const Net = require('../../web-enq-net')
const web = require('../../web-enq-web')
const Eth = require("../../web-enq-web");
const version = require('../package.json').version

const Web = function Web() {
    this.version = version;
    this.Utils = new Utils(this);
    this.Enq = new Enq(this);
    this.Net = new Net(this);
    this.Web = new Web(this);
}

Web.version = version;
Web.modules = {
    Utils,
    Enq,
    Net,
    Web,
}

module.exports = Web;
