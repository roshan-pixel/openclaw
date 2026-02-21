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
exports.ensureDir = ensureDir;
exports.normalizeRelPath = normalizeRelPath;
exports.normalizeExtraMemoryPaths = normalizeExtraMemoryPaths;
exports.isMemoryPath = isMemoryPath;
exports.listMemoryFiles = listMemoryFiles;
exports.hashText = hashText;
exports.buildFileEntry = buildFileEntry;
exports.chunkMarkdown = chunkMarkdown;
exports.parseEmbedding = parseEmbedding;
exports.cosineSimilarity = cosineSimilarity;
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
function ensureDir(dir) {
  try {
    node_fs_1.default.mkdirSync(dir, { recursive: true });
  } catch (_a) {}
  return dir;
}
function normalizeRelPath(value) {
  var trimmed = value.trim().replace(/^[./]+/, "");
  return trimmed.replace(/\\/g, "/");
}
function normalizeExtraMemoryPaths(workspaceDir, extraPaths) {
  if (!(extraPaths === null || extraPaths === void 0 ? void 0 : extraPaths.length)) {
    return [];
  }
  var resolved = extraPaths
    .map(function (value) {
      return value.trim();
    })
    .filter(Boolean)
    .map(function (value) {
      return node_path_1.default.isAbsolute(value)
        ? node_path_1.default.resolve(value)
        : node_path_1.default.resolve(workspaceDir, value);
    });
  return Array.from(new Set(resolved));
}
function isMemoryPath(relPath) {
  var normalized = normalizeRelPath(relPath);
  if (!normalized) {
    return false;
  }
  if (normalized === "MEMORY.md" || normalized === "memory.md") {
    return true;
  }
  return normalized.startsWith("memory/");
}
function walkDir(dir, files) {
  return __awaiter(this, void 0, void 0, function () {
    var entries, _i, entries_1, entry, full;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, promises_1.default.readdir(dir, { withFileTypes: true })];
        case 1:
          entries = _a.sent();
          ((_i = 0), (entries_1 = entries));
          _a.label = 2;
        case 2:
          if (!(_i < entries_1.length)) {
            return [3 /*break*/, 6];
          }
          entry = entries_1[_i];
          full = node_path_1.default.join(dir, entry.name);
          if (entry.isSymbolicLink()) {
            return [3 /*break*/, 5];
          }
          if (!entry.isDirectory()) {
            return [3 /*break*/, 4];
          }
          return [4 /*yield*/, walkDir(full, files)];
        case 3:
          _a.sent();
          return [3 /*break*/, 5];
        case 4:
          if (!entry.isFile()) {
            return [3 /*break*/, 5];
          }
          if (!entry.name.endsWith(".md")) {
            return [3 /*break*/, 5];
          }
          files.push(full);
          _a.label = 5;
        case 5:
          _i++;
          return [3 /*break*/, 2];
        case 6:
          return [2 /*return*/];
      }
    });
  });
}
function listMemoryFiles(workspaceDir, extraPaths) {
  return __awaiter(this, void 0, void 0, function () {
    var result,
      memoryFile,
      altMemoryFile,
      memoryDir,
      addMarkdownFile,
      dirStat,
      _a,
      normalizedExtraPaths,
      _i,
      normalizedExtraPaths_1,
      inputPath,
      stat,
      _b,
      seen,
      deduped,
      _c,
      result_1,
      entry,
      key,
      _d;
    var _this = this;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          result = [];
          memoryFile = node_path_1.default.join(workspaceDir, "MEMORY.md");
          altMemoryFile = node_path_1.default.join(workspaceDir, "memory.md");
          memoryDir = node_path_1.default.join(workspaceDir, "memory");
          addMarkdownFile = function (absPath) {
            return __awaiter(_this, void 0, void 0, function () {
              var stat, _a;
              return __generator(this, function (_b) {
                switch (_b.label) {
                  case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.lstat(absPath)];
                  case 1:
                    stat = _b.sent();
                    if (stat.isSymbolicLink() || !stat.isFile()) {
                      return [2 /*return*/];
                    }
                    if (!absPath.endsWith(".md")) {
                      return [2 /*return*/];
                    }
                    result.push(absPath);
                    return [3 /*break*/, 3];
                  case 2:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                  case 3:
                    return [2 /*return*/];
                }
              });
            });
          };
          return [4 /*yield*/, addMarkdownFile(memoryFile)];
        case 1:
          _e.sent();
          return [4 /*yield*/, addMarkdownFile(altMemoryFile)];
        case 2:
          _e.sent();
          _e.label = 3;
        case 3:
          _e.trys.push([3, 7, , 8]);
          return [4 /*yield*/, promises_1.default.lstat(memoryDir)];
        case 4:
          dirStat = _e.sent();
          if (!(!dirStat.isSymbolicLink() && dirStat.isDirectory())) {
            return [3 /*break*/, 6];
          }
          return [4 /*yield*/, walkDir(memoryDir, result)];
        case 5:
          _e.sent();
          _e.label = 6;
        case 6:
          return [3 /*break*/, 8];
        case 7:
          _a = _e.sent();
          return [3 /*break*/, 8];
        case 8:
          normalizedExtraPaths = normalizeExtraMemoryPaths(workspaceDir, extraPaths);
          if (!(normalizedExtraPaths.length > 0)) {
            return [3 /*break*/, 16];
          }
          ((_i = 0), (normalizedExtraPaths_1 = normalizedExtraPaths));
          _e.label = 9;
        case 9:
          if (!(_i < normalizedExtraPaths_1.length)) {
            return [3 /*break*/, 16];
          }
          inputPath = normalizedExtraPaths_1[_i];
          _e.label = 10;
        case 10:
          _e.trys.push([10, 14, , 15]);
          return [4 /*yield*/, promises_1.default.lstat(inputPath)];
        case 11:
          stat = _e.sent();
          if (stat.isSymbolicLink()) {
            return [3 /*break*/, 15];
          }
          if (!stat.isDirectory()) {
            return [3 /*break*/, 13];
          }
          return [4 /*yield*/, walkDir(inputPath, result)];
        case 12:
          _e.sent();
          return [3 /*break*/, 15];
        case 13:
          if (stat.isFile() && inputPath.endsWith(".md")) {
            result.push(inputPath);
          }
          return [3 /*break*/, 15];
        case 14:
          _b = _e.sent();
          return [3 /*break*/, 15];
        case 15:
          _i++;
          return [3 /*break*/, 9];
        case 16:
          if (result.length <= 1) {
            return [2 /*return*/, result];
          }
          seen = new Set();
          deduped = [];
          ((_c = 0), (result_1 = result));
          _e.label = 17;
        case 17:
          if (!(_c < result_1.length)) {
            return [3 /*break*/, 23];
          }
          entry = result_1[_c];
          key = entry;
          _e.label = 18;
        case 18:
          _e.trys.push([18, 20, , 21]);
          return [4 /*yield*/, promises_1.default.realpath(entry)];
        case 19:
          key = _e.sent();
          return [3 /*break*/, 21];
        case 20:
          _d = _e.sent();
          return [3 /*break*/, 21];
        case 21:
          if (seen.has(key)) {
            return [3 /*break*/, 22];
          }
          seen.add(key);
          deduped.push(entry);
          _e.label = 22;
        case 22:
          _c++;
          return [3 /*break*/, 17];
        case 23:
          return [2 /*return*/, deduped];
      }
    });
  });
}
function hashText(value) {
  return node_crypto_1.default.createHash("sha256").update(value).digest("hex");
}
function buildFileEntry(absPath, workspaceDir) {
  return __awaiter(this, void 0, void 0, function () {
    var stat, content, hash;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, promises_1.default.stat(absPath)];
        case 1:
          stat = _a.sent();
          return [4 /*yield*/, promises_1.default.readFile(absPath, "utf-8")];
        case 2:
          content = _a.sent();
          hash = hashText(content);
          return [
            2 /*return*/,
            {
              path: node_path_1.default.relative(workspaceDir, absPath).replace(/\\/g, "/"),
              absPath: absPath,
              mtimeMs: stat.mtimeMs,
              size: stat.size,
              hash: hash,
            },
          ];
      }
    });
  });
}
function chunkMarkdown(content, chunking) {
  var _a;
  var lines = content.split("\n");
  if (lines.length === 0) {
    return [];
  }
  var maxChars = Math.max(32, chunking.tokens * 4);
  var overlapChars = Math.max(0, chunking.overlap * 4);
  var chunks = [];
  var current = [];
  var currentChars = 0;
  var flush = function () {
    if (current.length === 0) {
      return;
    }
    var firstEntry = current[0];
    var lastEntry = current[current.length - 1];
    if (!firstEntry || !lastEntry) {
      return;
    }
    var text = current
      .map(function (entry) {
        return entry.line;
      })
      .join("\n");
    var startLine = firstEntry.lineNo;
    var endLine = lastEntry.lineNo;
    chunks.push({
      startLine: startLine,
      endLine: endLine,
      text: text,
      hash: hashText(text),
    });
  };
  var carryOverlap = function () {
    if (overlapChars <= 0 || current.length === 0) {
      current = [];
      currentChars = 0;
      return;
    }
    var acc = 0;
    var kept = [];
    for (var i = current.length - 1; i >= 0; i -= 1) {
      var entry = current[i];
      if (!entry) {
        continue;
      }
      acc += entry.line.length + 1;
      kept.unshift(entry);
      if (acc >= overlapChars) {
        break;
      }
    }
    current = kept;
    currentChars = kept.reduce(function (sum, entry) {
      return sum + entry.line.length + 1;
    }, 0);
  };
  for (var i = 0; i < lines.length; i += 1) {
    var line = (_a = lines[i]) !== null && _a !== void 0 ? _a : "";
    var lineNo = i + 1;
    var segments = [];
    if (line.length === 0) {
      segments.push("");
    } else {
      for (var start = 0; start < line.length; start += maxChars) {
        segments.push(line.slice(start, start + maxChars));
      }
    }
    for (var _i = 0, segments_1 = segments; _i < segments_1.length; _i++) {
      var segment = segments_1[_i];
      var lineSize = segment.length + 1;
      if (currentChars + lineSize > maxChars && current.length > 0) {
        flush();
        carryOverlap();
      }
      current.push({ line: segment, lineNo: lineNo });
      currentChars += lineSize;
    }
  }
  flush();
  return chunks;
}
function parseEmbedding(raw) {
  try {
    var parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_a) {
    return [];
  }
}
function cosineSimilarity(a, b) {
  var _a, _b;
  if (a.length === 0 || b.length === 0) {
    return 0;
  }
  var len = Math.min(a.length, b.length);
  var dot = 0;
  var normA = 0;
  var normB = 0;
  for (var i = 0; i < len; i += 1) {
    var av = (_a = a[i]) !== null && _a !== void 0 ? _a : 0;
    var bv = (_b = b[i]) !== null && _b !== void 0 ? _b : 0;
    dot += av * bv;
    normA += av * av;
    normB += bv * bv;
  }
  if (normA === 0 || normB === 0) {
    return 0;
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
