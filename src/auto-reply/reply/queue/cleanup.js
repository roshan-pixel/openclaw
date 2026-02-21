"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearSessionQueues = clearSessionQueues;
var pi_embedded_js_1 = require("../../../agents/pi-embedded.js");
var command_queue_js_1 = require("../../../process/command-queue.js");
var state_js_1 = require("./state.js");
function clearSessionQueues(keys) {
  var seen = new Set();
  var followupCleared = 0;
  var laneCleared = 0;
  var clearedKeys = [];
  for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
    var key = keys_1[_i];
    var cleaned = key === null || key === void 0 ? void 0 : key.trim();
    if (!cleaned || seen.has(cleaned)) {
      continue;
    }
    seen.add(cleaned);
    clearedKeys.push(cleaned);
    followupCleared += (0, state_js_1.clearFollowupQueue)(cleaned);
    laneCleared += (0, command_queue_js_1.clearCommandLane)(
      (0, pi_embedded_js_1.resolveEmbeddedSessionLane)(cleaned),
    );
  }
  return { followupCleared: followupCleared, laneCleared: laneCleared, keys: clearedKeys };
}
