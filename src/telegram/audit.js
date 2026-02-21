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
exports.collectTelegramUnmentionedGroupIds = collectTelegramUnmentionedGroupIds;
exports.auditTelegramGroupMembership = auditTelegramGroupMembership;
var proxy_js_1 = require("./proxy.js");
var TELEGRAM_API_BASE = "https://api.telegram.org";
function fetchWithTimeout(url, timeoutMs, fetcher) {
  return __awaiter(this, void 0, void 0, function () {
    var controller, timer;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          controller = new AbortController();
          timer = setTimeout(function () {
            return controller.abort();
          }, timeoutMs);
          _a.label = 1;
        case 1:
          _a.trys.push([1, , 3, 4]);
          return [4 /*yield*/, fetcher(url, { signal: controller.signal })];
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
function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function collectTelegramUnmentionedGroupIds(groups) {
  var _a, _b;
  if (!groups || typeof groups !== "object") {
    return {
      groupIds: [],
      unresolvedGroups: 0,
      hasWildcardUnmentionedGroups: false,
    };
  }
  var hasWildcardUnmentionedGroups =
    Boolean(
      ((_a = groups["*"]) === null || _a === void 0 ? void 0 : _a.requireMention) === false,
    ) && ((_b = groups["*"]) === null || _b === void 0 ? void 0 : _b.enabled) !== false;
  var groupIds = [];
  var unresolvedGroups = 0;
  for (var _i = 0, _c = Object.entries(groups); _i < _c.length; _i++) {
    var _d = _c[_i],
      key = _d[0],
      value = _d[1];
    if (key === "*") {
      continue;
    }
    if (!value || typeof value !== "object") {
      continue;
    }
    if (value.enabled === false) {
      continue;
    }
    if (value.requireMention !== false) {
      continue;
    }
    var id = String(key).trim();
    if (!id) {
      continue;
    }
    if (/^-?\d+$/.test(id)) {
      groupIds.push(id);
    } else {
      unresolvedGroups += 1;
    }
  }
  groupIds.sort(function (a, b) {
    return a.localeCompare(b);
  });
  return {
    groupIds: groupIds,
    unresolvedGroups: unresolvedGroups,
    hasWildcardUnmentionedGroups: hasWildcardUnmentionedGroups,
  };
}
function auditTelegramGroupMembership(params) {
  return __awaiter(this, void 0, void 0, function () {
    var started,
      token,
      fetcher,
      base,
      groups,
      _i,
      _a,
      chatId,
      url,
      res,
      json,
      desc,
      status_1,
      ok,
      err_1;
    var _b, _c, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          started = Date.now();
          token =
            (_c = (_b = params.token) === null || _b === void 0 ? void 0 : _b.trim()) !== null &&
            _c !== void 0
              ? _c
              : "";
          if (!token || params.groupIds.length === 0) {
            return [
              2 /*return*/,
              {
                ok: true,
                checkedGroups: 0,
                unresolvedGroups: 0,
                hasWildcardUnmentionedGroups: false,
                groups: [],
                elapsedMs: Date.now() - started,
              },
            ];
          }
          fetcher = params.proxyUrl ? (0, proxy_js_1.makeProxyFetch)(params.proxyUrl) : fetch;
          base = "".concat(TELEGRAM_API_BASE, "/bot").concat(token);
          groups = [];
          ((_i = 0), (_a = params.groupIds));
          _e.label = 1;
        case 1:
          if (!(_i < _a.length)) {
            return [3 /*break*/, 7];
          }
          chatId = _a[_i];
          _e.label = 2;
        case 2:
          _e.trys.push([2, 5, , 6]);
          url = ""
            .concat(base, "/getChatMember?chat_id=")
            .concat(encodeURIComponent(chatId), "&user_id=")
            .concat(encodeURIComponent(String(params.botId)));
          return [4 /*yield*/, fetchWithTimeout(url, params.timeoutMs, fetcher)];
        case 3:
          res = _e.sent();
          return [4 /*yield*/, res.json()];
        case 4:
          json = _e.sent();
          if (!res.ok || !isRecord(json) || json.ok !== true) {
            desc =
              isRecord(json) && json.ok === false && typeof json.description === "string"
                ? json.description
                : "getChatMember failed (".concat(res.status, ")");
            groups.push({
              chatId: chatId,
              ok: false,
              status: null,
              error: desc,
              matchKey: chatId,
              matchSource: "id",
            });
            return [3 /*break*/, 6];
          }
          status_1 = isRecord(json.result)
            ? (_d = json.result.status) !== null && _d !== void 0
              ? _d
              : null
            : null;
          ok = status_1 === "creator" || status_1 === "administrator" || status_1 === "member";
          groups.push({
            chatId: chatId,
            ok: ok,
            status: status_1,
            error: ok ? null : "bot not in group",
            matchKey: chatId,
            matchSource: "id",
          });
          return [3 /*break*/, 6];
        case 5:
          err_1 = _e.sent();
          groups.push({
            chatId: chatId,
            ok: false,
            status: null,
            error: err_1 instanceof Error ? err_1.message : String(err_1),
            matchKey: chatId,
            matchSource: "id",
          });
          return [3 /*break*/, 6];
        case 6:
          _i++;
          return [3 /*break*/, 1];
        case 7:
          return [
            2 /*return*/,
            {
              ok: groups.every(function (g) {
                return g.ok;
              }),
              checkedGroups: groups.length,
              unresolvedGroups: 0,
              hasWildcardUnmentionedGroups: false,
              groups: groups,
              elapsedMs: Date.now() - started,
            },
          ];
      }
    });
  });
}
