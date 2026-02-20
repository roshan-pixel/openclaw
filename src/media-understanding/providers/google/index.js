"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleProvider = void 0;
var image_js_1 = require("../image.js");
var audio_js_1 = require("./audio.js");
var video_js_1 = require("./video.js");
exports.googleProvider = {
    id: "google",
    capabilities: ["image", "audio", "video"],
    describeImage: image_js_1.describeImageWithModel,
    transcribeAudio: audio_js_1.transcribeGeminiAudio,
    describeVideo: video_js_1.describeGeminiVideo,
};
