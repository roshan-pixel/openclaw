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
exports.fetchBrowserJson = fetchBrowserJson;
var command_format_js_1 = require("../cli/command-format.js");
var control_service_js_1 = require("./control-service.js");
var dispatcher_js_1 = require("./routes/dispatcher.js");
function isAbsoluteHttp(url) {
    return /^https?:\/\//i.test(url.trim());
}
function enhanceBrowserFetchError(url, err, timeoutMs) {
    var hint = isAbsoluteHttp(url)
        ? "If this is a sandboxed session, ensure the sandbox browser is running and try again."
        : "Start (or restart) the OpenClaw gateway (OpenClaw.app menubar, or `".concat((0, command_format_js_1.formatCliCommand)("openclaw gateway"), "`) and try again.");
    var msg = String(err);
    var msgLower = msg.toLowerCase();
    var looksLikeTimeout = msgLower.includes("timed out") ||
        msgLower.includes("timeout") ||
        msgLower.includes("aborted") ||
        msgLower.includes("abort") ||
        msgLower.includes("aborterror");
    if (looksLikeTimeout) {
        return new Error("Can't reach the openclaw browser control service (timed out after ".concat(timeoutMs, "ms). ").concat(hint));
    }
    return new Error("Can't reach the openclaw browser control service. ".concat(hint, " (").concat(msg, ")"));
}
function fetchHttpJson(url, init) {
    return __awaiter(this, void 0, void 0, function () {
        var timeoutMs, ctrl, t, res, text;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    timeoutMs = (_a = init.timeoutMs) !== null && _a !== void 0 ? _a : 5000;
                    ctrl = new AbortController();
                    t = setTimeout(function () { return ctrl.abort(); }, timeoutMs);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 6, 7]);
                    return [4 /*yield*/, fetch(url, __assign(__assign({}, init), { signal: ctrl.signal }))];
                case 2:
                    res = _b.sent();
                    if (!!res.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, res.text().catch(function () { return ""; })];
                case 3:
                    text = _b.sent();
                    throw new Error(text || "HTTP ".concat(res.status));
                case 4: return [4 /*yield*/, res.json()];
                case 5: return [2 /*return*/, (_b.sent())];
                case 6:
                    clearTimeout(t);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function fetchBrowserJson(url, init) {
    return __awaiter(this, void 0, void 0, function () {
        var timeoutMs, started, dispatcher, parsed, query, _i, _a, _b, key, value, body, dispatchPromise, result, message, err_1;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    timeoutMs = (_c = init === null || init === void 0 ? void 0 : init.timeoutMs) !== null && _c !== void 0 ? _c : 5000;
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 6, , 7]);
                    if (!isAbsoluteHttp(url)) return [3 /*break*/, 3];
                    return [4 /*yield*/, fetchHttpJson(url, __assign(__assign({}, init), { timeoutMs: timeoutMs }))];
                case 2: return [2 /*return*/, _f.sent()];
                case 3: return [4 /*yield*/, (0, control_service_js_1.startBrowserControlServiceFromConfig)()];
                case 4:
                    started = _f.sent();
                    if (!started) {
                        throw new Error("browser control disabled");
                    }
                    dispatcher = (0, dispatcher_js_1.createBrowserRouteDispatcher)((0, control_service_js_1.createBrowserControlContext)());
                    parsed = new URL(url, "http://localhost");
                    query = {};
                    for (_i = 0, _a = parsed.searchParams.entries(); _i < _a.length; _i++) {
                        _b = _a[_i], key = _b[0], value = _b[1];
                        query[key] = value;
                    }
                    body = init === null || init === void 0 ? void 0 : init.body;
                    if (typeof body === "string") {
                        try {
                            body = JSON.parse(body);
                        }
                        catch (_g) {
                            // keep as string
                        }
                    }
                    dispatchPromise = dispatcher.dispatch({
                        method: ((_d = init === null || init === void 0 ? void 0 : init.method) === null || _d === void 0 ? void 0 : _d.toUpperCase()) === "DELETE"
                            ? "DELETE"
                            : ((_e = init === null || init === void 0 ? void 0 : init.method) === null || _e === void 0 ? void 0 : _e.toUpperCase()) === "POST"
                                ? "POST"
                                : "GET",
                        path: parsed.pathname,
                        query: query,
                        body: body,
                    });
                    return [4 /*yield*/, (timeoutMs
                            ? Promise.race([
                                dispatchPromise,
                                new Promise(function (_, reject) {
                                    return setTimeout(function () { return reject(new Error("timed out")); }, timeoutMs);
                                }),
                            ])
                            : dispatchPromise)];
                case 5:
                    result = _f.sent();
                    if (result.status >= 400) {
                        message = result.body && typeof result.body === "object" && "error" in result.body
                            ? String(result.body.error)
                            : "HTTP ".concat(result.status);
                        throw new Error(message);
                    }
                    return [2 /*return*/, result.body];
                case 6:
                    err_1 = _f.sent();
                    throw enhanceBrowserFetchError(url, err_1, timeoutMs);
                case 7: return [2 /*return*/];
            }
        });
    });
}
