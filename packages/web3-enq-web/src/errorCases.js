const Errors = function Errors() {

    this.caseAmountCorrect = (amount) => {
        let charErrMsg = 'need 0-9 string in amount. check the amount field. it should only contain numbers.';
        let positiveErrMsg = 'the amount field is less than 0'
        if (amount === undefined) {
            return {err: {test: 'Amount', msg: 'Amount not found. Enter amount'}}
        }
        let test;
        if (/^\d+?n$/.test(amount)) {
            amount = amount.substr(0, amount.length - 1)
            try {
                test = Number(amount);
            } catch (err) {
                return {err: {msg: charErrMsg, amount: amount}};
            }
            if (test > 0) {
                return {success: {test: 'Amount', edit: 'BigInt'}}
            } else {
                return {err: {msg: positiveErrMsg, amount: amount}};
            }
        }
        if (/^\d+e\d+$/.test(amount) || /^\d+e-\d+$/.test(amount)) {
            try {
                test = Number(amount);
            } catch (err) {
                return {err: {test: 'Amount', msg: charErrMsg, amount: amount}};
            }
            if (test > 0) {
                return {success: {test: 'Amount', edit: 'e'}}
            } else {
                return {err: {test: 'Amount', msg: positiveErrMsg, amount: amount}};
            }
        }
        if (!/^[0-9]+$/.test(amount)) {
            return {err: {test: 'Amount', msg: charErrMsg, amount: amount}};
        }
        if (Number(amount) < 0) {
            return {err: {test: 'Amount', msg: positiveErrMsg, amount: amount}};
        }
        return {success: {test: 'Amount'}}
    }

    this.caseDataCorrect = (data) => {
        if (typeof data === 'object') {
            return {err: {test: 'Data', msg: 'not serialised data'}}
        }
        return {success: {test: 'Data'}}
    }

    this.caseAddressCorrect = (address, type) => {
        if (address === undefined) {
            return {err: {test: 'Address', type: type, msg: `address ${type} not found`}}
        }
        if (address.length < 66) {
            return {err: {test: 'Address', type: type, msg: `${type} address is short`}}
        }
        if (address.length > 66) {
            return {err: {test: 'Address', type: type, msg: `${type} address is long`}}
        }
        return {success: {test: 'Address', type: type}}
    }


    this.inspectTx = function (tx) {
        return new Promise((resolve, reject) => {
            let errors = [];
            let success = []
            let ptr;
            ptr = this.caseAddressCorrect(tx.from, 'From');
            ptr.success !== undefined ? success.push(ptr.success) : errors.push(ptr.err);
            ptr = this.caseAddressCorrect(tx.to, 'To');
            ptr.success !== undefined ? success.push(ptr.success) : errors.push(ptr.err);
            ptr = tx.amount ? this.caseAmountCorrect(tx.amount) : this.caseAmountCorrect(tx.value);
            ptr.success !== undefined ? success.push(ptr.success) : errors.push(ptr.err);
            ptr = this.caseDataCorrect(tx.data);
            ptr.success !== undefined ? success.push(ptr.success) : errors.push(ptr.err);
            if (errors.length > 0) {
                reject({errors, success});
            } else {
                resolve({success})
            }
        })
    }

}

module.exports = new Errors()
