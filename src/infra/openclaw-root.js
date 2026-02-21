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
exports.resolveOpenClawPackageRoot = resolveOpenClawPackageRoot;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var CORE_PACKAGE_NAMES = new Set(["openclaw"]);
function readPackageName(dir) {
  return __awaiter(this, void 0, void 0, function () {
    var raw, parsed, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 2, , 3]);
          return [
            4 /*yield*/,
            promises_1.default.readFile(node_path_1.default.join(dir, "package.json"), "utf-8"),
          ];
        case 1:
          raw = _b.sent();
          parsed = JSON.parse(raw);
          return [2 /*return*/, typeof parsed.name === "string" ? parsed.name : null];
        case 2:
          _a = _b.sent();
          return [2 /*return*/, null];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function findPackageRoot(startDir_1) {
  return __awaiter(this, arguments, void 0, function (startDir, maxDepth) {
    var current, i, name_1, parent_1;
    if (maxDepth === void 0) {
      maxDepth = 12;
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          current = node_path_1.default.resolve(startDir);
          i = 0;
          _a.label = 1;
        case 1:
          if (!(i < maxDepth)) {
            return [3 /*break*/, 4];
          }
          return [4 /*yield*/, readPackageName(current)];
        case 2:
          name_1 = _a.sent();
          if (name_1 && CORE_PACKAGE_NAMES.has(name_1)) {
            return [2 /*return*/, current];
          }
          parent_1 = node_path_1.default.dirname(current);
          if (parent_1 === current) {
            return [3 /*break*/, 4];
          }
          current = parent_1;
          _a.label = 3;
        case 3:
          i += 1;
          return [3 /*break*/, 1];
        case 4:
          return [2 /*return*/, null];
      }
    });
  });
}
function candidateDirsFromArgv1(argv1) {
  var normalized = node_path_1.default.resolve(argv1);
  var candidates = [node_path_1.default.dirname(normalized)];
  var parts = normalized.split(node_path_1.default.sep);
  var binIndex = parts.lastIndexOf(".bin");
  if (binIndex > 0 && parts[binIndex - 1] === "node_modules") {
    var binName = node_path_1.default.basename(normalized);
    var nodeModulesDir = parts.slice(0, binIndex).join(node_path_1.default.sep);
    candidates.push(node_path_1.default.join(nodeModulesDir, binName));
  }
  return candidates;
}
function resolveOpenClawPackageRoot(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var candidates, _i, candidates_1, candidate, found;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          candidates = [];
          if (opts.moduleUrl) {
            candidates.push(
              node_path_1.default.dirname((0, node_url_1.fileURLToPath)(opts.moduleUrl)),
            );
          }
          if (opts.argv1) {
            candidates.push.apply(candidates, candidateDirsFromArgv1(opts.argv1));
          }
          if (opts.cwd) {
            candidates.push(opts.cwd);
          }
          ((_i = 0), (candidates_1 = candidates));
          _a.label = 1;
        case 1:
          if (!(_i < candidates_1.length)) {
            return [3 /*break*/, 4];
          }
          candidate = candidates_1[_i];
          return [4 /*yield*/, findPackageRoot(candidate)];
        case 2:
          found = _a.sent();
          if (found) {
            return [2 /*return*/, found];
          }
          _a.label = 3;
        case 3:
          _i++;
          return [3 /*break*/, 1];
        case 4:
          return [2 /*return*/, null];
      }
    });
  });
}
