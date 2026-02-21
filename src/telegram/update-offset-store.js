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
exports.readTelegramUpdateOffset = readTelegramUpdateOffset;
exports.writeTelegramUpdateOffset = writeTelegramUpdateOffset;
var node_crypto_1 = require("node:crypto");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var paths_js_1 = require("../config/paths.js");
var STORE_VERSION = 1;
function normalizeAccountId(accountId) {
  var trimmed = accountId === null || accountId === void 0 ? void 0 : accountId.trim();
  if (!trimmed) {
    return "default";
  }
  return trimmed.replace(/[^a-z0-9._-]+/gi, "_");
}
function resolveTelegramUpdateOffsetPath(accountId, env) {
  if (env === void 0) {
    env = process.env;
  }
  var stateDir = (0, paths_js_1.resolveStateDir)(env, node_os_1.default.homedir);
  var normalized = normalizeAccountId(accountId);
  return node_path_1.default.join(
    stateDir,
    "telegram",
    "update-offset-".concat(normalized, ".json"),
  );
}
function safeParseState(raw) {
  try {
    var parsed = JSON.parse(raw);
    if ((parsed === null || parsed === void 0 ? void 0 : parsed.version) !== STORE_VERSION) {
      return null;
    }
    if (parsed.lastUpdateId !== null && typeof parsed.lastUpdateId !== "number") {
      return null;
    }
    return parsed;
  } catch (_a) {
    return null;
  }
}
function readTelegramUpdateOffset(params) {
  return __awaiter(this, void 0, void 0, function () {
    var filePath, raw, parsed, err_1, code;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          filePath = resolveTelegramUpdateOffsetPath(params.accountId, params.env);
          _b.label = 1;
        case 1:
          _b.trys.push([1, 3, , 4]);
          return [4 /*yield*/, promises_1.default.readFile(filePath, "utf-8")];
        case 2:
          raw = _b.sent();
          parsed = safeParseState(raw);
          return [
            2 /*return*/,
            (_a = parsed === null || parsed === void 0 ? void 0 : parsed.lastUpdateId) !== null &&
            _a !== void 0
              ? _a
              : null,
          ];
        case 3:
          err_1 = _b.sent();
          code = err_1.code;
          if (code === "ENOENT") {
            return [2 /*return*/, null];
          }
          return [2 /*return*/, null];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function writeTelegramUpdateOffset(params) {
  return __awaiter(this, void 0, void 0, function () {
    var filePath, dir, tmp, payload;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          filePath = resolveTelegramUpdateOffsetPath(params.accountId, params.env);
          dir = node_path_1.default.dirname(filePath);
          return [4 /*yield*/, promises_1.default.mkdir(dir, { recursive: true, mode: 448 })];
        case 1:
          _a.sent();
          tmp = node_path_1.default.join(
            dir,
            ""
              .concat(node_path_1.default.basename(filePath), ".")
              .concat(node_crypto_1.default.randomUUID(), ".tmp"),
          );
          payload = {
            version: STORE_VERSION,
            lastUpdateId: params.updateId,
          };
          return [
            4 /*yield*/,
            promises_1.default.writeFile(tmp, "".concat(JSON.stringify(payload, null, 2), "\n"), {
              encoding: "utf-8",
            }),
          ];
        case 2:
          _a.sent();
          return [4 /*yield*/, promises_1.default.chmod(tmp, 384)];
        case 3:
          _a.sent();
          return [4 /*yield*/, promises_1.default.rename(tmp, filePath)];
        case 4:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
