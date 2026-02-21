"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFtsQuery = buildFtsQuery;
exports.bm25RankToScore = bm25RankToScore;
exports.mergeHybridResults = mergeHybridResults;
function buildFtsQuery(raw) {
  var _a, _b;
  var tokens =
    (_b =
      (_a = raw.match(/[A-Za-z0-9_]+/g)) === null || _a === void 0
        ? void 0
        : _a
            .map(function (t) {
              return t.trim();
            })
            .filter(Boolean)) !== null && _b !== void 0
      ? _b
      : [];
  if (tokens.length === 0) {
    return null;
  }
  var quoted = tokens.map(function (t) {
    return '"'.concat(t.replaceAll('"', ""), '"');
  });
  return quoted.join(" AND ");
}
function bm25RankToScore(rank) {
  var normalized = Number.isFinite(rank) ? Math.max(0, rank) : 999;
  return 1 / (1 + normalized);
}
function mergeHybridResults(params) {
  var byId = new Map();
  for (var _i = 0, _a = params.vector; _i < _a.length; _i++) {
    var r = _a[_i];
    byId.set(r.id, {
      id: r.id,
      path: r.path,
      startLine: r.startLine,
      endLine: r.endLine,
      source: r.source,
      snippet: r.snippet,
      vectorScore: r.vectorScore,
      textScore: 0,
    });
  }
  for (var _b = 0, _c = params.keyword; _b < _c.length; _b++) {
    var r = _c[_b];
    var existing = byId.get(r.id);
    if (existing) {
      existing.textScore = r.textScore;
      if (r.snippet && r.snippet.length > 0) {
        existing.snippet = r.snippet;
      }
    } else {
      byId.set(r.id, {
        id: r.id,
        path: r.path,
        startLine: r.startLine,
        endLine: r.endLine,
        source: r.source,
        snippet: r.snippet,
        vectorScore: 0,
        textScore: r.textScore,
      });
    }
  }
  var merged = Array.from(byId.values()).map(function (entry) {
    var score = params.vectorWeight * entry.vectorScore + params.textWeight * entry.textScore;
    return {
      path: entry.path,
      startLine: entry.startLine,
      endLine: entry.endLine,
      score: score,
      snippet: entry.snippet,
      source: entry.source,
    };
  });
  return merged.toSorted(function (a, b) {
    return b.score - a.score;
  });
}
