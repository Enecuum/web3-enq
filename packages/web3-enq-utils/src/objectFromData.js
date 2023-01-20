let schemas = require('./schema')
const {BrotliDecode: decode} = require("./decode");

let objectFromData = function objectFromData() {

    let schema = schemas.schema
    let contract_pricelist = schemas.contract_pricelist

    function isContract(raw) {
        if (raw === undefined || raw === null)
            return false;
        let chunk = getChunk(raw);
        if ((chunk.size === raw.length) && contract_pricelist.hasOwnProperty(chunk.key))
            return chunk.key;
        return false;
    }

    function getKey(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    function getChunk(bin) {
        let size = parseInt(bin.substring(0, 4), 16);
        let key = getKey(schema, bin.substring(4, 8));
        return {
            size: size,
            key: key,
            data: bin.substr(8, size - 8)
        }
    }

    function deserialize(bin) {
        let arr = [];
        while (bin.length > 0) {
            let chunk = getChunk(bin);
            if (bin.length === chunk.size) {
                if ((!contract_pricelist.hasOwnProperty(chunk.key))
                    && (chunk.key !== 'parameters')
                    && (chunk.key !== 'object')) {
                    arr.push([chunk.key, chunk.data]);
                    return arr;
                }
                bin = bin.substring(8, bin.length);
            }
            if (bin.length > chunk.size)
                arr.push([chunk.key, chunk.data]);
            else
                arr.push([chunk.key, deserialize(chunk.data)]);
            bin = bin.substring(chunk.size);
        }
        return arr;
    }

    function prettify(data) {
        let res = {};
        let arr = [];
        for (let i = 0; i < (data.length); i++) {
            let el = data[i];
            if (Array.isArray(el)) {
                arr.push(prettify(el))
            } else {
                if (!Array.isArray(data[i + 1])) {
                    res[el] = data[i + 1];
                    i++;
                } else {
                    res[el] = prettify(data[i + 1]);
                    i++;
                }
            }
        }
        if (arr.length > 0)
            return arr;
        return res;
    }

    function parse(raw) {
        let data = {};
        let input = (deserialize(raw))[0];
        data.type = input[0];
        input = prettify(input[1]);
        //data.procedure_name = input[0].procedure_name;
        let params = input[0].parameters;
        data.parameters = {};
        for (let i = 0; i < params.length; i += 2) {
            let value = (Object.keys(params[i + 1]))[0];
            if (value === 'int' || value === 'bigint' || value === 'float') {
                if (value === 'bigint') {
                    value = BigInt(params[i + 1][value]);
                } else {
                    if (isNaN(params[i + 1][value]))
                        throw new Error('Not a number');
                    value = parseInt(params[i + 1][value]);
                }
            } else
                value = params[i + 1][value];
            data.parameters[params[i].key] = value;
        }
        return data;
    }

    this.parse = function (data) {
        return parse(data);
    }
    this.isContract = function (data) {
        return isContract(data)
    }
    this.parseCompressData = function (raw) {
        let data
        try {
            let buffer = Buffer.from(raw, "base64");
            data = decode(buffer)
        } catch (e) {
            console.error(e)
            return false
        }
        let str = ""
        for (let i = 0; i < data.length; i++) {
            str += String.fromCharCode(data[i])
        }
        try {
            data = JSON.parse(str)
        } catch (e) {
            console.error(e)
            data = false
        }
        return data;
    }
}

module.exports = objectFromData
