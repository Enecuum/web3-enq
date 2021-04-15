const DFO = require('./dataFromObject');
const OFD = require('./objectFromData')
//const utils = require('./Utils')
const Sign = require('./Sign')

let Utils = function Utils() {
    this.dfo = function (obj) {
        return DFO(obj);
    };
    this.ofd = new OFD()
    //this.Utils = utils
    this.Sign = Sign
}

module.exports = Utils