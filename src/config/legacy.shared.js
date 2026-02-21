"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAgentEntry =
  exports.resolveDefaultAgentIdFromRaw =
  exports.getAgentsList =
  exports.mapLegacyAudioTranscription =
  exports.mergeMissing =
  exports.ensureRecord =
  exports.getRecord =
  exports.isRecord =
    void 0;
var isRecord = function (value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
};
exports.isRecord = isRecord;
var getRecord = function (value) {
  return (0, exports.isRecord)(value) ? value : null;
};
exports.getRecord = getRecord;
var ensureRecord = function (root, key) {
  var existing = root[key];
  if ((0, exports.isRecord)(existing)) {
    return existing;
  }
  var next = {};
  root[key] = next;
  return next;
};
exports.ensureRecord = ensureRecord;
var mergeMissing = function (target, source) {
  for (var _i = 0, _a = Object.entries(source); _i < _a.length; _i++) {
    var _b = _a[_i],
      key = _b[0],
      value = _b[1];
    if (value === undefined) {
      continue;
    }
    var existing = target[key];
    if (existing === undefined) {
      target[key] = value;
      continue;
    }
    if ((0, exports.isRecord)(existing) && (0, exports.isRecord)(value)) {
      (0, exports.mergeMissing)(existing, value);
    }
  }
};
exports.mergeMissing = mergeMissing;
var AUDIO_TRANSCRIPTION_CLI_ALLOWLIST = new Set(["whisper"]);
var mapLegacyAudioTranscription = function (value) {
  var _a, _b;
  var transcriber = (0, exports.getRecord)(value);
  var command = Array.isArray(
    transcriber === null || transcriber === void 0 ? void 0 : transcriber.command,
  )
    ? transcriber === null || transcriber === void 0
      ? void 0
      : transcriber.command
    : null;
  if (!command || command.length === 0) {
    return null;
  }
  var rawExecutable = String((_a = command[0]) !== null && _a !== void 0 ? _a : "").trim();
  if (!rawExecutable) {
    return null;
  }
  var executableName =
    (_b = rawExecutable.split(/[\\/]/).pop()) !== null && _b !== void 0 ? _b : rawExecutable;
  if (!AUDIO_TRANSCRIPTION_CLI_ALLOWLIST.has(executableName)) {
    return null;
  }
  var args = command.slice(1).map(function (part) {
    return String(part);
  });
  var timeoutSeconds =
    typeof (transcriber === null || transcriber === void 0
      ? void 0
      : transcriber.timeoutSeconds) === "number"
      ? transcriber === null || transcriber === void 0
        ? void 0
        : transcriber.timeoutSeconds
      : undefined;
  var result = { command: rawExecutable, type: "cli" };
  if (args.length > 0) {
    result.args = args;
  }
  if (timeoutSeconds !== undefined) {
    result.timeoutSeconds = timeoutSeconds;
  }
  return result;
};
exports.mapLegacyAudioTranscription = mapLegacyAudioTranscription;
var getAgentsList = function (agents) {
  var list = agents === null || agents === void 0 ? void 0 : agents.list;
  return Array.isArray(list) ? list : [];
};
exports.getAgentsList = getAgentsList;
var resolveDefaultAgentIdFromRaw = function (raw) {
  var agents = (0, exports.getRecord)(raw.agents);
  var list = (0, exports.getAgentsList)(agents);
  var defaultEntry = list.find(function (entry) {
    return (
      (0, exports.isRecord)(entry) &&
      entry.default === true &&
      typeof entry.id === "string" &&
      entry.id.trim() !== ""
    );
  });
  if (defaultEntry) {
    return defaultEntry.id.trim();
  }
  var routing = (0, exports.getRecord)(raw.routing);
  var routingDefault =
    typeof (routing === null || routing === void 0 ? void 0 : routing.defaultAgentId) === "string"
      ? routing.defaultAgentId.trim()
      : "";
  if (routingDefault) {
    return routingDefault;
  }
  var firstEntry = list.find(function (entry) {
    return (0, exports.isRecord)(entry) && typeof entry.id === "string" && entry.id.trim() !== "";
  });
  if (firstEntry) {
    return firstEntry.id.trim();
  }
  return "main";
};
exports.resolveDefaultAgentIdFromRaw = resolveDefaultAgentIdFromRaw;
var ensureAgentEntry = function (list, id) {
  var normalized = id.trim();
  var existing = list.find(function (entry) {
    return (
      (0, exports.isRecord)(entry) && typeof entry.id === "string" && entry.id.trim() === normalized
    );
  });
  if (existing) {
    return existing;
  }
  var created = { id: normalized };
  list.push(created);
  return created;
};
exports.ensureAgentEntry = ensureAgentEntry;
