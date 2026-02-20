"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkInboundAccessControl = checkInboundAccessControl;
var config_js_1 = require("../../config/config.js");
var globals_js_1 = require("../../globals.js");
var pairing_messages_js_1 = require("../../pairing/pairing-messages.js");
var pairing_store_js_1 = require("../../pairing/pairing-store.js");
var utils_js_1 = require("../../utils.js");
var accounts_js_1 = require("../accounts.js");
var PAIRING_REPLY_HISTORY_GRACE_MS = 30000;
function checkInboundAccessControl(params) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, account, dmPolicy, configuredAllowFrom, storeAllowFrom, combinedAllowFrom, defaultAllowFrom, allowFrom, groupAllowFrom, isSamePhone, isSelfChat, pairingGraceMs, suppressPairingReply, dmHasWildcard, normalizedAllowFrom, groupHasWildcard, normalizedGroupAllowFrom, defaultGroupPolicy, groupPolicy, senderAllowed, candidate, allowed, _a, code, created, err_1;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    cfg = (0, config_js_1.loadConfig)();
                    account = (0, accounts_js_1.resolveWhatsAppAccount)({
                        cfg: cfg,
                        accountId: params.accountId,
                    });
                    dmPolicy = (_d = (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.whatsapp) === null || _c === void 0 ? void 0 : _c.dmPolicy) !== null && _d !== void 0 ? _d : "pairing";
                    configuredAllowFrom = account.allowFrom;
                    return [4 /*yield*/, (0, pairing_store_js_1.readChannelAllowFromStore)("whatsapp").catch(function () { return []; })];
                case 1:
                    storeAllowFrom = _q.sent();
                    combinedAllowFrom = Array.from(new Set(__spreadArray(__spreadArray([], (configuredAllowFrom !== null && configuredAllowFrom !== void 0 ? configuredAllowFrom : []), true), storeAllowFrom, true)));
                    defaultAllowFrom = combinedAllowFrom.length === 0 && params.selfE164 ? [params.selfE164] : undefined;
                    allowFrom = combinedAllowFrom.length > 0 ? combinedAllowFrom : defaultAllowFrom;
                    groupAllowFrom = (_e = account.groupAllowFrom) !== null && _e !== void 0 ? _e : (configuredAllowFrom && configuredAllowFrom.length > 0 ? configuredAllowFrom : undefined);
                    isSamePhone = params.from === params.selfE164;
                    isSelfChat = (0, utils_js_1.isSelfChatMode)(params.selfE164, configuredAllowFrom);
                    pairingGraceMs = typeof params.pairingGraceMs === "number" && params.pairingGraceMs > 0
                        ? params.pairingGraceMs
                        : PAIRING_REPLY_HISTORY_GRACE_MS;
                    suppressPairingReply = typeof params.connectedAtMs === "number" &&
                        typeof params.messageTimestampMs === "number" &&
                        params.messageTimestampMs < params.connectedAtMs - pairingGraceMs;
                    dmHasWildcard = (_f = allowFrom === null || allowFrom === void 0 ? void 0 : allowFrom.includes("*")) !== null && _f !== void 0 ? _f : false;
                    normalizedAllowFrom = allowFrom && allowFrom.length > 0
                        ? allowFrom.filter(function (entry) { return entry !== "*"; }).map(utils_js_1.normalizeE164)
                        : [];
                    groupHasWildcard = (_g = groupAllowFrom === null || groupAllowFrom === void 0 ? void 0 : groupAllowFrom.includes("*")) !== null && _g !== void 0 ? _g : false;
                    normalizedGroupAllowFrom = groupAllowFrom && groupAllowFrom.length > 0
                        ? groupAllowFrom.filter(function (entry) { return entry !== "*"; }).map(utils_js_1.normalizeE164)
                        : [];
                    defaultGroupPolicy = (_j = (_h = cfg.channels) === null || _h === void 0 ? void 0 : _h.defaults) === null || _j === void 0 ? void 0 : _j.groupPolicy;
                    groupPolicy = (_l = (_k = account.groupPolicy) !== null && _k !== void 0 ? _k : defaultGroupPolicy) !== null && _l !== void 0 ? _l : "open";
                    if (params.group && groupPolicy === "disabled") {
                        (0, globals_js_1.logVerbose)("Blocked group message (groupPolicy: disabled)");
                        return [2 /*return*/, {
                                allowed: false,
                                shouldMarkRead: false,
                                isSelfChat: isSelfChat,
                                resolvedAccountId: account.accountId,
                            }];
                    }
                    if (params.group && groupPolicy === "allowlist") {
                        if (!groupAllowFrom || groupAllowFrom.length === 0) {
                            (0, globals_js_1.logVerbose)("Blocked group message (groupPolicy: allowlist, no groupAllowFrom)");
                            return [2 /*return*/, {
                                    allowed: false,
                                    shouldMarkRead: false,
                                    isSelfChat: isSelfChat,
                                    resolvedAccountId: account.accountId,
                                }];
                        }
                        senderAllowed = groupHasWildcard ||
                            (params.senderE164 != null && normalizedGroupAllowFrom.includes(params.senderE164));
                        if (!senderAllowed) {
                            (0, globals_js_1.logVerbose)("Blocked group message from ".concat((_m = params.senderE164) !== null && _m !== void 0 ? _m : "unknown sender", " (groupPolicy: allowlist)"));
                            return [2 /*return*/, {
                                    allowed: false,
                                    shouldMarkRead: false,
                                    isSelfChat: isSelfChat,
                                    resolvedAccountId: account.accountId,
                                }];
                        }
                    }
                    if (!!params.group) return [3 /*break*/, 10];
                    if (params.isFromMe && !isSamePhone) {
                        (0, globals_js_1.logVerbose)("Skipping outbound DM (fromMe); no pairing reply needed.");
                        return [2 /*return*/, {
                                allowed: false,
                                shouldMarkRead: false,
                                isSelfChat: isSelfChat,
                                resolvedAccountId: account.accountId,
                            }];
                    }
                    if (dmPolicy === "disabled") {
                        (0, globals_js_1.logVerbose)("Blocked dm (dmPolicy: disabled)");
                        return [2 /*return*/, {
                                allowed: false,
                                shouldMarkRead: false,
                                isSelfChat: isSelfChat,
                                resolvedAccountId: account.accountId,
                            }];
                    }
                    if (!(dmPolicy !== "open" && !isSamePhone)) return [3 /*break*/, 10];
                    candidate = params.from;
                    allowed = dmHasWildcard ||
                        (normalizedAllowFrom.length > 0 && normalizedAllowFrom.includes(candidate));
                    if (!!allowed) return [3 /*break*/, 10];
                    if (!(dmPolicy === "pairing")) return [3 /*break*/, 8];
                    if (!suppressPairingReply) return [3 /*break*/, 2];
                    (0, globals_js_1.logVerbose)("Skipping pairing reply for historical DM from ".concat(candidate, "."));
                    return [3 /*break*/, 7];
                case 2: return [4 /*yield*/, (0, pairing_store_js_1.upsertChannelPairingRequest)({
                        channel: "whatsapp",
                        id: candidate,
                        meta: { name: ((_o = params.pushName) !== null && _o !== void 0 ? _o : "").trim() || undefined },
                    })];
                case 3:
                    _a = _q.sent(), code = _a.code, created = _a.created;
                    if (!created) return [3 /*break*/, 7];
                    (0, globals_js_1.logVerbose)("whatsapp pairing request sender=".concat(candidate, " name=").concat((_p = params.pushName) !== null && _p !== void 0 ? _p : "unknown"));
                    _q.label = 4;
                case 4:
                    _q.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, params.sock.sendMessage(params.remoteJid, {
                            text: (0, pairing_messages_js_1.buildPairingReply)({
                                channel: "whatsapp",
                                idLine: "Your WhatsApp phone number: ".concat(candidate),
                                code: code,
                            }),
                        })];
                case 5:
                    _q.sent();
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _q.sent();
                    (0, globals_js_1.logVerbose)("whatsapp pairing reply failed for ".concat(candidate, ": ").concat(String(err_1)));
                    return [3 /*break*/, 7];
                case 7: return [3 /*break*/, 9];
                case 8:
                    (0, globals_js_1.logVerbose)("Blocked unauthorized sender ".concat(candidate, " (dmPolicy=").concat(dmPolicy, ")"));
                    _q.label = 9;
                case 9: return [2 /*return*/, {
                        allowed: false,
                        shouldMarkRead: false,
                        isSelfChat: isSelfChat,
                        resolvedAccountId: account.accountId,
                    }];
                case 10: return [2 /*return*/, {
                        allowed: true,
                        shouldMarkRead: true,
                        isSelfChat: isSelfChat,
                        resolvedAccountId: account.accountId,
                    }];
            }
        });
    });
}
