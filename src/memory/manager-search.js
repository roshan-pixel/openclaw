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
exports.searchVector = searchVector;
exports.listChunks = listChunks;
exports.searchKeyword = searchKeyword;
var utils_js_1 = require("../utils.js");
var internal_js_1 = require("./internal.js");
var vectorToBlob = function (embedding) {
  return Buffer.from(new Float32Array(embedding).buffer);
};
function searchVector(params) {
  return __awaiter(this, void 0, void 0, function () {
    var rows, candidates, scored;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (params.queryVec.length === 0 || params.limit <= 0) {
            return [2 /*return*/, []];
          }
          return [4 /*yield*/, params.ensureVectorReady(params.queryVec.length)];
        case 1:
          if (_b.sent()) {
            rows = (_a = params.db.prepare(
              "SELECT c.id, c.path, c.start_line, c.end_line, c.text,\n" +
                "       c.source,\n" +
                "       vec_distance_cosine(v.embedding, ?) AS dist\n" +
                "  FROM ".concat(params.vectorTable, " v\n") +
                "  JOIN chunks c ON c.id = v.id\n" +
                " WHERE c.model = ?".concat(params.sourceFilterVec.sql, "\n") +
                " ORDER BY dist ASC\n" +
                " LIMIT ?",
            )).all.apply(
              _a,
              __spreadArray(
                __spreadArray(
                  [vectorToBlob(params.queryVec), params.providerModel],
                  params.sourceFilterVec.params,
                  false,
                ),
                [params.limit],
                false,
              ),
            );
            return [
              2 /*return*/,
              rows.map(function (row) {
                return {
                  id: row.id,
                  path: row.path,
                  startLine: row.start_line,
                  endLine: row.end_line,
                  score: 1 - row.dist,
                  snippet: (0, utils_js_1.truncateUtf16Safe)(row.text, params.snippetMaxChars),
                  source: row.source,
                };
              }),
            ];
          }
          candidates = listChunks({
            db: params.db,
            providerModel: params.providerModel,
            sourceFilter: params.sourceFilterChunks,
          });
          scored = candidates
            .map(function (chunk) {
              return {
                chunk: chunk,
                score: (0, internal_js_1.cosineSimilarity)(params.queryVec, chunk.embedding),
              };
            })
            .filter(function (entry) {
              return Number.isFinite(entry.score);
            });
          return [
            2 /*return*/,
            scored
              .toSorted(function (a, b) {
                return b.score - a.score;
              })
              .slice(0, params.limit)
              .map(function (entry) {
                return {
                  id: entry.chunk.id,
                  path: entry.chunk.path,
                  startLine: entry.chunk.startLine,
                  endLine: entry.chunk.endLine,
                  score: entry.score,
                  snippet: (0, utils_js_1.truncateUtf16Safe)(
                    entry.chunk.text,
                    params.snippetMaxChars,
                  ),
                  source: entry.chunk.source,
                };
              }),
          ];
      }
    });
  });
}
function listChunks(params) {
  var _a;
  var rows = (_a = params.db.prepare(
    "SELECT id, path, start_line, end_line, text, embedding, source\n" +
      "  FROM chunks\n" +
      " WHERE model = ?".concat(params.sourceFilter.sql),
  )).all.apply(_a, __spreadArray([params.providerModel], params.sourceFilter.params, false));
  return rows.map(function (row) {
    return {
      id: row.id,
      path: row.path,
      startLine: row.start_line,
      endLine: row.end_line,
      text: row.text,
      embedding: (0, internal_js_1.parseEmbedding)(row.embedding),
      source: row.source,
    };
  });
}
function searchKeyword(params) {
  return __awaiter(this, void 0, void 0, function () {
    var ftsQuery, rows;
    var _a;
    return __generator(this, function (_b) {
      if (params.limit <= 0) {
        return [2 /*return*/, []];
      }
      ftsQuery = params.buildFtsQuery(params.query);
      if (!ftsQuery) {
        return [2 /*return*/, []];
      }
      rows = (_a = params.db.prepare(
        "SELECT id, path, source, start_line, end_line, text,\n" +
          "       bm25(".concat(params.ftsTable, ") AS rank\n") +
          "  FROM ".concat(params.ftsTable, "\n") +
          " WHERE "
            .concat(params.ftsTable, " MATCH ? AND model = ?")
            .concat(params.sourceFilter.sql, "\n") +
          " ORDER BY rank ASC\n" +
          " LIMIT ?",
      )).all.apply(
        _a,
        __spreadArray(
          __spreadArray([ftsQuery, params.providerModel], params.sourceFilter.params, false),
          [params.limit],
          false,
        ),
      );
      return [
        2 /*return*/,
        rows.map(function (row) {
          var textScore = params.bm25RankToScore(row.rank);
          return {
            id: row.id,
            path: row.path,
            startLine: row.start_line,
            endLine: row.end_line,
            score: textScore,
            textScore: textScore,
            snippet: (0, utils_js_1.truncateUtf16Safe)(row.text, params.snippetMaxChars),
            source: row.source,
          };
        }),
      ];
    });
  });
}
