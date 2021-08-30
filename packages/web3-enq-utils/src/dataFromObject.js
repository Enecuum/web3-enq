let schemas = require('./schema')
let schema = schemas.schema

function toHex(d) {
    let hex = Number(d).toString(16);
    while ((hex.length % 2) !== 0) {
        hex = '0' + hex;
    }
    return hex;
}

function sizeMarker(size) {
    let marker = toHex(size);
    while (marker.length < 4) {
        marker = '0' + marker;
    }
    return marker;
}

function dataFromObject(obj) {
    if (obj == '')
        return obj;
    let res = {
        parameters: []
    };
    for (let param in obj.parameters) {

        let type = undefined;
        switch (typeof obj.parameters[param]) {
            case 'bigint' : {
                type = 'bigint';
                break;
            }
            case 'string' : {
                type = 'string';
                break;
            }
            default :
                type = 'int';
        }
        //let type = (typeof obj.parameters[param] === 'string') ? 'string' : 'int';
        res.parameters.push({key: param, [type]: obj.parameters[param]})
    }
    return serializeObject({
        [obj.type]: res
    });
}

function serializeObject(obj) {
    let binary = '';
    if ((!(Array.isArray(obj))) && (typeof obj !== 'object'))
        return obj.toString();

    if (Array.isArray(obj)) {
        for (let el of obj) {
            let res;
            if (typeof el !== 'undefined')
                res = serializeObject(el);
            binary += res;
        }
    } else {
        for (let key in obj) {
            let code = schema[key];
            if (code === undefined) {
                return false //TODO ошибка тут. что возвращать?
            }
            let res;
            if (typeof obj[key] !== 'undefined')
                res = serializeObject(obj[key]);
            binary += sizeMarker(res.length + 8) + code + res;
        }
    }
    return binary;
}

module.exports = dataFromObject;
