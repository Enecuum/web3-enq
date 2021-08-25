const rsasign = require('jsrsasign');
const crypto = require('crypto')
const EC = require('elliptic').ec;
let KeyEncoder = require('key-encoder').default;
let keyEncoder = new KeyEncoder('secp256k1');

let Sign = {
    rsasign: rsasign,
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
    ecdsa_verify: function (cpkey, sign, msg) {
        let sign_buf = Buffer.from(sign, 'hex');
        let msg_buf = Buffer.from(msg, 'hex');
        let cpkey_buf = Buffer.from(cpkey, 'hex');
        let ec = new rsasign.KJUR.crypto.ECDSA({curve: 'secp256k1'})
        return ec.verifyHex(msg_buf, sign_buf, cpkey_buf)
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
            hex = '0x' + hex;
        }
        return hex;
    }
}

module.exports = Sign;
