const DFO = require('./dataFromObject');
const utils = require('./Utils')

var Utils = function Utils(){
    this.dfo = function (obj){
        return DFO(obj);
    };
    this.Utils = utils
}

module.exports = Utils