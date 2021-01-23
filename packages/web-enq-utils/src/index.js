const DFO = require('./dataFromObject');
//const utils = require('./Utils')
const Sign = require('./Sign')

var Utils = function Utils(){
    this.dfo = function (obj){
        return DFO(obj);
    };
    //this.Utils = utils
    this.Sign = Sign
}

module.exports = Utils