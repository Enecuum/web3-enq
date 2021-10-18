[![Node.js CI](https://github.com/Enecuum/web3-enq/actions/workflows/node.js.yml/badge.svg?branch=release)](https://github.com/Enecuum/web3-enq/actions/workflows/node.js.yml)

# About the library

The library is designed to work with Enecuum blockchain

# Beginning of work

You can use the compiled file `enqweb3.*.min.js`
so that you can use it without resetting by specifying the path to the root of the installed repository, but before
using it you need to install the dependencies `npm i`

# Important

- Before starting work, you need to check the network with which you are going to work. If the network is `bit` then
  nothing needs to be changed. If the network is different:

`ENQWeb.Enq.provider = "https://example.com"` - enter your network address. If the network has an api that returns a native token, then nothing further is required. otherwise, an error will be sent to the console. how to install a native token is written further.

- Check the hash of the native coin. if you are using a custom network, then install a native network token. this needs to be done every initialization of the library:

`ENQWeb.Enq.token ["https://example.com"] = "0000...0000"` - insert your network address and assign the hash of the native
token. after which you can repeat the procedure for installing a custom provider. 

example code for changing the provider. It is recommended to use the methods `ENQWeb.Enq.setProvider (net)` if you are sure that the given native token is in the library or the network has the required api:
```
ENQWeb.Enq.setProvider( "https://example.com" )
```
`ENQWeb.Enq.setProviderWithToken (net, token)` - if you want to set the native token right away:

```
ENQWeb.Enq.setProviderWithToken( "https://example.com", "123...890" )
```
____

- `ENQWeb.Enq.provider` - is responsible for the network to which requests and transactions will be sent
- `ENQWeb.Enq.token` - maps the network to the token. required in smart contracts `ENQWeb.Net.post`

# Methods for working with the Enecuum network

All methods are in `ENQWeb.Net`

- `ENQWeb.Net.get`
    - getBalance (acc, token) - returns the account balance by token
    - token_info (hash) - returns information about the token
    - height () - returns the number of the last block
    - macroblock (hash) - returns information about a macroblock by its hash
    - macroblockByHeight (height) - returns information about a macroblock by its number
    - tx (hash) - returns information about a transaction by its hash
    - getOwner (hash) - returns the public key of the token holder based on the token hash

- `ENQWeb.Net.post`
    - tx (obj) - object fields: `from:{pubkey : < public key >, prvkey: < private key > }, to, tokenHash, amount, data (optional), nonce (optional)`
    - tx_fee_off (obj) - object fields: `from:{pubkey : < public key >, prvkey: < private key > }, to, tokenHash, amount, data (optional), nonce (optional)`
____

- the `from` field is an object with the` pubkey` and `prvkey` fields
____

- `ENQWeb.Net.pos`
    - get_pos_total_stake ()
    - get_pos_list_count ()
    - get_pos_list ()
    - get_pos_list_all ()
    - get_delegators_list ()
    - get_transfer_lock ()

____

# Extension library

It is required to interact with the extension. Working libraries temporarily in the `./dist` folder

# Beginning of work

- Connect the library to the page as a script  `cdn`
- The `enqweb3lib` object with methods will appear in the console:
    - .connect ()
    - .enable (obj)
    - .balanceOf (obj)
    - .sendTransaction (obj)
    - .reconnect ()
    - .serialize (data)
    - .fee_counter (token, amount) 


# Methods

### connect ()

Is required to get started with the extension. if you want to ask the extension something - call connect () at the
beginning of the page, it is called 1 time

### async enable ()

Returns a public key, the function is asynchronous! Use await.

### async balanceOf (obj)

The function returns the account balance by token:
```
{ 
  to: string, - public key of the account
  tokenHash: string - token 
}
```

### async sendTransaction (obj)

Send request to send a transaction:

```
{ 
  from: string, - public address of the sender
  to: string, - public address of the recipient
  value: BigInt, - the number of coins
  tokenHash: string, - token of the coin
  nonce: number, - optional (Math.floor (Math.random () * 1e10))
  data: JSON.stringify (obj), optional. data (you can say hello)
  net: string - optional, for swap. pass url. without the last slash https://example.com 
}
```

### async reconnect ()
this function is needed to restore the connection to the site to which the public key was returned.
the function returns an object containing the `status` field. answer options:
- `{ status: true }`  means that the connection is restored and requests can be sent
- `{ status: false }` means there is no connection.

for the function to work, you must first use the `connect()` method. example code:

```
ENQweb3lib.connect().then(()=>{
    ENQweb3lib.reconnect()
        .then(result => {
            console.log(result)
        })
})
```

### async serialize (data)
This method is required to create a date field from an object. If you want to send a smart contract, then use the serialization of the date field. a js object is fed to the method. sample code: 
```
let tx = {
  from:"...",
  to:"...", 
  ...
  data:{
    type:"example_type",
    parameters:{
      a:"123",
      b:"456"
    }
  }
}
tx.data = ENQweb3lib.serialize(tx.data);
```

### async fee_counter (token, amount) 
This method returns the commission that you pay when sending a transaction. the input data is the token in which you work and the amount. sample code :

```
let fee = ENQweb3lib.fee_counter("123..890", 1e10); // return fee

//or 

let amount = BigInt(1e10);
amount += ENQweb3lib.fee_counter("123..890", amount); // amount = amount + fee 
```