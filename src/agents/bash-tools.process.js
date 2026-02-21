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
exports.processTool = void 0;
exports.createProcessTool = createProcessTool;
var typebox_1 = require("@sinclair/typebox");
var bash_process_registry_js_1 = require("./bash-process-registry.js");
var bash_tools_shared_js_1 = require("./bash-tools.shared.js");
var pty_keys_js_1 = require("./pty-keys.js");
var processSchema = typebox_1.Type.Object({
  action: typebox_1.Type.String({ description: "Process action" }),
  sessionId: typebox_1.Type.Optional(
    typebox_1.Type.String({ description: "Session id for actions other than list" }),
  ),
  data: typebox_1.Type.Optional(typebox_1.Type.String({ description: "Data to write for write" })),
  keys: typebox_1.Type.Optional(
    typebox_1.Type.Array(typebox_1.Type.String(), {
      description: "Key tokens to send for send-keys",
    }),
  ),
  hex: typebox_1.Type.Optional(
    typebox_1.Type.Array(typebox_1.Type.String(), {
      description: "Hex bytes to send for send-keys",
    }),
  ),
  literal: typebox_1.Type.Optional(
    typebox_1.Type.String({ description: "Literal string for send-keys" }),
  ),
  text: typebox_1.Type.Optional(typebox_1.Type.String({ description: "Text to paste for paste" })),
  bracketed: typebox_1.Type.Optional(
    typebox_1.Type.Boolean({ description: "Wrap paste in bracketed mode" }),
  ),
  eof: typebox_1.Type.Optional(typebox_1.Type.Boolean({ description: "Close stdin after write" })),
  offset: typebox_1.Type.Optional(typebox_1.Type.Number({ description: "Log offset" })),
  limit: typebox_1.Type.Optional(typebox_1.Type.Number({ description: "Log length" })),
});
function createProcessTool(defaults) {
  var _this = this;
  if ((defaults === null || defaults === void 0 ? void 0 : defaults.cleanupMs) !== undefined) {
    (0, bash_process_registry_js_1.setJobTtlMs)(defaults.cleanupMs);
  }
  var scopeKey = defaults === null || defaults === void 0 ? void 0 : defaults.scopeKey;
  var isInScope = function (session) {
    return (
      !scopeKey || (session === null || session === void 0 ? void 0 : session.scopeKey) === scopeKey
    );
  };
  return {
    name: "process",
    label: "process",
    description:
      "Manage running exec sessions: list, poll, log, write, send-keys, submit, paste, kill.",
    parameters: processSchema,
    execute: function (_toolCallId, args) {
      return __awaiter(_this, void 0, void 0, function () {
        var params,
          running,
          finished_1,
          lines,
          session,
          finished,
          scopedSession,
          scopedFinished,
          _a,
          _b,
          stdout,
          stderr,
          exited,
          exitCode,
          exitSignal,
          status_1,
          status_2,
          output,
          _c,
          slice,
          totalLines,
          totalChars,
          _d,
          slice,
          totalLines,
          totalChars,
          status_3,
          stdin_1,
          stdin_2,
          _e,
          data_1,
          warnings,
          stdin_3,
          stdin_4,
          payload_1;
        var _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
        return __generator(this, function (_1) {
          switch (_1.label) {
            case 0:
              params = args;
              if (params.action === "list") {
                running = (0, bash_process_registry_js_1.listRunningSessions)()
                  .filter(function (s) {
                    return isInScope(s);
                  })
                  .map(function (s) {
                    var _a;
                    return {
                      sessionId: s.id,
                      status: "running",
                      pid: (_a = s.pid) !== null && _a !== void 0 ? _a : undefined,
                      startedAt: s.startedAt,
                      runtimeMs: Date.now() - s.startedAt,
                      cwd: s.cwd,
                      command: s.command,
                      name: (0, bash_tools_shared_js_1.deriveSessionName)(s.command),
                      tail: s.tail,
                      truncated: s.truncated,
                    };
                  });
                finished_1 = (0, bash_process_registry_js_1.listFinishedSessions)()
                  .filter(function (s) {
                    return isInScope(s);
                  })
                  .map(function (s) {
                    var _a, _b;
                    return {
                      sessionId: s.id,
                      status: s.status,
                      startedAt: s.startedAt,
                      endedAt: s.endedAt,
                      runtimeMs: s.endedAt - s.startedAt,
                      cwd: s.cwd,
                      command: s.command,
                      name: (0, bash_tools_shared_js_1.deriveSessionName)(s.command),
                      tail: s.tail,
                      truncated: s.truncated,
                      exitCode: (_a = s.exitCode) !== null && _a !== void 0 ? _a : undefined,
                      exitSignal: (_b = s.exitSignal) !== null && _b !== void 0 ? _b : undefined,
                    };
                  });
                lines = __spreadArray(__spreadArray([], running, true), finished_1, true)
                  .toSorted(function (a, b) {
                    return b.startedAt - a.startedAt;
                  })
                  .map(function (s) {
                    var label = s.name
                      ? (0, bash_tools_shared_js_1.truncateMiddle)(s.name, 80)
                      : (0, bash_tools_shared_js_1.truncateMiddle)(s.command, 120);
                    return ""
                      .concat(s.sessionId, " ")
                      .concat((0, bash_tools_shared_js_1.pad)(s.status, 9), " ")
                      .concat((0, bash_tools_shared_js_1.formatDuration)(s.runtimeMs), " :: ")
                      .concat(label);
                  });
                return [
                  2 /*return*/,
                  {
                    content: [
                      {
                        type: "text",
                        text: lines.join("\n") || "No running or recent sessions.",
                      },
                    ],
                    details: {
                      status: "completed",
                      sessions: __spreadArray(__spreadArray([], running, true), finished_1, true),
                    },
                  },
                ];
              }
              if (!params.sessionId) {
                return [
                  2 /*return*/,
                  {
                    content: [{ type: "text", text: "sessionId is required for this action." }],
                    details: { status: "failed" },
                  },
                ];
              }
              session = (0, bash_process_registry_js_1.getSession)(params.sessionId);
              finished = (0, bash_process_registry_js_1.getFinishedSession)(params.sessionId);
              scopedSession = isInScope(session) ? session : undefined;
              scopedFinished = isInScope(finished) ? finished : undefined;
              _a = params.action;
              switch (_a) {
                case "poll":
                  return [3 /*break*/, 1];
                case "log":
                  return [3 /*break*/, 2];
                case "write":
                  return [3 /*break*/, 3];
                case "send-keys":
                  return [3 /*break*/, 5];
                case "submit":
                  return [3 /*break*/, 7];
                case "paste":
                  return [3 /*break*/, 9];
                case "kill":
                  return [3 /*break*/, 11];
                case "clear":
                  return [3 /*break*/, 12];
                case "remove":
                  return [3 /*break*/, 13];
              }
              return [3 /*break*/, 14];
            case 1:
              {
                if (!scopedSession) {
                  if (scopedFinished) {
                    return [
                      2 /*return*/,
                      {
                        content: [
                          {
                            type: "text",
                            text:
                              (scopedFinished.tail ||
                                "(no output recorded".concat(
                                  scopedFinished.truncated ? " — truncated to cap" : "",
                                  ")",
                                )) +
                              "\n\nProcess exited with ".concat(
                                scopedFinished.exitSignal
                                  ? "signal ".concat(scopedFinished.exitSignal)
                                  : "code ".concat(
                                      (_f = scopedFinished.exitCode) !== null && _f !== void 0
                                        ? _f
                                        : 0,
                                    ),
                                ".",
                              ),
                          },
                        ],
                        details: {
                          status: scopedFinished.status === "completed" ? "completed" : "failed",
                          sessionId: params.sessionId,
                          exitCode:
                            (_g = scopedFinished.exitCode) !== null && _g !== void 0
                              ? _g
                              : undefined,
                          aggregated: scopedFinished.aggregated,
                          name: (0, bash_tools_shared_js_1.deriveSessionName)(
                            scopedFinished.command,
                          ),
                        },
                      },
                    ];
                  }
                  return [
                    2 /*return*/,
                    {
                      content: [
                        {
                          type: "text",
                          text: "No session found for ".concat(params.sessionId),
                        },
                      ],
                      details: { status: "failed" },
                    },
                  ];
                }
                if (!scopedSession.backgrounded) {
                  return [
                    2 /*return*/,
                    {
                      content: [
                        {
                          type: "text",
                          text: "Session ".concat(params.sessionId, " is not backgrounded."),
                        },
                      ],
                      details: { status: "failed" },
                    },
                  ];
                }
                ((_b = (0, bash_process_registry_js_1.drainSession)(scopedSession)),
                  (stdout = _b.stdout),
                  (stderr = _b.stderr));
                exited = scopedSession.exited;
                exitCode = (_h = scopedSession.exitCode) !== null && _h !== void 0 ? _h : 0;
                exitSignal =
                  (_j = scopedSession.exitSignal) !== null && _j !== void 0 ? _j : undefined;
                if (exited) {
                  status_1 = exitCode === 0 && exitSignal == null ? "completed" : "failed";
                  (0, bash_process_registry_js_1.markExited)(
                    scopedSession,
                    (_k = scopedSession.exitCode) !== null && _k !== void 0 ? _k : null,
                    (_l = scopedSession.exitSignal) !== null && _l !== void 0 ? _l : null,
                    status_1,
                  );
                }
                status_2 = exited
                  ? exitCode === 0 && exitSignal == null
                    ? "completed"
                    : "failed"
                  : "running";
                output = [stdout.trimEnd(), stderr.trimEnd()].filter(Boolean).join("\n").trim();
                return [
                  2 /*return*/,
                  {
                    content: [
                      {
                        type: "text",
                        text:
                          (output || "(no new output)") +
                          (exited
                            ? "\n\nProcess exited with ".concat(
                                exitSignal
                                  ? "signal ".concat(exitSignal)
                                  : "code ".concat(exitCode),
                                ".",
                              )
                            : "\n\nProcess still running."),
                      },
                    ],
                    details: {
                      status: status_2,
                      sessionId: params.sessionId,
                      exitCode: exited ? exitCode : undefined,
                      aggregated: scopedSession.aggregated,
                      name: (0, bash_tools_shared_js_1.deriveSessionName)(scopedSession.command),
                    },
                  },
                ];
              }
              _1.label = 2;
            case 2:
              {
                if (scopedSession) {
                  if (!scopedSession.backgrounded) {
                    return [
                      2 /*return*/,
                      {
                        content: [
                          {
                            type: "text",
                            text: "Session ".concat(params.sessionId, " is not backgrounded."),
                          },
                        ],
                        details: { status: "failed" },
                      },
                    ];
                  }
                  ((_c = (0, bash_tools_shared_js_1.sliceLogLines)(
                    scopedSession.aggregated,
                    params.offset,
                    params.limit,
                  )),
                    (slice = _c.slice),
                    (totalLines = _c.totalLines),
                    (totalChars = _c.totalChars));
                  return [
                    2 /*return*/,
                    {
                      content: [{ type: "text", text: slice || "(no output yet)" }],
                      details: {
                        status: scopedSession.exited ? "completed" : "running",
                        sessionId: params.sessionId,
                        total: totalLines,
                        totalLines: totalLines,
                        totalChars: totalChars,
                        truncated: scopedSession.truncated,
                        name: (0, bash_tools_shared_js_1.deriveSessionName)(scopedSession.command),
                      },
                    },
                  ];
                }
                if (scopedFinished) {
                  ((_d = (0, bash_tools_shared_js_1.sliceLogLines)(
                    scopedFinished.aggregated,
                    params.offset,
                    params.limit,
                  )),
                    (slice = _d.slice),
                    (totalLines = _d.totalLines),
                    (totalChars = _d.totalChars));
                  status_3 = scopedFinished.status === "completed" ? "completed" : "failed";
                  return [
                    2 /*return*/,
                    {
                      content: [{ type: "text", text: slice || "(no output recorded)" }],
                      details: {
                        status: status_3,
                        sessionId: params.sessionId,
                        total: totalLines,
                        totalLines: totalLines,
                        totalChars: totalChars,
                        truncated: scopedFinished.truncated,
                        exitCode:
                          (_m = scopedFinished.exitCode) !== null && _m !== void 0 ? _m : undefined,
                        exitSignal:
                          (_o = scopedFinished.exitSignal) !== null && _o !== void 0
                            ? _o
                            : undefined,
                        name: (0, bash_tools_shared_js_1.deriveSessionName)(scopedFinished.command),
                      },
                    },
                  ];
                }
                return [
                  2 /*return*/,
                  {
                    content: [
                      {
                        type: "text",
                        text: "No session found for ".concat(params.sessionId),
                      },
                    ],
                    details: { status: "failed" },
                  },
                ];
              }
              _1.label = 3;
            case 3:
              if (!scopedSession) {
                return [
                  2 /*return*/,
                  {
                    content: [
                      {
                        type: "text",
                        text: "No active session found for ".concat(params.sessionId),
                      },
                    ],
                    details: { status: "failed" },
                  },
                ];
              }
              if (!scopedSession.backgrounded) {
                return [
                  2 /*return*/,
                  {
                    content: [
                      {
                        type: "text",
                        text: "Session ".concat(params.sessionId, " is not backgrounded."),
                      },
                    ],
                    details: { status: "failed" },
                  },
                ];
              }
              stdin_1 =
                (_p = scopedSession.stdin) !== null && _p !== void 0
                  ? _p
                  : (_q = scopedSession.child) === null || _q === void 0
                    ? void 0
                    : _q.stdin;
              if (!stdin_1 || stdin_1.destroyed) {
                return [
                  2 /*return*/,
                  {
                    content: [
                      {
                        type: "text",
                        text: "Session ".concat(params.sessionId, " stdin is not writable."),
                      },
                    ],
                    details: { status: "failed" },
                  },
                ];
              }
              return [
                4 /*yield*/,
                new Promise(function (resolve, reject) {
                  var _a;
                  stdin_1.write(
                    (_a = params.data) !== null && _a !== void 0 ? _a : "",
                    function (err) {
                      if (err) {
                        reject(err);
                      } else {
                        resolve();
                      }
                    },
                  );
                }),
              ];
            case 4:
              _1.sent();
              if (params.eof) {
                stdin_1.end();
              }
              return [
                2 /*return*/,
                {
                  content: [
                    {
                      type: "text",
                      text: "Wrote "
                        .concat(
                          ((_r = params.data) !== null && _r !== void 0 ? _r : "").length,
                          " bytes to session ",
                        )
                        .concat(params.sessionId)
                        .concat(params.eof ? " (stdin closed)" : "", "."),
                    },
                  ],
                  details: {
                    status: "running",
                    sessionId: params.sessionId,
                    name: scopedSession
                      ? (0, bash_tools_shared_js_1.deriveSessionName)(scopedSession.command)
                      : undefined,
                  },
                },
              ];
            case 5:
              if (!scopedSession) {
                return [
                  2 /*return*/,
                  {
                    content: [
                      {
                        type: "text",
                        text: "No active session found for ".concat(params.sessionId),
                      },
                    ],
                    details: { status: "failed" },
                  },
                ];
              }
              if (!scopedSession.backgrounded) {
                return [
                  2 /*return*/,
                  {
                    content: [
                      {
                        type: "text",
                        text: "Session ".concat(params.sessionId, " is not backgrounded."),
                      },
                    ],
                    details: { status: "failed" },
                  },
                ];
              }
              stdin_2 =
                (_s = scopedSession.stdin) !== null && _s !== void 0
                  ? _s
                  : (_t = scopedSession.child) === null || _t === void 0
                    ? void 0
                    : _t.stdin;
              if (!stdin_2 || stdin_2.destroyed) {
                return [
                  2 /*return*/,
                  {
                    content: [
                      {
                        type: "text",
                        text: "Session ".concat(params.sessionId, " stdin is not writable."),
                      },
                    ],
                    details: { status: "failed" },
                  },
                ];
              }
              ((_e = (0, pty_keys_js_1.encodeKeySequence)({
                keys: params.keys,
                hex: params.hex,
                literal: params.literal,
              })),
                (data_1 = _e.data),
                (warnings = _e.warnings));
              if (!data_1) {
                return [
                  2 /*return*/,
                  {
                    content: [
                      {
                        type: "text",
                        text: "No key data provided.",
                      },
                    ],
                    details: { status: "failed" },
                  },
                ];
              }
              return [
                4 /*yield*/,
                new Promise(function (resolve, reject) {
                  stdin_2.write(data_1, function (err) {
                    if (err) {
                      reject(err);
                    } else {
                      resolve();
                    }
                  });
                }),
              ];
            case 6:
              _1.sent();
              return [
                2 /*return*/,
                {
                  content: [
                    {
                      type: "text",
                      text:
                        "Sent "
                          .concat(data_1.length, " bytes to session ")
                          .concat(params.sessionId, ".") +
                        (warnings.length ? "\nWarnings:\n- ".concat(warnings.join("\n- ")) : ""),
                    },
                  ],
                  details: {
                    status: "running",
                    sessionId: params.sessionId,
                    name: scopedSession
                      ? (0, bash_tools_shared_js_1.deriveSessionName)(scopedSession.command)
                      : undefined,
                  },
                },
              ];
            case 7:
              if (!scopedSession) {
                return [
                  2 /*return*/,
                  {
                    content: [
                      {
                        type: "text",
                        text: "No active session found for ".concat(params.sessionId),
                      },
                    ],
                    details: { status: "failed" },
                  },
                ];
              }
              if (!scopedSession.backgrounded) {
                return [
                  2 /*return*/,
                  {
                    content: [
                      {
                        type: "text",
                        text: "Session ".concat(params.sessionId, " is not backgrounded."),
                      },
                    ],
                    details: { status: "failed" },
                  },
                ];
              }
              stdin_3 =
                (_u = scopedSession.stdin) !== null && _u !== void 0
                  ? _u
                  : (_v = scopedSession.child) === null || _v === void 0
                    ? void 0
                    : _v.stdin;
              if (!stdin_3 || stdin_3.destroyed) {
                return [
                  2 /*return*/,
                  {
                    content: [
                      {
                        type: "text",
                        text: "Session ".concat(params.sessionId, " stdin is not writable."),
                      },
                    ],
                    details: { status: "failed" },
                  },
                ];
              }
              return [
                4 /*yield*/,
                new Promise(function (resolve, reject) {
                  stdin_3.write("\r", function (err) {
                    if (err) {
                      reject(err);
                    } else {
                      resolve();
                    }
                  });
                }),
              ];
            case 8:
              _1.sent();
              return [
                2 /*return*/,
                {
                  content: [
                    {
                      type: "text",
                      text: "Submitted session ".concat(params.sessionId, " (sent CR)."),
                    },
                  ],
                  details: {
                    status: "running",
                    sessionId: params.sessionId,
                    name: scopedSession
                      ? (0, bash_tools_shared_js_1.deriveSessionName)(scopedSession.command)
                      : undefined,
                  },
                },
              ];
            case 9:
              if (!scopedSession) {
                return [
                  2 /*return*/,
                  {
                    content: [
                      {
                        type: "text",
                        text: "No active session found for ".concat(params.sessionId),
                      },
                    ],
                    details: { status: "failed" },
                  },
                ];
              }
              if (!scopedSession.backgrounded) {
                return [
                  2 /*return*/,
                  {
                    content: [
                      {
                        type: "text",
                        text: "Session ".concat(params.sessionId, " is not backgrounded."),
                      },
                    ],
                    details: { status: "failed" },
                  },
                ];
              }
              stdin_4 =
                (_w = scopedSession.stdin) !== null && _w !== void 0
                  ? _w
                  : (_x = scopedSession.child) === null || _x === void 0
                    ? void 0
                    : _x.stdin;
              if (!stdin_4 || stdin_4.destroyed) {
                return [
                  2 /*return*/,
                  {
                    content: [
                      {
                        type: "text",
                        text: "Session ".concat(params.sessionId, " stdin is not writable."),
                      },
                    ],
                    details: { status: "failed" },
                  },
                ];
              }
              payload_1 = (0, pty_keys_js_1.encodePaste)(
                (_y = params.text) !== null && _y !== void 0 ? _y : "",
                params.bracketed !== false,
              );
              if (!payload_1) {
                return [
                  2 /*return*/,
                  {
                    content: [
                      {
                        type: "text",
                        text: "No paste text provided.",
                      },
                    ],
                    details: { status: "failed" },
                  },
                ];
              }
              return [
                4 /*yield*/,
                new Promise(function (resolve, reject) {
                  stdin_4.write(payload_1, function (err) {
                    if (err) {
                      reject(err);
                    } else {
                      resolve();
                    }
                  });
                }),
              ];
            case 10:
              _1.sent();
              return [
                2 /*return*/,
                {
                  content: [
                    {
                      type: "text",
                      text: "Pasted "
                        .concat(
                          (_0 =
                            (_z = params.text) === null || _z === void 0 ? void 0 : _z.length) !==
                            null && _0 !== void 0
                            ? _0
                            : 0,
                          " chars to session ",
                        )
                        .concat(params.sessionId, "."),
                    },
                  ],
                  details: {
                    status: "running",
                    sessionId: params.sessionId,
                    name: scopedSession
                      ? (0, bash_tools_shared_js_1.deriveSessionName)(scopedSession.command)
                      : undefined,
                  },
                },
              ];
            case 11:
              {
                if (!scopedSession) {
                  return [
                    2 /*return*/,
                    {
                      content: [
                        {
                          type: "text",
                          text: "No active session found for ".concat(params.sessionId),
                        },
                      ],
                      details: { status: "failed" },
                    },
                  ];
                }
                if (!scopedSession.backgrounded) {
                  return [
                    2 /*return*/,
                    {
                      content: [
                        {
                          type: "text",
                          text: "Session ".concat(params.sessionId, " is not backgrounded."),
                        },
                      ],
                      details: { status: "failed" },
                    },
                  ];
                }
                (0, bash_tools_shared_js_1.killSession)(scopedSession);
                (0, bash_process_registry_js_1.markExited)(
                  scopedSession,
                  null,
                  "SIGKILL",
                  "failed",
                );
                return [
                  2 /*return*/,
                  {
                    content: [
                      { type: "text", text: "Killed session ".concat(params.sessionId, ".") },
                    ],
                    details: {
                      status: "failed",
                      name: scopedSession
                        ? (0, bash_tools_shared_js_1.deriveSessionName)(scopedSession.command)
                        : undefined,
                    },
                  },
                ];
              }
              _1.label = 12;
            case 12:
              {
                if (scopedFinished) {
                  (0, bash_process_registry_js_1.deleteSession)(params.sessionId);
                  return [
                    2 /*return*/,
                    {
                      content: [
                        { type: "text", text: "Cleared session ".concat(params.sessionId, ".") },
                      ],
                      details: { status: "completed" },
                    },
                  ];
                }
                return [
                  2 /*return*/,
                  {
                    content: [
                      {
                        type: "text",
                        text: "No finished session found for ".concat(params.sessionId),
                      },
                    ],
                    details: { status: "failed" },
                  },
                ];
              }
              _1.label = 13;
            case 13:
              {
                if (scopedSession) {
                  (0, bash_tools_shared_js_1.killSession)(scopedSession);
                  (0, bash_process_registry_js_1.markExited)(
                    scopedSession,
                    null,
                    "SIGKILL",
                    "failed",
                  );
                  return [
                    2 /*return*/,
                    {
                      content: [
                        { type: "text", text: "Removed session ".concat(params.sessionId, ".") },
                      ],
                      details: {
                        status: "failed",
                        name: scopedSession
                          ? (0, bash_tools_shared_js_1.deriveSessionName)(scopedSession.command)
                          : undefined,
                      },
                    },
                  ];
                }
                if (scopedFinished) {
                  (0, bash_process_registry_js_1.deleteSession)(params.sessionId);
                  return [
                    2 /*return*/,
                    {
                      content: [
                        { type: "text", text: "Removed session ".concat(params.sessionId, ".") },
                      ],
                      details: { status: "completed" },
                    },
                  ];
                }
                return [
                  2 /*return*/,
                  {
                    content: [
                      {
                        type: "text",
                        text: "No session found for ".concat(params.sessionId),
                      },
                    ],
                    details: { status: "failed" },
                  },
                ];
              }
              _1.label = 14;
            case 14:
              return [
                2 /*return*/,
                {
                  content: [{ type: "text", text: "Unknown action ".concat(params.action) }],
                  details: { status: "failed" },
                },
              ];
          }
        });
      });
    },
  };
}
exports.processTool = createProcessTool();
