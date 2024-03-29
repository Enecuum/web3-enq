const rsasign = require('jsrsasign');
const crypto = require('crypto')
const EC = require('elliptic').ec;
let KeyEncoder = require('key-encoder').default;
let keyEncoder = new KeyEncoder('secp256k1');
let libMath = require('./math')

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
    ecdsa_sign_rfc: function (skey, msg) {
        let ec = new EC('secp256k1')
        let key = ec.keyFromPrivate(skey)
        let signature = key.sign(msg)
        return signature.toDER('hex')
    },
    ecdsa_verify: function (publicKey, sign, msgHash) {
        let ec = new EC('secp256k1');
        if (publicKey.length === 66)
            publicKey = this.getDecompressedPublicKey(publicKey)
        let pubkey = ec.keyFromPublic(publicKey, 'hex');
        return pubkey.verify(msgHash, sign)
    },
    getDecompressedPublicKey: (publicKey) => {
        if (publicKey.length !== 66) {
            return false
        }
        let p = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F')
        let x = BigInt("0x" + publicKey.substr(2))
        let prefix = publicKey.substr(0, 2)
        let a = (libMath.pow_mod(x, 3n, p) + 7n) % p
        let y = libMath.pow_mod(a, (p + 1n) / 4n, p)
        let check = y & 1n
        if ((prefix === "02" && check === 1n) || (prefix === "03" && check !== 1n)) {
            y = libMath.mod(-y, p)
        }
        if (y.toString(16).toLowerCase().length < 64) {
            y = y.toString(16).toLowerCase()
            for (let i = 0; i < 64 - y.toString(16).toLowerCase().length; i++) {
                y = '0' + y
            }
        } else {
            y = y.toString(16).toLowerCase()
        }
        if (x.toString(16).toLowerCase().length < 64) {
            x = x.toString(16).toLowerCase()
            for (let i = 0; i < 64 - x.toString(16).toLowerCase().length; i++) {
                x = '0' + x
            }
        } else {
            x = x.toString(16).toLowerCase()
        }
        return `04${x}${y}`
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
