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
exports.createApplyPatchTool = createApplyPatchTool;
exports.applyPatch = applyPatch;
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var typebox_1 = require("@sinclair/typebox");
var apply_patch_update_js_1 = require("./apply-patch-update.js");
var sandbox_paths_js_1 = require("./sandbox-paths.js");
var BEGIN_PATCH_MARKER = "*** Begin Patch";
var END_PATCH_MARKER = "*** End Patch";
var ADD_FILE_MARKER = "*** Add File: ";
var DELETE_FILE_MARKER = "*** Delete File: ";
var UPDATE_FILE_MARKER = "*** Update File: ";
var MOVE_TO_MARKER = "*** Move to: ";
var EOF_MARKER = "*** End of File";
var CHANGE_CONTEXT_MARKER = "@@ ";
var EMPTY_CHANGE_CONTEXT_MARKER = "@@";
var UNICODE_SPACES = /[\u00A0\u2000-\u200A\u202F\u205F\u3000]/g;
var applyPatchSchema = typebox_1.Type.Object({
  input: typebox_1.Type.String({
    description: "Patch content using the *** Begin Patch/End Patch format.",
  }),
});
function createApplyPatchTool(options) {
  var _this = this;
  var _a;
  if (options === void 0) {
    options = {};
  }
  var cwd = (_a = options.cwd) !== null && _a !== void 0 ? _a : process.cwd();
  var sandboxRoot = options.sandboxRoot;
  return {
    name: "apply_patch",
    label: "apply_patch",
    description:
      "Apply a patch to one or more files using the apply_patch format. The input should include *** Begin Patch and *** End Patch markers.",
    parameters: applyPatchSchema,
    execute: function (_toolCallId, args, signal) {
      return __awaiter(_this, void 0, void 0, function () {
        var params, input, err, result;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              params = args;
              input = typeof params.input === "string" ? params.input : "";
              if (!input.trim()) {
                throw new Error("Provide a patch input.");
              }
              if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
                err = new Error("Aborted");
                err.name = "AbortError";
                throw err;
              }
              return [
                4 /*yield*/,
                applyPatch(input, {
                  cwd: cwd,
                  sandboxRoot: sandboxRoot,
                  signal: signal,
                }),
              ];
            case 1:
              result = _a.sent();
              return [
                2 /*return*/,
                {
                  content: [{ type: "text", text: result.text }],
                  details: { summary: result.summary },
                },
              ];
          }
        });
      });
    },
  };
}
function applyPatch(input, options) {
  return __awaiter(this, void 0, void 0, function () {
    var parsed, summary, seen, _i, _a, hunk, err, target_1, target_2, target, applied, moveTarget;
    var _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          parsed = parsePatchText(input);
          if (parsed.hunks.length === 0) {
            throw new Error("No files were modified.");
          }
          summary = {
            added: [],
            modified: [],
            deleted: [],
          };
          seen = {
            added: new Set(),
            modified: new Set(),
            deleted: new Set(),
          };
          ((_i = 0), (_a = parsed.hunks));
          _c.label = 1;
        case 1:
          if (!(_i < _a.length)) {
            return [3 /*break*/, 18];
          }
          hunk = _a[_i];
          if ((_b = options.signal) === null || _b === void 0 ? void 0 : _b.aborted) {
            err = new Error("Aborted");
            err.name = "AbortError";
            throw err;
          }
          if (!(hunk.kind === "add")) {
            return [3 /*break*/, 5];
          }
          return [4 /*yield*/, resolvePatchPath(hunk.path, options)];
        case 2:
          target_1 = _c.sent();
          return [4 /*yield*/, ensureDir(target_1.resolved)];
        case 3:
          _c.sent();
          return [
            4 /*yield*/,
            promises_1.default.writeFile(target_1.resolved, hunk.contents, "utf8"),
          ];
        case 4:
          _c.sent();
          recordSummary(summary, seen, "added", target_1.display);
          return [3 /*break*/, 17];
        case 5:
          if (!(hunk.kind === "delete")) {
            return [3 /*break*/, 8];
          }
          return [4 /*yield*/, resolvePatchPath(hunk.path, options)];
        case 6:
          target_2 = _c.sent();
          return [4 /*yield*/, promises_1.default.rm(target_2.resolved)];
        case 7:
          _c.sent();
          recordSummary(summary, seen, "deleted", target_2.display);
          return [3 /*break*/, 17];
        case 8:
          return [4 /*yield*/, resolvePatchPath(hunk.path, options)];
        case 9:
          target = _c.sent();
          return [
            4 /*yield*/,
            (0, apply_patch_update_js_1.applyUpdateHunk)(target.resolved, hunk.chunks),
          ];
        case 10:
          applied = _c.sent();
          if (!hunk.movePath) {
            return [3 /*break*/, 15];
          }
          return [4 /*yield*/, resolvePatchPath(hunk.movePath, options)];
        case 11:
          moveTarget = _c.sent();
          return [4 /*yield*/, ensureDir(moveTarget.resolved)];
        case 12:
          _c.sent();
          return [4 /*yield*/, promises_1.default.writeFile(moveTarget.resolved, applied, "utf8")];
        case 13:
          _c.sent();
          return [4 /*yield*/, promises_1.default.rm(target.resolved)];
        case 14:
          _c.sent();
          recordSummary(summary, seen, "modified", moveTarget.display);
          return [3 /*break*/, 17];
        case 15:
          return [4 /*yield*/, promises_1.default.writeFile(target.resolved, applied, "utf8")];
        case 16:
          _c.sent();
          recordSummary(summary, seen, "modified", target.display);
          _c.label = 17;
        case 17:
          _i++;
          return [3 /*break*/, 1];
        case 18:
          return [
            2 /*return*/,
            {
              summary: summary,
              text: formatSummary(summary),
            },
          ];
      }
    });
  });
}
function recordSummary(summary, seen, bucket, value) {
  if (seen[bucket].has(value)) {
    return;
  }
  seen[bucket].add(value);
  summary[bucket].push(value);
}
function formatSummary(summary) {
  var lines = ["Success. Updated the following files:"];
  for (var _i = 0, _a = summary.added; _i < _a.length; _i++) {
    var file = _a[_i];
    lines.push("A ".concat(file));
  }
  for (var _b = 0, _c = summary.modified; _b < _c.length; _b++) {
    var file = _c[_b];
    lines.push("M ".concat(file));
  }
  for (var _d = 0, _e = summary.deleted; _d < _e.length; _d++) {
    var file = _e[_d];
    lines.push("D ".concat(file));
  }
  return lines.join("\n");
}
function ensureDir(filePath) {
  return __awaiter(this, void 0, void 0, function () {
    var parent;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          parent = node_path_1.default.dirname(filePath);
          if (!parent || parent === ".") {
            return [2 /*return*/];
          }
          return [4 /*yield*/, promises_1.default.mkdir(parent, { recursive: true })];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function resolvePatchPath(filePath, options) {
  return __awaiter(this, void 0, void 0, function () {
    var resolved_1, resolved;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!options.sandboxRoot) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            (0, sandbox_paths_js_1.assertSandboxPath)({
              filePath: filePath,
              cwd: options.cwd,
              root: options.sandboxRoot,
            }),
          ];
        case 1:
          resolved_1 = _a.sent();
          return [
            2 /*return*/,
            {
              resolved: resolved_1.resolved,
              display: resolved_1.relative || resolved_1.resolved,
            },
          ];
        case 2:
          resolved = resolvePathFromCwd(filePath, options.cwd);
          return [
            2 /*return*/,
            {
              resolved: resolved,
              display: toDisplayPath(resolved, options.cwd),
            },
          ];
      }
    });
  });
}
function normalizeUnicodeSpaces(value) {
  return value.replace(UNICODE_SPACES, " ");
}
function expandPath(filePath) {
  var normalized = normalizeUnicodeSpaces(filePath);
  if (normalized === "~") {
    return node_os_1.default.homedir();
  }
  if (normalized.startsWith("~/")) {
    return node_os_1.default.homedir() + normalized.slice(1);
  }
  return normalized;
}
function resolvePathFromCwd(filePath, cwd) {
  var expanded = expandPath(filePath);
  if (node_path_1.default.isAbsolute(expanded)) {
    return node_path_1.default.normalize(expanded);
  }
  return node_path_1.default.resolve(cwd, expanded);
}
function toDisplayPath(resolved, cwd) {
  var relative = node_path_1.default.relative(cwd, resolved);
  if (!relative || relative === "") {
    return node_path_1.default.basename(resolved);
  }
  if (relative.startsWith("..") || node_path_1.default.isAbsolute(relative)) {
    return resolved;
  }
  return relative;
}
function parsePatchText(input) {
  var trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Invalid patch: input is empty.");
  }
  var lines = trimmed.split(/\r?\n/);
  var validated = checkPatchBoundariesLenient(lines);
  var hunks = [];
  var lastLineIndex = validated.length - 1;
  var remaining = validated.slice(1, lastLineIndex);
  var lineNumber = 2;
  while (remaining.length > 0) {
    var _a = parseOneHunk(remaining, lineNumber),
      hunk = _a.hunk,
      consumed = _a.consumed;
    hunks.push(hunk);
    lineNumber += consumed;
    remaining = remaining.slice(consumed);
  }
  return { hunks: hunks, patch: validated.join("\n") };
}
function checkPatchBoundariesLenient(lines) {
  var strictError = checkPatchBoundariesStrict(lines);
  if (!strictError) {
    return lines;
  }
  if (lines.length < 4) {
    throw new Error(strictError);
  }
  var first = lines[0];
  var last = lines[lines.length - 1];
  if ((first === "<<EOF" || first === "<<'EOF'" || first === '<<"EOF"') && last.endsWith("EOF")) {
    var inner = lines.slice(1, lines.length - 1);
    var innerError = checkPatchBoundariesStrict(inner);
    if (!innerError) {
      return inner;
    }
    throw new Error(innerError);
  }
  throw new Error(strictError);
}
function checkPatchBoundariesStrict(lines) {
  var _a, _b;
  var firstLine = (_a = lines[0]) === null || _a === void 0 ? void 0 : _a.trim();
  var lastLine = (_b = lines[lines.length - 1]) === null || _b === void 0 ? void 0 : _b.trim();
  if (firstLine === BEGIN_PATCH_MARKER && lastLine === END_PATCH_MARKER) {
    return null;
  }
  if (firstLine !== BEGIN_PATCH_MARKER) {
    return "The first line of the patch must be '*** Begin Patch'";
  }
  return "The last line of the patch must be '*** End Patch'";
}
function parseOneHunk(lines, lineNumber) {
  var _a;
  if (lines.length === 0) {
    throw new Error("Invalid patch hunk at line ".concat(lineNumber, ": empty hunk"));
  }
  var firstLine = lines[0].trim();
  if (firstLine.startsWith(ADD_FILE_MARKER)) {
    var targetPath = firstLine.slice(ADD_FILE_MARKER.length);
    var contents = "";
    var consumed = 1;
    for (var _i = 0, _b = lines.slice(1); _i < _b.length; _i++) {
      var addLine = _b[_i];
      if (addLine.startsWith("+")) {
        contents += "".concat(addLine.slice(1), "\n");
        consumed += 1;
      } else {
        break;
      }
    }
    return {
      hunk: { kind: "add", path: targetPath, contents: contents },
      consumed: consumed,
    };
  }
  if (firstLine.startsWith(DELETE_FILE_MARKER)) {
    var targetPath = firstLine.slice(DELETE_FILE_MARKER.length);
    return {
      hunk: { kind: "delete", path: targetPath },
      consumed: 1,
    };
  }
  if (firstLine.startsWith(UPDATE_FILE_MARKER)) {
    var targetPath = firstLine.slice(UPDATE_FILE_MARKER.length);
    var remaining = lines.slice(1);
    var consumed = 1;
    var movePath = void 0;
    var moveCandidate = (_a = remaining[0]) === null || _a === void 0 ? void 0 : _a.trim();
    if (
      moveCandidate === null || moveCandidate === void 0
        ? void 0
        : moveCandidate.startsWith(MOVE_TO_MARKER)
    ) {
      movePath = moveCandidate.slice(MOVE_TO_MARKER.length);
      remaining = remaining.slice(1);
      consumed += 1;
    }
    var chunks = [];
    while (remaining.length > 0) {
      if (remaining[0].trim() === "") {
        remaining = remaining.slice(1);
        consumed += 1;
        continue;
      }
      if (remaining[0].startsWith("***")) {
        break;
      }
      var _c = parseUpdateFileChunk(remaining, lineNumber + consumed, chunks.length === 0),
        chunk = _c.chunk,
        chunkLines = _c.consumed;
      chunks.push(chunk);
      remaining = remaining.slice(chunkLines);
      consumed += chunkLines;
    }
    if (chunks.length === 0) {
      throw new Error(
        "Invalid patch hunk at line "
          .concat(lineNumber, ": Update file hunk for path '")
          .concat(targetPath, "' is empty"),
      );
    }
    return {
      hunk: {
        kind: "update",
        path: targetPath,
        movePath: movePath,
        chunks: chunks,
      },
      consumed: consumed,
    };
  }
  throw new Error(
    "Invalid patch hunk at line "
      .concat(lineNumber, ": '")
      .concat(
        lines[0],
        "' is not a valid hunk header. Valid hunk headers: '*** Add File: {path}', '*** Delete File: {path}', '*** Update File: {path}'",
      ),
  );
}
function parseUpdateFileChunk(lines, lineNumber, allowMissingContext) {
  if (lines.length === 0) {
    throw new Error(
      "Invalid patch hunk at line ".concat(lineNumber, ": Update hunk does not contain any lines"),
    );
  }
  var changeContext;
  var startIndex = 0;
  if (lines[0] === EMPTY_CHANGE_CONTEXT_MARKER) {
    startIndex = 1;
  } else if (lines[0].startsWith(CHANGE_CONTEXT_MARKER)) {
    changeContext = lines[0].slice(CHANGE_CONTEXT_MARKER.length);
    startIndex = 1;
  } else if (!allowMissingContext) {
    throw new Error(
      "Invalid patch hunk at line "
        .concat(lineNumber, ": Expected update hunk to start with a @@ context marker, got: '")
        .concat(lines[0], "'"),
    );
  }
  if (startIndex >= lines.length) {
    throw new Error(
      "Invalid patch hunk at line ".concat(
        lineNumber + 1,
        ": Update hunk does not contain any lines",
      ),
    );
  }
  var chunk = {
    changeContext: changeContext,
    oldLines: [],
    newLines: [],
    isEndOfFile: false,
  };
  var parsedLines = 0;
  for (var _i = 0, _a = lines.slice(startIndex); _i < _a.length; _i++) {
    var line = _a[_i];
    if (line === EOF_MARKER) {
      if (parsedLines === 0) {
        throw new Error(
          "Invalid patch hunk at line ".concat(
            lineNumber + 1,
            ": Update hunk does not contain any lines",
          ),
        );
      }
      chunk.isEndOfFile = true;
      parsedLines += 1;
      break;
    }
    var marker = line[0];
    if (!marker) {
      chunk.oldLines.push("");
      chunk.newLines.push("");
      parsedLines += 1;
      continue;
    }
    if (marker === " ") {
      var content = line.slice(1);
      chunk.oldLines.push(content);
      chunk.newLines.push(content);
      parsedLines += 1;
      continue;
    }
    if (marker === "+") {
      chunk.newLines.push(line.slice(1));
      parsedLines += 1;
      continue;
    }
    if (marker === "-") {
      chunk.oldLines.push(line.slice(1));
      parsedLines += 1;
      continue;
    }
    if (parsedLines === 0) {
      throw new Error(
        "Invalid patch hunk at line "
          .concat(lineNumber + 1, ": Unexpected line found in update hunk: '")
          .concat(
            line,
            "'. Every line should start with ' ' (context line), '+' (added line), or '-' (removed line)",
          ),
      );
    }
    break;
  }
  return { chunk: chunk, consumed: parsedLines + startIndex };
}
