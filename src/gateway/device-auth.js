"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDeviceAuthPayload = buildDeviceAuthPayload;
function buildDeviceAuthPayload(params) {
    var _a, _b, _c;
    var version = (_a = params.version) !== null && _a !== void 0 ? _a : (params.nonce ? "v2" : "v1");
    var scopes = params.scopes.join(",");
    var token = (_b = params.token) !== null && _b !== void 0 ? _b : "";
    var base = [
        version,
        params.deviceId,
        params.clientId,
        params.clientMode,
        params.role,
        scopes,
        String(params.signedAtMs),
        token,
    ];
    if (version === "v2") {
        base.push((_c = params.nonce) !== null && _c !== void 0 ? _c : "");
    }
    return base.join("|");
}
