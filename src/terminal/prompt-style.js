"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stylePromptHint = exports.stylePromptTitle = exports.stylePromptMessage = void 0;
var theme_js_1 = require("./theme.js");
var stylePromptMessage = function (message) {
    return (0, theme_js_1.isRich)() ? theme_js_1.theme.accent(message) : message;
};
exports.stylePromptMessage = stylePromptMessage;
var stylePromptTitle = function (title) {
    return title && (0, theme_js_1.isRich)() ? theme_js_1.theme.heading(title) : title;
};
exports.stylePromptTitle = stylePromptTitle;
var stylePromptHint = function (hint) {
    return hint && (0, theme_js_1.isRich)() ? theme_js_1.theme.muted(hint) : hint;
};
exports.stylePromptHint = stylePromptHint;
