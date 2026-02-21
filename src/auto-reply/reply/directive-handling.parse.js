"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseInlineDirectives = parseInlineDirectives;
exports.isDirectiveOnly = isDirectiveOnly;
var model_js_1 = require("../model.js");
var directives_js_1 = require("./directives.js");
var mentions_js_1 = require("./mentions.js");
var queue_js_1 = require("./queue.js");
function parseInlineDirectives(body, options) {
  var _a = (0, directives_js_1.extractThinkDirective)(body),
    thinkCleaned = _a.cleaned,
    thinkLevel = _a.thinkLevel,
    rawThinkLevel = _a.rawLevel,
    hasThinkDirective = _a.hasDirective;
  var _b = (0, directives_js_1.extractVerboseDirective)(thinkCleaned),
    verboseCleaned = _b.cleaned,
    verboseLevel = _b.verboseLevel,
    rawVerboseLevel = _b.rawLevel,
    hasVerboseDirective = _b.hasDirective;
  var _c = (0, directives_js_1.extractReasoningDirective)(verboseCleaned),
    reasoningCleaned = _c.cleaned,
    reasoningLevel = _c.reasoningLevel,
    rawReasoningLevel = _c.rawLevel,
    hasReasoningDirective = _c.hasDirective;
  var _d = (options === null || options === void 0 ? void 0 : options.disableElevated)
      ? {
          cleaned: reasoningCleaned,
          elevatedLevel: undefined,
          rawLevel: undefined,
          hasDirective: false,
        }
      : (0, directives_js_1.extractElevatedDirective)(reasoningCleaned),
    elevatedCleaned = _d.cleaned,
    elevatedLevel = _d.elevatedLevel,
    rawElevatedLevel = _d.rawLevel,
    hasElevatedDirective = _d.hasDirective;
  var _e = (0, directives_js_1.extractExecDirective)(elevatedCleaned),
    execCleaned = _e.cleaned,
    execHost = _e.execHost,
    execSecurity = _e.execSecurity,
    execAsk = _e.execAsk,
    execNode = _e.execNode,
    rawExecHost = _e.rawExecHost,
    rawExecSecurity = _e.rawExecSecurity,
    rawExecAsk = _e.rawExecAsk,
    rawExecNode = _e.rawExecNode,
    hasExecOptions = _e.hasExecOptions,
    invalidExecHost = _e.invalidHost,
    invalidExecSecurity = _e.invalidSecurity,
    invalidExecAsk = _e.invalidAsk,
    invalidExecNode = _e.invalidNode,
    hasExecDirective = _e.hasDirective;
  var allowStatusDirective =
    (options === null || options === void 0 ? void 0 : options.allowStatusDirective) !== false;
  var _f = allowStatusDirective
      ? (0, directives_js_1.extractStatusDirective)(execCleaned)
      : { cleaned: execCleaned, hasDirective: false },
    statusCleaned = _f.cleaned,
    hasStatusDirective = _f.hasDirective;
  var _g = (0, model_js_1.extractModelDirective)(statusCleaned, {
      aliases: options === null || options === void 0 ? void 0 : options.modelAliases,
    }),
    modelCleaned = _g.cleaned,
    rawModel = _g.rawModel,
    rawProfile = _g.rawProfile,
    hasModelDirective = _g.hasDirective;
  var _h = (0, queue_js_1.extractQueueDirective)(modelCleaned),
    queueCleaned = _h.cleaned,
    queueMode = _h.queueMode,
    queueReset = _h.queueReset,
    rawMode = _h.rawMode,
    debounceMs = _h.debounceMs,
    cap = _h.cap,
    dropPolicy = _h.dropPolicy,
    rawDebounce = _h.rawDebounce,
    rawCap = _h.rawCap,
    rawDrop = _h.rawDrop,
    hasQueueDirective = _h.hasDirective,
    hasQueueOptions = _h.hasOptions;
  return {
    cleaned: queueCleaned,
    hasThinkDirective: hasThinkDirective,
    thinkLevel: thinkLevel,
    rawThinkLevel: rawThinkLevel,
    hasVerboseDirective: hasVerboseDirective,
    verboseLevel: verboseLevel,
    rawVerboseLevel: rawVerboseLevel,
    hasReasoningDirective: hasReasoningDirective,
    reasoningLevel: reasoningLevel,
    rawReasoningLevel: rawReasoningLevel,
    hasElevatedDirective: hasElevatedDirective,
    elevatedLevel: elevatedLevel,
    rawElevatedLevel: rawElevatedLevel,
    hasExecDirective: hasExecDirective,
    execHost: execHost,
    execSecurity: execSecurity,
    execAsk: execAsk,
    execNode: execNode,
    rawExecHost: rawExecHost,
    rawExecSecurity: rawExecSecurity,
    rawExecAsk: rawExecAsk,
    rawExecNode: rawExecNode,
    hasExecOptions: hasExecOptions,
    invalidExecHost: invalidExecHost,
    invalidExecSecurity: invalidExecSecurity,
    invalidExecAsk: invalidExecAsk,
    invalidExecNode: invalidExecNode,
    hasStatusDirective: hasStatusDirective,
    hasModelDirective: hasModelDirective,
    rawModelDirective: rawModel,
    rawModelProfile: rawProfile,
    hasQueueDirective: hasQueueDirective,
    queueMode: queueMode,
    queueReset: queueReset,
    rawQueueMode: rawMode,
    debounceMs: debounceMs,
    cap: cap,
    dropPolicy: dropPolicy,
    rawDebounce: rawDebounce,
    rawCap: rawCap,
    rawDrop: rawDrop,
    hasQueueOptions: hasQueueOptions,
  };
}
function isDirectiveOnly(params) {
  var directives = params.directives,
    cleanedBody = params.cleanedBody,
    ctx = params.ctx,
    cfg = params.cfg,
    agentId = params.agentId,
    isGroup = params.isGroup;
  if (
    !directives.hasThinkDirective &&
    !directives.hasVerboseDirective &&
    !directives.hasReasoningDirective &&
    !directives.hasElevatedDirective &&
    !directives.hasExecDirective &&
    !directives.hasModelDirective &&
    !directives.hasQueueDirective
  ) {
    return false;
  }
  var stripped = (0, mentions_js_1.stripStructuralPrefixes)(
    cleanedBody !== null && cleanedBody !== void 0 ? cleanedBody : "",
  );
  var noMentions = isGroup
    ? (0, mentions_js_1.stripMentions)(stripped, ctx, cfg, agentId)
    : stripped;
  return noMentions.length === 0;
}
