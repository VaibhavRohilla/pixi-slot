import { getQueryParams } from "./getQueryParams";
import { remoteDataConfig } from "../scripts/remoteDataConfig";

let remoteDataUrl = getQueryParams(remoteDataConfig.launchParamName);

export function getRemoteDataUrl() {
    if (!remoteDataUrl) {
        console.log("no remoteDataUrl")
    }
    return remoteDataUrl;
}
