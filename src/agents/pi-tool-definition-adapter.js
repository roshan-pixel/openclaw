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
Object.defineProperty(exports, "__esModule", { value: true });
exports.toToolDefinitions = toToolDefinitions;
exports.toClientToolDefinitions = toClientToolDefinitions;
var logger_js_1 = require("../logger.js");
var tool_policy_js_1 = require("./tool-policy.js");
var common_js_1 = require("./tools/common.js");
function describeToolExecutionError(err) {
  var _a;
  if (err instanceof Error) {
    var message = ((_a = err.message) === null || _a === void 0 ? void 0 : _a.trim())
      ? err.message
      : String(err);
    return { message: message, stack: err.stack };
  }
  return { message: String(err) };
}
function toToolDefinitions(tools) {
  var _this = this;
  return tools.map(function (tool) {
    var _a, _b;
    var name = tool.name || "tool";
    var normalizedName = (0, tool_policy_js_1.normalizeToolName)(name);
    return {
      name: name,
      label: (_a = tool.label) !== null && _a !== void 0 ? _a : name,
      description: (_b = tool.description) !== null && _b !== void 0 ? _b : "",
      // biome-ignore lint/suspicious/noExplicitAny: TypeBox schema from pi-agent-core uses a different module instance.
      parameters: tool.parameters,
      execute: function (toolCallId, params, onUpdate, _ctx, signal) {
        return __awaiter(_this, void 0, void 0, function () {
          var err_1, name_1, described;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, tool.execute(toolCallId, params, signal, onUpdate)];
              case 1:
                return [2 /*return*/, _a.sent()];
              case 2:
                err_1 = _a.sent();
                if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
                  throw err_1;
                }
                name_1 =
                  err_1 && typeof err_1 === "object" && "name" in err_1 ? String(err_1.name) : "";
                if (name_1 === "AbortError") {
                  throw err_1;
                }
                described = describeToolExecutionError(err_1);
                if (described.stack && described.stack !== described.message) {
                  (0, logger_js_1.logDebug)(
                    "tools: ".concat(normalizedName, " failed stack:\n").concat(described.stack),
                  );
                }
                (0, logger_js_1.logError)(
                  "[tools] ".concat(normalizedName, " failed: ").concat(described.message),
                );
                return [
                  2 /*return*/,
                  (0, common_js_1.jsonResult)({
                    status: "error",
                    tool: normalizedName,
                    error: described.message,
                  }),
                ];
              case 3:
                return [2 /*return*/];
            }
          });
        });
      },
    };
  });
}
// Convert client tools (OpenResponses hosted tools) to ToolDefinition format
// These tools are intercepted to return a "pending" result instead of executing
function toClientToolDefinitions(tools, onClientToolCall) {
  var _this = this;
  return tools.map(function (tool) {
    var _a;
    var func = tool.function;
    return {
      name: func.name,
      label: func.name,
      description: (_a = func.description) !== null && _a !== void 0 ? _a : "",
      parameters: func.parameters,
      execute: function (toolCallId, params, _onUpdate, _ctx, _signal) {
        return __awaiter(_this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            // Notify handler that a client tool was called
            if (onClientToolCall) {
              onClientToolCall(func.name, params);
            }
            // Return a pending result - the client will execute this tool
            return [
              2 /*return*/,
              (0, common_js_1.jsonResult)({
                status: "pending",
                tool: func.name,
                message: "Tool execution delegated to client",
              }),
            ];
          });
        });
      },
    };
  });
}
