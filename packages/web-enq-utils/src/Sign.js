const rsasign = require('../../../node_modules/jsrsasign');
const crypto = require('crypto')

let Sign = {
    hash_tx_fields : function(tx){
        if (!tx)
            return undefined;
        let model = ['amount','data','from','nonce','ticker','to'];
        let str;
        try{
            str = model.map(v => crypto.createHash('sha256').update(tx[v].toString().toLowerCase()).digest('hex')).join("");
        }
        catch(e){
            if (e instanceof TypeError) {
                console.warn("Old tx format, skip new fields...");
                return undefined;
            }
        }
        return crypto.createHash('sha256').update(str).digest('hex');
    },
    ecdsa_sign : function(skey, msg){
        let sig = new rsasign.Signature({ "alg": 'SHA256withECDSA' });
        try {
            sig.init({ d: skey, curve: 'secp256k1' });
            sig.updateString(msg);
            return sig.sign();
        }
        catch(err){
            console.error("Signing error: ", err);
            return null;
        }
    },
}

module.exports = Sign;
