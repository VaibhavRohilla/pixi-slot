import { getErrorMsgData } from "../multilanguage/errorMsgData";
import { remoteDataConfig } from "./remoteDataConfig";
import { getErrorCodesData } from "../multilanguage/errorCodesData";
import { getGameMsgData } from "../multilanguage/gameMsgData";



var fs = require( "fs")

//const dir = fs.readdirSync("./assets");
//fs.writeFileSync("assets.ts", "const assets = [" + dir.map((file) => ' "' + file + '"') + "]");

let errorObj = getErrorMsgData();

let errorCodesObj = getErrorCodesData();

let gameObj = getGameMsgData();

console.log("generating js");

//console.log("errorObj", errorObj);

//fs.writeFileSync("errorTexts.js", JSON.stringify(errorObj, null, 2) , 'utf-8');

var util = require('util');

let fileStr =
`
console.log("${remoteDataConfig.generatedFileName} started");
const remoteErrorMsgData = ${util.inspect(errorObj, false, 2, false)}

const remoteErrorCodesData = ${util.inspect(errorCodesObj, false, 2, false)}

const remoteGameMsgData = ${util.inspect(gameObj, false, 2, false)}
console.log("${remoteDataConfig.generatedFileName} remoteErrorMsgData", remoteErrorMsgData);
var event = new Event('${remoteDataConfig.generatedFileEventName}');
event.attachedData = {
    remoteErrorMsgData,
    remoteErrorCodesData,
    remoteGameMsgData
};
console.log("dispatchEvent", event);
document.dispatchEvent(event);
console.log("${remoteDataConfig.generatedFileName} finished");
`;

fs.writeFileSync("deploy/" + remoteDataConfig.generatedFileName, fileStr);
