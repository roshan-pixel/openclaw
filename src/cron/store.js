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
exports.DEFAULT_CRON_STORE_PATH = exports.DEFAULT_CRON_DIR = void 0;
exports.resolveCronStorePath = resolveCronStorePath;
exports.loadCronStore = loadCronStore;
exports.saveCronStore = saveCronStore;
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var json5_1 = require("json5");
var utils_js_1 = require("../utils.js");
exports.DEFAULT_CRON_DIR = node_path_1.default.join(utils_js_1.CONFIG_DIR, "cron");
exports.DEFAULT_CRON_STORE_PATH = node_path_1.default.join(exports.DEFAULT_CRON_DIR, "jobs.json");
function resolveCronStorePath(storePath) {
  if (storePath === null || storePath === void 0 ? void 0 : storePath.trim()) {
    var raw = storePath.trim();
    if (raw.startsWith("~")) {
      return node_path_1.default.resolve(raw.replace("~", node_os_1.default.homedir()));
    }
    return node_path_1.default.resolve(raw);
  }
  return exports.DEFAULT_CRON_STORE_PATH;
}
function loadCronStore(storePath) {
  return __awaiter(this, void 0, void 0, function () {
    var raw, parsed, jobs, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 2, , 3]);
          return [4 /*yield*/, node_fs_1.default.promises.readFile(storePath, "utf-8")];
        case 1:
          raw = _b.sent();
          parsed = json5_1.default.parse(raw);
          jobs = Array.isArray(parsed === null || parsed === void 0 ? void 0 : parsed.jobs)
            ? parsed === null || parsed === void 0
              ? void 0
              : parsed.jobs
            : [];
          return [
            2 /*return*/,
            {
              version: 1,
              jobs: jobs.filter(Boolean),
            },
          ];
        case 2:
          _a = _b.sent();
          return [2 /*return*/, { version: 1, jobs: [] }];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function saveCronStore(storePath, store) {
  return __awaiter(this, void 0, void 0, function () {
    var tmp, json, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [
            4 /*yield*/,
            node_fs_1.default.promises.mkdir(node_path_1.default.dirname(storePath), {
              recursive: true,
            }),
          ];
        case 1:
          _b.sent();
          tmp = ""
            .concat(storePath, ".")
            .concat(process.pid, ".")
            .concat(Math.random().toString(16).slice(2), ".tmp");
          json = JSON.stringify(store, null, 2);
          return [4 /*yield*/, node_fs_1.default.promises.writeFile(tmp, json, "utf-8")];
        case 2:
          _b.sent();
          return [4 /*yield*/, node_fs_1.default.promises.rename(tmp, storePath)];
        case 3:
          _b.sent();
          _b.label = 4;
        case 4:
          _b.trys.push([4, 6, , 7]);
          return [
            4 /*yield*/,
            node_fs_1.default.promises.copyFile(storePath, "".concat(storePath, ".bak")),
          ];
        case 5:
          _b.sent();
          return [3 /*break*/, 7];
        case 6:
          _a = _b.sent();
          return [3 /*break*/, 7];
        case 7:
          return [2 /*return*/];
      }
    });
  });
}
