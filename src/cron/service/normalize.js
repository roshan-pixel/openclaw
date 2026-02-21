"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeRequiredName = normalizeRequiredName;
exports.normalizeOptionalText = normalizeOptionalText;
exports.normalizeOptionalAgentId = normalizeOptionalAgentId;
exports.inferLegacyName = inferLegacyName;
exports.normalizePayloadToSystemText = normalizePayloadToSystemText;
var session_key_js_1 = require("../../routing/session-key.js");
var utils_js_1 = require("../../utils.js");
function normalizeRequiredName(raw) {
  if (typeof raw !== "string") {
    throw new Error("cron job name is required");
  }
  var name = raw.trim();
  if (!name) {
    throw new Error("cron job name is required");
  }
  return name;
}
function normalizeOptionalText(raw) {
  if (typeof raw !== "string") {
    return undefined;
  }
  var trimmed = raw.trim();
  return trimmed ? trimmed : undefined;
}
function truncateText(input, maxLen) {
  if (input.length <= maxLen) {
    return input;
  }
  return "".concat(
    (0, utils_js_1.truncateUtf16Safe)(input, Math.max(0, maxLen - 1)).trimEnd(),
    "\u2026",
  );
}
function normalizeOptionalAgentId(raw) {
  if (typeof raw !== "string") {
    return undefined;
  }
  var trimmed = raw.trim();
  if (!trimmed) {
    return undefined;
  }
  return (0, session_key_js_1.normalizeAgentId)(trimmed);
}
function inferLegacyName(job) {
  var _a, _b, _c, _d, _e, _f;
  var text =
    ((_a = job === null || job === void 0 ? void 0 : job.payload) === null || _a === void 0
      ? void 0
      : _a.kind) === "systemEvent" && typeof job.payload.text === "string"
      ? job.payload.text
      : ((_b = job === null || job === void 0 ? void 0 : job.payload) === null || _b === void 0
            ? void 0
            : _b.kind) === "agentTurn" && typeof job.payload.message === "string"
        ? job.payload.message
        : "";
  var firstLine =
    (_c = text
      .split("\n")
      .map(function (l) {
        return l.trim();
      })
      .find(Boolean)) !== null && _c !== void 0
      ? _c
      : "";
  if (firstLine) {
    return truncateText(firstLine, 60);
  }
  var kind =
    typeof ((_d = job === null || job === void 0 ? void 0 : job.schedule) === null || _d === void 0
      ? void 0
      : _d.kind) === "string"
      ? job.schedule.kind
      : "";
  if (
    kind === "cron" &&
    typeof ((_e = job === null || job === void 0 ? void 0 : job.schedule) === null || _e === void 0
      ? void 0
      : _e.expr) === "string"
  ) {
    return "Cron: ".concat(truncateText(job.schedule.expr, 52));
  }
  if (
    kind === "every" &&
    typeof ((_f = job === null || job === void 0 ? void 0 : job.schedule) === null || _f === void 0
      ? void 0
      : _f.everyMs) === "number"
  ) {
    return "Every: ".concat(job.schedule.everyMs, "ms");
  }
  if (kind === "at") {
    return "One-shot";
  }
  return "Cron job";
}
function normalizePayloadToSystemText(payload) {
  if (payload.kind === "systemEvent") {
    return payload.text.trim();
  }
  return payload.message.trim();
}
