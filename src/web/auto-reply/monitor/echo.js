"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEchoTracker = createEchoTracker;
function createEchoTracker(params) {
  var _a;
  var recentlySent = new Set();
  var maxItems = Math.max(1, (_a = params.maxItems) !== null && _a !== void 0 ? _a : 100);
  var buildCombinedKey = function (p) {
    return "combined:".concat(p.sessionKey, ":").concat(p.combinedBody);
  };
  var trim = function () {
    while (recentlySent.size > maxItems) {
      var firstKey = recentlySent.values().next().value;
      if (!firstKey) {
        break;
      }
      recentlySent.delete(firstKey);
    }
  };
  var rememberText = function (text, opts) {
    var _a;
    if (!text) {
      return;
    }
    recentlySent.add(text);
    if (opts.combinedBody && opts.combinedBodySessionKey) {
      recentlySent.add(
        buildCombinedKey({
          sessionKey: opts.combinedBodySessionKey,
          combinedBody: opts.combinedBody,
        }),
      );
    }
    if (opts.logVerboseMessage) {
      (_a = params.logVerbose) === null || _a === void 0
        ? void 0
        : _a.call(
            params,
            "Added to echo detection set (size now: "
              .concat(recentlySent.size, "): ")
              .concat(text.substring(0, 50), "..."),
          );
    }
    trim();
  };
  return {
    rememberText: rememberText,
    has: function (key) {
      return recentlySent.has(key);
    },
    forget: function (key) {
      recentlySent.delete(key);
    },
    buildCombinedKey: buildCombinedKey,
  };
}
