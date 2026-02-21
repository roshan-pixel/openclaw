"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMAND_ARG_FORMATTERS = void 0;
function normalizeArgValue(value) {
  if (value == null) {
    return undefined;
  }
  var text;
  if (typeof value === "string") {
    text = value.trim();
  } else if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    text = String(value).trim();
  } else if (typeof value === "symbol") {
    text = value.toString().trim();
  } else if (typeof value === "function") {
    text = value.toString().trim();
  } else {
    // Objects and arrays
    text = JSON.stringify(value);
  }
  return text ? text : undefined;
}
var formatConfigArgs = function (values) {
  var _a;
  var action =
    (_a = normalizeArgValue(values.action)) === null || _a === void 0 ? void 0 : _a.toLowerCase();
  var path = normalizeArgValue(values.path);
  var value = normalizeArgValue(values.value);
  if (!action) {
    return undefined;
  }
  if (action === "show" || action === "get") {
    return path ? "".concat(action, " ").concat(path) : action;
  }
  if (action === "unset") {
    return path ? "".concat(action, " ").concat(path) : action;
  }
  if (action === "set") {
    if (!path) {
      return action;
    }
    if (!value) {
      return "".concat(action, " ").concat(path);
    }
    return "".concat(action, " ").concat(path, "=").concat(value);
  }
  return action;
};
var formatDebugArgs = function (values) {
  var _a;
  var action =
    (_a = normalizeArgValue(values.action)) === null || _a === void 0 ? void 0 : _a.toLowerCase();
  var path = normalizeArgValue(values.path);
  var value = normalizeArgValue(values.value);
  if (!action) {
    return undefined;
  }
  if (action === "show" || action === "reset") {
    return action;
  }
  if (action === "unset") {
    return path ? "".concat(action, " ").concat(path) : action;
  }
  if (action === "set") {
    if (!path) {
      return action;
    }
    if (!value) {
      return "".concat(action, " ").concat(path);
    }
    return "".concat(action, " ").concat(path, "=").concat(value);
  }
  return action;
};
var formatQueueArgs = function (values) {
  var mode = normalizeArgValue(values.mode);
  var debounce = normalizeArgValue(values.debounce);
  var cap = normalizeArgValue(values.cap);
  var drop = normalizeArgValue(values.drop);
  var parts = [];
  if (mode) {
    parts.push(mode);
  }
  if (debounce) {
    parts.push("debounce:".concat(debounce));
  }
  if (cap) {
    parts.push("cap:".concat(cap));
  }
  if (drop) {
    parts.push("drop:".concat(drop));
  }
  return parts.length > 0 ? parts.join(" ") : undefined;
};
exports.COMMAND_ARG_FORMATTERS = {
  config: formatConfigArgs,
  debug: formatDebugArgs,
  queue: formatQueueArgs,
};
