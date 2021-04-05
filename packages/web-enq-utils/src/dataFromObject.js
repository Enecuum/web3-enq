let schema = {
    "root" :            "0000",
    "custom" :          "0100",
    "create_token" :    "0200",
    "delegate" :        "0300",
    "undelegate" :      "0400",
    "signature" :       "0500",
    "hash" :            "0600",
    "string" :          "0700",
    "int" :             "0800",
    "bigint" :          "0900",
    "float" :           "0a00",
    "object" :          "0c00",
    "key" :             "0d00",
    "procedure_name" :  "0e00",
    "parameters" :      "0f00",
    "create_pos" :      "1000",
    "pos_reward" :      "1100",
    "transfer" :        "1200",
    "mint" :            "1300",
    "burn" :            "1400",
    "swap":             "1500",
    "create_pool":      "1600",
    "add_liquidity":    "1700",
    "remove_liquidity": "1800"
};
function toHex(d) {
    let hex = Number(d).toString(16);
    while ((hex.length % 2) !== 0) {
        hex = "0" + hex;
    }
    return hex;
}
function sizeMarker(size) {
    let marker = toHex(size);
    while (marker.length < 4) {
        marker = "0" + marker;
    }
    return marker;
}
function dataFromObject(obj){
    if (obj == '')
        return obj;
    let res = {
        parameters : []
    };
    for(let param in obj.parameters){

        let type = undefined;
        switch (typeof obj.parameters[param]){
            case "bigint" : {
                type = "bigint";
                break;
            }
            case "string" : {
                type = "string";
                break;
            }
            default : type = "int";
        }
        //let type = (typeof obj.parameters[param] === "string") ? "string" : "int";
        res.parameters.push({key : param, [type] : obj.parameters[param]})
    }
    return serialize_object({
        [obj.type] : res
    });
}
function serialize_object(obj){
    let binary = "";
    if((!(Array.isArray(obj))) && (typeof obj !== "object"))
        return obj.toString();

    if(Array.isArray(obj)){
        for (let el of obj){
            let res;
            if (typeof el !== "undefined")
                res = serialize_object(el);
            binary += res;
        }
    }
    else {
        for (let key in obj) {
            let code = schema[key];
            if(code === undefined){
                return false //TODO ошибка тут. что возвращать?
            }
            let res;
            if (typeof obj[key] !== "undefined")
                res = serialize_object(obj[key]);
            binary += sizeMarker(res.length + 8) + code + res;
        }
    }
    return binary;
}
module.exports = dataFromObject;
