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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEGACY_CONFIG_MIGRATIONS_PART_2 = void 0;
var legacy_shared_js_1 = require("./legacy.shared.js");
exports.LEGACY_CONFIG_MIGRATIONS_PART_2 = [
  {
    id: "agent.model-config-v2",
    describe:
      "Migrate legacy agent.model/allowedModels/modelAliases/modelFallbacks/imageModelFallbacks to agent.models + model lists",
    apply: function (raw, changes) {
      var _a;
      var agentRoot = (0, legacy_shared_js_1.getRecord)(raw.agent);
      var defaults = (0, legacy_shared_js_1.getRecord)(
        (_a = (0, legacy_shared_js_1.getRecord)(raw.agents)) === null || _a === void 0
          ? void 0
          : _a.defaults,
      );
      var agent = agentRoot !== null && agentRoot !== void 0 ? agentRoot : defaults;
      if (!agent) {
        return;
      }
      var label = agentRoot ? "agent" : "agents.defaults";
      var legacyModel = typeof agent.model === "string" ? String(agent.model) : undefined;
      var legacyImageModel =
        typeof agent.imageModel === "string" ? String(agent.imageModel) : undefined;
      var legacyAllowed = Array.isArray(agent.allowedModels) ? agent.allowedModels.map(String) : [];
      var legacyModelFallbacks = Array.isArray(agent.modelFallbacks)
        ? agent.modelFallbacks.map(String)
        : [];
      var legacyImageModelFallbacks = Array.isArray(agent.imageModelFallbacks)
        ? agent.imageModelFallbacks.map(String)
        : [];
      var legacyAliases =
        agent.modelAliases && typeof agent.modelAliases === "object" ? agent.modelAliases : {};
      var hasLegacy =
        legacyModel ||
        legacyImageModel ||
        legacyAllowed.length > 0 ||
        legacyModelFallbacks.length > 0 ||
        legacyImageModelFallbacks.length > 0 ||
        Object.keys(legacyAliases).length > 0;
      if (!hasLegacy) {
        return;
      }
      var models = agent.models && typeof agent.models === "object" ? agent.models : {};
      var ensureModel = function (rawKey) {
        if (typeof rawKey !== "string") {
          return;
        }
        var key = rawKey.trim();
        if (!key) {
          return;
        }
        if (!models[key]) {
          models[key] = {};
        }
      };
      ensureModel(legacyModel);
      ensureModel(legacyImageModel);
      for (var _i = 0, legacyAllowed_1 = legacyAllowed; _i < legacyAllowed_1.length; _i++) {
        var key = legacyAllowed_1[_i];
        ensureModel(key);
      }
      for (
        var _b = 0, legacyModelFallbacks_1 = legacyModelFallbacks;
        _b < legacyModelFallbacks_1.length;
        _b++
      ) {
        var key = legacyModelFallbacks_1[_b];
        ensureModel(key);
      }
      for (
        var _c = 0, legacyImageModelFallbacks_1 = legacyImageModelFallbacks;
        _c < legacyImageModelFallbacks_1.length;
        _c++
      ) {
        var key = legacyImageModelFallbacks_1[_c];
        ensureModel(key);
      }
      for (var _d = 0, _e = Object.values(legacyAliases); _d < _e.length; _d++) {
        var target = _e[_d];
        if (typeof target !== "string") {
          continue;
        }
        ensureModel(target);
      }
      for (var _f = 0, _g = Object.entries(legacyAliases); _f < _g.length; _f++) {
        var _h = _g[_f],
          alias = _h[0],
          targetRaw = _h[1];
        if (typeof targetRaw !== "string") {
          continue;
        }
        var target = targetRaw.trim();
        if (!target) {
          continue;
        }
        var entry = models[target] && typeof models[target] === "object" ? models[target] : {};
        if (!("alias" in entry)) {
          entry.alias = alias;
          models[target] = entry;
        }
      }
      var currentModel = agent.model && typeof agent.model === "object" ? agent.model : null;
      if (currentModel) {
        if (!currentModel.primary && legacyModel) {
          currentModel.primary = legacyModel;
        }
        if (
          legacyModelFallbacks.length > 0 &&
          (!Array.isArray(currentModel.fallbacks) || currentModel.fallbacks.length === 0)
        ) {
          currentModel.fallbacks = legacyModelFallbacks;
        }
        agent.model = currentModel;
      } else if (legacyModel || legacyModelFallbacks.length > 0) {
        agent.model = {
          primary: legacyModel,
          fallbacks: legacyModelFallbacks.length ? legacyModelFallbacks : [],
        };
      }
      var currentImageModel =
        agent.imageModel && typeof agent.imageModel === "object" ? agent.imageModel : null;
      if (currentImageModel) {
        if (!currentImageModel.primary && legacyImageModel) {
          currentImageModel.primary = legacyImageModel;
        }
        if (
          legacyImageModelFallbacks.length > 0 &&
          (!Array.isArray(currentImageModel.fallbacks) || currentImageModel.fallbacks.length === 0)
        ) {
          currentImageModel.fallbacks = legacyImageModelFallbacks;
        }
        agent.imageModel = currentImageModel;
      } else if (legacyImageModel || legacyImageModelFallbacks.length > 0) {
        agent.imageModel = {
          primary: legacyImageModel,
          fallbacks: legacyImageModelFallbacks.length ? legacyImageModelFallbacks : [],
        };
      }
      agent.models = models;
      if (legacyModel !== undefined) {
        changes.push(
          "Migrated ".concat(label, ".model string \u2192 ").concat(label, ".model.primary."),
        );
      }
      if (legacyModelFallbacks.length > 0) {
        changes.push(
          "Migrated ".concat(label, ".modelFallbacks \u2192 ").concat(label, ".model.fallbacks."),
        );
      }
      if (legacyImageModel !== undefined) {
        changes.push(
          "Migrated "
            .concat(label, ".imageModel string \u2192 ")
            .concat(label, ".imageModel.primary."),
        );
      }
      if (legacyImageModelFallbacks.length > 0) {
        changes.push(
          "Migrated "
            .concat(label, ".imageModelFallbacks \u2192 ")
            .concat(label, ".imageModel.fallbacks."),
        );
      }
      if (legacyAllowed.length > 0) {
        changes.push("Migrated ".concat(label, ".allowedModels \u2192 ").concat(label, ".models."));
      }
      if (Object.keys(legacyAliases).length > 0) {
        changes.push(
          "Migrated ".concat(label, ".modelAliases \u2192 ").concat(label, ".models.*.alias."),
        );
      }
      delete agent.allowedModels;
      delete agent.modelAliases;
      delete agent.modelFallbacks;
      delete agent.imageModelFallbacks;
    },
  },
  {
    id: "routing.agents-v2",
    describe: "Move routing.agents/defaultAgentId to agents.list",
    apply: function (raw, changes) {
      var routing = (0, legacy_shared_js_1.getRecord)(raw.routing);
      if (!routing) {
        return;
      }
      var routingAgents = (0, legacy_shared_js_1.getRecord)(routing.agents);
      var agents = (0, legacy_shared_js_1.ensureRecord)(raw, "agents");
      var list = (0, legacy_shared_js_1.getAgentsList)(agents);
      if (routingAgents) {
        for (var _i = 0, _a = Object.entries(routingAgents); _i < _a.length; _i++) {
          var _b = _a[_i],
            rawId = _b[0],
            entryRaw = _b[1];
          var agentId = String(rawId !== null && rawId !== void 0 ? rawId : "").trim();
          var entry = (0, legacy_shared_js_1.getRecord)(entryRaw);
          if (!agentId || !entry) {
            continue;
          }
          var target = (0, legacy_shared_js_1.ensureAgentEntry)(list, agentId);
          var entryCopy = __assign({}, entry);
          if ("mentionPatterns" in entryCopy) {
            var mentionPatterns = entryCopy.mentionPatterns;
            var groupChat = (0, legacy_shared_js_1.ensureRecord)(target, "groupChat");
            if (groupChat.mentionPatterns === undefined) {
              groupChat.mentionPatterns = mentionPatterns;
              changes.push(
                "Moved routing.agents."
                  .concat(agentId, '.mentionPatterns \u2192 agents.list (id "')
                  .concat(agentId, '").groupChat.mentionPatterns.'),
              );
            } else {
              changes.push(
                "Removed routing.agents.".concat(
                  agentId,
                  ".mentionPatterns (agents.list groupChat mentionPatterns already set).",
                ),
              );
            }
            delete entryCopy.mentionPatterns;
          }
          var legacyGroupChat = (0, legacy_shared_js_1.getRecord)(entryCopy.groupChat);
          if (legacyGroupChat) {
            var groupChat = (0, legacy_shared_js_1.ensureRecord)(target, "groupChat");
            (0, legacy_shared_js_1.mergeMissing)(groupChat, legacyGroupChat);
            delete entryCopy.groupChat;
          }
          var legacySandbox = (0, legacy_shared_js_1.getRecord)(entryCopy.sandbox);
          if (legacySandbox) {
            var sandboxTools = (0, legacy_shared_js_1.getRecord)(legacySandbox.tools);
            if (sandboxTools) {
              var tools = (0, legacy_shared_js_1.ensureRecord)(target, "tools");
              var sandbox = (0, legacy_shared_js_1.ensureRecord)(tools, "sandbox");
              var toolPolicy = (0, legacy_shared_js_1.ensureRecord)(sandbox, "tools");
              (0, legacy_shared_js_1.mergeMissing)(toolPolicy, sandboxTools);
              delete legacySandbox.tools;
              changes.push(
                "Moved routing.agents."
                  .concat(agentId, '.sandbox.tools \u2192 agents.list (id "')
                  .concat(agentId, '").tools.sandbox.tools.'),
              );
            }
            entryCopy.sandbox = legacySandbox;
          }
          (0, legacy_shared_js_1.mergeMissing)(target, entryCopy);
        }
        delete routing.agents;
        changes.push("Moved routing.agents → agents.list.");
      }
      var defaultAgentId =
        typeof routing.defaultAgentId === "string" ? routing.defaultAgentId.trim() : "";
      if (defaultAgentId) {
        var hasDefault = list.some(function (entry) {
          return (0, legacy_shared_js_1.isRecord)(entry) && entry.default === true;
        });
        if (!hasDefault) {
          var entry = (0, legacy_shared_js_1.ensureAgentEntry)(list, defaultAgentId);
          entry.default = true;
          changes.push(
            'Moved routing.defaultAgentId \u2192 agents.list (id "'.concat(
              defaultAgentId,
              '").default.',
            ),
          );
        } else {
          changes.push("Removed routing.defaultAgentId (agents.list default already set).");
        }
        delete routing.defaultAgentId;
      }
      if (list.length > 0) {
        agents.list = list;
      }
      if (Object.keys(routing).length === 0) {
        delete raw.routing;
      }
    },
  },
  {
    id: "routing.config-v2",
    describe: "Move routing bindings/groupChat/queue/agentToAgent/transcribeAudio",
    apply: function (raw, changes) {
      var routing = (0, legacy_shared_js_1.getRecord)(raw.routing);
      if (!routing) {
        return;
      }
      if (routing.bindings !== undefined) {
        if (raw.bindings === undefined) {
          raw.bindings = routing.bindings;
          changes.push("Moved routing.bindings → bindings.");
        } else {
          changes.push("Removed routing.bindings (bindings already set).");
        }
        delete routing.bindings;
      }
      if (routing.agentToAgent !== undefined) {
        var tools = (0, legacy_shared_js_1.ensureRecord)(raw, "tools");
        if (tools.agentToAgent === undefined) {
          tools.agentToAgent = routing.agentToAgent;
          changes.push("Moved routing.agentToAgent → tools.agentToAgent.");
        } else {
          changes.push("Removed routing.agentToAgent (tools.agentToAgent already set).");
        }
        delete routing.agentToAgent;
      }
      if (routing.queue !== undefined) {
        var messages = (0, legacy_shared_js_1.ensureRecord)(raw, "messages");
        if (messages.queue === undefined) {
          messages.queue = routing.queue;
          changes.push("Moved routing.queue → messages.queue.");
        } else {
          changes.push("Removed routing.queue (messages.queue already set).");
        }
        delete routing.queue;
      }
      var groupChat = (0, legacy_shared_js_1.getRecord)(routing.groupChat);
      if (groupChat) {
        var historyLimit = groupChat.historyLimit;
        if (historyLimit !== undefined) {
          var messages = (0, legacy_shared_js_1.ensureRecord)(raw, "messages");
          var messagesGroup = (0, legacy_shared_js_1.ensureRecord)(messages, "groupChat");
          if (messagesGroup.historyLimit === undefined) {
            messagesGroup.historyLimit = historyLimit;
            changes.push("Moved routing.groupChat.historyLimit → messages.groupChat.historyLimit.");
          } else {
            changes.push(
              "Removed routing.groupChat.historyLimit (messages.groupChat.historyLimit already set).",
            );
          }
          delete groupChat.historyLimit;
        }
        var mentionPatterns = groupChat.mentionPatterns;
        if (mentionPatterns !== undefined) {
          var messages = (0, legacy_shared_js_1.ensureRecord)(raw, "messages");
          var messagesGroup = (0, legacy_shared_js_1.ensureRecord)(messages, "groupChat");
          if (messagesGroup.mentionPatterns === undefined) {
            messagesGroup.mentionPatterns = mentionPatterns;
            changes.push(
              "Moved routing.groupChat.mentionPatterns → messages.groupChat.mentionPatterns.",
            );
          } else {
            changes.push(
              "Removed routing.groupChat.mentionPatterns (messages.groupChat.mentionPatterns already set).",
            );
          }
          delete groupChat.mentionPatterns;
        }
        if (Object.keys(groupChat).length === 0) {
          delete routing.groupChat;
        } else {
          routing.groupChat = groupChat;
        }
      }
      if (routing.transcribeAudio !== undefined) {
        var mapped = (0, legacy_shared_js_1.mapLegacyAudioTranscription)(routing.transcribeAudio);
        if (mapped) {
          var tools = (0, legacy_shared_js_1.ensureRecord)(raw, "tools");
          var media = (0, legacy_shared_js_1.ensureRecord)(tools, "media");
          var mediaAudio = (0, legacy_shared_js_1.ensureRecord)(media, "audio");
          var models = Array.isArray(mediaAudio.models) ? mediaAudio.models : [];
          if (models.length === 0) {
            mediaAudio.enabled = true;
            mediaAudio.models = [mapped];
            changes.push("Moved routing.transcribeAudio → tools.media.audio.models.");
          } else {
            changes.push("Removed routing.transcribeAudio (tools.media.audio.models already set).");
          }
        } else {
          changes.push("Removed routing.transcribeAudio (unsupported transcription CLI).");
        }
        delete routing.transcribeAudio;
      }
      var audio = (0, legacy_shared_js_1.getRecord)(raw.audio);
      if ((audio === null || audio === void 0 ? void 0 : audio.transcription) !== undefined) {
        var mapped = (0, legacy_shared_js_1.mapLegacyAudioTranscription)(audio.transcription);
        if (mapped) {
          var tools = (0, legacy_shared_js_1.ensureRecord)(raw, "tools");
          var media = (0, legacy_shared_js_1.ensureRecord)(tools, "media");
          var mediaAudio = (0, legacy_shared_js_1.ensureRecord)(media, "audio");
          var models = Array.isArray(mediaAudio.models) ? mediaAudio.models : [];
          if (models.length === 0) {
            mediaAudio.enabled = true;
            mediaAudio.models = [mapped];
            changes.push("Moved audio.transcription → tools.media.audio.models.");
          } else {
            changes.push("Removed audio.transcription (tools.media.audio.models already set).");
          }
          delete audio.transcription;
          if (Object.keys(audio).length === 0) {
            delete raw.audio;
          } else {
            raw.audio = audio;
          }
        } else {
          delete audio.transcription;
          changes.push("Removed audio.transcription (unsupported transcription CLI).");
          if (Object.keys(audio).length === 0) {
            delete raw.audio;
          } else {
            raw.audio = audio;
          }
        }
      }
      if (Object.keys(routing).length === 0) {
        delete raw.routing;
      }
    },
  },
];
