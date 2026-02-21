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
exports.stageSandboxMedia = stageSandboxMedia;
var node_child_process_1 = require("node:child_process");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var sandbox_js_1 = require("../../agents/sandbox.js");
var globals_js_1 = require("../../globals.js");
var utils_js_1 = require("../../utils.js");
function stageSandboxMedia(params) {
  return __awaiter(this, void 0, void 0, function () {
    var ctx,
      sessionCtx,
      cfg,
      sessionKey,
      workspaceDir,
      hasPathsArray,
      pathsFromArray,
      rawPaths,
      sandbox,
      remoteMediaCacheDir,
      effectiveWorkspaceDir,
      resolveAbsolutePath,
      destDir,
      usedNames,
      staged_1,
      _i,
      rawPaths_1,
      raw,
      source,
      baseName,
      parsed,
      fileName,
      suffix,
      dest,
      stagedPath,
      rewriteIfStaged_1,
      nextMediaPaths,
      rewritten,
      nextUrls,
      rewrittenUrl,
      err_1;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          ((ctx = params.ctx),
            (sessionCtx = params.sessionCtx),
            (cfg = params.cfg),
            (sessionKey = params.sessionKey),
            (workspaceDir = params.workspaceDir));
          hasPathsArray = Array.isArray(ctx.MediaPaths) && ctx.MediaPaths.length > 0;
          pathsFromArray = Array.isArray(ctx.MediaPaths) ? ctx.MediaPaths : undefined;
          rawPaths =
            pathsFromArray && pathsFromArray.length > 0
              ? pathsFromArray
              : ((_a = ctx.MediaPath) === null || _a === void 0 ? void 0 : _a.trim())
                ? [ctx.MediaPath.trim()]
                : [];
          if (rawPaths.length === 0 || !sessionKey) {
            return [2 /*return*/];
          }
          return [
            4 /*yield*/,
            (0, sandbox_js_1.ensureSandboxWorkspaceForSession)({
              config: cfg,
              sessionKey: sessionKey,
              workspaceDir: workspaceDir,
            }),
          ];
        case 1:
          sandbox = _c.sent();
          remoteMediaCacheDir = ctx.MediaRemoteHost
            ? node_path_1.default.join(utils_js_1.CONFIG_DIR, "media", "remote-cache", sessionKey)
            : null;
          effectiveWorkspaceDir =
            (_b = sandbox === null || sandbox === void 0 ? void 0 : sandbox.workspaceDir) !==
              null && _b !== void 0
              ? _b
              : remoteMediaCacheDir;
          if (!effectiveWorkspaceDir) {
            return [2 /*return*/];
          }
          resolveAbsolutePath = function (value) {
            var resolved = value.trim();
            if (!resolved) {
              return null;
            }
            if (resolved.startsWith("file://")) {
              try {
                resolved = (0, node_url_1.fileURLToPath)(resolved);
              } catch (_a) {
                return null;
              }
            }
            if (!node_path_1.default.isAbsolute(resolved)) {
              return null;
            }
            return resolved;
          };
          _c.label = 2;
        case 2:
          _c.trys.push([2, 11, , 12]);
          destDir = sandbox
            ? node_path_1.default.join(effectiveWorkspaceDir, "media", "inbound")
            : effectiveWorkspaceDir;
          return [4 /*yield*/, promises_1.default.mkdir(destDir, { recursive: true })];
        case 3:
          _c.sent();
          usedNames = new Set();
          staged_1 = new Map();
          ((_i = 0), (rawPaths_1 = rawPaths));
          _c.label = 4;
        case 4:
          if (!(_i < rawPaths_1.length)) {
            return [3 /*break*/, 10];
          }
          raw = rawPaths_1[_i];
          source = resolveAbsolutePath(raw);
          if (!source) {
            return [3 /*break*/, 9];
          }
          if (staged_1.has(source)) {
            return [3 /*break*/, 9];
          }
          baseName = node_path_1.default.basename(source);
          if (!baseName) {
            return [3 /*break*/, 9];
          }
          parsed = node_path_1.default.parse(baseName);
          fileName = baseName;
          suffix = 1;
          while (usedNames.has(fileName)) {
            fileName = "".concat(parsed.name, "-").concat(suffix).concat(parsed.ext);
            suffix += 1;
          }
          usedNames.add(fileName);
          dest = node_path_1.default.join(destDir, fileName);
          if (!ctx.MediaRemoteHost) {
            return [3 /*break*/, 6];
          }
          // Always use SCP when remote host is configured - local paths refer to remote machine
          return [4 /*yield*/, scpFile(ctx.MediaRemoteHost, source, dest)];
        case 5:
          // Always use SCP when remote host is configured - local paths refer to remote machine
          _c.sent();
          return [3 /*break*/, 8];
        case 6:
          return [4 /*yield*/, promises_1.default.copyFile(source, dest)];
        case 7:
          _c.sent();
          _c.label = 8;
        case 8:
          stagedPath = sandbox
            ? node_path_1.default.posix.join("media", "inbound", fileName)
            : dest;
          staged_1.set(source, stagedPath);
          _c.label = 9;
        case 9:
          _i++;
          return [3 /*break*/, 4];
        case 10:
          rewriteIfStaged_1 = function (value) {
            var raw = value === null || value === void 0 ? void 0 : value.trim();
            if (!raw) {
              return value;
            }
            var abs = resolveAbsolutePath(raw);
            if (!abs) {
              return value;
            }
            var mapped = staged_1.get(abs);
            return mapped !== null && mapped !== void 0 ? mapped : value;
          };
          nextMediaPaths = hasPathsArray
            ? rawPaths.map(function (p) {
                var _a;
                return (_a = rewriteIfStaged_1(p)) !== null && _a !== void 0 ? _a : p;
              })
            : undefined;
          if (nextMediaPaths) {
            ctx.MediaPaths = nextMediaPaths;
            sessionCtx.MediaPaths = nextMediaPaths;
            ctx.MediaPath = nextMediaPaths[0];
            sessionCtx.MediaPath = nextMediaPaths[0];
          } else {
            rewritten = rewriteIfStaged_1(ctx.MediaPath);
            if (rewritten && rewritten !== ctx.MediaPath) {
              ctx.MediaPath = rewritten;
              sessionCtx.MediaPath = rewritten;
            }
          }
          if (Array.isArray(ctx.MediaUrls) && ctx.MediaUrls.length > 0) {
            nextUrls = ctx.MediaUrls.map(function (u) {
              var _a;
              return (_a = rewriteIfStaged_1(u)) !== null && _a !== void 0 ? _a : u;
            });
            ctx.MediaUrls = nextUrls;
            sessionCtx.MediaUrls = nextUrls;
          }
          rewrittenUrl = rewriteIfStaged_1(ctx.MediaUrl);
          if (rewrittenUrl && rewrittenUrl !== ctx.MediaUrl) {
            ctx.MediaUrl = rewrittenUrl;
            sessionCtx.MediaUrl = rewrittenUrl;
          }
          return [3 /*break*/, 12];
        case 11:
          err_1 = _c.sent();
          (0, globals_js_1.logVerbose)(
            "Failed to stage inbound media for sandbox: ".concat(String(err_1)),
          );
          return [3 /*break*/, 12];
        case 12:
          return [2 /*return*/];
      }
    });
  });
}
function scpFile(remoteHost, remotePath, localPath) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      return [
        2 /*return*/,
        new Promise(function (resolve, reject) {
          var _a, _b;
          var child = (0, node_child_process_1.spawn)(
            "/usr/bin/scp",
            [
              "-o",
              "BatchMode=yes",
              "-o",
              "StrictHostKeyChecking=accept-new",
              "".concat(remoteHost, ":").concat(remotePath),
              localPath,
            ],
            { stdio: ["ignore", "ignore", "pipe"] },
          );
          var stderr = "";
          (_a = child.stderr) === null || _a === void 0 ? void 0 : _a.setEncoding("utf8");
          (_b = child.stderr) === null || _b === void 0
            ? void 0
            : _b.on("data", function (chunk) {
                stderr += chunk;
              });
          child.once("error", reject);
          child.once("exit", function (code) {
            if (code === 0) {
              resolve();
            } else {
              reject(new Error("scp failed (".concat(code, "): ").concat(stderr.trim())));
            }
          });
        }),
      ];
    });
  });
}
