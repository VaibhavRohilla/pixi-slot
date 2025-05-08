"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getQueryParams_1 = require("./getQueryParams");
var remoteDataConfig_1 = require("../scripts/remoteDataConfig");
var remoteDataUrl = getQueryParams_1.getQueryParams(remoteDataConfig_1.remoteDataConfig.launchParamName);
function getRemoteDataUrl() {
    if (!remoteDataUrl) {
        console.log("no remoteDataUrl");
    }
    return remoteDataUrl;
}
exports.getRemoteDataUrl = getRemoteDataUrl;
