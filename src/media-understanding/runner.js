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
exports.buildProviderRegistry = buildProviderRegistry;
exports.normalizeMediaAttachments = normalizeMediaAttachments;
exports.createMediaAttachmentCache = createMediaAttachmentCache;
exports.resolveAutoImageModel = resolveAutoImageModel;
exports.runCapability = runCapability;
var node_fs_1 = require("node:fs");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var model_catalog_js_1 = require("../agents/model-catalog.js");
var templating_js_1 = require("../auto-reply/templating.js");
var model_auth_js_1 = require("../agents/model-auth.js");
var globals_js_1 = require("../globals.js");
var exec_js_1 = require("../process/exec.js");
var attachments_js_1 = require("./attachments.js");
var defaults_js_1 = require("./defaults.js");
var errors_js_1 = require("./errors.js");
var resolve_js_1 = require("./resolve.js");
var index_js_1 = require("./providers/index.js");
var image_js_1 = require("./providers/image.js");
var video_js_1 = require("./video.js");
var AUTO_AUDIO_KEY_PROVIDERS = ["openai", "groq", "deepgram", "google"];
var AUTO_IMAGE_KEY_PROVIDERS = ["openai", "anthropic", "google", "minimax"];
var AUTO_VIDEO_KEY_PROVIDERS = ["google"];
var DEFAULT_IMAGE_MODELS = {
  openai: "gpt-5-mini",
  anthropic: "claude-opus-4-5",
  google: "gemini-3-flash-preview",
  minimax: "MiniMax-VL-01",
};
function buildProviderRegistry(overrides) {
  return (0, index_js_1.buildMediaUnderstandingRegistry)(overrides);
}
function normalizeMediaAttachments(ctx) {
  return (0, attachments_js_1.normalizeAttachments)(ctx);
}
function createMediaAttachmentCache(attachments) {
  return new attachments_js_1.MediaAttachmentCache(attachments);
}
var binaryCache = new Map();
var geminiProbeCache = new Map();
function expandHomeDir(value) {
  if (!value.startsWith("~")) {
    return value;
  }
  var home = node_os_1.default.homedir();
  if (value === "~") {
    return home;
  }
  if (value.startsWith("~/")) {
    return node_path_1.default.join(home, value.slice(2));
  }
  return value;
}
function hasPathSeparator(value) {
  return value.includes("/") || value.includes("\\");
}
function candidateBinaryNames(name) {
  var _a;
  if (process.platform !== "win32") {
    return [name];
  }
  var ext = node_path_1.default.extname(name);
  if (ext) {
    return [name];
  }
  var pathext = ((_a = process.env.PATHEXT) !== null && _a !== void 0 ? _a : ".EXE;.CMD;.BAT;.COM")
    .split(";")
    .map(function (item) {
      return item.trim();
    })
    .filter(Boolean)
    .map(function (item) {
      return item.startsWith(".") ? item : ".".concat(item);
    });
  var unique = Array.from(new Set(pathext));
  return __spreadArray(
    [name],
    unique.map(function (item) {
      return "".concat(name).concat(item);
    }),
    true,
  );
}
function isExecutable(filePath) {
  return __awaiter(this, void 0, void 0, function () {
    var stat, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 3, , 4]);
          return [4 /*yield*/, promises_1.default.stat(filePath)];
        case 1:
          stat = _b.sent();
          if (!stat.isFile()) {
            return [2 /*return*/, false];
          }
          if (process.platform === "win32") {
            return [2 /*return*/, true];
          }
          return [4 /*yield*/, promises_1.default.access(filePath, node_fs_1.constants.X_OK)];
        case 2:
          _b.sent();
          return [2 /*return*/, true];
        case 3:
          _a = _b.sent();
          return [2 /*return*/, false];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function findBinary(name) {
  return __awaiter(this, void 0, void 0, function () {
    var cached, resolved;
    var _this = this;
    return __generator(this, function (_a) {
      cached = binaryCache.get(name);
      if (cached) {
        return [2 /*return*/, cached];
      }
      resolved = (function () {
        return __awaiter(_this, void 0, void 0, function () {
          var direct,
            _i,
            _a,
            candidate,
            searchName,
            pathEntries,
            candidates,
            _b,
            pathEntries_1,
            entryRaw,
            entry,
            _c,
            candidates_1,
            candidate,
            fullPath;
          var _d;
          return __generator(this, function (_e) {
            switch (_e.label) {
              case 0:
                direct = expandHomeDir(name.trim());
                if (!(direct && hasPathSeparator(direct))) {
                  return [3 /*break*/, 4];
                }
                ((_i = 0), (_a = candidateBinaryNames(direct)));
                _e.label = 1;
              case 1:
                if (!(_i < _a.length)) {
                  return [3 /*break*/, 4];
                }
                candidate = _a[_i];
                return [4 /*yield*/, isExecutable(candidate)];
              case 2:
                if (_e.sent()) {
                  return [2 /*return*/, candidate];
                }
                _e.label = 3;
              case 3:
                _i++;
                return [3 /*break*/, 1];
              case 4:
                searchName = name.trim();
                if (!searchName) {
                  return [2 /*return*/, null];
                }
                pathEntries = ((_d = process.env.PATH) !== null && _d !== void 0 ? _d : "").split(
                  node_path_1.default.delimiter,
                );
                candidates = candidateBinaryNames(searchName);
                ((_b = 0), (pathEntries_1 = pathEntries));
                _e.label = 5;
              case 5:
                if (!(_b < pathEntries_1.length)) {
                  return [3 /*break*/, 10];
                }
                entryRaw = pathEntries_1[_b];
                entry = expandHomeDir(entryRaw.trim().replace(/^"(.*)"$/, "$1"));
                if (!entry) {
                  return [3 /*break*/, 9];
                }
                ((_c = 0), (candidates_1 = candidates));
                _e.label = 6;
              case 6:
                if (!(_c < candidates_1.length)) {
                  return [3 /*break*/, 9];
                }
                candidate = candidates_1[_c];
                fullPath = node_path_1.default.join(entry, candidate);
                return [4 /*yield*/, isExecutable(fullPath)];
              case 7:
                if (_e.sent()) {
                  return [2 /*return*/, fullPath];
                }
                _e.label = 8;
              case 8:
                _c++;
                return [3 /*break*/, 6];
              case 9:
                _b++;
                return [3 /*break*/, 5];
              case 10:
                return [2 /*return*/, null];
            }
          });
        });
      })();
      binaryCache.set(name, resolved);
      return [2 /*return*/, resolved];
    });
  });
}
function hasBinary(name) {
  return __awaiter(this, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _a = Boolean;
          return [4 /*yield*/, findBinary(name)];
        case 1:
          return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
      }
    });
  });
}
function fileExists(filePath) {
  return __awaiter(this, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (!filePath) {
            return [2 /*return*/, false];
          }
          _b.label = 1;
        case 1:
          _b.trys.push([1, 3, , 4]);
          return [4 /*yield*/, promises_1.default.stat(filePath)];
        case 2:
          _b.sent();
          return [2 /*return*/, true];
        case 3:
          _a = _b.sent();
          return [2 /*return*/, false];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function extractLastJsonObject(raw) {
  var trimmed = raw.trim();
  var start = trimmed.lastIndexOf("{");
  if (start === -1) {
    return null;
  }
  var slice = trimmed.slice(start);
  try {
    return JSON.parse(slice);
  } catch (_a) {
    return null;
  }
}
function extractGeminiResponse(raw) {
  var payload = extractLastJsonObject(raw);
  if (!payload || typeof payload !== "object") {
    return null;
  }
  var response = payload.response;
  if (typeof response !== "string") {
    return null;
  }
  var trimmed = response.trim();
  return trimmed || null;
}
function extractSherpaOnnxText(raw) {
  var _a;
  var tryParse = function (value) {
    var trimmed = value.trim();
    if (!trimmed) {
      return null;
    }
    var head = trimmed[0];
    if (head !== "{" && head !== '"') {
      return null;
    }
    try {
      var parsed = JSON.parse(trimmed);
      if (typeof parsed === "string") {
        return tryParse(parsed);
      }
      if (parsed && typeof parsed === "object") {
        var text = parsed.text;
        if (typeof text === "string" && text.trim()) {
          return text.trim();
        }
      }
    } catch (_a) {}
    return null;
  };
  var direct = tryParse(raw);
  if (direct) {
    return direct;
  }
  var lines = raw
    .split("\n")
    .map(function (line) {
      return line.trim();
    })
    .filter(Boolean);
  for (var i = lines.length - 1; i >= 0; i -= 1) {
    var parsed = tryParse((_a = lines[i]) !== null && _a !== void 0 ? _a : "");
    if (parsed) {
      return parsed;
    }
  }
  return null;
}
function probeGeminiCli() {
  return __awaiter(this, void 0, void 0, function () {
    var cached, resolved;
    var _this = this;
    return __generator(this, function (_a) {
      cached = geminiProbeCache.get("gemini");
      if (cached) {
        return [2 /*return*/, cached];
      }
      resolved = (function () {
        return __awaiter(_this, void 0, void 0, function () {
          var stdout, _a;
          var _b;
          return __generator(this, function (_c) {
            switch (_c.label) {
              case 0:
                return [4 /*yield*/, hasBinary("gemini")];
              case 1:
                if (!_c.sent()) {
                  return [2 /*return*/, false];
                }
                _c.label = 2;
              case 2:
                _c.trys.push([2, 4, , 5]);
                return [
                  4 /*yield*/,
                  (0, exec_js_1.runExec)("gemini", ["--output-format", "json", "ok"], {
                    timeoutMs: 8000,
                  }),
                ];
              case 3:
                stdout = _c.sent().stdout;
                return [
                  2 /*return*/,
                  Boolean(
                    (_b = extractGeminiResponse(stdout)) !== null && _b !== void 0
                      ? _b
                      : stdout.toLowerCase().includes("ok"),
                  ),
                ];
              case 4:
                _a = _c.sent();
                return [2 /*return*/, false];
              case 5:
                return [2 /*return*/];
            }
          });
        });
      })();
      geminiProbeCache.set("gemini", resolved);
      return [2 /*return*/, resolved];
    });
  });
}
function resolveLocalWhisperCppEntry() {
  return __awaiter(this, void 0, void 0, function () {
    var envModel, defaultModel, modelPath, _a;
    var _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          return [4 /*yield*/, hasBinary("whisper-cli")];
        case 1:
          if (!_c.sent()) {
            return [2 /*return*/, null];
          }
          envModel =
            (_b = process.env.WHISPER_CPP_MODEL) === null || _b === void 0 ? void 0 : _b.trim();
          defaultModel = "/opt/homebrew/share/whisper-cpp/for-tests-ggml-tiny.bin";
          _a = envModel;
          if (!_a) {
            return [3 /*break*/, 3];
          }
          return [4 /*yield*/, fileExists(envModel)];
        case 2:
          _a = _c.sent();
          _c.label = 3;
        case 3:
          modelPath = _a ? envModel : defaultModel;
          return [4 /*yield*/, fileExists(modelPath)];
        case 4:
          if (!_c.sent()) {
            return [2 /*return*/, null];
          }
          return [
            2 /*return*/,
            {
              type: "cli",
              command: "whisper-cli",
              args: [
                "-m",
                modelPath,
                "-otxt",
                "-of",
                "{{OutputBase}}",
                "-np",
                "-nt",
                "{{MediaPath}}",
              ],
            },
          ];
      }
    });
  });
}
function resolveLocalWhisperEntry() {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, hasBinary("whisper")];
        case 1:
          if (!_a.sent()) {
            return [2 /*return*/, null];
          }
          return [
            2 /*return*/,
            {
              type: "cli",
              command: "whisper",
              args: [
                "--model",
                "turbo",
                "--output_format",
                "txt",
                "--output_dir",
                "{{OutputDir}}",
                "--verbose",
                "False",
                "{{MediaPath}}",
              ],
            },
          ];
      }
    });
  });
}
function resolveSherpaOnnxEntry() {
  return __awaiter(this, void 0, void 0, function () {
    var modelDir, tokens, encoder, decoder, joiner;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, hasBinary("sherpa-onnx-offline")];
        case 1:
          if (!_b.sent()) {
            return [2 /*return*/, null];
          }
          modelDir =
            (_a = process.env.SHERPA_ONNX_MODEL_DIR) === null || _a === void 0 ? void 0 : _a.trim();
          if (!modelDir) {
            return [2 /*return*/, null];
          }
          tokens = node_path_1.default.join(modelDir, "tokens.txt");
          encoder = node_path_1.default.join(modelDir, "encoder.onnx");
          decoder = node_path_1.default.join(modelDir, "decoder.onnx");
          joiner = node_path_1.default.join(modelDir, "joiner.onnx");
          return [4 /*yield*/, fileExists(tokens)];
        case 2:
          if (!_b.sent()) {
            return [2 /*return*/, null];
          }
          return [4 /*yield*/, fileExists(encoder)];
        case 3:
          if (!_b.sent()) {
            return [2 /*return*/, null];
          }
          return [4 /*yield*/, fileExists(decoder)];
        case 4:
          if (!_b.sent()) {
            return [2 /*return*/, null];
          }
          return [4 /*yield*/, fileExists(joiner)];
        case 5:
          if (!_b.sent()) {
            return [2 /*return*/, null];
          }
          return [
            2 /*return*/,
            {
              type: "cli",
              command: "sherpa-onnx-offline",
              args: [
                "--tokens=".concat(tokens),
                "--encoder=".concat(encoder),
                "--decoder=".concat(decoder),
                "--joiner=".concat(joiner),
                "{{MediaPath}}",
              ],
            },
          ];
      }
    });
  });
}
function resolveLocalAudioEntry() {
  return __awaiter(this, void 0, void 0, function () {
    var sherpa, whisperCpp;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, resolveSherpaOnnxEntry()];
        case 1:
          sherpa = _a.sent();
          if (sherpa) {
            return [2 /*return*/, sherpa];
          }
          return [4 /*yield*/, resolveLocalWhisperCppEntry()];
        case 2:
          whisperCpp = _a.sent();
          if (whisperCpp) {
            return [2 /*return*/, whisperCpp];
          }
          return [4 /*yield*/, resolveLocalWhisperEntry()];
        case 3:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function resolveGeminiCliEntry(_capability) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, probeGeminiCli()];
        case 1:
          if (!_a.sent()) {
            return [2 /*return*/, null];
          }
          return [
            2 /*return*/,
            {
              type: "cli",
              command: "gemini",
              args: [
                "--output-format",
                "json",
                "--allowed-tools",
                "read_many_files",
                "--include-directories",
                "{{MediaDir}}",
                "{{Prompt}}",
                "Use read_many_files to read {{MediaPath}} and respond with only the text output.",
              ],
            },
          ];
      }
    });
  });
}
function resolveKeyEntry(params) {
  return __awaiter(this, void 0, void 0, function () {
    var cfg,
      agentDir,
      providerRegistry,
      capability,
      checkProvider,
      activeProvider_1,
      activeEntry,
      _i,
      AUTO_IMAGE_KEY_PROVIDERS_1,
      providerId,
      model,
      entry,
      activeProvider_2,
      activeEntry,
      _a,
      AUTO_VIDEO_KEY_PROVIDERS_1,
      providerId,
      entry,
      activeProvider,
      activeEntry,
      _b,
      AUTO_AUDIO_KEY_PROVIDERS_1,
      providerId,
      entry;
    var _this = this;
    var _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __generator(this, function (_m) {
      switch (_m.label) {
        case 0:
          ((cfg = params.cfg),
            (agentDir = params.agentDir),
            (providerRegistry = params.providerRegistry),
            (capability = params.capability));
          checkProvider = function (providerId, model) {
            return __awaiter(_this, void 0, void 0, function () {
              var provider, _a;
              return __generator(this, function (_b) {
                switch (_b.label) {
                  case 0:
                    provider = (0, index_js_1.getMediaUnderstandingProvider)(
                      providerId,
                      providerRegistry,
                    );
                    if (!provider) {
                      return [2 /*return*/, null];
                    }
                    if (capability === "audio" && !provider.transcribeAudio) {
                      return [2 /*return*/, null];
                    }
                    if (capability === "image" && !provider.describeImage) {
                      return [2 /*return*/, null];
                    }
                    if (capability === "video" && !provider.describeVideo) {
                      return [2 /*return*/, null];
                    }
                    _b.label = 1;
                  case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [
                      4 /*yield*/,
                      (0, model_auth_js_1.resolveApiKeyForProvider)({
                        provider: providerId,
                        cfg: cfg,
                        agentDir: agentDir,
                      }),
                    ];
                  case 2:
                    _b.sent();
                    return [2 /*return*/, { type: "provider", provider: providerId, model: model }];
                  case 3:
                    _a = _b.sent();
                    return [2 /*return*/, null];
                  case 4:
                    return [2 /*return*/];
                }
              });
            });
          };
          if (!(capability === "image")) {
            return [3 /*break*/, 7];
          }
          activeProvider_1 =
            (_d = (_c = params.activeModel) === null || _c === void 0 ? void 0 : _c.provider) ===
              null || _d === void 0
              ? void 0
              : _d.trim();
          if (!activeProvider_1) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            checkProvider(
              activeProvider_1,
              (_e = params.activeModel) === null || _e === void 0 ? void 0 : _e.model,
            ),
          ];
        case 1:
          activeEntry = _m.sent();
          if (activeEntry) {
            return [2 /*return*/, activeEntry];
          }
          _m.label = 2;
        case 2:
          ((_i = 0), (AUTO_IMAGE_KEY_PROVIDERS_1 = AUTO_IMAGE_KEY_PROVIDERS));
          _m.label = 3;
        case 3:
          if (!(_i < AUTO_IMAGE_KEY_PROVIDERS_1.length)) {
            return [3 /*break*/, 6];
          }
          providerId = AUTO_IMAGE_KEY_PROVIDERS_1[_i];
          model = DEFAULT_IMAGE_MODELS[providerId];
          return [4 /*yield*/, checkProvider(providerId, model)];
        case 4:
          entry = _m.sent();
          if (entry) {
            return [2 /*return*/, entry];
          }
          _m.label = 5;
        case 5:
          _i++;
          return [3 /*break*/, 3];
        case 6:
          return [2 /*return*/, null];
        case 7:
          if (!(capability === "video")) {
            return [3 /*break*/, 14];
          }
          activeProvider_2 =
            (_g = (_f = params.activeModel) === null || _f === void 0 ? void 0 : _f.provider) ===
              null || _g === void 0
              ? void 0
              : _g.trim();
          if (!activeProvider_2) {
            return [3 /*break*/, 9];
          }
          return [
            4 /*yield*/,
            checkProvider(
              activeProvider_2,
              (_h = params.activeModel) === null || _h === void 0 ? void 0 : _h.model,
            ),
          ];
        case 8:
          activeEntry = _m.sent();
          if (activeEntry) {
            return [2 /*return*/, activeEntry];
          }
          _m.label = 9;
        case 9:
          ((_a = 0), (AUTO_VIDEO_KEY_PROVIDERS_1 = AUTO_VIDEO_KEY_PROVIDERS));
          _m.label = 10;
        case 10:
          if (!(_a < AUTO_VIDEO_KEY_PROVIDERS_1.length)) {
            return [3 /*break*/, 13];
          }
          providerId = AUTO_VIDEO_KEY_PROVIDERS_1[_a];
          return [4 /*yield*/, checkProvider(providerId, undefined)];
        case 11:
          entry = _m.sent();
          if (entry) {
            return [2 /*return*/, entry];
          }
          _m.label = 12;
        case 12:
          _a++;
          return [3 /*break*/, 10];
        case 13:
          return [2 /*return*/, null];
        case 14:
          activeProvider =
            (_k = (_j = params.activeModel) === null || _j === void 0 ? void 0 : _j.provider) ===
              null || _k === void 0
              ? void 0
              : _k.trim();
          if (!activeProvider) {
            return [3 /*break*/, 16];
          }
          return [
            4 /*yield*/,
            checkProvider(
              activeProvider,
              (_l = params.activeModel) === null || _l === void 0 ? void 0 : _l.model,
            ),
          ];
        case 15:
          activeEntry = _m.sent();
          if (activeEntry) {
            return [2 /*return*/, activeEntry];
          }
          _m.label = 16;
        case 16:
          ((_b = 0), (AUTO_AUDIO_KEY_PROVIDERS_1 = AUTO_AUDIO_KEY_PROVIDERS));
          _m.label = 17;
        case 17:
          if (!(_b < AUTO_AUDIO_KEY_PROVIDERS_1.length)) {
            return [3 /*break*/, 20];
          }
          providerId = AUTO_AUDIO_KEY_PROVIDERS_1[_b];
          return [4 /*yield*/, checkProvider(providerId, undefined)];
        case 18:
          entry = _m.sent();
          if (entry) {
            return [2 /*return*/, entry];
          }
          _m.label = 19;
        case 19:
          _b++;
          return [3 /*break*/, 17];
        case 20:
          return [2 /*return*/, null];
      }
    });
  });
}
function resolveAutoEntries(params) {
  return __awaiter(this, void 0, void 0, function () {
    var activeEntry, localAudio, gemini, keys;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, resolveActiveModelEntry(params)];
        case 1:
          activeEntry = _a.sent();
          if (activeEntry) {
            return [2 /*return*/, [activeEntry]];
          }
          if (!(params.capability === "audio")) {
            return [3 /*break*/, 3];
          }
          return [4 /*yield*/, resolveLocalAudioEntry()];
        case 2:
          localAudio = _a.sent();
          if (localAudio) {
            return [2 /*return*/, [localAudio]];
          }
          _a.label = 3;
        case 3:
          return [4 /*yield*/, resolveGeminiCliEntry(params.capability)];
        case 4:
          gemini = _a.sent();
          if (gemini) {
            return [2 /*return*/, [gemini]];
          }
          return [4 /*yield*/, resolveKeyEntry(params)];
        case 5:
          keys = _a.sent();
          if (keys) {
            return [2 /*return*/, [keys]];
          }
          return [2 /*return*/, []];
      }
    });
  });
}
function resolveAutoImageModel(params) {
  return __awaiter(this, void 0, void 0, function () {
    var providerRegistry, toActive, activeEntry, resolvedActive, keyEntry;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          providerRegistry = buildProviderRegistry();
          toActive = function (entry) {
            var _a;
            if (!entry || entry.type === "cli") {
              return null;
            }
            var provider = entry.provider;
            if (!provider) {
              return null;
            }
            var model =
              (_a = entry.model) !== null && _a !== void 0 ? _a : DEFAULT_IMAGE_MODELS[provider];
            if (!model) {
              return null;
            }
            return { provider: provider, model: model };
          };
          return [
            4 /*yield*/,
            resolveActiveModelEntry({
              cfg: params.cfg,
              agentDir: params.agentDir,
              providerRegistry: providerRegistry,
              capability: "image",
              activeModel: params.activeModel,
            }),
          ];
        case 1:
          activeEntry = _a.sent();
          resolvedActive = toActive(activeEntry);
          if (resolvedActive) {
            return [2 /*return*/, resolvedActive];
          }
          return [
            4 /*yield*/,
            resolveKeyEntry({
              cfg: params.cfg,
              agentDir: params.agentDir,
              providerRegistry: providerRegistry,
              capability: "image",
              activeModel: params.activeModel,
            }),
          ];
        case 2:
          keyEntry = _a.sent();
          return [2 /*return*/, toActive(keyEntry)];
      }
    });
  });
}
function resolveActiveModelEntry(params) {
  return __awaiter(this, void 0, void 0, function () {
    var activeProviderRaw, providerId, provider, _a;
    var _b, _c, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          activeProviderRaw =
            (_c = (_b = params.activeModel) === null || _b === void 0 ? void 0 : _b.provider) ===
              null || _c === void 0
              ? void 0
              : _c.trim();
          if (!activeProviderRaw) {
            return [2 /*return*/, null];
          }
          providerId = (0, index_js_1.normalizeMediaProviderId)(activeProviderRaw);
          if (!providerId) {
            return [2 /*return*/, null];
          }
          provider = (0, index_js_1.getMediaUnderstandingProvider)(
            providerId,
            params.providerRegistry,
          );
          if (!provider) {
            return [2 /*return*/, null];
          }
          if (params.capability === "audio" && !provider.transcribeAudio) {
            return [2 /*return*/, null];
          }
          if (params.capability === "image" && !provider.describeImage) {
            return [2 /*return*/, null];
          }
          if (params.capability === "video" && !provider.describeVideo) {
            return [2 /*return*/, null];
          }
          _e.label = 1;
        case 1:
          _e.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            (0, model_auth_js_1.resolveApiKeyForProvider)({
              provider: providerId,
              cfg: params.cfg,
              agentDir: params.agentDir,
            }),
          ];
        case 2:
          _e.sent();
          return [3 /*break*/, 4];
        case 3:
          _a = _e.sent();
          return [2 /*return*/, null];
        case 4:
          return [
            2 /*return*/,
            {
              type: "provider",
              provider: providerId,
              model: (_d = params.activeModel) === null || _d === void 0 ? void 0 : _d.model,
            },
          ];
      }
    });
  });
}
function trimOutput(text, maxChars) {
  var trimmed = text.trim();
  if (!maxChars || trimmed.length <= maxChars) {
    return trimmed;
  }
  return trimmed.slice(0, maxChars).trim();
}
function commandBase(command) {
  return node_path_1.default.parse(command).name;
}
function findArgValue(args, keys) {
  var _a;
  for (var i = 0; i < args.length; i += 1) {
    if (keys.includes((_a = args[i]) !== null && _a !== void 0 ? _a : "")) {
      var value = args[i + 1];
      if (value) {
        return value;
      }
    }
  }
  return undefined;
}
function hasArg(args, keys) {
  return args.some(function (arg) {
    return keys.includes(arg);
  });
}
function resolveWhisperOutputPath(args, mediaPath) {
  var outputDir = findArgValue(args, ["--output_dir", "-o"]);
  var outputFormat = findArgValue(args, ["--output_format"]);
  if (!outputDir || !outputFormat) {
    return null;
  }
  var formats = outputFormat.split(",").map(function (value) {
    return value.trim();
  });
  if (!formats.includes("txt")) {
    return null;
  }
  var base = node_path_1.default.parse(mediaPath).name;
  return node_path_1.default.join(outputDir, "".concat(base, ".txt"));
}
function resolveWhisperCppOutputPath(args) {
  if (!hasArg(args, ["-otxt", "--output-txt"])) {
    return null;
  }
  var outputBase = findArgValue(args, ["-of", "--output-file"]);
  if (!outputBase) {
    return null;
  }
  return "".concat(outputBase, ".txt");
}
function resolveCliOutput(params) {
  return __awaiter(this, void 0, void 0, function () {
    var commandId, fileOutput, _a, content, _b, response, response;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          commandId = commandBase(params.command);
          fileOutput =
            commandId === "whisper-cli"
              ? resolveWhisperCppOutputPath(params.args)
              : commandId === "whisper"
                ? resolveWhisperOutputPath(params.args, params.mediaPath)
                : null;
          _a = fileOutput;
          if (!_a) {
            return [3 /*break*/, 2];
          }
          return [4 /*yield*/, fileExists(fileOutput)];
        case 1:
          _a = _c.sent();
          _c.label = 2;
        case 2:
          if (!_a) {
            return [3 /*break*/, 6];
          }
          _c.label = 3;
        case 3:
          _c.trys.push([3, 5, , 6]);
          return [4 /*yield*/, promises_1.default.readFile(fileOutput, "utf8")];
        case 4:
          content = _c.sent();
          if (content.trim()) {
            return [2 /*return*/, content.trim()];
          }
          return [3 /*break*/, 6];
        case 5:
          _b = _c.sent();
          return [3 /*break*/, 6];
        case 6:
          if (commandId === "gemini") {
            response = extractGeminiResponse(params.stdout);
            if (response) {
              return [2 /*return*/, response];
            }
          }
          if (commandId === "sherpa-onnx-offline") {
            response = extractSherpaOnnxText(params.stdout);
            if (response) {
              return [2 /*return*/, response];
            }
          }
          return [2 /*return*/, params.stdout.trim()];
      }
    });
  });
}
function normalizeProviderQuery(options) {
  if (!options) {
    return undefined;
  }
  var query = {};
  for (var _i = 0, _a = Object.entries(options); _i < _a.length; _i++) {
    var _b = _a[_i],
      key = _b[0],
      value = _b[1];
    if (value === undefined) {
      continue;
    }
    query[key] = value;
  }
  return Object.keys(query).length > 0 ? query : undefined;
}
function buildDeepgramCompatQuery(options) {
  if (!options) {
    return undefined;
  }
  var query = {};
  if (typeof options.detectLanguage === "boolean") {
    query.detect_language = options.detectLanguage;
  }
  if (typeof options.punctuate === "boolean") {
    query.punctuate = options.punctuate;
  }
  if (typeof options.smartFormat === "boolean") {
    query.smart_format = options.smartFormat;
  }
  return Object.keys(query).length > 0 ? query : undefined;
}
function normalizeDeepgramQueryKeys(query) {
  var normalized = __assign({}, query);
  if ("detectLanguage" in normalized) {
    normalized.detect_language = normalized.detectLanguage;
    delete normalized.detectLanguage;
  }
  if ("smartFormat" in normalized) {
    normalized.smart_format = normalized.smartFormat;
    delete normalized.smartFormat;
  }
  return normalized;
}
function resolveProviderQuery(params) {
  var _a, _b;
  var providerId = params.providerId,
    config = params.config,
    entry = params.entry;
  var mergedOptions = normalizeProviderQuery(
    __assign(
      __assign(
        {},
        (_a = config === null || config === void 0 ? void 0 : config.providerOptions) === null ||
          _a === void 0
          ? void 0
          : _a[providerId],
      ),
      (_b = entry.providerOptions) === null || _b === void 0 ? void 0 : _b[providerId],
    ),
  );
  if (providerId !== "deepgram") {
    return mergedOptions;
  }
  var query = normalizeDeepgramQueryKeys(
    mergedOptions !== null && mergedOptions !== void 0 ? mergedOptions : {},
  );
  var compat = buildDeepgramCompatQuery(
    __assign(
      __assign({}, config === null || config === void 0 ? void 0 : config.deepgram),
      entry.deepgram,
    ),
  );
  for (
    var _i = 0, _c = Object.entries(compat !== null && compat !== void 0 ? compat : {});
    _i < _c.length;
    _i++
  ) {
    var _d = _c[_i],
      key = _d[0],
      value = _d[1];
    if (query[key] === undefined) {
      query[key] = value;
    }
  }
  return Object.keys(query).length > 0 ? query : undefined;
}
function buildModelDecision(params) {
  var _a, _b, _c;
  if (params.entryType === "cli") {
    var command = (_a = params.entry.command) === null || _a === void 0 ? void 0 : _a.trim();
    return {
      type: "cli",
      provider: command !== null && command !== void 0 ? command : "cli",
      model: (_b = params.entry.model) !== null && _b !== void 0 ? _b : command,
      outcome: params.outcome,
      reason: params.reason,
    };
  }
  var providerIdRaw = (_c = params.entry.provider) === null || _c === void 0 ? void 0 : _c.trim();
  var providerId = providerIdRaw
    ? (0, index_js_1.normalizeMediaProviderId)(providerIdRaw)
    : undefined;
  return {
    type: "provider",
    provider: providerId !== null && providerId !== void 0 ? providerId : providerIdRaw,
    model: params.entry.model,
    outcome: params.outcome,
    reason: params.reason,
  };
}
function formatDecisionSummary(decision) {
  var _a, _b, _c, _d;
  var total = decision.attachments.length;
  var success = decision.attachments.filter(function (entry) {
    var _a;
    return ((_a = entry.chosen) === null || _a === void 0 ? void 0 : _a.outcome) === "success";
  }).length;
  var chosen =
    (_a = decision.attachments.find(function (entry) {
      return entry.chosen;
    })) === null || _a === void 0
      ? void 0
      : _a.chosen;
  var provider =
    (_b = chosen === null || chosen === void 0 ? void 0 : chosen.provider) === null || _b === void 0
      ? void 0
      : _b.trim();
  var model =
    (_c = chosen === null || chosen === void 0 ? void 0 : chosen.model) === null || _c === void 0
      ? void 0
      : _c.trim();
  var modelLabel = provider
    ? model
      ? "".concat(provider, "/").concat(model)
      : provider
    : undefined;
  var reason = decision.attachments
    .flatMap(function (entry) {
      return entry.attempts
        .map(function (attempt) {
          return attempt.reason;
        })
        .filter(Boolean);
    })
    .find(Boolean);
  var shortReason = reason
    ? (_d = reason.split(":")[0]) === null || _d === void 0
      ? void 0
      : _d.trim()
    : undefined;
  var countLabel = total > 0 ? " (".concat(success, "/").concat(total, ")") : "";
  var viaLabel = modelLabel ? " via ".concat(modelLabel) : "";
  var reasonLabel = shortReason ? " reason=".concat(shortReason) : "";
  return ""
    .concat(decision.capability, ": ")
    .concat(decision.outcome)
    .concat(countLabel)
    .concat(viaLabel)
    .concat(reasonLabel);
}
function runProviderEntry(params) {
  return __awaiter(this, void 0, void 0, function () {
    var entry,
      capability,
      cfg,
      providerIdRaw,
      providerId,
      maxBytes,
      maxChars,
      timeoutMs,
      prompt,
      modelId,
      media_1,
      provider_1,
      result_1,
      _a,
      provider,
      media_2,
      auth_1,
      apiKey_1,
      providerConfig_1,
      baseUrl,
      mergedHeaders,
      headers,
      providerQuery,
      model,
      result_2,
      media,
      estimatedBase64Bytes,
      maxBase64Bytes,
      auth,
      apiKey,
      providerConfig,
      result;
    var _b,
      _c,
      _d,
      _e,
      _f,
      _g,
      _h,
      _j,
      _k,
      _l,
      _m,
      _o,
      _p,
      _q,
      _r,
      _s,
      _t,
      _u,
      _v,
      _w,
      _x,
      _y,
      _z,
      _0,
      _1,
      _2,
      _3,
      _4,
      _5,
      _6,
      _7,
      _8;
    return __generator(this, function (_9) {
      switch (_9.label) {
        case 0:
          ((entry = params.entry), (capability = params.capability), (cfg = params.cfg));
          providerIdRaw = (_b = entry.provider) === null || _b === void 0 ? void 0 : _b.trim();
          if (!providerIdRaw) {
            throw new Error("Provider entry missing provider for ".concat(capability));
          }
          providerId = (0, index_js_1.normalizeMediaProviderId)(providerIdRaw);
          maxBytes = (0, resolve_js_1.resolveMaxBytes)({
            capability: capability,
            entry: entry,
            cfg: cfg,
            config: params.config,
          });
          maxChars = (0, resolve_js_1.resolveMaxChars)({
            capability: capability,
            entry: entry,
            cfg: cfg,
            config: params.config,
          });
          timeoutMs = (0, resolve_js_1.resolveTimeoutMs)(
            (_e =
              (_c = entry.timeoutSeconds) !== null && _c !== void 0
                ? _c
                : (_d = params.config) === null || _d === void 0
                  ? void 0
                  : _d.timeoutSeconds) !== null && _e !== void 0
              ? _e
              : (_h =
                    (_g = (_f = cfg.tools) === null || _f === void 0 ? void 0 : _f.media) ===
                      null || _g === void 0
                      ? void 0
                      : _g[capability]) === null || _h === void 0
                ? void 0
                : _h.timeoutSeconds,
            defaults_js_1.DEFAULT_TIMEOUT_SECONDS[capability],
          );
          prompt = (0, resolve_js_1.resolvePrompt)(
            capability,
            (_l =
              (_j = entry.prompt) !== null && _j !== void 0
                ? _j
                : (_k = params.config) === null || _k === void 0
                  ? void 0
                  : _k.prompt) !== null && _l !== void 0
              ? _l
              : (_p =
                    (_o = (_m = cfg.tools) === null || _m === void 0 ? void 0 : _m.media) ===
                      null || _o === void 0
                      ? void 0
                      : _o[capability]) === null || _p === void 0
                ? void 0
                : _p.prompt,
            maxChars,
          );
          if (!(capability === "image")) {
            return [3 /*break*/, 6];
          }
          if (!params.agentDir) {
            throw new Error("Image understanding requires agentDir");
          }
          modelId = (_q = entry.model) === null || _q === void 0 ? void 0 : _q.trim();
          if (!modelId) {
            throw new Error("Image understanding requires model id");
          }
          return [
            4 /*yield*/,
            params.cache.getBuffer({
              attachmentIndex: params.attachmentIndex,
              maxBytes: maxBytes,
              timeoutMs: timeoutMs,
            }),
          ];
        case 1:
          media_1 = _9.sent();
          provider_1 = (0, index_js_1.getMediaUnderstandingProvider)(
            providerId,
            params.providerRegistry,
          );
          if (!(provider_1 === null || provider_1 === void 0 ? void 0 : provider_1.describeImage)) {
            return [3 /*break*/, 3];
          }
          return [
            4 /*yield*/,
            provider_1.describeImage({
              buffer: media_1.buffer,
              fileName: media_1.fileName,
              mime: media_1.mime,
              model: modelId,
              provider: providerId,
              prompt: prompt,
              timeoutMs: timeoutMs,
              profile: entry.profile,
              preferredProfile: entry.preferredProfile,
              agentDir: params.agentDir,
              cfg: params.cfg,
            }),
          ];
        case 2:
          _a = _9.sent();
          return [3 /*break*/, 5];
        case 3:
          return [
            4 /*yield*/,
            (0, image_js_1.describeImageWithModel)({
              buffer: media_1.buffer,
              fileName: media_1.fileName,
              mime: media_1.mime,
              model: modelId,
              provider: providerId,
              prompt: prompt,
              timeoutMs: timeoutMs,
              profile: entry.profile,
              preferredProfile: entry.preferredProfile,
              agentDir: params.agentDir,
              cfg: params.cfg,
            }),
          ];
        case 4:
          _a = _9.sent();
          _9.label = 5;
        case 5:
          result_1 = _a;
          return [
            2 /*return*/,
            {
              kind: "image.description",
              attachmentIndex: params.attachmentIndex,
              text: trimOutput(result_1.text, maxChars),
              provider: providerId,
              model: (_r = result_1.model) !== null && _r !== void 0 ? _r : modelId,
            },
          ];
        case 6:
          provider = (0, index_js_1.getMediaUnderstandingProvider)(
            providerId,
            params.providerRegistry,
          );
          if (!provider) {
            throw new Error("Media provider not available: ".concat(providerId));
          }
          if (!(capability === "audio")) {
            return [3 /*break*/, 10];
          }
          if (!provider.transcribeAudio) {
            throw new Error(
              'Audio transcription provider "'.concat(providerId, '" not available.'),
            );
          }
          return [
            4 /*yield*/,
            params.cache.getBuffer({
              attachmentIndex: params.attachmentIndex,
              maxBytes: maxBytes,
              timeoutMs: timeoutMs,
            }),
          ];
        case 7:
          media_2 = _9.sent();
          return [
            4 /*yield*/,
            (0, model_auth_js_1.resolveApiKeyForProvider)({
              provider: providerId,
              cfg: cfg,
              profileId: entry.profile,
              preferredProfile: entry.preferredProfile,
              agentDir: params.agentDir,
            }),
          ];
        case 8:
          auth_1 = _9.sent();
          apiKey_1 = (0, model_auth_js_1.requireApiKey)(auth_1, providerId);
          providerConfig_1 =
            (_t = (_s = cfg.models) === null || _s === void 0 ? void 0 : _s.providers) === null ||
            _t === void 0
              ? void 0
              : _t[providerId];
          baseUrl =
            (_w =
              (_u = entry.baseUrl) !== null && _u !== void 0
                ? _u
                : (_v = params.config) === null || _v === void 0
                  ? void 0
                  : _v.baseUrl) !== null && _w !== void 0
              ? _w
              : providerConfig_1 === null || providerConfig_1 === void 0
                ? void 0
                : providerConfig_1.baseUrl;
          mergedHeaders = __assign(
            __assign(
              __assign(
                {},
                providerConfig_1 === null || providerConfig_1 === void 0
                  ? void 0
                  : providerConfig_1.headers,
              ),
              (_x = params.config) === null || _x === void 0 ? void 0 : _x.headers,
            ),
            entry.headers,
          );
          headers = Object.keys(mergedHeaders).length > 0 ? mergedHeaders : undefined;
          providerQuery = resolveProviderQuery({
            providerId: providerId,
            config: params.config,
            entry: entry,
          });
          model =
            ((_y = entry.model) === null || _y === void 0 ? void 0 : _y.trim()) ||
            defaults_js_1.DEFAULT_AUDIO_MODELS[providerId] ||
            entry.model;
          return [
            4 /*yield*/,
            provider.transcribeAudio({
              buffer: media_2.buffer,
              fileName: media_2.fileName,
              mime: media_2.mime,
              apiKey: apiKey_1,
              baseUrl: baseUrl,
              headers: headers,
              model: model,
              language:
                (_1 =
                  (_z = entry.language) !== null && _z !== void 0
                    ? _z
                    : (_0 = params.config) === null || _0 === void 0
                      ? void 0
                      : _0.language) !== null && _1 !== void 0
                  ? _1
                  : (_4 =
                        (_3 = (_2 = cfg.tools) === null || _2 === void 0 ? void 0 : _2.media) ===
                          null || _3 === void 0
                          ? void 0
                          : _3.audio) === null || _4 === void 0
                    ? void 0
                    : _4.language,
              prompt: prompt,
              query: providerQuery,
              timeoutMs: timeoutMs,
            }),
          ];
        case 9:
          result_2 = _9.sent();
          return [
            2 /*return*/,
            {
              kind: "audio.transcription",
              attachmentIndex: params.attachmentIndex,
              text: trimOutput(result_2.text, maxChars),
              provider: providerId,
              model: (_5 = result_2.model) !== null && _5 !== void 0 ? _5 : model,
            },
          ];
        case 10:
          if (!provider.describeVideo) {
            throw new Error(
              'Video understanding provider "'.concat(providerId, '" not available.'),
            );
          }
          return [
            4 /*yield*/,
            params.cache.getBuffer({
              attachmentIndex: params.attachmentIndex,
              maxBytes: maxBytes,
              timeoutMs: timeoutMs,
            }),
          ];
        case 11:
          media = _9.sent();
          estimatedBase64Bytes = (0, video_js_1.estimateBase64Size)(media.size);
          maxBase64Bytes = (0, video_js_1.resolveVideoMaxBase64Bytes)(maxBytes);
          if (estimatedBase64Bytes > maxBase64Bytes) {
            throw new errors_js_1.MediaUnderstandingSkipError(
              "maxBytes",
              "Video attachment "
                .concat(params.attachmentIndex + 1, " base64 payload ")
                .concat(estimatedBase64Bytes, " exceeds ")
                .concat(maxBase64Bytes),
            );
          }
          return [
            4 /*yield*/,
            (0, model_auth_js_1.resolveApiKeyForProvider)({
              provider: providerId,
              cfg: cfg,
              profileId: entry.profile,
              preferredProfile: entry.preferredProfile,
              agentDir: params.agentDir,
            }),
          ];
        case 12:
          auth = _9.sent();
          apiKey = (0, model_auth_js_1.requireApiKey)(auth, providerId);
          providerConfig =
            (_7 = (_6 = cfg.models) === null || _6 === void 0 ? void 0 : _6.providers) === null ||
            _7 === void 0
              ? void 0
              : _7[providerId];
          return [
            4 /*yield*/,
            provider.describeVideo({
              buffer: media.buffer,
              fileName: media.fileName,
              mime: media.mime,
              apiKey: apiKey,
              baseUrl:
                providerConfig === null || providerConfig === void 0
                  ? void 0
                  : providerConfig.baseUrl,
              headers:
                providerConfig === null || providerConfig === void 0
                  ? void 0
                  : providerConfig.headers,
              model: entry.model,
              prompt: prompt,
              timeoutMs: timeoutMs,
            }),
          ];
        case 13:
          result = _9.sent();
          return [
            2 /*return*/,
            {
              kind: "video.description",
              attachmentIndex: params.attachmentIndex,
              text: trimOutput(result.text, maxChars),
              provider: providerId,
              model: (_8 = result.model) !== null && _8 !== void 0 ? _8 : entry.model,
            },
          ];
      }
    });
  });
}
function runCliEntry(params) {
  return __awaiter(this, void 0, void 0, function () {
    var entry,
      capability,
      cfg,
      ctx,
      command,
      args,
      maxBytes,
      maxChars,
      timeoutMs,
      prompt,
      pathResult,
      outputDir,
      mediaPath,
      outputBase,
      templCtx,
      argv,
      stdout,
      resolved,
      text;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    return __generator(this, function (_q) {
      switch (_q.label) {
        case 0:
          ((entry = params.entry),
            (capability = params.capability),
            (cfg = params.cfg),
            (ctx = params.ctx));
          command = (_a = entry.command) === null || _a === void 0 ? void 0 : _a.trim();
          args = (_b = entry.args) !== null && _b !== void 0 ? _b : [];
          if (!command) {
            throw new Error("CLI entry missing command for ".concat(capability));
          }
          maxBytes = (0, resolve_js_1.resolveMaxBytes)({
            capability: capability,
            entry: entry,
            cfg: cfg,
            config: params.config,
          });
          maxChars = (0, resolve_js_1.resolveMaxChars)({
            capability: capability,
            entry: entry,
            cfg: cfg,
            config: params.config,
          });
          timeoutMs = (0, resolve_js_1.resolveTimeoutMs)(
            (_e =
              (_c = entry.timeoutSeconds) !== null && _c !== void 0
                ? _c
                : (_d = params.config) === null || _d === void 0
                  ? void 0
                  : _d.timeoutSeconds) !== null && _e !== void 0
              ? _e
              : (_h =
                    (_g = (_f = cfg.tools) === null || _f === void 0 ? void 0 : _f.media) ===
                      null || _g === void 0
                      ? void 0
                      : _g[capability]) === null || _h === void 0
                ? void 0
                : _h.timeoutSeconds,
            defaults_js_1.DEFAULT_TIMEOUT_SECONDS[capability],
          );
          prompt = (0, resolve_js_1.resolvePrompt)(
            capability,
            (_l =
              (_j = entry.prompt) !== null && _j !== void 0
                ? _j
                : (_k = params.config) === null || _k === void 0
                  ? void 0
                  : _k.prompt) !== null && _l !== void 0
              ? _l
              : (_p =
                    (_o = (_m = cfg.tools) === null || _m === void 0 ? void 0 : _m.media) ===
                      null || _o === void 0
                      ? void 0
                      : _o[capability]) === null || _p === void 0
                ? void 0
                : _p.prompt,
            maxChars,
          );
          return [
            4 /*yield*/,
            params.cache.getPath({
              attachmentIndex: params.attachmentIndex,
              maxBytes: maxBytes,
              timeoutMs: timeoutMs,
            }),
          ];
        case 1:
          pathResult = _q.sent();
          return [
            4 /*yield*/,
            promises_1.default.mkdtemp(
              node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-media-cli-"),
            ),
          ];
        case 2:
          outputDir = _q.sent();
          mediaPath = pathResult.path;
          outputBase = node_path_1.default.join(
            outputDir,
            node_path_1.default.parse(mediaPath).name,
          );
          templCtx = __assign(__assign({}, ctx), {
            MediaPath: mediaPath,
            MediaDir: node_path_1.default.dirname(mediaPath),
            OutputDir: outputDir,
            OutputBase: outputBase,
            Prompt: prompt,
            MaxChars: maxChars,
          });
          argv = __spreadArray([command], args, true).map(function (part, index) {
            return index === 0 ? part : (0, templating_js_1.applyTemplate)(part, templCtx);
          });
          _q.label = 3;
        case 3:
          _q.trys.push([3, , 6, 8]);
          if ((0, globals_js_1.shouldLogVerbose)()) {
            (0, globals_js_1.logVerbose)("Media understanding via CLI: ".concat(argv.join(" ")));
          }
          return [
            4 /*yield*/,
            (0, exec_js_1.runExec)(argv[0], argv.slice(1), {
              timeoutMs: timeoutMs,
              maxBuffer: defaults_js_1.CLI_OUTPUT_MAX_BUFFER,
            }),
          ];
        case 4:
          stdout = _q.sent().stdout;
          return [
            4 /*yield*/,
            resolveCliOutput({
              command: command,
              args: argv.slice(1),
              stdout: stdout,
              mediaPath: mediaPath,
            }),
          ];
        case 5:
          resolved = _q.sent();
          text = trimOutput(resolved, maxChars);
          if (!text) {
            return [2 /*return*/, null];
          }
          return [
            2 /*return*/,
            {
              kind:
                capability === "audio"
                  ? "audio.transcription"
                  : "".concat(capability, ".description"),
              attachmentIndex: params.attachmentIndex,
              text: text,
              provider: "cli",
              model: command,
            },
          ];
        case 6:
          return [
            4 /*yield*/,
            promises_1.default
              .rm(outputDir, { recursive: true, force: true })
              .catch(function () {}),
          ];
        case 7:
          _q.sent();
          return [7 /*endfinally*/];
        case 8:
          return [2 /*return*/];
      }
    });
  });
}
function runAttachmentEntries(params) {
  return __awaiter(this, void 0, void 0, function () {
    var entries, capability, attempts, _i, entries_1, entry, entryType, result, _a, decision, err_1;
    var _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          ((entries = params.entries), (capability = params.capability));
          attempts = [];
          ((_i = 0), (entries_1 = entries));
          _c.label = 1;
        case 1:
          if (!(_i < entries_1.length)) {
            return [3 /*break*/, 9];
          }
          entry = entries_1[_i];
          entryType =
            (_b = entry.type) !== null && _b !== void 0 ? _b : entry.command ? "cli" : "provider";
          _c.label = 2;
        case 2:
          _c.trys.push([2, 7, , 8]);
          if (!(entryType === "cli")) {
            return [3 /*break*/, 4];
          }
          return [
            4 /*yield*/,
            runCliEntry({
              capability: capability,
              entry: entry,
              cfg: params.cfg,
              ctx: params.ctx,
              attachmentIndex: params.attachmentIndex,
              cache: params.cache,
              config: params.config,
            }),
          ];
        case 3:
          _a = _c.sent();
          return [3 /*break*/, 6];
        case 4:
          return [
            4 /*yield*/,
            runProviderEntry({
              capability: capability,
              entry: entry,
              cfg: params.cfg,
              ctx: params.ctx,
              attachmentIndex: params.attachmentIndex,
              cache: params.cache,
              agentDir: params.agentDir,
              providerRegistry: params.providerRegistry,
              config: params.config,
            }),
          ];
        case 5:
          _a = _c.sent();
          _c.label = 6;
        case 6:
          result = _a;
          if (result) {
            decision = buildModelDecision({
              entry: entry,
              entryType: entryType,
              outcome: "success",
            });
            if (result.provider) {
              decision.provider = result.provider;
            }
            if (result.model) {
              decision.model = result.model;
            }
            attempts.push(decision);
            return [2 /*return*/, { output: result, attempts: attempts }];
          }
          attempts.push(
            buildModelDecision({
              entry: entry,
              entryType: entryType,
              outcome: "skipped",
              reason: "empty output",
            }),
          );
          return [3 /*break*/, 8];
        case 7:
          err_1 = _c.sent();
          if ((0, errors_js_1.isMediaUnderstandingSkipError)(err_1)) {
            attempts.push(
              buildModelDecision({
                entry: entry,
                entryType: entryType,
                outcome: "skipped",
                reason: "".concat(err_1.reason, ": ").concat(err_1.message),
              }),
            );
            if ((0, globals_js_1.shouldLogVerbose)()) {
              (0, globals_js_1.logVerbose)(
                "Skipping "
                  .concat(capability, " model due to ")
                  .concat(err_1.reason, ": ")
                  .concat(err_1.message),
              );
            }
            return [3 /*break*/, 8];
          }
          attempts.push(
            buildModelDecision({
              entry: entry,
              entryType: entryType,
              outcome: "failed",
              reason: String(err_1),
            }),
          );
          if ((0, globals_js_1.shouldLogVerbose)()) {
            (0, globals_js_1.logVerbose)(
              "".concat(capability, " understanding failed: ").concat(String(err_1)),
            );
          }
          return [3 /*break*/, 8];
        case 8:
          _i++;
          return [3 /*break*/, 1];
        case 9:
          return [2 /*return*/, { output: null, attempts: attempts }];
      }
    });
  });
}
function runCapability(params) {
  return __awaiter(this, void 0, void 0, function () {
    var capability,
      cfg,
      ctx,
      config,
      attachmentPolicy,
      selected,
      scopeDecision,
      activeProvider,
      catalog,
      entry,
      model_1,
      reason_1,
      entries,
      resolvedEntries,
      outputs,
      attachmentDecisions,
      _i,
      selected_1,
      attachment,
      _a,
      output,
      attempts,
      decision;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __generator(this, function (_l) {
      switch (_l.label) {
        case 0:
          ((capability = params.capability), (cfg = params.cfg), (ctx = params.ctx));
          config =
            (_b = params.config) !== null && _b !== void 0
              ? _b
              : (_d = (_c = cfg.tools) === null || _c === void 0 ? void 0 : _c.media) === null ||
                  _d === void 0
                ? void 0
                : _d[capability];
          if ((config === null || config === void 0 ? void 0 : config.enabled) === false) {
            return [
              2 /*return*/,
              {
                outputs: [],
                decision: { capability: capability, outcome: "disabled", attachments: [] },
              },
            ];
          }
          attachmentPolicy = config === null || config === void 0 ? void 0 : config.attachments;
          selected = (0, attachments_js_1.selectAttachments)({
            capability: capability,
            attachments: params.media,
            policy: attachmentPolicy,
          });
          if (selected.length === 0) {
            return [
              2 /*return*/,
              {
                outputs: [],
                decision: { capability: capability, outcome: "no-attachment", attachments: [] },
              },
            ];
          }
          scopeDecision = (0, resolve_js_1.resolveScopeDecision)({
            scope: config === null || config === void 0 ? void 0 : config.scope,
            ctx: ctx,
          });
          if (scopeDecision === "deny") {
            if ((0, globals_js_1.shouldLogVerbose)()) {
              (0, globals_js_1.logVerbose)(
                "".concat(capability, " understanding disabled by scope policy."),
              );
            }
            return [
              2 /*return*/,
              {
                outputs: [],
                decision: {
                  capability: capability,
                  outcome: "scope-deny",
                  attachments: selected.map(function (item) {
                    return { attachmentIndex: item.index, attempts: [] };
                  }),
                },
              },
            ];
          }
          activeProvider =
            (_f = (_e = params.activeModel) === null || _e === void 0 ? void 0 : _e.provider) ===
              null || _f === void 0
              ? void 0
              : _f.trim();
          if (!(capability === "image" && activeProvider)) {
            return [3 /*break*/, 2];
          }
          return [4 /*yield*/, (0, model_catalog_js_1.loadModelCatalog)({ config: cfg })];
        case 1:
          catalog = _l.sent();
          entry = (0, model_catalog_js_1.findModelInCatalog)(
            catalog,
            activeProvider,
            (_h = (_g = params.activeModel) === null || _g === void 0 ? void 0 : _g.model) !==
              null && _h !== void 0
              ? _h
              : "",
          );
          if ((0, model_catalog_js_1.modelSupportsVision)(entry)) {
            if ((0, globals_js_1.shouldLogVerbose)()) {
              (0, globals_js_1.logVerbose)(
                "Skipping image understanding: primary model supports vision natively",
              );
            }
            model_1 =
              (_k = (_j = params.activeModel) === null || _j === void 0 ? void 0 : _j.model) ===
                null || _k === void 0
                ? void 0
                : _k.trim();
            reason_1 = "primary model supports vision natively";
            return [
              2 /*return*/,
              {
                outputs: [],
                decision: {
                  capability: capability,
                  outcome: "skipped",
                  attachments: selected.map(function (item) {
                    var attempt = {
                      type: "provider",
                      provider: activeProvider,
                      model: model_1 || undefined,
                      outcome: "skipped",
                      reason: reason_1,
                    };
                    return {
                      attachmentIndex: item.index,
                      attempts: [attempt],
                      chosen: attempt,
                    };
                  }),
                },
              },
            ];
          }
          _l.label = 2;
        case 2:
          entries = (0, resolve_js_1.resolveModelEntries)({
            cfg: cfg,
            capability: capability,
            config: config,
            providerRegistry: params.providerRegistry,
          });
          resolvedEntries = entries;
          if (!(resolvedEntries.length === 0)) {
            return [3 /*break*/, 4];
          }
          return [
            4 /*yield*/,
            resolveAutoEntries({
              cfg: cfg,
              agentDir: params.agentDir,
              providerRegistry: params.providerRegistry,
              capability: capability,
              activeModel: params.activeModel,
            }),
          ];
        case 3:
          resolvedEntries = _l.sent();
          _l.label = 4;
        case 4:
          if (resolvedEntries.length === 0) {
            return [
              2 /*return*/,
              {
                outputs: [],
                decision: {
                  capability: capability,
                  outcome: "skipped",
                  attachments: selected.map(function (item) {
                    return { attachmentIndex: item.index, attempts: [] };
                  }),
                },
              },
            ];
          }
          outputs = [];
          attachmentDecisions = [];
          ((_i = 0), (selected_1 = selected));
          _l.label = 5;
        case 5:
          if (!(_i < selected_1.length)) {
            return [3 /*break*/, 8];
          }
          attachment = selected_1[_i];
          return [
            4 /*yield*/,
            runAttachmentEntries({
              capability: capability,
              cfg: cfg,
              ctx: ctx,
              attachmentIndex: attachment.index,
              agentDir: params.agentDir,
              providerRegistry: params.providerRegistry,
              cache: params.attachments,
              entries: resolvedEntries,
              config: config,
            }),
          ];
        case 6:
          ((_a = _l.sent()), (output = _a.output), (attempts = _a.attempts));
          if (output) {
            outputs.push(output);
          }
          attachmentDecisions.push({
            attachmentIndex: attachment.index,
            attempts: attempts,
            chosen: attempts.find(function (attempt) {
              return attempt.outcome === "success";
            }),
          });
          _l.label = 7;
        case 7:
          _i++;
          return [3 /*break*/, 5];
        case 8:
          decision = {
            capability: capability,
            outcome: outputs.length > 0 ? "success" : "skipped",
            attachments: attachmentDecisions,
          };
          if ((0, globals_js_1.shouldLogVerbose)()) {
            (0, globals_js_1.logVerbose)(
              "Media understanding ".concat(formatDecisionSummary(decision)),
            );
          }
          return [
            2 /*return*/,
            {
              outputs: outputs,
              decision: decision,
            },
          ];
      }
    });
  });
}
