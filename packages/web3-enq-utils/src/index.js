const DFO = require('./dataFromObject');
const OFD = require('./objectFromData')
const Sign = require('./Sign')
const generateKey = require('./keygen')
const crypto = require('./cryptoEnqLib')

let Utils = function Utils() {
    this.dfo = function (obj) {
        return DFO(obj);
    };
    this.ofd = new OFD()
    this.Sign = Sign
    this.generateKey = new generateKey(this)
    this.crypto = crypto
}

module.exports = Utils