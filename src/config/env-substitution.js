"use strict";
/**
 * Environment variable substitution for config values.
 *
 * Supports `${VAR_NAME}` syntax in string values, substituted at config load time.
 * - Only uppercase env vars are matched: `[A-Z_][A-Z0-9_]*`
 * - Escape with `$${}` to output literal `${}`
 * - Missing env vars throw `MissingEnvVarError` with context
 *
 * @example
 * ```json5
 * {
 *   models: {
 *     providers: {
 *       "vercel-gateway": {
 *         apiKey: "${VERCEL_GATEWAY_API_KEY}"
 *       }
 *     }
 *   }
 * }
 * ```
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingEnvVarError = void 0;
exports.resolveConfigEnvVars = resolveConfigEnvVars;
// Pattern for valid uppercase env var names: starts with letter or underscore,
// followed by letters, numbers, or underscores (all uppercase)
var ENV_VAR_NAME_PATTERN = /^[A-Z_][A-Z0-9_]*$/;
var MissingEnvVarError = /** @class */ (function (_super) {
    __extends(MissingEnvVarError, _super);
    function MissingEnvVarError(varName, configPath) {
        var _this = _super.call(this, "Missing env var \"".concat(varName, "\" referenced at config path: ").concat(configPath)) || this;
        _this.varName = varName;
        _this.configPath = configPath;
        _this.name = "MissingEnvVarError";
        return _this;
    }
    return MissingEnvVarError;
}(Error));
exports.MissingEnvVarError = MissingEnvVarError;
function isPlainObject(value) {
    return (typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        Object.prototype.toString.call(value) === "[object Object]");
}
function substituteString(value, env, configPath) {
    if (!value.includes("$")) {
        return value;
    }
    var chunks = [];
    for (var i = 0; i < value.length; i += 1) {
        var char = value[i];
        if (char !== "$") {
            chunks.push(char);
            continue;
        }
        var next = value[i + 1];
        var afterNext = value[i + 2];
        // Escaped: $${VAR} -> ${VAR}
        if (next === "$" && afterNext === "{") {
            var start = i + 3;
            var end = value.indexOf("}", start);
            if (end !== -1) {
                var name_1 = value.slice(start, end);
                if (ENV_VAR_NAME_PATTERN.test(name_1)) {
                    chunks.push("${".concat(name_1, "}"));
                    i = end;
                    continue;
                }
            }
        }
        // Substitution: ${VAR} -> value
        if (next === "{") {
            var start = i + 2;
            var end = value.indexOf("}", start);
            if (end !== -1) {
                var name_2 = value.slice(start, end);
                if (ENV_VAR_NAME_PATTERN.test(name_2)) {
                    var envValue = env[name_2];
                    if (envValue === undefined || envValue === "") {
                        throw new MissingEnvVarError(name_2, configPath);
                    }
                    chunks.push(envValue);
                    i = end;
                    continue;
                }
            }
        }
        // Leave untouched if not a recognized pattern
        chunks.push(char);
    }
    return chunks.join("");
}
function substituteAny(value, env, path) {
    if (typeof value === "string") {
        return substituteString(value, env, path);
    }
    if (Array.isArray(value)) {
        return value.map(function (item, index) { return substituteAny(item, env, "".concat(path, "[").concat(index, "]")); });
    }
    if (isPlainObject(value)) {
        var result = {};
        for (var _i = 0, _a = Object.entries(value); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], val = _b[1];
            var childPath = path ? "".concat(path, ".").concat(key) : key;
            result[key] = substituteAny(val, env, childPath);
        }
        return result;
    }
    // Primitives (number, boolean, null) pass through unchanged
    return value;
}
/**
 * Resolves `${VAR_NAME}` environment variable references in config values.
 *
 * @param obj - The parsed config object (after JSON5 parse and $include resolution)
 * @param env - Environment variables to use for substitution (defaults to process.env)
 * @returns The config object with env vars substituted
 * @throws {MissingEnvVarError} If a referenced env var is not set or empty
 */
function resolveConfigEnvVars(obj, env) {
    if (env === void 0) { env = process.env; }
    return substituteAny(obj, env, "");
}
