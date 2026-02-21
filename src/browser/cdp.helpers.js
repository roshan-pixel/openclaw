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
exports.isLoopbackHost = isLoopbackHost;
exports.getHeadersWithAuth = getHeadersWithAuth;
exports.appendCdpPath = appendCdpPath;
exports.fetchJson = fetchJson;
exports.fetchOk = fetchOk;
exports.withCdpSocket = withCdpSocket;
var ws_1 = require("ws");
var ws_js_1 = require("../infra/ws.js");
function isLoopbackHost(host) {
  var h = host.trim().toLowerCase();
  return (
    h === "localhost" ||
    h === "127.0.0.1" ||
    h === "0.0.0.0" ||
    h === "[::1]" ||
    h === "::1" ||
    h === "[::]" ||
    h === "::"
  );
}
function getHeadersWithAuth(url, headers) {
  if (headers === void 0) {
    headers = {};
  }
  try {
    var parsed = new URL(url);
    var hasAuthHeader = Object.keys(headers).some(function (key) {
      return key.toLowerCase() === "authorization";
    });
    if (hasAuthHeader) {
      return headers;
    }
    if (parsed.username || parsed.password) {
      var auth = Buffer.from("".concat(parsed.username, ":").concat(parsed.password)).toString(
        "base64",
      );
      return __assign(__assign({}, headers), { Authorization: "Basic ".concat(auth) });
    }
  } catch (_a) {
    // ignore
  }
  return headers;
}
function appendCdpPath(cdpUrl, path) {
  var url = new URL(cdpUrl);
  var basePath = url.pathname.replace(/\/$/, "");
  var suffix = path.startsWith("/") ? path : "/".concat(path);
  url.pathname = "".concat(basePath).concat(suffix);
  return url.toString();
}
function createCdpSender(ws) {
  var nextId = 1;
  var pending = new Map();
  var send = function (method, params) {
    var id = nextId++;
    var msg = { id: id, method: method, params: params };
    ws.send(JSON.stringify(msg));
    return new Promise(function (resolve, reject) {
      pending.set(id, { resolve: resolve, reject: reject });
    });
  };
  var closeWithError = function (err) {
    for (var _i = 0, pending_1 = pending; _i < pending_1.length; _i++) {
      var _a = pending_1[_i],
        p = _a[1];
      p.reject(err);
    }
    pending.clear();
    try {
      ws.close();
    } catch (_b) {
      // ignore
    }
  };
  ws.on("message", function (data) {
    var _a;
    try {
      var parsed = JSON.parse((0, ws_js_1.rawDataToString)(data));
      if (typeof parsed.id !== "number") {
        return;
      }
      var p = pending.get(parsed.id);
      if (!p) {
        return;
      }
      pending.delete(parsed.id);
      if ((_a = parsed.error) === null || _a === void 0 ? void 0 : _a.message) {
        p.reject(new Error(parsed.error.message));
        return;
      }
      p.resolve(parsed.result);
    } catch (_b) {
      // ignore
    }
  });
  ws.on("close", function () {
    closeWithError(new Error("CDP socket closed"));
  });
  return { send: send, closeWithError: closeWithError };
}
function fetchJson(url_1) {
  return __awaiter(this, arguments, void 0, function (url, timeoutMs, init) {
    var ctrl, t, headers, res;
    if (timeoutMs === void 0) {
      timeoutMs = 1500;
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          ctrl = new AbortController();
          t = setTimeout(function () {
            return ctrl.abort();
          }, timeoutMs);
          _a.label = 1;
        case 1:
          _a.trys.push([1, , 4, 5]);
          headers = getHeadersWithAuth(
            url,
            (init === null || init === void 0 ? void 0 : init.headers) || {},
          );
          return [
            4 /*yield*/,
            fetch(url, __assign(__assign({}, init), { headers: headers, signal: ctrl.signal })),
          ];
        case 2:
          res = _a.sent();
          if (!res.ok) {
            throw new Error("HTTP ".concat(res.status));
          }
          return [4 /*yield*/, res.json()];
        case 3:
          return [2 /*return*/, _a.sent()];
        case 4:
          clearTimeout(t);
          return [7 /*endfinally*/];
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
function fetchOk(url_1) {
  return __awaiter(this, arguments, void 0, function (url, timeoutMs, init) {
    var ctrl, t, headers, res;
    if (timeoutMs === void 0) {
      timeoutMs = 1500;
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          ctrl = new AbortController();
          t = setTimeout(function () {
            return ctrl.abort();
          }, timeoutMs);
          _a.label = 1;
        case 1:
          _a.trys.push([1, , 3, 4]);
          headers = getHeadersWithAuth(
            url,
            (init === null || init === void 0 ? void 0 : init.headers) || {},
          );
          return [
            4 /*yield*/,
            fetch(url, __assign(__assign({}, init), { headers: headers, signal: ctrl.signal })),
          ];
        case 2:
          res = _a.sent();
          if (!res.ok) {
            throw new Error("HTTP ".concat(res.status));
          }
          return [3 /*break*/, 4];
        case 3:
          clearTimeout(t);
          return [7 /*endfinally*/];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function withCdpSocket(wsUrl, fn, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var headers, ws, _a, send, closeWithError, openPromise, err_1;
    var _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          headers = getHeadersWithAuth(
            wsUrl,
            (_b = opts === null || opts === void 0 ? void 0 : opts.headers) !== null &&
              _b !== void 0
              ? _b
              : {},
          );
          ws = new ws_1.default(
            wsUrl,
            __assign(
              { handshakeTimeout: 5000 },
              Object.keys(headers).length ? { headers: headers } : {},
            ),
          );
          ((_a = createCdpSender(ws)), (send = _a.send), (closeWithError = _a.closeWithError));
          openPromise = new Promise(function (resolve, reject) {
            ws.once("open", function () {
              return resolve();
            });
            ws.once("error", function (err) {
              return reject(err);
            });
          });
          return [4 /*yield*/, openPromise];
        case 1:
          _c.sent();
          _c.label = 2;
        case 2:
          _c.trys.push([2, 4, 5, 6]);
          return [4 /*yield*/, fn(send)];
        case 3:
          return [2 /*return*/, _c.sent()];
        case 4:
          err_1 = _c.sent();
          closeWithError(err_1 instanceof Error ? err_1 : new Error(String(err_1)));
          throw err_1;
        case 5:
          try {
            ws.close();
          } catch (_d) {
            // ignore
          }
          return [7 /*endfinally*/];
        case 6:
          return [2 /*return*/];
      }
    });
  });
}
