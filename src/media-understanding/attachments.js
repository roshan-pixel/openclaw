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
exports.MediaAttachmentCache = void 0;
exports.normalizeAttachments = normalizeAttachments;
exports.resolveAttachmentKind = resolveAttachmentKind;
exports.isVideoAttachment = isVideoAttachment;
exports.isAudioAttachment = isAudioAttachment;
exports.isImageAttachment = isImageAttachment;
exports.selectAttachments = selectAttachments;
var node_crypto_1 = require("node:crypto");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var fetch_js_1 = require("../media/fetch.js");
var mime_js_1 = require("../media/mime.js");
var globals_js_1 = require("../globals.js");
var shared_js_1 = require("./providers/shared.js");
var errors_js_1 = require("./errors.js");
var DEFAULT_MAX_ATTACHMENTS = 1;
function normalizeAttachmentPath(raw) {
  var value = raw === null || raw === void 0 ? void 0 : raw.trim();
  if (!value) {
    return undefined;
  }
  if (value.startsWith("file://")) {
    try {
      return (0, node_url_1.fileURLToPath)(value);
    } catch (_a) {
      return undefined;
    }
  }
  return value;
}
function normalizeAttachments(ctx) {
  var _a, _b;
  var pathsFromArray = Array.isArray(ctx.MediaPaths) ? ctx.MediaPaths : undefined;
  var urlsFromArray = Array.isArray(ctx.MediaUrls) ? ctx.MediaUrls : undefined;
  var typesFromArray = Array.isArray(ctx.MediaTypes) ? ctx.MediaTypes : undefined;
  var resolveMime = function (count, index) {
    var typeHint =
      typesFromArray === null || typesFromArray === void 0 ? void 0 : typesFromArray[index];
    var trimmed = typeof typeHint === "string" ? typeHint.trim() : "";
    if (trimmed) {
      return trimmed;
    }
    return count === 1 ? ctx.MediaType : undefined;
  };
  if (pathsFromArray && pathsFromArray.length > 0) {
    var count_1 = pathsFromArray.length;
    var urls_1 = urlsFromArray && urlsFromArray.length > 0 ? urlsFromArray : undefined;
    return pathsFromArray
      .map(function (value, index) {
        var _a;
        return {
          path: (value === null || value === void 0 ? void 0 : value.trim()) || undefined,
          url:
            (_a = urls_1 === null || urls_1 === void 0 ? void 0 : urls_1[index]) !== null &&
            _a !== void 0
              ? _a
              : ctx.MediaUrl,
          mime: resolveMime(count_1, index),
          index: index,
        };
      })
      .filter(function (entry) {
        var _a, _b;
        return Boolean(
          ((_a = entry.path) === null || _a === void 0 ? void 0 : _a.trim()) ||
          ((_b = entry.url) === null || _b === void 0 ? void 0 : _b.trim()),
        );
      });
  }
  if (urlsFromArray && urlsFromArray.length > 0) {
    var count_2 = urlsFromArray.length;
    return urlsFromArray
      .map(function (value, index) {
        return {
          path: undefined,
          url: (value === null || value === void 0 ? void 0 : value.trim()) || undefined,
          mime: resolveMime(count_2, index),
          index: index,
        };
      })
      .filter(function (entry) {
        var _a;
        return Boolean((_a = entry.url) === null || _a === void 0 ? void 0 : _a.trim());
      });
  }
  var pathValue = (_a = ctx.MediaPath) === null || _a === void 0 ? void 0 : _a.trim();
  var url = (_b = ctx.MediaUrl) === null || _b === void 0 ? void 0 : _b.trim();
  if (!pathValue && !url) {
    return [];
  }
  return [
    {
      path: pathValue || undefined,
      url: url || undefined,
      mime: ctx.MediaType,
      index: 0,
    },
  ];
}
function resolveAttachmentKind(attachment) {
  var _a, _b;
  var kind = (0, mime_js_1.kindFromMime)(attachment.mime);
  if (kind === "image" || kind === "audio" || kind === "video") {
    return kind;
  }
  var ext = (0, mime_js_1.getFileExtension)(
    (_a = attachment.path) !== null && _a !== void 0 ? _a : attachment.url,
  );
  if (!ext) {
    return "unknown";
  }
  if ([".mp4", ".mov", ".mkv", ".webm", ".avi", ".m4v"].includes(ext)) {
    return "video";
  }
  if (
    (0, mime_js_1.isAudioFileName)(
      (_b = attachment.path) !== null && _b !== void 0 ? _b : attachment.url,
    )
  ) {
    return "audio";
  }
  if ([".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".tiff", ".tif"].includes(ext)) {
    return "image";
  }
  return "unknown";
}
function isVideoAttachment(attachment) {
  return resolveAttachmentKind(attachment) === "video";
}
function isAudioAttachment(attachment) {
  return resolveAttachmentKind(attachment) === "audio";
}
function isImageAttachment(attachment) {
  return resolveAttachmentKind(attachment) === "image";
}
function isAbortError(err) {
  if (!err) {
    return false;
  }
  if (err instanceof Error && err.name === "AbortError") {
    return true;
  }
  return false;
}
function resolveRequestUrl(input) {
  if (typeof input === "string") {
    return input;
  }
  if (input instanceof URL) {
    return input.toString();
  }
  return input.url;
}
function orderAttachments(attachments, prefer) {
  if (!prefer || prefer === "first") {
    return attachments;
  }
  if (prefer === "last") {
    return __spreadArray([], attachments, true).reverse();
  }
  if (prefer === "path") {
    var withPath = attachments.filter(function (item) {
      return item.path;
    });
    var withoutPath = attachments.filter(function (item) {
      return !item.path;
    });
    return __spreadArray(__spreadArray([], withPath, true), withoutPath, true);
  }
  if (prefer === "url") {
    var withUrl = attachments.filter(function (item) {
      return item.url;
    });
    var withoutUrl = attachments.filter(function (item) {
      return !item.url;
    });
    return __spreadArray(__spreadArray([], withUrl, true), withoutUrl, true);
  }
  return attachments;
}
function selectAttachments(params) {
  var _a, _b;
  var capability = params.capability,
    attachments = params.attachments,
    policy = params.policy;
  var matches = attachments.filter(function (item) {
    if (capability === "image") {
      return isImageAttachment(item);
    }
    if (capability === "audio") {
      return isAudioAttachment(item);
    }
    return isVideoAttachment(item);
  });
  if (matches.length === 0) {
    return [];
  }
  var ordered = orderAttachments(
    matches,
    policy === null || policy === void 0 ? void 0 : policy.prefer,
  );
  var mode =
    (_a = policy === null || policy === void 0 ? void 0 : policy.mode) !== null && _a !== void 0
      ? _a
      : "first";
  var maxAttachments =
    (_b = policy === null || policy === void 0 ? void 0 : policy.maxAttachments) !== null &&
    _b !== void 0
      ? _b
      : DEFAULT_MAX_ATTACHMENTS;
  if (mode === "all") {
    return ordered.slice(0, Math.max(1, maxAttachments));
  }
  return ordered.slice(0, 1);
}
var MediaAttachmentCache = /** @class */ (function () {
  function MediaAttachmentCache(attachments) {
    this.entries = new Map();
    this.attachments = attachments;
    for (var _i = 0, attachments_1 = attachments; _i < attachments_1.length; _i++) {
      var attachment = attachments_1[_i];
      this.entries.set(attachment.index, { attachment: attachment });
    }
  }
  MediaAttachmentCache.prototype.getBuffer = function (params) {
    return __awaiter(this, void 0, void 0, function () {
      var entry, size, buffer, _a, _b, url, fetchImpl, fetched, _c, _d, err_1;
      var _e, _f, _g, _h, _j, _k, _l, _m;
      return __generator(this, function (_o) {
        switch (_o.label) {
          case 0:
            return [4 /*yield*/, this.ensureEntry(params.attachmentIndex)];
          case 1:
            entry = _o.sent();
            if (entry.buffer) {
              if (entry.buffer.length > params.maxBytes) {
                throw new errors_js_1.MediaUnderstandingSkipError(
                  "maxBytes",
                  "Attachment "
                    .concat(params.attachmentIndex + 1, " exceeds maxBytes ")
                    .concat(params.maxBytes),
                );
              }
              return [
                2 /*return*/,
                {
                  buffer: entry.buffer,
                  mime: entry.bufferMime,
                  fileName:
                    (_e = entry.bufferFileName) !== null && _e !== void 0
                      ? _e
                      : "media-".concat(params.attachmentIndex + 1),
                  size: entry.buffer.length,
                },
              ];
            }
            if (!entry.resolvedPath) {
              return [3 /*break*/, 7];
            }
            return [4 /*yield*/, this.ensureLocalStat(entry)];
          case 2:
            size = _o.sent();
            if (!entry.resolvedPath) {
              return [3 /*break*/, 7];
            }
            if (size !== undefined && size > params.maxBytes) {
              throw new errors_js_1.MediaUnderstandingSkipError(
                "maxBytes",
                "Attachment "
                  .concat(params.attachmentIndex + 1, " exceeds maxBytes ")
                  .concat(params.maxBytes),
              );
            }
            return [4 /*yield*/, promises_1.default.readFile(entry.resolvedPath)];
          case 3:
            buffer = _o.sent();
            entry.buffer = buffer;
            _a = entry;
            if (
              !(
                (_g =
                  (_f = entry.bufferMime) !== null && _f !== void 0
                    ? _f
                    : entry.attachment.mime) !== null && _g !== void 0
              )
            ) {
              return [3 /*break*/, 4];
            }
            _b = _g;
            return [3 /*break*/, 6];
          case 4:
            return [
              4 /*yield*/,
              (0, mime_js_1.detectMime)({
                buffer: buffer,
                filePath: entry.resolvedPath,
              }),
            ];
          case 5:
            _b = _o.sent();
            _o.label = 6;
          case 6:
            _a.bufferMime = _b;
            entry.bufferFileName =
              node_path_1.default.basename(entry.resolvedPath) ||
              "media-".concat(params.attachmentIndex + 1);
            return [
              2 /*return*/,
              {
                buffer: buffer,
                mime: entry.bufferMime,
                fileName: entry.bufferFileName,
                size: buffer.length,
              },
            ];
          case 7:
            url = (_h = entry.attachment.url) === null || _h === void 0 ? void 0 : _h.trim();
            if (!url) {
              throw new errors_js_1.MediaUnderstandingSkipError(
                "empty",
                "Attachment ".concat(params.attachmentIndex + 1, " has no path or URL."),
              );
            }
            _o.label = 8;
          case 8:
            _o.trys.push([8, 13, , 14]);
            fetchImpl = function (input, init) {
              return (0, shared_js_1.fetchWithTimeout)(
                resolveRequestUrl(input),
                init !== null && init !== void 0 ? init : {},
                params.timeoutMs,
                fetch,
              );
            };
            return [
              4 /*yield*/,
              (0, fetch_js_1.fetchRemoteMedia)({
                url: url,
                fetchImpl: fetchImpl,
                maxBytes: params.maxBytes,
              }),
            ];
          case 9:
            fetched = _o.sent();
            entry.buffer = fetched.buffer;
            _c = entry;
            if (
              !(
                (_k =
                  (_j = entry.attachment.mime) !== null && _j !== void 0
                    ? _j
                    : fetched.contentType) !== null && _k !== void 0
              )
            ) {
              return [3 /*break*/, 10];
            }
            _d = _k;
            return [3 /*break*/, 12];
          case 10:
            return [
              4 /*yield*/,
              (0, mime_js_1.detectMime)({
                buffer: fetched.buffer,
                filePath: (_l = fetched.fileName) !== null && _l !== void 0 ? _l : url,
              }),
            ];
          case 11:
            _d = _o.sent();
            _o.label = 12;
          case 12:
            _c.bufferMime = _d;
            entry.bufferFileName =
              (_m = fetched.fileName) !== null && _m !== void 0
                ? _m
                : "media-".concat(params.attachmentIndex + 1);
            return [
              2 /*return*/,
              {
                buffer: fetched.buffer,
                mime: entry.bufferMime,
                fileName: entry.bufferFileName,
                size: fetched.buffer.length,
              },
            ];
          case 13:
            err_1 = _o.sent();
            if (err_1 instanceof fetch_js_1.MediaFetchError && err_1.code === "max_bytes") {
              throw new errors_js_1.MediaUnderstandingSkipError(
                "maxBytes",
                "Attachment "
                  .concat(params.attachmentIndex + 1, " exceeds maxBytes ")
                  .concat(params.maxBytes),
              );
            }
            if (isAbortError(err_1)) {
              throw new errors_js_1.MediaUnderstandingSkipError(
                "timeout",
                "Attachment ".concat(params.attachmentIndex + 1, " timed out while fetching."),
              );
            }
            throw err_1;
          case 14:
            return [2 /*return*/];
        }
      });
    });
  };
  MediaAttachmentCache.prototype.getPath = function (params) {
    return __awaiter(this, void 0, void 0, function () {
      var entry, size, maxBytes, bufferResult, extension, tmpPath;
      var _this = this;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [4 /*yield*/, this.ensureEntry(params.attachmentIndex)];
          case 1:
            entry = _b.sent();
            if (!entry.resolvedPath) {
              return [3 /*break*/, 4];
            }
            if (!params.maxBytes) {
              return [3 /*break*/, 3];
            }
            return [4 /*yield*/, this.ensureLocalStat(entry)];
          case 2:
            size = _b.sent();
            if (entry.resolvedPath) {
              if (size !== undefined && size > params.maxBytes) {
                throw new errors_js_1.MediaUnderstandingSkipError(
                  "maxBytes",
                  "Attachment "
                    .concat(params.attachmentIndex + 1, " exceeds maxBytes ")
                    .concat(params.maxBytes),
                );
              }
            }
            _b.label = 3;
          case 3:
            if (entry.resolvedPath) {
              return [2 /*return*/, { path: entry.resolvedPath }];
            }
            _b.label = 4;
          case 4:
            if (entry.tempPath) {
              if (params.maxBytes && entry.buffer && entry.buffer.length > params.maxBytes) {
                throw new errors_js_1.MediaUnderstandingSkipError(
                  "maxBytes",
                  "Attachment "
                    .concat(params.attachmentIndex + 1, " exceeds maxBytes ")
                    .concat(params.maxBytes),
                );
              }
              return [2 /*return*/, { path: entry.tempPath, cleanup: entry.tempCleanup }];
            }
            maxBytes =
              (_a = params.maxBytes) !== null && _a !== void 0 ? _a : Number.POSITIVE_INFINITY;
            return [
              4 /*yield*/,
              this.getBuffer({
                attachmentIndex: params.attachmentIndex,
                maxBytes: maxBytes,
                timeoutMs: params.timeoutMs,
              }),
            ];
          case 5:
            bufferResult = _b.sent();
            extension = node_path_1.default.extname(bufferResult.fileName || "") || "";
            tmpPath = node_path_1.default.join(
              node_os_1.default.tmpdir(),
              "openclaw-media-".concat(node_crypto_1.default.randomUUID()).concat(extension),
            );
            return [4 /*yield*/, promises_1.default.writeFile(tmpPath, bufferResult.buffer)];
          case 6:
            _b.sent();
            entry.tempPath = tmpPath;
            entry.tempCleanup = function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [
                        4 /*yield*/,
                        promises_1.default.unlink(tmpPath).catch(function () {}),
                      ];
                    case 1:
                      _a.sent();
                      return [2 /*return*/];
                  }
                });
              });
            };
            return [2 /*return*/, { path: tmpPath, cleanup: entry.tempCleanup }];
        }
      });
    });
  };
  MediaAttachmentCache.prototype.cleanup = function () {
    return __awaiter(this, void 0, void 0, function () {
      var cleanups, _i, _a, entry;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            cleanups = [];
            for (_i = 0, _a = this.entries.values(); _i < _a.length; _i++) {
              entry = _a[_i];
              if (entry.tempCleanup) {
                cleanups.push(Promise.resolve(entry.tempCleanup()));
                entry.tempCleanup = undefined;
              }
            }
            return [4 /*yield*/, Promise.all(cleanups)];
          case 1:
            _b.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  MediaAttachmentCache.prototype.ensureEntry = function (attachmentIndex) {
    return __awaiter(this, void 0, void 0, function () {
      var existing, attachment, entry;
      var _a;
      return __generator(this, function (_b) {
        existing = this.entries.get(attachmentIndex);
        if (existing) {
          if (!existing.resolvedPath) {
            existing.resolvedPath = this.resolveLocalPath(existing.attachment);
          }
          return [2 /*return*/, existing];
        }
        attachment =
          (_a = this.attachments.find(function (item) {
            return item.index === attachmentIndex;
          })) !== null && _a !== void 0
            ? _a
            : {
                index: attachmentIndex,
              };
        entry = {
          attachment: attachment,
          resolvedPath: this.resolveLocalPath(attachment),
        };
        this.entries.set(attachmentIndex, entry);
        return [2 /*return*/, entry];
      });
    });
  };
  MediaAttachmentCache.prototype.resolveLocalPath = function (attachment) {
    var rawPath = normalizeAttachmentPath(attachment.path);
    if (!rawPath) {
      return undefined;
    }
    return node_path_1.default.isAbsolute(rawPath) ? rawPath : node_path_1.default.resolve(rawPath);
  };
  MediaAttachmentCache.prototype.ensureLocalStat = function (entry) {
    return __awaiter(this, void 0, void 0, function () {
      var stat, err_2;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!entry.resolvedPath) {
              return [2 /*return*/, undefined];
            }
            if (entry.statSize !== undefined) {
              return [2 /*return*/, entry.statSize];
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, , 4]);
            return [4 /*yield*/, promises_1.default.stat(entry.resolvedPath)];
          case 2:
            stat = _a.sent();
            if (!stat.isFile()) {
              entry.resolvedPath = undefined;
              return [2 /*return*/, undefined];
            }
            entry.statSize = stat.size;
            return [2 /*return*/, stat.size];
          case 3:
            err_2 = _a.sent();
            entry.resolvedPath = undefined;
            if ((0, globals_js_1.shouldLogVerbose)()) {
              (0, globals_js_1.logVerbose)(
                "Failed to read attachment "
                  .concat(entry.attachment.index + 1, ": ")
                  .concat(String(err_2)),
              );
            }
            return [2 /*return*/, undefined];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  return MediaAttachmentCache;
})();
exports.MediaAttachmentCache = MediaAttachmentCache;
