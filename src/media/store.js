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
exports.MEDIA_MAX_BYTES = void 0;
exports.extractOriginalFilename = extractOriginalFilename;
exports.getMediaDir = getMediaDir;
exports.ensureMediaDir = ensureMediaDir;
exports.cleanOldMedia = cleanOldMedia;
exports.saveMediaSource = saveMediaSource;
exports.saveMediaBuffer = saveMediaBuffer;
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var promises_1 = require("node:fs/promises");
var node_http_1 = require("node:http");
var node_https_1 = require("node:https");
var node_path_1 = require("node:path");
var promises_2 = require("node:stream/promises");
var utils_js_1 = require("../utils.js");
var ssrf_js_1 = require("../infra/net/ssrf.js");
var mime_js_1 = require("./mime.js");
var resolveMediaDir = function () {
  return node_path_1.default.join((0, utils_js_1.resolveConfigDir)(), "media");
};
exports.MEDIA_MAX_BYTES = 5 * 1024 * 1024; // 5MB default
var MAX_BYTES = exports.MEDIA_MAX_BYTES;
var DEFAULT_TTL_MS = 2 * 60 * 1000; // 2 minutes
/**
 * Sanitize a filename for cross-platform safety.
 * Removes chars unsafe on Windows/SharePoint/all platforms.
 * Keeps: alphanumeric, dots, hyphens, underscores, Unicode letters/numbers.
 */
function sanitizeFilename(name) {
  var trimmed = name.trim();
  if (!trimmed) {
    return "";
  }
  var sanitized = trimmed.replace(/[^\p{L}\p{N}._-]+/gu, "_");
  // Collapse multiple underscores, trim leading/trailing, limit length
  return sanitized.replace(/_+/g, "_").replace(/^_|_$/g, "").slice(0, 60);
}
/**
 * Extract original filename from path if it matches the embedded format.
 * Pattern: {original}---{uuid}.{ext} → returns "{original}.{ext}"
 * Falls back to basename if no pattern match, or "file.bin" if empty.
 */
function extractOriginalFilename(filePath) {
  var basename = node_path_1.default.basename(filePath);
  if (!basename) {
    return "file.bin";
  } // Fallback for empty input
  var ext = node_path_1.default.extname(basename);
  var nameWithoutExt = node_path_1.default.basename(basename, ext);
  // Check for ---{uuid} pattern (36 chars: 8-4-4-4-12 with hyphens)
  var match = nameWithoutExt.match(
    /^(.+)---[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i,
  );
  if (match === null || match === void 0 ? void 0 : match[1]) {
    return "".concat(match[1]).concat(ext);
  }
  return basename; // Fallback: use as-is
}
function getMediaDir() {
  return resolveMediaDir();
}
function ensureMediaDir() {
  return __awaiter(this, void 0, void 0, function () {
    var mediaDir;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          mediaDir = resolveMediaDir();
          return [4 /*yield*/, promises_1.default.mkdir(mediaDir, { recursive: true, mode: 448 })];
        case 1:
          _a.sent();
          return [2 /*return*/, mediaDir];
      }
    });
  });
}
function cleanOldMedia() {
  return __awaiter(this, arguments, void 0, function (ttlMs) {
    var mediaDir, entries, now;
    var _this = this;
    if (ttlMs === void 0) {
      ttlMs = DEFAULT_TTL_MS;
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, ensureMediaDir()];
        case 1:
          mediaDir = _a.sent();
          return [
            4 /*yield*/,
            promises_1.default.readdir(mediaDir).catch(function () {
              return [];
            }),
          ];
        case 2:
          entries = _a.sent();
          now = Date.now();
          return [
            4 /*yield*/,
            Promise.all(
              entries.map(function (file) {
                return __awaiter(_this, void 0, void 0, function () {
                  var full, stat;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        full = node_path_1.default.join(mediaDir, file);
                        return [
                          4 /*yield*/,
                          promises_1.default.stat(full).catch(function () {
                            return null;
                          }),
                        ];
                      case 1:
                        stat = _a.sent();
                        if (!stat) {
                          return [2 /*return*/];
                        }
                        if (!(now - stat.mtimeMs > ttlMs)) {
                          return [3 /*break*/, 3];
                        }
                        return [4 /*yield*/, promises_1.default.rm(full).catch(function () {})];
                      case 2:
                        _a.sent();
                        _a.label = 3;
                      case 3:
                        return [2 /*return*/];
                    }
                  });
                });
              }),
            ),
          ];
        case 3:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function looksLikeUrl(src) {
  return /^https?:\/\//i.test(src);
}
/**
 * Download media to disk while capturing the first few KB for mime sniffing.
 */
function downloadToFile(url_1, dest_1, headers_1) {
  return __awaiter(this, arguments, void 0, function (url, dest, headers, maxRedirects) {
    if (maxRedirects === void 0) {
      maxRedirects = 5;
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            new Promise(function (resolve, reject) {
              var parsedUrl;
              try {
                parsedUrl = new URL(url);
              } catch (_a) {
                reject(new Error("Invalid URL"));
                return;
              }
              if (!["http:", "https:"].includes(parsedUrl.protocol)) {
                reject(
                  new Error(
                    "Invalid URL protocol: ".concat(
                      parsedUrl.protocol,
                      ". Only HTTP/HTTPS allowed.",
                    ),
                  ),
                );
                return;
              }
              var requestImpl =
                parsedUrl.protocol === "https:" ? node_https_1.request : node_http_1.request;
              (0, ssrf_js_1.resolvePinnedHostname)(parsedUrl.hostname)
                .then(function (pinned) {
                  var req = requestImpl(
                    parsedUrl,
                    { headers: headers, lookup: pinned.lookup },
                    function (res) {
                      var _a;
                      // Follow redirects
                      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400) {
                        var location_1 = res.headers.location;
                        if (!location_1 || maxRedirects <= 0) {
                          reject(new Error("Redirect loop or missing Location header"));
                          return;
                        }
                        var redirectUrl = new URL(location_1, url).href;
                        resolve(downloadToFile(redirectUrl, dest, headers, maxRedirects - 1));
                        return;
                      }
                      if (!res.statusCode || res.statusCode >= 400) {
                        reject(
                          new Error(
                            "HTTP ".concat(
                              (_a = res.statusCode) !== null && _a !== void 0 ? _a : "?",
                              " downloading media",
                            ),
                          ),
                        );
                        return;
                      }
                      var total = 0;
                      var sniffChunks = [];
                      var sniffLen = 0;
                      var out = (0, node_fs_1.createWriteStream)(dest, { mode: 384 });
                      res.on("data", function (chunk) {
                        total += chunk.length;
                        if (sniffLen < 16384) {
                          sniffChunks.push(chunk);
                          sniffLen += chunk.length;
                        }
                        if (total > MAX_BYTES) {
                          req.destroy(new Error("Media exceeds 5MB limit"));
                        }
                      });
                      (0, promises_2.pipeline)(res, out)
                        .then(function () {
                          var sniffBuffer = Buffer.concat(sniffChunks, Math.min(sniffLen, 16384));
                          var rawHeader = res.headers["content-type"];
                          var headerMime = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;
                          resolve({
                            headerMime: headerMime,
                            sniffBuffer: sniffBuffer,
                            size: total,
                          });
                        })
                        .catch(reject);
                    },
                  );
                  req.on("error", reject);
                  req.end();
                })
                .catch(reject);
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function saveMediaSource(source_1, headers_1) {
  return __awaiter(this, arguments, void 0, function (source, headers, subdir) {
    var baseDir,
      dir,
      baseId,
      tempDest,
      _a,
      headerMime,
      sniffBuffer,
      size,
      mime_1,
      ext_1,
      id_1,
      finalDest,
      stat,
      buffer,
      mime,
      ext,
      id,
      dest;
    var _b, _c;
    if (subdir === void 0) {
      subdir = "";
    }
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          baseDir = resolveMediaDir();
          dir = subdir ? node_path_1.default.join(baseDir, subdir) : baseDir;
          return [4 /*yield*/, promises_1.default.mkdir(dir, { recursive: true, mode: 448 })];
        case 1:
          _d.sent();
          return [4 /*yield*/, cleanOldMedia()];
        case 2:
          _d.sent();
          baseId = node_crypto_1.default.randomUUID();
          if (!looksLikeUrl(source)) {
            return [3 /*break*/, 6];
          }
          tempDest = node_path_1.default.join(dir, "".concat(baseId, ".tmp"));
          return [4 /*yield*/, downloadToFile(source, tempDest, headers)];
        case 3:
          ((_a = _d.sent()),
            (headerMime = _a.headerMime),
            (sniffBuffer = _a.sniffBuffer),
            (size = _a.size));
          return [
            4 /*yield*/,
            (0, mime_js_1.detectMime)({
              buffer: sniffBuffer,
              headerMime: headerMime,
              filePath: source,
            }),
          ];
        case 4:
          mime_1 = _d.sent();
          ext_1 =
            (_b = (0, mime_js_1.extensionForMime)(mime_1)) !== null && _b !== void 0
              ? _b
              : node_path_1.default.extname(new URL(source).pathname);
          id_1 = ext_1 ? "".concat(baseId).concat(ext_1) : baseId;
          finalDest = node_path_1.default.join(dir, id_1);
          return [4 /*yield*/, promises_1.default.rename(tempDest, finalDest)];
        case 5:
          _d.sent();
          return [2 /*return*/, { id: id_1, path: finalDest, size: size, contentType: mime_1 }];
        case 6:
          return [4 /*yield*/, promises_1.default.stat(source)];
        case 7:
          stat = _d.sent();
          if (!stat.isFile()) {
            throw new Error("Media path is not a file");
          }
          if (stat.size > MAX_BYTES) {
            throw new Error("Media exceeds 5MB limit");
          }
          return [4 /*yield*/, promises_1.default.readFile(source)];
        case 8:
          buffer = _d.sent();
          return [4 /*yield*/, (0, mime_js_1.detectMime)({ buffer: buffer, filePath: source })];
        case 9:
          mime = _d.sent();
          ext =
            (_c = (0, mime_js_1.extensionForMime)(mime)) !== null && _c !== void 0
              ? _c
              : node_path_1.default.extname(source);
          id = ext ? "".concat(baseId).concat(ext) : baseId;
          dest = node_path_1.default.join(dir, id);
          return [4 /*yield*/, promises_1.default.writeFile(dest, buffer, { mode: 384 })];
        case 10:
          _d.sent();
          return [2 /*return*/, { id: id, path: dest, size: stat.size, contentType: mime }];
      }
    });
  });
}
function saveMediaBuffer(buffer_1, contentType_1) {
  return __awaiter(
    this,
    arguments,
    void 0,
    function (buffer, contentType, subdir, maxBytes, originalFilename) {
      var dir, uuid, headerExt, mime, ext, id, base, sanitized, dest;
      var _a, _b, _c;
      if (subdir === void 0) {
        subdir = "inbound";
      }
      if (maxBytes === void 0) {
        maxBytes = MAX_BYTES;
      }
      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            if (buffer.byteLength > maxBytes) {
              throw new Error(
                "Media exceeds ".concat((maxBytes / (1024 * 1024)).toFixed(0), "MB limit"),
              );
            }
            dir = node_path_1.default.join(resolveMediaDir(), subdir);
            return [4 /*yield*/, promises_1.default.mkdir(dir, { recursive: true, mode: 448 })];
          case 1:
            _d.sent();
            uuid = node_crypto_1.default.randomUUID();
            headerExt = (0, mime_js_1.extensionForMime)(
              (_b =
                (_a =
                  contentType === null || contentType === void 0
                    ? void 0
                    : contentType.split(";")[0]) === null || _a === void 0
                  ? void 0
                  : _a.trim()) !== null && _b !== void 0
                ? _b
                : undefined,
            );
            return [
              4 /*yield*/,
              (0, mime_js_1.detectMime)({ buffer: buffer, headerMime: contentType }),
            ];
          case 2:
            mime = _d.sent();
            ext =
              (_c =
                headerExt !== null && headerExt !== void 0
                  ? headerExt
                  : (0, mime_js_1.extensionForMime)(mime)) !== null && _c !== void 0
                ? _c
                : "";
            if (originalFilename) {
              base = node_path_1.default.parse(originalFilename).name;
              sanitized = sanitizeFilename(base);
              id = sanitized
                ? "".concat(sanitized, "---").concat(uuid).concat(ext)
                : "".concat(uuid).concat(ext);
            } else {
              // Legacy: just UUID
              id = ext ? "".concat(uuid).concat(ext) : uuid;
            }
            dest = node_path_1.default.join(dir, id);
            return [4 /*yield*/, promises_1.default.writeFile(dest, buffer, { mode: 384 })];
          case 3:
            _d.sent();
            return [
              2 /*return*/,
              { id: id, path: dest, size: buffer.byteLength, contentType: mime },
            ];
        }
      });
    },
  );
}
