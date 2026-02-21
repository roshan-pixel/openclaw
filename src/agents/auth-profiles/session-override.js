"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearSessionAuthProfileOverride = clearSessionAuthProfileOverride;
exports.resolveSessionAuthProfileOverride = resolveSessionAuthProfileOverride;
var sessions_js_1 = require("../../config/sessions.js");
var model_selection_js_1 = require("../model-selection.js");
var auth_profiles_js_1 = require("../auth-profiles.js");
function isProfileForProvider(params) {
  var entry = params.store.profiles[params.profileId];
  if (!(entry === null || entry === void 0 ? void 0 : entry.provider)) {
    return false;
  }
  return (
    (0, model_selection_js_1.normalizeProviderId)(entry.provider) ===
    (0, model_selection_js_1.normalizeProviderId)(params.provider)
  );
}
function clearSessionAuthProfileOverride(params) {
  return __awaiter(this, void 0, void 0, function () {
    var sessionEntry, sessionStore, sessionKey, storePath;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          ((sessionEntry = params.sessionEntry),
            (sessionStore = params.sessionStore),
            (sessionKey = params.sessionKey),
            (storePath = params.storePath));
          delete sessionEntry.authProfileOverride;
          delete sessionEntry.authProfileOverrideSource;
          delete sessionEntry.authProfileOverrideCompactionCount;
          sessionEntry.updatedAt = Date.now();
          sessionStore[sessionKey] = sessionEntry;
          if (!storePath) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
              store[sessionKey] = sessionEntry;
            }),
          ];
        case 1:
          _a.sent();
          _a.label = 2;
        case 2:
          return [2 /*return*/];
      }
    });
  });
}
function resolveSessionAuthProfileOverride(params) {
  return __awaiter(this, void 0, void 0, function () {
    var cfg,
      provider,
      agentDir,
      sessionEntry,
      sessionStore,
      sessionKey,
      storePath,
      isNewSession,
      store,
      order,
      current,
      pickFirstAvailable,
      pickNextAvailable,
      compactionCount,
      storedCompaction,
      source,
      next,
      shouldPersist;
    var _a, _b, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          ((cfg = params.cfg),
            (provider = params.provider),
            (agentDir = params.agentDir),
            (sessionEntry = params.sessionEntry),
            (sessionStore = params.sessionStore),
            (sessionKey = params.sessionKey),
            (storePath = params.storePath),
            (isNewSession = params.isNewSession));
          if (!sessionEntry || !sessionStore || !sessionKey) {
            return [
              2 /*return*/,
              sessionEntry === null || sessionEntry === void 0
                ? void 0
                : sessionEntry.authProfileOverride,
            ];
          }
          store = (0, auth_profiles_js_1.ensureAuthProfileStore)(agentDir, {
            allowKeychainPrompt: false,
          });
          order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            cfg: cfg,
            store: store,
            provider: provider,
          });
          current =
            (_a = sessionEntry.authProfileOverride) === null || _a === void 0 ? void 0 : _a.trim();
          if (!(current && !store.profiles[current])) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            clearSessionAuthProfileOverride({
              sessionEntry: sessionEntry,
              sessionStore: sessionStore,
              sessionKey: sessionKey,
              storePath: storePath,
            }),
          ];
        case 1:
          _d.sent();
          current = undefined;
          _d.label = 2;
        case 2:
          if (
            !(
              current &&
              !isProfileForProvider({ provider: provider, profileId: current, store: store })
            )
          ) {
            return [3 /*break*/, 4];
          }
          return [
            4 /*yield*/,
            clearSessionAuthProfileOverride({
              sessionEntry: sessionEntry,
              sessionStore: sessionStore,
              sessionKey: sessionKey,
              storePath: storePath,
            }),
          ];
        case 3:
          _d.sent();
          current = undefined;
          _d.label = 4;
        case 4:
          if (!(current && order.length > 0 && !order.includes(current))) {
            return [3 /*break*/, 6];
          }
          return [
            4 /*yield*/,
            clearSessionAuthProfileOverride({
              sessionEntry: sessionEntry,
              sessionStore: sessionStore,
              sessionKey: sessionKey,
              storePath: storePath,
            }),
          ];
        case 5:
          _d.sent();
          current = undefined;
          _d.label = 6;
        case 6:
          if (order.length === 0) {
            return [2 /*return*/, undefined];
          }
          pickFirstAvailable = function () {
            var _a;
            return (_a = order.find(function (profileId) {
              return !(0, auth_profiles_js_1.isProfileInCooldown)(store, profileId);
            })) !== null && _a !== void 0
              ? _a
              : order[0];
          };
          pickNextAvailable = function (active) {
            var _a;
            var startIndex = order.indexOf(active);
            if (startIndex < 0) {
              return pickFirstAvailable();
            }
            for (var offset = 1; offset <= order.length; offset += 1) {
              var candidate = order[(startIndex + offset) % order.length];
              if (!(0, auth_profiles_js_1.isProfileInCooldown)(store, candidate)) {
                return candidate;
              }
            }
            return (_a = order[startIndex]) !== null && _a !== void 0 ? _a : order[0];
          };
          compactionCount = (_b = sessionEntry.compactionCount) !== null && _b !== void 0 ? _b : 0;
          storedCompaction =
            typeof sessionEntry.authProfileOverrideCompactionCount === "number"
              ? sessionEntry.authProfileOverrideCompactionCount
              : compactionCount;
          source =
            (_c = sessionEntry.authProfileOverrideSource) !== null && _c !== void 0
              ? _c
              : typeof sessionEntry.authProfileOverrideCompactionCount === "number"
                ? "auto"
                : current
                  ? "user"
                  : undefined;
          if (source === "user" && current && !isNewSession) {
            return [2 /*return*/, current];
          }
          next = current;
          if (isNewSession) {
            next = current ? pickNextAvailable(current) : pickFirstAvailable();
          } else if (current && compactionCount > storedCompaction) {
            next = pickNextAvailable(current);
          } else if (!current || (0, auth_profiles_js_1.isProfileInCooldown)(store, current)) {
            next = pickFirstAvailable();
          }
          if (!next) {
            return [2 /*return*/, current];
          }
          shouldPersist =
            next !== sessionEntry.authProfileOverride ||
            sessionEntry.authProfileOverrideSource !== "auto" ||
            sessionEntry.authProfileOverrideCompactionCount !== compactionCount;
          if (!shouldPersist) {
            return [3 /*break*/, 8];
          }
          sessionEntry.authProfileOverride = next;
          sessionEntry.authProfileOverrideSource = "auto";
          sessionEntry.authProfileOverrideCompactionCount = compactionCount;
          sessionEntry.updatedAt = Date.now();
          sessionStore[sessionKey] = sessionEntry;
          if (!storePath) {
            return [3 /*break*/, 8];
          }
          return [
            4 /*yield*/,
            (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
              store[sessionKey] = sessionEntry;
            }),
          ];
        case 7:
          _d.sent();
          _d.label = 8;
        case 8:
          return [2 /*return*/, next];
      }
    });
  });
}
