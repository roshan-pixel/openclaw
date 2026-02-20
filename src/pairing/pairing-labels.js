"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePairingIdLabel = resolvePairingIdLabel;
var pairing_js_1 = require("../channels/plugins/pairing.js");
function resolvePairingIdLabel(channel) {
    var _a, _b;
    return (_b = (_a = (0, pairing_js_1.getPairingAdapter)(channel)) === null || _a === void 0 ? void 0 : _a.idLabel) !== null && _b !== void 0 ? _b : "userId";
}
