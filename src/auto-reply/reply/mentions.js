"use strict";
var __makeTemplateObject =
  (this && this.__makeTemplateObject) ||
  function (cooked, raw) {
    if (Object.defineProperty) {
      Object.defineProperty(cooked, "raw", { value: raw });
    } else {
      cooked.raw = raw;
    }
    return cooked;
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
exports.CURRENT_MESSAGE_MARKER = void 0;
exports.buildMentionRegexes = buildMentionRegexes;
exports.normalizeMentionText = normalizeMentionText;
exports.matchesMentionPatterns = matchesMentionPatterns;
exports.matchesMentionWithExplicit = matchesMentionWithExplicit;
exports.stripStructuralPrefixes = stripStructuralPrefixes;
exports.stripMentions = stripMentions;
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var dock_js_1 = require("../../channels/dock.js");
var index_js_1 = require("../../channels/plugins/index.js");
function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function deriveMentionPatterns(identity) {
  var _a, _b;
  var patterns = [];
  var name =
    (_a = identity === null || identity === void 0 ? void 0 : identity.name) === null ||
    _a === void 0
      ? void 0
      : _a.trim();
  if (name) {
    var parts = name.split(/\s+/).filter(Boolean).map(escapeRegExp);
    var re = parts.length
      ? parts.join(
          String.raw(
            templateObject_1 || (templateObject_1 = __makeTemplateObject(["s+"], ["\\s+"])),
          ),
        )
      : escapeRegExp(name);
    patterns.push(
      String.raw(
        templateObject_2 ||
          (templateObject_2 = __makeTemplateObject(["\b@?", "\b"], ["\\b@?", "\\b"])),
        re,
      ),
    );
  }
  var emoji =
    (_b = identity === null || identity === void 0 ? void 0 : identity.emoji) === null ||
    _b === void 0
      ? void 0
      : _b.trim();
  if (emoji) {
    patterns.push(escapeRegExp(emoji));
  }
  return patterns;
}
var BACKSPACE_CHAR = "\u0008";
exports.CURRENT_MESSAGE_MARKER = "[Current message - respond to this]";
function normalizeMentionPattern(pattern) {
  if (!pattern.includes(BACKSPACE_CHAR)) {
    return pattern;
  }
  return pattern.split(BACKSPACE_CHAR).join("\\b");
}
function normalizeMentionPatterns(patterns) {
  return patterns.map(normalizeMentionPattern);
}
function resolveMentionPatterns(cfg, agentId) {
  var _a, _b, _c;
  if (!cfg) {
    return [];
  }
  var agentConfig = agentId ? (0, agent_scope_js_1.resolveAgentConfig)(cfg, agentId) : undefined;
  var agentGroupChat =
    agentConfig === null || agentConfig === void 0 ? void 0 : agentConfig.groupChat;
  if (agentGroupChat && Object.hasOwn(agentGroupChat, "mentionPatterns")) {
    return (_a = agentGroupChat.mentionPatterns) !== null && _a !== void 0 ? _a : [];
  }
  var globalGroupChat = (_b = cfg.messages) === null || _b === void 0 ? void 0 : _b.groupChat;
  if (globalGroupChat && Object.hasOwn(globalGroupChat, "mentionPatterns")) {
    return (_c = globalGroupChat.mentionPatterns) !== null && _c !== void 0 ? _c : [];
  }
  var derived = deriveMentionPatterns(
    agentConfig === null || agentConfig === void 0 ? void 0 : agentConfig.identity,
  );
  return derived.length > 0 ? derived : [];
}
function buildMentionRegexes(cfg, agentId) {
  var patterns = normalizeMentionPatterns(resolveMentionPatterns(cfg, agentId));
  return patterns
    .map(function (pattern) {
      try {
        return new RegExp(pattern, "i");
      } catch (_a) {
        return null;
      }
    })
    .filter(function (value) {
      return Boolean(value);
    });
}
function normalizeMentionText(text) {
  return (text !== null && text !== void 0 ? text : "")
    .replace(/[\u200b-\u200f\u202a-\u202e\u2060-\u206f]/g, "")
    .toLowerCase();
}
function matchesMentionPatterns(text, mentionRegexes) {
  if (mentionRegexes.length === 0) {
    return false;
  }
  var cleaned = normalizeMentionText(text !== null && text !== void 0 ? text : "");
  if (!cleaned) {
    return false;
  }
  return mentionRegexes.some(function (re) {
    return re.test(cleaned);
  });
}
function matchesMentionWithExplicit(params) {
  var _a, _b, _c, _d;
  var cleaned = normalizeMentionText((_a = params.text) !== null && _a !== void 0 ? _a : "");
  var explicit =
    ((_b = params.explicit) === null || _b === void 0 ? void 0 : _b.isExplicitlyMentioned) === true;
  var explicitAvailable =
    ((_c = params.explicit) === null || _c === void 0 ? void 0 : _c.canResolveExplicit) === true;
  var hasAnyMention =
    ((_d = params.explicit) === null || _d === void 0 ? void 0 : _d.hasAnyMention) === true;
  if (hasAnyMention && explicitAvailable) {
    return (
      explicit ||
      params.mentionRegexes.some(function (re) {
        return re.test(cleaned);
      })
    );
  }
  if (!cleaned) {
    return explicit;
  }
  return (
    explicit ||
    params.mentionRegexes.some(function (re) {
      return re.test(cleaned);
    })
  );
}
function stripStructuralPrefixes(text) {
  // Ignore wrapper labels, timestamps, and sender prefixes so directive-only
  // detection still works in group batches that include history/context.
  var afterMarker = text.includes(exports.CURRENT_MESSAGE_MARKER)
    ? text
        .slice(text.indexOf(exports.CURRENT_MESSAGE_MARKER) + exports.CURRENT_MESSAGE_MARKER.length)
        .trimStart()
    : text;
  return afterMarker
    .replace(/\[[^\]]+\]\s*/g, "")
    .replace(/^[ \t]*[A-Za-z0-9+()\-_. ]+:\s*/gm, "")
    .replace(/\\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function stripMentions(text, ctx, cfg, agentId) {
  var _a, _b, _c;
  var result = text;
  var providerId = ctx.Provider ? (0, index_js_1.normalizeChannelId)(ctx.Provider) : null;
  var providerMentions = providerId
    ? (_a = (0, dock_js_1.getChannelDock)(providerId)) === null || _a === void 0
      ? void 0
      : _a.mentions
    : undefined;
  var patterns = normalizeMentionPatterns(
    __spreadArray(
      __spreadArray([], resolveMentionPatterns(cfg, agentId), true),
      (_c =
        (_b =
          providerMentions === null || providerMentions === void 0
            ? void 0
            : providerMentions.stripPatterns) === null || _b === void 0
          ? void 0
          : _b.call(providerMentions, { ctx: ctx, cfg: cfg, agentId: agentId })) !== null &&
        _c !== void 0
        ? _c
        : [],
      true,
    ),
  );
  for (var _i = 0, patterns_1 = patterns; _i < patterns_1.length; _i++) {
    var p = patterns_1[_i];
    try {
      var re = new RegExp(p, "gi");
      result = result.replace(re, " ");
    } catch (_d) {
      // ignore invalid regex
    }
  }
  if (
    providerMentions === null || providerMentions === void 0
      ? void 0
      : providerMentions.stripMentions
  ) {
    result = providerMentions.stripMentions({
      text: result,
      ctx: ctx,
      cfg: cfg,
      agentId: agentId,
    });
  }
  // Generic mention patterns like @123456789 or plain digits
  result = result.replace(/@[0-9+]{5,}/g, " ");
  return result.replace(/\s+/g, " ").trim();
}
var templateObject_1, templateObject_2;
