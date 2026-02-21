"use strict";
/**
 * Config includes: $include directive for modular configs
 *
 * @example
 * ```json5
 * {
 *   "$include": "./base.json5",           // single file
 *   "$include": ["./a.json5", "./b.json5"] // merge multiple
 * }
 * ```
 */
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b) {
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
          }
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== "function" && b !== null) {
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      }
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
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
exports.CircularIncludeError =
  exports.ConfigIncludeError =
  exports.MAX_INCLUDE_DEPTH =
  exports.INCLUDE_KEY =
    void 0;
exports.deepMerge = deepMerge;
exports.resolveConfigIncludes = resolveConfigIncludes;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var json5_1 = require("json5");
exports.INCLUDE_KEY = "$include";
exports.MAX_INCLUDE_DEPTH = 10;
// ============================================================================
// Errors
// ============================================================================
var ConfigIncludeError = /** @class */ (function (_super) {
  __extends(ConfigIncludeError, _super);
  function ConfigIncludeError(message, includePath, cause) {
    var _this = _super.call(this, message) || this;
    _this.includePath = includePath;
    _this.cause = cause;
    _this.name = "ConfigIncludeError";
    return _this;
  }
  return ConfigIncludeError;
})(Error);
exports.ConfigIncludeError = ConfigIncludeError;
var CircularIncludeError = /** @class */ (function (_super) {
  __extends(CircularIncludeError, _super);
  function CircularIncludeError(chain) {
    var _this =
      _super.call(
        this,
        "Circular include detected: ".concat(chain.join(" -> ")),
        chain[chain.length - 1],
      ) || this;
    _this.chain = chain;
    _this.name = "CircularIncludeError";
    return _this;
  }
  return CircularIncludeError;
})(ConfigIncludeError);
exports.CircularIncludeError = CircularIncludeError;
// ============================================================================
// Utilities
// ============================================================================
function isPlainObject(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === "[object Object]"
  );
}
/** Deep merge: arrays concatenate, objects merge recursively, primitives: source wins */
function deepMerge(target, source) {
  if (Array.isArray(target) && Array.isArray(source)) {
    return __spreadArray(__spreadArray([], target, true), source, true);
  }
  if (isPlainObject(target) && isPlainObject(source)) {
    var result = __assign({}, target);
    for (var _i = 0, _a = Object.keys(source); _i < _a.length; _i++) {
      var key = _a[_i];
      result[key] = key in result ? deepMerge(result[key], source[key]) : source[key];
    }
    return result;
  }
  return source;
}
// ============================================================================
// Include Resolver Class
// ============================================================================
var IncludeProcessor = /** @class */ (function () {
  function IncludeProcessor(basePath, resolver) {
    this.basePath = basePath;
    this.resolver = resolver;
    this.visited = new Set();
    this.depth = 0;
    this.visited.add(node_path_1.default.normalize(basePath));
  }
  IncludeProcessor.prototype.process = function (obj) {
    var _this = this;
    if (Array.isArray(obj)) {
      return obj.map(function (item) {
        return _this.process(item);
      });
    }
    if (!isPlainObject(obj)) {
      return obj;
    }
    if (!(exports.INCLUDE_KEY in obj)) {
      return this.processObject(obj);
    }
    return this.processInclude(obj);
  };
  IncludeProcessor.prototype.processObject = function (obj) {
    var result = {};
    for (var _i = 0, _a = Object.entries(obj); _i < _a.length; _i++) {
      var _b = _a[_i],
        key = _b[0],
        value = _b[1];
      result[key] = this.process(value);
    }
    return result;
  };
  IncludeProcessor.prototype.processInclude = function (obj) {
    var includeValue = obj[exports.INCLUDE_KEY];
    var otherKeys = Object.keys(obj).filter(function (k) {
      return k !== exports.INCLUDE_KEY;
    });
    var included = this.resolveInclude(includeValue);
    if (otherKeys.length === 0) {
      return included;
    }
    if (!isPlainObject(included)) {
      throw new ConfigIncludeError(
        "Sibling keys require included content to be an object",
        typeof includeValue === "string" ? includeValue : exports.INCLUDE_KEY,
      );
    }
    // Merge included content with sibling keys
    var rest = {};
    for (var _i = 0, otherKeys_1 = otherKeys; _i < otherKeys_1.length; _i++) {
      var key = otherKeys_1[_i];
      rest[key] = this.process(obj[key]);
    }
    return deepMerge(included, rest);
  };
  IncludeProcessor.prototype.resolveInclude = function (value) {
    var _this = this;
    if (typeof value === "string") {
      return this.loadFile(value);
    }
    if (Array.isArray(value)) {
      return value.reduce(function (merged, item) {
        if (typeof item !== "string") {
          throw new ConfigIncludeError(
            "Invalid $include array item: expected string, got ".concat(typeof item),
            String(item),
          );
        }
        return deepMerge(merged, _this.loadFile(item));
      }, {});
    }
    throw new ConfigIncludeError(
      "Invalid $include value: expected string or array of strings, got ".concat(typeof value),
      String(value),
    );
  };
  IncludeProcessor.prototype.loadFile = function (includePath) {
    var resolvedPath = this.resolvePath(includePath);
    this.checkCircular(resolvedPath);
    this.checkDepth(includePath);
    var raw = this.readFile(includePath, resolvedPath);
    var parsed = this.parseFile(includePath, resolvedPath, raw);
    return this.processNested(resolvedPath, parsed);
  };
  IncludeProcessor.prototype.resolvePath = function (includePath) {
    var resolved = node_path_1.default.isAbsolute(includePath)
      ? includePath
      : node_path_1.default.resolve(node_path_1.default.dirname(this.basePath), includePath);
    return node_path_1.default.normalize(resolved);
  };
  IncludeProcessor.prototype.checkCircular = function (resolvedPath) {
    if (this.visited.has(resolvedPath)) {
      throw new CircularIncludeError(
        __spreadArray(__spreadArray([], this.visited, true), [resolvedPath], false),
      );
    }
  };
  IncludeProcessor.prototype.checkDepth = function (includePath) {
    if (this.depth >= exports.MAX_INCLUDE_DEPTH) {
      throw new ConfigIncludeError(
        "Maximum include depth ("
          .concat(exports.MAX_INCLUDE_DEPTH, ") exceeded at: ")
          .concat(includePath),
        includePath,
      );
    }
  };
  IncludeProcessor.prototype.readFile = function (includePath, resolvedPath) {
    try {
      return this.resolver.readFile(resolvedPath);
    } catch (err) {
      throw new ConfigIncludeError(
        "Failed to read include file: "
          .concat(includePath, " (resolved: ")
          .concat(resolvedPath, ")"),
        includePath,
        err instanceof Error ? err : undefined,
      );
    }
  };
  IncludeProcessor.prototype.parseFile = function (includePath, resolvedPath, raw) {
    try {
      return this.resolver.parseJson(raw);
    } catch (err) {
      throw new ConfigIncludeError(
        "Failed to parse include file: "
          .concat(includePath, " (resolved: ")
          .concat(resolvedPath, ")"),
        includePath,
        err instanceof Error ? err : undefined,
      );
    }
  };
  IncludeProcessor.prototype.processNested = function (resolvedPath, parsed) {
    var nested = new IncludeProcessor(resolvedPath, this.resolver);
    nested.visited = new Set(
      __spreadArray(__spreadArray([], this.visited, true), [resolvedPath], false),
    );
    nested.depth = this.depth + 1;
    return nested.process(parsed);
  };
  return IncludeProcessor;
})();
// ============================================================================
// Public API
// ============================================================================
var defaultResolver = {
  readFile: function (p) {
    return node_fs_1.default.readFileSync(p, "utf-8");
  },
  parseJson: function (raw) {
    return json5_1.default.parse(raw);
  },
};
/**
 * Resolves all $include directives in a parsed config object.
 */
function resolveConfigIncludes(obj, configPath, resolver) {
  if (resolver === void 0) {
    resolver = defaultResolver;
  }
  return new IncludeProcessor(configPath, resolver).process(obj);
}
