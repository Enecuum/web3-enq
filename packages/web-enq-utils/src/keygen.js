const crypto = require('crypto');

function genKeys() {
    const user = crypto.createECDH('secp256k1');
    user.generateKeys();
    let keypair = {
        prvkey : user.getPrivateKey().toString('hex'),
        pubkey : crypto.ECDH.convertKey(user.getPublicKey().toString('hex'), 'secp256k1', 'hex', 'hex', 'compressed')
    }
    let pubcom = user.getPublicKey('hex', 'compressed');
    return keypair;
}

function getByNumber(amount) {
    return new Array(amount).fill(0).map((w)=>genKeys()).sort((a,b)=>a.pubkey < b.pubkey ? -1 : 1);
}

module.exports = getByNumber;