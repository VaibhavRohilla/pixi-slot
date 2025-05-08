"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var remoteDataUrl_1 = require("../launchParams/remoteDataUrl");
var loadFile_1 = require("../helpers/loadFile");
var remoteDataConfig_1 = require("./remoteDataConfig");
var errorMsgData_1 = require("../multilanguage/errorMsgData");
var isInNode_1 = require("../helpers/isInNode");
var errorCodesData_1 = require("../multilanguage/errorCodesData");
var gameMsgData_1 = require("../multilanguage/gameMsgData");
var remoteDataUrl = remoteDataUrl_1.getRemoteDataUrl();
var oldData = errorMsgData_1.getErrorMsgData();
var oldDataCodes = errorCodesData_1.getErrorCodesData();
var oldGameMsgData = gameMsgData_1.getGameMsgData();
console.log("gam client remote data testing, gup url = ", remoteDataUrl);
console.log("gam client remote data testing, old data msg = ", oldData);
console.log("gam client remote data testing, old data coodes = ", oldDataCodes);
console.log("gam client remote data testing, oldGameMsgData = ", oldGameMsgData);
if (remoteDataUrl) {
    console.log("loading " + remoteDataUrl + "/" + remoteDataConfig_1.remoteDataConfig.generatedFileName);
    loadFile_1.loadFile(remoteDataUrl + "/" + remoteDataConfig_1.remoteDataConfig.generatedFileName, "js");
}
if (!isInNode_1.IsInNode()) {
    document.addEventListener(remoteDataConfig_1.remoteDataConfig.generatedFileEventName, function (e) {
        console.log("remoteErrorCodesData - handling event " + remoteDataConfig_1.remoteDataConfig.generatedFileEventName, e);
        if (e.hasOwnProperty("attachedData") && e["attachedData"].hasOwnProperty("remoteErrorCodesData")) {
            errorCodesData_1.setErrorCodesData(e["attachedData"]["remoteErrorCodesData"]);
            console.log("new data = ", errorCodesData_1.getErrorCodesData());
        }
        console.log("errorMsgData - handling event " + remoteDataConfig_1.remoteDataConfig.generatedFileEventName, e);
        if (e.hasOwnProperty("attachedData") && e["attachedData"].hasOwnProperty("remoteErrorMsgData")) {
            errorMsgData_1.setErrorMsgData(e["attachedData"]["remoteErrorMsgData"]);
            console.log("new data = ", errorMsgData_1.getErrorMsgData());
        }
    });
}
