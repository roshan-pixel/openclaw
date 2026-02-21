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
exports.enforceCrossContextPolicy = enforceCrossContextPolicy;
exports.buildCrossContextDecoration = buildCrossContextDecoration;
exports.shouldApplyCrossContextMarker = shouldApplyCrossContextMarker;
exports.applyCrossContextDecoration = applyCrossContextDecoration;
var target_normalization_js_1 = require("./target-normalization.js");
var channel_adapters_js_1 = require("./channel-adapters.js");
var target_resolver_js_1 = require("./target-resolver.js");
var CONTEXT_GUARDED_ACTIONS = new Set([
  "send",
  "poll",
  "reply",
  "sendWithEffect",
  "sendAttachment",
  "thread-create",
  "thread-reply",
  "sticker",
]);
var CONTEXT_MARKER_ACTIONS = new Set([
  "send",
  "poll",
  "reply",
  "sendWithEffect",
  "sendAttachment",
  "thread-reply",
  "sticker",
]);
function resolveContextGuardTarget(action, params) {
  if (!CONTEXT_GUARDED_ACTIONS.has(action)) {
    return undefined;
  }
  if (action === "thread-reply" || action === "thread-create") {
    if (typeof params.channelId === "string") {
      return params.channelId;
    }
    if (typeof params.to === "string") {
      return params.to;
    }
    return undefined;
  }
  if (typeof params.to === "string") {
    return params.to;
  }
  if (typeof params.channelId === "string") {
    return params.channelId;
  }
  return undefined;
}
function normalizeTarget(channel, raw) {
  var _a;
  return (_a = (0, target_normalization_js_1.normalizeTargetForProvider)(channel, raw)) !== null &&
    _a !== void 0
    ? _a
    : raw.trim().toLowerCase();
}
function isCrossContextTarget(params) {
  var _a, _b;
  var currentTarget =
    (_b = (_a = params.toolContext) === null || _a === void 0 ? void 0 : _a.currentChannelId) ===
      null || _b === void 0
      ? void 0
      : _b.trim();
  if (!currentTarget) {
    return false;
  }
  var normalizedTarget = normalizeTarget(params.channel, params.target);
  var normalizedCurrent = normalizeTarget(params.channel, currentTarget);
  if (!normalizedTarget || !normalizedCurrent) {
    return false;
  }
  return normalizedTarget !== normalizedCurrent;
}
function enforceCrossContextPolicy(params) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
  var currentTarget =
    (_b = (_a = params.toolContext) === null || _a === void 0 ? void 0 : _a.currentChannelId) ===
      null || _b === void 0
      ? void 0
      : _b.trim();
  if (!currentTarget) {
    return;
  }
  if (!CONTEXT_GUARDED_ACTIONS.has(params.action)) {
    return;
  }
  if (
    (_d = (_c = params.cfg.tools) === null || _c === void 0 ? void 0 : _c.message) === null ||
    _d === void 0
      ? void 0
      : _d.allowCrossContextSend
  ) {
    return;
  }
  var currentProvider =
    (_e = params.toolContext) === null || _e === void 0 ? void 0 : _e.currentChannelProvider;
  var allowWithinProvider =
    ((_h =
      (_g = (_f = params.cfg.tools) === null || _f === void 0 ? void 0 : _f.message) === null ||
      _g === void 0
        ? void 0
        : _g.crossContext) === null || _h === void 0
      ? void 0
      : _h.allowWithinProvider) !== false;
  var allowAcrossProviders =
    ((_l =
      (_k = (_j = params.cfg.tools) === null || _j === void 0 ? void 0 : _j.message) === null ||
      _k === void 0
        ? void 0
        : _k.crossContext) === null || _l === void 0
      ? void 0
      : _l.allowAcrossProviders) === true;
  if (currentProvider && currentProvider !== params.channel) {
    if (!allowAcrossProviders) {
      throw new Error(
        "Cross-context messaging denied: action="
          .concat(params.action, ' target provider "')
          .concat(params.channel, '" while bound to "')
          .concat(currentProvider, '".'),
      );
    }
    return;
  }
  if (allowWithinProvider) {
    return;
  }
  var target = resolveContextGuardTarget(params.action, params.args);
  if (!target) {
    return;
  }
  if (
    !isCrossContextTarget({
      channel: params.channel,
      target: target,
      toolContext: params.toolContext,
    })
  ) {
    return;
  }
  throw new Error(
    "Cross-context messaging denied: action="
      .concat(params.action, ' target="')
      .concat(target, '" while bound to "')
      .concat(currentTarget, '" (channel=')
      .concat(params.channel, ")."),
  );
}
function buildCrossContextDecoration(params) {
  return __awaiter(this, void 0, void 0, function () {
    var markerConfig,
      currentName,
      originLabel,
      prefixTemplate,
      suffixTemplate,
      prefix,
      suffix,
      adapter,
      embeds;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __generator(this, function (_l) {
      switch (_l.label) {
        case 0:
          if (
            !((_a = params.toolContext) === null || _a === void 0 ? void 0 : _a.currentChannelId)
          ) {
            return [2 /*return*/, null];
          }
          // Skip decoration for direct tool sends (agent composing, not forwarding)
          if (params.toolContext.skipCrossContextDecoration) {
            return [2 /*return*/, null];
          }
          if (!isCrossContextTarget(params)) {
            return [2 /*return*/, null];
          }
          markerConfig =
            (_d =
              (_c = (_b = params.cfg.tools) === null || _b === void 0 ? void 0 : _b.message) ===
                null || _c === void 0
                ? void 0
                : _c.crossContext) === null || _d === void 0
              ? void 0
              : _d.marker;
          if (
            (markerConfig === null || markerConfig === void 0 ? void 0 : markerConfig.enabled) ===
            false
          ) {
            return [2 /*return*/, null];
          }
          return [
            4 /*yield*/,
            (0, target_resolver_js_1.lookupDirectoryDisplay)({
              cfg: params.cfg,
              channel: params.channel,
              targetId: params.toolContext.currentChannelId,
              accountId: (_e = params.accountId) !== null && _e !== void 0 ? _e : undefined,
            }),
          ];
        case 1:
          currentName =
            (_f = _l.sent()) !== null && _f !== void 0 ? _f : params.toolContext.currentChannelId;
          originLabel = (0, target_resolver_js_1.formatTargetDisplay)({
            channel: params.channel,
            target: params.toolContext.currentChannelId,
            display: currentName,
          });
          prefixTemplate =
            (_g =
              markerConfig === null || markerConfig === void 0 ? void 0 : markerConfig.prefix) !==
              null && _g !== void 0
              ? _g
              : "[from {channel}] ";
          suffixTemplate =
            (_h =
              markerConfig === null || markerConfig === void 0 ? void 0 : markerConfig.suffix) !==
              null && _h !== void 0
              ? _h
              : "";
          prefix = prefixTemplate.replaceAll("{channel}", originLabel);
          suffix = suffixTemplate.replaceAll("{channel}", originLabel);
          adapter = (0, channel_adapters_js_1.getChannelMessageAdapter)(params.channel);
          embeds = adapter.supportsEmbeds
            ? (_k =
                (_j = adapter.buildCrossContextEmbeds) === null || _j === void 0
                  ? void 0
                  : _j.call(adapter, originLabel)) !== null && _k !== void 0
              ? _k
              : undefined
            : undefined;
          return [2 /*return*/, { prefix: prefix, suffix: suffix, embeds: embeds }];
      }
    });
  });
}
function shouldApplyCrossContextMarker(action) {
  return CONTEXT_MARKER_ACTIONS.has(action);
}
function applyCrossContextDecoration(params) {
  var _a;
  var useEmbeds =
    params.preferEmbeds &&
    ((_a = params.decoration.embeds) === null || _a === void 0 ? void 0 : _a.length);
  if (useEmbeds) {
    return { message: params.message, embeds: params.decoration.embeds, usedEmbeds: true };
  }
  var message = ""
    .concat(params.decoration.prefix)
    .concat(params.message)
    .concat(params.decoration.suffix);
  return { message: message, usedEmbeds: false };
}
