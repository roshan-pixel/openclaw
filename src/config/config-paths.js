"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseConfigPath = parseConfigPath;
exports.setConfigValueAtPath = setConfigValueAtPath;
exports.unsetConfigValueAtPath = unsetConfigValueAtPath;
exports.getConfigValueAtPath = getConfigValueAtPath;
var BLOCKED_KEYS = new Set(["__proto__", "prototype", "constructor"]);
function parseConfigPath(raw) {
  var trimmed = raw.trim();
  if (!trimmed) {
    return {
      ok: false,
      error: "Invalid path. Use dot notation (e.g. foo.bar).",
    };
  }
  var parts = trimmed.split(".").map(function (part) {
    return part.trim();
  });
  if (
    parts.some(function (part) {
      return !part;
    })
  ) {
    return {
      ok: false,
      error: "Invalid path. Use dot notation (e.g. foo.bar).",
    };
  }
  if (
    parts.some(function (part) {
      return BLOCKED_KEYS.has(part);
    })
  ) {
    return { ok: false, error: "Invalid path segment." };
  }
  return { ok: true, path: parts };
}
function setConfigValueAtPath(root, path, value) {
  var cursor = root;
  for (var idx = 0; idx < path.length - 1; idx += 1) {
    var key = path[idx];
    var next = cursor[key];
    if (!isPlainObject(next)) {
      cursor[key] = {};
    }
    cursor = cursor[key];
  }
  cursor[path[path.length - 1]] = value;
}
function unsetConfigValueAtPath(root, path) {
  var stack = [];
  var cursor = root;
  for (var idx = 0; idx < path.length - 1; idx += 1) {
    var key = path[idx];
    var next = cursor[key];
    if (!isPlainObject(next)) {
      return false;
    }
    stack.push({ node: cursor, key: key });
    cursor = next;
  }
  var leafKey = path[path.length - 1];
  if (!(leafKey in cursor)) {
    return false;
  }
  delete cursor[leafKey];
  for (var idx = stack.length - 1; idx >= 0; idx -= 1) {
    var _a = stack[idx],
      node = _a.node,
      key = _a.key;
    var child = node[key];
    if (isPlainObject(child) && Object.keys(child).length === 0) {
      delete node[key];
    } else {
      break;
    }
  }
  return true;
}
function getConfigValueAtPath(root, path) {
  var cursor = root;
  for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
    var key = path_1[_i];
    if (!isPlainObject(cursor)) {
      return undefined;
    }
    cursor = cursor[key];
  }
  return cursor;
}
function isPlainObject(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === "[object Object]"
  );
}
