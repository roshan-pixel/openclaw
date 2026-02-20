"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepgramProvider = void 0;
var audio_js_1 = require("./audio.js");
exports.deepgramProvider = {
    id: "deepgram",
    capabilities: ["audio"],
    transcribeAudio: audio_js_1.transcribeDeepgramAudio,
};
