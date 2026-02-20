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
exports.stringEnum = stringEnum;
exports.optionalStringEnum = optionalStringEnum;
exports.channelTargetSchema = channelTargetSchema;
exports.channelTargetsSchema = channelTargetsSchema;
var typebox_1 = require("@sinclair/typebox");
var channel_target_js_1 = require("../../infra/outbound/channel-target.js");
// NOTE: Avoid Type.Union([Type.Literal(...)]) which compiles to anyOf.
// Some providers reject anyOf in tool schemas; a flat string enum is safer.
function stringEnum(values, options) {
    if (options === void 0) { options = {}; }
    return typebox_1.Type.Unsafe(__assign({ type: "string", enum: __spreadArray([], values, true) }, options));
}
function optionalStringEnum(values, options) {
    if (options === void 0) { options = {}; }
    return typebox_1.Type.Optional(stringEnum(values, options));
}
function channelTargetSchema(options) {
    var _a;
    return typebox_1.Type.String({
        description: (_a = options === null || options === void 0 ? void 0 : options.description) !== null && _a !== void 0 ? _a : channel_target_js_1.CHANNEL_TARGET_DESCRIPTION,
    });
}
function channelTargetsSchema(options) {
    var _a;
    return typebox_1.Type.Array(channelTargetSchema({ description: (_a = options === null || options === void 0 ? void 0 : options.description) !== null && _a !== void 0 ? _a : channel_target_js_1.CHANNEL_TARGETS_DESCRIPTION }));
}
