"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateLegacyConfig = migrateLegacyConfig;
var legacy_js_1 = require("./legacy.js");
var validation_js_1 = require("./validation.js");
function migrateLegacyConfig(raw) {
  var _a = (0, legacy_js_1.applyLegacyMigrations)(raw),
    next = _a.next,
    changes = _a.changes;
  if (!next) {
    return { config: null, changes: [] };
  }
  var validated = (0, validation_js_1.validateConfigObjectWithPlugins)(next);
  if (!validated.ok) {
    changes.push("Migration applied, but config still invalid; fix remaining issues manually.");
    return { config: null, changes: changes };
  }
  return { config: validated.config, changes: changes };
}
