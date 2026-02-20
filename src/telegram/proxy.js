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
exports.makeProxyFetch = makeProxyFetch;
// @ts-nocheck
var undici_1 = require("undici");
var fetch_js_1 = require("../infra/fetch.js");
function makeProxyFetch(proxyUrl) {
    var agent = new undici_1.ProxyAgent(proxyUrl);
    return (0, fetch_js_1.wrapFetchWithAbortSignal)(function (input, init) {
        var base = init ? __assign({}, init) : {};
        return (0, undici_1.fetch)(input, __assign(__assign({}, base), { dispatcher: agent }));
    });
}
