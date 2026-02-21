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
Object.defineProperty(exports, "__esModule", { value: true });
exports.signalRpcRequest = signalRpcRequest;
exports.signalCheck = signalCheck;
exports.streamSignalEvents = streamSignalEvents;
var node_crypto_1 = require("node:crypto");
var fetch_js_1 = require("../infra/fetch.js");
var DEFAULT_TIMEOUT_MS = 10000;
function normalizeBaseUrl(url) {
  var trimmed = url.trim();
  if (!trimmed) {
    throw new Error("Signal base URL is required");
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/\/+$/, "");
  }
  return "http://".concat(trimmed).replace(/\/+$/, "");
}
function fetchWithTimeout(url, init, timeoutMs) {
  return __awaiter(this, void 0, void 0, function () {
    var fetchImpl, controller, timer;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          fetchImpl = (0, fetch_js_1.resolveFetch)();
          if (!fetchImpl) {
            throw new Error("fetch is not available");
          }
          controller = new AbortController();
          timer = setTimeout(function () {
            return controller.abort();
          }, timeoutMs);
          _a.label = 1;
        case 1:
          _a.trys.push([1, , 3, 4]);
          return [
            4 /*yield*/,
            fetchImpl(url, __assign(__assign({}, init), { signal: controller.signal })),
          ];
        case 2:
          return [2 /*return*/, _a.sent()];
        case 3:
          clearTimeout(timer);
          return [7 /*endfinally*/];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function signalRpcRequest(method, params, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var baseUrl, id, body, res, text, parsed, code, msg;
    var _a, _b, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          baseUrl = normalizeBaseUrl(opts.baseUrl);
          id = (0, node_crypto_1.randomUUID)();
          body = JSON.stringify({
            jsonrpc: "2.0",
            method: method,
            params: params,
            id: id,
          });
          return [
            4 /*yield*/,
            fetchWithTimeout(
              "".concat(baseUrl, "/api/v1/rpc"),
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: body,
              },
              (_a = opts.timeoutMs) !== null && _a !== void 0 ? _a : DEFAULT_TIMEOUT_MS,
            ),
          ];
        case 1:
          res = _d.sent();
          if (res.status === 201) {
            return [2 /*return*/, undefined];
          }
          return [4 /*yield*/, res.text()];
        case 2:
          text = _d.sent();
          if (!text) {
            throw new Error("Signal RPC empty response (status ".concat(res.status, ")"));
          }
          parsed = JSON.parse(text);
          if (parsed.error) {
            code = (_b = parsed.error.code) !== null && _b !== void 0 ? _b : "unknown";
            msg = (_c = parsed.error.message) !== null && _c !== void 0 ? _c : "Signal RPC error";
            throw new Error("Signal RPC ".concat(code, ": ").concat(msg));
          }
          return [2 /*return*/, parsed.result];
      }
    });
  });
}
function signalCheck(baseUrl_1) {
  return __awaiter(this, arguments, void 0, function (baseUrl, timeoutMs) {
    var normalized, res, err_1;
    if (timeoutMs === void 0) {
      timeoutMs = DEFAULT_TIMEOUT_MS;
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          normalized = normalizeBaseUrl(baseUrl);
          _a.label = 1;
        case 1:
          _a.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            fetchWithTimeout("".concat(normalized, "/api/v1/check"), { method: "GET" }, timeoutMs),
          ];
        case 2:
          res = _a.sent();
          if (!res.ok) {
            return [
              2 /*return*/,
              { ok: false, status: res.status, error: "HTTP ".concat(res.status) },
            ];
          }
          return [2 /*return*/, { ok: true, status: res.status, error: null }];
        case 3:
          err_1 = _a.sent();
          return [
            2 /*return*/,
            {
              ok: false,
              status: null,
              error: err_1 instanceof Error ? err_1.message : String(err_1),
            },
          ];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function streamSignalEvents(params) {
  return __awaiter(this, void 0, void 0, function () {
    var baseUrl,
      url,
      fetchImpl,
      res,
      reader,
      decoder,
      buffer,
      currentEvent,
      flushEvent,
      _a,
      value,
      done,
      lineEnd,
      line,
      _b,
      rawField,
      rest,
      field,
      rawValue,
      value_1;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          baseUrl = normalizeBaseUrl(params.baseUrl);
          url = new URL("".concat(baseUrl, "/api/v1/events"));
          if (params.account) {
            url.searchParams.set("account", params.account);
          }
          fetchImpl = (0, fetch_js_1.resolveFetch)();
          if (!fetchImpl) {
            throw new Error("fetch is not available");
          }
          return [
            4 /*yield*/,
            fetchImpl(url, {
              method: "GET",
              headers: { Accept: "text/event-stream" },
              signal: params.abortSignal,
            }),
          ];
        case 1:
          res = _c.sent();
          if (!res.ok || !res.body) {
            throw new Error(
              "Signal SSE failed (".concat(res.status, " ").concat(res.statusText || "error", ")"),
            );
          }
          reader = res.body.getReader();
          decoder = new TextDecoder();
          buffer = "";
          currentEvent = {};
          flushEvent = function () {
            if (!currentEvent.data && !currentEvent.event && !currentEvent.id) {
              return;
            }
            params.onEvent({
              event: currentEvent.event,
              data: currentEvent.data,
              id: currentEvent.id,
            });
            currentEvent = {};
          };
          _c.label = 2;
        case 2:
          if (!true) {
            return [3 /*break*/, 4];
          }
          return [4 /*yield*/, reader.read()];
        case 3:
          ((_a = _c.sent()), (value = _a.value), (done = _a.done));
          if (done) {
            return [3 /*break*/, 4];
          }
          buffer += decoder.decode(value, { stream: true });
          lineEnd = buffer.indexOf("\n");
          while (lineEnd !== -1) {
            line = buffer.slice(0, lineEnd);
            buffer = buffer.slice(lineEnd + 1);
            if (line.endsWith("\r")) {
              line = line.slice(0, -1);
            }
            if (line === "") {
              flushEvent();
              lineEnd = buffer.indexOf("\n");
              continue;
            }
            if (line.startsWith(":")) {
              lineEnd = buffer.indexOf("\n");
              continue;
            }
            ((_b = line.split(":")), (rawField = _b[0]), (rest = _b.slice(1)));
            field = rawField.trim();
            rawValue = rest.join(":");
            value_1 = rawValue.startsWith(" ") ? rawValue.slice(1) : rawValue;
            if (field === "event") {
              currentEvent.event = value_1;
            } else if (field === "data") {
              currentEvent.data = currentEvent.data
                ? "".concat(currentEvent.data, "\n").concat(value_1)
                : value_1;
            } else if (field === "id") {
              currentEvent.id = value_1;
            }
            lineEnd = buffer.indexOf("\n");
          }
          return [3 /*break*/, 2];
        case 4:
          flushEvent();
          return [2 /*return*/];
      }
    });
  });
}
