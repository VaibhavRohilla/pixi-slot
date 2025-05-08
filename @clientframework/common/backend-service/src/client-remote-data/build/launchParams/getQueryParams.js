"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isInNode_1 = require("../helpers/isInNode");
function getQueryParams(name) {
    if (!isInNode_1.IsInNode()) {
        var url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        var results = regex.exec(url);
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return "";
        }
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    return null;
}
exports.getQueryParams = getQueryParams;
