"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDedupeCache = createDedupeCache;
function createDedupeCache(options) {
  var ttlMs = Math.max(0, options.ttlMs);
  var maxSize = Math.max(0, Math.floor(options.maxSize));
  var cache = new Map();
  var touch = function (key, now) {
    cache.delete(key);
    cache.set(key, now);
  };
  var prune = function (now) {
    var cutoff = ttlMs > 0 ? now - ttlMs : undefined;
    if (cutoff !== undefined) {
      for (var _i = 0, cache_1 = cache; _i < cache_1.length; _i++) {
        var _a = cache_1[_i],
          entryKey = _a[0],
          entryTs = _a[1];
        if (entryTs < cutoff) {
          cache.delete(entryKey);
        }
      }
    }
    if (maxSize <= 0) {
      cache.clear();
      return;
    }
    while (cache.size > maxSize) {
      var oldestKey = cache.keys().next().value;
      if (!oldestKey) {
        break;
      }
      cache.delete(oldestKey);
    }
  };
  return {
    check: function (key, now) {
      if (now === void 0) {
        now = Date.now();
      }
      if (!key) {
        return false;
      }
      var existing = cache.get(key);
      if (existing !== undefined && (ttlMs <= 0 || now - existing < ttlMs)) {
        touch(key, now);
        return true;
      }
      touch(key, now);
      prune(now);
      return false;
    },
    clear: function () {
      cache.clear();
    },
    size: function () {
      return cache.size;
    },
  };
}
