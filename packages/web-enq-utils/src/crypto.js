const CryptoJS = require('crypto-js')

// Используется для осложнения подбора пароля перебором
function strengthenPassword(pass, rounds = 5000) {
    while (rounds-- > 0) {
        pass = CryptoJS.SHA256(pass).toString()
    }
    return pass
}

function sha256(str){
    return CryptoJS.SHA256(str).toString()
}

function encrypt(str, pass) {
    const strongPass = strengthenPassword(pass);
    return CryptoJS.AES.encrypt(str, strongPass).toString()
}

function decrypt(str, pass) {
    const strongPass = strengthenPassword(pass)
    const decrypted = CryptoJS.AES.decrypt(str, strongPass);
    return decrypted.toString(CryptoJS.enc.Utf8)
}

let crypto = {
    encrypt,
    decrypt,
    sha256
}

module.exports = crypto