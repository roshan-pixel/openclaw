"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectConfigEnvVars = collectConfigEnvVars;
function collectConfigEnvVars(cfg) {
  var envConfig = cfg === null || cfg === void 0 ? void 0 : cfg.env;
  if (!envConfig) {
    return {};
  }
  var entries = {};
  if (envConfig.vars) {
    for (var _i = 0, _a = Object.entries(envConfig.vars); _i < _a.length; _i++) {
      var _b = _a[_i],
        key = _b[0],
        value = _b[1];
      if (!value) {
        continue;
      }
      entries[key] = value;
    }
  }
  for (var _c = 0, _d = Object.entries(envConfig); _c < _d.length; _c++) {
    var _e = _d[_c],
      key = _e[0],
      value = _e[1];
    if (key === "shellEnv" || key === "vars") {
      continue;
    }
    if (typeof value !== "string" || !value.trim()) {
      continue;
    }
    entries[key] = value;
  }
  return entries;
}
