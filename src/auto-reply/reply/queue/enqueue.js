"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enqueueFollowupRun = enqueueFollowupRun;
exports.getFollowupQueueDepth = getFollowupQueueDepth;
var queue_helpers_js_1 = require("../../../utils/queue-helpers.js");
var state_js_1 = require("./state.js");
function isRunAlreadyQueued(run, items, allowPromptFallback) {
  var _a;
  if (allowPromptFallback === void 0) {
    allowPromptFallback = false;
  }
  var hasSameRouting = function (item) {
    return (
      item.originatingChannel === run.originatingChannel &&
      item.originatingTo === run.originatingTo &&
      item.originatingAccountId === run.originatingAccountId &&
      item.originatingThreadId === run.originatingThreadId
    );
  };
  var messageId = (_a = run.messageId) === null || _a === void 0 ? void 0 : _a.trim();
  if (messageId) {
    return items.some(function (item) {
      var _a;
      return (
        ((_a = item.messageId) === null || _a === void 0 ? void 0 : _a.trim()) === messageId &&
        hasSameRouting(item)
      );
    });
  }
  if (!allowPromptFallback) {
    return false;
  }
  return items.some(function (item) {
    return item.prompt === run.prompt && hasSameRouting(item);
  });
}
function enqueueFollowupRun(key, run, settings, dedupeMode) {
  if (dedupeMode === void 0) {
    dedupeMode = "message-id";
  }
  var queue = (0, state_js_1.getFollowupQueue)(key, settings);
  var dedupe =
    dedupeMode === "none"
      ? undefined
      : function (item, items) {
          return isRunAlreadyQueued(item, items, dedupeMode === "prompt");
        };
  // Deduplicate: skip if the same message is already queued.
  if (
    (0, queue_helpers_js_1.shouldSkipQueueItem)({ item: run, items: queue.items, dedupe: dedupe })
  ) {
    return false;
  }
  queue.lastEnqueuedAt = Date.now();
  queue.lastRun = run.run;
  var shouldEnqueue = (0, queue_helpers_js_1.applyQueueDropPolicy)({
    queue: queue,
    summarize: function (item) {
      var _a;
      return (
        ((_a = item.summaryLine) === null || _a === void 0 ? void 0 : _a.trim()) ||
        item.prompt.trim()
      );
    },
  });
  if (!shouldEnqueue) {
    return false;
  }
  queue.items.push(run);
  return true;
}
function getFollowupQueueDepth(key) {
  var cleaned = key.trim();
  if (!cleaned) {
    return 0;
  }
  var queue = state_js_1.FOLLOWUP_QUEUES.get(cleaned);
  if (!queue) {
    return 0;
  }
  return queue.items.length;
}
