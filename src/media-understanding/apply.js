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
exports.applyMediaUnderstanding = applyMediaUnderstanding;
var node_path_1 = require("node:path");
var inbound_context_js_1 = require("../auto-reply/reply/inbound-context.js");
var globals_js_1 = require("../globals.js");
var input_files_js_1 = require("../media/input-files.js");
var format_js_1 = require("./format.js");
var concurrency_js_1 = require("./concurrency.js");
var resolve_js_1 = require("./resolve.js");
var attachments_js_1 = require("./attachments.js");
var runner_js_1 = require("./runner.js");
var CAPABILITY_ORDER = ["image", "audio", "video"];
var EXTRA_TEXT_MIMES = [
  "application/xml",
  "text/xml",
  "application/x-yaml",
  "text/yaml",
  "application/yaml",
  "application/javascript",
  "text/javascript",
  "text/tab-separated-values",
];
var TEXT_EXT_MIME = new Map([
  [".csv", "text/csv"],
  [".tsv", "text/tab-separated-values"],
  [".txt", "text/plain"],
  [".md", "text/markdown"],
  [".log", "text/plain"],
  [".ini", "text/plain"],
  [".cfg", "text/plain"],
  [".conf", "text/plain"],
  [".env", "text/plain"],
  [".json", "application/json"],
  [".yaml", "text/yaml"],
  [".yml", "text/yaml"],
  [".xml", "application/xml"],
]);
var XML_ESCAPE_MAP = {
  "<": "&lt;",
  ">": "&gt;",
  "&": "&amp;",
  '"': "&quot;",
  "'": "&apos;",
};
/**
 * Escapes special XML characters in attribute values to prevent injection.
 */
function xmlEscapeAttr(value) {
  return value.replace(/[<>&"']/g, function (char) {
    var _a;
    return (_a = XML_ESCAPE_MAP[char]) !== null && _a !== void 0 ? _a : char;
  });
}
function resolveFileLimits(cfg) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
  var files =
    (_d =
      (_c =
        (_b = (_a = cfg.gateway) === null || _a === void 0 ? void 0 : _a.http) === null ||
        _b === void 0
          ? void 0
          : _b.endpoints) === null || _c === void 0
        ? void 0
        : _c.responses) === null || _d === void 0
      ? void 0
      : _d.files;
  return {
    allowUrl:
      (_e = files === null || files === void 0 ? void 0 : files.allowUrl) !== null && _e !== void 0
        ? _e
        : true,
    allowedMimes: (0, input_files_js_1.normalizeMimeList)(
      files === null || files === void 0 ? void 0 : files.allowedMimes,
      input_files_js_1.DEFAULT_INPUT_FILE_MIMES,
    ),
    maxBytes:
      (_f = files === null || files === void 0 ? void 0 : files.maxBytes) !== null && _f !== void 0
        ? _f
        : input_files_js_1.DEFAULT_INPUT_FILE_MAX_BYTES,
    maxChars:
      (_g = files === null || files === void 0 ? void 0 : files.maxChars) !== null && _g !== void 0
        ? _g
        : input_files_js_1.DEFAULT_INPUT_FILE_MAX_CHARS,
    maxRedirects:
      (_h = files === null || files === void 0 ? void 0 : files.maxRedirects) !== null &&
      _h !== void 0
        ? _h
        : input_files_js_1.DEFAULT_INPUT_MAX_REDIRECTS,
    timeoutMs:
      (_j = files === null || files === void 0 ? void 0 : files.timeoutMs) !== null && _j !== void 0
        ? _j
        : input_files_js_1.DEFAULT_INPUT_TIMEOUT_MS,
    pdf: {
      maxPages:
        (_l =
          (_k = files === null || files === void 0 ? void 0 : files.pdf) === null || _k === void 0
            ? void 0
            : _k.maxPages) !== null && _l !== void 0
          ? _l
          : input_files_js_1.DEFAULT_INPUT_PDF_MAX_PAGES,
      maxPixels:
        (_o =
          (_m = files === null || files === void 0 ? void 0 : files.pdf) === null || _m === void 0
            ? void 0
            : _m.maxPixels) !== null && _o !== void 0
          ? _o
          : input_files_js_1.DEFAULT_INPUT_PDF_MAX_PIXELS,
      minTextChars:
        (_q =
          (_p = files === null || files === void 0 ? void 0 : files.pdf) === null || _p === void 0
            ? void 0
            : _p.minTextChars) !== null && _q !== void 0
          ? _q
          : input_files_js_1.DEFAULT_INPUT_PDF_MIN_TEXT_CHARS,
    },
  };
}
function appendFileBlocks(body, blocks) {
  if (!blocks || blocks.length === 0) {
    return body !== null && body !== void 0 ? body : "";
  }
  var base = typeof body === "string" ? body.trim() : "";
  var suffix = blocks.join("\n\n").trim();
  if (!base) {
    return suffix;
  }
  return "".concat(base, "\n\n").concat(suffix).trim();
}
function resolveUtf16Charset(buffer) {
  if (!buffer || buffer.length < 2) {
    return undefined;
  }
  var b0 = buffer[0];
  var b1 = buffer[1];
  if (b0 === 0xff && b1 === 0xfe) {
    return "utf-16le";
  }
  if (b0 === 0xfe && b1 === 0xff) {
    return "utf-16be";
  }
  var sampleLen = Math.min(buffer.length, 2048);
  var zeroCount = 0;
  for (var i = 0; i < sampleLen; i += 1) {
    if (buffer[i] === 0) {
      zeroCount += 1;
    }
  }
  if (zeroCount / sampleLen > 0.2) {
    return "utf-16le";
  }
  return undefined;
}
function looksLikeUtf8Text(buffer) {
  if (!buffer || buffer.length === 0) {
    return false;
  }
  var sampleLen = Math.min(buffer.length, 4096);
  var printable = 0;
  var other = 0;
  for (var i = 0; i < sampleLen; i += 1) {
    var byte = buffer[i];
    if (byte === 0) {
      other += 1;
      continue;
    }
    if (byte === 9 || byte === 10 || byte === 13 || (byte >= 32 && byte <= 126)) {
      printable += 1;
    } else {
      other += 1;
    }
  }
  var total = printable + other;
  if (total === 0) {
    return false;
  }
  return printable / total > 0.85;
}
function decodeTextSample(buffer) {
  if (!buffer || buffer.length === 0) {
    return "";
  }
  var sample = buffer.subarray(0, Math.min(buffer.length, 8192));
  var utf16Charset = resolveUtf16Charset(sample);
  if (utf16Charset === "utf-16be") {
    var swapped = Buffer.alloc(sample.length);
    for (var i = 0; i + 1 < sample.length; i += 2) {
      swapped[i] = sample[i + 1];
      swapped[i + 1] = sample[i];
    }
    return new TextDecoder("utf-16le").decode(swapped);
  }
  if (utf16Charset === "utf-16le") {
    return new TextDecoder("utf-16le").decode(sample);
  }
  return new TextDecoder("utf-8").decode(sample);
}
function guessDelimitedMime(text) {
  var _a, _b, _c;
  if (!text) {
    return undefined;
  }
  var line = (_a = text.split(/\r?\n/)[0]) !== null && _a !== void 0 ? _a : "";
  var tabs = ((_b = line.match(/\t/g)) !== null && _b !== void 0 ? _b : []).length;
  var commas = ((_c = line.match(/,/g)) !== null && _c !== void 0 ? _c : []).length;
  if (commas > 0) {
    return "text/csv";
  }
  if (tabs > 0) {
    return "text/tab-separated-values";
  }
  return undefined;
}
function resolveTextMimeFromName(name) {
  if (!name) {
    return undefined;
  }
  var ext = node_path_1.default.extname(name).toLowerCase();
  return TEXT_EXT_MIME.get(ext);
}
function extractFileBlocks(params) {
  return __awaiter(this, void 0, void 0, function () {
    var attachments,
      cache,
      limits,
      blocks,
      _i,
      attachments_1,
      attachment,
      forcedTextMime,
      kind,
      bufferResult,
      err_1,
      nameHint,
      forcedTextMimeResolved,
      utf16Charset,
      textSample,
      textLike,
      guessedDelimited,
      textHint,
      rawMime,
      mimeType,
      allowedMimes,
      _a,
      EXTRA_TEXT_MIMES_1,
      extra,
      extracted,
      mediaType,
      err_2,
      text,
      blockText,
      safeName;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __generator(this, function (_l) {
      switch (_l.label) {
        case 0:
          ((attachments = params.attachments), (cache = params.cache), (limits = params.limits));
          if (!attachments || attachments.length === 0) {
            return [2 /*return*/, []];
          }
          blocks = [];
          ((_i = 0), (attachments_1 = attachments));
          _l.label = 1;
        case 1:
          if (!(_i < attachments_1.length)) {
            return [3 /*break*/, 11];
          }
          attachment = attachments_1[_i];
          if (!attachment) {
            return [3 /*break*/, 10];
          }
          forcedTextMime = resolveTextMimeFromName(
            (_c = (_b = attachment.path) !== null && _b !== void 0 ? _b : attachment.url) !==
              null && _c !== void 0
              ? _c
              : "",
          );
          kind = forcedTextMime
            ? "document"
            : (0, attachments_js_1.resolveAttachmentKind)(attachment);
          if (!forcedTextMime && (kind === "image" || kind === "video")) {
            return [3 /*break*/, 10];
          }
          if (!limits.allowUrl && attachment.url && !attachment.path) {
            if ((0, globals_js_1.shouldLogVerbose)()) {
              (0, globals_js_1.logVerbose)(
                "media: file attachment skipped (url disabled) index=".concat(attachment.index),
              );
            }
            return [3 /*break*/, 10];
          }
          bufferResult = void 0;
          _l.label = 2;
        case 2:
          _l.trys.push([2, 4, , 5]);
          return [
            4 /*yield*/,
            cache.getBuffer({
              attachmentIndex: attachment.index,
              maxBytes: limits.maxBytes,
              timeoutMs: limits.timeoutMs,
            }),
          ];
        case 3:
          bufferResult = _l.sent();
          return [3 /*break*/, 5];
        case 4:
          err_1 = _l.sent();
          if ((0, globals_js_1.shouldLogVerbose)()) {
            (0, globals_js_1.logVerbose)(
              "media: file attachment skipped (buffer): ".concat(String(err_1)),
            );
          }
          return [3 /*break*/, 10];
        case 5:
          nameHint =
            (_e =
              (_d =
                bufferResult === null || bufferResult === void 0
                  ? void 0
                  : bufferResult.fileName) !== null && _d !== void 0
                ? _d
                : attachment.path) !== null && _e !== void 0
              ? _e
              : attachment.url;
          forcedTextMimeResolved =
            forcedTextMime !== null && forcedTextMime !== void 0
              ? forcedTextMime
              : resolveTextMimeFromName(nameHint !== null && nameHint !== void 0 ? nameHint : "");
          utf16Charset = resolveUtf16Charset(
            bufferResult === null || bufferResult === void 0 ? void 0 : bufferResult.buffer,
          );
          textSample = decodeTextSample(
            bufferResult === null || bufferResult === void 0 ? void 0 : bufferResult.buffer,
          );
          textLike =
            Boolean(utf16Charset) ||
            looksLikeUtf8Text(
              bufferResult === null || bufferResult === void 0 ? void 0 : bufferResult.buffer,
            );
          if (!forcedTextMimeResolved && kind === "audio" && !textLike) {
            return [3 /*break*/, 10];
          }
          guessedDelimited = textLike ? guessDelimitedMime(textSample) : undefined;
          textHint =
            (_f =
              forcedTextMimeResolved !== null && forcedTextMimeResolved !== void 0
                ? forcedTextMimeResolved
                : guessedDelimited) !== null && _f !== void 0
              ? _f
              : textLike
                ? "text/plain"
                : undefined;
          rawMime =
            (_g = bufferResult === null || bufferResult === void 0 ? void 0 : bufferResult.mime) !==
              null && _g !== void 0
              ? _g
              : attachment.mime;
          mimeType =
            textHint !== null && textHint !== void 0
              ? textHint
              : (0, input_files_js_1.normalizeMimeType)(rawMime);
          // Log when MIME type is overridden from non-text to text for auditability
          if (textHint && rawMime && !rawMime.startsWith("text/")) {
            (0, globals_js_1.logVerbose)(
              'media: MIME override from "'
                .concat(rawMime, '" to "')
                .concat(textHint, '" for index=')
                .concat(attachment.index),
            );
          }
          if (!mimeType) {
            if ((0, globals_js_1.shouldLogVerbose)()) {
              (0, globals_js_1.logVerbose)(
                "media: file attachment skipped (unknown mime) index=".concat(attachment.index),
              );
            }
            return [3 /*break*/, 10];
          }
          allowedMimes = new Set(limits.allowedMimes);
          for (
            _a = 0, EXTRA_TEXT_MIMES_1 = EXTRA_TEXT_MIMES;
            _a < EXTRA_TEXT_MIMES_1.length;
            _a++
          ) {
            extra = EXTRA_TEXT_MIMES_1[_a];
            allowedMimes.add(extra);
          }
          if (mimeType.startsWith("text/")) {
            allowedMimes.add(mimeType);
          }
          if (!allowedMimes.has(mimeType)) {
            if ((0, globals_js_1.shouldLogVerbose)()) {
              (0, globals_js_1.logVerbose)(
                "media: file attachment skipped (unsupported mime "
                  .concat(mimeType, ") index=")
                  .concat(attachment.index),
              );
            }
            return [3 /*break*/, 10];
          }
          extracted = void 0;
          _l.label = 6;
        case 6:
          _l.trys.push([6, 8, , 9]);
          mediaType = utf16Charset
            ? "".concat(mimeType, "; charset=").concat(utf16Charset)
            : mimeType;
          return [
            4 /*yield*/,
            (0, input_files_js_1.extractFileContentFromSource)({
              source: {
                type: "base64",
                data: bufferResult.buffer.toString("base64"),
                mediaType: mediaType,
                filename: bufferResult.fileName,
              },
              limits: __assign(__assign({}, limits), { allowedMimes: allowedMimes }),
            }),
          ];
        case 7:
          extracted = _l.sent();
          return [3 /*break*/, 9];
        case 8:
          err_2 = _l.sent();
          if ((0, globals_js_1.shouldLogVerbose)()) {
            (0, globals_js_1.logVerbose)(
              "media: file attachment skipped (extract): ".concat(String(err_2)),
            );
          }
          return [3 /*break*/, 10];
        case 9:
          text =
            (_j =
              (_h = extracted === null || extracted === void 0 ? void 0 : extracted.text) ===
                null || _h === void 0
                ? void 0
                : _h.trim()) !== null && _j !== void 0
              ? _j
              : "";
          blockText = text;
          if (!blockText) {
            if (
              (extracted === null || extracted === void 0 ? void 0 : extracted.images) &&
              extracted.images.length > 0
            ) {
              blockText = "[PDF content rendered to images; images not forwarded to model]";
            } else {
              blockText = "[No extractable text]";
            }
          }
          safeName = (
            (_k = bufferResult.fileName) !== null && _k !== void 0
              ? _k
              : "file-".concat(attachment.index + 1)
          )
            .replace(/[\r\n\t]+/g, " ")
            .trim();
          // Escape XML special characters in attributes to prevent injection
          blocks.push(
            '<file name="'
              .concat(xmlEscapeAttr(safeName), '" mime="')
              .concat(xmlEscapeAttr(mimeType), '">\n')
              .concat(blockText, "\n</file>"),
          );
          _l.label = 10;
        case 10:
          _i++;
          return [3 /*break*/, 1];
        case 11:
          return [2 /*return*/, blocks];
      }
    });
  });
}
function applyMediaUnderstanding(params) {
  return __awaiter(this, void 0, void 0, function () {
    var ctx,
      cfg,
      commandCandidates,
      originalUserText,
      attachments,
      providerRegistry,
      cache,
      fileBlocks,
      tasks,
      results,
      outputs,
      decisions,
      _i,
      results_1,
      entry,
      _a,
      _b,
      output,
      audioOutputs,
      transcript;
    var _this = this;
    var _c, _d, _e;
    return __generator(this, function (_f) {
      switch (_f.label) {
        case 0:
          ((ctx = params.ctx), (cfg = params.cfg));
          commandCandidates = [ctx.CommandBody, ctx.RawBody, ctx.Body];
          originalUserText =
            (_c = commandCandidates
              .map(function (value) {
                return (0, format_js_1.extractMediaUserText)(value);
              })
              .find(function (value) {
                return value && value.trim();
              })) !== null && _c !== void 0
              ? _c
              : undefined;
          attachments = (0, runner_js_1.normalizeMediaAttachments)(ctx);
          providerRegistry = (0, runner_js_1.buildProviderRegistry)(params.providers);
          cache = (0, runner_js_1.createMediaAttachmentCache)(attachments);
          _f.label = 1;
        case 1:
          _f.trys.push([1, , 4, 6]);
          return [
            4 /*yield*/,
            extractFileBlocks({
              attachments: attachments,
              cache: cache,
              limits: resolveFileLimits(cfg),
            }),
          ];
        case 2:
          fileBlocks = _f.sent();
          tasks = CAPABILITY_ORDER.map(function (capability) {
            return function () {
              return __awaiter(_this, void 0, void 0, function () {
                var config;
                var _a, _b;
                return __generator(this, function (_c) {
                  switch (_c.label) {
                    case 0:
                      config =
                        (_b = (_a = cfg.tools) === null || _a === void 0 ? void 0 : _a.media) ===
                          null || _b === void 0
                          ? void 0
                          : _b[capability];
                      return [
                        4 /*yield*/,
                        (0, runner_js_1.runCapability)({
                          capability: capability,
                          cfg: cfg,
                          ctx: ctx,
                          attachments: cache,
                          media: attachments,
                          agentDir: params.agentDir,
                          providerRegistry: providerRegistry,
                          config: config,
                          activeModel: params.activeModel,
                        }),
                      ];
                    case 1:
                      return [2 /*return*/, _c.sent()];
                  }
                });
              });
            };
          });
          return [
            4 /*yield*/,
            (0, concurrency_js_1.runWithConcurrency)(
              tasks,
              (0, resolve_js_1.resolveConcurrency)(cfg),
            ),
          ];
        case 3:
          results = _f.sent();
          outputs = [];
          decisions = [];
          for (_i = 0, results_1 = results; _i < results_1.length; _i++) {
            entry = results_1[_i];
            if (!entry) {
              continue;
            }
            for (_a = 0, _b = entry.outputs; _a < _b.length; _a++) {
              output = _b[_a];
              outputs.push(output);
            }
            decisions.push(entry.decision);
          }
          if (decisions.length > 0) {
            ctx.MediaUnderstandingDecisions = __spreadArray(
              __spreadArray(
                [],
                (_d = ctx.MediaUnderstandingDecisions) !== null && _d !== void 0 ? _d : [],
                true,
              ),
              decisions,
              true,
            );
          }
          if (outputs.length > 0) {
            ctx.Body = (0, format_js_1.formatMediaUnderstandingBody)({
              body: ctx.Body,
              outputs: outputs,
            });
            audioOutputs = outputs.filter(function (output) {
              return output.kind === "audio.transcription";
            });
            if (audioOutputs.length > 0) {
              transcript = (0, format_js_1.formatAudioTranscripts)(audioOutputs);
              ctx.Transcript = transcript;
              if (originalUserText) {
                ctx.CommandBody = originalUserText;
                ctx.RawBody = originalUserText;
              } else {
                ctx.CommandBody = transcript;
                ctx.RawBody = transcript;
              }
            } else if (originalUserText) {
              ctx.CommandBody = originalUserText;
              ctx.RawBody = originalUserText;
            }
            ctx.MediaUnderstanding = __spreadArray(
              __spreadArray(
                [],
                (_e = ctx.MediaUnderstanding) !== null && _e !== void 0 ? _e : [],
                true,
              ),
              outputs,
              true,
            );
          }
          if (fileBlocks.length > 0) {
            ctx.Body = appendFileBlocks(ctx.Body, fileBlocks);
          }
          if (outputs.length > 0 || fileBlocks.length > 0) {
            (0, inbound_context_js_1.finalizeInboundContext)(ctx, {
              forceBodyForAgent: true,
              forceBodyForCommands: outputs.length > 0,
            });
          }
          return [
            2 /*return*/,
            {
              outputs: outputs,
              decisions: decisions,
              appliedImage: outputs.some(function (output) {
                return output.kind === "image.description";
              }),
              appliedAudio: outputs.some(function (output) {
                return output.kind === "audio.transcription";
              }),
              appliedVideo: outputs.some(function (output) {
                return output.kind === "video.description";
              }),
              appliedFile: fileBlocks.length > 0,
            },
          ];
        case 4:
          return [4 /*yield*/, cache.cleanup()];
        case 5:
          _f.sent();
          return [7 /*endfinally*/];
        case 6:
          return [2 /*return*/];
      }
    });
  });
}
