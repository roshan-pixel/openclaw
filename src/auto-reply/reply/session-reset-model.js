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
exports.applyResetModelOverride = applyResetModelOverride;
var model_catalog_js_1 = require("../../agents/model-catalog.js");
var model_selection_js_1 = require("../../agents/model-selection.js");
var sessions_js_1 = require("../../config/sessions.js");
var inbound_sender_meta_js_1 = require("./inbound-sender-meta.js");
var model_selection_js_2 = require("./model-selection.js");
var model_overrides_js_1 = require("../../sessions/model-overrides.js");
function splitBody(body) {
  var tokens = body.split(/\s+/).filter(Boolean);
  return {
    tokens: tokens,
    first: tokens[0],
    second: tokens[1],
    rest: tokens.slice(2),
  };
}
function buildSelectionFromExplicit(params) {
  var resolved = (0, model_selection_js_1.resolveModelRefFromString)({
    raw: params.raw,
    defaultProvider: params.defaultProvider,
    aliasIndex: params.aliasIndex,
  });
  if (!resolved) {
    return undefined;
  }
  var key = (0, model_selection_js_1.modelKey)(resolved.ref.provider, resolved.ref.model);
  if (params.allowedModelKeys.size > 0 && !params.allowedModelKeys.has(key)) {
    return undefined;
  }
  var isDefault =
    resolved.ref.provider === params.defaultProvider && resolved.ref.model === params.defaultModel;
  return __assign(
    { provider: resolved.ref.provider, model: resolved.ref.model, isDefault: isDefault },
    resolved.alias ? { alias: resolved.alias } : undefined,
  );
}
function applySelectionToSession(params) {
  var selection = params.selection,
    sessionEntry = params.sessionEntry,
    sessionStore = params.sessionStore,
    sessionKey = params.sessionKey,
    storePath = params.storePath;
  if (!sessionEntry || !sessionStore || !sessionKey) {
    return;
  }
  var updated = (0, model_overrides_js_1.applyModelOverrideToSessionEntry)({
    entry: sessionEntry,
    selection: selection,
  }).updated;
  if (!updated) {
    return;
  }
  sessionStore[sessionKey] = sessionEntry;
  if (storePath) {
    (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
      store[sessionKey] = sessionEntry;
    }).catch(function () {
      // Ignore persistence errors; session still proceeds.
    });
  }
}
function applyResetModelOverride(params) {
  return __awaiter(this, void 0, void 0, function () {
    var rawBody,
      _a,
      tokens,
      first,
      second,
      catalog,
      allowed,
      allowedModelKeys,
      providers,
      _i,
      allowedModelKeys_1,
      key,
      slash,
      resolveSelection,
      selection,
      consumed,
      composite,
      resolved,
      resolved,
      allowFuzzy,
      cleanedBody;
    var _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          if (!params.resetTriggered) {
            return [2 /*return*/, {}];
          }
          rawBody = (_b = params.bodyStripped) === null || _b === void 0 ? void 0 : _b.trim();
          if (!rawBody) {
            return [2 /*return*/, {}];
          }
          ((_a = splitBody(rawBody)),
            (tokens = _a.tokens),
            (first = _a.first),
            (second = _a.second));
          if (!first) {
            return [2 /*return*/, {}];
          }
          return [4 /*yield*/, (0, model_catalog_js_1.loadModelCatalog)({ config: params.cfg })];
        case 1:
          catalog = _c.sent();
          allowed = (0, model_selection_js_1.buildAllowedModelSet)({
            cfg: params.cfg,
            catalog: catalog,
            defaultProvider: params.defaultProvider,
            defaultModel: params.defaultModel,
          });
          allowedModelKeys = allowed.allowedKeys;
          if (allowedModelKeys.size === 0) {
            return [2 /*return*/, {}];
          }
          providers = new Set();
          for (
            _i = 0, allowedModelKeys_1 = allowedModelKeys;
            _i < allowedModelKeys_1.length;
            _i++
          ) {
            key = allowedModelKeys_1[_i];
            slash = key.indexOf("/");
            if (slash <= 0) {
              continue;
            }
            providers.add((0, model_selection_js_1.normalizeProviderId)(key.slice(0, slash)));
          }
          resolveSelection = function (raw) {
            return (0, model_selection_js_2.resolveModelDirectiveSelection)({
              raw: raw,
              defaultProvider: params.defaultProvider,
              defaultModel: params.defaultModel,
              aliasIndex: params.aliasIndex,
              allowedModelKeys: allowedModelKeys,
            });
          };
          consumed = 0;
          if (providers.has((0, model_selection_js_1.normalizeProviderId)(first)) && second) {
            composite = ""
              .concat((0, model_selection_js_1.normalizeProviderId)(first), "/")
              .concat(second);
            resolved = resolveSelection(composite);
            if (resolved.selection) {
              selection = resolved.selection;
              consumed = 2;
            }
          }
          if (!selection) {
            selection = buildSelectionFromExplicit({
              raw: first,
              defaultProvider: params.defaultProvider,
              defaultModel: params.defaultModel,
              aliasIndex: params.aliasIndex,
              allowedModelKeys: allowedModelKeys,
            });
            if (selection) {
              consumed = 1;
            }
          }
          if (!selection) {
            resolved = resolveSelection(first);
            allowFuzzy =
              providers.has((0, model_selection_js_1.normalizeProviderId)(first)) ||
              first.trim().length >= 6;
            if (allowFuzzy) {
              selection = resolved.selection;
              if (selection) {
                consumed = 1;
              }
            }
          }
          if (!selection) {
            return [2 /*return*/, {}];
          }
          cleanedBody = tokens.slice(consumed).join(" ").trim();
          params.sessionCtx.BodyStripped = (0,
          inbound_sender_meta_js_1.formatInboundBodyWithSenderMeta)({
            ctx: params.ctx,
            body: cleanedBody,
          });
          params.sessionCtx.BodyForCommands = cleanedBody;
          applySelectionToSession({
            selection: selection,
            sessionEntry: params.sessionEntry,
            sessionStore: params.sessionStore,
            sessionKey: params.sessionKey,
            storePath: params.storePath,
          });
          return [2 /*return*/, { selection: selection, cleanedBody: cleanedBody }];
      }
    });
  });
}
