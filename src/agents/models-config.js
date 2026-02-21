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
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) {
            throw t[1];
          }
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return (
      (g.next = verb(0)),
      (g["throw"] = verb(1)),
      (g["return"] = verb(2)),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) {
        throw new TypeError("Generator is already executing.");
      }
      while ((g && ((g = 0), op[0] && (_ = 0)), _)) {
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                    ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      }
      if (op[0] & 5) {
        throw op[1];
      }
      return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.ensureOpenClawModelsJson = ensureOpenClawModelsJson;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var config_js_1 = require("../config/config.js");
var agent_paths_js_1 = require("./agent-paths.js");
var models_config_providers_js_1 = require("./models-config.providers.js");
var DEFAULT_MODE = "merge";
function isRecord(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function mergeProviderModels(implicit, explicit) {
  var implicitModels = Array.isArray(implicit.models) ? implicit.models : [];
  var explicitModels = Array.isArray(explicit.models) ? explicit.models : [];
  if (implicitModels.length === 0) {
    return __assign(__assign({}, implicit), explicit);
  }
  var getId = function (model) {
    if (!model || typeof model !== "object") {
      return "";
    }
    var id = model.id;
    return typeof id === "string" ? id.trim() : "";
  };
  var seen = new Set(explicitModels.map(getId).filter(Boolean));
  var mergedModels = __spreadArray(
    __spreadArray([], explicitModels, true),
    implicitModels.filter(function (model) {
      var id = getId(model);
      if (!id) {
        return false;
      }
      if (seen.has(id)) {
        return false;
      }
      seen.add(id);
      return true;
    }),
    true,
  );
  return __assign(__assign(__assign({}, implicit), explicit), { models: mergedModels });
}
function mergeProviders(params) {
  var _a;
  var out = params.implicit ? __assign({}, params.implicit) : {};
  for (
    var _i = 0, _b = Object.entries((_a = params.explicit) !== null && _a !== void 0 ? _a : {});
    _i < _b.length;
    _i++
  ) {
    var _c = _b[_i],
      key = _c[0],
      explicit = _c[1];
    var providerKey = key.trim();
    if (!providerKey) {
      continue;
    }
    var implicit = out[providerKey];
    out[providerKey] = implicit ? mergeProviderModels(implicit, explicit) : explicit;
  }
  return out;
}
function readJson(pathname) {
  return __awaiter(this, void 0, void 0, function () {
    var raw, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 2, , 3]);
          return [4 /*yield*/, promises_1.default.readFile(pathname, "utf8")];
        case 1:
          raw = _b.sent();
          return [2 /*return*/, JSON.parse(raw)];
        case 2:
          _a = _b.sent();
          return [2 /*return*/, null];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function ensureOpenClawModelsJson(config, agentDirOverride) {
  return __awaiter(this, void 0, void 0, function () {
    var cfg,
      agentDir,
      explicitProviders,
      implicitProviders,
      providers,
      implicitBedrock,
      existing,
      implicitCopilot,
      mode,
      targetPath,
      mergedProviders,
      existingRaw,
      existing,
      existingProviders,
      normalizedProviders,
      next,
      _a;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
      switch (_f.label) {
        case 0:
          cfg = config !== null && config !== void 0 ? config : (0, config_js_1.loadConfig)();
          agentDir = (
            agentDirOverride === null || agentDirOverride === void 0
              ? void 0
              : agentDirOverride.trim()
          )
            ? agentDirOverride.trim()
            : (0, agent_paths_js_1.resolveOpenClawAgentDir)();
          explicitProviders =
            (_c = (_b = cfg.models) === null || _b === void 0 ? void 0 : _b.providers) !== null &&
            _c !== void 0
              ? _c
              : {};
          return [
            4 /*yield*/,
            (0, models_config_providers_js_1.resolveImplicitProviders)({ agentDir: agentDir }),
          ];
        case 1:
          implicitProviders = _f.sent();
          providers = mergeProviders({
            implicit: implicitProviders,
            explicit: explicitProviders,
          });
          return [
            4 /*yield*/,
            (0, models_config_providers_js_1.resolveImplicitBedrockProvider)({
              agentDir: agentDir,
              config: cfg,
            }),
          ];
        case 2:
          implicitBedrock = _f.sent();
          if (implicitBedrock) {
            existing = providers["amazon-bedrock"];
            providers["amazon-bedrock"] = existing
              ? mergeProviderModels(implicitBedrock, existing)
              : implicitBedrock;
          }
          return [
            4 /*yield*/,
            (0, models_config_providers_js_1.resolveImplicitCopilotProvider)({
              agentDir: agentDir,
            }),
          ];
        case 3:
          implicitCopilot = _f.sent();
          if (implicitCopilot && !providers["github-copilot"]) {
            providers["github-copilot"] = implicitCopilot;
          }
          if (Object.keys(providers).length === 0) {
            return [2 /*return*/, { agentDir: agentDir, wrote: false }];
          }
          mode =
            (_e = (_d = cfg.models) === null || _d === void 0 ? void 0 : _d.mode) !== null &&
            _e !== void 0
              ? _e
              : DEFAULT_MODE;
          targetPath = node_path_1.default.join(agentDir, "models.json");
          mergedProviders = providers;
          existingRaw = "";
          if (!(mode === "merge")) {
            return [3 /*break*/, 5];
          }
          return [4 /*yield*/, readJson(targetPath)];
        case 4:
          existing = _f.sent();
          if (isRecord(existing) && isRecord(existing.providers)) {
            existingProviders = existing.providers;
            mergedProviders = __assign(__assign({}, existingProviders), providers);
          }
          _f.label = 5;
        case 5:
          normalizedProviders = (0, models_config_providers_js_1.normalizeProviders)({
            providers: mergedProviders,
            agentDir: agentDir,
          });
          next = "".concat(JSON.stringify({ providers: normalizedProviders }, null, 2), "\n");
          _f.label = 6;
        case 6:
          _f.trys.push([6, 8, , 9]);
          return [4 /*yield*/, promises_1.default.readFile(targetPath, "utf8")];
        case 7:
          existingRaw = _f.sent();
          return [3 /*break*/, 9];
        case 8:
          _a = _f.sent();
          existingRaw = "";
          return [3 /*break*/, 9];
        case 9:
          if (existingRaw === next) {
            return [2 /*return*/, { agentDir: agentDir, wrote: false }];
          }
          return [4 /*yield*/, promises_1.default.mkdir(agentDir, { recursive: true, mode: 448 })];
        case 10:
          _f.sent();
          return [4 /*yield*/, promises_1.default.writeFile(targetPath, next, { mode: 384 })];
        case 11:
          _f.sent();
          return [2 /*return*/, { agentDir: agentDir, wrote: true }];
      }
    });
  });
}
