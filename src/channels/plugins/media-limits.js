"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveChannelMediaMaxBytes = resolveChannelMediaMaxBytes;
var session_key_js_1 = require("../../routing/session-key.js");
var MB = 1024 * 1024;
function resolveChannelMediaMaxBytes(params) {
  var _a, _b;
  var accountId = (0, session_key_js_1.normalizeAccountId)(params.accountId);
  var channelLimit = params.resolveChannelLimitMb({
    cfg: params.cfg,
    accountId: accountId,
  });
  if (channelLimit) {
    return channelLimit * MB;
  }
  if (
    (_b = (_a = params.cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null ||
    _b === void 0
      ? void 0
      : _b.mediaMaxMb
  ) {
    return params.cfg.agents.defaults.mediaMaxMb * MB;
  }
  return undefined;
}
