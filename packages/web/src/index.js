const Utils = require('../../web-enq-utils')
const Enq = require('../../web-enq')
const Net = require('../../web-enq-net')
const web = require('../../web-enq-web')
const version = require('../package.json').version

const Web = function Web() {
    this.version = version;
    this.Enq = new Enq(this);
    this.Utils = new Utils(this);
    this.Net = new Net(this);
    this.Web = new web(this);
}

Web.version = version;
Web.modules = {
    Utils,
    Enq,
    Net,
    web,
}

module.exports = Web;
