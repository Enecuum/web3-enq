const rsasign = require('jsrsasign');
const crypto = require('crypto')
const EC = require('elliptic').ec;
let KeyEncoder = require('key-encoder').default;
let keyEncoder = new KeyEncoder('secp256k1');

let Sign = {
    hash_tx_fields: function (tx) {
        if (!tx)
            return undefined;
        let model = ['amount', 'data', 'from', 'nonce', 'ticker', 'to'];
        let str;
        try {
            str = model.map(v => crypto.createHash('sha256').update(tx[v].toString().toLowerCase()).digest('hex')).join('');
        } catch (e) {
            if (e instanceof TypeError) {
                console.warn('Old tx format, skip new fields...');
                return undefined;
            }
        }
        return crypto.createHash('sha256').update(str).digest('hex');
    },
    ecdsa_sign: function (skey, msg) {
        let sig = new rsasign.Signature({'alg': 'SHA256withECDSA'});
        try {
            sig.init({d: skey, curve: 'secp256k1'});
            sig.updateString(msg);
            return sig.sign();
        } catch (err) {
            console.error('Signing error: ', err);
            return null;
        }
    },
    ecdsa_verify : function(cpkey, sign, msg){
        let ecdh = crypto.createECDH('secp256k1')
        ecdh.computeSecret(cpkey,'hex','hex')
        console.log(crypto)
        try{
            let sign_buf = Buffer.from(sign, 'hex');
            let pkey = crypto.ECDH.convertKey(cpkey, 'secp256k1', 'hex', 'hex', 'uncompressed');
            let pemPublicKey = keyEncoder.encodePublic(pkey, 'raw', 'pem');
            console.log(pemPublicKey)
            const verify = crypto.createVerify('SHA256');
            verify.update(msg);
            verify.end();
            return verify.verify(pemPublicKey, sign_buf);
        }
        catch(err){
            console.error("Verification error: ", err);
            console.error({sign});
            return false;
        }
    },
    getPublicKey: function (pvt, compact) {
        let ec = new EC('secp256k1');
        let key = ec.keyFromPrivate(pvt, 'hex');
        return key.getPublic(compact, 'hex');
    },
    encode: function encode(arr, enc) {
        if (enc === 'hex')
            return this.toHex(arr);
        else
            return arr;
    },
    toHex: function (d) {
        let hex = Number(d).toString(16);
        while ((hex.length % 2) !== 0) {
            hex = '0' + hex;
        }
        return hex;
    }
}

module.exports = Sign;
