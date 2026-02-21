"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackBackgroundTask = trackBackgroundTask;
exports.updateLastRouteInBackground = updateLastRouteInBackground;
exports.awaitBackgroundTasks = awaitBackgroundTasks;
var sessions_js_1 = require("../../../config/sessions.js");
var session_js_1 = require("../../session.js");
function trackBackgroundTask(backgroundTasks, task) {
  backgroundTasks.add(task);
  void task.finally(function () {
    backgroundTasks.delete(task);
  });
}
function updateLastRouteInBackground(params) {
  var _a;
  var storePath = (0, sessions_js_1.resolveStorePath)(
    (_a = params.cfg.session) === null || _a === void 0 ? void 0 : _a.store,
    {
      agentId: params.storeAgentId,
    },
  );
  var task = (0, sessions_js_1.updateLastRoute)({
    storePath: storePath,
    sessionKey: params.sessionKey,
    deliveryContext: {
      channel: params.channel,
      to: params.to,
      accountId: params.accountId,
    },
    ctx: params.ctx,
  }).catch(function (err) {
    params.warn(
      {
        error: (0, session_js_1.formatError)(err),
        storePath: storePath,
        sessionKey: params.sessionKey,
        to: params.to,
      },
      "failed updating last route",
    );
  });
  trackBackgroundTask(params.backgroundTasks, task);
}
function awaitBackgroundTasks(backgroundTasks) {
  if (backgroundTasks.size === 0) {
    return Promise.resolve();
  }
  return Promise.allSettled(backgroundTasks).then(function () {
    backgroundTasks.clear();
  });
}
