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
exports.fetchCopilotUsage = fetchCopilotUsage;
var provider_usage_fetch_shared_js_1 = require("./provider-usage.fetch.shared.js");
var provider_usage_shared_js_1 = require("./provider-usage.shared.js");
function fetchCopilotUsage(token, timeoutMs, fetchFn) {
    return __awaiter(this, void 0, void 0, function () {
        var res, data, windows, remaining, remaining;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, provider_usage_fetch_shared_js_1.fetchJson)("https://api.github.com/copilot_internal/user", {
                        headers: {
                            Authorization: "token ".concat(token),
                            "Editor-Version": "vscode/1.96.2",
                            "User-Agent": "GitHubCopilotChat/0.26.7",
                            "X-Github-Api-Version": "2025-04-01",
                        },
                    }, timeoutMs, fetchFn)];
                case 1:
                    res = _c.sent();
                    if (!res.ok) {
                        return [2 /*return*/, {
                                provider: "github-copilot",
                                displayName: provider_usage_shared_js_1.PROVIDER_LABELS["github-copilot"],
                                windows: [],
                                error: "HTTP ".concat(res.status),
                            }];
                    }
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = (_c.sent());
                    windows = [];
                    if ((_a = data.quota_snapshots) === null || _a === void 0 ? void 0 : _a.premium_interactions) {
                        remaining = data.quota_snapshots.premium_interactions.percent_remaining;
                        windows.push({
                            label: "Premium",
                            usedPercent: (0, provider_usage_shared_js_1.clampPercent)(100 - (remaining !== null && remaining !== void 0 ? remaining : 0)),
                        });
                    }
                    if ((_b = data.quota_snapshots) === null || _b === void 0 ? void 0 : _b.chat) {
                        remaining = data.quota_snapshots.chat.percent_remaining;
                        windows.push({
                            label: "Chat",
                            usedPercent: (0, provider_usage_shared_js_1.clampPercent)(100 - (remaining !== null && remaining !== void 0 ? remaining : 0)),
                        });
                    }
                    return [2 /*return*/, {
                            provider: "github-copilot",
                            displayName: provider_usage_shared_js_1.PROVIDER_LABELS["github-copilot"],
                            windows: windows,
                            plan: data.copilot_plan,
                        }];
            }
        });
    });
}
