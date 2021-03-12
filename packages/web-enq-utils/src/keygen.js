const crypto = require('crypto')
let keygen = function keygen(utils){
    function genKeys() {
        const user = crypto.createECDH('secp256k1');
        user.generateKeys();
        let keypair = {
            prvkey : user.getPrivateKey().toString('hex'),
        }
        return keypair;
    }
    function getByNumber(amount) {
        return new Array(amount).fill(0).map((w)=>genKeys()).sort((a,b)=>a.pubkey < b.pubkey ? -1 : 1);
    }

    this.getByNumber = getByNumber
}

module.exports = keygen;