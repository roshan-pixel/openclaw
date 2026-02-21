"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.elideQueueText = elideQueueText;
exports.buildQueueSummaryLine = buildQueueSummaryLine;
exports.shouldSkipQueueItem = shouldSkipQueueItem;
exports.applyQueueDropPolicy = applyQueueDropPolicy;
exports.waitForQueueDebounce = waitForQueueDebounce;
exports.buildQueueSummaryPrompt = buildQueueSummaryPrompt;
exports.buildCollectPrompt = buildCollectPrompt;
exports.hasCrossChannelItems = hasCrossChannelItems;
function elideQueueText(text, limit) {
  if (limit === void 0) {
    limit = 140;
  }
  if (text.length <= limit) {
    return text;
  }
  return "".concat(text.slice(0, Math.max(0, limit - 1)).trimEnd(), "\u2026");
}
function buildQueueSummaryLine(text, limit) {
  if (limit === void 0) {
    limit = 160;
  }
  var cleaned = text.replace(/\s+/g, " ").trim();
  return elideQueueText(cleaned, limit);
}
function shouldSkipQueueItem(params) {
  if (!params.dedupe) {
    return false;
  }
  return params.dedupe(params.item, params.items);
}
function applyQueueDropPolicy(params) {
  var _a;
  var cap = params.queue.cap;
  if (cap <= 0 || params.queue.items.length < cap) {
    return true;
  }
  if (params.queue.dropPolicy === "new") {
    return false;
  }
  var dropCount = params.queue.items.length - cap + 1;
  var dropped = params.queue.items.splice(0, dropCount);
  if (params.queue.dropPolicy === "summarize") {
    for (var _i = 0, dropped_1 = dropped; _i < dropped_1.length; _i++) {
      var item = dropped_1[_i];
      params.queue.droppedCount += 1;
      params.queue.summaryLines.push(buildQueueSummaryLine(params.summarize(item)));
    }
    var limit = Math.max(0, (_a = params.summaryLimit) !== null && _a !== void 0 ? _a : cap);
    while (params.queue.summaryLines.length > limit) {
      params.queue.summaryLines.shift();
    }
  }
  return true;
}
function waitForQueueDebounce(queue) {
  var debounceMs = Math.max(0, queue.debounceMs);
  if (debounceMs <= 0) {
    return Promise.resolve();
  }
  return new Promise(function (resolve) {
    var check = function () {
      var since = Date.now() - queue.lastEnqueuedAt;
      if (since >= debounceMs) {
        resolve();
        return;
      }
      setTimeout(check, debounceMs - since);
    };
    check();
  });
}
function buildQueueSummaryPrompt(params) {
  var _a;
  if (params.state.dropPolicy !== "summarize" || params.state.droppedCount <= 0) {
    return undefined;
  }
  var noun = params.noun;
  var title =
    (_a = params.title) !== null && _a !== void 0
      ? _a
      : "[Queue overflow] Dropped "
          .concat(params.state.droppedCount, " ")
          .concat(noun)
          .concat(params.state.droppedCount === 1 ? "" : "s", " due to cap.");
  var lines = [title];
  if (params.state.summaryLines.length > 0) {
    lines.push("Summary:");
    for (var _i = 0, _b = params.state.summaryLines; _i < _b.length; _i++) {
      var line = _b[_i];
      lines.push("- ".concat(line));
    }
  }
  params.state.droppedCount = 0;
  params.state.summaryLines = [];
  return lines.join("\n");
}
function buildCollectPrompt(params) {
  var blocks = [params.title];
  if (params.summary) {
    blocks.push(params.summary);
  }
  params.items.forEach(function (item, idx) {
    blocks.push(params.renderItem(item, idx));
  });
  return blocks.join("\n\n");
}
function hasCrossChannelItems(items, resolveKey) {
  var keys = new Set();
  var hasUnkeyed = false;
  for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
    var item = items_1[_i];
    var resolved = resolveKey(item);
    if (resolved.cross) {
      return true;
    }
    if (!resolved.key) {
      hasUnkeyed = true;
      continue;
    }
    keys.add(resolved.key);
  }
  if (keys.size === 0) {
    return false;
  }
  if (hasUnkeyed) {
    return true;
  }
  return keys.size > 1;
}
