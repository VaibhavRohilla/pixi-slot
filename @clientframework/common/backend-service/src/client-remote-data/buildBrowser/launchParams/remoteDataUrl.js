import { getQueryParams } from "./getQueryParams.js";
import { remoteDataConfig } from "../scripts/remoteDataConfig.js";
let remoteDataUrl = getQueryParams(remoteDataConfig.launchParamName);
export function getRemoteDataUrl() {
    if (!remoteDataUrl) {
        console.log("no remoteDataUrl");
    }
    return remoteDataUrl;
}
