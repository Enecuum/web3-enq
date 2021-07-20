

const Errors = function Errors(){

    this.caseAmountCorrect = (amount)=>{
        if(!/^[0-9]+$/.test(amount)){
            return {err:'need 0-9 string im amount'};
        }
        return {success:true}
    }

    this.caseDataCorrect = (data)=>{
        if(typeof data === 'object'){
            return {err:'not serialised data'}
        }
        return {success:true}
    }

    this.caseAddressCorrect = (address, type)=>{
        if(address.length < 66){
            return {err:`${type} address is short`}
        }
        if(address.length > 66){
            return {err:`${type} address is long`}
        }
        return {success:true}
    }

    

    this.inspectTx = function(tx){
        return new Promise((resolve, reject)=>{
            let errors = [];
            let success = []
            let ptr;
            ptr = this.caseAddressCorrect(tx.from, 'From');
            ptr.success === true ? success.push({test:'Address', type:'From'}):errors.push(ptr.err);
            ptr = this.caseAddressCorrect(tx.to, 'To');
            ptr.success === true ? success.push({test:'Address', type:'To'}):errors.push(ptr.err);
            ptr = tx.amount ? this.caseAmountCorrect(tx.amount) : this.caseAmountCorrect(tx.value);
            ptr.success === true ? success.push({test:'Amount'}):errors.push(ptr.err);
            ptr = this.caseDataCorrect(tx.data);
            ptr.success === true ? success.push({test:'Data'}):errors.push(ptr.err);
            if( errors.length > 0 ){
                reject({err:errors, success});
            }else{
                resolve({success})
            }
        })
    }

}

module.exports = new Errors()