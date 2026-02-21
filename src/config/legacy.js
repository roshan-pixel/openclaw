"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLegacyConfigIssues = findLegacyConfigIssues;
exports.applyLegacyMigrations = applyLegacyMigrations;
var legacy_migrations_js_1 = require("./legacy.migrations.js");
var legacy_rules_js_1 = require("./legacy.rules.js");
function findLegacyConfigIssues(raw) {
  if (!raw || typeof raw !== "object") {
    return [];
  }
  var root = raw;
  var issues = [];
  for (
    var _i = 0, LEGACY_CONFIG_RULES_1 = legacy_rules_js_1.LEGACY_CONFIG_RULES;
    _i < LEGACY_CONFIG_RULES_1.length;
    _i++
  ) {
    var rule = LEGACY_CONFIG_RULES_1[_i];
    var cursor = root;
    for (var _a = 0, _b = rule.path; _a < _b.length; _a++) {
      var key = _b[_a];
      if (!cursor || typeof cursor !== "object") {
        cursor = undefined;
        break;
      }
      cursor = cursor[key];
    }
    if (cursor !== undefined && (!rule.match || rule.match(cursor, root))) {
      issues.push({ path: rule.path.join("."), message: rule.message });
    }
  }
  return issues;
}
function applyLegacyMigrations(raw) {
  if (!raw || typeof raw !== "object") {
    return { next: null, changes: [] };
  }
  var next = structuredClone(raw);
  var changes = [];
  for (
    var _i = 0, LEGACY_CONFIG_MIGRATIONS_1 = legacy_migrations_js_1.LEGACY_CONFIG_MIGRATIONS;
    _i < LEGACY_CONFIG_MIGRATIONS_1.length;
    _i++
  ) {
    var migration = LEGACY_CONFIG_MIGRATIONS_1[_i];
    migration.apply(next, changes);
  }
  if (changes.length === 0) {
    return { next: null, changes: [] };
  }
  return { next: next, changes: changes };
}
