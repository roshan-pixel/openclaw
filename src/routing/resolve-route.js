"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_AGENT_ID = exports.DEFAULT_ACCOUNT_ID = void 0;
exports.buildAgentSessionKey = buildAgentSessionKey;
exports.resolveAgentRoute = resolveAgentRoute;
var agent_scope_js_1 = require("../agents/agent-scope.js");
var bindings_js_1 = require("./bindings.js");
var session_key_js_1 = require("./session-key.js");
var session_key_js_2 = require("./session-key.js");
Object.defineProperty(exports, "DEFAULT_ACCOUNT_ID", {
  enumerable: true,
  get: function () {
    return session_key_js_2.DEFAULT_ACCOUNT_ID;
  },
});
Object.defineProperty(exports, "DEFAULT_AGENT_ID", {
  enumerable: true,
  get: function () {
    return session_key_js_2.DEFAULT_AGENT_ID;
  },
});
function normalizeToken(value) {
  return (value !== null && value !== void 0 ? value : "").trim().toLowerCase();
}
function normalizeId(value) {
  return (value !== null && value !== void 0 ? value : "").trim();
}
function normalizeAccountId(value) {
  var trimmed = (value !== null && value !== void 0 ? value : "").trim();
  return trimmed ? trimmed : session_key_js_1.DEFAULT_ACCOUNT_ID;
}
function matchesAccountId(match, actual) {
  var trimmed = (match !== null && match !== void 0 ? match : "").trim();
  if (!trimmed) {
    return actual === session_key_js_1.DEFAULT_ACCOUNT_ID;
  }
  if (trimmed === "*") {
    return true;
  }
  return trimmed === actual;
}
function buildAgentSessionKey(params) {
  var _a;
  var channel = normalizeToken(params.channel) || "unknown";
  var peer = params.peer;
  return (0, session_key_js_1.buildAgentPeerSessionKey)({
    agentId: params.agentId,
    mainKey: session_key_js_1.DEFAULT_MAIN_KEY,
    channel: channel,
    accountId: params.accountId,
    peerKind:
      (_a = peer === null || peer === void 0 ? void 0 : peer.kind) !== null && _a !== void 0
        ? _a
        : "dm",
    peerId: peer ? normalizeId(peer.id) || "unknown" : null,
    dmScope: params.dmScope,
    identityLinks: params.identityLinks,
  });
}
function listAgents(cfg) {
  var _a;
  var agents = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.list;
  return Array.isArray(agents) ? agents : [];
}
function pickFirstExistingAgentId(cfg, agentId) {
  var _a;
  var trimmed = (agentId !== null && agentId !== void 0 ? agentId : "").trim();
  if (!trimmed) {
    return (0, session_key_js_1.sanitizeAgentId)((0, agent_scope_js_1.resolveDefaultAgentId)(cfg));
  }
  var normalized = (0, session_key_js_1.normalizeAgentId)(trimmed);
  var agents = listAgents(cfg);
  if (agents.length === 0) {
    return (0, session_key_js_1.sanitizeAgentId)(trimmed);
  }
  var match = agents.find(function (agent) {
    return (0, session_key_js_1.normalizeAgentId)(agent.id) === normalized;
  });
  if (
    (_a = match === null || match === void 0 ? void 0 : match.id) === null || _a === void 0
      ? void 0
      : _a.trim()
  ) {
    return (0, session_key_js_1.sanitizeAgentId)(match.id.trim());
  }
  return (0, session_key_js_1.sanitizeAgentId)((0, agent_scope_js_1.resolveDefaultAgentId)(cfg));
}
function matchesChannel(match, channel) {
  var key = normalizeToken(match === null || match === void 0 ? void 0 : match.channel);
  if (!key) {
    return false;
  }
  return key === channel;
}
function matchesPeer(match, peer) {
  var m = match === null || match === void 0 ? void 0 : match.peer;
  if (!m) {
    return false;
  }
  var kind = normalizeToken(m.kind);
  var id = normalizeId(m.id);
  if (!kind || !id) {
    return false;
  }
  return kind === peer.kind && id === peer.id;
}
function matchesGuild(match, guildId) {
  var id = normalizeId(match === null || match === void 0 ? void 0 : match.guildId);
  if (!id) {
    return false;
  }
  return id === guildId;
}
function matchesTeam(match, teamId) {
  var id = normalizeId(match === null || match === void 0 ? void 0 : match.teamId);
  if (!id) {
    return false;
  }
  return id === teamId;
}
function resolveAgentRoute(input) {
  var _a, _b, _c;
  var channel = normalizeToken(input.channel);
  var accountId = normalizeAccountId(input.accountId);
  var peer = input.peer ? { kind: input.peer.kind, id: normalizeId(input.peer.id) } : null;
  var guildId = normalizeId(input.guildId);
  var teamId = normalizeId(input.teamId);
  var bindings = (0, bindings_js_1.listBindings)(input.cfg).filter(function (binding) {
    var _a;
    if (!binding || typeof binding !== "object") {
      return false;
    }
    if (!matchesChannel(binding.match, channel)) {
      return false;
    }
    return matchesAccountId(
      (_a = binding.match) === null || _a === void 0 ? void 0 : _a.accountId,
      accountId,
    );
  });
  var dmScope =
    (_b = (_a = input.cfg.session) === null || _a === void 0 ? void 0 : _a.dmScope) !== null &&
    _b !== void 0
      ? _b
      : "main";
  var identityLinks =
    (_c = input.cfg.session) === null || _c === void 0 ? void 0 : _c.identityLinks;
  var choose = function (agentId, matchedBy) {
    var resolvedAgentId = pickFirstExistingAgentId(input.cfg, agentId);
    var sessionKey = buildAgentSessionKey({
      agentId: resolvedAgentId,
      channel: channel,
      accountId: accountId,
      peer: peer,
      dmScope: dmScope,
      identityLinks: identityLinks,
    }).toLowerCase();
    var mainSessionKey = (0, session_key_js_1.buildAgentMainSessionKey)({
      agentId: resolvedAgentId,
      mainKey: session_key_js_1.DEFAULT_MAIN_KEY,
    }).toLowerCase();
    return {
      agentId: resolvedAgentId,
      channel: channel,
      accountId: accountId,
      sessionKey: sessionKey,
      mainSessionKey: mainSessionKey,
      matchedBy: matchedBy,
    };
  };
  if (peer) {
    var peerMatch = bindings.find(function (b) {
      return matchesPeer(b.match, peer);
    });
    if (peerMatch) {
      return choose(peerMatch.agentId, "binding.peer");
    }
  }
  if (guildId) {
    var guildMatch = bindings.find(function (b) {
      return matchesGuild(b.match, guildId);
    });
    if (guildMatch) {
      return choose(guildMatch.agentId, "binding.guild");
    }
  }
  if (teamId) {
    var teamMatch = bindings.find(function (b) {
      return matchesTeam(b.match, teamId);
    });
    if (teamMatch) {
      return choose(teamMatch.agentId, "binding.team");
    }
  }
  var accountMatch = bindings.find(function (b) {
    var _a, _b, _c, _d, _e;
    return (
      ((_b = (_a = b.match) === null || _a === void 0 ? void 0 : _a.accountId) === null ||
      _b === void 0
        ? void 0
        : _b.trim()) !== "*" &&
      !((_c = b.match) === null || _c === void 0 ? void 0 : _c.peer) &&
      !((_d = b.match) === null || _d === void 0 ? void 0 : _d.guildId) &&
      !((_e = b.match) === null || _e === void 0 ? void 0 : _e.teamId)
    );
  });
  if (accountMatch) {
    return choose(accountMatch.agentId, "binding.account");
  }
  var anyAccountMatch = bindings.find(function (b) {
    var _a, _b, _c, _d, _e;
    return (
      ((_b = (_a = b.match) === null || _a === void 0 ? void 0 : _a.accountId) === null ||
      _b === void 0
        ? void 0
        : _b.trim()) === "*" &&
      !((_c = b.match) === null || _c === void 0 ? void 0 : _c.peer) &&
      !((_d = b.match) === null || _d === void 0 ? void 0 : _d.guildId) &&
      !((_e = b.match) === null || _e === void 0 ? void 0 : _e.teamId)
    );
  });
  if (anyAccountMatch) {
    return choose(anyAccountMatch.agentId, "binding.channel");
  }
  return choose((0, agent_scope_js_1.resolveDefaultAgentId)(input.cfg), "default");
}
