const CryptoJS = require("crypto-js")
// Используется для осложнения подбора пароля перебором
function strengthenPassword(pass, rounds = 5000) {
    while (rounds-- > 0) {
        pass = CryptoJS.SHA256(pass).toString()
    }
    return pass
}

function sha256(str) {
    return CryptoJS.SHA256(str).toString()
}

function encrypt(str, pass) {
    return CryptoJS.AES.encrypt(str, pass).toString()
}

function decrypt(str, pass) {
    const decrypted = CryptoJS.AES.decrypt(str, pass);
    return decrypted.toString(CryptoJS.enc.Utf8)
}

let cryptoEnqLib = {
    encrypt,
    decrypt,
    sha256,
    strengthenPassword
}

module.exports = cryptoEnqLib