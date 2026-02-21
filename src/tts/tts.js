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
exports._test =
  exports.OPENAI_TTS_VOICES =
  exports.OPENAI_TTS_MODELS =
  exports.TTS_PROVIDERS =
    void 0;
exports.normalizeTtsAutoMode = normalizeTtsAutoMode;
exports.resolveTtsConfig = resolveTtsConfig;
exports.resolveTtsPrefsPath = resolveTtsPrefsPath;
exports.resolveTtsAutoMode = resolveTtsAutoMode;
exports.buildTtsSystemPromptHint = buildTtsSystemPromptHint;
exports.isTtsEnabled = isTtsEnabled;
exports.setTtsAutoMode = setTtsAutoMode;
exports.setTtsEnabled = setTtsEnabled;
exports.getTtsProvider = getTtsProvider;
exports.setTtsProvider = setTtsProvider;
exports.getTtsMaxLength = getTtsMaxLength;
exports.setTtsMaxLength = setTtsMaxLength;
exports.isSummarizationEnabled = isSummarizationEnabled;
exports.setSummarizationEnabled = setSummarizationEnabled;
exports.getLastTtsAttempt = getLastTtsAttempt;
exports.setLastTtsAttempt = setLastTtsAttempt;
exports.resolveTtsApiKey = resolveTtsApiKey;
exports.resolveTtsProviderOrder = resolveTtsProviderOrder;
exports.isTtsProviderConfigured = isTtsProviderConfigured;
exports.textToSpeech = textToSpeech;
exports.textToSpeechTelephony = textToSpeechTelephony;
exports.maybeApplyTtsToPayload = maybeApplyTtsToPayload;
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var pi_ai_1 = require("@mariozechner/pi-ai");
var node_edge_tts_1 = require("node-edge-tts");
var index_js_1 = require("../channels/plugins/index.js");
var globals_js_1 = require("../globals.js");
var audio_js_1 = require("../media/audio.js");
var utils_js_1 = require("../utils.js");
var model_auth_js_1 = require("../agents/model-auth.js");
var model_selection_js_1 = require("../agents/model-selection.js");
var model_js_1 = require("../agents/pi-embedded-runner/model.js");
var DEFAULT_TIMEOUT_MS = 30000;
var DEFAULT_TTS_MAX_LENGTH = 1500;
var DEFAULT_TTS_SUMMARIZE = true;
var DEFAULT_MAX_TEXT_LENGTH = 4096;
var TEMP_FILE_CLEANUP_DELAY_MS = 5 * 60 * 1000; // 5 minutes
var DEFAULT_ELEVENLABS_BASE_URL = "https://api.elevenlabs.io";
var DEFAULT_ELEVENLABS_VOICE_ID = "pMsXgVXv3BLzUgSXRplE";
var DEFAULT_ELEVENLABS_MODEL_ID = "eleven_multilingual_v2";
var DEFAULT_OPENAI_MODEL = "gpt-4o-mini-tts";
var DEFAULT_OPENAI_VOICE = "alloy";
var DEFAULT_EDGE_VOICE = "en-US-MichelleNeural";
var DEFAULT_EDGE_LANG = "en-US";
var DEFAULT_EDGE_OUTPUT_FORMAT = "audio-24khz-48kbitrate-mono-mp3";
var DEFAULT_ELEVENLABS_VOICE_SETTINGS = {
  stability: 0.5,
  similarityBoost: 0.75,
  style: 0.0,
  useSpeakerBoost: true,
  speed: 1.0,
};
var TELEGRAM_OUTPUT = {
  openai: "opus",
  // ElevenLabs output formats use codec_sample_rate_bitrate naming.
  // Opus @ 48kHz/64kbps is a good voice-note tradeoff for Telegram.
  elevenlabs: "opus_48000_64",
  extension: ".opus",
  voiceCompatible: true,
};
var DEFAULT_OUTPUT = {
  openai: "mp3",
  elevenlabs: "mp3_44100_128",
  extension: ".mp3",
  voiceCompatible: false,
};
var TELEPHONY_OUTPUT = {
  openai: { format: "pcm", sampleRate: 24000 },
  elevenlabs: { format: "pcm_22050", sampleRate: 22050 },
};
var TTS_AUTO_MODES = new Set(["off", "always", "inbound", "tagged"]);
var lastTtsAttempt;
function normalizeTtsAutoMode(value) {
  if (typeof value !== "string") {
    return undefined;
  }
  var normalized = value.trim().toLowerCase();
  if (TTS_AUTO_MODES.has(normalized)) {
    return normalized;
  }
  return undefined;
}
function resolveModelOverridePolicy(overrides) {
  var _a;
  var enabled =
    (_a = overrides === null || overrides === void 0 ? void 0 : overrides.enabled) !== null &&
    _a !== void 0
      ? _a
      : true;
  if (!enabled) {
    return {
      enabled: false,
      allowText: false,
      allowProvider: false,
      allowVoice: false,
      allowModelId: false,
      allowVoiceSettings: false,
      allowNormalization: false,
      allowSeed: false,
    };
  }
  var allow = function (value) {
    return value !== null && value !== void 0 ? value : true;
  };
  return {
    enabled: true,
    allowText: allow(overrides === null || overrides === void 0 ? void 0 : overrides.allowText),
    allowProvider: allow(
      overrides === null || overrides === void 0 ? void 0 : overrides.allowProvider,
    ),
    allowVoice: allow(overrides === null || overrides === void 0 ? void 0 : overrides.allowVoice),
    allowModelId: allow(
      overrides === null || overrides === void 0 ? void 0 : overrides.allowModelId,
    ),
    allowVoiceSettings: allow(
      overrides === null || overrides === void 0 ? void 0 : overrides.allowVoiceSettings,
    ),
    allowNormalization: allow(
      overrides === null || overrides === void 0 ? void 0 : overrides.allowNormalization,
    ),
    allowSeed: allow(overrides === null || overrides === void 0 ? void 0 : overrides.allowSeed),
  };
}
function resolveTtsConfig(cfg) {
  var _a,
    _b,
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
    _8,
    _9,
    _10,
    _11,
    _12,
    _13,
    _14,
    _15,
    _16,
    _17,
    _18,
    _19,
    _20,
    _21,
    _22,
    _23,
    _24,
    _25,
    _26,
    _27,
    _28,
    _29,
    _30,
    _31,
    _32;
  var raw =
    (_b = (_a = cfg.messages) === null || _a === void 0 ? void 0 : _a.tts) !== null && _b !== void 0
      ? _b
      : {};
  var providerSource = raw.provider ? "config" : "default";
  var edgeOutputFormat =
    (_d = (_c = raw.edge) === null || _c === void 0 ? void 0 : _c.outputFormat) === null ||
    _d === void 0
      ? void 0
      : _d.trim();
  var auto =
    (_e = normalizeTtsAutoMode(raw.auto)) !== null && _e !== void 0
      ? _e
      : raw.enabled
        ? "always"
        : "off";
  return {
    auto: auto,
    mode: (_f = raw.mode) !== null && _f !== void 0 ? _f : "final",
    provider: (_g = raw.provider) !== null && _g !== void 0 ? _g : "edge",
    providerSource: providerSource,
    summaryModel:
      ((_h = raw.summaryModel) === null || _h === void 0 ? void 0 : _h.trim()) || undefined,
    modelOverrides: resolveModelOverridePolicy(raw.modelOverrides),
    elevenlabs: {
      apiKey: (_j = raw.elevenlabs) === null || _j === void 0 ? void 0 : _j.apiKey,
      baseUrl:
        ((_l = (_k = raw.elevenlabs) === null || _k === void 0 ? void 0 : _k.baseUrl) === null ||
        _l === void 0
          ? void 0
          : _l.trim()) || DEFAULT_ELEVENLABS_BASE_URL,
      voiceId:
        (_o = (_m = raw.elevenlabs) === null || _m === void 0 ? void 0 : _m.voiceId) !== null &&
        _o !== void 0
          ? _o
          : DEFAULT_ELEVENLABS_VOICE_ID,
      modelId:
        (_q = (_p = raw.elevenlabs) === null || _p === void 0 ? void 0 : _p.modelId) !== null &&
        _q !== void 0
          ? _q
          : DEFAULT_ELEVENLABS_MODEL_ID,
      seed: (_r = raw.elevenlabs) === null || _r === void 0 ? void 0 : _r.seed,
      applyTextNormalization:
        (_s = raw.elevenlabs) === null || _s === void 0 ? void 0 : _s.applyTextNormalization,
      languageCode: (_t = raw.elevenlabs) === null || _t === void 0 ? void 0 : _t.languageCode,
      voiceSettings: {
        stability:
          (_w =
            (_v = (_u = raw.elevenlabs) === null || _u === void 0 ? void 0 : _u.voiceSettings) ===
              null || _v === void 0
              ? void 0
              : _v.stability) !== null && _w !== void 0
            ? _w
            : DEFAULT_ELEVENLABS_VOICE_SETTINGS.stability,
        similarityBoost:
          (_z =
            (_y = (_x = raw.elevenlabs) === null || _x === void 0 ? void 0 : _x.voiceSettings) ===
              null || _y === void 0
              ? void 0
              : _y.similarityBoost) !== null && _z !== void 0
            ? _z
            : DEFAULT_ELEVENLABS_VOICE_SETTINGS.similarityBoost,
        style:
          (_2 =
            (_1 = (_0 = raw.elevenlabs) === null || _0 === void 0 ? void 0 : _0.voiceSettings) ===
              null || _1 === void 0
              ? void 0
              : _1.style) !== null && _2 !== void 0
            ? _2
            : DEFAULT_ELEVENLABS_VOICE_SETTINGS.style,
        useSpeakerBoost:
          (_5 =
            (_4 = (_3 = raw.elevenlabs) === null || _3 === void 0 ? void 0 : _3.voiceSettings) ===
              null || _4 === void 0
              ? void 0
              : _4.useSpeakerBoost) !== null && _5 !== void 0
            ? _5
            : DEFAULT_ELEVENLABS_VOICE_SETTINGS.useSpeakerBoost,
        speed:
          (_8 =
            (_7 = (_6 = raw.elevenlabs) === null || _6 === void 0 ? void 0 : _6.voiceSettings) ===
              null || _7 === void 0
              ? void 0
              : _7.speed) !== null && _8 !== void 0
            ? _8
            : DEFAULT_ELEVENLABS_VOICE_SETTINGS.speed,
      },
    },
    openai: {
      apiKey: (_9 = raw.openai) === null || _9 === void 0 ? void 0 : _9.apiKey,
      model:
        (_11 = (_10 = raw.openai) === null || _10 === void 0 ? void 0 : _10.model) !== null &&
        _11 !== void 0
          ? _11
          : DEFAULT_OPENAI_MODEL,
      voice:
        (_13 = (_12 = raw.openai) === null || _12 === void 0 ? void 0 : _12.voice) !== null &&
        _13 !== void 0
          ? _13
          : DEFAULT_OPENAI_VOICE,
    },
    edge: {
      enabled:
        (_15 = (_14 = raw.edge) === null || _14 === void 0 ? void 0 : _14.enabled) !== null &&
        _15 !== void 0
          ? _15
          : true,
      voice:
        ((_17 = (_16 = raw.edge) === null || _16 === void 0 ? void 0 : _16.voice) === null ||
        _17 === void 0
          ? void 0
          : _17.trim()) || DEFAULT_EDGE_VOICE,
      lang:
        ((_19 = (_18 = raw.edge) === null || _18 === void 0 ? void 0 : _18.lang) === null ||
        _19 === void 0
          ? void 0
          : _19.trim()) || DEFAULT_EDGE_LANG,
      outputFormat: edgeOutputFormat || DEFAULT_EDGE_OUTPUT_FORMAT,
      outputFormatConfigured: Boolean(edgeOutputFormat),
      pitch:
        ((_21 = (_20 = raw.edge) === null || _20 === void 0 ? void 0 : _20.pitch) === null ||
        _21 === void 0
          ? void 0
          : _21.trim()) || undefined,
      rate:
        ((_23 = (_22 = raw.edge) === null || _22 === void 0 ? void 0 : _22.rate) === null ||
        _23 === void 0
          ? void 0
          : _23.trim()) || undefined,
      volume:
        ((_25 = (_24 = raw.edge) === null || _24 === void 0 ? void 0 : _24.volume) === null ||
        _25 === void 0
          ? void 0
          : _25.trim()) || undefined,
      saveSubtitles:
        (_27 = (_26 = raw.edge) === null || _26 === void 0 ? void 0 : _26.saveSubtitles) !== null &&
        _27 !== void 0
          ? _27
          : false,
      proxy:
        ((_29 = (_28 = raw.edge) === null || _28 === void 0 ? void 0 : _28.proxy) === null ||
        _29 === void 0
          ? void 0
          : _29.trim()) || undefined,
      timeoutMs: (_30 = raw.edge) === null || _30 === void 0 ? void 0 : _30.timeoutMs,
    },
    prefsPath: raw.prefsPath,
    maxTextLength:
      (_31 = raw.maxTextLength) !== null && _31 !== void 0 ? _31 : DEFAULT_MAX_TEXT_LENGTH,
    timeoutMs: (_32 = raw.timeoutMs) !== null && _32 !== void 0 ? _32 : DEFAULT_TIMEOUT_MS,
  };
}
function resolveTtsPrefsPath(config) {
  var _a, _b;
  if ((_a = config.prefsPath) === null || _a === void 0 ? void 0 : _a.trim()) {
    return (0, utils_js_1.resolveUserPath)(config.prefsPath.trim());
  }
  var envPath =
    (_b = process.env.OPENCLAW_TTS_PREFS) === null || _b === void 0 ? void 0 : _b.trim();
  if (envPath) {
    return (0, utils_js_1.resolveUserPath)(envPath);
  }
  return node_path_1.default.join(utils_js_1.CONFIG_DIR, "settings", "tts.json");
}
function resolveTtsAutoModeFromPrefs(prefs) {
  var _a, _b;
  var auto = normalizeTtsAutoMode((_a = prefs.tts) === null || _a === void 0 ? void 0 : _a.auto);
  if (auto) {
    return auto;
  }
  if (typeof ((_b = prefs.tts) === null || _b === void 0 ? void 0 : _b.enabled) === "boolean") {
    return prefs.tts.enabled ? "always" : "off";
  }
  return undefined;
}
function resolveTtsAutoMode(params) {
  var sessionAuto = normalizeTtsAutoMode(params.sessionAuto);
  if (sessionAuto) {
    return sessionAuto;
  }
  var prefsAuto = resolveTtsAutoModeFromPrefs(readPrefs(params.prefsPath));
  if (prefsAuto) {
    return prefsAuto;
  }
  return params.config.auto;
}
function buildTtsSystemPromptHint(cfg) {
  var config = resolveTtsConfig(cfg);
  var prefsPath = resolveTtsPrefsPath(config);
  var autoMode = resolveTtsAutoMode({ config: config, prefsPath: prefsPath });
  if (autoMode === "off") {
    return undefined;
  }
  var maxLength = getTtsMaxLength(prefsPath);
  var summarize = isSummarizationEnabled(prefsPath) ? "on" : "off";
  var autoHint =
    autoMode === "inbound"
      ? "Only use TTS when the user's last message includes audio/voice."
      : autoMode === "tagged"
        ? "Only use TTS when you include [[tts]] or [[tts:text]] tags."
        : undefined;
  return [
    "Voice (TTS) is enabled.",
    autoHint,
    "Keep spoken text \u2264"
      .concat(maxLength, " chars to avoid auto-summary (summary ")
      .concat(summarize, ")."),
    "Use [[tts:...]] and optional [[tts:text]]...[[/tts:text]] to control voice/expressiveness.",
  ]
    .filter(Boolean)
    .join("\n");
}
function readPrefs(prefsPath) {
  try {
    if (!(0, node_fs_1.existsSync)(prefsPath)) {
      return {};
    }
    return JSON.parse((0, node_fs_1.readFileSync)(prefsPath, "utf8"));
  } catch (_a) {
    return {};
  }
}
function atomicWriteFileSync(filePath, content) {
  var tmpPath = ""
    .concat(filePath, ".tmp.")
    .concat(Date.now(), ".")
    .concat(Math.random().toString(36).slice(2));
  (0, node_fs_1.writeFileSync)(tmpPath, content);
  try {
    (0, node_fs_1.renameSync)(tmpPath, filePath);
  } catch (err) {
    try {
      (0, node_fs_1.unlinkSync)(tmpPath);
    } catch (_a) {
      // ignore
    }
    throw err;
  }
}
function updatePrefs(prefsPath, update) {
  var prefs = readPrefs(prefsPath);
  update(prefs);
  (0, node_fs_1.mkdirSync)(node_path_1.default.dirname(prefsPath), { recursive: true });
  atomicWriteFileSync(prefsPath, JSON.stringify(prefs, null, 2));
}
function isTtsEnabled(config, prefsPath, sessionAuto) {
  return (
    resolveTtsAutoMode({ config: config, prefsPath: prefsPath, sessionAuto: sessionAuto }) !== "off"
  );
}
function setTtsAutoMode(prefsPath, mode) {
  updatePrefs(prefsPath, function (prefs) {
    var next = __assign({}, prefs.tts);
    delete next.enabled;
    next.auto = mode;
    prefs.tts = next;
  });
}
function setTtsEnabled(prefsPath, enabled) {
  setTtsAutoMode(prefsPath, enabled ? "always" : "off");
}
function getTtsProvider(config, prefsPath) {
  var _a;
  var prefs = readPrefs(prefsPath);
  if ((_a = prefs.tts) === null || _a === void 0 ? void 0 : _a.provider) {
    return prefs.tts.provider;
  }
  if (config.providerSource === "config") {
    return config.provider;
  }
  if (resolveTtsApiKey(config, "openai")) {
    return "openai";
  }
  if (resolveTtsApiKey(config, "elevenlabs")) {
    return "elevenlabs";
  }
  return "edge";
}
function setTtsProvider(prefsPath, provider) {
  updatePrefs(prefsPath, function (prefs) {
    prefs.tts = __assign(__assign({}, prefs.tts), { provider: provider });
  });
}
function getTtsMaxLength(prefsPath) {
  var _a, _b;
  var prefs = readPrefs(prefsPath);
  return (_b = (_a = prefs.tts) === null || _a === void 0 ? void 0 : _a.maxLength) !== null &&
    _b !== void 0
    ? _b
    : DEFAULT_TTS_MAX_LENGTH;
}
function setTtsMaxLength(prefsPath, maxLength) {
  updatePrefs(prefsPath, function (prefs) {
    prefs.tts = __assign(__assign({}, prefs.tts), { maxLength: maxLength });
  });
}
function isSummarizationEnabled(prefsPath) {
  var _a, _b;
  var prefs = readPrefs(prefsPath);
  return (_b = (_a = prefs.tts) === null || _a === void 0 ? void 0 : _a.summarize) !== null &&
    _b !== void 0
    ? _b
    : DEFAULT_TTS_SUMMARIZE;
}
function setSummarizationEnabled(prefsPath, enabled) {
  updatePrefs(prefsPath, function (prefs) {
    prefs.tts = __assign(__assign({}, prefs.tts), { summarize: enabled });
  });
}
function getLastTtsAttempt() {
  return lastTtsAttempt;
}
function setLastTtsAttempt(entry) {
  lastTtsAttempt = entry;
}
function resolveOutputFormat(channelId) {
  if (channelId === "telegram") {
    return TELEGRAM_OUTPUT;
  }
  return DEFAULT_OUTPUT;
}
function resolveChannelId(channel) {
  return channel ? (0, index_js_1.normalizeChannelId)(channel) : null;
}
function resolveEdgeOutputFormat(config) {
  return config.edge.outputFormat;
}
function resolveTtsApiKey(config, provider) {
  if (provider === "elevenlabs") {
    return config.elevenlabs.apiKey || process.env.ELEVENLABS_API_KEY || process.env.XI_API_KEY;
  }
  if (provider === "openai") {
    return config.openai.apiKey || process.env.OPENAI_API_KEY;
  }
  return undefined;
}
exports.TTS_PROVIDERS = ["openai", "elevenlabs", "edge"];
function resolveTtsProviderOrder(primary) {
  return __spreadArray(
    [primary],
    exports.TTS_PROVIDERS.filter(function (provider) {
      return provider !== primary;
    }),
    true,
  );
}
function isTtsProviderConfigured(config, provider) {
  if (provider === "edge") {
    return config.edge.enabled;
  }
  return Boolean(resolveTtsApiKey(config, provider));
}
function isValidVoiceId(voiceId) {
  return /^[a-zA-Z0-9]{10,40}$/.test(voiceId);
}
function normalizeElevenLabsBaseUrl(baseUrl) {
  var trimmed = baseUrl.trim();
  if (!trimmed) {
    return DEFAULT_ELEVENLABS_BASE_URL;
  }
  return trimmed.replace(/\/+$/, "");
}
function requireInRange(value, min, max, label) {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new Error("".concat(label, " must be between ").concat(min, " and ").concat(max));
  }
}
function assertElevenLabsVoiceSettings(settings) {
  requireInRange(settings.stability, 0, 1, "stability");
  requireInRange(settings.similarityBoost, 0, 1, "similarityBoost");
  requireInRange(settings.style, 0, 1, "style");
  requireInRange(settings.speed, 0.5, 2, "speed");
}
function normalizeLanguageCode(code) {
  var trimmed = code === null || code === void 0 ? void 0 : code.trim();
  if (!trimmed) {
    return undefined;
  }
  var normalized = trimmed.toLowerCase();
  if (!/^[a-z]{2}$/.test(normalized)) {
    throw new Error("languageCode must be a 2-letter ISO 639-1 code (e.g. en, de, fr)");
  }
  return normalized;
}
function normalizeApplyTextNormalization(mode) {
  var trimmed = mode === null || mode === void 0 ? void 0 : mode.trim();
  if (!trimmed) {
    return undefined;
  }
  var normalized = trimmed.toLowerCase();
  if (normalized === "auto" || normalized === "on" || normalized === "off") {
    return normalized;
  }
  throw new Error("applyTextNormalization must be one of: auto, on, off");
}
function normalizeSeed(seed) {
  if (seed == null) {
    return undefined;
  }
  var next = Math.floor(seed);
  if (!Number.isFinite(next) || next < 0 || next > 4294967295) {
    throw new Error("seed must be between 0 and 4294967295");
  }
  return next;
}
function parseBooleanValue(value) {
  var normalized = value.trim().toLowerCase();
  if (["true", "1", "yes", "on"].includes(normalized)) {
    return true;
  }
  if (["false", "0", "no", "off"].includes(normalized)) {
    return false;
  }
  return undefined;
}
function parseNumberValue(value) {
  var parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
function parseTtsDirectives(text, policy) {
  if (!policy.enabled) {
    return { cleanedText: text, overrides: {}, warnings: [], hasDirective: false };
  }
  var overrides = {};
  var warnings = [];
  var cleanedText = text;
  var hasDirective = false;
  var blockRegex = /\[\[tts:text\]\]([\s\S]*?)\[\[\/tts:text\]\]/gi;
  cleanedText = cleanedText.replace(blockRegex, function (_match, inner) {
    hasDirective = true;
    if (policy.allowText && overrides.ttsText == null) {
      overrides.ttsText = inner.trim();
    }
    return "";
  });
  var directiveRegex = /\[\[tts:([^\]]+)\]\]/gi;
  cleanedText = cleanedText.replace(directiveRegex, function (_match, body) {
    var _a, _b, _c, _d, _e;
    hasDirective = true;
    var tokens = body.split(/\s+/).filter(Boolean);
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
      var token = tokens_1[_i];
      var eqIndex = token.indexOf("=");
      if (eqIndex === -1) {
        continue;
      }
      var rawKey = token.slice(0, eqIndex).trim();
      var rawValue = token.slice(eqIndex + 1).trim();
      if (!rawKey || !rawValue) {
        continue;
      }
      var key = rawKey.toLowerCase();
      try {
        switch (key) {
          case "provider":
            if (!policy.allowProvider) {
              break;
            }
            if (rawValue === "openai" || rawValue === "elevenlabs" || rawValue === "edge") {
              overrides.provider = rawValue;
            } else {
              warnings.push('unsupported provider "'.concat(rawValue, '"'));
            }
            break;
          case "voice":
          case "openai_voice":
          case "openaivoice":
            if (!policy.allowVoice) {
              break;
            }
            if (isValidOpenAIVoice(rawValue)) {
              overrides.openai = __assign(__assign({}, overrides.openai), { voice: rawValue });
            } else {
              warnings.push('invalid OpenAI voice "'.concat(rawValue, '"'));
            }
            break;
          case "voiceid":
          case "voice_id":
          case "elevenlabs_voice":
          case "elevenlabsvoice":
            if (!policy.allowVoice) {
              break;
            }
            if (isValidVoiceId(rawValue)) {
              overrides.elevenlabs = __assign(__assign({}, overrides.elevenlabs), {
                voiceId: rawValue,
              });
            } else {
              warnings.push('invalid ElevenLabs voiceId "'.concat(rawValue, '"'));
            }
            break;
          case "model":
          case "modelid":
          case "model_id":
          case "elevenlabs_model":
          case "elevenlabsmodel":
          case "openai_model":
          case "openaimodel":
            if (!policy.allowModelId) {
              break;
            }
            if (isValidOpenAIModel(rawValue)) {
              overrides.openai = __assign(__assign({}, overrides.openai), { model: rawValue });
            } else {
              overrides.elevenlabs = __assign(__assign({}, overrides.elevenlabs), {
                modelId: rawValue,
              });
            }
            break;
          case "stability":
            if (!policy.allowVoiceSettings) {
              break;
            }
            {
              var value = parseNumberValue(rawValue);
              if (value == null) {
                warnings.push("invalid stability value");
                break;
              }
              requireInRange(value, 0, 1, "stability");
              overrides.elevenlabs = __assign(__assign({}, overrides.elevenlabs), {
                voiceSettings: __assign(
                  __assign(
                    {},
                    (_a = overrides.elevenlabs) === null || _a === void 0
                      ? void 0
                      : _a.voiceSettings,
                  ),
                  { stability: value },
                ),
              });
            }
            break;
          case "similarity":
          case "similarityboost":
          case "similarity_boost":
            if (!policy.allowVoiceSettings) {
              break;
            }
            {
              var value = parseNumberValue(rawValue);
              if (value == null) {
                warnings.push("invalid similarityBoost value");
                break;
              }
              requireInRange(value, 0, 1, "similarityBoost");
              overrides.elevenlabs = __assign(__assign({}, overrides.elevenlabs), {
                voiceSettings: __assign(
                  __assign(
                    {},
                    (_b = overrides.elevenlabs) === null || _b === void 0
                      ? void 0
                      : _b.voiceSettings,
                  ),
                  { similarityBoost: value },
                ),
              });
            }
            break;
          case "style":
            if (!policy.allowVoiceSettings) {
              break;
            }
            {
              var value = parseNumberValue(rawValue);
              if (value == null) {
                warnings.push("invalid style value");
                break;
              }
              requireInRange(value, 0, 1, "style");
              overrides.elevenlabs = __assign(__assign({}, overrides.elevenlabs), {
                voiceSettings: __assign(
                  __assign(
                    {},
                    (_c = overrides.elevenlabs) === null || _c === void 0
                      ? void 0
                      : _c.voiceSettings,
                  ),
                  { style: value },
                ),
              });
            }
            break;
          case "speed":
            if (!policy.allowVoiceSettings) {
              break;
            }
            {
              var value = parseNumberValue(rawValue);
              if (value == null) {
                warnings.push("invalid speed value");
                break;
              }
              requireInRange(value, 0.5, 2, "speed");
              overrides.elevenlabs = __assign(__assign({}, overrides.elevenlabs), {
                voiceSettings: __assign(
                  __assign(
                    {},
                    (_d = overrides.elevenlabs) === null || _d === void 0
                      ? void 0
                      : _d.voiceSettings,
                  ),
                  { speed: value },
                ),
              });
            }
            break;
          case "speakerboost":
          case "speaker_boost":
          case "usespeakerboost":
          case "use_speaker_boost":
            if (!policy.allowVoiceSettings) {
              break;
            }
            {
              var value = parseBooleanValue(rawValue);
              if (value == null) {
                warnings.push("invalid useSpeakerBoost value");
                break;
              }
              overrides.elevenlabs = __assign(__assign({}, overrides.elevenlabs), {
                voiceSettings: __assign(
                  __assign(
                    {},
                    (_e = overrides.elevenlabs) === null || _e === void 0
                      ? void 0
                      : _e.voiceSettings,
                  ),
                  { useSpeakerBoost: value },
                ),
              });
            }
            break;
          case "normalize":
          case "applytextnormalization":
          case "apply_text_normalization":
            if (!policy.allowNormalization) {
              break;
            }
            overrides.elevenlabs = __assign(__assign({}, overrides.elevenlabs), {
              applyTextNormalization: normalizeApplyTextNormalization(rawValue),
            });
            break;
          case "language":
          case "languagecode":
          case "language_code":
            if (!policy.allowNormalization) {
              break;
            }
            overrides.elevenlabs = __assign(__assign({}, overrides.elevenlabs), {
              languageCode: normalizeLanguageCode(rawValue),
            });
            break;
          case "seed":
            if (!policy.allowSeed) {
              break;
            }
            overrides.elevenlabs = __assign(__assign({}, overrides.elevenlabs), {
              seed: normalizeSeed(Number.parseInt(rawValue, 10)),
            });
            break;
          default:
            break;
        }
      } catch (err) {
        warnings.push(err.message);
      }
    }
    return "";
  });
  return {
    cleanedText: cleanedText,
    ttsText: overrides.ttsText,
    hasDirective: hasDirective,
    overrides: overrides,
    warnings: warnings,
  };
}
exports.OPENAI_TTS_MODELS = ["gpt-4o-mini-tts", "tts-1", "tts-1-hd"];
/**
 * Custom OpenAI-compatible TTS endpoint.
 * When set, model/voice validation is relaxed to allow non-OpenAI models.
 * Example: OPENAI_TTS_BASE_URL=http://localhost:8880/v1
 *
 * Note: Read at runtime (not module load) to support config.env loading.
 */
function getOpenAITtsBaseUrl() {
  var _a;
  return (
    ((_a = process.env.OPENAI_TTS_BASE_URL) === null || _a === void 0 ? void 0 : _a.trim()) ||
    "https://api.openai.com/v1"
  ).replace(/\/+$/, "");
}
function isCustomOpenAIEndpoint() {
  return getOpenAITtsBaseUrl() !== "https://api.openai.com/v1";
}
exports.OPENAI_TTS_VOICES = [
  "alloy",
  "ash",
  "coral",
  "echo",
  "fable",
  "onyx",
  "nova",
  "sage",
  "shimmer",
];
function isValidOpenAIModel(model) {
  // Allow any model when using custom endpoint (e.g., Kokoro, LocalAI)
  if (isCustomOpenAIEndpoint()) {
    return true;
  }
  return exports.OPENAI_TTS_MODELS.includes(model);
}
function isValidOpenAIVoice(voice) {
  // Allow any voice when using custom endpoint (e.g., Kokoro Chinese voices)
  if (isCustomOpenAIEndpoint()) {
    return true;
  }
  return exports.OPENAI_TTS_VOICES.includes(voice);
}
function resolveSummaryModelRef(cfg, config) {
  var _a;
  var defaultRef = (0, model_selection_js_1.resolveDefaultModelForAgent)({ cfg: cfg });
  var override = (_a = config.summaryModel) === null || _a === void 0 ? void 0 : _a.trim();
  if (!override) {
    return { ref: defaultRef, source: "default" };
  }
  var aliasIndex = (0, model_selection_js_1.buildModelAliasIndex)({
    cfg: cfg,
    defaultProvider: defaultRef.provider,
  });
  var resolved = (0, model_selection_js_1.resolveModelRefFromString)({
    raw: override,
    defaultProvider: defaultRef.provider,
    aliasIndex: aliasIndex,
  });
  if (!resolved) {
    return { ref: defaultRef, source: "default" };
  }
  return { ref: resolved.ref, source: "summaryModel" };
}
function isTextContentBlock(block) {
  return block.type === "text";
}
function summarizeText(params) {
  return __awaiter(this, void 0, void 0, function () {
    var text,
      targetLength,
      cfg,
      config,
      timeoutMs,
      startTime,
      ref,
      resolved,
      apiKey,
      _a,
      controller_1,
      timeout,
      res,
      summary,
      err_1,
      error;
    var _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          ((text = params.text),
            (targetLength = params.targetLength),
            (cfg = params.cfg),
            (config = params.config),
            (timeoutMs = params.timeoutMs));
          if (targetLength < 100 || targetLength > 10000) {
            throw new Error("Invalid targetLength: ".concat(targetLength));
          }
          startTime = Date.now();
          ref = resolveSummaryModelRef(cfg, config).ref;
          resolved = (0, model_js_1.resolveModel)(ref.provider, ref.model, undefined, cfg);
          if (!resolved.model) {
            throw new Error(
              (_b = resolved.error) !== null && _b !== void 0
                ? _b
                : "Unknown summary model: ".concat(ref.provider, "/").concat(ref.model),
            );
          }
          _a = model_auth_js_1.requireApiKey;
          return [
            4 /*yield*/,
            (0, model_auth_js_1.getApiKeyForModel)({ model: resolved.model, cfg: cfg }),
          ];
        case 1:
          apiKey = _a.apply(void 0, [_c.sent(), ref.provider]);
          _c.label = 2;
        case 2:
          _c.trys.push([2, 7, , 8]);
          controller_1 = new AbortController();
          timeout = setTimeout(function () {
            return controller_1.abort();
          }, timeoutMs);
          _c.label = 3;
        case 3:
          _c.trys.push([3, , 5, 6]);
          return [
            4 /*yield*/,
            (0, pi_ai_1.completeSimple)(
              resolved.model,
              {
                messages: [
                  {
                    role: "user",
                    content:
                      "You are an assistant that summarizes texts concisely while keeping the most important information. " +
                      "Summarize the text to approximately ".concat(
                        targetLength,
                        " characters. Maintain the original tone and style. ",
                      ) +
                      "Reply only with the summary, without additional explanations.\n\n" +
                      "<text_to_summarize>\n".concat(text, "\n</text_to_summarize>"),
                    timestamp: Date.now(),
                  },
                ],
              },
              {
                apiKey: apiKey,
                maxTokens: Math.ceil(targetLength / 2),
                temperature: 0.3,
                signal: controller_1.signal,
              },
            ),
          ];
        case 4:
          res = _c.sent();
          summary = res.content
            .filter(isTextContentBlock)
            .map(function (block) {
              return block.text.trim();
            })
            .filter(Boolean)
            .join(" ")
            .trim();
          if (!summary) {
            throw new Error("No summary returned");
          }
          return [
            2 /*return*/,
            {
              summary: summary,
              latencyMs: Date.now() - startTime,
              inputLength: text.length,
              outputLength: summary.length,
            },
          ];
        case 5:
          clearTimeout(timeout);
          return [7 /*endfinally*/];
        case 6:
          return [3 /*break*/, 8];
        case 7:
          err_1 = _c.sent();
          error = err_1;
          if (error.name === "AbortError") {
            throw new Error("Summarization timed out");
          }
          throw err_1;
        case 8:
          return [2 /*return*/];
      }
    });
  });
}
function scheduleCleanup(tempDir, delayMs) {
  if (delayMs === void 0) {
    delayMs = TEMP_FILE_CLEANUP_DELAY_MS;
  }
  var timer = setTimeout(function () {
    try {
      (0, node_fs_1.rmSync)(tempDir, { recursive: true, force: true });
    } catch (_a) {
      // ignore cleanup errors
    }
  }, delayMs);
  timer.unref();
}
function elevenLabsTTS(params) {
  return __awaiter(this, void 0, void 0, function () {
    var text,
      apiKey,
      baseUrl,
      voiceId,
      modelId,
      outputFormat,
      seed,
      applyTextNormalization,
      languageCode,
      voiceSettings,
      timeoutMs,
      normalizedLanguage,
      normalizedNormalization,
      normalizedSeed,
      controller,
      timeout,
      url,
      response,
      _a,
      _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          ((text = params.text),
            (apiKey = params.apiKey),
            (baseUrl = params.baseUrl),
            (voiceId = params.voiceId),
            (modelId = params.modelId),
            (outputFormat = params.outputFormat),
            (seed = params.seed),
            (applyTextNormalization = params.applyTextNormalization),
            (languageCode = params.languageCode),
            (voiceSettings = params.voiceSettings),
            (timeoutMs = params.timeoutMs));
          if (!isValidVoiceId(voiceId)) {
            throw new Error("Invalid voiceId format");
          }
          assertElevenLabsVoiceSettings(voiceSettings);
          normalizedLanguage = normalizeLanguageCode(languageCode);
          normalizedNormalization = normalizeApplyTextNormalization(applyTextNormalization);
          normalizedSeed = normalizeSeed(seed);
          controller = new AbortController();
          timeout = setTimeout(function () {
            return controller.abort();
          }, timeoutMs);
          _c.label = 1;
        case 1:
          _c.trys.push([1, , 4, 5]);
          url = new URL(
            "".concat(normalizeElevenLabsBaseUrl(baseUrl), "/v1/text-to-speech/").concat(voiceId),
          );
          if (outputFormat) {
            url.searchParams.set("output_format", outputFormat);
          }
          return [
            4 /*yield*/,
            fetch(url.toString(), {
              method: "POST",
              headers: {
                "xi-api-key": apiKey,
                "Content-Type": "application/json",
                Accept: "audio/mpeg",
              },
              body: JSON.stringify({
                text: text,
                model_id: modelId,
                seed: normalizedSeed,
                apply_text_normalization: normalizedNormalization,
                language_code: normalizedLanguage,
                voice_settings: {
                  stability: voiceSettings.stability,
                  similarity_boost: voiceSettings.similarityBoost,
                  style: voiceSettings.style,
                  use_speaker_boost: voiceSettings.useSpeakerBoost,
                  speed: voiceSettings.speed,
                },
              }),
              signal: controller.signal,
            }),
          ];
        case 2:
          response = _c.sent();
          if (!response.ok) {
            throw new Error("ElevenLabs API error (".concat(response.status, ")"));
          }
          _b = (_a = Buffer).from;
          return [4 /*yield*/, response.arrayBuffer()];
        case 3:
          return [2 /*return*/, _b.apply(_a, [_c.sent()])];
        case 4:
          clearTimeout(timeout);
          return [7 /*endfinally*/];
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
function openaiTTS(params) {
  return __awaiter(this, void 0, void 0, function () {
    var text,
      apiKey,
      model,
      voice,
      responseFormat,
      timeoutMs,
      controller,
      timeout,
      response,
      _a,
      _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          ((text = params.text),
            (apiKey = params.apiKey),
            (model = params.model),
            (voice = params.voice),
            (responseFormat = params.responseFormat),
            (timeoutMs = params.timeoutMs));
          if (!isValidOpenAIModel(model)) {
            throw new Error("Invalid model: ".concat(model));
          }
          if (!isValidOpenAIVoice(voice)) {
            throw new Error("Invalid voice: ".concat(voice));
          }
          controller = new AbortController();
          timeout = setTimeout(function () {
            return controller.abort();
          }, timeoutMs);
          _c.label = 1;
        case 1:
          _c.trys.push([1, , 4, 5]);
          return [
            4 /*yield*/,
            fetch("".concat(getOpenAITtsBaseUrl(), "/audio/speech"), {
              method: "POST",
              headers: {
                Authorization: "Bearer ".concat(apiKey),
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: model,
                input: text,
                voice: voice,
                response_format: responseFormat,
              }),
              signal: controller.signal,
            }),
          ];
        case 2:
          response = _c.sent();
          if (!response.ok) {
            throw new Error("OpenAI TTS API error (".concat(response.status, ")"));
          }
          _b = (_a = Buffer).from;
          return [4 /*yield*/, response.arrayBuffer()];
        case 3:
          return [2 /*return*/, _b.apply(_a, [_c.sent()])];
        case 4:
          clearTimeout(timeout);
          return [7 /*endfinally*/];
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
function inferEdgeExtension(outputFormat) {
  var normalized = outputFormat.toLowerCase();
  if (normalized.includes("webm")) {
    return ".webm";
  }
  if (normalized.includes("ogg")) {
    return ".ogg";
  }
  if (normalized.includes("opus")) {
    return ".opus";
  }
  if (normalized.includes("wav") || normalized.includes("riff") || normalized.includes("pcm")) {
    return ".wav";
  }
  return ".mp3";
}
function edgeTTS(params) {
  return __awaiter(this, void 0, void 0, function () {
    var text, outputPath, config, timeoutMs, tts;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          ((text = params.text),
            (outputPath = params.outputPath),
            (config = params.config),
            (timeoutMs = params.timeoutMs));
          tts = new node_edge_tts_1.EdgeTTS({
            voice: config.voice,
            lang: config.lang,
            outputFormat: config.outputFormat,
            saveSubtitles: config.saveSubtitles,
            proxy: config.proxy,
            rate: config.rate,
            pitch: config.pitch,
            volume: config.volume,
            timeout: (_a = config.timeoutMs) !== null && _a !== void 0 ? _a : timeoutMs,
          });
          return [4 /*yield*/, tts.ttsPromise(text, outputPath)];
        case 1:
          _b.sent();
          return [2 /*return*/];
      }
    });
  });
}
function textToSpeech(params) {
  return __awaiter(this, void 0, void 0, function () {
    var config,
      prefsPath,
      channelId,
      output,
      userProvider,
      overrideProvider,
      provider,
      providers,
      lastError,
      _loop_1,
      _i,
      providers_1,
      provider_1,
      state_1;
    var _this = this;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    return __generator(this, function (_u) {
      switch (_u.label) {
        case 0:
          config = resolveTtsConfig(params.cfg);
          prefsPath =
            (_a = params.prefsPath) !== null && _a !== void 0 ? _a : resolveTtsPrefsPath(config);
          channelId = resolveChannelId(params.channel);
          output = resolveOutputFormat(channelId);
          if (params.text.length > config.maxTextLength) {
            return [
              2 /*return*/,
              {
                success: false,
                error: "Text too long ("
                  .concat(params.text.length, " chars, max ")
                  .concat(config.maxTextLength, ")"),
              },
            ];
          }
          userProvider = getTtsProvider(config, prefsPath);
          overrideProvider =
            (_b = params.overrides) === null || _b === void 0 ? void 0 : _b.provider;
          provider =
            overrideProvider !== null && overrideProvider !== void 0
              ? overrideProvider
              : userProvider;
          providers = resolveTtsProviderOrder(provider);
          _loop_1 = function (provider_1) {
            var providerStart,
              tempDir_1,
              edgeOutputFormat,
              fallbackEdgeOutputFormat,
              attemptEdgeTts,
              edgeResult,
              err_2,
              fallbackErr_1,
              voiceCompatible,
              apiKey,
              audioBuffer,
              voiceIdOverride,
              modelIdOverride,
              voiceSettings,
              seedOverride,
              normalizationOverride,
              languageOverride,
              openaiModelOverride,
              openaiVoiceOverride,
              latencyMs,
              tempDir,
              audioPath,
              err_3,
              error;
            return __generator(this, function (_v) {
              switch (_v.label) {
                case 0:
                  providerStart = Date.now();
                  _v.label = 1;
                case 1:
                  _v.trys.push([1, 17, , 18]);
                  if (!(provider_1 === "edge")) {
                    return [3 /*break*/, 12];
                  }
                  if (!config.edge.enabled) {
                    lastError = "edge: disabled";
                    return [2 /*return*/, "continue"];
                  }
                  tempDir_1 = (0, node_fs_1.mkdtempSync)(
                    node_path_1.default.join((0, node_os_1.tmpdir)(), "tts-"),
                  );
                  edgeOutputFormat = resolveEdgeOutputFormat(config);
                  fallbackEdgeOutputFormat =
                    edgeOutputFormat !== DEFAULT_EDGE_OUTPUT_FORMAT
                      ? DEFAULT_EDGE_OUTPUT_FORMAT
                      : undefined;
                  attemptEdgeTts = function (outputFormat) {
                    return __awaiter(_this, void 0, void 0, function () {
                      var extension, audioPath;
                      return __generator(this, function (_a) {
                        switch (_a.label) {
                          case 0:
                            extension = inferEdgeExtension(outputFormat);
                            audioPath = node_path_1.default.join(
                              tempDir_1,
                              "voice-".concat(Date.now()).concat(extension),
                            );
                            return [
                              4 /*yield*/,
                              edgeTTS({
                                text: params.text,
                                outputPath: audioPath,
                                config: __assign(__assign({}, config.edge), {
                                  outputFormat: outputFormat,
                                }),
                                timeoutMs: config.timeoutMs,
                              }),
                            ];
                          case 1:
                            _a.sent();
                            return [
                              2 /*return*/,
                              { audioPath: audioPath, outputFormat: outputFormat },
                            ];
                        }
                      });
                    });
                  };
                  edgeResult = void 0;
                  _v.label = 2;
                case 2:
                  _v.trys.push([2, 4, , 11]);
                  return [4 /*yield*/, attemptEdgeTts(edgeOutputFormat)];
                case 3:
                  edgeResult = _v.sent();
                  return [3 /*break*/, 11];
                case 4:
                  err_2 = _v.sent();
                  if (
                    !(fallbackEdgeOutputFormat && fallbackEdgeOutputFormat !== edgeOutputFormat)
                  ) {
                    return [3 /*break*/, 9];
                  }
                  (0, globals_js_1.logVerbose)(
                    "TTS: Edge output "
                      .concat(edgeOutputFormat, " failed; retrying with ")
                      .concat(fallbackEdgeOutputFormat, "."),
                  );
                  edgeOutputFormat = fallbackEdgeOutputFormat;
                  _v.label = 5;
                case 5:
                  _v.trys.push([5, 7, , 8]);
                  return [4 /*yield*/, attemptEdgeTts(edgeOutputFormat)];
                case 6:
                  edgeResult = _v.sent();
                  return [3 /*break*/, 8];
                case 7:
                  fallbackErr_1 = _v.sent();
                  try {
                    (0, node_fs_1.rmSync)(tempDir_1, { recursive: true, force: true });
                  } catch (_w) {
                    // ignore cleanup errors
                  }
                  throw fallbackErr_1;
                case 8:
                  return [3 /*break*/, 10];
                case 9:
                  try {
                    (0, node_fs_1.rmSync)(tempDir_1, { recursive: true, force: true });
                  } catch (_x) {
                    // ignore cleanup errors
                  }
                  throw err_2;
                case 10:
                  return [3 /*break*/, 11];
                case 11:
                  scheduleCleanup(tempDir_1);
                  voiceCompatible = (0, audio_js_1.isVoiceCompatibleAudio)({
                    fileName: edgeResult.audioPath,
                  });
                  return [
                    2 /*return*/,
                    {
                      value: {
                        success: true,
                        audioPath: edgeResult.audioPath,
                        latencyMs: Date.now() - providerStart,
                        provider: provider_1,
                        outputFormat: edgeResult.outputFormat,
                        voiceCompatible: voiceCompatible,
                      },
                    },
                  ];
                case 12:
                  apiKey = resolveTtsApiKey(config, provider_1);
                  if (!apiKey) {
                    lastError = "No API key for ".concat(provider_1);
                    return [2 /*return*/, "continue"];
                  }
                  audioBuffer = void 0;
                  if (!(provider_1 === "elevenlabs")) {
                    return [3 /*break*/, 14];
                  }
                  voiceIdOverride =
                    (_d =
                      (_c = params.overrides) === null || _c === void 0
                        ? void 0
                        : _c.elevenlabs) === null || _d === void 0
                      ? void 0
                      : _d.voiceId;
                  modelIdOverride =
                    (_f =
                      (_e = params.overrides) === null || _e === void 0
                        ? void 0
                        : _e.elevenlabs) === null || _f === void 0
                      ? void 0
                      : _f.modelId;
                  voiceSettings = __assign(
                    __assign({}, config.elevenlabs.voiceSettings),
                    (_h =
                      (_g = params.overrides) === null || _g === void 0
                        ? void 0
                        : _g.elevenlabs) === null || _h === void 0
                      ? void 0
                      : _h.voiceSettings,
                  );
                  seedOverride =
                    (_k =
                      (_j = params.overrides) === null || _j === void 0
                        ? void 0
                        : _j.elevenlabs) === null || _k === void 0
                      ? void 0
                      : _k.seed;
                  normalizationOverride =
                    (_m =
                      (_l = params.overrides) === null || _l === void 0
                        ? void 0
                        : _l.elevenlabs) === null || _m === void 0
                      ? void 0
                      : _m.applyTextNormalization;
                  languageOverride =
                    (_p =
                      (_o = params.overrides) === null || _o === void 0
                        ? void 0
                        : _o.elevenlabs) === null || _p === void 0
                      ? void 0
                      : _p.languageCode;
                  return [
                    4 /*yield*/,
                    elevenLabsTTS({
                      text: params.text,
                      apiKey: apiKey,
                      baseUrl: config.elevenlabs.baseUrl,
                      voiceId:
                        voiceIdOverride !== null && voiceIdOverride !== void 0
                          ? voiceIdOverride
                          : config.elevenlabs.voiceId,
                      modelId:
                        modelIdOverride !== null && modelIdOverride !== void 0
                          ? modelIdOverride
                          : config.elevenlabs.modelId,
                      outputFormat: output.elevenlabs,
                      seed:
                        seedOverride !== null && seedOverride !== void 0
                          ? seedOverride
                          : config.elevenlabs.seed,
                      applyTextNormalization:
                        normalizationOverride !== null && normalizationOverride !== void 0
                          ? normalizationOverride
                          : config.elevenlabs.applyTextNormalization,
                      languageCode:
                        languageOverride !== null && languageOverride !== void 0
                          ? languageOverride
                          : config.elevenlabs.languageCode,
                      voiceSettings: voiceSettings,
                      timeoutMs: config.timeoutMs,
                    }),
                  ];
                case 13:
                  audioBuffer = _v.sent();
                  return [3 /*break*/, 16];
                case 14:
                  openaiModelOverride =
                    (_r =
                      (_q = params.overrides) === null || _q === void 0 ? void 0 : _q.openai) ===
                      null || _r === void 0
                      ? void 0
                      : _r.model;
                  openaiVoiceOverride =
                    (_t =
                      (_s = params.overrides) === null || _s === void 0 ? void 0 : _s.openai) ===
                      null || _t === void 0
                      ? void 0
                      : _t.voice;
                  return [
                    4 /*yield*/,
                    openaiTTS({
                      text: params.text,
                      apiKey: apiKey,
                      model:
                        openaiModelOverride !== null && openaiModelOverride !== void 0
                          ? openaiModelOverride
                          : config.openai.model,
                      voice:
                        openaiVoiceOverride !== null && openaiVoiceOverride !== void 0
                          ? openaiVoiceOverride
                          : config.openai.voice,
                      responseFormat: output.openai,
                      timeoutMs: config.timeoutMs,
                    }),
                  ];
                case 15:
                  audioBuffer = _v.sent();
                  _v.label = 16;
                case 16:
                  latencyMs = Date.now() - providerStart;
                  tempDir = (0, node_fs_1.mkdtempSync)(
                    node_path_1.default.join((0, node_os_1.tmpdir)(), "tts-"),
                  );
                  audioPath = node_path_1.default.join(
                    tempDir,
                    "voice-".concat(Date.now()).concat(output.extension),
                  );
                  (0, node_fs_1.writeFileSync)(audioPath, audioBuffer);
                  scheduleCleanup(tempDir);
                  return [
                    2 /*return*/,
                    {
                      value: {
                        success: true,
                        audioPath: audioPath,
                        latencyMs: latencyMs,
                        provider: provider_1,
                        outputFormat: provider_1 === "openai" ? output.openai : output.elevenlabs,
                        voiceCompatible: output.voiceCompatible,
                      },
                    },
                  ];
                case 17:
                  err_3 = _v.sent();
                  error = err_3;
                  if (error.name === "AbortError") {
                    lastError = "".concat(provider_1, ": request timed out");
                  } else {
                    lastError = "".concat(provider_1, ": ").concat(error.message);
                  }
                  return [3 /*break*/, 18];
                case 18:
                  return [2 /*return*/];
              }
            });
          };
          ((_i = 0), (providers_1 = providers));
          _u.label = 1;
        case 1:
          if (!(_i < providers_1.length)) {
            return [3 /*break*/, 4];
          }
          provider_1 = providers_1[_i];
          return [5 /*yield**/, _loop_1(provider_1)];
        case 2:
          state_1 = _u.sent();
          if (typeof state_1 === "object") {
            return [2 /*return*/, state_1.value];
          }
          _u.label = 3;
        case 3:
          _i++;
          return [3 /*break*/, 1];
        case 4:
          return [
            2 /*return*/,
            {
              success: false,
              error: "TTS conversion failed: ".concat(lastError || "no providers available"),
            },
          ];
      }
    });
  });
}
function textToSpeechTelephony(params) {
  return __awaiter(this, void 0, void 0, function () {
    var config,
      prefsPath,
      userProvider,
      providers,
      lastError,
      _i,
      providers_2,
      provider,
      providerStart,
      apiKey,
      output_1,
      audioBuffer_1,
      output,
      audioBuffer,
      err_4,
      error;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          config = resolveTtsConfig(params.cfg);
          prefsPath =
            (_a = params.prefsPath) !== null && _a !== void 0 ? _a : resolveTtsPrefsPath(config);
          if (params.text.length > config.maxTextLength) {
            return [
              2 /*return*/,
              {
                success: false,
                error: "Text too long ("
                  .concat(params.text.length, " chars, max ")
                  .concat(config.maxTextLength, ")"),
              },
            ];
          }
          userProvider = getTtsProvider(config, prefsPath);
          providers = resolveTtsProviderOrder(userProvider);
          ((_i = 0), (providers_2 = providers));
          _b.label = 1;
        case 1:
          if (!(_i < providers_2.length)) {
            return [3 /*break*/, 8];
          }
          provider = providers_2[_i];
          providerStart = Date.now();
          _b.label = 2;
        case 2:
          _b.trys.push([2, 6, , 7]);
          if (provider === "edge") {
            lastError = "edge: unsupported for telephony";
            return [3 /*break*/, 7];
          }
          apiKey = resolveTtsApiKey(config, provider);
          if (!apiKey) {
            lastError = "No API key for ".concat(provider);
            return [3 /*break*/, 7];
          }
          if (!(provider === "elevenlabs")) {
            return [3 /*break*/, 4];
          }
          output_1 = TELEPHONY_OUTPUT.elevenlabs;
          return [
            4 /*yield*/,
            elevenLabsTTS({
              text: params.text,
              apiKey: apiKey,
              baseUrl: config.elevenlabs.baseUrl,
              voiceId: config.elevenlabs.voiceId,
              modelId: config.elevenlabs.modelId,
              outputFormat: output_1.format,
              seed: config.elevenlabs.seed,
              applyTextNormalization: config.elevenlabs.applyTextNormalization,
              languageCode: config.elevenlabs.languageCode,
              voiceSettings: config.elevenlabs.voiceSettings,
              timeoutMs: config.timeoutMs,
            }),
          ];
        case 3:
          audioBuffer_1 = _b.sent();
          return [
            2 /*return*/,
            {
              success: true,
              audioBuffer: audioBuffer_1,
              latencyMs: Date.now() - providerStart,
              provider: provider,
              outputFormat: output_1.format,
              sampleRate: output_1.sampleRate,
            },
          ];
        case 4:
          output = TELEPHONY_OUTPUT.openai;
          return [
            4 /*yield*/,
            openaiTTS({
              text: params.text,
              apiKey: apiKey,
              model: config.openai.model,
              voice: config.openai.voice,
              responseFormat: output.format,
              timeoutMs: config.timeoutMs,
            }),
          ];
        case 5:
          audioBuffer = _b.sent();
          return [
            2 /*return*/,
            {
              success: true,
              audioBuffer: audioBuffer,
              latencyMs: Date.now() - providerStart,
              provider: provider,
              outputFormat: output.format,
              sampleRate: output.sampleRate,
            },
          ];
        case 6:
          err_4 = _b.sent();
          error = err_4;
          if (error.name === "AbortError") {
            lastError = "".concat(provider, ": request timed out");
          } else {
            lastError = "".concat(provider, ": ").concat(error.message);
          }
          return [3 /*break*/, 7];
        case 7:
          _i++;
          return [3 /*break*/, 1];
        case 8:
          return [
            2 /*return*/,
            {
              success: false,
              error: "TTS conversion failed: ".concat(lastError || "no providers available"),
            },
          ];
      }
    });
  });
}
function maybeApplyTtsToPayload(params) {
  return __awaiter(this, void 0, void 0, function () {
    var config,
      prefsPath,
      autoMode,
      text,
      directives,
      cleanedText,
      trimmedCleaned,
      visibleText,
      ttsText,
      nextPayload,
      mode,
      maxLength,
      textForAudio,
      wasSummarized,
      summary,
      err_5,
      error,
      ttsStart,
      result,
      channelId,
      shouldVoice,
      finalPayload,
      latency;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          config = resolveTtsConfig(params.cfg);
          prefsPath = resolveTtsPrefsPath(config);
          autoMode = resolveTtsAutoMode({
            config: config,
            prefsPath: prefsPath,
            sessionAuto: params.ttsAuto,
          });
          if (autoMode === "off") {
            return [2 /*return*/, params.payload];
          }
          text = (_a = params.payload.text) !== null && _a !== void 0 ? _a : "";
          directives = parseTtsDirectives(text, config.modelOverrides);
          if (directives.warnings.length > 0) {
            (0, globals_js_1.logVerbose)(
              "TTS: ignored directive overrides (".concat(directives.warnings.join("; "), ")"),
            );
          }
          cleanedText = directives.cleanedText;
          trimmedCleaned = cleanedText.trim();
          visibleText = trimmedCleaned.length > 0 ? trimmedCleaned : "";
          ttsText =
            ((_b = directives.ttsText) === null || _b === void 0 ? void 0 : _b.trim()) ||
            visibleText;
          nextPayload =
            visibleText === text.trim()
              ? params.payload
              : __assign(__assign({}, params.payload), {
                  text: visibleText.length > 0 ? visibleText : undefined,
                });
          if (autoMode === "tagged" && !directives.hasDirective) {
            return [2 /*return*/, nextPayload];
          }
          if (autoMode === "inbound" && params.inboundAudio !== true) {
            return [2 /*return*/, nextPayload];
          }
          mode = (_c = config.mode) !== null && _c !== void 0 ? _c : "final";
          if (mode === "final" && params.kind && params.kind !== "final") {
            return [2 /*return*/, nextPayload];
          }
          if (!ttsText.trim()) {
            return [2 /*return*/, nextPayload];
          }
          if (
            params.payload.mediaUrl ||
            ((_e =
              (_d = params.payload.mediaUrls) === null || _d === void 0 ? void 0 : _d.length) !==
              null && _e !== void 0
              ? _e
              : 0) > 0
          ) {
            return [2 /*return*/, nextPayload];
          }
          if (text.includes("MEDIA:")) {
            return [2 /*return*/, nextPayload];
          }
          if (ttsText.trim().length < 10) {
            return [2 /*return*/, nextPayload];
          }
          maxLength = getTtsMaxLength(prefsPath);
          textForAudio = ttsText.trim();
          wasSummarized = false;
          if (!(textForAudio.length > maxLength)) {
            return [3 /*break*/, 4];
          }
          if (!!isSummarizationEnabled(prefsPath)) {
            return [3 /*break*/, 1];
          }
          // Truncate text when summarization is disabled
          (0, globals_js_1.logVerbose)(
            "TTS: truncating long text ("
              .concat(textForAudio.length, " > ")
              .concat(maxLength, "), summarization disabled."),
          );
          textForAudio = "".concat(textForAudio.slice(0, maxLength - 3), "...");
          return [3 /*break*/, 4];
        case 1:
          _g.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            summarizeText({
              text: textForAudio,
              targetLength: maxLength,
              cfg: params.cfg,
              config: config,
              timeoutMs: config.timeoutMs,
            }),
          ];
        case 2:
          summary = _g.sent();
          textForAudio = summary.summary;
          wasSummarized = true;
          if (textForAudio.length > config.maxTextLength) {
            (0, globals_js_1.logVerbose)(
              "TTS: summary exceeded hard limit ("
                .concat(textForAudio.length, " > ")
                .concat(config.maxTextLength, "); truncating."),
            );
            textForAudio = "".concat(textForAudio.slice(0, config.maxTextLength - 3), "...");
          }
          return [3 /*break*/, 4];
        case 3:
          err_5 = _g.sent();
          error = err_5;
          (0, globals_js_1.logVerbose)(
            "TTS: summarization failed, truncating instead: ".concat(error.message),
          );
          textForAudio = "".concat(textForAudio.slice(0, maxLength - 3), "...");
          return [3 /*break*/, 4];
        case 4:
          ttsStart = Date.now();
          return [
            4 /*yield*/,
            textToSpeech({
              text: textForAudio,
              cfg: params.cfg,
              prefsPath: prefsPath,
              channel: params.channel,
              overrides: directives.overrides,
            }),
          ];
        case 5:
          result = _g.sent();
          if (result.success && result.audioPath) {
            lastTtsAttempt = {
              timestamp: Date.now(),
              success: true,
              textLength: text.length,
              summarized: wasSummarized,
              provider: result.provider,
              latencyMs: result.latencyMs,
            };
            channelId = resolveChannelId(params.channel);
            shouldVoice = channelId === "telegram" && result.voiceCompatible === true;
            finalPayload = __assign(__assign({}, nextPayload), {
              mediaUrl: result.audioPath,
              audioAsVoice: shouldVoice || params.payload.audioAsVoice,
            });
            return [2 /*return*/, finalPayload];
          }
          lastTtsAttempt = {
            timestamp: Date.now(),
            success: false,
            textLength: text.length,
            summarized: wasSummarized,
            error: result.error,
          };
          latency = Date.now() - ttsStart;
          (0, globals_js_1.logVerbose)(
            "TTS: conversion failed after "
              .concat(latency, "ms (")
              .concat((_f = result.error) !== null && _f !== void 0 ? _f : "unknown", ")."),
          );
          return [2 /*return*/, nextPayload];
      }
    });
  });
}
exports._test = {
  isValidVoiceId: isValidVoiceId,
  isValidOpenAIVoice: isValidOpenAIVoice,
  isValidOpenAIModel: isValidOpenAIModel,
  OPENAI_TTS_MODELS: exports.OPENAI_TTS_MODELS,
  OPENAI_TTS_VOICES: exports.OPENAI_TTS_VOICES,
  parseTtsDirectives: parseTtsDirectives,
  resolveModelOverridePolicy: resolveModelOverridePolicy,
  summarizeText: summarizeText,
  resolveOutputFormat: resolveOutputFormat,
  resolveEdgeOutputFormat: resolveEdgeOutputFormat,
};
