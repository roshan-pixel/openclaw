"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTelegramVoiceCompatible = isTelegramVoiceCompatible;
exports.resolveTelegramVoiceDecision = resolveTelegramVoiceDecision;
exports.resolveTelegramVoiceSend = resolveTelegramVoiceSend;
var audio_js_1 = require("../media/audio.js");
function isTelegramVoiceCompatible(opts) {
  return (0, audio_js_1.isVoiceCompatibleAudio)(opts);
}
function resolveTelegramVoiceDecision(opts) {
  var _a, _b;
  if (!opts.wantsVoice) {
    return { useVoice: false };
  }
  if (isTelegramVoiceCompatible(opts)) {
    return { useVoice: true };
  }
  var contentType = (_a = opts.contentType) !== null && _a !== void 0 ? _a : "unknown";
  var fileName = (_b = opts.fileName) !== null && _b !== void 0 ? _b : "unknown";
  return {
    useVoice: false,
    reason: "media is ".concat(contentType, " (").concat(fileName, ")"),
  };
}
function resolveTelegramVoiceSend(opts) {
  var decision = resolveTelegramVoiceDecision(opts);
  if (decision.reason && opts.logFallback) {
    opts.logFallback(
      "Telegram voice requested but ".concat(decision.reason, "; sending as audio file instead."),
    );
  }
  return { useVoice: decision.useVoice };
}
