const rsasign = require('jsrsasign');
let keygen = function keygen(utils) {
    function genKeys() {
        let ec = new rsasign.KJUR.crypto.ECDSA({'curve': 'secp256k1'})
        let keypair = ec.generateKeyPairHex()
        return keypair.ecprvhex;
    }

    function getByNumber(amount) {
        return new Array(amount).fill(0).map((w) => genKeys()).sort((a, b) => a.pubkey < b.pubkey ? -1 : 1);
    }

    this.getByNumber = getByNumber
}

module.exports = keygen;