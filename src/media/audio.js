"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVoiceCompatibleAudio = isVoiceCompatibleAudio;
var mime_js_1 = require("./mime.js");
var VOICE_AUDIO_EXTENSIONS = new Set([".oga", ".ogg", ".opus"]);
function isVoiceCompatibleAudio(opts) {
  var _a, _b;
  var mime = (_a = opts.contentType) === null || _a === void 0 ? void 0 : _a.toLowerCase();
  if (mime && (mime.includes("ogg") || mime.includes("opus"))) {
    return true;
  }
  var fileName = (_b = opts.fileName) === null || _b === void 0 ? void 0 : _b.trim();
  if (!fileName) {
    return false;
  }
  var ext = (0, mime_js_1.getFileExtension)(fileName);
  if (!ext) {
    return false;
  }
  return VOICE_AUDIO_EXTENSIONS.has(ext);
}
