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
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2) {
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyUpdateHunk = applyUpdateHunk;
var promises_1 = require("node:fs/promises");
function applyUpdateHunk(filePath, chunks) {
  return __awaiter(this, void 0, void 0, function () {
    var originalContents, originalLines, replacements, newLines;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            promises_1.default.readFile(filePath, "utf8").catch(function (err) {
              throw new Error("Failed to read file to update ".concat(filePath, ": ").concat(err));
            }),
          ];
        case 1:
          originalContents = _a.sent();
          originalLines = originalContents.split("\n");
          if (originalLines.length > 0 && originalLines[originalLines.length - 1] === "") {
            originalLines.pop();
          }
          replacements = computeReplacements(originalLines, filePath, chunks);
          newLines = applyReplacements(originalLines, replacements);
          if (newLines.length === 0 || newLines[newLines.length - 1] !== "") {
            newLines = __spreadArray(__spreadArray([], newLines, true), [""], false);
          }
          return [2 /*return*/, newLines.join("\n")];
      }
    });
  });
}
function computeReplacements(originalLines, filePath, chunks) {
  var replacements = [];
  var lineIndex = 0;
  for (var _i = 0, chunks_1 = chunks; _i < chunks_1.length; _i++) {
    var chunk = chunks_1[_i];
    if (chunk.changeContext) {
      var ctxIndex = seekSequence(originalLines, [chunk.changeContext], lineIndex, false);
      if (ctxIndex === null) {
        throw new Error(
          "Failed to find context '".concat(chunk.changeContext, "' in ").concat(filePath),
        );
      }
      lineIndex = ctxIndex + 1;
    }
    if (chunk.oldLines.length === 0) {
      var insertionIndex =
        originalLines.length > 0 && originalLines[originalLines.length - 1] === ""
          ? originalLines.length - 1
          : originalLines.length;
      replacements.push([insertionIndex, 0, chunk.newLines]);
      continue;
    }
    var pattern = chunk.oldLines;
    var newSlice = chunk.newLines;
    var found = seekSequence(originalLines, pattern, lineIndex, chunk.isEndOfFile);
    if (found === null && pattern[pattern.length - 1] === "") {
      pattern = pattern.slice(0, -1);
      if (newSlice.length > 0 && newSlice[newSlice.length - 1] === "") {
        newSlice = newSlice.slice(0, -1);
      }
      found = seekSequence(originalLines, pattern, lineIndex, chunk.isEndOfFile);
    }
    if (found === null) {
      throw new Error(
        "Failed to find expected lines in "
          .concat(filePath, ":\n")
          .concat(chunk.oldLines.join("\n")),
      );
    }
    replacements.push([found, pattern.length, newSlice]);
    lineIndex = found + pattern.length;
  }
  replacements.sort(function (a, b) {
    return a[0] - b[0];
  });
  return replacements;
}
function applyReplacements(lines, replacements) {
  var result = __spreadArray([], lines, true);
  for (var _i = 0, _a = __spreadArray([], replacements, true).toReversed(); _i < _a.length; _i++) {
    var _b = _a[_i],
      startIndex = _b[0],
      oldLen = _b[1],
      newLines = _b[2];
    for (var i = 0; i < oldLen; i += 1) {
      if (startIndex < result.length) {
        result.splice(startIndex, 1);
      }
    }
    for (var i = 0; i < newLines.length; i += 1) {
      result.splice(startIndex + i, 0, newLines[i]);
    }
  }
  return result;
}
function seekSequence(lines, pattern, start, eof) {
  if (pattern.length === 0) {
    return start;
  }
  if (pattern.length > lines.length) {
    return null;
  }
  var maxStart = lines.length - pattern.length;
  var searchStart = eof && lines.length >= pattern.length ? maxStart : start;
  if (searchStart > maxStart) {
    return null;
  }
  for (var i = searchStart; i <= maxStart; i += 1) {
    if (
      linesMatch(lines, pattern, i, function (value) {
        return value;
      })
    ) {
      return i;
    }
  }
  for (var i = searchStart; i <= maxStart; i += 1) {
    if (
      linesMatch(lines, pattern, i, function (value) {
        return value.trimEnd();
      })
    ) {
      return i;
    }
  }
  for (var i = searchStart; i <= maxStart; i += 1) {
    if (
      linesMatch(lines, pattern, i, function (value) {
        return value.trim();
      })
    ) {
      return i;
    }
  }
  for (var i = searchStart; i <= maxStart; i += 1) {
    if (
      linesMatch(lines, pattern, i, function (value) {
        return normalizePunctuation(value.trim());
      })
    ) {
      return i;
    }
  }
  return null;
}
function linesMatch(lines, pattern, start, normalize) {
  for (var idx = 0; idx < pattern.length; idx += 1) {
    if (normalize(lines[start + idx]) !== normalize(pattern[idx])) {
      return false;
    }
  }
  return true;
}
function normalizePunctuation(value) {
  return Array.from(value)
    .map(function (char) {
      switch (char) {
        case "\u2010":
        case "\u2011":
        case "\u2012":
        case "\u2013":
        case "\u2014":
        case "\u2015":
        case "\u2212":
          return "-";
        case "\u2018":
        case "\u2019":
        case "\u201A":
        case "\u201B":
          return "'";
        case "\u201C":
        case "\u201D":
        case "\u201E":
        case "\u201F":
          return '"';
        case "\u00A0":
        case "\u2002":
        case "\u2003":
        case "\u2004":
        case "\u2005":
        case "\u2006":
        case "\u2007":
        case "\u2008":
        case "\u2009":
        case "\u200A":
        case "\u202F":
        case "\u205F":
        case "\u3000":
          return " ";
        default:
          return char;
      }
    })
    .join("");
}
