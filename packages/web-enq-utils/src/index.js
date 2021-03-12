const DFO = require('./dataFromObject');
const OFD = require('./objectFromData')
//const utils = require('./Utils')
const Sign = require('./Sign')
const generateKey = require('./keygen')

let Utils = function Utils(){
    this.dfo = function (obj){
        return DFO(obj);
    };
    this.ofd = new OFD()
    //this.Utils = utils
    this.Sign = Sign
    this.generateKey = generateKey
}

module.exports = Utils