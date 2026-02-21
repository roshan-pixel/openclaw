"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectoryCache = void 0;
exports.buildDirectoryCacheKey = buildDirectoryCacheKey;
function buildDirectoryCacheKey(key) {
  var _a, _b;
  var signature = (_a = key.signature) !== null && _a !== void 0 ? _a : "default";
  return ""
    .concat(key.channel, ":")
    .concat((_b = key.accountId) !== null && _b !== void 0 ? _b : "default", ":")
    .concat(key.kind, ":")
    .concat(key.source, ":")
    .concat(signature);
}
var DirectoryCache = /** @class */ (function () {
  function DirectoryCache(ttlMs) {
    this.ttlMs = ttlMs;
    this.cache = new Map();
    this.lastConfigRef = null;
  }
  DirectoryCache.prototype.get = function (key, cfg) {
    this.resetIfConfigChanged(cfg);
    var entry = this.cache.get(key);
    if (!entry) {
      return undefined;
    }
    if (Date.now() - entry.fetchedAt > this.ttlMs) {
      this.cache.delete(key);
      return undefined;
    }
    return entry.value;
  };
  DirectoryCache.prototype.set = function (key, value, cfg) {
    this.resetIfConfigChanged(cfg);
    this.cache.set(key, { value: value, fetchedAt: Date.now() });
  };
  DirectoryCache.prototype.clearMatching = function (match) {
    for (var _i = 0, _a = this.cache.keys(); _i < _a.length; _i++) {
      var key = _a[_i];
      if (match(key)) {
        this.cache.delete(key);
      }
    }
  };
  DirectoryCache.prototype.clear = function (cfg) {
    this.cache.clear();
    if (cfg) {
      this.lastConfigRef = cfg;
    }
  };
  DirectoryCache.prototype.resetIfConfigChanged = function (cfg) {
    if (this.lastConfigRef && this.lastConfigRef !== cfg) {
      this.cache.clear();
    }
    this.lastConfigRef = cfg;
  };
  return DirectoryCache;
})();
exports.DirectoryCache = DirectoryCache;
