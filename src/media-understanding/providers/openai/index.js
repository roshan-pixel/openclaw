"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openaiProvider = void 0;
var image_js_1 = require("../image.js");
var audio_js_1 = require("./audio.js");
exports.openaiProvider = {
    id: "openai",
    capabilities: ["image"],
    describeImage: image_js_1.describeImageWithModel,
    transcribeAudio: audio_js_1.transcribeOpenAiCompatibleAudio,
};
