"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadOrCreateDeviceIdentity = loadOrCreateDeviceIdentity;
exports.signDevicePayload = signDevicePayload;
exports.normalizeDevicePublicKeyBase64Url = normalizeDevicePublicKeyBase64Url;
exports.deriveDeviceIdFromPublicKey = deriveDeviceIdFromPublicKey;
exports.publicKeyRawBase64UrlFromPem = publicKeyRawBase64UrlFromPem;
exports.verifyDeviceSignature = verifyDeviceSignature;
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var DEFAULT_DIR = node_path_1.default.join(node_os_1.default.homedir(), ".openclaw", "identity");
var DEFAULT_FILE = node_path_1.default.join(DEFAULT_DIR, "device.json");
function ensureDir(filePath) {
    node_fs_1.default.mkdirSync(node_path_1.default.dirname(filePath), { recursive: true });
}
var ED25519_SPKI_PREFIX = Buffer.from("302a300506032b6570032100", "hex");
function base64UrlEncode(buf) {
    return buf.toString("base64").replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}
function base64UrlDecode(input) {
    var normalized = input.replaceAll("-", "+").replaceAll("_", "/");
    var padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    return Buffer.from(padded, "base64");
}
function derivePublicKeyRaw(publicKeyPem) {
    var key = node_crypto_1.default.createPublicKey(publicKeyPem);
    var spki = key.export({ type: "spki", format: "der" });
    if (spki.length === ED25519_SPKI_PREFIX.length + 32 &&
        spki.subarray(0, ED25519_SPKI_PREFIX.length).equals(ED25519_SPKI_PREFIX)) {
        return spki.subarray(ED25519_SPKI_PREFIX.length);
    }
    return spki;
}
function fingerprintPublicKey(publicKeyPem) {
    var raw = derivePublicKeyRaw(publicKeyPem);
    return node_crypto_1.default.createHash("sha256").update(raw).digest("hex");
}
function generateIdentity() {
    var _a = node_crypto_1.default.generateKeyPairSync("ed25519"), publicKey = _a.publicKey, privateKey = _a.privateKey;
    var publicKeyPem = publicKey.export({ type: "spki", format: "pem" }).toString();
    var privateKeyPem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
    var deviceId = fingerprintPublicKey(publicKeyPem);
    return { deviceId: deviceId, publicKeyPem: publicKeyPem, privateKeyPem: privateKeyPem };
}
function loadOrCreateDeviceIdentity(filePath) {
    if (filePath === void 0) { filePath = DEFAULT_FILE; }
    try {
        if (node_fs_1.default.existsSync(filePath)) {
            var raw = node_fs_1.default.readFileSync(filePath, "utf8");
            var parsed = JSON.parse(raw);
            if ((parsed === null || parsed === void 0 ? void 0 : parsed.version) === 1 &&
                typeof parsed.deviceId === "string" &&
                typeof parsed.publicKeyPem === "string" &&
                typeof parsed.privateKeyPem === "string") {
                var derivedId = fingerprintPublicKey(parsed.publicKeyPem);
                if (derivedId && derivedId !== parsed.deviceId) {
                    var updated = __assign(__assign({}, parsed), { deviceId: derivedId });
                    node_fs_1.default.writeFileSync(filePath, "".concat(JSON.stringify(updated, null, 2), "\n"), { mode: 384 });
                    try {
                        node_fs_1.default.chmodSync(filePath, 384);
                    }
                    catch (_a) {
                        // best-effort
                    }
                    return {
                        deviceId: derivedId,
                        publicKeyPem: parsed.publicKeyPem,
                        privateKeyPem: parsed.privateKeyPem,
                    };
                }
                return {
                    deviceId: parsed.deviceId,
                    publicKeyPem: parsed.publicKeyPem,
                    privateKeyPem: parsed.privateKeyPem,
                };
            }
        }
    }
    catch (_b) {
        // fall through to regenerate
    }
    var identity = generateIdentity();
    ensureDir(filePath);
    var stored = {
        version: 1,
        deviceId: identity.deviceId,
        publicKeyPem: identity.publicKeyPem,
        privateKeyPem: identity.privateKeyPem,
        createdAtMs: Date.now(),
    };
    node_fs_1.default.writeFileSync(filePath, "".concat(JSON.stringify(stored, null, 2), "\n"), { mode: 384 });
    try {
        node_fs_1.default.chmodSync(filePath, 384);
    }
    catch (_c) {
        // best-effort
    }
    return identity;
}
function signDevicePayload(privateKeyPem, payload) {
    var key = node_crypto_1.default.createPrivateKey(privateKeyPem);
    var sig = node_crypto_1.default.sign(null, Buffer.from(payload, "utf8"), key);
    return base64UrlEncode(sig);
}
function normalizeDevicePublicKeyBase64Url(publicKey) {
    try {
        if (publicKey.includes("BEGIN")) {
            return base64UrlEncode(derivePublicKeyRaw(publicKey));
        }
        var raw = base64UrlDecode(publicKey);
        return base64UrlEncode(raw);
    }
    catch (_a) {
        return null;
    }
}
function deriveDeviceIdFromPublicKey(publicKey) {
    try {
        var raw = publicKey.includes("BEGIN")
            ? derivePublicKeyRaw(publicKey)
            : base64UrlDecode(publicKey);
        return node_crypto_1.default.createHash("sha256").update(raw).digest("hex");
    }
    catch (_a) {
        return null;
    }
}
function publicKeyRawBase64UrlFromPem(publicKeyPem) {
    return base64UrlEncode(derivePublicKeyRaw(publicKeyPem));
}
function verifyDeviceSignature(publicKey, payload, signatureBase64Url) {
    try {
        var key = publicKey.includes("BEGIN")
            ? node_crypto_1.default.createPublicKey(publicKey)
            : node_crypto_1.default.createPublicKey({
                key: Buffer.concat([ED25519_SPKI_PREFIX, base64UrlDecode(publicKey)]),
                type: "spki",
                format: "der",
            });
        var sig = (function () {
            try {
                return base64UrlDecode(signatureBase64Url);
            }
            catch (_a) {
                return Buffer.from(signatureBase64Url, "base64");
            }
        })();
        return node_crypto_1.default.verify(null, Buffer.from(payload, "utf8"), key, sig);
    }
    catch (_a) {
        return false;
    }
}
