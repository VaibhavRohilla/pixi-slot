import { getRemoteDataUrl } from "../launchParams/remoteDataUrl";
import { loadFile } from "../helpers/loadFile";
import { remoteDataConfig } from "./remoteDataConfig";
import { getErrorMsgData, setErrorMsgData } from "../multilanguage/errorMsgData";
import { IsInNode } from "../helpers/isInNode";
import { getErrorCodesData, setErrorCodesData } from "../multilanguage/errorCodesData";
import { getGameMsgData } from "../multilanguage/gameMsgData";

let remoteDataUrl = getRemoteDataUrl();

let oldData = getErrorMsgData();

let oldDataCodes = getErrorCodesData();

let oldGameMsgData = getGameMsgData();

console.log("gam client remote data testing, gup url = ", remoteDataUrl);
console.log("gam client remote data testing, old data msg = ", oldData);
console.log("gam client remote data testing, old data coodes = ", oldDataCodes);

console.log("gam client remote data testing, oldGameMsgData = ", oldGameMsgData);

if (remoteDataUrl) {
    console.log("loading " + remoteDataUrl + "/" + remoteDataConfig.generatedFileName);
    loadFile(remoteDataUrl + "/" + remoteDataConfig.generatedFileName, "js");
}

if (!IsInNode()) {
    document.addEventListener(remoteDataConfig.generatedFileEventName, function(e) {
        console.log("remoteErrorCodesData - handling event " + remoteDataConfig.generatedFileEventName, e);
        if (e.hasOwnProperty("attachedData") && e["attachedData"].hasOwnProperty("remoteErrorCodesData")) {
            setErrorCodesData(e["attachedData"]["remoteErrorCodesData"]);
            console.log("new data = ", getErrorCodesData());
        }

        console.log("errorMsgData - handling event " + remoteDataConfig.generatedFileEventName, e);
        if (e.hasOwnProperty("attachedData") && e["attachedData"].hasOwnProperty("remoteErrorMsgData")) {
            setErrorMsgData(e["attachedData"]["remoteErrorMsgData"]);
            console.log("new data = ", getErrorMsgData());
        }
    });
}

