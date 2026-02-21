"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTimeoutMs = void 0;
exports.parseEnvPairs = parseEnvPairs;
var parse_timeout_js_1 = require("./parse-timeout.js");
Object.defineProperty(exports, "parseTimeoutMs", {
  enumerable: true,
  get: function () {
    return parse_timeout_js_1.parseTimeoutMs;
  },
});
function parseEnvPairs(pairs) {
  if (!Array.isArray(pairs) || pairs.length === 0) {
    return undefined;
  }
  var env = {};
  for (var _i = 0, pairs_1 = pairs; _i < pairs_1.length; _i++) {
    var pair = pairs_1[_i];
    if (typeof pair !== "string") {
      continue;
    }
    var idx = pair.indexOf("=");
    if (idx <= 0) {
      continue;
    }
    var key = pair.slice(0, idx).trim();
    if (!key) {
      continue;
    }
    env[key] = pair.slice(idx + 1);
  }
  return Object.keys(env).length > 0 ? env : undefined;
}
