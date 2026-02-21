"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maybeHandleQueueDirective = maybeHandleQueueDirective;
var directive_handling_shared_js_1 = require("./directive-handling.shared.js");
var queue_js_1 = require("./queue.js");
function maybeHandleQueueDirective(params) {
  var _a, _b, _c, _d, _e;
  var directives = params.directives;
  if (!directives.hasQueueDirective) {
    return undefined;
  }
  var wantsStatus =
    !directives.queueMode &&
    !directives.queueReset &&
    !directives.hasQueueOptions &&
    directives.rawQueueMode === undefined &&
    directives.rawDebounce === undefined &&
    directives.rawCap === undefined &&
    directives.rawDrop === undefined;
  if (wantsStatus) {
    var settings = (0, queue_js_1.resolveQueueSettings)({
      cfg: params.cfg,
      channel: params.channel,
      sessionEntry: params.sessionEntry,
    });
    var debounceLabel =
      typeof settings.debounceMs === "number" ? "".concat(settings.debounceMs, "ms") : "default";
    var capLabel = typeof settings.cap === "number" ? String(settings.cap) : "default";
    var dropLabel = (_a = settings.dropPolicy) !== null && _a !== void 0 ? _a : "default";
    return {
      text: (0, directive_handling_shared_js_1.withOptions)(
        "Current queue settings: mode="
          .concat(settings.mode, ", debounce=")
          .concat(debounceLabel, ", cap=")
          .concat(capLabel, ", drop=")
          .concat(dropLabel, "."),
        "modes steer, followup, collect, steer+backlog, interrupt; debounce:<ms|s|m>, cap:<n>, drop:old|new|summarize",
      ),
    };
  }
  var queueModeInvalid =
    !directives.queueMode && !directives.queueReset && Boolean(directives.rawQueueMode);
  var queueDebounceInvalid =
    directives.rawDebounce !== undefined && typeof directives.debounceMs !== "number";
  var queueCapInvalid = directives.rawCap !== undefined && typeof directives.cap !== "number";
  var queueDropInvalid = directives.rawDrop !== undefined && !directives.dropPolicy;
  if (queueModeInvalid || queueDebounceInvalid || queueCapInvalid || queueDropInvalid) {
    var errors = [];
    if (queueModeInvalid) {
      errors.push(
        'Unrecognized queue mode "'.concat(
          (_b = directives.rawQueueMode) !== null && _b !== void 0 ? _b : "",
          '". Valid modes: steer, followup, collect, steer+backlog, interrupt.',
        ),
      );
    }
    if (queueDebounceInvalid) {
      errors.push(
        'Invalid debounce "'.concat(
          (_c = directives.rawDebounce) !== null && _c !== void 0 ? _c : "",
          '". Use ms/s/m (e.g. debounce:1500ms, debounce:2s).',
        ),
      );
    }
    if (queueCapInvalid) {
      errors.push(
        'Invalid cap "'.concat(
          (_d = directives.rawCap) !== null && _d !== void 0 ? _d : "",
          '". Use a positive integer (e.g. cap:10).',
        ),
      );
    }
    if (queueDropInvalid) {
      errors.push(
        'Invalid drop policy "'.concat(
          (_e = directives.rawDrop) !== null && _e !== void 0 ? _e : "",
          '". Use drop:old, drop:new, or drop:summarize.',
        ),
      );
    }
    return { text: errors.join(" ") };
  }
  return undefined;
}
