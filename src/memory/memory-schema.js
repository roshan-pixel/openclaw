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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureMemoryIndexSchema = ensureMemoryIndexSchema;
function ensureMemoryIndexSchema(params) {
  params.db.exec(
    "\n    CREATE TABLE IF NOT EXISTS meta (\n      key TEXT PRIMARY KEY,\n      value TEXT NOT NULL\n    );\n  ",
  );
  params.db.exec(
    "\n    CREATE TABLE IF NOT EXISTS files (\n      path TEXT PRIMARY KEY,\n      source TEXT NOT NULL DEFAULT 'memory',\n      hash TEXT NOT NULL,\n      mtime INTEGER NOT NULL,\n      size INTEGER NOT NULL\n    );\n  ",
  );
  params.db.exec(
    "\n    CREATE TABLE IF NOT EXISTS chunks (\n      id TEXT PRIMARY KEY,\n      path TEXT NOT NULL,\n      source TEXT NOT NULL DEFAULT 'memory',\n      start_line INTEGER NOT NULL,\n      end_line INTEGER NOT NULL,\n      hash TEXT NOT NULL,\n      model TEXT NOT NULL,\n      text TEXT NOT NULL,\n      embedding TEXT NOT NULL,\n      updated_at INTEGER NOT NULL\n    );\n  ",
  );
  params.db.exec(
    "\n    CREATE TABLE IF NOT EXISTS ".concat(
      params.embeddingCacheTable,
      " (\n      provider TEXT NOT NULL,\n      model TEXT NOT NULL,\n      provider_key TEXT NOT NULL,\n      hash TEXT NOT NULL,\n      embedding TEXT NOT NULL,\n      dims INTEGER,\n      updated_at INTEGER NOT NULL,\n      PRIMARY KEY (provider, model, provider_key, hash)\n    );\n  ",
    ),
  );
  params.db.exec(
    "CREATE INDEX IF NOT EXISTS idx_embedding_cache_updated_at ON ".concat(
      params.embeddingCacheTable,
      "(updated_at);",
    ),
  );
  var ftsAvailable = false;
  var ftsError;
  if (params.ftsEnabled) {
    try {
      params.db.exec(
        "CREATE VIRTUAL TABLE IF NOT EXISTS ".concat(params.ftsTable, " USING fts5(\n") +
          "  text,\n" +
          "  id UNINDEXED,\n" +
          "  path UNINDEXED,\n" +
          "  source UNINDEXED,\n" +
          "  model UNINDEXED,\n" +
          "  start_line UNINDEXED,\n" +
          "  end_line UNINDEXED\n" +
          ");",
      );
      ftsAvailable = true;
    } catch (err) {
      var message = err instanceof Error ? err.message : String(err);
      ftsAvailable = false;
      ftsError = message;
    }
  }
  ensureColumn(params.db, "files", "source", "TEXT NOT NULL DEFAULT 'memory'");
  ensureColumn(params.db, "chunks", "source", "TEXT NOT NULL DEFAULT 'memory'");
  params.db.exec("CREATE INDEX IF NOT EXISTS idx_chunks_path ON chunks(path);");
  params.db.exec("CREATE INDEX IF NOT EXISTS idx_chunks_source ON chunks(source);");
  return __assign({ ftsAvailable: ftsAvailable }, ftsError ? { ftsError: ftsError } : {});
}
function ensureColumn(db, table, column, definition) {
  var rows = db.prepare("PRAGMA table_info(".concat(table, ")")).all();
  if (
    rows.some(function (row) {
      return row.name === column;
    })
  ) {
    return;
  }
  db.exec("ALTER TABLE ".concat(table, " ADD COLUMN ").concat(column, " ").concat(definition));
}
