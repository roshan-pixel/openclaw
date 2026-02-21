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
exports.createTtsTool = createTtsTool;
var typebox_1 = require("@sinclair/typebox");
var config_js_1 = require("../../config/config.js");
var tts_js_1 = require("../../tts/tts.js");
var common_js_1 = require("./common.js");
var TtsToolSchema = typebox_1.Type.Object({
  text: typebox_1.Type.String({ description: "Text to convert to speech." }),
  channel: typebox_1.Type.Optional(
    typebox_1.Type.String({
      description: "Optional channel id to pick output format (e.g. telegram).",
    }),
  ),
});
function createTtsTool(opts) {
  var _this = this;
  return {
    label: "TTS",
    name: "tts",
    description:
      "Convert text to speech and return a MEDIA: path. Use when the user requests audio or TTS is enabled. Copy the MEDIA line exactly.",
    parameters: TtsToolSchema,
    execute: function (_toolCallId, args) {
      return __awaiter(_this, void 0, void 0, function () {
        var params, text, channel, cfg, result, lines;
        var _a, _b;
        return __generator(this, function (_c) {
          switch (_c.label) {
            case 0:
              params = args;
              text = (0, common_js_1.readStringParam)(params, "text", { required: true });
              channel = (0, common_js_1.readStringParam)(params, "channel");
              cfg =
                (_a = opts === null || opts === void 0 ? void 0 : opts.config) !== null &&
                _a !== void 0
                  ? _a
                  : (0, config_js_1.loadConfig)();
              return [
                4 /*yield*/,
                (0, tts_js_1.textToSpeech)({
                  text: text,
                  cfg: cfg,
                  channel:
                    channel !== null && channel !== void 0
                      ? channel
                      : opts === null || opts === void 0
                        ? void 0
                        : opts.agentChannel,
                }),
              ];
            case 1:
              result = _c.sent();
              if (result.success && result.audioPath) {
                lines = [];
                // Tag Telegram Opus output as a voice bubble instead of a file attachment.
                if (result.voiceCompatible) {
                  lines.push("[[audio_as_voice]]");
                }
                lines.push("MEDIA:".concat(result.audioPath));
                return [
                  2 /*return*/,
                  {
                    content: [{ type: "text", text: lines.join("\n") }],
                    details: { audioPath: result.audioPath, provider: result.provider },
                  },
                ];
              }
              return [
                2 /*return*/,
                {
                  content: [
                    {
                      type: "text",
                      text:
                        (_b = result.error) !== null && _b !== void 0
                          ? _b
                          : "TTS conversion failed",
                    },
                  ],
                  details: { error: result.error },
                },
              ];
          }
        });
      });
    },
  };
}
