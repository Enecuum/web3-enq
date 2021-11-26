let pow_mod = (base, pow, mod)=>{
    let number = 1n
    while(pow){
        if(pow & 1n){
            number = number * base % mod
        }
        pow /= 2n
        base = base * base % mod
    }
    return number
}

function mod(n, p)
{
    if ( n < 0n )
        n = p - (n*-1n) % p;

    return n % p;
}

function sqrt(value) {
    if (value < 0n) {
        throw 'square root of negative numbers is not supported'
    }

    if (value < 2n) {
        return value;
    }

    function newtonIteration(n, x0) {
        const x1 = ((n / x0) + x0) >> 1n;
        if (x0 === x1 || x0 === (x1 - 1n)) {
            return x0;
        }
        return newtonIteration(n, x1);
    }

    return newtonIteration(value, 1n);
}

module.exports = {mod, pow_mod, sqrt}
