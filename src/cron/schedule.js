"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeNextRunAtMs = computeNextRunAtMs;
var croner_1 = require("croner");
function computeNextRunAtMs(schedule, nowMs) {
  var _a, _b;
  if (schedule.kind === "at") {
    return schedule.atMs > nowMs ? schedule.atMs : undefined;
  }
  if (schedule.kind === "every") {
    var everyMs = Math.max(1, Math.floor(schedule.everyMs));
    var anchor = Math.max(
      0,
      Math.floor((_a = schedule.anchorMs) !== null && _a !== void 0 ? _a : nowMs),
    );
    if (nowMs < anchor) {
      return anchor;
    }
    var elapsed = nowMs - anchor;
    var steps = Math.max(1, Math.floor((elapsed + everyMs - 1) / everyMs));
    return anchor + steps * everyMs;
  }
  var expr = schedule.expr.trim();
  if (!expr) {
    return undefined;
  }
  var cron = new croner_1.Cron(expr, {
    timezone: ((_b = schedule.tz) === null || _b === void 0 ? void 0 : _b.trim()) || undefined,
    catch: false,
  });
  var next = cron.nextRun(new Date(nowMs));
  return next ? next.getTime() : undefined;
}
