"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function IsInNode() {
    return (typeof process === 'object' && process + '' === '[object process]');
}
exports.IsInNode = IsInNode;
