"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readTalkApiKeyFromProfile = readTalkApiKeyFromProfile;
exports.resolveTalkApiKey = resolveTalkApiKey;
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
function readTalkApiKeyFromProfile(deps) {
  var _a, _b, _c, _d;
  if (deps === void 0) {
    deps = {};
  }
  var fsImpl = (_a = deps.fs) !== null && _a !== void 0 ? _a : node_fs_1.default;
  var osImpl = (_b = deps.os) !== null && _b !== void 0 ? _b : node_os_1.default;
  var pathImpl = (_c = deps.path) !== null && _c !== void 0 ? _c : node_path_1.default;
  var home = osImpl.homedir();
  var candidates = [".profile", ".zprofile", ".zshrc", ".bashrc"].map(function (name) {
    return pathImpl.join(home, name);
  });
  for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
    var candidate = candidates_1[_i];
    if (!fsImpl.existsSync(candidate)) {
      continue;
    }
    try {
      var text = fsImpl.readFileSync(candidate, "utf-8");
      var match = text.match(
        /(?:^|\n)\s*(?:export\s+)?ELEVENLABS_API_KEY\s*=\s*["']?([^\n"']+)["']?/,
      );
      var value =
        (_d = match === null || match === void 0 ? void 0 : match[1]) === null || _d === void 0
          ? void 0
          : _d.trim();
      if (value) {
        return value;
      }
    } catch (_e) {
      // Ignore profile read errors.
    }
  }
  return null;
}
function resolveTalkApiKey(env, deps) {
  var _a;
  if (env === void 0) {
    env = process.env;
  }
  if (deps === void 0) {
    deps = {};
  }
  var envValue = ((_a = env.ELEVENLABS_API_KEY) !== null && _a !== void 0 ? _a : "").trim();
  if (envValue) {
    return envValue;
  }
  return readTalkApiKeyFromProfile(deps);
}
