"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveCommandAuthorization = resolveCommandAuthorization;
var dock_js_1 = require("../channels/dock.js");
var registry_js_1 = require("../channels/registry.js");
function resolveProviderFromContext(ctx, cfg) {
  var _a, _b;
  var direct =
    (_b =
      (_a = (0, registry_js_1.normalizeAnyChannelId)(ctx.Provider)) !== null && _a !== void 0
        ? _a
        : (0, registry_js_1.normalizeAnyChannelId)(ctx.Surface)) !== null && _b !== void 0
      ? _b
      : (0, registry_js_1.normalizeAnyChannelId)(ctx.OriginatingChannel);
  if (direct) {
    return direct;
  }
  var candidates = [ctx.From, ctx.To]
    .filter(function (value) {
      return Boolean(value === null || value === void 0 ? void 0 : value.trim());
    })
    .flatMap(function (value) {
      return value.split(":").map(function (part) {
        return part.trim();
      });
    });
  for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
    var candidate = candidates_1[_i];
    var normalized = (0, registry_js_1.normalizeAnyChannelId)(candidate);
    if (normalized) {
      return normalized;
    }
  }
  var configured = (0, dock_js_1.listChannelDocks)()
    .map(function (dock) {
      var _a;
      if (!((_a = dock.config) === null || _a === void 0 ? void 0 : _a.resolveAllowFrom)) {
        return null;
      }
      var allowFrom = dock.config.resolveAllowFrom({
        cfg: cfg,
        accountId: ctx.AccountId,
      });
      if (!Array.isArray(allowFrom) || allowFrom.length === 0) {
        return null;
      }
      return dock.id;
    })
    .filter(function (value) {
      return Boolean(value);
    });
  if (configured.length === 1) {
    return configured[0];
  }
  return undefined;
}
function formatAllowFromList(params) {
  var _a;
  var dock = params.dock,
    cfg = params.cfg,
    accountId = params.accountId,
    allowFrom = params.allowFrom;
  if (!allowFrom || allowFrom.length === 0) {
    return [];
  }
  if (
    (_a = dock === null || dock === void 0 ? void 0 : dock.config) === null || _a === void 0
      ? void 0
      : _a.formatAllowFrom
  ) {
    return dock.config.formatAllowFrom({ cfg: cfg, accountId: accountId, allowFrom: allowFrom });
  }
  return allowFrom
    .map(function (entry) {
      return String(entry).trim();
    })
    .filter(Boolean);
}
function normalizeAllowFromEntry(params) {
  var normalized = formatAllowFromList({
    dock: params.dock,
    cfg: params.cfg,
    accountId: params.accountId,
    allowFrom: [params.value],
  });
  return normalized.filter(function (entry) {
    return entry.trim().length > 0;
  });
}
function resolveSenderCandidates(params) {
  var dock = params.dock,
    cfg = params.cfg,
    accountId = params.accountId;
  var candidates = [];
  var pushCandidate = function (value) {
    var trimmed = (value !== null && value !== void 0 ? value : "").trim();
    if (!trimmed) {
      return;
    }
    candidates.push(trimmed);
  };
  if (params.providerId === "whatsapp") {
    pushCandidate(params.senderE164);
    pushCandidate(params.senderId);
  } else {
    pushCandidate(params.senderId);
    pushCandidate(params.senderE164);
  }
  pushCandidate(params.from);
  var normalized = [];
  for (var _i = 0, candidates_2 = candidates; _i < candidates_2.length; _i++) {
    var sender = candidates_2[_i];
    var entries = normalizeAllowFromEntry({
      dock: dock,
      cfg: cfg,
      accountId: accountId,
      value: sender,
    });
    for (var _a = 0, entries_1 = entries; _a < entries_1.length; _a++) {
      var entry = entries_1[_a];
      if (!normalized.includes(entry)) {
        normalized.push(entry);
      }
    }
  }
  return normalized;
}
function resolveCommandAuthorization(params) {
  var _a, _b, _c, _d;
  var ctx = params.ctx,
    cfg = params.cfg,
    commandAuthorized = params.commandAuthorized;
  var providerId = resolveProviderFromContext(ctx, cfg);
  var dock = providerId ? (0, dock_js_1.getChannelDock)(providerId) : undefined;
  var from = ((_a = ctx.From) !== null && _a !== void 0 ? _a : "").trim();
  var to = ((_b = ctx.To) !== null && _b !== void 0 ? _b : "").trim();
  var allowFromRaw = (
    (_c = dock === null || dock === void 0 ? void 0 : dock.config) === null || _c === void 0
      ? void 0
      : _c.resolveAllowFrom
  )
    ? dock.config.resolveAllowFrom({ cfg: cfg, accountId: ctx.AccountId })
    : [];
  var allowFromList = formatAllowFromList({
    dock: dock,
    cfg: cfg,
    accountId: ctx.AccountId,
    allowFrom: Array.isArray(allowFromRaw) ? allowFromRaw : [],
  });
  var allowAll =
    allowFromList.length === 0 ||
    allowFromList.some(function (entry) {
      return entry.trim() === "*";
    });
  var ownerCandidates = allowAll
    ? []
    : allowFromList.filter(function (entry) {
        return entry !== "*";
      });
  if (!allowAll && ownerCandidates.length === 0 && to) {
    var normalizedTo = normalizeAllowFromEntry({
      dock: dock,
      cfg: cfg,
      accountId: ctx.AccountId,
      value: to,
    });
    if (normalizedTo.length > 0) {
      ownerCandidates.push.apply(ownerCandidates, normalizedTo);
    }
  }
  var ownerList = Array.from(new Set(ownerCandidates));
  var senderCandidates = resolveSenderCandidates({
    dock: dock,
    providerId: providerId,
    cfg: cfg,
    accountId: ctx.AccountId,
    senderId: ctx.SenderId,
    senderE164: ctx.SenderE164,
    from: from,
  });
  var matchedSender = ownerList.length
    ? senderCandidates.find(function (candidate) {
        return ownerList.includes(candidate);
      })
    : undefined;
  var senderId =
    matchedSender !== null && matchedSender !== void 0 ? matchedSender : senderCandidates[0];
  var enforceOwner = Boolean(
    (_d = dock === null || dock === void 0 ? void 0 : dock.commands) === null || _d === void 0
      ? void 0
      : _d.enforceOwnerForCommands,
  );
  var isOwner = !enforceOwner || allowAll || ownerList.length === 0 || Boolean(matchedSender);
  var isAuthorizedSender = commandAuthorized && isOwner;
  return {
    providerId: providerId,
    ownerList: ownerList,
    senderId: senderId || undefined,
    isAuthorizedSender: isAuthorizedSender,
    from: from || undefined,
    to: to || undefined,
  };
}
