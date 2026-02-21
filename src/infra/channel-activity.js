"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordChannelActivity = recordChannelActivity;
exports.getChannelActivity = getChannelActivity;
exports.resetChannelActivityForTest = resetChannelActivityForTest;
var activity = new Map();
function keyFor(channel, accountId) {
  return "".concat(channel, ":").concat(accountId || "default");
}
function ensureEntry(channel, accountId) {
  var key = keyFor(channel, accountId);
  var existing = activity.get(key);
  if (existing) {
    return existing;
  }
  var created = { inboundAt: null, outboundAt: null };
  activity.set(key, created);
  return created;
}
function recordChannelActivity(params) {
  var _a;
  var at = typeof params.at === "number" ? params.at : Date.now();
  var accountId =
    ((_a = params.accountId) === null || _a === void 0 ? void 0 : _a.trim()) || "default";
  var entry = ensureEntry(params.channel, accountId);
  if (params.direction === "inbound") {
    entry.inboundAt = at;
  }
  if (params.direction === "outbound") {
    entry.outboundAt = at;
  }
}
function getChannelActivity(params) {
  var _a, _b;
  var accountId =
    ((_a = params.accountId) === null || _a === void 0 ? void 0 : _a.trim()) || "default";
  return (_b = activity.get(keyFor(params.channel, accountId))) !== null && _b !== void 0
    ? _b
    : {
        inboundAt: null,
        outboundAt: null,
      };
}
function resetChannelActivityForTest() {
  activity.clear();
}
