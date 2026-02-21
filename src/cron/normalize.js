"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeCronJobInput = normalizeCronJobInput;
exports.normalizeCronJobCreate = normalizeCronJobCreate;
exports.normalizeCronJobPatch = normalizeCronJobPatch;
var session_key_js_1 = require("../routing/session-key.js");
var parse_js_1 = require("./parse.js");
var payload_migration_js_1 = require("./payload-migration.js");
var DEFAULT_OPTIONS = {
  applyDefaults: false,
};
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function coerceSchedule(schedule) {
  var next = __assign({}, schedule);
  var kind = typeof schedule.kind === "string" ? schedule.kind : undefined;
  var atMsRaw = schedule.atMs;
  var atRaw = schedule.at;
  var parsedAtMs =
    typeof atMsRaw === "string"
      ? (0, parse_js_1.parseAbsoluteTimeMs)(atMsRaw)
      : typeof atRaw === "string"
        ? (0, parse_js_1.parseAbsoluteTimeMs)(atRaw)
        : null;
  if (!kind) {
    if (
      typeof schedule.atMs === "number" ||
      typeof schedule.at === "string" ||
      typeof schedule.atMs === "string"
    ) {
      next.kind = "at";
    } else if (typeof schedule.everyMs === "number") {
      next.kind = "every";
    } else if (typeof schedule.expr === "string") {
      next.kind = "cron";
    }
  }
  if (typeof schedule.atMs !== "number" && parsedAtMs !== null) {
    next.atMs = parsedAtMs;
  }
  if ("at" in next) {
    delete next.at;
  }
  return next;
}
function coercePayload(payload) {
  var next = __assign({}, payload);
  // Back-compat: older configs used `provider` for delivery channel.
  (0, payload_migration_js_1.migrateLegacyCronPayload)(next);
  return next;
}
function unwrapJob(raw) {
  if (isRecord(raw.data)) {
    return raw.data;
  }
  if (isRecord(raw.job)) {
    return raw.job;
  }
  return raw;
}
function normalizeCronJobInput(raw, options) {
  if (options === void 0) {
    options = DEFAULT_OPTIONS;
  }
  if (!isRecord(raw)) {
    return null;
  }
  var base = unwrapJob(raw);
  var next = __assign({}, base);
  if ("agentId" in base) {
    var agentId = base.agentId;
    if (agentId === null) {
      next.agentId = null;
    } else if (typeof agentId === "string") {
      var trimmed = agentId.trim();
      if (trimmed) {
        next.agentId = (0, session_key_js_1.sanitizeAgentId)(trimmed);
      } else {
        delete next.agentId;
      }
    }
  }
  if ("enabled" in base) {
    var enabled = base.enabled;
    if (typeof enabled === "boolean") {
      next.enabled = enabled;
    } else if (typeof enabled === "string") {
      var trimmed = enabled.trim().toLowerCase();
      if (trimmed === "true") {
        next.enabled = true;
      }
      if (trimmed === "false") {
        next.enabled = false;
      }
    }
  }
  if (isRecord(base.schedule)) {
    next.schedule = coerceSchedule(base.schedule);
  }
  if (isRecord(base.payload)) {
    next.payload = coercePayload(base.payload);
  }
  if (options.applyDefaults) {
    if (!next.wakeMode) {
      next.wakeMode = "next-heartbeat";
    }
    if (!next.sessionTarget && isRecord(next.payload)) {
      var kind = typeof next.payload.kind === "string" ? next.payload.kind : "";
      if (kind === "systemEvent") {
        next.sessionTarget = "main";
      }
      if (kind === "agentTurn") {
        next.sessionTarget = "isolated";
      }
    }
  }
  return next;
}
function normalizeCronJobCreate(raw, options) {
  return normalizeCronJobInput(raw, __assign({ applyDefaults: true }, options));
}
function normalizeCronJobPatch(raw, options) {
  return normalizeCronJobInput(raw, __assign({ applyDefaults: false }, options));
}
