"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function stringToIntArray(str) {
    return Array.from(str).map(Number);
}
exports.stringToIntArray = stringToIntArray;
function numberToIntArray(nr) {
    return Array.from(nr.toString()).map(Number);
}
exports.numberToIntArray = numberToIntArray;
//# sourceMappingURL=helpers.js.map