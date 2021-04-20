const Web = require('../packages/web')

const web = new Web()

global.ENQweb3lib = web.Eth
global.ENQWeb = web
