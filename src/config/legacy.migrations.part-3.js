"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEGACY_CONFIG_MIGRATIONS_PART_3 = void 0;
var legacy_shared_js_1 = require("./legacy.shared.js");
// NOTE: tools.alsoAllow was introduced after legacy migrations; no legacy migration needed.
// tools.alsoAllow legacy migration intentionally omitted (field not shipped in prod).
exports.LEGACY_CONFIG_MIGRATIONS_PART_3 = [
  {
    id: "auth.anthropic-claude-cli-mode-oauth",
    describe: "Switch anthropic:claude-cli auth profile mode to oauth",
    apply: function (raw, changes) {
      var auth = (0, legacy_shared_js_1.getRecord)(raw.auth);
      var profiles = (0, legacy_shared_js_1.getRecord)(
        auth === null || auth === void 0 ? void 0 : auth.profiles,
      );
      if (!profiles) {
        return;
      }
      var claudeCli = (0, legacy_shared_js_1.getRecord)(profiles["anthropic:claude-cli"]);
      if (!claudeCli) {
        return;
      }
      if (claudeCli.mode !== "token") {
        return;
      }
      claudeCli.mode = "oauth";
      changes.push('Updated auth.profiles["anthropic:claude-cli"].mode → "oauth".');
    },
  },
  // tools.alsoAllow migration removed (field not shipped in prod; enforce via schema instead).
  {
    id: "tools.bash->tools.exec",
    describe: "Move tools.bash to tools.exec",
    apply: function (raw, changes) {
      var tools = (0, legacy_shared_js_1.ensureRecord)(raw, "tools");
      var bash = (0, legacy_shared_js_1.getRecord)(tools.bash);
      if (!bash) {
        return;
      }
      if (tools.exec === undefined) {
        tools.exec = bash;
        changes.push("Moved tools.bash → tools.exec.");
      } else {
        changes.push("Removed tools.bash (tools.exec already set).");
      }
      delete tools.bash;
    },
  },
  {
    id: "messages.tts.enabled->auto",
    describe: "Move messages.tts.enabled to messages.tts.auto",
    apply: function (raw, changes) {
      var messages = (0, legacy_shared_js_1.getRecord)(raw.messages);
      var tts = (0, legacy_shared_js_1.getRecord)(
        messages === null || messages === void 0 ? void 0 : messages.tts,
      );
      if (!tts) {
        return;
      }
      if (tts.auto !== undefined) {
        if ("enabled" in tts) {
          delete tts.enabled;
          changes.push("Removed messages.tts.enabled (messages.tts.auto already set).");
        }
        return;
      }
      if (typeof tts.enabled !== "boolean") {
        return;
      }
      tts.auto = tts.enabled ? "always" : "off";
      delete tts.enabled;
      changes.push(
        "Moved messages.tts.enabled \u2192 messages.tts.auto (".concat(String(tts.auto), ")."),
      );
    },
  },
  {
    id: "agent.defaults-v2",
    describe: "Move agent config to agents.defaults and tools",
    apply: function (raw, changes) {
      var _a;
      var agent = (0, legacy_shared_js_1.getRecord)(raw.agent);
      if (!agent) {
        return;
      }
      var agents = (0, legacy_shared_js_1.ensureRecord)(raw, "agents");
      var defaults =
        (_a = (0, legacy_shared_js_1.getRecord)(agents.defaults)) !== null && _a !== void 0
          ? _a
          : {};
      var tools = (0, legacy_shared_js_1.ensureRecord)(raw, "tools");
      var agentTools = (0, legacy_shared_js_1.getRecord)(agent.tools);
      if (agentTools) {
        if (tools.allow === undefined && agentTools.allow !== undefined) {
          tools.allow = agentTools.allow;
          changes.push("Moved agent.tools.allow → tools.allow.");
        }
        if (tools.deny === undefined && agentTools.deny !== undefined) {
          tools.deny = agentTools.deny;
          changes.push("Moved agent.tools.deny → tools.deny.");
        }
      }
      var elevated = (0, legacy_shared_js_1.getRecord)(agent.elevated);
      if (elevated) {
        if (tools.elevated === undefined) {
          tools.elevated = elevated;
          changes.push("Moved agent.elevated → tools.elevated.");
        } else {
          changes.push("Removed agent.elevated (tools.elevated already set).");
        }
      }
      var bash = (0, legacy_shared_js_1.getRecord)(agent.bash);
      if (bash) {
        if (tools.exec === undefined) {
          tools.exec = bash;
          changes.push("Moved agent.bash → tools.exec.");
        } else {
          changes.push("Removed agent.bash (tools.exec already set).");
        }
      }
      var sandbox = (0, legacy_shared_js_1.getRecord)(agent.sandbox);
      if (sandbox) {
        var sandboxTools = (0, legacy_shared_js_1.getRecord)(sandbox.tools);
        if (sandboxTools) {
          var toolsSandbox = (0, legacy_shared_js_1.ensureRecord)(tools, "sandbox");
          var toolPolicy = (0, legacy_shared_js_1.ensureRecord)(toolsSandbox, "tools");
          (0, legacy_shared_js_1.mergeMissing)(toolPolicy, sandboxTools);
          delete sandbox.tools;
          changes.push("Moved agent.sandbox.tools → tools.sandbox.tools.");
        }
      }
      var subagents = (0, legacy_shared_js_1.getRecord)(agent.subagents);
      if (subagents) {
        var subagentTools = (0, legacy_shared_js_1.getRecord)(subagents.tools);
        if (subagentTools) {
          var toolsSubagents = (0, legacy_shared_js_1.ensureRecord)(tools, "subagents");
          var toolPolicy = (0, legacy_shared_js_1.ensureRecord)(toolsSubagents, "tools");
          (0, legacy_shared_js_1.mergeMissing)(toolPolicy, subagentTools);
          delete subagents.tools;
          changes.push("Moved agent.subagents.tools → tools.subagents.tools.");
        }
      }
      var agentCopy = structuredClone(agent);
      delete agentCopy.tools;
      delete agentCopy.elevated;
      delete agentCopy.bash;
      if ((0, legacy_shared_js_1.isRecord)(agentCopy.sandbox)) {
        delete agentCopy.sandbox.tools;
      }
      if ((0, legacy_shared_js_1.isRecord)(agentCopy.subagents)) {
        delete agentCopy.subagents.tools;
      }
      (0, legacy_shared_js_1.mergeMissing)(defaults, agentCopy);
      agents.defaults = defaults;
      raw.agents = agents;
      delete raw.agent;
      changes.push("Moved agent → agents.defaults.");
    },
  },
  {
    id: "identity->agents.list",
    describe: "Move identity to agents.list[].identity",
    apply: function (raw, changes) {
      var identity = (0, legacy_shared_js_1.getRecord)(raw.identity);
      if (!identity) {
        return;
      }
      var agents = (0, legacy_shared_js_1.ensureRecord)(raw, "agents");
      var list = (0, legacy_shared_js_1.getAgentsList)(agents);
      var defaultId = (0, legacy_shared_js_1.resolveDefaultAgentIdFromRaw)(raw);
      var entry = (0, legacy_shared_js_1.ensureAgentEntry)(list, defaultId);
      if (entry.identity === undefined) {
        entry.identity = identity;
        changes.push('Moved identity \u2192 agents.list (id "'.concat(defaultId, '").identity.'));
      } else {
        changes.push("Removed identity (agents.list identity already set).");
      }
      agents.list = list;
      raw.agents = agents;
      delete raw.identity;
    },
  },
];
