"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerActiveProgressLine = registerActiveProgressLine;
exports.clearActiveProgressLine = clearActiveProgressLine;
exports.unregisterActiveProgressLine = unregisterActiveProgressLine;
var activeStream = null;
function registerActiveProgressLine(stream) {
  if (!stream.isTTY) {
    return;
  }
  activeStream = stream;
}
function clearActiveProgressLine() {
  if (!(activeStream === null || activeStream === void 0 ? void 0 : activeStream.isTTY)) {
    return;
  }
  activeStream.write("\r\x1b[2K");
}
function unregisterActiveProgressLine(stream) {
  if (!activeStream) {
    return;
  }
  if (stream && activeStream !== stream) {
    return;
  }
  activeStream = null;
}
