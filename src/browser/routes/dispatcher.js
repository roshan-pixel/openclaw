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
exports.createBrowserRouteDispatcher = createBrowserRouteDispatcher;
var index_js_1 = require("./index.js");
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function compileRoute(path) {
  var paramNames = [];
  var parts = path.split("/").map(function (part) {
    if (part.startsWith(":")) {
      var name_1 = part.slice(1);
      paramNames.push(name_1);
      return "([^/]+)";
    }
    return escapeRegex(part);
  });
  return { regex: new RegExp("^".concat(parts.join("/"), "$")), paramNames: paramNames };
}
function createRegistry() {
  var routes = [];
  var register = function (method) {
    return function (path, handler) {
      var _a = compileRoute(path),
        regex = _a.regex,
        paramNames = _a.paramNames;
      routes.push({
        method: method,
        path: path,
        regex: regex,
        paramNames: paramNames,
        handler: handler,
      });
    };
  };
  var router = {
    get: register("GET"),
    post: register("POST"),
    delete: register("DELETE"),
  };
  return { routes: routes, router: router };
}
function normalizePath(path) {
  if (!path) {
    return "/";
  }
  return path.startsWith("/") ? path : "/".concat(path);
}
function createBrowserRouteDispatcher(ctx) {
  var _this = this;
  var registry = createRegistry();
  (0, index_js_1.registerBrowserRoutes)(registry.router, ctx);
  return {
    dispatch: function (req) {
      return __awaiter(_this, void 0, void 0, function () {
        var method,
          path,
          query,
          body,
          match,
          exec,
          params,
          _i,
          _a,
          _b,
          idx,
          name_2,
          value,
          status,
          payload,
          res,
          err_1;
        var _c;
        return __generator(this, function (_d) {
          switch (_d.label) {
            case 0:
              method = req.method;
              path = normalizePath(req.path);
              query = (_c = req.query) !== null && _c !== void 0 ? _c : {};
              body = req.body;
              match = registry.routes.find(function (route) {
                if (route.method !== method) {
                  return false;
                }
                return route.regex.test(path);
              });
              if (!match) {
                return [2 /*return*/, { status: 404, body: { error: "Not Found" } }];
              }
              exec = match.regex.exec(path);
              params = {};
              if (exec) {
                for (_i = 0, _a = match.paramNames.entries(); _i < _a.length; _i++) {
                  ((_b = _a[_i]), (idx = _b[0]), (name_2 = _b[1]));
                  value = exec[idx + 1];
                  if (typeof value === "string") {
                    params[name_2] = decodeURIComponent(value);
                  }
                }
              }
              status = 200;
              payload = undefined;
              res = {
                status: function (code) {
                  status = code;
                  return res;
                },
                json: function (bodyValue) {
                  payload = bodyValue;
                },
              };
              _d.label = 1;
            case 1:
              _d.trys.push([1, 3, , 4]);
              return [
                4 /*yield*/,
                match.handler(
                  {
                    params: params,
                    query: query,
                    body: body,
                  },
                  res,
                ),
              ];
            case 2:
              _d.sent();
              return [3 /*break*/, 4];
            case 3:
              err_1 = _d.sent();
              return [2 /*return*/, { status: 500, body: { error: String(err_1) } }];
            case 4:
              return [2 /*return*/, { status: status, body: payload }];
          }
        });
      });
    },
  };
}
