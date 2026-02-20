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
exports.probeTelegram = probeTelegram;
var proxy_js_1 = require("./proxy.js");
var TELEGRAM_API_BASE = "https://api.telegram.org";
function fetchWithTimeout(url, timeoutMs, fetcher) {
    return __awaiter(this, void 0, void 0, function () {
        var controller, timer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    controller = new AbortController();
                    timer = setTimeout(function () { return controller.abort(); }, timeoutMs);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, fetcher(url, { signal: controller.signal })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    clearTimeout(timer);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function probeTelegram(token, timeoutMs, proxyUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var started, fetcher, base, result, meRes, meJson, webhookRes, webhookJson, _a, err_1;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        return __generator(this, function (_s) {
            switch (_s.label) {
                case 0:
                    started = Date.now();
                    fetcher = proxyUrl ? (0, proxy_js_1.makeProxyFetch)(proxyUrl) : fetch;
                    base = "".concat(TELEGRAM_API_BASE, "/bot").concat(token);
                    result = {
                        ok: false,
                        status: null,
                        error: null,
                        elapsedMs: 0,
                    };
                    _s.label = 1;
                case 1:
                    _s.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, fetchWithTimeout("".concat(base, "/getMe"), timeoutMs, fetcher)];
                case 2:
                    meRes = _s.sent();
                    return [4 /*yield*/, meRes.json()];
                case 3:
                    meJson = (_s.sent());
                    if (!meRes.ok || !(meJson === null || meJson === void 0 ? void 0 : meJson.ok)) {
                        result.status = meRes.status;
                        result.error = (_b = meJson === null || meJson === void 0 ? void 0 : meJson.description) !== null && _b !== void 0 ? _b : "getMe failed (".concat(meRes.status, ")");
                        return [2 /*return*/, __assign(__assign({}, result), { elapsedMs: Date.now() - started })];
                    }
                    result.bot = {
                        id: (_d = (_c = meJson.result) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : null,
                        username: (_f = (_e = meJson.result) === null || _e === void 0 ? void 0 : _e.username) !== null && _f !== void 0 ? _f : null,
                        canJoinGroups: typeof ((_g = meJson.result) === null || _g === void 0 ? void 0 : _g.can_join_groups) === "boolean" ? (_h = meJson.result) === null || _h === void 0 ? void 0 : _h.can_join_groups : null,
                        canReadAllGroupMessages: typeof ((_j = meJson.result) === null || _j === void 0 ? void 0 : _j.can_read_all_group_messages) === "boolean"
                            ? (_k = meJson.result) === null || _k === void 0 ? void 0 : _k.can_read_all_group_messages
                            : null,
                        supportsInlineQueries: typeof ((_l = meJson.result) === null || _l === void 0 ? void 0 : _l.supports_inline_queries) === "boolean"
                            ? (_m = meJson.result) === null || _m === void 0 ? void 0 : _m.supports_inline_queries
                            : null,
                    };
                    _s.label = 4;
                case 4:
                    _s.trys.push([4, 7, , 8]);
                    return [4 /*yield*/, fetchWithTimeout("".concat(base, "/getWebhookInfo"), timeoutMs, fetcher)];
                case 5:
                    webhookRes = _s.sent();
                    return [4 /*yield*/, webhookRes.json()];
                case 6:
                    webhookJson = (_s.sent());
                    if (webhookRes.ok && (webhookJson === null || webhookJson === void 0 ? void 0 : webhookJson.ok)) {
                        result.webhook = {
                            url: (_p = (_o = webhookJson.result) === null || _o === void 0 ? void 0 : _o.url) !== null && _p !== void 0 ? _p : null,
                            hasCustomCert: (_r = (_q = webhookJson.result) === null || _q === void 0 ? void 0 : _q.has_custom_certificate) !== null && _r !== void 0 ? _r : null,
                        };
                    }
                    return [3 /*break*/, 8];
                case 7:
                    _a = _s.sent();
                    return [3 /*break*/, 8];
                case 8:
                    result.ok = true;
                    result.status = null;
                    result.error = null;
                    result.elapsedMs = Date.now() - started;
                    return [2 /*return*/, result];
                case 9:
                    err_1 = _s.sent();
                    return [2 /*return*/, __assign(__assign({}, result), { status: err_1 instanceof Response ? err_1.status : result.status, error: err_1 instanceof Error ? err_1.message : String(err_1), elapsedMs: Date.now() - started })];
                case 10: return [2 /*return*/];
            }
        });
    });
}
