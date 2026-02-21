"use strict";
/**
 * Plugin Hook Runner
 *
 * Provides utilities for executing plugin lifecycle hooks with proper
 * error handling, priority ordering, and async support.
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHookRunner = createHookRunner;
/**
 * Get hooks for a specific hook name, sorted by priority (higher first).
 */
function getHooksForName(registry, hookName) {
  return registry.typedHooks
    .filter(function (h) {
      return h.hookName === hookName;
    })
    .toSorted(function (a, b) {
      var _a, _b;
      return (
        ((_a = b.priority) !== null && _a !== void 0 ? _a : 0) -
        ((_b = a.priority) !== null && _b !== void 0 ? _b : 0)
      );
    });
}
/**
 * Create a hook runner for a specific registry.
 */
function createHookRunner(registry, options) {
  var _a;
  if (options === void 0) {
    options = {};
  }
  var logger = options.logger;
  var catchErrors = (_a = options.catchErrors) !== null && _a !== void 0 ? _a : true;
  /**
   * Run a hook that doesn't return a value (fire-and-forget style).
   * All handlers are executed in parallel for performance.
   */
  function runVoidHook(hookName, event, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      var hooks, promises;
      var _this = this;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            hooks = getHooksForName(registry, hookName);
            if (hooks.length === 0) {
              return [2 /*return*/];
            }
            (_a = logger === null || logger === void 0 ? void 0 : logger.debug) === null ||
            _a === void 0
              ? void 0
              : _a.call(
                  logger,
                  "[hooks] running ".concat(hookName, " (").concat(hooks.length, " handlers)"),
                );
            promises = hooks.map(function (hook) {
              return __awaiter(_this, void 0, void 0, function () {
                var err_1, msg;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      _a.trys.push([0, 2, , 3]);
                      return [4 /*yield*/, hook.handler(event, ctx)];
                    case 1:
                      _a.sent();
                      return [3 /*break*/, 3];
                    case 2:
                      err_1 = _a.sent();
                      msg = "[hooks] "
                        .concat(hookName, " handler from ")
                        .concat(hook.pluginId, " failed: ")
                        .concat(String(err_1));
                      if (catchErrors) {
                        logger === null || logger === void 0 ? void 0 : logger.error(msg);
                      } else {
                        throw new Error(msg);
                      }
                      return [3 /*break*/, 3];
                    case 3:
                      return [2 /*return*/];
                  }
                });
              });
            });
            return [4 /*yield*/, Promise.all(promises)];
          case 1:
            _b.sent();
            return [2 /*return*/];
        }
      });
    });
  }
  /**
   * Run a hook that can return a modifying result.
   * Handlers are executed sequentially in priority order, and results are merged.
   */
  function runModifyingHook(hookName, event, ctx, mergeResults) {
    return __awaiter(this, void 0, void 0, function () {
      var hooks, result, _i, hooks_1, hook, handlerResult, err_2, msg;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            hooks = getHooksForName(registry, hookName);
            if (hooks.length === 0) {
              return [2 /*return*/, undefined];
            }
            (_a = logger === null || logger === void 0 ? void 0 : logger.debug) === null ||
            _a === void 0
              ? void 0
              : _a.call(
                  logger,
                  "[hooks] running "
                    .concat(hookName, " (")
                    .concat(hooks.length, " handlers, sequential)"),
                );
            ((_i = 0), (hooks_1 = hooks));
            _b.label = 1;
          case 1:
            if (!(_i < hooks_1.length)) {
              return [3 /*break*/, 6];
            }
            hook = hooks_1[_i];
            _b.label = 2;
          case 2:
            _b.trys.push([2, 4, , 5]);
            return [4 /*yield*/, hook.handler(event, ctx)];
          case 3:
            handlerResult = _b.sent();
            if (handlerResult !== undefined && handlerResult !== null) {
              if (mergeResults && result !== undefined) {
                result = mergeResults(result, handlerResult);
              } else {
                result = handlerResult;
              }
            }
            return [3 /*break*/, 5];
          case 4:
            err_2 = _b.sent();
            msg = "[hooks] "
              .concat(hookName, " handler from ")
              .concat(hook.pluginId, " failed: ")
              .concat(String(err_2));
            if (catchErrors) {
              logger === null || logger === void 0 ? void 0 : logger.error(msg);
            } else {
              throw new Error(msg);
            }
            return [3 /*break*/, 5];
          case 5:
            _i++;
            return [3 /*break*/, 1];
          case 6:
            return [2 /*return*/, result];
        }
      });
    });
  }
  // =========================================================================
  // Agent Hooks
  // =========================================================================
  /**
   * Run before_agent_start hook.
   * Allows plugins to inject context into the system prompt.
   * Runs sequentially, merging systemPrompt and prependContext from all handlers.
   */
  function runBeforeAgentStart(event, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [
          2 /*return*/,
          runModifyingHook("before_agent_start", event, ctx, function (acc, next) {
            var _a, _b;
            return {
              systemPrompt:
                (_a = next.systemPrompt) !== null && _a !== void 0
                  ? _a
                  : acc === null || acc === void 0
                    ? void 0
                    : acc.systemPrompt,
              prependContext:
                (acc === null || acc === void 0 ? void 0 : acc.prependContext) &&
                next.prependContext
                  ? "".concat(acc.prependContext, "\n\n").concat(next.prependContext)
                  : (_b = next.prependContext) !== null && _b !== void 0
                    ? _b
                    : acc === null || acc === void 0
                      ? void 0
                      : acc.prependContext,
            };
          }),
        ];
      });
    });
  }
  /**
   * Run agent_end hook.
   * Allows plugins to analyze completed conversations.
   * Runs in parallel (fire-and-forget).
   */
  function runAgentEnd(event, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2 /*return*/, runVoidHook("agent_end", event, ctx)];
      });
    });
  }
  /**
   * Run before_compaction hook.
   */
  function runBeforeCompaction(event, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2 /*return*/, runVoidHook("before_compaction", event, ctx)];
      });
    });
  }
  /**
   * Run after_compaction hook.
   */
  function runAfterCompaction(event, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2 /*return*/, runVoidHook("after_compaction", event, ctx)];
      });
    });
  }
  // =========================================================================
  // Message Hooks
  // =========================================================================
  /**
   * Run message_received hook.
   * Runs in parallel (fire-and-forget).
   */
  function runMessageReceived(event, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2 /*return*/, runVoidHook("message_received", event, ctx)];
      });
    });
  }
  /**
   * Run message_sending hook.
   * Allows plugins to modify or cancel outgoing messages.
   * Runs sequentially.
   */
  function runMessageSending(event, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [
          2 /*return*/,
          runModifyingHook("message_sending", event, ctx, function (acc, next) {
            var _a, _b;
            return {
              content:
                (_a = next.content) !== null && _a !== void 0
                  ? _a
                  : acc === null || acc === void 0
                    ? void 0
                    : acc.content,
              cancel:
                (_b = next.cancel) !== null && _b !== void 0
                  ? _b
                  : acc === null || acc === void 0
                    ? void 0
                    : acc.cancel,
            };
          }),
        ];
      });
    });
  }
  /**
   * Run message_sent hook.
   * Runs in parallel (fire-and-forget).
   */
  function runMessageSent(event, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2 /*return*/, runVoidHook("message_sent", event, ctx)];
      });
    });
  }
  // =========================================================================
  // Tool Hooks
  // =========================================================================
  /**
   * Run before_tool_call hook.
   * Allows plugins to modify or block tool calls.
   * Runs sequentially.
   */
  function runBeforeToolCall(event, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [
          2 /*return*/,
          runModifyingHook("before_tool_call", event, ctx, function (acc, next) {
            var _a, _b, _c;
            return {
              params:
                (_a = next.params) !== null && _a !== void 0
                  ? _a
                  : acc === null || acc === void 0
                    ? void 0
                    : acc.params,
              block:
                (_b = next.block) !== null && _b !== void 0
                  ? _b
                  : acc === null || acc === void 0
                    ? void 0
                    : acc.block,
              blockReason:
                (_c = next.blockReason) !== null && _c !== void 0
                  ? _c
                  : acc === null || acc === void 0
                    ? void 0
                    : acc.blockReason,
            };
          }),
        ];
      });
    });
  }
  /**
   * Run after_tool_call hook.
   * Runs in parallel (fire-and-forget).
   */
  function runAfterToolCall(event, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2 /*return*/, runVoidHook("after_tool_call", event, ctx)];
      });
    });
  }
  /**
   * Run tool_result_persist hook.
   *
   * This hook is intentionally synchronous: it runs in hot paths where session
   * transcripts are appended synchronously.
   *
   * Handlers are executed sequentially in priority order (higher first). Each
   * handler may return `{ message }` to replace the message passed to the next
   * handler.
   */
  function runToolResultPersist(event, ctx) {
    var _a;
    var hooks = getHooksForName(registry, "tool_result_persist");
    if (hooks.length === 0) {
      return undefined;
    }
    var current = event.message;
    for (var _i = 0, hooks_2 = hooks; _i < hooks_2.length; _i++) {
      var hook = hooks_2[_i];
      try {
        var out = hook.handler(__assign(__assign({}, event), { message: current }), ctx);
        // Guard against accidental async handlers (this hook is sync-only).
        if (out && typeof out.then === "function") {
          var msg =
            "[hooks] tool_result_persist handler from ".concat(
              hook.pluginId,
              " returned a Promise; ",
            ) + "this hook is synchronous and the result was ignored.";
          if (catchErrors) {
            (_a = logger === null || logger === void 0 ? void 0 : logger.warn) === null ||
            _a === void 0
              ? void 0
              : _a.call(logger, msg);
            continue;
          }
          throw new Error(msg);
        }
        var next = out === null || out === void 0 ? void 0 : out.message;
        if (next) {
          current = next;
        }
      } catch (err) {
        var msg = "[hooks] tool_result_persist handler from "
          .concat(hook.pluginId, " failed: ")
          .concat(String(err));
        if (catchErrors) {
          logger === null || logger === void 0 ? void 0 : logger.error(msg);
        } else {
          throw new Error(msg, { cause: err });
        }
      }
    }
    return { message: current };
  }
  // =========================================================================
  // Session Hooks
  // =========================================================================
  /**
   * Run session_start hook.
   * Runs in parallel (fire-and-forget).
   */
  function runSessionStart(event, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2 /*return*/, runVoidHook("session_start", event, ctx)];
      });
    });
  }
  /**
   * Run session_end hook.
   * Runs in parallel (fire-and-forget).
   */
  function runSessionEnd(event, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2 /*return*/, runVoidHook("session_end", event, ctx)];
      });
    });
  }
  // =========================================================================
  // Gateway Hooks
  // =========================================================================
  /**
   * Run gateway_start hook.
   * Runs in parallel (fire-and-forget).
   */
  function runGatewayStart(event, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2 /*return*/, runVoidHook("gateway_start", event, ctx)];
      });
    });
  }
  /**
   * Run gateway_stop hook.
   * Runs in parallel (fire-and-forget).
   */
  function runGatewayStop(event, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2 /*return*/, runVoidHook("gateway_stop", event, ctx)];
      });
    });
  }
  // =========================================================================
  // Utility
  // =========================================================================
  /**
   * Check if any hooks are registered for a given hook name.
   */
  function hasHooks(hookName) {
    return registry.typedHooks.some(function (h) {
      return h.hookName === hookName;
    });
  }
  /**
   * Get count of registered hooks for a given hook name.
   */
  function getHookCount(hookName) {
    return registry.typedHooks.filter(function (h) {
      return h.hookName === hookName;
    }).length;
  }
  return {
    // Agent hooks
    runBeforeAgentStart: runBeforeAgentStart,
    runAgentEnd: runAgentEnd,
    runBeforeCompaction: runBeforeCompaction,
    runAfterCompaction: runAfterCompaction,
    // Message hooks
    runMessageReceived: runMessageReceived,
    runMessageSending: runMessageSending,
    runMessageSent: runMessageSent,
    // Tool hooks
    runBeforeToolCall: runBeforeToolCall,
    runAfterToolCall: runAfterToolCall,
    runToolResultPersist: runToolResultPersist,
    // Session hooks
    runSessionStart: runSessionStart,
    runSessionEnd: runSessionEnd,
    // Gateway hooks
    runGatewayStart: runGatewayStart,
    runGatewayStop: runGatewayStop,
    // Utility
    hasHooks: hasHooks,
    getHookCount: getHookCount,
  };
}
