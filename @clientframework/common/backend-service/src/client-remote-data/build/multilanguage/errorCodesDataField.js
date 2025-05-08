"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errorCodesData_1 = require("./errorCodesData");
function getErrorCodesDataField(input) {
    var code = null;
    if (input.hasOwnProperty("error")) {
        code = (input.error.hasOwnProperty("status") ? input.error.status
            : input.error.hasOwnProperty("code") ? input.error.code
                : null);
    }
    console.log("code=", code);
    if (code) {
        var errorCodes = errorCodesData_1.getErrorCodesData();
        var detail = void 0;
        var unperfectMatch = null;
        if (input.error.hasOwnProperty("detail")) {
            //delcons console.log("input.error.detail = ", input.error.detail)
            detail = JSON.parse(input.error.detail);
        }
        for (var i = 0; i < errorCodes.length; i++) {
            var errorCodeField = errorCodes[i];
            if ((errorCodeField.hasOwnProperty("code")
                && errorCodeField.code == code)
                &&
                    (!input.error.hasOwnProperty("statusCode")
                        && !errorCodeField.hasOwnProperty("statusCode")
                        ||
                            input.error.hasOwnProperty("statusCode")
                                && errorCodeField.hasOwnProperty("statusCode")
                                && input.error.statusCode == errorCodeField.statusCode)
                &&
                    (!errorCodeField.hasOwnProperty("detail")
                        ||
                            errorCodeField.hasOwnProperty("detail")
                                && (detail &&
                                    detail.hasOwnProperty("type") &&
                                    detail.hasOwnProperty("period") &&
                                    detail.hasOwnProperty("currentValue") &&
                                    detail.hasOwnProperty("maxValue") &&
                                    detail.type == errorCodeField.detail.type &&
                                    detail.period == errorCodeField.detail.period))) {
                return errorCodeField;
            }
        }
    }
    return null;
}
exports.getErrorCodesDataField = getErrorCodesDataField;
