const DFO = require('./dataFromObject');

var Utils = function Utils(){
    this.dfo = function (obj){
        return DFO(obj);
    };
}

module.exports = Utils