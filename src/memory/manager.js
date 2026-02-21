"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
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
exports.MemoryIndexManager = void 0;
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var chokidar_1 = require("chokidar");
var agent_scope_js_1 = require("../agents/agent-scope.js");
var memory_search_js_1 = require("../agents/memory-search.js");
var paths_js_1 = require("../config/sessions/paths.js");
var subsystem_js_1 = require("../logging/subsystem.js");
var transcript_events_js_1 = require("../sessions/transcript-events.js");
var utils_js_1 = require("../utils.js");
var embeddings_js_1 = require("./embeddings.js");
var embeddings_gemini_js_1 = require("./embeddings-gemini.js");
var embeddings_openai_js_1 = require("./embeddings-openai.js");
var batch_openai_js_1 = require("./batch-openai.js");
var batch_gemini_js_1 = require("./batch-gemini.js");
var internal_js_1 = require("./internal.js");
var hybrid_js_1 = require("./hybrid.js");
var manager_search_js_1 = require("./manager-search.js");
var memory_schema_js_1 = require("./memory-schema.js");
var sqlite_js_1 = require("./sqlite.js");
var sqlite_vec_js_1 = require("./sqlite-vec.js");
var META_KEY = "memory_index_meta_v1";
var SNIPPET_MAX_CHARS = 700;
var VECTOR_TABLE = "chunks_vec";
var FTS_TABLE = "chunks_fts";
var EMBEDDING_CACHE_TABLE = "embedding_cache";
var SESSION_DIRTY_DEBOUNCE_MS = 5000;
var EMBEDDING_BATCH_MAX_TOKENS = 8000;
var EMBEDDING_APPROX_CHARS_PER_TOKEN = 1;
var EMBEDDING_INDEX_CONCURRENCY = 4;
var EMBEDDING_RETRY_MAX_ATTEMPTS = 3;
var EMBEDDING_RETRY_BASE_DELAY_MS = 500;
var EMBEDDING_RETRY_MAX_DELAY_MS = 8000;
var BATCH_FAILURE_LIMIT = 2;
var SESSION_DELTA_READ_CHUNK_BYTES = 64 * 1024;
var VECTOR_LOAD_TIMEOUT_MS = 30000;
var EMBEDDING_QUERY_TIMEOUT_REMOTE_MS = 60000;
var EMBEDDING_QUERY_TIMEOUT_LOCAL_MS = 5 * 60000;
var EMBEDDING_BATCH_TIMEOUT_REMOTE_MS = 2 * 60000;
var EMBEDDING_BATCH_TIMEOUT_LOCAL_MS = 10 * 60000;
var log = (0, subsystem_js_1.createSubsystemLogger)("memory");
var INDEX_CACHE = new Map();
var vectorToBlob = function (embedding) {
  return Buffer.from(new Float32Array(embedding).buffer);
};
var MemoryIndexManager = /** @class */ (function () {
  function MemoryIndexManager(params) {
    this.batchFailureCount = 0;
    this.batchFailureLock = Promise.resolve();
    this.vectorReady = null;
    this.watcher = null;
    this.watchTimer = null;
    this.sessionWatchTimer = null;
    this.sessionUnsubscribe = null;
    this.intervalTimer = null;
    this.closed = false;
    this.dirty = false;
    this.sessionsDirty = false;
    this.sessionsDirtyFiles = new Set();
    this.sessionPendingFiles = new Set();
    this.sessionDeltas = new Map();
    this.sessionWarm = new Set();
    this.syncing = null;
    this.cacheKey = params.cacheKey;
    this.cfg = params.cfg;
    this.agentId = params.agentId;
    this.workspaceDir = params.workspaceDir;
    this.settings = params.settings;
    this.provider = params.providerResult.provider;
    this.requestedProvider = params.providerResult.requestedProvider;
    this.fallbackFrom = params.providerResult.fallbackFrom;
    this.fallbackReason = params.providerResult.fallbackReason;
    this.openAi = params.providerResult.openAi;
    this.gemini = params.providerResult.gemini;
    this.sources = new Set(params.settings.sources);
    this.db = this.openDatabase();
    this.providerKey = this.computeProviderKey();
    this.cache = {
      enabled: params.settings.cache.enabled,
      maxEntries: params.settings.cache.maxEntries,
    };
    this.fts = { enabled: params.settings.query.hybrid.enabled, available: false };
    this.ensureSchema();
    this.vector = {
      enabled: params.settings.store.vector.enabled,
      available: null,
      extensionPath: params.settings.store.vector.extensionPath,
    };
    var meta = this.readMeta();
    if (meta === null || meta === void 0 ? void 0 : meta.vectorDims) {
      this.vector.dims = meta.vectorDims;
    }
    this.ensureWatcher();
    this.ensureSessionListener();
    this.ensureIntervalSync();
    this.dirty = this.sources.has("memory");
    this.batch = this.resolveBatchConfig();
  }
  MemoryIndexManager.get = function (params) {
    return __awaiter(this, void 0, void 0, function () {
      var cfg, agentId, settings, workspaceDir, key, existing, providerResult, manager;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            ((cfg = params.cfg), (agentId = params.agentId));
            settings = (0, memory_search_js_1.resolveMemorySearchConfig)(cfg, agentId);
            if (!settings) {
              return [2 /*return*/, null];
            }
            workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(cfg, agentId);
            key = ""
              .concat(agentId, ":")
              .concat(workspaceDir, ":")
              .concat(JSON.stringify(settings));
            existing = INDEX_CACHE.get(key);
            if (existing) {
              return [2 /*return*/, existing];
            }
            return [
              4 /*yield*/,
              (0, embeddings_js_1.createEmbeddingProvider)({
                config: cfg,
                agentDir: (0, agent_scope_js_1.resolveAgentDir)(cfg, agentId),
                provider: settings.provider,
                remote: settings.remote,
                model: settings.model,
                fallback: settings.fallback,
                local: settings.local,
              }),
            ];
          case 1:
            providerResult = _a.sent();
            manager = new MemoryIndexManager({
              cacheKey: key,
              cfg: cfg,
              agentId: agentId,
              workspaceDir: workspaceDir,
              settings: settings,
              providerResult: providerResult,
            });
            INDEX_CACHE.set(key, manager);
            return [2 /*return*/, manager];
        }
      });
    });
  };
  MemoryIndexManager.prototype.warmSession = function (sessionKey) {
    return __awaiter(this, void 0, void 0, function () {
      var key;
      return __generator(this, function (_a) {
        if (!this.settings.sync.onSessionStart) {
          return [2 /*return*/];
        }
        key = (sessionKey === null || sessionKey === void 0 ? void 0 : sessionKey.trim()) || "";
        if (key && this.sessionWarm.has(key)) {
          return [2 /*return*/];
        }
        void this.sync({ reason: "session-start" }).catch(function (err) {
          log.warn("memory sync failed (session-start): ".concat(String(err)));
        });
        if (key) {
          this.sessionWarm.add(key);
        }
        return [2 /*return*/];
      });
    });
  };
  MemoryIndexManager.prototype.search = function (query, opts) {
    return __awaiter(this, void 0, void 0, function () {
      var cleaned,
        minScore,
        maxResults,
        hybrid,
        candidates,
        keywordResults,
        _a,
        queryVec,
        hasVector,
        vectorResults,
        _b,
        merged;
      var _c, _d;
      return __generator(this, function (_e) {
        switch (_e.label) {
          case 0:
            void this.warmSession(opts === null || opts === void 0 ? void 0 : opts.sessionKey);
            if (this.settings.sync.onSearch && (this.dirty || this.sessionsDirty)) {
              void this.sync({ reason: "search" }).catch(function (err) {
                log.warn("memory sync failed (search): ".concat(String(err)));
              });
            }
            cleaned = query.trim();
            if (!cleaned) {
              return [2 /*return*/, []];
            }
            minScore =
              (_c = opts === null || opts === void 0 ? void 0 : opts.minScore) !== null &&
              _c !== void 0
                ? _c
                : this.settings.query.minScore;
            maxResults =
              (_d = opts === null || opts === void 0 ? void 0 : opts.maxResults) !== null &&
              _d !== void 0
                ? _d
                : this.settings.query.maxResults;
            hybrid = this.settings.query.hybrid;
            candidates = Math.min(
              200,
              Math.max(1, Math.floor(maxResults * hybrid.candidateMultiplier)),
            );
            if (!hybrid.enabled) {
              return [3 /*break*/, 2];
            }
            return [
              4 /*yield*/,
              this.searchKeyword(cleaned, candidates).catch(function () {
                return [];
              }),
            ];
          case 1:
            _a = _e.sent();
            return [3 /*break*/, 3];
          case 2:
            _a = [];
            _e.label = 3;
          case 3:
            keywordResults = _a;
            return [4 /*yield*/, this.embedQueryWithTimeout(cleaned)];
          case 4:
            queryVec = _e.sent();
            hasVector = queryVec.some(function (v) {
              return v !== 0;
            });
            if (!hasVector) {
              return [3 /*break*/, 6];
            }
            return [
              4 /*yield*/,
              this.searchVector(queryVec, candidates).catch(function () {
                return [];
              }),
            ];
          case 5:
            _b = _e.sent();
            return [3 /*break*/, 7];
          case 6:
            _b = [];
            _e.label = 7;
          case 7:
            vectorResults = _b;
            if (!hybrid.enabled) {
              return [
                2 /*return*/,
                vectorResults
                  .filter(function (entry) {
                    return entry.score >= minScore;
                  })
                  .slice(0, maxResults),
              ];
            }
            merged = this.mergeHybridResults({
              vector: vectorResults,
              keyword: keywordResults,
              vectorWeight: hybrid.vectorWeight,
              textWeight: hybrid.textWeight,
            });
            return [
              2 /*return*/,
              merged
                .filter(function (entry) {
                  return entry.score >= minScore;
                })
                .slice(0, maxResults),
            ];
        }
      });
    });
  };
  MemoryIndexManager.prototype.searchVector = function (queryVec, limit) {
    return __awaiter(this, void 0, void 0, function () {
      var results;
      var _this = this;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              (0, manager_search_js_1.searchVector)({
                db: this.db,
                vectorTable: VECTOR_TABLE,
                providerModel: this.provider.model,
                queryVec: queryVec,
                limit: limit,
                snippetMaxChars: SNIPPET_MAX_CHARS,
                ensureVectorReady: function (dimensions) {
                  return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          return [4 /*yield*/, this.ensureVectorReady(dimensions)];
                        case 1:
                          return [2 /*return*/, _a.sent()];
                      }
                    });
                  });
                },
                sourceFilterVec: this.buildSourceFilter("c"),
                sourceFilterChunks: this.buildSourceFilter(),
              }),
            ];
          case 1:
            results = _a.sent();
            return [
              2 /*return*/,
              results.map(function (entry) {
                return entry;
              }),
            ];
        }
      });
    });
  };
  MemoryIndexManager.prototype.buildFtsQuery = function (raw) {
    return (0, hybrid_js_1.buildFtsQuery)(raw);
  };
  MemoryIndexManager.prototype.searchKeyword = function (query, limit) {
    return __awaiter(this, void 0, void 0, function () {
      var sourceFilter, results;
      var _this = this;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!this.fts.enabled || !this.fts.available) {
              return [2 /*return*/, []];
            }
            sourceFilter = this.buildSourceFilter();
            return [
              4 /*yield*/,
              (0, manager_search_js_1.searchKeyword)({
                db: this.db,
                ftsTable: FTS_TABLE,
                providerModel: this.provider.model,
                query: query,
                limit: limit,
                snippetMaxChars: SNIPPET_MAX_CHARS,
                sourceFilter: sourceFilter,
                buildFtsQuery: function (raw) {
                  return _this.buildFtsQuery(raw);
                },
                bm25RankToScore: hybrid_js_1.bm25RankToScore,
              }),
            ];
          case 1:
            results = _a.sent();
            return [
              2 /*return*/,
              results.map(function (entry) {
                return entry;
              }),
            ];
        }
      });
    });
  };
  MemoryIndexManager.prototype.mergeHybridResults = function (params) {
    var merged = (0, hybrid_js_1.mergeHybridResults)({
      vector: params.vector.map(function (r) {
        return {
          id: r.id,
          path: r.path,
          startLine: r.startLine,
          endLine: r.endLine,
          source: r.source,
          snippet: r.snippet,
          vectorScore: r.score,
        };
      }),
      keyword: params.keyword.map(function (r) {
        return {
          id: r.id,
          path: r.path,
          startLine: r.startLine,
          endLine: r.endLine,
          source: r.source,
          snippet: r.snippet,
          textScore: r.textScore,
        };
      }),
      vectorWeight: params.vectorWeight,
      textWeight: params.textWeight,
    });
    return merged.map(function (entry) {
      return entry;
    });
  };
  MemoryIndexManager.prototype.sync = function (params) {
    return __awaiter(this, void 0, void 0, function () {
      var _this = this;
      return __generator(this, function (_a) {
        if (this.syncing) {
          return [2 /*return*/, this.syncing];
        }
        this.syncing = this.runSync(params).finally(function () {
          _this.syncing = null;
        });
        return [2 /*return*/, this.syncing];
      });
    });
  };
  MemoryIndexManager.prototype.readFile = function (params) {
    return __awaiter(this, void 0, void 0, function () {
      var rawPath,
        absPath,
        relPath,
        inWorkspace,
        allowedWorkspace,
        allowedAdditional,
        additionalPaths,
        _i,
        additionalPaths_1,
        additionalPath,
        stat_1,
        _a,
        stat,
        content,
        lines,
        start,
        count,
        slice;
      var _b, _c;
      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            rawPath = params.relPath.trim();
            if (!rawPath) {
              throw new Error("path required");
            }
            absPath = node_path_1.default.isAbsolute(rawPath)
              ? node_path_1.default.resolve(rawPath)
              : node_path_1.default.resolve(this.workspaceDir, rawPath);
            relPath = node_path_1.default.relative(this.workspaceDir, absPath).replace(/\\/g, "/");
            inWorkspace =
              relPath.length > 0 &&
              !relPath.startsWith("..") &&
              !node_path_1.default.isAbsolute(relPath);
            allowedWorkspace = inWorkspace && (0, internal_js_1.isMemoryPath)(relPath);
            allowedAdditional = false;
            if (!(!allowedWorkspace && this.settings.extraPaths.length > 0)) {
              return [3 /*break*/, 6];
            }
            additionalPaths = (0, internal_js_1.normalizeExtraMemoryPaths)(
              this.workspaceDir,
              this.settings.extraPaths,
            );
            ((_i = 0), (additionalPaths_1 = additionalPaths));
            _d.label = 1;
          case 1:
            if (!(_i < additionalPaths_1.length)) {
              return [3 /*break*/, 6];
            }
            additionalPath = additionalPaths_1[_i];
            _d.label = 2;
          case 2:
            _d.trys.push([2, 4, , 5]);
            return [4 /*yield*/, promises_1.default.lstat(additionalPath)];
          case 3:
            stat_1 = _d.sent();
            if (stat_1.isSymbolicLink()) {
              return [3 /*break*/, 5];
            }
            if (stat_1.isDirectory()) {
              if (
                absPath === additionalPath ||
                absPath.startsWith("".concat(additionalPath).concat(node_path_1.default.sep))
              ) {
                allowedAdditional = true;
                return [3 /*break*/, 6];
              }
              return [3 /*break*/, 5];
            }
            if (stat_1.isFile()) {
              if (absPath === additionalPath && absPath.endsWith(".md")) {
                allowedAdditional = true;
                return [3 /*break*/, 6];
              }
            }
            return [3 /*break*/, 5];
          case 4:
            _a = _d.sent();
            return [3 /*break*/, 5];
          case 5:
            _i++;
            return [3 /*break*/, 1];
          case 6:
            if (!allowedWorkspace && !allowedAdditional) {
              throw new Error("path required");
            }
            if (!absPath.endsWith(".md")) {
              throw new Error("path required");
            }
            return [4 /*yield*/, promises_1.default.lstat(absPath)];
          case 7:
            stat = _d.sent();
            if (stat.isSymbolicLink() || !stat.isFile()) {
              throw new Error("path required");
            }
            return [4 /*yield*/, promises_1.default.readFile(absPath, "utf-8")];
          case 8:
            content = _d.sent();
            if (!params.from && !params.lines) {
              return [2 /*return*/, { text: content, path: relPath }];
            }
            lines = content.split("\n");
            start = Math.max(1, (_b = params.from) !== null && _b !== void 0 ? _b : 1);
            count = Math.max(1, (_c = params.lines) !== null && _c !== void 0 ? _c : lines.length);
            slice = lines.slice(start - 1, start - 1 + count);
            return [2 /*return*/, { text: slice.join("\n"), path: relPath }];
        }
      });
    });
  };
  MemoryIndexManager.prototype.status = function () {
    var _a, _b;
    var _this = this;
    var _c, _d, _e, _f, _g, _h;
    var sourceFilter = this.buildSourceFilter();
    var files = (_a = this.db.prepare(
      "SELECT COUNT(*) as c FROM files WHERE 1=1".concat(sourceFilter.sql),
    )).get.apply(_a, sourceFilter.params);
    var chunks = (_b = this.db.prepare(
      "SELECT COUNT(*) as c FROM chunks WHERE 1=1".concat(sourceFilter.sql),
    )).get.apply(_b, sourceFilter.params);
    var sourceCounts = (function () {
      var _a, _b;
      var _c, _d, _e, _f;
      var sources = Array.from(_this.sources);
      if (sources.length === 0) {
        return [];
      }
      var bySource = new Map();
      for (var _i = 0, sources_1 = sources; _i < sources_1.length; _i++) {
        var source = sources_1[_i];
        bySource.set(source, { files: 0, chunks: 0 });
      }
      var fileRows = (_a = _this.db.prepare(
        "SELECT source, COUNT(*) as c FROM files WHERE 1=1".concat(
          sourceFilter.sql,
          " GROUP BY source",
        ),
      )).all.apply(_a, sourceFilter.params);
      for (var _g = 0, fileRows_1 = fileRows; _g < fileRows_1.length; _g++) {
        var row = fileRows_1[_g];
        var entry =
          (_c = bySource.get(row.source)) !== null && _c !== void 0 ? _c : { files: 0, chunks: 0 };
        entry.files = (_d = row.c) !== null && _d !== void 0 ? _d : 0;
        bySource.set(row.source, entry);
      }
      var chunkRows = (_b = _this.db.prepare(
        "SELECT source, COUNT(*) as c FROM chunks WHERE 1=1".concat(
          sourceFilter.sql,
          " GROUP BY source",
        ),
      )).all.apply(_b, sourceFilter.params);
      for (var _h = 0, chunkRows_1 = chunkRows; _h < chunkRows_1.length; _h++) {
        var row = chunkRows_1[_h];
        var entry =
          (_e = bySource.get(row.source)) !== null && _e !== void 0 ? _e : { files: 0, chunks: 0 };
        entry.chunks = (_f = row.c) !== null && _f !== void 0 ? _f : 0;
        bySource.set(row.source, entry);
      }
      return sources.map(function (source) {
        return __assign({ source: source }, bySource.get(source));
      });
    })();
    return {
      files:
        (_c = files === null || files === void 0 ? void 0 : files.c) !== null && _c !== void 0
          ? _c
          : 0,
      chunks:
        (_d = chunks === null || chunks === void 0 ? void 0 : chunks.c) !== null && _d !== void 0
          ? _d
          : 0,
      dirty: this.dirty,
      workspaceDir: this.workspaceDir,
      dbPath: this.settings.store.path,
      provider: this.provider.id,
      model: this.provider.model,
      requestedProvider: this.requestedProvider,
      sources: Array.from(this.sources),
      extraPaths: this.settings.extraPaths,
      sourceCounts: sourceCounts,
      cache: this.cache.enabled
        ? {
            enabled: true,
            entries:
              (_f =
                (_e = this.db
                  .prepare("SELECT COUNT(*) as c FROM ".concat(EMBEDDING_CACHE_TABLE))
                  .get()) === null || _e === void 0
                  ? void 0
                  : _e.c) !== null && _f !== void 0
                ? _f
                : 0,
            maxEntries: this.cache.maxEntries,
          }
        : { enabled: false, maxEntries: this.cache.maxEntries },
      fts: {
        enabled: this.fts.enabled,
        available: this.fts.available,
        error: this.fts.loadError,
      },
      fallback: this.fallbackReason
        ? {
            from: (_g = this.fallbackFrom) !== null && _g !== void 0 ? _g : "local",
            reason: this.fallbackReason,
          }
        : undefined,
      vector: {
        enabled: this.vector.enabled,
        available: (_h = this.vector.available) !== null && _h !== void 0 ? _h : undefined,
        extensionPath: this.vector.extensionPath,
        loadError: this.vector.loadError,
        dims: this.vector.dims,
      },
      batch: {
        enabled: this.batch.enabled,
        failures: this.batchFailureCount,
        limit: BATCH_FAILURE_LIMIT,
        wait: this.batch.wait,
        concurrency: this.batch.concurrency,
        pollIntervalMs: this.batch.pollIntervalMs,
        timeoutMs: this.batch.timeoutMs,
        lastError: this.batchFailureLastError,
        lastProvider: this.batchFailureLastProvider,
      },
    };
  };
  MemoryIndexManager.prototype.probeVectorAvailability = function () {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        if (!this.vector.enabled) {
          return [2 /*return*/, false];
        }
        return [2 /*return*/, this.ensureVectorReady()];
      });
    });
  };
  MemoryIndexManager.prototype.probeEmbeddingAvailability = function () {
    return __awaiter(this, void 0, void 0, function () {
      var err_1, message;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            return [4 /*yield*/, this.embedBatchWithRetry(["ping"])];
          case 1:
            _a.sent();
            return [2 /*return*/, { ok: true }];
          case 2:
            err_1 = _a.sent();
            message = err_1 instanceof Error ? err_1.message : String(err_1);
            return [2 /*return*/, { ok: false, error: message }];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  MemoryIndexManager.prototype.close = function () {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (this.closed) {
              return [2 /*return*/];
            }
            this.closed = true;
            if (this.watchTimer) {
              clearTimeout(this.watchTimer);
              this.watchTimer = null;
            }
            if (this.sessionWatchTimer) {
              clearTimeout(this.sessionWatchTimer);
              this.sessionWatchTimer = null;
            }
            if (this.intervalTimer) {
              clearInterval(this.intervalTimer);
              this.intervalTimer = null;
            }
            if (!this.watcher) {
              return [3 /*break*/, 2];
            }
            return [4 /*yield*/, this.watcher.close()];
          case 1:
            _a.sent();
            this.watcher = null;
            _a.label = 2;
          case 2:
            if (this.sessionUnsubscribe) {
              this.sessionUnsubscribe();
              this.sessionUnsubscribe = null;
            }
            this.db.close();
            INDEX_CACHE.delete(this.cacheKey);
            return [2 /*return*/];
        }
      });
    });
  };
  MemoryIndexManager.prototype.ensureVectorReady = function (dimensions) {
    return __awaiter(this, void 0, void 0, function () {
      var ready, err_2, message;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!this.vector.enabled) {
              return [2 /*return*/, false];
            }
            if (!this.vectorReady) {
              this.vectorReady = this.withTimeout(
                this.loadVectorExtension(),
                VECTOR_LOAD_TIMEOUT_MS,
                "sqlite-vec load timed out after ".concat(
                  Math.round(VECTOR_LOAD_TIMEOUT_MS / 1000),
                  "s",
                ),
              );
            }
            ready = false;
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, , 4]);
            return [4 /*yield*/, this.vectorReady];
          case 2:
            ready = _a.sent();
            return [3 /*break*/, 4];
          case 3:
            err_2 = _a.sent();
            message = err_2 instanceof Error ? err_2.message : String(err_2);
            this.vector.available = false;
            this.vector.loadError = message;
            this.vectorReady = null;
            log.warn("sqlite-vec unavailable: ".concat(message));
            return [2 /*return*/, false];
          case 4:
            if (ready && typeof dimensions === "number" && dimensions > 0) {
              this.ensureVectorTable(dimensions);
            }
            return [2 /*return*/, ready];
        }
      });
    });
  };
  MemoryIndexManager.prototype.loadVectorExtension = function () {
    return __awaiter(this, void 0, void 0, function () {
      var resolvedPath, loaded, err_3, message;
      var _a, _b;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            if (this.vector.available !== null) {
              return [2 /*return*/, this.vector.available];
            }
            if (!this.vector.enabled) {
              this.vector.available = false;
              return [2 /*return*/, false];
            }
            _c.label = 1;
          case 1:
            _c.trys.push([1, 3, , 4]);
            resolvedPath = (
              (_a = this.vector.extensionPath) === null || _a === void 0 ? void 0 : _a.trim()
            )
              ? (0, utils_js_1.resolveUserPath)(this.vector.extensionPath)
              : undefined;
            return [
              4 /*yield*/,
              (0, sqlite_vec_js_1.loadSqliteVecExtension)({
                db: this.db,
                extensionPath: resolvedPath,
              }),
            ];
          case 2:
            loaded = _c.sent();
            if (!loaded.ok) {
              throw new Error(
                (_b = loaded.error) !== null && _b !== void 0
                  ? _b
                  : "unknown sqlite-vec load error",
              );
            }
            this.vector.extensionPath = loaded.extensionPath;
            this.vector.available = true;
            return [2 /*return*/, true];
          case 3:
            err_3 = _c.sent();
            message = err_3 instanceof Error ? err_3.message : String(err_3);
            this.vector.available = false;
            this.vector.loadError = message;
            log.warn("sqlite-vec unavailable: ".concat(message));
            return [2 /*return*/, false];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  MemoryIndexManager.prototype.ensureVectorTable = function (dimensions) {
    if (this.vector.dims === dimensions) {
      return;
    }
    if (this.vector.dims && this.vector.dims !== dimensions) {
      this.dropVectorTable();
    }
    this.db.exec(
      "CREATE VIRTUAL TABLE IF NOT EXISTS ".concat(VECTOR_TABLE, " USING vec0(\n") +
        "  id TEXT PRIMARY KEY,\n" +
        "  embedding FLOAT[".concat(dimensions, "]\n") +
        ")",
    );
    this.vector.dims = dimensions;
  };
  MemoryIndexManager.prototype.dropVectorTable = function () {
    try {
      this.db.exec("DROP TABLE IF EXISTS ".concat(VECTOR_TABLE));
    } catch (err) {
      var message = err instanceof Error ? err.message : String(err);
      log.debug("Failed to drop ".concat(VECTOR_TABLE, ": ").concat(message));
    }
  };
  MemoryIndexManager.prototype.buildSourceFilter = function (alias) {
    var sources = Array.from(this.sources);
    if (sources.length === 0) {
      return { sql: "", params: [] };
    }
    var column = alias ? "".concat(alias, ".source") : "source";
    var placeholders = sources
      .map(function () {
        return "?";
      })
      .join(", ");
    return { sql: " AND ".concat(column, " IN (").concat(placeholders, ")"), params: sources };
  };
  MemoryIndexManager.prototype.openDatabase = function () {
    var dbPath = (0, utils_js_1.resolveUserPath)(this.settings.store.path);
    return this.openDatabaseAtPath(dbPath);
  };
  MemoryIndexManager.prototype.openDatabaseAtPath = function (dbPath) {
    var dir = node_path_1.default.dirname(dbPath);
    (0, internal_js_1.ensureDir)(dir);
    var DatabaseSync = (0, sqlite_js_1.requireNodeSqlite)().DatabaseSync;
    return new DatabaseSync(dbPath, { allowExtension: this.settings.store.vector.enabled });
  };
  MemoryIndexManager.prototype.seedEmbeddingCache = function (sourceDb) {
    if (!this.cache.enabled) {
      return;
    }
    try {
      var rows = sourceDb
        .prepare(
          "SELECT provider, model, provider_key, hash, embedding, dims, updated_at FROM ".concat(
            EMBEDDING_CACHE_TABLE,
          ),
        )
        .all();
      if (!rows.length) {
        return;
      }
      var insert = this.db.prepare(
        "INSERT INTO ".concat(
          EMBEDDING_CACHE_TABLE,
          " (provider, model, provider_key, hash, embedding, dims, updated_at)\n         VALUES (?, ?, ?, ?, ?, ?, ?)\n         ON CONFLICT(provider, model, provider_key, hash) DO UPDATE SET\n           embedding=excluded.embedding,\n           dims=excluded.dims,\n           updated_at=excluded.updated_at",
        ),
      );
      this.db.exec("BEGIN");
      for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
        var row = rows_1[_i];
        insert.run(
          row.provider,
          row.model,
          row.provider_key,
          row.hash,
          row.embedding,
          row.dims,
          row.updated_at,
        );
      }
      this.db.exec("COMMIT");
    } catch (err) {
      try {
        this.db.exec("ROLLBACK");
      } catch (_a) {}
      throw err;
    }
  };
  MemoryIndexManager.prototype.swapIndexFiles = function (targetPath, tempPath) {
    return __awaiter(this, void 0, void 0, function () {
      var backupPath, err_4;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            backupPath = "".concat(targetPath, ".backup-").concat((0, node_crypto_1.randomUUID)());
            return [4 /*yield*/, this.moveIndexFiles(targetPath, backupPath)];
          case 1:
            _a.sent();
            _a.label = 2;
          case 2:
            _a.trys.push([2, 4, , 6]);
            return [4 /*yield*/, this.moveIndexFiles(tempPath, targetPath)];
          case 3:
            _a.sent();
            return [3 /*break*/, 6];
          case 4:
            err_4 = _a.sent();
            return [4 /*yield*/, this.moveIndexFiles(backupPath, targetPath)];
          case 5:
            _a.sent();
            throw err_4;
          case 6:
            return [4 /*yield*/, this.removeIndexFiles(backupPath)];
          case 7:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  MemoryIndexManager.prototype.moveIndexFiles = function (sourceBase, targetBase) {
    return __awaiter(this, void 0, void 0, function () {
      var suffixes, _i, suffixes_1, suffix, source, target, err_5;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            suffixes = ["", "-wal", "-shm"];
            ((_i = 0), (suffixes_1 = suffixes));
            _a.label = 1;
          case 1:
            if (!(_i < suffixes_1.length)) {
              return [3 /*break*/, 6];
            }
            suffix = suffixes_1[_i];
            source = "".concat(sourceBase).concat(suffix);
            target = "".concat(targetBase).concat(suffix);
            _a.label = 2;
          case 2:
            _a.trys.push([2, 4, , 5]);
            return [4 /*yield*/, promises_1.default.rename(source, target)];
          case 3:
            _a.sent();
            return [3 /*break*/, 5];
          case 4:
            err_5 = _a.sent();
            if (err_5.code !== "ENOENT") {
              throw err_5;
            }
            return [3 /*break*/, 5];
          case 5:
            _i++;
            return [3 /*break*/, 1];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  };
  MemoryIndexManager.prototype.removeIndexFiles = function (basePath) {
    return __awaiter(this, void 0, void 0, function () {
      var suffixes;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            suffixes = ["", "-wal", "-shm"];
            return [
              4 /*yield*/,
              Promise.all(
                suffixes.map(function (suffix) {
                  return promises_1.default.rm("".concat(basePath).concat(suffix), { force: true });
                }),
              ),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  MemoryIndexManager.prototype.ensureSchema = function () {
    var result = (0, memory_schema_js_1.ensureMemoryIndexSchema)({
      db: this.db,
      embeddingCacheTable: EMBEDDING_CACHE_TABLE,
      ftsTable: FTS_TABLE,
      ftsEnabled: this.fts.enabled,
    });
    this.fts.available = result.ftsAvailable;
    if (result.ftsError) {
      this.fts.loadError = result.ftsError;
      log.warn("fts unavailable: ".concat(result.ftsError));
    }
  };
  MemoryIndexManager.prototype.ensureWatcher = function () {
    var _this = this;
    if (!this.sources.has("memory") || !this.settings.sync.watch || this.watcher) {
      return;
    }
    var additionalPaths = (0, internal_js_1.normalizeExtraMemoryPaths)(
      this.workspaceDir,
      this.settings.extraPaths,
    )
      .map(function (entry) {
        try {
          var stat = node_fs_1.default.lstatSync(entry);
          return stat.isSymbolicLink() ? null : entry;
        } catch (_a) {
          return null;
        }
      })
      .filter(function (entry) {
        return Boolean(entry);
      });
    var watchPaths = new Set(
      __spreadArray(
        [
          node_path_1.default.join(this.workspaceDir, "MEMORY.md"),
          node_path_1.default.join(this.workspaceDir, "memory.md"),
          node_path_1.default.join(this.workspaceDir, "memory"),
        ],
        additionalPaths,
        true,
      ),
    );
    this.watcher = chokidar_1.default.watch(Array.from(watchPaths), {
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: this.settings.sync.watchDebounceMs,
        pollInterval: 100,
      },
    });
    var markDirty = function () {
      _this.dirty = true;
      _this.scheduleWatchSync();
    };
    this.watcher.on("add", markDirty);
    this.watcher.on("change", markDirty);
    this.watcher.on("unlink", markDirty);
  };
  MemoryIndexManager.prototype.ensureSessionListener = function () {
    var _this = this;
    if (!this.sources.has("sessions") || this.sessionUnsubscribe) {
      return;
    }
    this.sessionUnsubscribe = (0, transcript_events_js_1.onSessionTranscriptUpdate)(
      function (update) {
        if (_this.closed) {
          return;
        }
        var sessionFile = update.sessionFile;
        if (!_this.isSessionFileForAgent(sessionFile)) {
          return;
        }
        _this.scheduleSessionDirty(sessionFile);
      },
    );
  };
  MemoryIndexManager.prototype.scheduleSessionDirty = function (sessionFile) {
    var _this = this;
    this.sessionPendingFiles.add(sessionFile);
    if (this.sessionWatchTimer) {
      return;
    }
    this.sessionWatchTimer = setTimeout(function () {
      _this.sessionWatchTimer = null;
      void _this.processSessionDeltaBatch().catch(function (err) {
        log.warn("memory session delta failed: ".concat(String(err)));
      });
    }, SESSION_DIRTY_DEBOUNCE_MS);
  };
  MemoryIndexManager.prototype.processSessionDeltaBatch = function () {
    return __awaiter(this, void 0, void 0, function () {
      var pending,
        shouldSync,
        _i,
        pending_1,
        sessionFile,
        delta,
        bytesThreshold,
        messagesThreshold,
        bytesHit,
        messagesHit;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (this.sessionPendingFiles.size === 0) {
              return [2 /*return*/];
            }
            pending = Array.from(this.sessionPendingFiles);
            this.sessionPendingFiles.clear();
            shouldSync = false;
            ((_i = 0), (pending_1 = pending));
            _a.label = 1;
          case 1:
            if (!(_i < pending_1.length)) {
              return [3 /*break*/, 4];
            }
            sessionFile = pending_1[_i];
            return [4 /*yield*/, this.updateSessionDelta(sessionFile)];
          case 2:
            delta = _a.sent();
            if (!delta) {
              return [3 /*break*/, 3];
            }
            bytesThreshold = delta.deltaBytes;
            messagesThreshold = delta.deltaMessages;
            bytesHit =
              bytesThreshold <= 0 ? delta.pendingBytes > 0 : delta.pendingBytes >= bytesThreshold;
            messagesHit =
              messagesThreshold <= 0
                ? delta.pendingMessages > 0
                : delta.pendingMessages >= messagesThreshold;
            if (!bytesHit && !messagesHit) {
              return [3 /*break*/, 3];
            }
            this.sessionsDirtyFiles.add(sessionFile);
            this.sessionsDirty = true;
            delta.pendingBytes =
              bytesThreshold > 0 ? Math.max(0, delta.pendingBytes - bytesThreshold) : 0;
            delta.pendingMessages =
              messagesThreshold > 0 ? Math.max(0, delta.pendingMessages - messagesThreshold) : 0;
            shouldSync = true;
            _a.label = 3;
          case 3:
            _i++;
            return [3 /*break*/, 1];
          case 4:
            if (shouldSync) {
              void this.sync({ reason: "session-delta" }).catch(function (err) {
                log.warn("memory sync failed (session-delta): ".concat(String(err)));
              });
            }
            return [2 /*return*/];
        }
      });
    });
  };
  MemoryIndexManager.prototype.updateSessionDelta = function (sessionFile) {
    return __awaiter(this, void 0, void 0, function () {
      var thresholds,
        stat,
        _a,
        size,
        state,
        deltaBytes,
        shouldCountMessages,
        _b,
        _c,
        shouldCountMessages,
        _d,
        _e;
      return __generator(this, function (_f) {
        switch (_f.label) {
          case 0:
            thresholds = this.settings.sync.sessions;
            if (!thresholds) {
              return [2 /*return*/, null];
            }
            _f.label = 1;
          case 1:
            _f.trys.push([1, 3, , 4]);
            return [4 /*yield*/, promises_1.default.stat(sessionFile)];
          case 2:
            stat = _f.sent();
            return [3 /*break*/, 4];
          case 3:
            _a = _f.sent();
            return [2 /*return*/, null];
          case 4:
            size = stat.size;
            state = this.sessionDeltas.get(sessionFile);
            if (!state) {
              state = { lastSize: 0, pendingBytes: 0, pendingMessages: 0 };
              this.sessionDeltas.set(sessionFile, state);
            }
            deltaBytes = Math.max(0, size - state.lastSize);
            if (deltaBytes === 0 && size === state.lastSize) {
              return [
                2 /*return*/,
                {
                  deltaBytes: thresholds.deltaBytes,
                  deltaMessages: thresholds.deltaMessages,
                  pendingBytes: state.pendingBytes,
                  pendingMessages: state.pendingMessages,
                },
              ];
            }
            if (!(size < state.lastSize)) {
              return [3 /*break*/, 7];
            }
            state.lastSize = size;
            state.pendingBytes += size;
            shouldCountMessages =
              thresholds.deltaMessages > 0 &&
              (thresholds.deltaBytes <= 0 || state.pendingBytes < thresholds.deltaBytes);
            if (!shouldCountMessages) {
              return [3 /*break*/, 6];
            }
            _b = state;
            _c = _b.pendingMessages;
            return [4 /*yield*/, this.countNewlines(sessionFile, 0, size)];
          case 5:
            _b.pendingMessages = _c + _f.sent();
            _f.label = 6;
          case 6:
            return [3 /*break*/, 10];
          case 7:
            state.pendingBytes += deltaBytes;
            shouldCountMessages =
              thresholds.deltaMessages > 0 &&
              (thresholds.deltaBytes <= 0 || state.pendingBytes < thresholds.deltaBytes);
            if (!shouldCountMessages) {
              return [3 /*break*/, 9];
            }
            _d = state;
            _e = _d.pendingMessages;
            return [4 /*yield*/, this.countNewlines(sessionFile, state.lastSize, size)];
          case 8:
            _d.pendingMessages = _e + _f.sent();
            _f.label = 9;
          case 9:
            state.lastSize = size;
            _f.label = 10;
          case 10:
            this.sessionDeltas.set(sessionFile, state);
            return [
              2 /*return*/,
              {
                deltaBytes: thresholds.deltaBytes,
                deltaMessages: thresholds.deltaMessages,
                pendingBytes: state.pendingBytes,
                pendingMessages: state.pendingMessages,
              },
            ];
        }
      });
    });
  };
  MemoryIndexManager.prototype.countNewlines = function (absPath, start, end) {
    return __awaiter(this, void 0, void 0, function () {
      var handle, offset, count, buffer, toRead, bytesRead, i;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (end <= start) {
              return [2 /*return*/, 0];
            }
            return [4 /*yield*/, promises_1.default.open(absPath, "r")];
          case 1:
            handle = _a.sent();
            _a.label = 2;
          case 2:
            _a.trys.push([2, , 6, 8]);
            offset = start;
            count = 0;
            buffer = Buffer.alloc(SESSION_DELTA_READ_CHUNK_BYTES);
            _a.label = 3;
          case 3:
            if (!(offset < end)) {
              return [3 /*break*/, 5];
            }
            toRead = Math.min(buffer.length, end - offset);
            return [4 /*yield*/, handle.read(buffer, 0, toRead, offset)];
          case 4:
            bytesRead = _a.sent().bytesRead;
            if (bytesRead <= 0) {
              return [3 /*break*/, 5];
            }
            for (i = 0; i < bytesRead; i += 1) {
              if (buffer[i] === 10) {
                count += 1;
              }
            }
            offset += bytesRead;
            return [3 /*break*/, 3];
          case 5:
            return [2 /*return*/, count];
          case 6:
            return [4 /*yield*/, handle.close()];
          case 7:
            _a.sent();
            return [7 /*endfinally*/];
          case 8:
            return [2 /*return*/];
        }
      });
    });
  };
  MemoryIndexManager.prototype.resetSessionDelta = function (absPath, size) {
    var state = this.sessionDeltas.get(absPath);
    if (!state) {
      return;
    }
    state.lastSize = size;
    state.pendingBytes = 0;
    state.pendingMessages = 0;
  };
  MemoryIndexManager.prototype.isSessionFileForAgent = function (sessionFile) {
    if (!sessionFile) {
      return false;
    }
    var sessionsDir = (0, paths_js_1.resolveSessionTranscriptsDirForAgent)(this.agentId);
    var resolvedFile = node_path_1.default.resolve(sessionFile);
    var resolvedDir = node_path_1.default.resolve(sessionsDir);
    return resolvedFile.startsWith("".concat(resolvedDir).concat(node_path_1.default.sep));
  };
  MemoryIndexManager.prototype.ensureIntervalSync = function () {
    var _this = this;
    var minutes = this.settings.sync.intervalMinutes;
    if (!minutes || minutes <= 0 || this.intervalTimer) {
      return;
    }
    var ms = minutes * 60 * 1000;
    this.intervalTimer = setInterval(function () {
      void _this.sync({ reason: "interval" }).catch(function (err) {
        log.warn("memory sync failed (interval): ".concat(String(err)));
      });
    }, ms);
  };
  MemoryIndexManager.prototype.scheduleWatchSync = function () {
    var _this = this;
    if (!this.sources.has("memory") || !this.settings.sync.watch) {
      return;
    }
    if (this.watchTimer) {
      clearTimeout(this.watchTimer);
    }
    this.watchTimer = setTimeout(function () {
      _this.watchTimer = null;
      void _this.sync({ reason: "watch" }).catch(function (err) {
        log.warn("memory sync failed (watch): ".concat(String(err)));
      });
    }, this.settings.sync.watchDebounceMs);
  };
  MemoryIndexManager.prototype.shouldSyncSessions = function (params, needsFullReindex) {
    if (needsFullReindex === void 0) {
      needsFullReindex = false;
    }
    if (!this.sources.has("sessions")) {
      return false;
    }
    if (params === null || params === void 0 ? void 0 : params.force) {
      return true;
    }
    var reason = params === null || params === void 0 ? void 0 : params.reason;
    if (reason === "session-start" || reason === "watch") {
      return false;
    }
    if (needsFullReindex) {
      return true;
    }
    return this.sessionsDirty && this.sessionsDirtyFiles.size > 0;
  };
  MemoryIndexManager.prototype.syncMemoryFiles = function (params) {
    return __awaiter(this, void 0, void 0, function () {
      var files, fileEntries, activePaths, tasks, staleRows, _i, staleRows_1, stale;
      var _this = this;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              (0, internal_js_1.listMemoryFiles)(this.workspaceDir, this.settings.extraPaths),
            ];
          case 1:
            files = _a.sent();
            return [
              4 /*yield*/,
              Promise.all(
                files.map(function (file) {
                  return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      return [
                        2 /*return*/,
                        (0, internal_js_1.buildFileEntry)(file, this.workspaceDir),
                      ];
                    });
                  });
                }),
              ),
            ];
          case 2:
            fileEntries = _a.sent();
            log.debug("memory sync: indexing memory files", {
              files: fileEntries.length,
              needsFullReindex: params.needsFullReindex,
              batch: this.batch.enabled,
              concurrency: this.getIndexConcurrency(),
            });
            activePaths = new Set(
              fileEntries.map(function (entry) {
                return entry.path;
              }),
            );
            if (params.progress) {
              params.progress.total += fileEntries.length;
              params.progress.report({
                completed: params.progress.completed,
                total: params.progress.total,
                label: this.batch.enabled
                  ? "Indexing memory files (batch)..."
                  : "Indexing memory files…",
              });
            }
            tasks = fileEntries.map(function (entry) {
              return function () {
                return __awaiter(_this, void 0, void 0, function () {
                  var record;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        record = this.db
                          .prepare("SELECT hash FROM files WHERE path = ? AND source = ?")
                          .get(entry.path, "memory");
                        if (
                          !params.needsFullReindex &&
                          (record === null || record === void 0 ? void 0 : record.hash) ===
                            entry.hash
                        ) {
                          if (params.progress) {
                            params.progress.completed += 1;
                            params.progress.report({
                              completed: params.progress.completed,
                              total: params.progress.total,
                            });
                          }
                          return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.indexFile(entry, { source: "memory" })];
                      case 1:
                        _a.sent();
                        if (params.progress) {
                          params.progress.completed += 1;
                          params.progress.report({
                            completed: params.progress.completed,
                            total: params.progress.total,
                          });
                        }
                        return [2 /*return*/];
                    }
                  });
                });
              };
            });
            return [4 /*yield*/, this.runWithConcurrency(tasks, this.getIndexConcurrency())];
          case 3:
            _a.sent();
            staleRows = this.db.prepare("SELECT path FROM files WHERE source = ?").all("memory");
            for (_i = 0, staleRows_1 = staleRows; _i < staleRows_1.length; _i++) {
              stale = staleRows_1[_i];
              if (activePaths.has(stale.path)) {
                continue;
              }
              this.db
                .prepare("DELETE FROM files WHERE path = ? AND source = ?")
                .run(stale.path, "memory");
              try {
                this.db
                  .prepare(
                    "DELETE FROM ".concat(
                      VECTOR_TABLE,
                      " WHERE id IN (SELECT id FROM chunks WHERE path = ? AND source = ?)",
                    ),
                  )
                  .run(stale.path, "memory");
              } catch (_b) {}
              this.db
                .prepare("DELETE FROM chunks WHERE path = ? AND source = ?")
                .run(stale.path, "memory");
              if (this.fts.enabled && this.fts.available) {
                try {
                  this.db
                    .prepare(
                      "DELETE FROM ".concat(
                        FTS_TABLE,
                        " WHERE path = ? AND source = ? AND model = ?",
                      ),
                    )
                    .run(stale.path, "memory", this.provider.model);
                } catch (_c) {}
              }
            }
            return [2 /*return*/];
        }
      });
    });
  };
  MemoryIndexManager.prototype.syncSessionFiles = function (params) {
    return __awaiter(this, void 0, void 0, function () {
      var files, activePaths, indexAll, tasks, staleRows, _i, staleRows_2, stale;
      var _this = this;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.listSessionFiles()];
          case 1:
            files = _a.sent();
            activePaths = new Set(
              files.map(function (file) {
                return _this.sessionPathForFile(file);
              }),
            );
            indexAll = params.needsFullReindex || this.sessionsDirtyFiles.size === 0;
            log.debug("memory sync: indexing session files", {
              files: files.length,
              indexAll: indexAll,
              dirtyFiles: this.sessionsDirtyFiles.size,
              batch: this.batch.enabled,
              concurrency: this.getIndexConcurrency(),
            });
            if (params.progress) {
              params.progress.total += files.length;
              params.progress.report({
                completed: params.progress.completed,
                total: params.progress.total,
                label: this.batch.enabled
                  ? "Indexing session files (batch)..."
                  : "Indexing session files…",
              });
            }
            tasks = files.map(function (absPath) {
              return function () {
                return __awaiter(_this, void 0, void 0, function () {
                  var entry, record;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        if (!indexAll && !this.sessionsDirtyFiles.has(absPath)) {
                          if (params.progress) {
                            params.progress.completed += 1;
                            params.progress.report({
                              completed: params.progress.completed,
                              total: params.progress.total,
                            });
                          }
                          return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.buildSessionEntry(absPath)];
                      case 1:
                        entry = _a.sent();
                        if (!entry) {
                          if (params.progress) {
                            params.progress.completed += 1;
                            params.progress.report({
                              completed: params.progress.completed,
                              total: params.progress.total,
                            });
                          }
                          return [2 /*return*/];
                        }
                        record = this.db
                          .prepare("SELECT hash FROM files WHERE path = ? AND source = ?")
                          .get(entry.path, "sessions");
                        if (
                          !params.needsFullReindex &&
                          (record === null || record === void 0 ? void 0 : record.hash) ===
                            entry.hash
                        ) {
                          if (params.progress) {
                            params.progress.completed += 1;
                            params.progress.report({
                              completed: params.progress.completed,
                              total: params.progress.total,
                            });
                          }
                          this.resetSessionDelta(absPath, entry.size);
                          return [2 /*return*/];
                        }
                        return [
                          4 /*yield*/,
                          this.indexFile(entry, { source: "sessions", content: entry.content }),
                        ];
                      case 2:
                        _a.sent();
                        this.resetSessionDelta(absPath, entry.size);
                        if (params.progress) {
                          params.progress.completed += 1;
                          params.progress.report({
                            completed: params.progress.completed,
                            total: params.progress.total,
                          });
                        }
                        return [2 /*return*/];
                    }
                  });
                });
              };
            });
            return [4 /*yield*/, this.runWithConcurrency(tasks, this.getIndexConcurrency())];
          case 2:
            _a.sent();
            staleRows = this.db.prepare("SELECT path FROM files WHERE source = ?").all("sessions");
            for (_i = 0, staleRows_2 = staleRows; _i < staleRows_2.length; _i++) {
              stale = staleRows_2[_i];
              if (activePaths.has(stale.path)) {
                continue;
              }
              this.db
                .prepare("DELETE FROM files WHERE path = ? AND source = ?")
                .run(stale.path, "sessions");
              try {
                this.db
                  .prepare(
                    "DELETE FROM ".concat(
                      VECTOR_TABLE,
                      " WHERE id IN (SELECT id FROM chunks WHERE path = ? AND source = ?)",
                    ),
                  )
                  .run(stale.path, "sessions");
              } catch (_b) {}
              this.db
                .prepare("DELETE FROM chunks WHERE path = ? AND source = ?")
                .run(stale.path, "sessions");
              if (this.fts.enabled && this.fts.available) {
                try {
                  this.db
                    .prepare(
                      "DELETE FROM ".concat(
                        FTS_TABLE,
                        " WHERE path = ? AND source = ? AND model = ?",
                      ),
                    )
                    .run(stale.path, "sessions", this.provider.model);
                } catch (_c) {}
              }
            }
            return [2 /*return*/];
        }
      });
    });
  };
  MemoryIndexManager.prototype.createSyncProgress = function (onProgress) {
    var state = {
      completed: 0,
      total: 0,
      label: undefined,
      report: function (update) {
        if (update.label) {
          state.label = update.label;
        }
        var label =
          update.total > 0 && state.label
            ? "".concat(state.label, " ").concat(update.completed, "/").concat(update.total)
            : state.label;
        onProgress({
          completed: update.completed,
          total: update.total,
          label: label,
        });
      },
    };
    return state;
  };
  MemoryIndexManager.prototype.runSync = function (params) {
    return __awaiter(this, void 0, void 0, function () {
      var progress,
        vectorReady,
        meta,
        needsFullReindex,
        shouldSyncMemory,
        shouldSyncSessions,
        err_6,
        reason,
        activated,
        _a;
      var _b;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            progress = (params === null || params === void 0 ? void 0 : params.progress)
              ? this.createSyncProgress(params.progress)
              : undefined;
            if (progress) {
              progress.report({
                completed: progress.completed,
                total: progress.total,
                label: "Loading vector extension…",
              });
            }
            return [4 /*yield*/, this.ensureVectorReady()];
          case 1:
            vectorReady = _c.sent();
            meta = this.readMeta();
            needsFullReindex =
              (params === null || params === void 0 ? void 0 : params.force) ||
              !meta ||
              meta.model !== this.provider.model ||
              meta.provider !== this.provider.id ||
              meta.providerKey !== this.providerKey ||
              meta.chunkTokens !== this.settings.chunking.tokens ||
              meta.chunkOverlap !== this.settings.chunking.overlap ||
              (vectorReady && !(meta === null || meta === void 0 ? void 0 : meta.vectorDims));
            _c.label = 2;
          case 2:
            _c.trys.push([2, 10, , 15]);
            if (!needsFullReindex) {
              return [3 /*break*/, 4];
            }
            return [
              4 /*yield*/,
              this.runSafeReindex({
                reason: params === null || params === void 0 ? void 0 : params.reason,
                force: params === null || params === void 0 ? void 0 : params.force,
                progress: progress !== null && progress !== void 0 ? progress : undefined,
              }),
            ];
          case 3:
            _c.sent();
            return [2 /*return*/];
          case 4:
            shouldSyncMemory =
              this.sources.has("memory") &&
              ((params === null || params === void 0 ? void 0 : params.force) ||
                needsFullReindex ||
                this.dirty);
            shouldSyncSessions = this.shouldSyncSessions(params, needsFullReindex);
            if (!shouldSyncMemory) {
              return [3 /*break*/, 6];
            }
            return [
              4 /*yield*/,
              this.syncMemoryFiles({
                needsFullReindex: needsFullReindex,
                progress: progress !== null && progress !== void 0 ? progress : undefined,
              }),
            ];
          case 5:
            _c.sent();
            this.dirty = false;
            _c.label = 6;
          case 6:
            if (!shouldSyncSessions) {
              return [3 /*break*/, 8];
            }
            return [
              4 /*yield*/,
              this.syncSessionFiles({
                needsFullReindex: needsFullReindex,
                progress: progress !== null && progress !== void 0 ? progress : undefined,
              }),
            ];
          case 7:
            _c.sent();
            this.sessionsDirty = false;
            this.sessionsDirtyFiles.clear();
            return [3 /*break*/, 9];
          case 8:
            if (this.sessionsDirtyFiles.size > 0) {
              this.sessionsDirty = true;
            } else {
              this.sessionsDirty = false;
            }
            _c.label = 9;
          case 9:
            return [3 /*break*/, 15];
          case 10:
            err_6 = _c.sent();
            reason = err_6 instanceof Error ? err_6.message : String(err_6);
            _a = this.shouldFallbackOnError(reason);
            if (!_a) {
              return [3 /*break*/, 12];
            }
            return [4 /*yield*/, this.activateFallbackProvider(reason)];
          case 11:
            _a = _c.sent();
            _c.label = 12;
          case 12:
            activated = _a;
            if (!activated) {
              return [3 /*break*/, 14];
            }
            return [
              4 /*yield*/,
              this.runSafeReindex({
                reason:
                  (_b = params === null || params === void 0 ? void 0 : params.reason) !== null &&
                  _b !== void 0
                    ? _b
                    : "fallback",
                force: true,
                progress: progress !== null && progress !== void 0 ? progress : undefined,
              }),
            ];
          case 13:
            _c.sent();
            return [2 /*return*/];
          case 14:
            throw err_6;
          case 15:
            return [2 /*return*/];
        }
      });
    });
  };
  MemoryIndexManager.prototype.shouldFallbackOnError = function (message) {
    return /embedding|embeddings|batch/i.test(message);
  };
  MemoryIndexManager.prototype.resolveBatchConfig = function () {
    var _a, _b, _c, _d, _e;
    var batch = (_a = this.settings.remote) === null || _a === void 0 ? void 0 : _a.batch;
    var enabled = Boolean(
      (batch === null || batch === void 0 ? void 0 : batch.enabled) &&
      ((this.openAi && this.provider.id === "openai") ||
        (this.gemini && this.provider.id === "gemini")),
    );
    return {
      enabled: enabled,
      wait:
        (_b = batch === null || batch === void 0 ? void 0 : batch.wait) !== null && _b !== void 0
          ? _b
          : true,
      concurrency: Math.max(
        1,
        (_c = batch === null || batch === void 0 ? void 0 : batch.concurrency) !== null &&
          _c !== void 0
          ? _c
          : 2,
      ),
      pollIntervalMs:
        (_d = batch === null || batch === void 0 ? void 0 : batch.pollIntervalMs) !== null &&
        _d !== void 0
          ? _d
          : 2000,
      timeoutMs:
        ((_e = batch === null || batch === void 0 ? void 0 : batch.timeoutMinutes) !== null &&
        _e !== void 0
          ? _e
          : 60) *
        60 *
        1000,
    };
  };
  MemoryIndexManager.prototype.activateFallbackProvider = function (reason) {
    return __awaiter(this, void 0, void 0, function () {
      var fallback, fallbackFrom, fallbackModel, fallbackResult;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            fallback = this.settings.fallback;
            if (!fallback || fallback === "none" || fallback === this.provider.id) {
              return [2 /*return*/, false];
            }
            if (this.fallbackFrom) {
              return [2 /*return*/, false];
            }
            fallbackFrom = this.provider.id;
            fallbackModel =
              fallback === "gemini"
                ? embeddings_gemini_js_1.DEFAULT_GEMINI_EMBEDDING_MODEL
                : fallback === "openai"
                  ? embeddings_openai_js_1.DEFAULT_OPENAI_EMBEDDING_MODEL
                  : this.settings.model;
            return [
              4 /*yield*/,
              (0, embeddings_js_1.createEmbeddingProvider)({
                config: this.cfg,
                agentDir: (0, agent_scope_js_1.resolveAgentDir)(this.cfg, this.agentId),
                provider: fallback,
                remote: this.settings.remote,
                model: fallbackModel,
                fallback: "none",
                local: this.settings.local,
              }),
            ];
          case 1:
            fallbackResult = _a.sent();
            this.fallbackFrom = fallbackFrom;
            this.fallbackReason = reason;
            this.provider = fallbackResult.provider;
            this.openAi = fallbackResult.openAi;
            this.gemini = fallbackResult.gemini;
            this.providerKey = this.computeProviderKey();
            this.batch = this.resolveBatchConfig();
            log.warn("memory embeddings: switched to fallback provider (".concat(fallback, ")"), {
              reason: reason,
            });
            return [2 /*return*/, true];
        }
      });
    });
  };
  MemoryIndexManager.prototype.runSafeReindex = function (params) {
    return __awaiter(this, void 0, void 0, function () {
      var dbPath,
        tempDbPath,
        tempDb,
        originalDb,
        originalDbClosed,
        originalState,
        restoreOriginalState,
        nextMeta,
        shouldSyncMemory,
        shouldSyncSessions,
        err_7;
      var _this = this;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            dbPath = (0, utils_js_1.resolveUserPath)(this.settings.store.path);
            tempDbPath = "".concat(dbPath, ".tmp-").concat((0, node_crypto_1.randomUUID)());
            tempDb = this.openDatabaseAtPath(tempDbPath);
            originalDb = this.db;
            originalDbClosed = false;
            originalState = {
              ftsAvailable: this.fts.available,
              ftsError: this.fts.loadError,
              vectorAvailable: this.vector.available,
              vectorLoadError: this.vector.loadError,
              vectorDims: this.vector.dims,
              vectorReady: this.vectorReady,
            };
            restoreOriginalState = function () {
              if (originalDbClosed) {
                _this.db = _this.openDatabaseAtPath(dbPath);
              } else {
                _this.db = originalDb;
              }
              _this.fts.available = originalState.ftsAvailable;
              _this.fts.loadError = originalState.ftsError;
              _this.vector.available = originalDbClosed ? null : originalState.vectorAvailable;
              _this.vector.loadError = originalState.vectorLoadError;
              _this.vector.dims = originalState.vectorDims;
              _this.vectorReady = originalDbClosed ? null : originalState.vectorReady;
            };
            this.db = tempDb;
            this.vectorReady = null;
            this.vector.available = null;
            this.vector.loadError = undefined;
            this.vector.dims = undefined;
            this.fts.available = false;
            this.fts.loadError = undefined;
            this.ensureSchema();
            nextMeta = null;
            _a.label = 1;
          case 1:
            _a.trys.push([1, 8, , 10]);
            this.seedEmbeddingCache(originalDb);
            shouldSyncMemory = this.sources.has("memory");
            shouldSyncSessions = this.shouldSyncSessions(
              { reason: params.reason, force: params.force },
              true,
            );
            if (!shouldSyncMemory) {
              return [3 /*break*/, 3];
            }
            return [
              4 /*yield*/,
              this.syncMemoryFiles({ needsFullReindex: true, progress: params.progress }),
            ];
          case 2:
            _a.sent();
            this.dirty = false;
            _a.label = 3;
          case 3:
            if (!shouldSyncSessions) {
              return [3 /*break*/, 5];
            }
            return [
              4 /*yield*/,
              this.syncSessionFiles({ needsFullReindex: true, progress: params.progress }),
            ];
          case 4:
            _a.sent();
            this.sessionsDirty = false;
            this.sessionsDirtyFiles.clear();
            return [3 /*break*/, 6];
          case 5:
            if (this.sessionsDirtyFiles.size > 0) {
              this.sessionsDirty = true;
            } else {
              this.sessionsDirty = false;
            }
            _a.label = 6;
          case 6:
            nextMeta = {
              model: this.provider.model,
              provider: this.provider.id,
              providerKey: this.providerKey,
              chunkTokens: this.settings.chunking.tokens,
              chunkOverlap: this.settings.chunking.overlap,
            };
            if (this.vector.available && this.vector.dims) {
              nextMeta.vectorDims = this.vector.dims;
            }
            this.writeMeta(nextMeta);
            this.pruneEmbeddingCacheIfNeeded();
            this.db.close();
            originalDb.close();
            originalDbClosed = true;
            return [4 /*yield*/, this.swapIndexFiles(dbPath, tempDbPath)];
          case 7:
            _a.sent();
            this.db = this.openDatabaseAtPath(dbPath);
            this.vectorReady = null;
            this.vector.available = null;
            this.vector.loadError = undefined;
            this.ensureSchema();
            this.vector.dims = nextMeta.vectorDims;
            return [3 /*break*/, 10];
          case 8:
            err_7 = _a.sent();
            try {
              this.db.close();
            } catch (_b) {}
            return [4 /*yield*/, this.removeIndexFiles(tempDbPath)];
          case 9:
            _a.sent();
            restoreOriginalState();
            throw err_7;
          case 10:
            return [2 /*return*/];
        }
      });
    });
  };
  MemoryIndexManager.prototype.resetIndex = function () {
    this.db.exec("DELETE FROM files");
    this.db.exec("DELETE FROM chunks");
    if (this.fts.enabled && this.fts.available) {
      try {
        this.db.exec("DELETE FROM ".concat(FTS_TABLE));
      } catch (_a) {}
    }
    this.dropVectorTable();
    this.vector.dims = undefined;
    this.sessionsDirtyFiles.clear();
  };
  MemoryIndexManager.prototype.readMeta = function () {
    var row = this.db.prepare("SELECT value FROM meta WHERE key = ?").get(META_KEY);
    if (!(row === null || row === void 0 ? void 0 : row.value)) {
      return null;
    }
    try {
      return JSON.parse(row.value);
    } catch (_a) {
      return null;
    }
  };
  MemoryIndexManager.prototype.writeMeta = function (meta) {
    var value = JSON.stringify(meta);
    this.db
      .prepare(
        "INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
      )
      .run(META_KEY, value);
  };
  MemoryIndexManager.prototype.listSessionFiles = function () {
    return __awaiter(this, void 0, void 0, function () {
      var dir, entries, _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            dir = (0, paths_js_1.resolveSessionTranscriptsDirForAgent)(this.agentId);
            _b.label = 1;
          case 1:
            _b.trys.push([1, 3, , 4]);
            return [4 /*yield*/, promises_1.default.readdir(dir, { withFileTypes: true })];
          case 2:
            entries = _b.sent();
            return [
              2 /*return*/,
              entries
                .filter(function (entry) {
                  return entry.isFile();
                })
                .map(function (entry) {
                  return entry.name;
                })
                .filter(function (name) {
                  return name.endsWith(".jsonl");
                })
                .map(function (name) {
                  return node_path_1.default.join(dir, name);
                }),
            ];
          case 3:
            _a = _b.sent();
            return [2 /*return*/, []];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  MemoryIndexManager.prototype.sessionPathForFile = function (absPath) {
    return node_path_1.default
      .join("sessions", node_path_1.default.basename(absPath))
      .replace(/\\/g, "/");
  };
  MemoryIndexManager.prototype.normalizeSessionText = function (value) {
    return value
      .replace(/\s*\n+\s*/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };
  MemoryIndexManager.prototype.extractSessionText = function (content) {
    if (typeof content === "string") {
      var normalized = this.normalizeSessionText(content);
      return normalized ? normalized : null;
    }
    if (!Array.isArray(content)) {
      return null;
    }
    var parts = [];
    for (var _i = 0, content_1 = content; _i < content_1.length; _i++) {
      var block = content_1[_i];
      if (!block || typeof block !== "object") {
        continue;
      }
      var record = block;
      if (record.type !== "text" || typeof record.text !== "string") {
        continue;
      }
      var normalized = this.normalizeSessionText(record.text);
      if (normalized) {
        parts.push(normalized);
      }
    }
    if (parts.length === 0) {
      return null;
    }
    return parts.join(" ");
  };
  MemoryIndexManager.prototype.buildSessionEntry = function (absPath) {
    return __awaiter(this, void 0, void 0, function () {
      var stat,
        raw,
        lines,
        collected,
        _i,
        lines_1,
        line,
        record,
        message,
        text,
        label,
        content,
        err_8;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 3, , 4]);
            return [4 /*yield*/, promises_1.default.stat(absPath)];
          case 1:
            stat = _a.sent();
            return [4 /*yield*/, promises_1.default.readFile(absPath, "utf-8")];
          case 2:
            raw = _a.sent();
            lines = raw.split("\n");
            collected = [];
            for (_i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
              line = lines_1[_i];
              if (!line.trim()) {
                continue;
              }
              record = void 0;
              try {
                record = JSON.parse(line);
              } catch (_b) {
                continue;
              }
              if (!record || typeof record !== "object" || record.type !== "message") {
                continue;
              }
              message = record.message;
              if (!message || typeof message.role !== "string") {
                continue;
              }
              if (message.role !== "user" && message.role !== "assistant") {
                continue;
              }
              text = this.extractSessionText(message.content);
              if (!text) {
                continue;
              }
              label = message.role === "user" ? "User" : "Assistant";
              collected.push("".concat(label, ": ").concat(text));
            }
            content = collected.join("\n");
            return [
              2 /*return*/,
              {
                path: this.sessionPathForFile(absPath),
                absPath: absPath,
                mtimeMs: stat.mtimeMs,
                size: stat.size,
                hash: (0, internal_js_1.hashText)(content),
                content: content,
              },
            ];
          case 3:
            err_8 = _a.sent();
            log.debug("Failed reading session file ".concat(absPath, ": ").concat(String(err_8)));
            return [2 /*return*/, null];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  MemoryIndexManager.prototype.estimateEmbeddingTokens = function (text) {
    if (!text) {
      return 0;
    }
    return Math.ceil(text.length / EMBEDDING_APPROX_CHARS_PER_TOKEN);
  };
  MemoryIndexManager.prototype.buildEmbeddingBatches = function (chunks) {
    var batches = [];
    var current = [];
    var currentTokens = 0;
    for (var _i = 0, chunks_1 = chunks; _i < chunks_1.length; _i++) {
      var chunk = chunks_1[_i];
      var estimate = this.estimateEmbeddingTokens(chunk.text);
      var wouldExceed = current.length > 0 && currentTokens + estimate > EMBEDDING_BATCH_MAX_TOKENS;
      if (wouldExceed) {
        batches.push(current);
        current = [];
        currentTokens = 0;
      }
      if (current.length === 0 && estimate > EMBEDDING_BATCH_MAX_TOKENS) {
        batches.push([chunk]);
        continue;
      }
      current.push(chunk);
      currentTokens += estimate;
    }
    if (current.length > 0) {
      batches.push(current);
    }
    return batches;
  };
  MemoryIndexManager.prototype.loadEmbeddingCache = function (hashes) {
    var _a;
    if (!this.cache.enabled) {
      return new Map();
    }
    if (hashes.length === 0) {
      return new Map();
    }
    var unique = [];
    var seen = new Set();
    for (var _i = 0, hashes_1 = hashes; _i < hashes_1.length; _i++) {
      var hash = hashes_1[_i];
      if (!hash) {
        continue;
      }
      if (seen.has(hash)) {
        continue;
      }
      seen.add(hash);
      unique.push(hash);
    }
    if (unique.length === 0) {
      return new Map();
    }
    var out = new Map();
    var baseParams = [this.provider.id, this.provider.model, this.providerKey];
    var batchSize = 400;
    for (var start = 0; start < unique.length; start += batchSize) {
      var batch = unique.slice(start, start + batchSize);
      var placeholders = batch
        .map(function () {
          return "?";
        })
        .join(", ");
      var rows = (_a = this.db.prepare(
        "SELECT hash, embedding FROM ".concat(EMBEDDING_CACHE_TABLE, "\n") +
          " WHERE provider = ? AND model = ? AND provider_key = ? AND hash IN (".concat(
            placeholders,
            ")",
          ),
      )).all.apply(_a, __spreadArray(__spreadArray([], baseParams, false), batch, false));
      for (var _b = 0, rows_2 = rows; _b < rows_2.length; _b++) {
        var row = rows_2[_b];
        out.set(row.hash, (0, internal_js_1.parseEmbedding)(row.embedding));
      }
    }
    return out;
  };
  MemoryIndexManager.prototype.upsertEmbeddingCache = function (entries) {
    var _a;
    if (!this.cache.enabled) {
      return;
    }
    if (entries.length === 0) {
      return;
    }
    var now = Date.now();
    var stmt = this.db.prepare(
      "INSERT INTO ".concat(
        EMBEDDING_CACHE_TABLE,
        " (provider, model, provider_key, hash, embedding, dims, updated_at)\n",
      ) +
        " VALUES (?, ?, ?, ?, ?, ?, ?)\n" +
        " ON CONFLICT(provider, model, provider_key, hash) DO UPDATE SET\n" +
        "   embedding=excluded.embedding,\n" +
        "   dims=excluded.dims,\n" +
        "   updated_at=excluded.updated_at",
    );
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
      var entry = entries_1[_i];
      var embedding = (_a = entry.embedding) !== null && _a !== void 0 ? _a : [];
      stmt.run(
        this.provider.id,
        this.provider.model,
        this.providerKey,
        entry.hash,
        JSON.stringify(embedding),
        embedding.length,
        now,
      );
    }
  };
  MemoryIndexManager.prototype.pruneEmbeddingCacheIfNeeded = function () {
    var _a;
    if (!this.cache.enabled) {
      return;
    }
    var max = this.cache.maxEntries;
    if (!max || max <= 0) {
      return;
    }
    var row = this.db.prepare("SELECT COUNT(*) as c FROM ".concat(EMBEDDING_CACHE_TABLE)).get();
    var count =
      (_a = row === null || row === void 0 ? void 0 : row.c) !== null && _a !== void 0 ? _a : 0;
    if (count <= max) {
      return;
    }
    var excess = count - max;
    this.db
      .prepare(
        "DELETE FROM ".concat(EMBEDDING_CACHE_TABLE, "\n") +
          " WHERE rowid IN (\n" +
          "   SELECT rowid FROM ".concat(EMBEDDING_CACHE_TABLE, "\n") +
          "   ORDER BY updated_at ASC\n" +
          "   LIMIT ?\n" +
          " )",
      )
      .run(excess);
  };
  MemoryIndexManager.prototype.embedChunksInBatches = function (chunks) {
    return __awaiter(this, void 0, void 0, function () {
      var cached,
        embeddings,
        missing,
        i,
        chunk,
        hit,
        missingChunks,
        batches,
        toCache,
        cursor,
        _i,
        batches_1,
        batch,
        batchEmbeddings,
        i,
        item,
        embedding;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            if (chunks.length === 0) {
              return [2 /*return*/, []];
            }
            cached = this.loadEmbeddingCache(
              chunks.map(function (chunk) {
                return chunk.hash;
              }),
            );
            embeddings = Array.from({ length: chunks.length }, function () {
              return [];
            });
            missing = [];
            for (i = 0; i < chunks.length; i += 1) {
              chunk = chunks[i];
              hit = (chunk === null || chunk === void 0 ? void 0 : chunk.hash)
                ? cached.get(chunk.hash)
                : undefined;
              if (hit && hit.length > 0) {
                embeddings[i] = hit;
              } else if (chunk) {
                missing.push({ index: i, chunk: chunk });
              }
            }
            if (missing.length === 0) {
              return [2 /*return*/, embeddings];
            }
            missingChunks = missing.map(function (m) {
              return m.chunk;
            });
            batches = this.buildEmbeddingBatches(missingChunks);
            toCache = [];
            cursor = 0;
            ((_i = 0), (batches_1 = batches));
            _b.label = 1;
          case 1:
            if (!(_i < batches_1.length)) {
              return [3 /*break*/, 4];
            }
            batch = batches_1[_i];
            return [
              4 /*yield*/,
              this.embedBatchWithRetry(
                batch.map(function (chunk) {
                  return chunk.text;
                }),
              ),
            ];
          case 2:
            batchEmbeddings = _b.sent();
            for (i = 0; i < batch.length; i += 1) {
              item = missing[cursor + i];
              embedding = (_a = batchEmbeddings[i]) !== null && _a !== void 0 ? _a : [];
              if (item) {
                embeddings[item.index] = embedding;
                toCache.push({ hash: item.chunk.hash, embedding: embedding });
              }
            }
            cursor += batch.length;
            _b.label = 3;
          case 3:
            _i++;
            return [3 /*break*/, 1];
          case 4:
            this.upsertEmbeddingCache(toCache);
            return [2 /*return*/, embeddings];
        }
      });
    });
  };
  MemoryIndexManager.prototype.computeProviderKey = function () {
    if (this.provider.id === "openai" && this.openAi) {
      var entries = Object.entries(this.openAi.headers)
        .filter(function (_a) {
          var key = _a[0];
          return key.toLowerCase() !== "authorization";
        })
        .toSorted(function (_a, _b) {
          var a = _a[0];
          var b = _b[0];
          return a.localeCompare(b);
        })
        .map(function (_a) {
          var key = _a[0],
            value = _a[1];
          return [key, value];
        });
      return (0, internal_js_1.hashText)(
        JSON.stringify({
          provider: "openai",
          baseUrl: this.openAi.baseUrl,
          model: this.openAi.model,
          headers: entries,
        }),
      );
    }
    if (this.provider.id === "gemini" && this.gemini) {
      var entries = Object.entries(this.gemini.headers)
        .filter(function (_a) {
          var key = _a[0];
          var lower = key.toLowerCase();
          return lower !== "authorization" && lower !== "x-goog-api-key";
        })
        .toSorted(function (_a, _b) {
          var a = _a[0];
          var b = _b[0];
          return a.localeCompare(b);
        })
        .map(function (_a) {
          var key = _a[0],
            value = _a[1];
          return [key, value];
        });
      return (0, internal_js_1.hashText)(
        JSON.stringify({
          provider: "gemini",
          baseUrl: this.gemini.baseUrl,
          model: this.gemini.model,
          headers: entries,
        }),
      );
    }
    return (0, internal_js_1.hashText)(
      JSON.stringify({ provider: this.provider.id, model: this.provider.model }),
    );
  };
  MemoryIndexManager.prototype.embedChunksWithBatch = function (chunks, entry, source) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        if (this.provider.id === "openai" && this.openAi) {
          return [2 /*return*/, this.embedChunksWithOpenAiBatch(chunks, entry, source)];
        }
        if (this.provider.id === "gemini" && this.gemini) {
          return [2 /*return*/, this.embedChunksWithGeminiBatch(chunks, entry, source)];
        }
        return [2 /*return*/, this.embedChunksInBatches(chunks)];
      });
    });
  };
  MemoryIndexManager.prototype.embedChunksWithOpenAiBatch = function (chunks, entry, source) {
    return __awaiter(this, void 0, void 0, function () {
      var openAi,
        cached,
        embeddings,
        missing,
        i,
        chunk,
        hit,
        requests,
        mapping,
        _i,
        missing_1,
        item,
        chunk,
        customId,
        batchResult,
        byCustomId,
        toCache,
        _a,
        _b,
        _c,
        customId,
        embedding,
        mapped;
      var _this = this;
      var _d, _e;
      return __generator(this, function (_f) {
        switch (_f.label) {
          case 0:
            openAi = this.openAi;
            if (!openAi) {
              return [2 /*return*/, this.embedChunksInBatches(chunks)];
            }
            if (chunks.length === 0) {
              return [2 /*return*/, []];
            }
            cached = this.loadEmbeddingCache(
              chunks.map(function (chunk) {
                return chunk.hash;
              }),
            );
            embeddings = Array.from({ length: chunks.length }, function () {
              return [];
            });
            missing = [];
            for (i = 0; i < chunks.length; i += 1) {
              chunk = chunks[i];
              hit = (chunk === null || chunk === void 0 ? void 0 : chunk.hash)
                ? cached.get(chunk.hash)
                : undefined;
              if (hit && hit.length > 0) {
                embeddings[i] = hit;
              } else if (chunk) {
                missing.push({ index: i, chunk: chunk });
              }
            }
            if (missing.length === 0) {
              return [2 /*return*/, embeddings];
            }
            requests = [];
            mapping = new Map();
            for (_i = 0, missing_1 = missing; _i < missing_1.length; _i++) {
              item = missing_1[_i];
              chunk = item.chunk;
              customId = (0, internal_js_1.hashText)(
                ""
                  .concat(source, ":")
                  .concat(entry.path, ":")
                  .concat(chunk.startLine, ":")
                  .concat(chunk.endLine, ":")
                  .concat(chunk.hash, ":")
                  .concat(item.index),
              );
              mapping.set(customId, { index: item.index, hash: chunk.hash });
              requests.push({
                custom_id: customId,
                method: "POST",
                url: batch_openai_js_1.OPENAI_BATCH_ENDPOINT,
                body: {
                  model:
                    (_e = (_d = this.openAi) === null || _d === void 0 ? void 0 : _d.model) !==
                      null && _e !== void 0
                      ? _e
                      : this.provider.model,
                  input: chunk.text,
                },
              });
            }
            return [
              4 /*yield*/,
              this.runBatchWithFallback({
                provider: "openai",
                run: function () {
                  return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          return [
                            4 /*yield*/,
                            (0, batch_openai_js_1.runOpenAiEmbeddingBatches)({
                              openAi: openAi,
                              agentId: this.agentId,
                              requests: requests,
                              wait: this.batch.wait,
                              concurrency: this.batch.concurrency,
                              pollIntervalMs: this.batch.pollIntervalMs,
                              timeoutMs: this.batch.timeoutMs,
                              debug: function (message, data) {
                                return log.debug(
                                  message,
                                  __assign(__assign({}, data), {
                                    source: source,
                                    chunks: chunks.length,
                                  }),
                                );
                              },
                            }),
                          ];
                        case 1:
                          return [2 /*return*/, _a.sent()];
                      }
                    });
                  });
                },
                fallback: function () {
                  return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          return [4 /*yield*/, this.embedChunksInBatches(chunks)];
                        case 1:
                          return [2 /*return*/, _a.sent()];
                      }
                    });
                  });
                },
              }),
            ];
          case 1:
            batchResult = _f.sent();
            if (Array.isArray(batchResult)) {
              return [2 /*return*/, batchResult];
            }
            byCustomId = batchResult;
            toCache = [];
            for (_a = 0, _b = byCustomId.entries(); _a < _b.length; _a++) {
              ((_c = _b[_a]), (customId = _c[0]), (embedding = _c[1]));
              mapped = mapping.get(customId);
              if (!mapped) {
                continue;
              }
              embeddings[mapped.index] = embedding;
              toCache.push({ hash: mapped.hash, embedding: embedding });
            }
            this.upsertEmbeddingCache(toCache);
            return [2 /*return*/, embeddings];
        }
      });
    });
  };
  MemoryIndexManager.prototype.embedChunksWithGeminiBatch = function (chunks, entry, source) {
    return __awaiter(this, void 0, void 0, function () {
      var gemini,
        cached,
        embeddings,
        missing,
        i,
        chunk,
        hit,
        requests,
        mapping,
        _i,
        missing_2,
        item,
        chunk,
        customId,
        batchResult,
        byCustomId,
        toCache,
        _a,
        _b,
        _c,
        customId,
        embedding,
        mapped;
      var _this = this;
      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            gemini = this.gemini;
            if (!gemini) {
              return [2 /*return*/, this.embedChunksInBatches(chunks)];
            }
            if (chunks.length === 0) {
              return [2 /*return*/, []];
            }
            cached = this.loadEmbeddingCache(
              chunks.map(function (chunk) {
                return chunk.hash;
              }),
            );
            embeddings = Array.from({ length: chunks.length }, function () {
              return [];
            });
            missing = [];
            for (i = 0; i < chunks.length; i += 1) {
              chunk = chunks[i];
              hit = (chunk === null || chunk === void 0 ? void 0 : chunk.hash)
                ? cached.get(chunk.hash)
                : undefined;
              if (hit && hit.length > 0) {
                embeddings[i] = hit;
              } else if (chunk) {
                missing.push({ index: i, chunk: chunk });
              }
            }
            if (missing.length === 0) {
              return [2 /*return*/, embeddings];
            }
            requests = [];
            mapping = new Map();
            for (_i = 0, missing_2 = missing; _i < missing_2.length; _i++) {
              item = missing_2[_i];
              chunk = item.chunk;
              customId = (0, internal_js_1.hashText)(
                ""
                  .concat(source, ":")
                  .concat(entry.path, ":")
                  .concat(chunk.startLine, ":")
                  .concat(chunk.endLine, ":")
                  .concat(chunk.hash, ":")
                  .concat(item.index),
              );
              mapping.set(customId, { index: item.index, hash: chunk.hash });
              requests.push({
                custom_id: customId,
                content: { parts: [{ text: chunk.text }] },
                taskType: "RETRIEVAL_DOCUMENT",
              });
            }
            return [
              4 /*yield*/,
              this.runBatchWithFallback({
                provider: "gemini",
                run: function () {
                  return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          return [
                            4 /*yield*/,
                            (0, batch_gemini_js_1.runGeminiEmbeddingBatches)({
                              gemini: gemini,
                              agentId: this.agentId,
                              requests: requests,
                              wait: this.batch.wait,
                              concurrency: this.batch.concurrency,
                              pollIntervalMs: this.batch.pollIntervalMs,
                              timeoutMs: this.batch.timeoutMs,
                              debug: function (message, data) {
                                return log.debug(
                                  message,
                                  __assign(__assign({}, data), {
                                    source: source,
                                    chunks: chunks.length,
                                  }),
                                );
                              },
                            }),
                          ];
                        case 1:
                          return [2 /*return*/, _a.sent()];
                      }
                    });
                  });
                },
                fallback: function () {
                  return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          return [4 /*yield*/, this.embedChunksInBatches(chunks)];
                        case 1:
                          return [2 /*return*/, _a.sent()];
                      }
                    });
                  });
                },
              }),
            ];
          case 1:
            batchResult = _d.sent();
            if (Array.isArray(batchResult)) {
              return [2 /*return*/, batchResult];
            }
            byCustomId = batchResult;
            toCache = [];
            for (_a = 0, _b = byCustomId.entries(); _a < _b.length; _a++) {
              ((_c = _b[_a]), (customId = _c[0]), (embedding = _c[1]));
              mapped = mapping.get(customId);
              if (!mapped) {
                continue;
              }
              embeddings[mapped.index] = embedding;
              toCache.push({ hash: mapped.hash, embedding: embedding });
            }
            this.upsertEmbeddingCache(toCache);
            return [2 /*return*/, embeddings];
        }
      });
    });
  };
  MemoryIndexManager.prototype.embedBatchWithRetry = function (texts) {
    return __awaiter(this, void 0, void 0, function () {
      var attempt, delayMs, _loop_1, this_1, state_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (texts.length === 0) {
              return [2 /*return*/, []];
            }
            attempt = 0;
            delayMs = EMBEDDING_RETRY_BASE_DELAY_MS;
            _loop_1 = function () {
              var timeoutMs, _b, err_9, message, waitMs_1;
              return __generator(this, function (_c) {
                switch (_c.label) {
                  case 0:
                    _c.trys.push([0, 2, , 4]);
                    timeoutMs = this_1.resolveEmbeddingTimeout("batch");
                    log.debug("memory embeddings: batch start", {
                      provider: this_1.provider.id,
                      items: texts.length,
                      timeoutMs: timeoutMs,
                    });
                    _b = {};
                    return [
                      4 /*yield*/,
                      this_1.withTimeout(
                        this_1.provider.embedBatch(texts),
                        timeoutMs,
                        "memory embeddings batch timed out after ".concat(
                          Math.round(timeoutMs / 1000),
                          "s",
                        ),
                      ),
                    ];
                  case 1:
                    return [2 /*return*/, ((_b.value = _c.sent()), _b)];
                  case 2:
                    err_9 = _c.sent();
                    message = err_9 instanceof Error ? err_9.message : String(err_9);
                    if (
                      !this_1.isRetryableEmbeddingError(message) ||
                      attempt >= EMBEDDING_RETRY_MAX_ATTEMPTS
                    ) {
                      throw err_9;
                    }
                    waitMs_1 = Math.min(
                      EMBEDDING_RETRY_MAX_DELAY_MS,
                      Math.round(delayMs * (1 + Math.random() * 0.2)),
                    );
                    log.warn("memory embeddings rate limited; retrying in ".concat(waitMs_1, "ms"));
                    return [
                      4 /*yield*/,
                      new Promise(function (resolve) {
                        return setTimeout(resolve, waitMs_1);
                      }),
                    ];
                  case 3:
                    _c.sent();
                    delayMs *= 2;
                    attempt += 1;
                    return [3 /*break*/, 4];
                  case 4:
                    return [2 /*return*/];
                }
              });
            };
            this_1 = this;
            _a.label = 1;
          case 1:
            if (!true) {
              return [3 /*break*/, 3];
            }
            return [5 /*yield**/, _loop_1()];
          case 2:
            state_1 = _a.sent();
            if (typeof state_1 === "object") {
              return [2 /*return*/, state_1.value];
            }
            return [3 /*break*/, 1];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  MemoryIndexManager.prototype.isRetryableEmbeddingError = function (message) {
    return /(rate[_ ]limit|too many requests|429|resource has been exhausted|5\d\d|cloudflare)/i.test(
      message,
    );
  };
  MemoryIndexManager.prototype.resolveEmbeddingTimeout = function (kind) {
    var isLocal = this.provider.id === "local";
    if (kind === "query") {
      return isLocal ? EMBEDDING_QUERY_TIMEOUT_LOCAL_MS : EMBEDDING_QUERY_TIMEOUT_REMOTE_MS;
    }
    return isLocal ? EMBEDDING_BATCH_TIMEOUT_LOCAL_MS : EMBEDDING_BATCH_TIMEOUT_REMOTE_MS;
  };
  MemoryIndexManager.prototype.embedQueryWithTimeout = function (text) {
    return __awaiter(this, void 0, void 0, function () {
      var timeoutMs;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            timeoutMs = this.resolveEmbeddingTimeout("query");
            log.debug("memory embeddings: query start", {
              provider: this.provider.id,
              timeoutMs: timeoutMs,
            });
            return [
              4 /*yield*/,
              this.withTimeout(
                this.provider.embedQuery(text),
                timeoutMs,
                "memory embeddings query timed out after ".concat(
                  Math.round(timeoutMs / 1000),
                  "s",
                ),
              ),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  MemoryIndexManager.prototype.withTimeout = function (promise, timeoutMs, message) {
    return __awaiter(this, void 0, void 0, function () {
      var timer, timeoutPromise;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!(!Number.isFinite(timeoutMs) || timeoutMs <= 0)) {
              return [3 /*break*/, 2];
            }
            return [4 /*yield*/, promise];
          case 1:
            return [2 /*return*/, _a.sent()];
          case 2:
            timer = null;
            timeoutPromise = new Promise(function (_, reject) {
              timer = setTimeout(function () {
                return reject(new Error(message));
              }, timeoutMs);
            });
            _a.label = 3;
          case 3:
            _a.trys.push([3, , 5, 6]);
            return [4 /*yield*/, Promise.race([promise, timeoutPromise])];
          case 4:
            return [2 /*return*/, _a.sent()];
          case 5:
            if (timer) {
              clearTimeout(timer);
            }
            return [7 /*endfinally*/];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  };
  MemoryIndexManager.prototype.runWithConcurrency = function (tasks, limit) {
    return __awaiter(this, void 0, void 0, function () {
      var resolvedLimit, results, next, firstError, workers;
      var _this = this;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (tasks.length === 0) {
              return [2 /*return*/, []];
            }
            resolvedLimit = Math.max(1, Math.min(limit, tasks.length));
            results = Array.from({ length: tasks.length });
            next = 0;
            firstError = null;
            workers = Array.from({ length: resolvedLimit }, function () {
              return __awaiter(_this, void 0, void 0, function () {
                var index, _a, _b, err_10;
                return __generator(this, function (_c) {
                  switch (_c.label) {
                    case 0:
                      if (!true) {
                        return [3 /*break*/, 5];
                      }
                      if (firstError) {
                        return [2 /*return*/];
                      }
                      index = next;
                      next += 1;
                      if (index >= tasks.length) {
                        return [2 /*return*/];
                      }
                      _c.label = 1;
                    case 1:
                      _c.trys.push([1, 3, , 4]);
                      _a = results;
                      _b = index;
                      return [4 /*yield*/, tasks[index]()];
                    case 2:
                      _a[_b] = _c.sent();
                      return [3 /*break*/, 4];
                    case 3:
                      err_10 = _c.sent();
                      firstError = err_10;
                      return [2 /*return*/];
                    case 4:
                      return [3 /*break*/, 0];
                    case 5:
                      return [2 /*return*/];
                  }
                });
              });
            });
            return [4 /*yield*/, Promise.allSettled(workers)];
          case 1:
            _a.sent();
            if (firstError) {
              throw firstError;
            }
            return [2 /*return*/, results];
        }
      });
    });
  };
  MemoryIndexManager.prototype.withBatchFailureLock = function (fn) {
    return __awaiter(this, void 0, void 0, function () {
      var release, wait;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            wait = this.batchFailureLock;
            this.batchFailureLock = new Promise(function (resolve) {
              release = resolve;
            });
            return [4 /*yield*/, wait];
          case 1:
            _a.sent();
            _a.label = 2;
          case 2:
            _a.trys.push([2, , 4, 5]);
            return [4 /*yield*/, fn()];
          case 3:
            return [2 /*return*/, _a.sent()];
          case 4:
            release();
            return [7 /*endfinally*/];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  };
  MemoryIndexManager.prototype.resetBatchFailureCount = function () {
    return __awaiter(this, void 0, void 0, function () {
      var _this = this;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.withBatchFailureLock(function () {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    if (this.batchFailureCount > 0) {
                      log.debug("memory embeddings: batch recovered; resetting failure count");
                    }
                    this.batchFailureCount = 0;
                    this.batchFailureLastError = undefined;
                    this.batchFailureLastProvider = undefined;
                    return [2 /*return*/];
                  });
                });
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  MemoryIndexManager.prototype.recordBatchFailure = function (params) {
    return __awaiter(this, void 0, void 0, function () {
      var _this = this;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.withBatchFailureLock(function () {
                return __awaiter(_this, void 0, void 0, function () {
                  var increment, disabled;
                  var _a;
                  return __generator(this, function (_b) {
                    if (!this.batch.enabled) {
                      return [2 /*return*/, { disabled: true, count: this.batchFailureCount }];
                    }
                    increment = params.forceDisable
                      ? BATCH_FAILURE_LIMIT
                      : Math.max(1, (_a = params.attempts) !== null && _a !== void 0 ? _a : 1);
                    this.batchFailureCount += increment;
                    this.batchFailureLastError = params.message;
                    this.batchFailureLastProvider = params.provider;
                    disabled = params.forceDisable || this.batchFailureCount >= BATCH_FAILURE_LIMIT;
                    if (disabled) {
                      this.batch.enabled = false;
                    }
                    return [2 /*return*/, { disabled: disabled, count: this.batchFailureCount }];
                  });
                });
              }),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  MemoryIndexManager.prototype.isBatchTimeoutError = function (message) {
    return /timed out|timeout/i.test(message);
  };
  MemoryIndexManager.prototype.runBatchWithTimeoutRetry = function (params) {
    return __awaiter(this, void 0, void 0, function () {
      var err_11, message, retryErr_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 7]);
            return [4 /*yield*/, params.run()];
          case 1:
            return [2 /*return*/, _a.sent()];
          case 2:
            err_11 = _a.sent();
            message = err_11 instanceof Error ? err_11.message : String(err_11);
            if (!this.isBatchTimeoutError(message)) {
              return [3 /*break*/, 6];
            }
            log.warn(
              "memory embeddings: ".concat(params.provider, " batch timed out; retrying once"),
            );
            _a.label = 3;
          case 3:
            _a.trys.push([3, 5, , 6]);
            return [4 /*yield*/, params.run()];
          case 4:
            return [2 /*return*/, _a.sent()];
          case 5:
            retryErr_1 = _a.sent();
            retryErr_1.batchAttempts = 2;
            throw retryErr_1;
          case 6:
            throw err_11;
          case 7:
            return [2 /*return*/];
        }
      });
    });
  };
  MemoryIndexManager.prototype.runBatchWithFallback = function (params) {
    return __awaiter(this, void 0, void 0, function () {
      var result, err_12, message, attempts, forceDisable, failure, suffix;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            if (!!this.batch.enabled) {
              return [3 /*break*/, 2];
            }
            return [4 /*yield*/, params.fallback()];
          case 1:
            return [2 /*return*/, _b.sent()];
          case 2:
            _b.trys.push([2, 5, , 8]);
            return [
              4 /*yield*/,
              this.runBatchWithTimeoutRetry({
                provider: params.provider,
                run: params.run,
              }),
            ];
          case 3:
            result = _b.sent();
            return [4 /*yield*/, this.resetBatchFailureCount()];
          case 4:
            _b.sent();
            return [2 /*return*/, result];
          case 5:
            err_12 = _b.sent();
            message = err_12 instanceof Error ? err_12.message : String(err_12);
            attempts = (_a = err_12.batchAttempts) !== null && _a !== void 0 ? _a : 1;
            forceDisable = /asyncBatchEmbedContent not available/i.test(message);
            return [
              4 /*yield*/,
              this.recordBatchFailure({
                provider: params.provider,
                message: message,
                attempts: attempts,
                forceDisable: forceDisable,
              }),
            ];
          case 6:
            failure = _b.sent();
            suffix = failure.disabled ? "disabling batch" : "keeping batch enabled";
            log.warn(
              "memory embeddings: "
                .concat(params.provider, " batch failed (")
                .concat(failure.count, "/")
                .concat(BATCH_FAILURE_LIMIT, "); ")
                .concat(suffix, "; falling back to non-batch embeddings: ")
                .concat(message),
            );
            return [4 /*yield*/, params.fallback()];
          case 7:
            return [2 /*return*/, _b.sent()];
          case 8:
            return [2 /*return*/];
        }
      });
    });
  };
  MemoryIndexManager.prototype.getIndexConcurrency = function () {
    return this.batch.enabled ? this.batch.concurrency : EMBEDDING_INDEX_CONCURRENCY;
  };
  MemoryIndexManager.prototype.indexFile = function (entry, options) {
    return __awaiter(this, void 0, void 0, function () {
      var content,
        _a,
        chunks,
        embeddings,
        _b,
        sample,
        vectorReady,
        _c,
        now,
        i,
        chunk,
        embedding,
        id;
      var _d, _e;
      return __generator(this, function (_f) {
        switch (_f.label) {
          case 0:
            if (!((_d = options.content) !== null && _d !== void 0)) {
              return [3 /*break*/, 1];
            }
            _a = _d;
            return [3 /*break*/, 3];
          case 1:
            return [4 /*yield*/, promises_1.default.readFile(entry.absPath, "utf-8")];
          case 2:
            _a = _f.sent();
            _f.label = 3;
          case 3:
            content = _a;
            chunks = (0, internal_js_1.chunkMarkdown)(content, this.settings.chunking).filter(
              function (chunk) {
                return chunk.text.trim().length > 0;
              },
            );
            if (!this.batch.enabled) {
              return [3 /*break*/, 5];
            }
            return [4 /*yield*/, this.embedChunksWithBatch(chunks, entry, options.source)];
          case 4:
            _b = _f.sent();
            return [3 /*break*/, 7];
          case 5:
            return [4 /*yield*/, this.embedChunksInBatches(chunks)];
          case 6:
            _b = _f.sent();
            _f.label = 7;
          case 7:
            embeddings = _b;
            sample = embeddings.find(function (embedding) {
              return embedding.length > 0;
            });
            if (!sample) {
              return [3 /*break*/, 9];
            }
            return [4 /*yield*/, this.ensureVectorReady(sample.length)];
          case 8:
            _c = _f.sent();
            return [3 /*break*/, 10];
          case 9:
            _c = false;
            _f.label = 10;
          case 10:
            vectorReady = _c;
            now = Date.now();
            if (vectorReady) {
              try {
                this.db
                  .prepare(
                    "DELETE FROM ".concat(
                      VECTOR_TABLE,
                      " WHERE id IN (SELECT id FROM chunks WHERE path = ? AND source = ?)",
                    ),
                  )
                  .run(entry.path, options.source);
              } catch (_g) {}
            }
            if (this.fts.enabled && this.fts.available) {
              try {
                this.db
                  .prepare(
                    "DELETE FROM ".concat(
                      FTS_TABLE,
                      " WHERE path = ? AND source = ? AND model = ?",
                    ),
                  )
                  .run(entry.path, options.source, this.provider.model);
              } catch (_h) {}
            }
            this.db
              .prepare("DELETE FROM chunks WHERE path = ? AND source = ?")
              .run(entry.path, options.source);
            for (i = 0; i < chunks.length; i++) {
              chunk = chunks[i];
              embedding = (_e = embeddings[i]) !== null && _e !== void 0 ? _e : [];
              id = (0, internal_js_1.hashText)(
                ""
                  .concat(options.source, ":")
                  .concat(entry.path, ":")
                  .concat(chunk.startLine, ":")
                  .concat(chunk.endLine, ":")
                  .concat(chunk.hash, ":")
                  .concat(this.provider.model),
              );
              this.db
                .prepare(
                  "INSERT INTO chunks (id, path, source, start_line, end_line, hash, model, text, embedding, updated_at)\n           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n           ON CONFLICT(id) DO UPDATE SET\n             hash=excluded.hash,\n             model=excluded.model,\n             text=excluded.text,\n             embedding=excluded.embedding,\n             updated_at=excluded.updated_at",
                )
                .run(
                  id,
                  entry.path,
                  options.source,
                  chunk.startLine,
                  chunk.endLine,
                  chunk.hash,
                  this.provider.model,
                  chunk.text,
                  JSON.stringify(embedding),
                  now,
                );
              if (vectorReady && embedding.length > 0) {
                try {
                  this.db.prepare("DELETE FROM ".concat(VECTOR_TABLE, " WHERE id = ?")).run(id);
                } catch (_j) {}
                this.db
                  .prepare("INSERT INTO ".concat(VECTOR_TABLE, " (id, embedding) VALUES (?, ?)"))
                  .run(id, vectorToBlob(embedding));
              }
              if (this.fts.enabled && this.fts.available) {
                this.db
                  .prepare(
                    "INSERT INTO ".concat(
                      FTS_TABLE,
                      " (text, id, path, source, model, start_line, end_line)\n",
                    ) + " VALUES (?, ?, ?, ?, ?, ?, ?)",
                  )
                  .run(
                    chunk.text,
                    id,
                    entry.path,
                    options.source,
                    this.provider.model,
                    chunk.startLine,
                    chunk.endLine,
                  );
              }
            }
            this.db
              .prepare(
                "INSERT INTO files (path, source, hash, mtime, size) VALUES (?, ?, ?, ?, ?)\n         ON CONFLICT(path) DO UPDATE SET\n           source=excluded.source,\n           hash=excluded.hash,\n           mtime=excluded.mtime,\n           size=excluded.size",
              )
              .run(entry.path, options.source, entry.hash, entry.mtimeMs, entry.size);
            return [2 /*return*/];
        }
      });
    });
  };
  return MemoryIndexManager;
})();
exports.MemoryIndexManager = MemoryIndexManager;
