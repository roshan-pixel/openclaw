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
exports.runCliAgent = runCliAgent;
exports.runClaudeCliAgent = runClaudeCliAgent;
var heartbeat_js_1 = require("../auto-reply/heartbeat.js");
var env_js_1 = require("../infra/env.js");
var globals_js_1 = require("../globals.js");
var subsystem_js_1 = require("../logging/subsystem.js");
var exec_js_1 = require("../process/exec.js");
var utils_js_1 = require("../utils.js");
var docs_path_js_1 = require("./docs-path.js");
var agent_scope_js_1 = require("./agent-scope.js");
var bootstrap_files_js_1 = require("./bootstrap-files.js");
var cli_backends_js_1 = require("./cli-backends.js");
var helpers_js_1 = require("./cli-runner/helpers.js");
var failover_error_js_1 = require("./failover-error.js");
var pi_embedded_helpers_js_1 = require("./pi-embedded-helpers.js");
var log = (0, subsystem_js_1.createSubsystemLogger)("agent/claude-cli");
function runCliAgent(params) {
  return __awaiter(this, void 0, void 0, function () {
    var started,
      resolvedWorkspace,
      workspaceDir,
      backendResolved,
      backend,
      modelId,
      normalizedModel,
      modelDisplay,
      extraSystemPrompt,
      sessionLabel,
      contextFiles,
      _a,
      defaultAgentId,
      sessionAgentId,
      heartbeatPrompt,
      docsPath,
      systemPrompt,
      _b,
      cliSessionIdToSend,
      isNew,
      useResume,
      sessionIdSent,
      systemPromptArg,
      imagePaths,
      cleanupImages,
      prompt,
      imagePayload,
      _c,
      argsPrompt,
      stdin,
      stdinPayload,
      baseArgs,
      resolvedArgs,
      args,
      serialize,
      queueKey,
      output,
      text,
      payloads,
      err_1,
      message,
      reason,
      status_1;
    var _this = this;
    var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    return __generator(this, function (_w) {
      switch (_w.label) {
        case 0:
          started = Date.now();
          resolvedWorkspace = (0, utils_js_1.resolveUserPath)(params.workspaceDir);
          workspaceDir = resolvedWorkspace;
          backendResolved = (0, cli_backends_js_1.resolveCliBackendConfig)(
            params.provider,
            params.config,
          );
          if (!backendResolved) {
            throw new Error("Unknown CLI backend: ".concat(params.provider));
          }
          backend = backendResolved.config;
          modelId =
            ((_d = params.model) !== null && _d !== void 0 ? _d : "default").trim() || "default";
          normalizedModel = (0, helpers_js_1.normalizeCliModel)(modelId, backend);
          modelDisplay = "".concat(params.provider, "/").concat(modelId);
          extraSystemPrompt = [
            (_e = params.extraSystemPrompt) === null || _e === void 0 ? void 0 : _e.trim(),
            "Tools are disabled in this session. Do not call tools.",
          ]
            .filter(Boolean)
            .join("\n");
          sessionLabel = (_f = params.sessionKey) !== null && _f !== void 0 ? _f : params.sessionId;
          return [
            4 /*yield*/,
            (0, bootstrap_files_js_1.resolveBootstrapContextForRun)({
              workspaceDir: workspaceDir,
              config: params.config,
              sessionKey: params.sessionKey,
              sessionId: params.sessionId,
              warn: (0, bootstrap_files_js_1.makeBootstrapWarn)({
                sessionLabel: sessionLabel,
                warn: function (message) {
                  return log.warn(message);
                },
              }),
            }),
          ];
        case 1:
          contextFiles = _w.sent().contextFiles;
          ((_a = (0, agent_scope_js_1.resolveSessionAgentIds)({
            sessionKey: params.sessionKey,
            config: params.config,
          })),
            (defaultAgentId = _a.defaultAgentId),
            (sessionAgentId = _a.sessionAgentId));
          heartbeatPrompt =
            sessionAgentId === defaultAgentId
              ? (0, heartbeat_js_1.resolveHeartbeatPrompt)(
                  (_k =
                    (_j =
                      (_h = (_g = params.config) === null || _g === void 0 ? void 0 : _g.agents) ===
                        null || _h === void 0
                        ? void 0
                        : _h.defaults) === null || _j === void 0
                      ? void 0
                      : _j.heartbeat) === null || _k === void 0
                    ? void 0
                    : _k.prompt,
                )
              : undefined;
          return [
            4 /*yield*/,
            (0, docs_path_js_1.resolveOpenClawDocsPath)({
              workspaceDir: workspaceDir,
              argv1: process.argv[1],
              cwd: process.cwd(),
              moduleUrl: import.meta.url,
            }),
          ];
        case 2:
          docsPath = _w.sent();
          systemPrompt = (0, helpers_js_1.buildSystemPrompt)({
            workspaceDir: workspaceDir,
            config: params.config,
            defaultThinkLevel: params.thinkLevel,
            extraSystemPrompt: extraSystemPrompt,
            ownerNumbers: params.ownerNumbers,
            heartbeatPrompt: heartbeatPrompt,
            docsPath: docsPath !== null && docsPath !== void 0 ? docsPath : undefined,
            tools: [],
            contextFiles: contextFiles,
            modelDisplay: modelDisplay,
            agentId: sessionAgentId,
          });
          ((_b = (0, helpers_js_1.resolveSessionIdToSend)({
            backend: backend,
            cliSessionId: params.cliSessionId,
          })),
            (cliSessionIdToSend = _b.sessionId),
            (isNew = _b.isNew));
          useResume = Boolean(
            params.cliSessionId &&
            cliSessionIdToSend &&
            backend.resumeArgs &&
            backend.resumeArgs.length > 0,
          );
          sessionIdSent = cliSessionIdToSend
            ? useResume ||
              Boolean(backend.sessionArg) ||
              Boolean((_l = backend.sessionArgs) === null || _l === void 0 ? void 0 : _l.length)
              ? cliSessionIdToSend
              : undefined
            : undefined;
          systemPromptArg = (0, helpers_js_1.resolveSystemPromptUsage)({
            backend: backend,
            isNewSession: isNew,
            systemPrompt: systemPrompt,
          });
          prompt = params.prompt;
          if (!(params.images && params.images.length > 0)) {
            return [3 /*break*/, 4];
          }
          return [4 /*yield*/, (0, helpers_js_1.writeCliImages)(params.images)];
        case 3:
          imagePayload = _w.sent();
          imagePaths = imagePayload.paths;
          cleanupImages = imagePayload.cleanup;
          if (!backend.imageArg) {
            prompt = (0, helpers_js_1.appendImagePathsToPrompt)(prompt, imagePaths);
          }
          _w.label = 4;
        case 4:
          ((_c = (0, helpers_js_1.resolvePromptInput)({
            backend: backend,
            prompt: prompt,
          })),
            (argsPrompt = _c.argsPrompt),
            (stdin = _c.stdin));
          stdinPayload = stdin !== null && stdin !== void 0 ? stdin : "";
          baseArgs = useResume
            ? (_o = (_m = backend.resumeArgs) !== null && _m !== void 0 ? _m : backend.args) !==
                null && _o !== void 0
              ? _o
              : []
            : (_p = backend.args) !== null && _p !== void 0
              ? _p
              : [];
          resolvedArgs = useResume
            ? baseArgs.map(function (entry) {
                return entry.replaceAll(
                  "{sessionId}",
                  cliSessionIdToSend !== null && cliSessionIdToSend !== void 0
                    ? cliSessionIdToSend
                    : "",
                );
              })
            : baseArgs;
          args = (0, helpers_js_1.buildCliArgs)({
            backend: backend,
            baseArgs: resolvedArgs,
            modelId: normalizedModel,
            sessionId: cliSessionIdToSend,
            systemPrompt: systemPromptArg,
            imagePaths: imagePaths,
            promptArg: argsPrompt,
            useResume: useResume,
          });
          serialize = (_q = backend.serialize) !== null && _q !== void 0 ? _q : true;
          queueKey = serialize
            ? backendResolved.id
            : "".concat(backendResolved.id, ":").concat(params.runId);
          _w.label = 5;
        case 5:
          _w.trys.push([5, 7, 8, 11]);
          return [
            4 /*yield*/,
            (0, helpers_js_1.enqueueCliRun)(queueKey, function () {
              return __awaiter(_this, void 0, void 0, function () {
                var logOutputText,
                  logArgs,
                  i,
                  arg,
                  systemPromptValue,
                  promptIndex,
                  env,
                  result,
                  stdout,
                  stderr,
                  err,
                  reason,
                  status_2,
                  outputMode,
                  parsed_1,
                  parsed;
                var _a, _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                  switch (_g.label) {
                    case 0:
                      log.info(
                        "cli exec: provider="
                          .concat(params.provider, " model=")
                          .concat(normalizedModel, " promptChars=")
                          .concat(params.prompt.length),
                      );
                      logOutputText = (0, env_js_1.isTruthyEnvValue)(
                        process.env.OPENCLAW_CLAUDE_CLI_LOG_OUTPUT,
                      );
                      if (logOutputText) {
                        logArgs = [];
                        for (i = 0; i < args.length; i += 1) {
                          arg = (_a = args[i]) !== null && _a !== void 0 ? _a : "";
                          if (arg === backend.systemPromptArg) {
                            systemPromptValue =
                              (_b = args[i + 1]) !== null && _b !== void 0 ? _b : "";
                            logArgs.push(
                              arg,
                              "<systemPrompt:".concat(systemPromptValue.length, " chars>"),
                            );
                            i += 1;
                            continue;
                          }
                          if (arg === backend.sessionArg) {
                            logArgs.push(
                              arg,
                              (_c = args[i + 1]) !== null && _c !== void 0 ? _c : "",
                            );
                            i += 1;
                            continue;
                          }
                          if (arg === backend.modelArg) {
                            logArgs.push(
                              arg,
                              (_d = args[i + 1]) !== null && _d !== void 0 ? _d : "",
                            );
                            i += 1;
                            continue;
                          }
                          if (arg === backend.imageArg) {
                            logArgs.push(arg, "<image>");
                            i += 1;
                            continue;
                          }
                          logArgs.push(arg);
                        }
                        if (argsPrompt) {
                          promptIndex = logArgs.indexOf(argsPrompt);
                          if (promptIndex >= 0) {
                            logArgs[promptIndex] = "<prompt:".concat(argsPrompt.length, " chars>");
                          }
                        }
                        log.info(
                          "cli argv: ".concat(backend.command, " ").concat(logArgs.join(" ")),
                        );
                      }
                      env = (function () {
                        var _a;
                        var next = __assign(__assign({}, process.env), backend.env);
                        for (
                          var _i = 0,
                            _b = (_a = backend.clearEnv) !== null && _a !== void 0 ? _a : [];
                          _i < _b.length;
                          _i++
                        ) {
                          var key = _b[_i];
                          delete next[key];
                        }
                        return next;
                      })();
                      // Cleanup suspended processes that have accumulated (regardless of sessionId)
                      return [4 /*yield*/, (0, helpers_js_1.cleanupSuspendedCliProcesses)(backend)];
                    case 1:
                      // Cleanup suspended processes that have accumulated (regardless of sessionId)
                      _g.sent();
                      if (!(useResume && cliSessionIdToSend)) {
                        return [3 /*break*/, 3];
                      }
                      return [
                        4 /*yield*/,
                        (0, helpers_js_1.cleanupResumeProcesses)(backend, cliSessionIdToSend),
                      ];
                    case 2:
                      _g.sent();
                      _g.label = 3;
                    case 3:
                      return [
                        4 /*yield*/,
                        (0, exec_js_1.runCommandWithTimeout)(
                          __spreadArray([backend.command], args, true),
                          {
                            timeoutMs: params.timeoutMs,
                            cwd: workspaceDir,
                            env: env,
                            input: stdinPayload,
                          },
                        ),
                      ];
                    case 4:
                      result = _g.sent();
                      stdout = result.stdout.trim();
                      stderr = result.stderr.trim();
                      if (logOutputText) {
                        if (stdout) {
                          log.info("cli stdout:\n".concat(stdout));
                        }
                        if (stderr) {
                          log.info("cli stderr:\n".concat(stderr));
                        }
                      }
                      if ((0, globals_js_1.shouldLogVerbose)()) {
                        if (stdout) {
                          log.debug("cli stdout:\n".concat(stdout));
                        }
                        if (stderr) {
                          log.debug("cli stderr:\n".concat(stderr));
                        }
                      }
                      if (result.code !== 0) {
                        err = stderr || stdout || "CLI failed.";
                        reason =
                          (_e = (0, pi_embedded_helpers_js_1.classifyFailoverReason)(err)) !==
                            null && _e !== void 0
                            ? _e
                            : "unknown";
                        status_2 = (0, failover_error_js_1.resolveFailoverStatus)(reason);
                        throw new failover_error_js_1.FailoverError(err, {
                          reason: reason,
                          provider: params.provider,
                          model: modelId,
                          status: status_2,
                        });
                      }
                      outputMode = useResume
                        ? (_f = backend.resumeOutput) !== null && _f !== void 0
                          ? _f
                          : backend.output
                        : backend.output;
                      if (outputMode === "text") {
                        return [2 /*return*/, { text: stdout, sessionId: undefined }];
                      }
                      if (outputMode === "jsonl") {
                        parsed_1 = (0, helpers_js_1.parseCliJsonl)(stdout, backend);
                        return [
                          2 /*return*/,
                          parsed_1 !== null && parsed_1 !== void 0 ? parsed_1 : { text: stdout },
                        ];
                      }
                      parsed = (0, helpers_js_1.parseCliJson)(stdout, backend);
                      return [
                        2 /*return*/,
                        parsed !== null && parsed !== void 0 ? parsed : { text: stdout },
                      ];
                  }
                });
              });
            }),
          ];
        case 6:
          output = _w.sent();
          text = (_r = output.text) === null || _r === void 0 ? void 0 : _r.trim();
          payloads = text ? [{ text: text }] : undefined;
          return [
            2 /*return*/,
            {
              payloads: payloads,
              meta: {
                durationMs: Date.now() - started,
                agentMeta: {
                  sessionId:
                    (_u =
                      (_t =
                        (_s = output.sessionId) !== null && _s !== void 0 ? _s : sessionIdSent) !==
                        null && _t !== void 0
                        ? _t
                        : params.sessionId) !== null && _u !== void 0
                      ? _u
                      : "",
                  provider: params.provider,
                  model: modelId,
                  usage: output.usage,
                },
              },
            },
          ];
        case 7:
          err_1 = _w.sent();
          if (err_1 instanceof failover_error_js_1.FailoverError) {
            throw err_1;
          }
          message = err_1 instanceof Error ? err_1.message : String(err_1);
          if ((0, pi_embedded_helpers_js_1.isFailoverErrorMessage)(message)) {
            reason =
              (_v = (0, pi_embedded_helpers_js_1.classifyFailoverReason)(message)) !== null &&
              _v !== void 0
                ? _v
                : "unknown";
            status_1 = (0, failover_error_js_1.resolveFailoverStatus)(reason);
            throw new failover_error_js_1.FailoverError(message, {
              reason: reason,
              provider: params.provider,
              model: modelId,
              status: status_1,
            });
          }
          throw err_1;
        case 8:
          if (!cleanupImages) {
            return [3 /*break*/, 10];
          }
          return [4 /*yield*/, cleanupImages()];
        case 9:
          _w.sent();
          _w.label = 10;
        case 10:
          return [7 /*endfinally*/];
        case 11:
          return [2 /*return*/];
      }
    });
  });
}
function runClaudeCliAgent(params) {
  return __awaiter(this, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
      return [
        2 /*return*/,
        runCliAgent({
          sessionId: params.sessionId,
          sessionKey: params.sessionKey,
          sessionFile: params.sessionFile,
          workspaceDir: params.workspaceDir,
          config: params.config,
          prompt: params.prompt,
          provider: (_a = params.provider) !== null && _a !== void 0 ? _a : "claude-cli",
          model: (_b = params.model) !== null && _b !== void 0 ? _b : "opus",
          thinkLevel: params.thinkLevel,
          timeoutMs: params.timeoutMs,
          runId: params.runId,
          extraSystemPrompt: params.extraSystemPrompt,
          ownerNumbers: params.ownerNumbers,
          cliSessionId: params.claudeSessionId,
          images: params.images,
        }),
      ];
    });
  });
}
