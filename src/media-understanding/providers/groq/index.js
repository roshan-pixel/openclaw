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
exports.groqProvider = void 0;
var audio_js_1 = require("../openai/audio.js");
var DEFAULT_GROQ_AUDIO_BASE_URL = "https://api.groq.com/openai/v1";
exports.groqProvider = {
    id: "groq",
    capabilities: ["audio"],
    transcribeAudio: function (req) {
        var _a;
        return (0, audio_js_1.transcribeOpenAiCompatibleAudio)(__assign(__assign({}, req), { baseUrl: (_a = req.baseUrl) !== null && _a !== void 0 ? _a : DEFAULT_GROQ_AUDIO_BASE_URL }));
    },
};
