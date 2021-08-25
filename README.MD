[![Node.js CI](https://github.com/Enecuum/web3-enq/actions/workflows/node.js.yml/badge.svg)](https://github.com/Enecuum/web3-enq/actions/workflows/node.js.yml)

# About the library

The library is designed to work with Enecuum blockchain

# Beginning of work

You can use the compiled file `enqweb3.min.js`
so that you can use it without resetting by specifying the path to the root of the installed repository, but before
using it you need to install the dependencies `npm i`

# Important

- Before starting work, you need to check the network with which you are going to work. If the network is `pulse` then
  nothing needs to be changed. If the network is different:

`web.Enq.provider = "https://example.com"` - enter your network address. Without a slash '/' at the end (TODO)

- Check the hash of the native coin. If the network is `pulse` or `bit` then nothing needs to be done, otherwise:

`web.Enq.token ["https://example.com"] = "0000...0000"` - insert your network address and assign the hash of the native
token

____

- `web.Enq.provider` - is responsible for the network to which requests and transactions will be sent
- `web.Enq.token` - maps the network to the token. required in smart contracts `web.Net.post`

# Methods for working with the Enecuum network

All methods are in `web.Net`

- `web.Net.get`
    - getBalance (acc, token) - returns the account balance by token
    - token_info (hash) - returns information about the token
    - height () - returns the number of the last block
    - macroblock (hash) - returns information about a macroblock by its hash
    - macroblockByHeight (height) - returns information about a macroblock by its number
    - tx (hash) - returns information about a transaction by its hash
    - getOwner (hash) - returns the public key of the token holder based on the token hash

- `web.Net.post`
    - tx (obj) - object fields: `from, to, tokenHash, amount, data (optional), nonce (optional)`
    - tx_fee_off (obj) - object fields: `from, to, tokenHash, amount, data (optional), nonce (optional)`
    - delegate (obj) - object fields: `from, pos_id, amount`
    - undelegate (obj) - object fields: `from, pos_id, amount`
    - create_pos (obj) - object fields: `from, fee, name`
    - pos_reward (obj) - object fields: `from, pos_id`
    - create_token (obj) - see token creation documentation.
    - burn (obj) - object fields: `from, token_hash, amount`
    - mint (obj) - object fields: `from, token_hash, amount`
    - transfer (obj) - object fields: `from, pos_id`

____

- the `from` field is an object with the` pubkey` and `prvkey` fields

----
For all methods except `tx` and` tx_fee_off` you can specify the `to` field, which will indicate the holder of the
native token. This field is optional, you can specify it explicitly by passing the `to` parameter. You can assign it to

`web.Enq.owner = await web.Net.get.getOwner (<your token hash>)`

After this operation, you can omit the `to` parameter. Also, the value can be automatically substituted if you did
everything correctly from the `Important` section
____

- `web.Net.pos`
    - get_pos_total_stake ()
    - get_pos_list_count ()
    - get_pos_list ()
    - get_pos_list_all ()
    - get_delegators_list ()
    - get_transfer_lock ()
