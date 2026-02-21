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
exports.slotKeyForPluginKind = slotKeyForPluginKind;
exports.defaultSlotIdForKey = defaultSlotIdForKey;
exports.applyExclusiveSlotSelection = applyExclusiveSlotSelection;
var SLOT_BY_KIND = {
  memory: "memory",
};
var DEFAULT_SLOT_BY_KEY = {
  memory: "memory-core",
};
function slotKeyForPluginKind(kind) {
  var _a;
  if (!kind) {
    return null;
  }
  return (_a = SLOT_BY_KIND[kind]) !== null && _a !== void 0 ? _a : null;
}
function defaultSlotIdForKey(slotKey) {
  return DEFAULT_SLOT_BY_KEY[slotKey];
}
function applyExclusiveSlotSelection(params) {
  var _a;
  var _b, _c;
  var slotKey = slotKeyForPluginKind(params.selectedKind);
  if (!slotKey) {
    return { config: params.config, warnings: [], changed: false };
  }
  var warnings = [];
  var pluginsConfig = (_b = params.config.plugins) !== null && _b !== void 0 ? _b : {};
  var prevSlot = (_c = pluginsConfig.slots) === null || _c === void 0 ? void 0 : _c[slotKey];
  var slots = __assign(
    __assign({}, pluginsConfig.slots),
    ((_a = {}), (_a[slotKey] = params.selectedId), _a),
  );
  var inferredPrevSlot =
    prevSlot !== null && prevSlot !== void 0 ? prevSlot : defaultSlotIdForKey(slotKey);
  if (inferredPrevSlot && inferredPrevSlot !== params.selectedId) {
    warnings.push(
      'Exclusive slot "'
        .concat(slotKey, '" switched from "')
        .concat(inferredPrevSlot, '" to "')
        .concat(params.selectedId, '".'),
    );
  }
  var entries = __assign({}, pluginsConfig.entries);
  var disabledIds = [];
  if (params.registry) {
    for (var _i = 0, _d = params.registry.plugins; _i < _d.length; _i++) {
      var plugin = _d[_i];
      if (plugin.id === params.selectedId) {
        continue;
      }
      if (plugin.kind !== params.selectedKind) {
        continue;
      }
      var entry = entries[plugin.id];
      if (!entry || entry.enabled !== false) {
        entries[plugin.id] = __assign(__assign({}, entry), { enabled: false });
        disabledIds.push(plugin.id);
      }
    }
  }
  if (disabledIds.length > 0) {
    warnings.push(
      'Disabled other "'
        .concat(slotKey, '" slot plugins: ')
        .concat(disabledIds.toSorted().join(", "), "."),
    );
  }
  var changed = prevSlot !== params.selectedId || disabledIds.length > 0;
  if (!changed) {
    return { config: params.config, warnings: [], changed: false };
  }
  return {
    config: __assign(__assign({}, params.config), {
      plugins: __assign(__assign({}, pluginsConfig), { slots: slots, entries: entries }),
    }),
    warnings: warnings,
    changed: true,
  };
}
