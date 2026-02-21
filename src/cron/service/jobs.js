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
exports.assertSupportedJobSpec = assertSupportedJobSpec;
exports.findJobOrThrow = findJobOrThrow;
exports.computeJobNextRunAtMs = computeJobNextRunAtMs;
exports.recomputeNextRuns = recomputeNextRuns;
exports.nextWakeAtMs = nextWakeAtMs;
exports.createJob = createJob;
exports.applyJobPatch = applyJobPatch;
exports.isJobDue = isJobDue;
exports.resolveJobPayloadTextForMain = resolveJobPayloadTextForMain;
var node_crypto_1 = require("node:crypto");
var schedule_js_1 = require("../schedule.js");
var normalize_js_1 = require("./normalize.js");
var STUCK_RUN_MS = 2 * 60 * 60 * 1000;
function assertSupportedJobSpec(job) {
  if (job.sessionTarget === "main" && job.payload.kind !== "systemEvent") {
    throw new Error('main cron jobs require payload.kind="systemEvent"');
  }
  if (job.sessionTarget === "isolated" && job.payload.kind !== "agentTurn") {
    throw new Error('isolated cron jobs require payload.kind="agentTurn"');
  }
}
function findJobOrThrow(state, id) {
  var _a;
  var job =
    (_a = state.store) === null || _a === void 0
      ? void 0
      : _a.jobs.find(function (j) {
          return j.id === id;
        });
  if (!job) {
    throw new Error("unknown cron job id: ".concat(id));
  }
  return job;
}
function computeJobNextRunAtMs(job, nowMs) {
  if (!job.enabled) {
    return undefined;
  }
  if (job.schedule.kind === "at") {
    // One-shot jobs stay due until they successfully finish.
    if (job.state.lastStatus === "ok" && job.state.lastRunAtMs) {
      return undefined;
    }
    return job.schedule.atMs;
  }
  return (0, schedule_js_1.computeNextRunAtMs)(job.schedule, nowMs);
}
function recomputeNextRuns(state) {
  if (!state.store) {
    return;
  }
  var now = state.deps.nowMs();
  for (var _i = 0, _a = state.store.jobs; _i < _a.length; _i++) {
    var job = _a[_i];
    if (!job.state) {
      job.state = {};
    }
    if (!job.enabled) {
      job.state.nextRunAtMs = undefined;
      job.state.runningAtMs = undefined;
      continue;
    }
    var runningAt = job.state.runningAtMs;
    if (typeof runningAt === "number" && now - runningAt > STUCK_RUN_MS) {
      state.deps.log.warn(
        { jobId: job.id, runningAtMs: runningAt },
        "cron: clearing stuck running marker",
      );
      job.state.runningAtMs = undefined;
    }
    job.state.nextRunAtMs = computeJobNextRunAtMs(job, now);
  }
}
function nextWakeAtMs(state) {
  var _a, _b;
  var jobs =
    (_b = (_a = state.store) === null || _a === void 0 ? void 0 : _a.jobs) !== null && _b !== void 0
      ? _b
      : [];
  var enabled = jobs.filter(function (j) {
    return j.enabled && typeof j.state.nextRunAtMs === "number";
  });
  if (enabled.length === 0) {
    return undefined;
  }
  return enabled.reduce(function (min, j) {
    return Math.min(min, j.state.nextRunAtMs);
  }, enabled[0].state.nextRunAtMs);
}
function createJob(state, input) {
  var now = state.deps.nowMs();
  var id = node_crypto_1.default.randomUUID();
  var job = {
    id: id,
    agentId: (0, normalize_js_1.normalizeOptionalAgentId)(input.agentId),
    name: (0, normalize_js_1.normalizeRequiredName)(input.name),
    description: (0, normalize_js_1.normalizeOptionalText)(input.description),
    enabled: input.enabled !== false,
    deleteAfterRun: input.deleteAfterRun,
    createdAtMs: now,
    updatedAtMs: now,
    schedule: input.schedule,
    sessionTarget: input.sessionTarget,
    wakeMode: input.wakeMode,
    payload: input.payload,
    isolation: input.isolation,
    state: __assign({}, input.state),
  };
  assertSupportedJobSpec(job);
  job.state.nextRunAtMs = computeJobNextRunAtMs(job, now);
  return job;
}
function applyJobPatch(job, patch) {
  if ("name" in patch) {
    job.name = (0, normalize_js_1.normalizeRequiredName)(patch.name);
  }
  if ("description" in patch) {
    job.description = (0, normalize_js_1.normalizeOptionalText)(patch.description);
  }
  if (typeof patch.enabled === "boolean") {
    job.enabled = patch.enabled;
  }
  if (typeof patch.deleteAfterRun === "boolean") {
    job.deleteAfterRun = patch.deleteAfterRun;
  }
  if (patch.schedule) {
    job.schedule = patch.schedule;
  }
  if (patch.sessionTarget) {
    job.sessionTarget = patch.sessionTarget;
  }
  if (patch.wakeMode) {
    job.wakeMode = patch.wakeMode;
  }
  if (patch.payload) {
    job.payload = mergeCronPayload(job.payload, patch.payload);
  }
  if (patch.isolation) {
    job.isolation = patch.isolation;
  }
  if (patch.state) {
    job.state = __assign(__assign({}, job.state), patch.state);
  }
  if ("agentId" in patch) {
    job.agentId = (0, normalize_js_1.normalizeOptionalAgentId)(patch.agentId);
  }
  assertSupportedJobSpec(job);
}
function mergeCronPayload(existing, patch) {
  if (patch.kind !== existing.kind) {
    return buildPayloadFromPatch(patch);
  }
  if (patch.kind === "systemEvent") {
    if (existing.kind !== "systemEvent") {
      return buildPayloadFromPatch(patch);
    }
    var text = typeof patch.text === "string" ? patch.text : existing.text;
    return { kind: "systemEvent", text: text };
  }
  if (existing.kind !== "agentTurn") {
    return buildPayloadFromPatch(patch);
  }
  var next = __assign({}, existing);
  if (typeof patch.message === "string") {
    next.message = patch.message;
  }
  if (typeof patch.model === "string") {
    next.model = patch.model;
  }
  if (typeof patch.thinking === "string") {
    next.thinking = patch.thinking;
  }
  if (typeof patch.timeoutSeconds === "number") {
    next.timeoutSeconds = patch.timeoutSeconds;
  }
  if (typeof patch.deliver === "boolean") {
    next.deliver = patch.deliver;
  }
  if (typeof patch.channel === "string") {
    next.channel = patch.channel;
  }
  if (typeof patch.to === "string") {
    next.to = patch.to;
  }
  if (typeof patch.bestEffortDeliver === "boolean") {
    next.bestEffortDeliver = patch.bestEffortDeliver;
  }
  return next;
}
function buildPayloadFromPatch(patch) {
  if (patch.kind === "systemEvent") {
    if (typeof patch.text !== "string" || patch.text.length === 0) {
      throw new Error('cron.update payload.kind="systemEvent" requires text');
    }
    return { kind: "systemEvent", text: patch.text };
  }
  if (typeof patch.message !== "string" || patch.message.length === 0) {
    throw new Error('cron.update payload.kind="agentTurn" requires message');
  }
  return {
    kind: "agentTurn",
    message: patch.message,
    model: patch.model,
    thinking: patch.thinking,
    timeoutSeconds: patch.timeoutSeconds,
    deliver: patch.deliver,
    channel: patch.channel,
    to: patch.to,
    bestEffortDeliver: patch.bestEffortDeliver,
  };
}
function isJobDue(job, nowMs, opts) {
  if (opts.forced) {
    return true;
  }
  return job.enabled && typeof job.state.nextRunAtMs === "number" && nowMs >= job.state.nextRunAtMs;
}
function resolveJobPayloadTextForMain(job) {
  if (job.payload.kind !== "systemEvent") {
    return undefined;
  }
  var text = (0, normalize_js_1.normalizePayloadToSystemText)(job.payload);
  return text.trim() ? text : undefined;
}
