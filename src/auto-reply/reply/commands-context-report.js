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
exports.buildContextReply = buildContextReply;
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var pi_embedded_helpers_js_1 = require("../../agents/pi-embedded-helpers.js");
var pi_tools_js_1 = require("../../agents/pi-tools.js");
var sandbox_js_1 = require("../../agents/sandbox.js");
var skills_js_1 = require("../../agents/skills.js");
var refresh_js_1 = require("../../agents/skills/refresh.js");
var system_prompt_js_1 = require("../../agents/system-prompt.js");
var system_prompt_report_js_1 = require("../../agents/system-prompt-report.js");
var system_prompt_params_js_1 = require("../../agents/system-prompt-params.js");
var model_selection_js_1 = require("../../agents/model-selection.js");
var tool_summaries_js_1 = require("../../agents/tool-summaries.js");
var bootstrap_files_js_1 = require("../../agents/bootstrap-files.js");
var skills_remote_js_1 = require("../../infra/skills-remote.js");
var tts_js_1 = require("../../tts/tts.js");
function estimateTokensFromChars(chars) {
  return Math.ceil(Math.max(0, chars) / 4);
}
function formatInt(n) {
  return new Intl.NumberFormat("en-US").format(n);
}
function formatCharsAndTokens(chars) {
  return ""
    .concat(formatInt(chars), " chars (~")
    .concat(formatInt(estimateTokensFromChars(chars)), " tok)");
}
function parseContextArgs(commandBodyNormalized) {
  if (commandBodyNormalized === "/context") {
    return "";
  }
  if (commandBodyNormalized.startsWith("/context ")) {
    return commandBodyNormalized.slice(8).trim();
  }
  return "";
}
function formatListTop(entries, cap) {
  var sorted = __spreadArray([], entries, true).toSorted(function (a, b) {
    return b.value - a.value;
  });
  var top = sorted.slice(0, cap);
  var omitted = Math.max(0, sorted.length - top.length);
  var lines = top.map(function (e) {
    return "- ".concat(e.name, ": ").concat(formatCharsAndTokens(e.value));
  });
  return { lines: lines, omitted: omitted };
}
function resolveContextReport(params) {
  return __awaiter(this, void 0, void 0, function () {
    var existing,
      workspaceDir,
      bootstrapMaxChars,
      _a,
      bootstrapFiles,
      injectedFiles,
      skillsSnapshot,
      skillsPrompt,
      sandboxRuntime,
      tools,
      toolSummaries,
      toolNames,
      sessionAgentId,
      defaultModelRef,
      defaultModelLabel,
      _b,
      runtimeInfo,
      userTimezone,
      userTime,
      userTimeFormat,
      sandboxInfo,
      ttsHint,
      systemPrompt;
    var _c, _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
      switch (_j.label) {
        case 0:
          existing =
            (_c = params.sessionEntry) === null || _c === void 0 ? void 0 : _c.systemPromptReport;
          if (existing && existing.source === "run") {
            return [2 /*return*/, existing];
          }
          workspaceDir = params.workspaceDir;
          bootstrapMaxChars = (0, pi_embedded_helpers_js_1.resolveBootstrapMaxChars)(params.cfg);
          return [
            4 /*yield*/,
            (0, bootstrap_files_js_1.resolveBootstrapContextForRun)({
              workspaceDir: workspaceDir,
              config: params.cfg,
              sessionKey: params.sessionKey,
              sessionId:
                (_d = params.sessionEntry) === null || _d === void 0 ? void 0 : _d.sessionId,
            }),
          ];
        case 1:
          ((_a = _j.sent()),
            (bootstrapFiles = _a.bootstrapFiles),
            (injectedFiles = _a.contextFiles));
          skillsSnapshot = (function () {
            try {
              return (0, skills_js_1.buildWorkspaceSkillSnapshot)(workspaceDir, {
                config: params.cfg,
                eligibility: { remote: (0, skills_remote_js_1.getRemoteSkillEligibility)() },
                snapshotVersion: (0, refresh_js_1.getSkillsSnapshotVersion)(workspaceDir),
              });
            } catch (_a) {
              return { prompt: "", skills: [], resolvedSkills: [] };
            }
          })();
          skillsPrompt = (_e = skillsSnapshot.prompt) !== null && _e !== void 0 ? _e : "";
          sandboxRuntime = (0, sandbox_js_1.resolveSandboxRuntimeStatus)({
            cfg: params.cfg,
            sessionKey:
              (_f = params.ctx.SessionKey) !== null && _f !== void 0 ? _f : params.sessionKey,
          });
          tools = (function () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            try {
              return (0, pi_tools_js_1.createOpenClawCodingTools)({
                config: params.cfg,
                workspaceDir: workspaceDir,
                sessionKey: params.sessionKey,
                messageProvider: params.command.channel,
                groupId:
                  (_b =
                    (_a = params.sessionEntry) === null || _a === void 0 ? void 0 : _a.groupId) !==
                    null && _b !== void 0
                    ? _b
                    : undefined,
                groupChannel:
                  (_d =
                    (_c = params.sessionEntry) === null || _c === void 0
                      ? void 0
                      : _c.groupChannel) !== null && _d !== void 0
                    ? _d
                    : undefined,
                groupSpace:
                  (_f =
                    (_e = params.sessionEntry) === null || _e === void 0 ? void 0 : _e.space) !==
                    null && _f !== void 0
                    ? _f
                    : undefined,
                spawnedBy:
                  (_h =
                    (_g = params.sessionEntry) === null || _g === void 0
                      ? void 0
                      : _g.spawnedBy) !== null && _h !== void 0
                    ? _h
                    : undefined,
                modelProvider: params.provider,
                modelId: params.model,
              });
            } catch (_j) {
              return [];
            }
          })();
          toolSummaries = (0, tool_summaries_js_1.buildToolSummaryMap)(tools);
          toolNames = tools.map(function (t) {
            return t.name;
          });
          sessionAgentId = (0, agent_scope_js_1.resolveSessionAgentIds)({
            sessionKey: params.sessionKey,
            config: params.cfg,
          }).sessionAgentId;
          defaultModelRef = (0, model_selection_js_1.resolveDefaultModelForAgent)({
            cfg: params.cfg,
            agentId: sessionAgentId,
          });
          defaultModelLabel = ""
            .concat(defaultModelRef.provider, "/")
            .concat(defaultModelRef.model);
          ((_b = (0, system_prompt_params_js_1.buildSystemPromptParams)({
            config: params.cfg,
            agentId: sessionAgentId,
            workspaceDir: workspaceDir,
            cwd: process.cwd(),
            runtime: {
              host: "unknown",
              os: "unknown",
              arch: "unknown",
              node: process.version,
              model: "".concat(params.provider, "/").concat(params.model),
              defaultModel: defaultModelLabel,
            },
          })),
            (runtimeInfo = _b.runtimeInfo),
            (userTimezone = _b.userTimezone),
            (userTime = _b.userTime),
            (userTimeFormat = _b.userTimeFormat));
          sandboxInfo = sandboxRuntime.sandboxed
            ? {
                enabled: true,
                workspaceDir: workspaceDir,
                workspaceAccess: "rw",
                elevated: {
                  allowed: params.elevated.allowed,
                  defaultLevel:
                    (_g = params.resolvedElevatedLevel) !== null && _g !== void 0 ? _g : "off",
                },
              }
            : { enabled: false };
          ttsHint = params.cfg ? (0, tts_js_1.buildTtsSystemPromptHint)(params.cfg) : undefined;
          systemPrompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: workspaceDir,
            defaultThinkLevel: params.resolvedThinkLevel,
            reasoningLevel: params.resolvedReasoningLevel,
            extraSystemPrompt: undefined,
            ownerNumbers: undefined,
            reasoningTagHint: false,
            toolNames: toolNames,
            toolSummaries: toolSummaries,
            modelAliasLines: [],
            userTimezone: userTimezone,
            userTime: userTime,
            userTimeFormat: userTimeFormat,
            contextFiles: injectedFiles,
            skillsPrompt: skillsPrompt,
            heartbeatPrompt: undefined,
            ttsHint: ttsHint,
            runtimeInfo: runtimeInfo,
            sandboxInfo: sandboxInfo,
          });
          return [
            2 /*return*/,
            (0, system_prompt_report_js_1.buildSystemPromptReport)({
              source: "estimate",
              generatedAt: Date.now(),
              sessionId:
                (_h = params.sessionEntry) === null || _h === void 0 ? void 0 : _h.sessionId,
              sessionKey: params.sessionKey,
              provider: params.provider,
              model: params.model,
              workspaceDir: workspaceDir,
              bootstrapMaxChars: bootstrapMaxChars,
              sandbox: { mode: sandboxRuntime.mode, sandboxed: sandboxRuntime.sandboxed },
              systemPrompt: systemPrompt,
              bootstrapFiles: bootstrapFiles,
              injectedFiles: injectedFiles,
              skillsPrompt: skillsPrompt,
              tools: tools,
            }),
          ];
      }
    });
  });
}
function buildContextReply(params) {
  return __awaiter(this, void 0, void 0, function () {
    var args,
      sub,
      report,
      session,
      fileLines,
      sandboxLine,
      toolSchemaLine,
      toolListLine,
      skillNameSet,
      skillNames,
      toolNames,
      formatNameList,
      skillsLine,
      skillsNamesLine,
      toolsNamesLine,
      systemPromptLine,
      workspaceLabel,
      bootstrapMaxLabel,
      totalsLine,
      perSkill,
      perToolSchema,
      perToolSummary,
      toolPropsLines;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    return __generator(this, function (_s) {
      switch (_s.label) {
        case 0:
          args = parseContextArgs(params.command.commandBodyNormalized);
          sub =
            (_b =
              (_a = args.split(/\s+/).filter(Boolean)[0]) === null || _a === void 0
                ? void 0
                : _a.toLowerCase()) !== null && _b !== void 0
              ? _b
              : "";
          if (!sub || sub === "help") {
            return [
              2 /*return*/,
              {
                text: [
                  "🧠 /context",
                  "",
                  "What counts as context (high-level), plus a breakdown mode.",
                  "",
                  "Try:",
                  "- /context list   (short breakdown)",
                  "- /context detail (per-file + per-tool + per-skill + system prompt size)",
                  "- /context json   (same, machine-readable)",
                  "",
                  "Inline shortcut = a command token inside a normal message (e.g. “hey /status”). It runs immediately (allowlisted senders only) and is stripped before the model sees the remaining text.",
                ].join("\n"),
              },
            ];
          }
          return [4 /*yield*/, resolveContextReport(params)];
        case 1:
          report = _s.sent();
          session = {
            totalTokens:
              (_d =
                (_c = params.sessionEntry) === null || _c === void 0 ? void 0 : _c.totalTokens) !==
                null && _d !== void 0
                ? _d
                : null,
            inputTokens:
              (_f =
                (_e = params.sessionEntry) === null || _e === void 0 ? void 0 : _e.inputTokens) !==
                null && _f !== void 0
                ? _f
                : null,
            outputTokens:
              (_h =
                (_g = params.sessionEntry) === null || _g === void 0 ? void 0 : _g.outputTokens) !==
                null && _h !== void 0
                ? _h
                : null,
            contextTokens: (_j = params.contextTokens) !== null && _j !== void 0 ? _j : null,
          };
          if (sub === "json") {
            return [
              2 /*return*/,
              { text: JSON.stringify({ report: report, session: session }, null, 2) },
            ];
          }
          if (sub !== "list" && sub !== "show" && sub !== "detail" && sub !== "deep") {
            return [
              2 /*return*/,
              {
                text: [
                  "Unknown /context mode.",
                  "Use: /context, /context list, /context detail, or /context json",
                ].join("\n"),
              },
            ];
          }
          fileLines = report.injectedWorkspaceFiles.map(function (f) {
            var status = f.missing ? "MISSING" : f.truncated ? "TRUNCATED" : "OK";
            var raw = f.missing ? "0" : formatCharsAndTokens(f.rawChars);
            var injected = f.missing ? "0" : formatCharsAndTokens(f.injectedChars);
            return "- "
              .concat(f.name, ": ")
              .concat(status, " | raw ")
              .concat(raw, " | injected ")
              .concat(injected);
          });
          sandboxLine = "Sandbox: mode="
            .concat(
              (_l = (_k = report.sandbox) === null || _k === void 0 ? void 0 : _k.mode) !== null &&
                _l !== void 0
                ? _l
                : "unknown",
              " sandboxed=",
            )
            .concat(
              (_o = (_m = report.sandbox) === null || _m === void 0 ? void 0 : _m.sandboxed) !==
                null && _o !== void 0
                ? _o
                : false,
            );
          toolSchemaLine = "Tool schemas (JSON): ".concat(
            formatCharsAndTokens(report.tools.schemaChars),
            " (counts toward context; not shown as text)",
          );
          toolListLine = "Tool list (system prompt text): ".concat(
            formatCharsAndTokens(report.tools.listChars),
          );
          skillNameSet = new Set(
            report.skills.entries.map(function (s) {
              return s.name;
            }),
          );
          skillNames = Array.from(skillNameSet);
          toolNames = report.tools.entries.map(function (t) {
            return t.name;
          });
          formatNameList = function (names, cap) {
            return names.length <= cap
              ? names.join(", ")
              : ""
                  .concat(names.slice(0, cap).join(", "), ", \u2026 (+")
                  .concat(names.length - cap, " more)");
          };
          skillsLine = "Skills list (system prompt text): "
            .concat(formatCharsAndTokens(report.skills.promptChars), " (")
            .concat(skillNameSet.size, " skills)");
          skillsNamesLine = skillNameSet.size
            ? "Skills: ".concat(formatNameList(skillNames, 20))
            : "Skills: (none)";
          toolsNamesLine = toolNames.length
            ? "Tools: ".concat(formatNameList(toolNames, 30))
            : "Tools: (none)";
          systemPromptLine = "System prompt ("
            .concat(report.source, "): ")
            .concat(formatCharsAndTokens(report.systemPrompt.chars), " (Project Context ")
            .concat(formatCharsAndTokens(report.systemPrompt.projectContextChars), ")");
          workspaceLabel =
            (_p = report.workspaceDir) !== null && _p !== void 0 ? _p : params.workspaceDir;
          bootstrapMaxLabel =
            typeof report.bootstrapMaxChars === "number"
              ? "".concat(formatInt(report.bootstrapMaxChars), " chars")
              : "? chars";
          totalsLine =
            session.totalTokens != null
              ? "Session tokens (cached): "
                  .concat(formatInt(session.totalTokens), " total / ctx=")
                  .concat((_q = session.contextTokens) !== null && _q !== void 0 ? _q : "?")
              : "Session tokens (cached): unknown / ctx=".concat(
                  (_r = session.contextTokens) !== null && _r !== void 0 ? _r : "?",
                );
          if (sub === "detail" || sub === "deep") {
            perSkill = formatListTop(
              report.skills.entries.map(function (s) {
                return { name: s.name, value: s.blockChars };
              }),
              30,
            );
            perToolSchema = formatListTop(
              report.tools.entries.map(function (t) {
                return { name: t.name, value: t.schemaChars };
              }),
              30,
            );
            perToolSummary = formatListTop(
              report.tools.entries.map(function (t) {
                return { name: t.name, value: t.summaryChars };
              }),
              30,
            );
            toolPropsLines = report.tools.entries
              .filter(function (t) {
                return t.propertiesCount != null;
              })
              .toSorted(function (a, b) {
                var _a, _b;
                return (
                  ((_a = b.propertiesCount) !== null && _a !== void 0 ? _a : 0) -
                  ((_b = a.propertiesCount) !== null && _b !== void 0 ? _b : 0)
                );
              })
              .slice(0, 30)
              .map(function (t) {
                return "- ".concat(t.name, ": ").concat(t.propertiesCount, " params");
              });
            return [
              2 /*return*/,
              {
                text: __spreadArray(
                  __spreadArray(
                    __spreadArray(
                      __spreadArray(
                        __spreadArray(
                          __spreadArray(
                            __spreadArray(
                              __spreadArray(
                                __spreadArray(
                                  __spreadArray(
                                    __spreadArray(
                                      __spreadArray(
                                        [
                                          "🧠 Context breakdown (detailed)",
                                          "Workspace: ".concat(workspaceLabel),
                                          "Bootstrap max/file: ".concat(bootstrapMaxLabel),
                                          sandboxLine,
                                          systemPromptLine,
                                          "",
                                          "Injected workspace files:",
                                        ],
                                        fileLines,
                                        true,
                                      ),
                                      ["", skillsLine, skillsNamesLine],
                                      false,
                                    ),
                                    perSkill.lines.length
                                      ? __spreadArray(
                                          ["Top skills (prompt entry size):"],
                                          perSkill.lines,
                                          true,
                                        )
                                      : [],
                                    true,
                                  ),
                                  perSkill.omitted
                                    ? ["\u2026 (+".concat(perSkill.omitted, " more skills)")]
                                    : [],
                                  true,
                                ),
                                [
                                  "",
                                  toolListLine,
                                  toolSchemaLine,
                                  toolsNamesLine,
                                  "Top tools (schema size):",
                                ],
                                false,
                              ),
                              perToolSchema.lines,
                              true,
                            ),
                            perToolSchema.omitted
                              ? ["\u2026 (+".concat(perToolSchema.omitted, " more tools)")]
                              : [],
                            true,
                          ),
                          ["", "Top tools (summary text size):"],
                          false,
                        ),
                        perToolSummary.lines,
                        true,
                      ),
                      perToolSummary.omitted
                        ? ["\u2026 (+".concat(perToolSummary.omitted, " more tools)")]
                        : [],
                      true,
                    ),
                    toolPropsLines.length
                      ? __spreadArray(["", "Tools (param count):"], toolPropsLines, true)
                      : [],
                    true,
                  ),
                  [
                    "",
                    totalsLine,
                    "",
                    "Inline shortcut: a command token inside normal text (e.g. “hey /status”) that runs immediately (allowlisted senders only) and is stripped before the model sees the remaining message.",
                  ],
                  false,
                )
                  .filter(Boolean)
                  .join("\n"),
              },
            ];
          }
          return [
            2 /*return*/,
            {
              text: __spreadArray(
                __spreadArray(
                  [
                    "🧠 Context breakdown",
                    "Workspace: ".concat(workspaceLabel),
                    "Bootstrap max/file: ".concat(bootstrapMaxLabel),
                    sandboxLine,
                    systemPromptLine,
                    "",
                    "Injected workspace files:",
                  ],
                  fileLines,
                  true,
                ),
                [
                  "",
                  skillsLine,
                  skillsNamesLine,
                  toolListLine,
                  toolSchemaLine,
                  toolsNamesLine,
                  "",
                  totalsLine,
                  "",
                  "Inline shortcut: a command token inside normal text (e.g. “hey /status”) that runs immediately (allowlisted senders only) and is stripped before the model sees the remaining message.",
                ],
                false,
              ).join("\n"),
            },
          ];
      }
    });
  });
}
