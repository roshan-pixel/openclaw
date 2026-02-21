"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applySkillEnvOverrides = applySkillEnvOverrides;
exports.applySkillEnvOverridesFromSnapshot = applySkillEnvOverridesFromSnapshot;
var config_js_1 = require("./config.js");
var frontmatter_js_1 = require("./frontmatter.js");
function applySkillEnvOverrides(params) {
  var _a;
  var skills = params.skills,
    config = params.config;
  var updates = [];
  for (var _i = 0, skills_1 = skills; _i < skills_1.length; _i++) {
    var entry = skills_1[_i];
    var skillKey = (0, frontmatter_js_1.resolveSkillKey)(entry.skill, entry);
    var skillConfig = (0, config_js_1.resolveSkillConfig)(config, skillKey);
    if (!skillConfig) continue;
    if (skillConfig.env) {
      for (var _b = 0, _c = Object.entries(skillConfig.env); _b < _c.length; _b++) {
        var _d = _c[_b],
          envKey = _d[0],
          envValue = _d[1];
        if (!envValue || process.env[envKey]) continue;
        updates.push({ key: envKey, prev: process.env[envKey] });
        process.env[envKey] = envValue;
      }
    }
    var primaryEnv = (_a = entry.metadata) === null || _a === void 0 ? void 0 : _a.primaryEnv;
    if (primaryEnv && skillConfig.apiKey && !process.env[primaryEnv]) {
      updates.push({ key: primaryEnv, prev: process.env[primaryEnv] });
      process.env[primaryEnv] = skillConfig.apiKey;
    }
  }
  return function () {
    for (var _i = 0, updates_1 = updates; _i < updates_1.length; _i++) {
      var update = updates_1[_i];
      if (update.prev === undefined) delete process.env[update.key];
      else process.env[update.key] = update.prev;
    }
  };
}
function applySkillEnvOverridesFromSnapshot(params) {
  var snapshot = params.snapshot,
    config = params.config;
  if (!snapshot) return function () {};
  var updates = [];
  for (var _i = 0, _a = snapshot.skills; _i < _a.length; _i++) {
    var skill = _a[_i];
    var skillConfig = (0, config_js_1.resolveSkillConfig)(config, skill.name);
    if (!skillConfig) continue;
    if (skillConfig.env) {
      for (var _b = 0, _c = Object.entries(skillConfig.env); _b < _c.length; _b++) {
        var _d = _c[_b],
          envKey = _d[0],
          envValue = _d[1];
        if (!envValue || process.env[envKey]) continue;
        updates.push({ key: envKey, prev: process.env[envKey] });
        process.env[envKey] = envValue;
      }
    }
    if (skill.primaryEnv && skillConfig.apiKey && !process.env[skill.primaryEnv]) {
      updates.push({
        key: skill.primaryEnv,
        prev: process.env[skill.primaryEnv],
      });
      process.env[skill.primaryEnv] = skillConfig.apiKey;
    }
  }
  return function () {
    for (var _i = 0, updates_2 = updates; _i < updates_2.length; _i++) {
      var update = updates_2[_i];
      if (update.prev === undefined) delete process.env[update.key];
      else process.env[update.key] = update.prev;
    }
  };
}
