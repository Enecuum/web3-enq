const Web3 = require('../packages/web3-enq')

const web3 = new Web3()

global.ENQweb3lib = web3.Web
global.ENQWeb = web3