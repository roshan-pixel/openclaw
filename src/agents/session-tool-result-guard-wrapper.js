"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guardSessionManager = guardSessionManager;
var hook_runner_global_js_1 = require("../plugins/hook-runner-global.js");
var session_tool_result_guard_js_1 = require("./session-tool-result-guard.js");
/**
 * Apply the tool-result guard to a SessionManager exactly once and expose
 * a flush method on the instance for easy teardown handling.
 */
function guardSessionManager(sessionManager, opts) {
  if (typeof sessionManager.flushPendingToolResults === "function") {
    return sessionManager;
  }
  var hookRunner = (0, hook_runner_global_js_1.getGlobalHookRunner)();
  var transform = (
    hookRunner === null || hookRunner === void 0
      ? void 0
      : hookRunner.hasHooks("tool_result_persist")
  )
    ? function (message, meta) {
        var _a;
        var out = hookRunner.runToolResultPersist(
          {
            toolName: meta.toolName,
            toolCallId: meta.toolCallId,
            message: message,
            isSynthetic: meta.isSynthetic,
          },
          {
            agentId: opts === null || opts === void 0 ? void 0 : opts.agentId,
            sessionKey: opts === null || opts === void 0 ? void 0 : opts.sessionKey,
            toolName: meta.toolName,
            toolCallId: meta.toolCallId,
          },
        );
        return (_a = out === null || out === void 0 ? void 0 : out.message) !== null &&
          _a !== void 0
          ? _a
          : message;
      }
    : undefined;
  var guard = (0, session_tool_result_guard_js_1.installSessionToolResultGuard)(sessionManager, {
    transformToolResultForPersistence: transform,
    allowSyntheticToolResults:
      opts === null || opts === void 0 ? void 0 : opts.allowSyntheticToolResults,
  });
  sessionManager.flushPendingToolResults = guard.flushPendingToolResults;
  return sessionManager;
}
