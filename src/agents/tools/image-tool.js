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
Object.defineProperty(exports, "__esModule", { value: true });
exports.__testing = void 0;
exports.resolveImageModelConfigForTool = resolveImageModelConfigForTool;
exports.createImageTool = createImageTool;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var pi_ai_1 = require("@mariozechner/pi-ai");
var pi_coding_agent_1 = require("@mariozechner/pi-coding-agent");
var typebox_1 = require("@sinclair/typebox");
var utils_js_1 = require("../../utils.js");
var media_js_1 = require("../../web/media.js");
var auth_profiles_js_1 = require("../auth-profiles.js");
var defaults_js_1 = require("../defaults.js");
var minimax_vlm_js_1 = require("../minimax-vlm.js");
var model_auth_js_1 = require("../model-auth.js");
var model_fallback_js_1 = require("../model-fallback.js");
var model_selection_js_1 = require("../model-selection.js");
var models_config_js_1 = require("../models-config.js");
var sandbox_paths_js_1 = require("../sandbox-paths.js");
var image_tool_helpers_js_1 = require("./image-tool.helpers.js");
var DEFAULT_PROMPT = "Describe the image.";
exports.__testing = {
  decodeDataUrl: image_tool_helpers_js_1.decodeDataUrl,
  coerceImageAssistantText: image_tool_helpers_js_1.coerceImageAssistantText,
};
function resolveDefaultModelRef(cfg) {
  if (cfg) {
    var resolved = (0, model_selection_js_1.resolveConfiguredModelRef)({
      cfg: cfg,
      defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
      defaultModel: defaults_js_1.DEFAULT_MODEL,
    });
    return { provider: resolved.provider, model: resolved.model };
  }
  return { provider: defaults_js_1.DEFAULT_PROVIDER, model: defaults_js_1.DEFAULT_MODEL };
}
function hasAuthForProvider(params) {
  var _a;
  if (
    (_a = (0, model_auth_js_1.resolveEnvApiKey)(params.provider)) === null || _a === void 0
      ? void 0
      : _a.apiKey
  ) {
    return true;
  }
  var store = (0, auth_profiles_js_1.ensureAuthProfileStore)(params.agentDir, {
    allowKeychainPrompt: false,
  });
  return (0, auth_profiles_js_1.listProfilesForProvider)(store, params.provider).length > 0;
}
/**
 * Resolve the effective image model config for the `image` tool.
 *
 * - Prefer explicit config (`agents.defaults.imageModel`).
 * - Otherwise, try to "pair" the primary model with an image-capable model:
 *   - same provider (best effort)
 *   - fall back to OpenAI/Anthropic when available
 */
function resolveImageModelConfigForTool(params) {
  var _a, _b, _c;
  // Note: We intentionally do NOT gate based on primarySupportsImages here.
  // Even when the primary model supports images, we keep the tool available
  // because images are auto-injected into prompts (see attempt.ts detectAndLoadPromptImages).
  // The tool description is adjusted via modelHasVision to discourage redundant usage.
  var explicit = (0, image_tool_helpers_js_1.coerceImageModelConfig)(params.cfg);
  if (
    ((_a = explicit.primary) === null || _a === void 0 ? void 0 : _a.trim()) ||
    ((_c = (_b = explicit.fallbacks) === null || _b === void 0 ? void 0 : _b.length) !== null &&
    _c !== void 0
      ? _c
      : 0) > 0
  ) {
    return explicit;
  }
  var primary = resolveDefaultModelRef(params.cfg);
  var openaiOk = hasAuthForProvider({
    provider: "openai",
    agentDir: params.agentDir,
  });
  var anthropicOk = hasAuthForProvider({
    provider: "anthropic",
    agentDir: params.agentDir,
  });
  var fallbacks = [];
  var addFallback = function (modelRef) {
    var ref = (modelRef !== null && modelRef !== void 0 ? modelRef : "").trim();
    if (!ref) {
      return;
    }
    if (fallbacks.includes(ref)) {
      return;
    }
    fallbacks.push(ref);
  };
  var providerVisionFromConfig = (0, image_tool_helpers_js_1.resolveProviderVisionModelFromConfig)({
    cfg: params.cfg,
    provider: primary.provider,
  });
  var providerOk = hasAuthForProvider({
    provider: primary.provider,
    agentDir: params.agentDir,
  });
  var preferred = null;
  // MiniMax users: always try the canonical vision model first when auth exists.
  if (primary.provider === "minimax" && providerOk) {
    preferred = "minimax/MiniMax-VL-01";
  } else if (providerOk && providerVisionFromConfig) {
    preferred = providerVisionFromConfig;
  } else if (primary.provider === "openai" && openaiOk) {
    preferred = "openai/gpt-5-mini";
  } else if (primary.provider === "anthropic" && anthropicOk) {
    preferred = "anthropic/claude-opus-4-5";
  }
  if (preferred === null || preferred === void 0 ? void 0 : preferred.trim()) {
    if (openaiOk) {
      addFallback("openai/gpt-5-mini");
    }
    if (anthropicOk) {
      addFallback("anthropic/claude-opus-4-5");
    }
    // Don't duplicate primary in fallbacks.
    var pruned = fallbacks.filter(function (ref) {
      return ref !== preferred;
    });
    return __assign({ primary: preferred }, pruned.length > 0 ? { fallbacks: pruned } : {});
  }
  // Cross-provider fallback when we can't pair with the primary provider.
  if (openaiOk) {
    if (anthropicOk) {
      addFallback("anthropic/claude-opus-4-5");
    }
    return __assign(
      { primary: "openai/gpt-5-mini" },
      fallbacks.length ? { fallbacks: fallbacks } : {},
    );
  }
  if (anthropicOk) {
    return { primary: "anthropic/claude-opus-4-5" };
  }
  return null;
}
function pickMaxBytes(cfg, maxBytesMb) {
  var _a, _b;
  if (typeof maxBytesMb === "number" && Number.isFinite(maxBytesMb) && maxBytesMb > 0) {
    return Math.floor(maxBytesMb * 1024 * 1024);
  }
  var configured =
    (_b =
      (_a = cfg === null || cfg === void 0 ? void 0 : cfg.agents) === null || _a === void 0
        ? void 0
        : _a.defaults) === null || _b === void 0
      ? void 0
      : _b.mediaMaxMb;
  if (typeof configured === "number" && Number.isFinite(configured) && configured > 0) {
    return Math.floor(configured * 1024 * 1024);
  }
  return undefined;
}
function buildImageContext(prompt, base64, mimeType) {
  return {
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image", data: base64, mimeType: mimeType },
        ],
        timestamp: Date.now(),
      },
    ],
  };
}
function resolveSandboxedImagePath(params) {
  return __awaiter(this, void 0, void 0, function () {
    var normalize, filePath, out, err_1, name_1, candidateRel, candidateAbs, _a, out;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          normalize = function (p) {
            return p.startsWith("file://") ? p.slice("file://".length) : p;
          };
          filePath = normalize(params.imagePath);
          _b.label = 1;
        case 1:
          _b.trys.push([1, 3, , 9]);
          return [
            4 /*yield*/,
            (0, sandbox_paths_js_1.assertSandboxPath)({
              filePath: filePath,
              cwd: params.sandboxRoot,
              root: params.sandboxRoot,
            }),
          ];
        case 2:
          out = _b.sent();
          return [2 /*return*/, { resolved: out.resolved }];
        case 3:
          err_1 = _b.sent();
          name_1 = node_path_1.default.basename(filePath);
          candidateRel = node_path_1.default.join("media", "inbound", name_1);
          candidateAbs = node_path_1.default.join(params.sandboxRoot, candidateRel);
          _b.label = 4;
        case 4:
          _b.trys.push([4, 6, , 7]);
          return [4 /*yield*/, promises_1.default.stat(candidateAbs)];
        case 5:
          _b.sent();
          return [3 /*break*/, 7];
        case 6:
          _a = _b.sent();
          throw err_1;
        case 7:
          return [
            4 /*yield*/,
            (0, sandbox_paths_js_1.assertSandboxPath)({
              filePath: candidateRel,
              cwd: params.sandboxRoot,
              root: params.sandboxRoot,
            }),
          ];
        case 8:
          out = _b.sent();
          return [2 /*return*/, { resolved: out.resolved, rewrittenFrom: filePath }];
        case 9:
          return [2 /*return*/];
      }
    });
  });
}
function runImagePrompt(params) {
  return __awaiter(this, void 0, void 0, function () {
    var effectiveCfg, authStorage, modelRegistry, result;
    var _this = this;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          effectiveCfg = params.cfg
            ? __assign(__assign({}, params.cfg), {
                agents: __assign(__assign({}, params.cfg.agents), {
                  defaults: __assign(
                    __assign(
                      {},
                      (_a = params.cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults,
                    ),
                    { imageModel: params.imageModelConfig },
                  ),
                }),
              })
            : undefined;
          return [
            4 /*yield*/,
            (0, models_config_js_1.ensureOpenClawModelsJson)(effectiveCfg, params.agentDir),
          ];
        case 1:
          _b.sent();
          authStorage = (0, pi_coding_agent_1.discoverAuthStorage)(params.agentDir);
          modelRegistry = (0, pi_coding_agent_1.discoverModels)(authStorage, params.agentDir);
          return [
            4 /*yield*/,
            (0, model_fallback_js_1.runWithImageModelFallback)({
              cfg: effectiveCfg,
              modelOverride: params.modelOverride,
              run: function (provider, modelId) {
                return __awaiter(_this, void 0, void 0, function () {
                  var model, apiKeyInfo, apiKey, imageDataUrl, text_1, context, message, text;
                  var _a;
                  return __generator(this, function (_b) {
                    switch (_b.label) {
                      case 0:
                        model = modelRegistry.find(provider, modelId);
                        if (!model) {
                          throw new Error("Unknown model: ".concat(provider, "/").concat(modelId));
                        }
                        if (
                          !((_a = model.input) === null || _a === void 0
                            ? void 0
                            : _a.includes("image"))
                        ) {
                          throw new Error(
                            "Model does not support images: ".concat(provider, "/").concat(modelId),
                          );
                        }
                        return [
                          4 /*yield*/,
                          (0, model_auth_js_1.getApiKeyForModel)({
                            model: model,
                            cfg: effectiveCfg,
                            agentDir: params.agentDir,
                          }),
                        ];
                      case 1:
                        apiKeyInfo = _b.sent();
                        apiKey = (0, model_auth_js_1.requireApiKey)(apiKeyInfo, model.provider);
                        authStorage.setRuntimeApiKey(model.provider, apiKey);
                        imageDataUrl = "data:"
                          .concat(params.mimeType, ";base64,")
                          .concat(params.base64);
                        if (!(model.provider === "minimax")) {
                          return [3 /*break*/, 3];
                        }
                        return [
                          4 /*yield*/,
                          (0, minimax_vlm_js_1.minimaxUnderstandImage)({
                            apiKey: apiKey,
                            prompt: params.prompt,
                            imageDataUrl: imageDataUrl,
                            modelBaseUrl: model.baseUrl,
                          }),
                        ];
                      case 2:
                        text_1 = _b.sent();
                        return [
                          2 /*return*/,
                          { text: text_1, provider: model.provider, model: model.id },
                        ];
                      case 3:
                        context = buildImageContext(params.prompt, params.base64, params.mimeType);
                        return [
                          4 /*yield*/,
                          (0, pi_ai_1.complete)(model, context, {
                            apiKey: apiKey,
                            maxTokens: 512,
                          }),
                        ];
                      case 4:
                        message = _b.sent();
                        text = (0, image_tool_helpers_js_1.coerceImageAssistantText)({
                          message: message,
                          provider: model.provider,
                          model: model.id,
                        });
                        return [
                          2 /*return*/,
                          { text: text, provider: model.provider, model: model.id },
                        ];
                    }
                  });
                });
              },
            }),
          ];
        case 2:
          result = _b.sent();
          return [
            2 /*return*/,
            {
              text: result.result.text,
              provider: result.result.provider,
              model: result.result.model,
              attempts: result.attempts.map(function (attempt) {
                return {
                  provider: attempt.provider,
                  model: attempt.model,
                  error: attempt.error,
                };
              }),
            },
          ];
      }
    });
  });
}
function createImageTool(options) {
  var _this = this;
  var _a, _b, _c, _d;
  var agentDir =
    (_a = options === null || options === void 0 ? void 0 : options.agentDir) === null ||
    _a === void 0
      ? void 0
      : _a.trim();
  if (!agentDir) {
    var explicit = (0, image_tool_helpers_js_1.coerceImageModelConfig)(
      options === null || options === void 0 ? void 0 : options.config,
    );
    if (
      ((_b = explicit.primary) === null || _b === void 0 ? void 0 : _b.trim()) ||
      ((_d = (_c = explicit.fallbacks) === null || _c === void 0 ? void 0 : _c.length) !== null &&
      _d !== void 0
        ? _d
        : 0) > 0
    ) {
      throw new Error("createImageTool requires agentDir when enabled");
    }
    return null;
  }
  var imageModelConfig = resolveImageModelConfigForTool({
    cfg: options === null || options === void 0 ? void 0 : options.config,
    agentDir: agentDir,
  });
  if (!imageModelConfig) {
    return null;
  }
  // If model has native vision, images in the prompt are auto-injected
  // so this tool is only needed when image wasn't provided in the prompt
  var description = (options === null || options === void 0 ? void 0 : options.modelHasVision)
    ? "Analyze an image with a vision model. Only use this tool when the image was NOT already provided in the user's message. Images mentioned in the prompt are automatically visible to you."
    : "Analyze an image with the configured image model (agents.defaults.imageModel). Provide a prompt and image path or URL.";
  return {
    label: "Image",
    name: "image",
    description: description,
    parameters: typebox_1.Type.Object({
      prompt: typebox_1.Type.Optional(typebox_1.Type.String()),
      image: typebox_1.Type.String(),
      model: typebox_1.Type.Optional(typebox_1.Type.String()),
      maxBytesMb: typebox_1.Type.Optional(typebox_1.Type.Number()),
    }),
    execute: function (_toolCallId, args) {
      return __awaiter(_this, void 0, void 0, function () {
        var record,
          imageRawInput,
          imageRaw,
          looksLikeWindowsDrivePath,
          hasScheme,
          isFileUrl,
          isHttpUrl,
          isDataUrl,
          promptRaw,
          modelOverride,
          maxBytesMb,
          maxBytes,
          sandboxRoot,
          isUrl,
          resolvedImage,
          resolvedPathInfo,
          _a,
          _b,
          resolvedPath,
          media,
          _c,
          mimeType,
          base64,
          result;
        var _d;
        return __generator(this, function (_e) {
          switch (_e.label) {
            case 0:
              record = args && typeof args === "object" ? args : {};
              imageRawInput = typeof record.image === "string" ? record.image.trim() : "";
              imageRaw = imageRawInput.startsWith("@")
                ? imageRawInput.slice(1).trim()
                : imageRawInput;
              if (!imageRaw) {
                throw new Error("image required");
              }
              looksLikeWindowsDrivePath = /^[a-zA-Z]:[\\/]/.test(imageRaw);
              hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(imageRaw);
              isFileUrl = /^file:/i.test(imageRaw);
              isHttpUrl = /^https?:\/\//i.test(imageRaw);
              isDataUrl = /^data:/i.test(imageRaw);
              if (
                hasScheme &&
                !looksLikeWindowsDrivePath &&
                !isFileUrl &&
                !isHttpUrl &&
                !isDataUrl
              ) {
                return [
                  2 /*return*/,
                  {
                    content: [
                      {
                        type: "text",
                        text: "Unsupported image reference: ".concat(
                          imageRawInput,
                          ". Use a file path, a file:// URL, a data: URL, or an http(s) URL.",
                        ),
                      },
                    ],
                    details: {
                      error: "unsupported_image_reference",
                      image: imageRawInput,
                    },
                  },
                ];
              }
              promptRaw =
                typeof record.prompt === "string" && record.prompt.trim()
                  ? record.prompt.trim()
                  : DEFAULT_PROMPT;
              modelOverride =
                typeof record.model === "string" && record.model.trim()
                  ? record.model.trim()
                  : undefined;
              maxBytesMb = typeof record.maxBytesMb === "number" ? record.maxBytesMb : undefined;
              maxBytes = pickMaxBytes(
                options === null || options === void 0 ? void 0 : options.config,
                maxBytesMb,
              );
              sandboxRoot =
                (_d = options === null || options === void 0 ? void 0 : options.sandboxRoot) ===
                  null || _d === void 0
                  ? void 0
                  : _d.trim();
              isUrl = isHttpUrl;
              if (sandboxRoot && isUrl) {
                throw new Error("Sandboxed image tool does not allow remote URLs.");
              }
              resolvedImage = (function () {
                if (sandboxRoot) {
                  return imageRaw;
                }
                if (imageRaw.startsWith("~")) {
                  return (0, utils_js_1.resolveUserPath)(imageRaw);
                }
                return imageRaw;
              })();
              if (!isDataUrl) {
                return [3 /*break*/, 1];
              }
              _a = { resolved: "" };
              return [3 /*break*/, 5];
            case 1:
              if (!sandboxRoot) {
                return [3 /*break*/, 3];
              }
              return [
                4 /*yield*/,
                resolveSandboxedImagePath({
                  sandboxRoot: sandboxRoot,
                  imagePath: resolvedImage,
                }),
              ];
            case 2:
              _b = _e.sent();
              return [3 /*break*/, 4];
            case 3:
              _b = {
                resolved: resolvedImage.startsWith("file://")
                  ? resolvedImage.slice("file://".length)
                  : resolvedImage,
              };
              _e.label = 4;
            case 4:
              _a = _b;
              _e.label = 5;
            case 5:
              resolvedPathInfo = _a;
              resolvedPath = isDataUrl ? null : resolvedPathInfo.resolved;
              if (!isDataUrl) {
                return [3 /*break*/, 6];
              }
              _c = (0, image_tool_helpers_js_1.decodeDataUrl)(resolvedImage);
              return [3 /*break*/, 8];
            case 6:
              return [
                4 /*yield*/,
                (0, media_js_1.loadWebMedia)(
                  resolvedPath !== null && resolvedPath !== void 0 ? resolvedPath : resolvedImage,
                  maxBytes,
                ),
              ];
            case 7:
              _c = _e.sent();
              _e.label = 8;
            case 8:
              media = _c;
              if (media.kind !== "image") {
                throw new Error("Unsupported media type: ".concat(media.kind));
              }
              mimeType =
                ("contentType" in media && media.contentType) ||
                ("mimeType" in media && media.mimeType) ||
                "image/png";
              base64 = media.buffer.toString("base64");
              return [
                4 /*yield*/,
                runImagePrompt({
                  cfg: options === null || options === void 0 ? void 0 : options.config,
                  agentDir: agentDir,
                  imageModelConfig: imageModelConfig,
                  modelOverride: modelOverride,
                  prompt: promptRaw,
                  base64: base64,
                  mimeType: mimeType,
                }),
              ];
            case 9:
              result = _e.sent();
              return [
                2 /*return*/,
                {
                  content: [{ type: "text", text: result.text }],
                  details: __assign(
                    __assign(
                      {
                        model: "".concat(result.provider, "/").concat(result.model),
                        image: resolvedImage,
                      },
                      resolvedPathInfo.rewrittenFrom
                        ? { rewrittenFrom: resolvedPathInfo.rewrittenFrom }
                        : {},
                    ),
                    { attempts: result.attempts },
                  ),
                },
              ];
          }
        });
      });
    },
  };
}
