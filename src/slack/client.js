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
exports.SLACK_DEFAULT_RETRY_OPTIONS = void 0;
exports.resolveSlackWebClientOptions = resolveSlackWebClientOptions;
exports.createSlackWebClient = createSlackWebClient;
var web_api_1 = require("@slack/web-api");
exports.SLACK_DEFAULT_RETRY_OPTIONS = {
    retries: 2,
    factor: 2,
    minTimeout: 500,
    maxTimeout: 3000,
    randomize: true,
};
function resolveSlackWebClientOptions(options) {
    var _a;
    if (options === void 0) { options = {}; }
    return __assign(__assign({}, options), { retryConfig: (_a = options.retryConfig) !== null && _a !== void 0 ? _a : exports.SLACK_DEFAULT_RETRY_OPTIONS });
}
function createSlackWebClient(token, options) {
    if (options === void 0) { options = {}; }
    return new web_api_1.WebClient(token, resolveSlackWebClientOptions(options));
}
