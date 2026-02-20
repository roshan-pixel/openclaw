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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWhatsAppAction = handleWhatsAppAction;
var outbound_js_1 = require("../../web/outbound.js");
var common_js_1 = require("./common.js");
function handleWhatsAppAction(params, cfg) {
    return __awaiter(this, void 0, void 0, function () {
        var action, isActionEnabled, chatJid, messageId, _a, emoji, remove, isEmpty, participant, accountId, fromMeRaw, fromMe, resolvedEmoji;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    action = (0, common_js_1.readStringParam)(params, "action", { required: true });
                    isActionEnabled = (0, common_js_1.createActionGate)((_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.whatsapp) === null || _c === void 0 ? void 0 : _c.actions);
                    if (!(action === "react")) return [3 /*break*/, 2];
                    if (!isActionEnabled("reactions")) {
                        throw new Error("WhatsApp reactions are disabled.");
                    }
                    chatJid = (0, common_js_1.readStringParam)(params, "chatJid", { required: true });
                    messageId = (0, common_js_1.readStringParam)(params, "messageId", { required: true });
                    _a = (0, common_js_1.readReactionParams)(params, {
                        removeErrorMessage: "Emoji is required to remove a WhatsApp reaction.",
                    }), emoji = _a.emoji, remove = _a.remove, isEmpty = _a.isEmpty;
                    participant = (0, common_js_1.readStringParam)(params, "participant");
                    accountId = (0, common_js_1.readStringParam)(params, "accountId");
                    fromMeRaw = params.fromMe;
                    fromMe = typeof fromMeRaw === "boolean" ? fromMeRaw : undefined;
                    resolvedEmoji = remove ? "" : emoji;
                    return [4 /*yield*/, (0, outbound_js_1.sendReactionWhatsApp)(chatJid, messageId, resolvedEmoji, {
                            verbose: false,
                            fromMe: fromMe,
                            participant: participant !== null && participant !== void 0 ? participant : undefined,
                            accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                        })];
                case 1:
                    _d.sent();
                    if (!remove && !isEmpty) {
                        return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, added: emoji })];
                    }
                    return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, removed: true })];
                case 2: throw new Error("Unsupported WhatsApp action: ".concat(action));
            }
        });
    });
}
