[![Node.js CI](https://github.com/Enecuum/web3-enq/actions/workflows/node.js.yml/badge.svg?branch=release)](https://github.com/Enecuum/web3-enq/actions/workflows/node.js.yml)

# About the library

The library is designed to work with Enecuum blockchain

# Beginning of work

You can use the compiled file `enqweb3. *. Min.js`
so that you can use it without resetting by specifying the path to the root of the installed repository, but before
using it you need to install the dependencies `npm i`
it is possible to use both source files and assemblies * .min.js. to connect the library you can use `webpack` and `import ENQWeb from "path / to / *. min.js" `. the script will add to the Window of page 2 objects: `ENQWeb`,` ENQweb3lib`. ENQweb3lib === ENQWeb.Web.

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

# Native token

To find out the native token of a network, use the `ENQWeb.Enq.native_token (net)` asynchronous method. If the network has the required api, then the function will return a native token. example of use:

```
let token = await ENQWeb.Enq.native_token("https://example.com");

//or 

ENQWeb.Enq.native_token("https://example.com")
  .then(token=>{
    console.log(token);
  })
```

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
  - tx (obj) - sends a transaction with taking the fee. object fields:
    ```
    {
      from:{pubkey : < public key >, prvkey: < private key > }, 
      to, tokenHash, 
      amount, 
      data (optional), 
      nonce (optional)
    }
    ```
  - tx_fee_off (obj) - sends a transaction without taking the fee. object fields:
    ```
    {
      from:{pubkey : < public key >, prvkey: < private key > }, 
      to, tokenHash, 
      amount, 
      data (optional), 
      nonce (optional)
    }
    ```
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
  - .getVersion ()
  - .typeOfFee ( token )
  - .net.getProvider ( fullurl = false )




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
  data: optional. string (you want say 'hello') or serialize, if you send smart contract
  net: string - optional. pass url. without the last slash https://example.com 
}
```

#### Important!
If the field in the "net" transaction object does not match the selected network in the extension, then the extension will return reject, the transaction will not be sent.

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

### async getVersion ()
refills and returns the version of the extension.

### async typeOfFee (token)
will return the type of token commission

### async net.getProvider (fullurl = false)
returns the network on which the extension is running. the `fullurl` flag is responsible for the return value. full url, or short name of the network. e.g. `bit` or `https://bit.enecuum.com`.
____

# Utils
all utilities are in `ENQWeb.Utils`. main methods:
- .Sign.getPublicKey (private key, true) - returns the public key from the private
- .dfo (obj) - serialization of the data field into the blockchain format.
- .ofd.parse (string) - deserialization of the date field into an object.
- .generateKey.getByNumber (number) - returns the number of generated private keys

# Smart-Contract generator
to prepare the transaction, use the method as shown in the example
```
let transaction = new ENQWeb.Utils.SmartContractGenerator.TransactionGenerator("https://pulse.enecuum.com")
```
Paste in parameter url of network explorer. All info takes from API of network
- Result:
```
{
  amount: 1000000000
  data: ""
  from: ""
  nonce: 260087203
  ticker: "0000000000000000000000000000000000000000000000000000000000000000"
  to: "02833f453fb8bf10cc5e8fd362d563851543559f3ea6e662ef114d8db8f72dda19"
}
```

---
data field generation is described below
data field need serialization, use next method:
```
ENQweb3lib.serialize(data)

data - your generated data object
```
### pos methods
these methods are located in the following path
```
ENQWeb.Utils.SmartContractGenerator.SCGenerators.pos
```
- .SmartContractCreatePos(fee, name)
- .SmartContractDelegate(pos_id, amount)
- .SmartContractPosReward(pos_id)
- .SmartContractTransfer(undelegate_id)
- .SmartContractUndelegate(pos_id, amount)

### token methods

these methods are located in the following path
```
ENQWeb.Utils.SmartContractGenerator.SCGenerators.token
```
- .SmartContractCreateToken(fee_type, fee_value, fee_min, ticker, decimals, total_supply, name, minable, reissuable, block_reward, min_stake, ref_share, referrer_stake, max_supply)
- .SmartContractBurn(token_hash, amount)
- .SmartContractMint(token_hash, amount)

### pool methods
these methods are located in the following path
```
ENQWeb.Utils.SmartContractGenerator.SCGenerators.pool
```
- SmartContractPoolCreate(asset_1, amount_1, asset_2, amount_2)
- SmartContractPoolLiquidityAdd(asset_1, amount_1, asset_2, amount_2)
- SmartContractPoolLiquidityRemove(lt, amount)
- SmartContractPoolLiquiditySellExact(asset_in, amount_in, asset_out, amount_out_min)
- SmartContractPoolLiquiditySellExactRouted(asset0, amount_in, asset1, amount_out_min, plength, asset2, asset3)
- SmartContractPoolLiquidityBuyExact(asset_in, amount_in_max, asset_out, amount_out)
- SmartContractPoolLiquidityBuyExactRouted(asset0, amount_in_max, asset1, amount_out, plength, asset2, asset3)

### farm methods
these methods are located in the following path
```
ENQWeb.Utils.SmartContractGenerator.SCGenerators.farm
```
- SmartContractFarmCreate(stake_token, reward_token, block_reward, emission)
- SmartContractFarmIncreaseStake(farm_id, amount)
- SmartContractFarmDecreaseStake(farm_id, amount)
- SmartContractFarmCloseStake(farm_id)
- SmartContractFarmGetReward(farm_id)
- SmartContractFarmsAddEmission(farm_id, amount)


### dex methods
these methods are located in the following path
```
ENQWeb.Utils.SmartContractGenerator.SCGenerators.dex
```

- .SmartContractDexCmdDistribute(token_hash)
