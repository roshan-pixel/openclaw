"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.persistInlineDirectives = persistInlineDirectives;
exports.resolveDefaultModel = resolveDefaultModel;
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var context_js_1 = require("../../agents/context.js");
var defaults_js_1 = require("../../agents/defaults.js");
var model_selection_js_1 = require("../../agents/model-selection.js");
var sessions_js_1 = require("../../config/sessions.js");
var system_events_js_1 = require("../../infra/system-events.js");
var level_overrides_js_1 = require("../../sessions/level-overrides.js");
var model_overrides_js_1 = require("../../sessions/model-overrides.js");
var directive_handling_auth_js_1 = require("./directive-handling.auth.js");
var directive_handling_shared_js_1 = require("./directive-handling.shared.js");
function persistInlineDirectives(params) {
    return __awaiter(this, void 0, void 0, function () {
        var directives, cfg, sessionEntry, sessionStore, sessionKey, storePath, elevatedEnabled, elevatedAllowed, defaultProvider, defaultModel, aliasIndex, allowedModelKeys, initialModelLabel, formatModelSwitchEvent, agentCfg, provider, model, activeAgentId, agentDir, prevElevatedLevel, prevReasoningLevel, elevatedChanged, reasoningChanged, updated, modelDirective, resolved, key, profileOverride, profileResolved, isDefault, modelUpdated, nextLabel, nextElevated, nextReasoning;
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    directives = params.directives, cfg = params.cfg, sessionEntry = params.sessionEntry, sessionStore = params.sessionStore, sessionKey = params.sessionKey, storePath = params.storePath, elevatedEnabled = params.elevatedEnabled, elevatedAllowed = params.elevatedAllowed, defaultProvider = params.defaultProvider, defaultModel = params.defaultModel, aliasIndex = params.aliasIndex, allowedModelKeys = params.allowedModelKeys, initialModelLabel = params.initialModelLabel, formatModelSwitchEvent = params.formatModelSwitchEvent, agentCfg = params.agentCfg;
                    provider = params.provider, model = params.model;
                    activeAgentId = sessionKey
                        ? (0, agent_scope_js_1.resolveSessionAgentId)({ sessionKey: sessionKey, config: cfg })
                        : (0, agent_scope_js_1.resolveDefaultAgentId)(cfg);
                    agentDir = (0, agent_scope_js_1.resolveAgentDir)(cfg, activeAgentId);
                    if (!(sessionEntry && sessionStore && sessionKey)) return [3 /*break*/, 3];
                    prevElevatedLevel = (_b = (_a = sessionEntry.elevatedLevel) !== null && _a !== void 0 ? _a : agentCfg === null || agentCfg === void 0 ? void 0 : agentCfg.elevatedDefault) !== null && _b !== void 0 ? _b : (elevatedAllowed ? "on" : "off");
                    prevReasoningLevel = (_c = sessionEntry.reasoningLevel) !== null && _c !== void 0 ? _c : "off";
                    elevatedChanged = directives.hasElevatedDirective &&
                        directives.elevatedLevel !== undefined &&
                        elevatedEnabled &&
                        elevatedAllowed;
                    reasoningChanged = directives.hasReasoningDirective && directives.reasoningLevel !== undefined;
                    updated = false;
                    if (directives.hasThinkDirective && directives.thinkLevel) {
                        if (directives.thinkLevel === "off") {
                            delete sessionEntry.thinkingLevel;
                        }
                        else {
                            sessionEntry.thinkingLevel = directives.thinkLevel;
                        }
                        updated = true;
                    }
                    if (directives.hasVerboseDirective && directives.verboseLevel) {
                        (0, level_overrides_js_1.applyVerboseOverride)(sessionEntry, directives.verboseLevel);
                        updated = true;
                    }
                    if (directives.hasReasoningDirective && directives.reasoningLevel) {
                        if (directives.reasoningLevel === "off") {
                            delete sessionEntry.reasoningLevel;
                        }
                        else {
                            sessionEntry.reasoningLevel = directives.reasoningLevel;
                        }
                        reasoningChanged =
                            reasoningChanged ||
                                (directives.reasoningLevel !== prevReasoningLevel &&
                                    directives.reasoningLevel !== undefined);
                        updated = true;
                    }
                    if (directives.hasElevatedDirective &&
                        directives.elevatedLevel &&
                        elevatedEnabled &&
                        elevatedAllowed) {
                        // Persist "off" explicitly so inline `/elevated off` overrides defaults.
                        sessionEntry.elevatedLevel = directives.elevatedLevel;
                        elevatedChanged =
                            elevatedChanged ||
                                (directives.elevatedLevel !== prevElevatedLevel && directives.elevatedLevel !== undefined);
                        updated = true;
                    }
                    if (directives.hasExecDirective && directives.hasExecOptions) {
                        if (directives.execHost) {
                            sessionEntry.execHost = directives.execHost;
                            updated = true;
                        }
                        if (directives.execSecurity) {
                            sessionEntry.execSecurity = directives.execSecurity;
                            updated = true;
                        }
                        if (directives.execAsk) {
                            sessionEntry.execAsk = directives.execAsk;
                            updated = true;
                        }
                        if (directives.execNode) {
                            sessionEntry.execNode = directives.execNode;
                            updated = true;
                        }
                    }
                    modelDirective = directives.hasModelDirective && params.effectiveModelDirective
                        ? params.effectiveModelDirective
                        : undefined;
                    if (modelDirective) {
                        resolved = (0, model_selection_js_1.resolveModelRefFromString)({
                            raw: modelDirective,
                            defaultProvider: defaultProvider,
                            aliasIndex: aliasIndex,
                        });
                        if (resolved) {
                            key = (0, model_selection_js_1.modelKey)(resolved.ref.provider, resolved.ref.model);
                            if (allowedModelKeys.size === 0 || allowedModelKeys.has(key)) {
                                profileOverride = void 0;
                                if (directives.rawModelProfile) {
                                    profileResolved = (0, directive_handling_auth_js_1.resolveProfileOverride)({
                                        rawProfile: directives.rawModelProfile,
                                        provider: resolved.ref.provider,
                                        cfg: cfg,
                                        agentDir: agentDir,
                                    });
                                    if (profileResolved.error) {
                                        throw new Error(profileResolved.error);
                                    }
                                    profileOverride = profileResolved.profileId;
                                }
                                isDefault = resolved.ref.provider === defaultProvider && resolved.ref.model === defaultModel;
                                modelUpdated = (0, model_overrides_js_1.applyModelOverrideToSessionEntry)({
                                    entry: sessionEntry,
                                    selection: {
                                        provider: resolved.ref.provider,
                                        model: resolved.ref.model,
                                        isDefault: isDefault,
                                    },
                                    profileOverride: profileOverride,
                                }).updated;
                                provider = resolved.ref.provider;
                                model = resolved.ref.model;
                                nextLabel = "".concat(provider, "/").concat(model);
                                if (nextLabel !== initialModelLabel) {
                                    (0, system_events_js_1.enqueueSystemEvent)(formatModelSwitchEvent(nextLabel, resolved.alias), {
                                        sessionKey: sessionKey,
                                        contextKey: "model:".concat(nextLabel),
                                    });
                                }
                                updated = updated || modelUpdated;
                            }
                        }
                    }
                    if (directives.hasQueueDirective && directives.queueReset) {
                        delete sessionEntry.queueMode;
                        delete sessionEntry.queueDebounceMs;
                        delete sessionEntry.queueCap;
                        delete sessionEntry.queueDrop;
                        updated = true;
                    }
                    if (!updated) return [3 /*break*/, 3];
                    sessionEntry.updatedAt = Date.now();
                    sessionStore[sessionKey] = sessionEntry;
                    if (!storePath) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
                            store[sessionKey] = sessionEntry;
                        })];
                case 1:
                    _h.sent();
                    _h.label = 2;
                case 2:
                    if (elevatedChanged) {
                        nextElevated = ((_d = sessionEntry.elevatedLevel) !== null && _d !== void 0 ? _d : "off");
                        (0, system_events_js_1.enqueueSystemEvent)((0, directive_handling_shared_js_1.formatElevatedEvent)(nextElevated), {
                            sessionKey: sessionKey,
                            contextKey: "mode:elevated",
                        });
                    }
                    if (reasoningChanged) {
                        nextReasoning = ((_e = sessionEntry.reasoningLevel) !== null && _e !== void 0 ? _e : "off");
                        (0, system_events_js_1.enqueueSystemEvent)((0, directive_handling_shared_js_1.formatReasoningEvent)(nextReasoning), {
                            sessionKey: sessionKey,
                            contextKey: "mode:reasoning",
                        });
                    }
                    _h.label = 3;
                case 3: return [2 /*return*/, {
                        provider: provider,
                        model: model,
                        contextTokens: (_g = (_f = agentCfg === null || agentCfg === void 0 ? void 0 : agentCfg.contextTokens) !== null && _f !== void 0 ? _f : (0, context_js_1.lookupContextTokens)(model)) !== null && _g !== void 0 ? _g : defaults_js_1.DEFAULT_CONTEXT_TOKENS,
                    }];
            }
        });
    });
}
function resolveDefaultModel(params) {
    var mainModel = (0, model_selection_js_1.resolveDefaultModelForAgent)({
        cfg: params.cfg,
        agentId: params.agentId,
    });
    var defaultProvider = mainModel.provider;
    var defaultModel = mainModel.model;
    var aliasIndex = (0, model_selection_js_1.buildModelAliasIndex)({
        cfg: params.cfg,
        defaultProvider: defaultProvider,
    });
    return { defaultProvider: defaultProvider, defaultModel: defaultModel, aliasIndex: aliasIndex };
}
