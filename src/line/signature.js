"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLineSignature = validateLineSignature;
var node_crypto_1 = require("node:crypto");
function validateLineSignature(body, signature, channelSecret) {
    var hash = node_crypto_1.default.createHmac("SHA256", channelSecret).update(body).digest("base64");
    var hashBuffer = Buffer.from(hash);
    var signatureBuffer = Buffer.from(signature);
    // Use constant-time comparison to prevent timing attacks.
    if (hashBuffer.length !== signatureBuffer.length) {
        return false;
    }
    return node_crypto_1.default.timingSafeEqual(hashBuffer, signatureBuffer);
}
