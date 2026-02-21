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
exports.handleTtsCommands = void 0;
var globals_js_1 = require("../../globals.js");
var tts_js_1 = require("../../tts/tts.js");
function parseTtsCommand(normalized) {
  // Accept `/tts` and `/tts <action> [args]` as a single control surface.
  if (normalized === "/tts") {
    return { action: "status", args: "" };
  }
  if (!normalized.startsWith("/tts ")) {
    return null;
  }
  var rest = normalized.slice(5).trim();
  if (!rest) {
    return { action: "status", args: "" };
  }
  var _a = rest.split(/\s+/),
    action = _a[0],
    tail = _a.slice(1);
  return { action: action.toLowerCase(), args: tail.join(" ").trim() };
}
function ttsUsage() {
  // Keep usage in one place so help/validation stays consistent.
  return {
    text:
      "\uD83D\uDD0A **TTS (Text-to-Speech) Help**\n\n" +
      "**Commands:**\n" +
      "\u2022 /tts on \u2014 Enable automatic TTS for replies\n" +
      "\u2022 /tts off \u2014 Disable TTS\n" +
      "\u2022 /tts status \u2014 Show current settings\n" +
      "\u2022 /tts provider [name] \u2014 View/change provider\n" +
      "\u2022 /tts limit [number] \u2014 View/change text limit\n" +
      "\u2022 /tts summary [on|off] \u2014 View/change auto-summary\n" +
      "\u2022 /tts audio <text> \u2014 Generate audio from text\n\n" +
      "**Providers:**\n" +
      "\u2022 edge \u2014 Free, fast (default)\n" +
      "\u2022 openai \u2014 High quality (requires API key)\n" +
      "\u2022 elevenlabs \u2014 Premium voices (requires API key)\n\n" +
      "**Text Limit (default: 1500, max: 4096):**\n" +
      "When text exceeds the limit:\n" +
      "\u2022 Summary ON: AI summarizes, then generates audio\n" +
      "\u2022 Summary OFF: Truncates text, then generates audio\n\n" +
      "**Examples:**\n" +
      "/tts provider edge\n" +
      "/tts limit 2000\n" +
      "/tts audio Hello, this is a test!",
  };
}
var handleTtsCommands = function (params, allowTextCommands) {
  return __awaiter(void 0, void 0, void 0, function () {
    var parsed,
      config,
      prefsPath,
      action,
      args,
      start,
      result,
      payload,
      currentProvider,
      hasOpenAI,
      hasElevenLabs,
      hasEdge,
      requested,
      currentLimit,
      next,
      enabled,
      maxLen,
      requested,
      enabled,
      provider,
      hasKey,
      maxLength,
      summarize,
      last,
      lines,
      timeAgo;
    var _a, _b, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          if (!allowTextCommands) {
            return [2 /*return*/, null];
          }
          parsed = parseTtsCommand(params.command.commandBodyNormalized);
          if (!parsed) {
            return [2 /*return*/, null];
          }
          if (!params.command.isAuthorizedSender) {
            (0, globals_js_1.logVerbose)(
              "Ignoring TTS command from unauthorized sender: ".concat(
                params.command.senderId || "<unknown>",
              ),
            );
            return [2 /*return*/, { shouldContinue: false }];
          }
          config = (0, tts_js_1.resolveTtsConfig)(params.cfg);
          prefsPath = (0, tts_js_1.resolveTtsPrefsPath)(config);
          action = parsed.action;
          args = parsed.args;
          if (action === "help") {
            return [2 /*return*/, { shouldContinue: false, reply: ttsUsage() }];
          }
          if (action === "on") {
            (0, tts_js_1.setTtsEnabled)(prefsPath, true);
            return [2 /*return*/, { shouldContinue: false, reply: { text: "🔊 TTS enabled." } }];
          }
          if (action === "off") {
            (0, tts_js_1.setTtsEnabled)(prefsPath, false);
            return [2 /*return*/, { shouldContinue: false, reply: { text: "🔇 TTS disabled." } }];
          }
          if (!(action === "audio")) {
            return [3 /*break*/, 2];
          }
          if (!args.trim()) {
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: {
                  text:
                    "\uD83C\uDFA4 Generate audio from text.\n\n" +
                    "Usage: /tts audio <text>\n" +
                    "Example: /tts audio Hello, this is a test!",
                },
              },
            ];
          }
          start = Date.now();
          return [
            4 /*yield*/,
            (0, tts_js_1.textToSpeech)({
              text: args,
              cfg: params.cfg,
              channel: params.command.channel,
              prefsPath: prefsPath,
            }),
          ];
        case 1:
          result = _d.sent();
          if (result.success && result.audioPath) {
            // Store last attempt for `/tts status`.
            (0, tts_js_1.setLastTtsAttempt)({
              timestamp: Date.now(),
              success: true,
              textLength: args.length,
              summarized: false,
              provider: result.provider,
              latencyMs: result.latencyMs,
            });
            payload = {
              mediaUrl: result.audioPath,
              audioAsVoice: result.voiceCompatible === true,
            };
            return [2 /*return*/, { shouldContinue: false, reply: payload }];
          }
          // Store failure details for `/tts status`.
          (0, tts_js_1.setLastTtsAttempt)({
            timestamp: Date.now(),
            success: false,
            textLength: args.length,
            summarized: false,
            error: result.error,
            latencyMs: Date.now() - start,
          });
          return [
            2 /*return*/,
            {
              shouldContinue: false,
              reply: {
                text: "\u274C Error generating audio: ".concat(
                  (_a = result.error) !== null && _a !== void 0 ? _a : "unknown error",
                ),
              },
            },
          ];
        case 2:
          if (action === "provider") {
            currentProvider = (0, tts_js_1.getTtsProvider)(config, prefsPath);
            if (!args.trim()) {
              hasOpenAI = Boolean((0, tts_js_1.resolveTtsApiKey)(config, "openai"));
              hasElevenLabs = Boolean((0, tts_js_1.resolveTtsApiKey)(config, "elevenlabs"));
              hasEdge = (0, tts_js_1.isTtsProviderConfigured)(config, "edge");
              return [
                2 /*return*/,
                {
                  shouldContinue: false,
                  reply: {
                    text:
                      "\uD83C\uDF99\uFE0F TTS provider\n" +
                      "Primary: ".concat(currentProvider, "\n") +
                      "OpenAI key: ".concat(hasOpenAI ? "✅" : "❌", "\n") +
                      "ElevenLabs key: ".concat(hasElevenLabs ? "✅" : "❌", "\n") +
                      "Edge enabled: ".concat(hasEdge ? "✅" : "❌", "\n") +
                      "Usage: /tts provider openai | elevenlabs | edge",
                  },
                },
              ];
            }
            requested = args.trim().toLowerCase();
            if (requested !== "openai" && requested !== "elevenlabs" && requested !== "edge") {
              return [2 /*return*/, { shouldContinue: false, reply: ttsUsage() }];
            }
            (0, tts_js_1.setTtsProvider)(prefsPath, requested);
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: { text: "\u2705 TTS provider set to ".concat(requested, ".") },
              },
            ];
          }
          if (action === "limit") {
            if (!args.trim()) {
              currentLimit = (0, tts_js_1.getTtsMaxLength)(prefsPath);
              return [
                2 /*return*/,
                {
                  shouldContinue: false,
                  reply: {
                    text:
                      "\uD83D\uDCCF TTS limit: ".concat(currentLimit, " characters.\n\n") +
                      "Text longer than this triggers summary (if enabled).\n" +
                      "Range: 100-4096 chars (Telegram max).\n\n" +
                      "To change: /tts limit <number>\n" +
                      "Example: /tts limit 2000",
                  },
                },
              ];
            }
            next = Number.parseInt(args.trim(), 10);
            if (!Number.isFinite(next) || next < 100 || next > 4096) {
              return [
                2 /*return*/,
                {
                  shouldContinue: false,
                  reply: { text: "❌ Limit must be between 100 and 4096 characters." },
                },
              ];
            }
            (0, tts_js_1.setTtsMaxLength)(prefsPath, next);
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: { text: "\u2705 TTS limit set to ".concat(next, " characters.") },
              },
            ];
          }
          if (action === "summary") {
            if (!args.trim()) {
              enabled = (0, tts_js_1.isSummarizationEnabled)(prefsPath);
              maxLen = (0, tts_js_1.getTtsMaxLength)(prefsPath);
              return [
                2 /*return*/,
                {
                  shouldContinue: false,
                  reply: {
                    text:
                      "\uD83D\uDCDD TTS auto-summary: ".concat(enabled ? "on" : "off", ".\n\n") +
                      "When text exceeds ".concat(maxLen, " chars:\n") +
                      "\u2022 ON: summarizes text, then generates audio\n" +
                      "\u2022 OFF: truncates text, then generates audio\n\n" +
                      "To change: /tts summary on | off",
                  },
                },
              ];
            }
            requested = args.trim().toLowerCase();
            if (requested !== "on" && requested !== "off") {
              return [2 /*return*/, { shouldContinue: false, reply: ttsUsage() }];
            }
            (0, tts_js_1.setSummarizationEnabled)(prefsPath, requested === "on");
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: {
                  text:
                    requested === "on"
                      ? "✅ TTS auto-summary enabled."
                      : "❌ TTS auto-summary disabled.",
                },
              },
            ];
          }
          if (action === "status") {
            enabled = (0, tts_js_1.isTtsEnabled)(config, prefsPath);
            provider = (0, tts_js_1.getTtsProvider)(config, prefsPath);
            hasKey = (0, tts_js_1.isTtsProviderConfigured)(config, provider);
            maxLength = (0, tts_js_1.getTtsMaxLength)(prefsPath);
            summarize = (0, tts_js_1.isSummarizationEnabled)(prefsPath);
            last = (0, tts_js_1.getLastTtsAttempt)();
            lines = [
              "📊 TTS status",
              "State: ".concat(enabled ? "✅ enabled" : "❌ disabled"),
              "Provider: "
                .concat(provider, " (")
                .concat(hasKey ? "✅ configured" : "❌ not configured", ")"),
              "Text limit: ".concat(maxLength, " chars"),
              "Auto-summary: ".concat(summarize ? "on" : "off"),
            ];
            if (last) {
              timeAgo = Math.round((Date.now() - last.timestamp) / 1000);
              lines.push("");
              lines.push(
                "Last attempt (".concat(timeAgo, "s ago): ").concat(last.success ? "✅" : "❌"),
              );
              lines.push(
                "Text: "
                  .concat(last.textLength, " chars")
                  .concat(last.summarized ? " (summarized)" : ""),
              );
              if (last.success) {
                lines.push(
                  "Provider: ".concat(
                    (_b = last.provider) !== null && _b !== void 0 ? _b : "unknown",
                  ),
                );
                lines.push(
                  "Latency: ".concat(
                    (_c = last.latencyMs) !== null && _c !== void 0 ? _c : 0,
                    "ms",
                  ),
                );
              } else if (last.error) {
                lines.push("Error: ".concat(last.error));
              }
            }
            return [2 /*return*/, { shouldContinue: false, reply: { text: lines.join("\n") } }];
          }
          return [2 /*return*/, { shouldContinue: false, reply: ttsUsage() }];
      }
    });
  });
};
exports.handleTtsCommands = handleTtsCommands;
