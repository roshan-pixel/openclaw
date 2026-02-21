"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReplyReferencePlanner = createReplyReferencePlanner;
function createReplyReferencePlanner(options) {
  var _a, _b, _c;
  var hasReplied = (_a = options.hasReplied) !== null && _a !== void 0 ? _a : false;
  var allowReference = options.allowReference !== false;
  var existingId = (_b = options.existingId) === null || _b === void 0 ? void 0 : _b.trim();
  var startId = (_c = options.startId) === null || _c === void 0 ? void 0 : _c.trim();
  var use = function () {
    if (!allowReference) {
      return undefined;
    }
    if (existingId) {
      hasReplied = true;
      return existingId;
    }
    if (!startId) {
      return undefined;
    }
    if (options.replyToMode === "off") {
      return undefined;
    }
    if (options.replyToMode === "all") {
      hasReplied = true;
      return startId;
    }
    if (!hasReplied) {
      hasReplied = true;
      return startId;
    }
    return undefined;
  };
  var markSent = function () {
    hasReplied = true;
  };
  return {
    use: use,
    markSent: markSent,
    hasReplied: function () {
      return hasReplied;
    },
  };
}
