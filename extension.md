# Extension library

It is required to interact with the extension. Working libraries temporarily in the `./prebuild` folder

# Beginning of work

- Connect the library to the page as a script  `cdn`
- The `enqweb3lib` object with methods will appear in the console:
    - .connect ()
    - .enable (obj)
    - .balanceOf (obj)
    - .sendTransaction (obj)

# Methods

### connect ()

Is required to get started with the extension. if you want to ask the extension something - call connect () at the
beginning of the page, it is called 1 time

### async enable ()

Returns a public key, the function is asynchronous! Use await.

### async balanceOf (obj)

The function returns the account balance by token:

`{ to: string, - public key of the account`
`tokenHash: string - token }`

### async sendTransaction (obj)

Send request to send a transaction:

`{ from: string, - public address of the sender`
`to: string, - public address of the recipient`
`value: BigInt, - the number of coins`
`tokenHash: string, - token of the coin`
`nonce: number, - optional (Math.floor (Math.random () * 1e10))`
`data: JSON.stringify (obj), optional. data (you can say hello)`
`net: string - optional, for swap. pass url. without the last slash https://example.com }`