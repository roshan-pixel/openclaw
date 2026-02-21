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
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2) {
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDeviceAuthToken = loadDeviceAuthToken;
exports.storeDeviceAuthToken = storeDeviceAuthToken;
exports.clearDeviceAuthToken = clearDeviceAuthToken;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var paths_js_1 = require("../config/paths.js");
var DEVICE_AUTH_FILE = "device-auth.json";
function resolveDeviceAuthPath(env) {
  if (env === void 0) {
    env = process.env;
  }
  return node_path_1.default.join(
    (0, paths_js_1.resolveStateDir)(env),
    "identity",
    DEVICE_AUTH_FILE,
  );
}
function normalizeRole(role) {
  return role.trim();
}
function normalizeScopes(scopes) {
  if (!Array.isArray(scopes)) {
    return [];
  }
  var out = new Set();
  for (var _i = 0, scopes_1 = scopes; _i < scopes_1.length; _i++) {
    var scope = scopes_1[_i];
    var trimmed = scope.trim();
    if (trimmed) {
      out.add(trimmed);
    }
  }
  return __spreadArray([], out, true).toSorted();
}
function readStore(filePath) {
  try {
    if (!node_fs_1.default.existsSync(filePath)) {
      return null;
    }
    var raw = node_fs_1.default.readFileSync(filePath, "utf8");
    var parsed = JSON.parse(raw);
    if (
      (parsed === null || parsed === void 0 ? void 0 : parsed.version) !== 1 ||
      typeof parsed.deviceId !== "string"
    ) {
      return null;
    }
    if (!parsed.tokens || typeof parsed.tokens !== "object") {
      return null;
    }
    return parsed;
  } catch (_a) {
    return null;
  }
}
function writeStore(filePath, store) {
  node_fs_1.default.mkdirSync(node_path_1.default.dirname(filePath), { recursive: true });
  node_fs_1.default.writeFileSync(filePath, "".concat(JSON.stringify(store, null, 2), "\n"), {
    mode: 384,
  });
  try {
    node_fs_1.default.chmodSync(filePath, 384);
  } catch (_a) {
    // best-effort
  }
}
function loadDeviceAuthToken(params) {
  var filePath = resolveDeviceAuthPath(params.env);
  var store = readStore(filePath);
  if (!store) {
    return null;
  }
  if (store.deviceId !== params.deviceId) {
    return null;
  }
  var role = normalizeRole(params.role);
  var entry = store.tokens[role];
  if (!entry || typeof entry.token !== "string") {
    return null;
  }
  return entry;
}
function storeDeviceAuthToken(params) {
  var filePath = resolveDeviceAuthPath(params.env);
  var existing = readStore(filePath);
  var role = normalizeRole(params.role);
  var next = {
    version: 1,
    deviceId: params.deviceId,
    tokens:
      existing && existing.deviceId === params.deviceId && existing.tokens
        ? __assign({}, existing.tokens)
        : {},
  };
  var entry = {
    token: params.token,
    role: role,
    scopes: normalizeScopes(params.scopes),
    updatedAtMs: Date.now(),
  };
  next.tokens[role] = entry;
  writeStore(filePath, next);
  return entry;
}
function clearDeviceAuthToken(params) {
  var filePath = resolveDeviceAuthPath(params.env);
  var store = readStore(filePath);
  if (!store || store.deviceId !== params.deviceId) {
    return;
  }
  var role = normalizeRole(params.role);
  if (!store.tokens[role]) {
    return;
  }
  var next = {
    version: 1,
    deviceId: store.deviceId,
    tokens: __assign({}, store.tokens),
  };
  delete next.tokens[role];
  writeStore(filePath, next);
}
