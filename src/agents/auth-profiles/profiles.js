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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthProfileOrder = setAuthProfileOrder;
exports.upsertAuthProfile = upsertAuthProfile;
exports.listProfilesForProvider = listProfilesForProvider;
exports.markAuthProfileGood = markAuthProfileGood;
var model_selection_js_1 = require("../model-selection.js");
var store_js_1 = require("./store.js");
function setAuthProfileOrder(params) {
  return __awaiter(this, void 0, void 0, function () {
    var providerKey, sanitized, deduped, _i, sanitized_1, entry;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          providerKey = (0, model_selection_js_1.normalizeProviderId)(params.provider);
          sanitized =
            params.order && Array.isArray(params.order)
              ? params.order
                  .map(function (entry) {
                    return String(entry).trim();
                  })
                  .filter(Boolean)
              : [];
          deduped = [];
          for (_i = 0, sanitized_1 = sanitized; _i < sanitized_1.length; _i++) {
            entry = sanitized_1[_i];
            if (!deduped.includes(entry)) {
              deduped.push(entry);
            }
          }
          return [
            4 /*yield*/,
            (0, store_js_1.updateAuthProfileStoreWithLock)({
              agentDir: params.agentDir,
              updater: function (store) {
                var _a;
                store.order = (_a = store.order) !== null && _a !== void 0 ? _a : {};
                if (deduped.length === 0) {
                  if (!store.order[providerKey]) {
                    return false;
                  }
                  delete store.order[providerKey];
                  if (Object.keys(store.order).length === 0) {
                    store.order = undefined;
                  }
                  return true;
                }
                store.order[providerKey] = deduped;
                return true;
              },
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function upsertAuthProfile(params) {
  var store = (0, store_js_1.ensureAuthProfileStore)(params.agentDir);
  store.profiles[params.profileId] = params.credential;
  (0, store_js_1.saveAuthProfileStore)(store, params.agentDir);
}
function listProfilesForProvider(store, provider) {
  var providerKey = (0, model_selection_js_1.normalizeProviderId)(provider);
  return Object.entries(store.profiles)
    .filter(function (_a) {
      var cred = _a[1];
      return (0, model_selection_js_1.normalizeProviderId)(cred.provider) === providerKey;
    })
    .map(function (_a) {
      var id = _a[0];
      return id;
    });
}
function markAuthProfileGood(params) {
  return __awaiter(this, void 0, void 0, function () {
    var store, provider, profileId, agentDir, updated, profile;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          ((store = params.store),
            (provider = params.provider),
            (profileId = params.profileId),
            (agentDir = params.agentDir));
          return [
            4 /*yield*/,
            (0, store_js_1.updateAuthProfileStoreWithLock)({
              agentDir: agentDir,
              updater: function (freshStore) {
                var _a;
                var profile = freshStore.profiles[profileId];
                if (!profile || profile.provider !== provider) {
                  return false;
                }
                freshStore.lastGood = __assign(
                  __assign({}, freshStore.lastGood),
                  ((_a = {}), (_a[provider] = profileId), _a),
                );
                return true;
              },
            }),
          ];
        case 1:
          updated = _b.sent();
          if (updated) {
            store.lastGood = updated.lastGood;
            return [2 /*return*/];
          }
          profile = store.profiles[profileId];
          if (!profile || profile.provider !== provider) {
            return [2 /*return*/];
          }
          store.lastGood = __assign(
            __assign({}, store.lastGood),
            ((_a = {}), (_a[provider] = profileId), _a),
          );
          (0, store_js_1.saveAuthProfileStore)(store, agentDir);
          return [2 /*return*/];
      }
    });
  });
}
