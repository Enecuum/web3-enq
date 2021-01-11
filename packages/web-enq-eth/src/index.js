

var Eth = function Eth(){
    Object.defineProperty(this, 'test',{
        get:function(address){
            console.log('address : ',)
            return true;
        },
        set:function(){
            return true;
        },
        enumerable:true,
        configurable:true
    })

    this.balanceOf = function(address){
        console.log('adress: ',address);
    }
    this.enable = function (){
        console.log('enable')

    }
}

module.exports = Eth;