let web = require('../packages/web')

web = new web()

let net = 'http://95.216.207.173'

let keys={
    genesis:{
        pubkey:
            "029dd222eeddd5c3340e8d46ae0a22e2c8e301bfee4903bcf8c899766c8ceb3a7d",
        prvkey:
            "9d3ce1f3ec99c26c2e64e06d775a52578b00982bf1748e2e2972f7373644ac5c"
    },
    Alice:
        {
            prvkey:
                '33d23ca7d306026eaa68d8864dd3871584ed15cc20803077bea71831ee5492cc',
            pubkey:
                '0228333b99a4d1312f31851dad1c32b530d5ee61534951ebe650c66390fdcffe98'
        },
    Bob:
        {
            prvkey:
                '677b5c0340c1cf1cac4358a517fcf1032c8010e797f2ca87728e29ca638b5914',
            pubkey:
                '030b13a13272b663da33468929110c7505f700b955e1aee754cce17d66a3fde200'
        },
    Eva:{
        prvkey:
            '3f7c8d236678d45c4437b33d9206dc7626e4c61dc644ca02350ec80e9c908fdd',
        pubkey:
            '02b41309909a0c401c38e2dd734a6d7f13733d8c5bfa68639047b189fb78e0855d' }
}

let start = async function(){
    web.Net.provider = net
    web.Net.User = keys.genesis
    // web.Net.post.tx(keys.Bob.pubkey, web.Net.ticker, 100e10, null,web.Net.token)
    //     .then(hash=>{
    //         console.log(hash);
    // })
    //     .catch(err=>{
    //         console.log(err);
    //     })
    let answer = await web.Net.get.getBalance(web.Net.User.pubkey,web.Net.token)
    console.log(answer)
}

let check = function (){
    console.log(web.Eth.transaction(1,1,1));
}
// start()
// check()

// console.log(web.version);