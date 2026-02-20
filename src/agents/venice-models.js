"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VENICE_MODEL_CATALOG = exports.VENICE_DEFAULT_COST = exports.VENICE_DEFAULT_MODEL_REF = exports.VENICE_DEFAULT_MODEL_ID = exports.VENICE_BASE_URL = void 0;
exports.buildVeniceModelDefinition = buildVeniceModelDefinition;
exports.discoverVeniceModels = discoverVeniceModels;
exports.VENICE_BASE_URL = "https://api.venice.ai/api/v1";
exports.VENICE_DEFAULT_MODEL_ID = "llama-3.3-70b";
exports.VENICE_DEFAULT_MODEL_REF = "venice/".concat(exports.VENICE_DEFAULT_MODEL_ID);
// Venice uses credit-based pricing, not per-token costs.
// Set to 0 as costs vary by model and account type.
exports.VENICE_DEFAULT_COST = {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
};
/**
 * Complete catalog of Venice AI models.
 *
 * Venice provides two privacy modes:
 * - "private": Fully private inference, no logging, ephemeral
 * - "anonymized": Proxied through Venice with metadata stripped (for proprietary models)
 *
 * Note: The `privacy` field is included for documentation purposes but is not
 * propagated to ModelDefinitionConfig as it's not part of the core model schema.
 * Privacy mode is determined by the model itself, not configurable at runtime.
 *
 * This catalog serves as a fallback when the Venice API is unreachable.
 */
exports.VENICE_MODEL_CATALOG = [
    // ============================================
    // PRIVATE MODELS (Fully private, no logging)
    // ============================================
    // Llama models
    {
        id: "llama-3.3-70b",
        name: "Llama 3.3 70B",
        reasoning: false,
        input: ["text"],
        contextWindow: 131072,
        maxTokens: 8192,
        privacy: "private",
    },
    {
        id: "llama-3.2-3b",
        name: "Llama 3.2 3B",
        reasoning: false,
        input: ["text"],
        contextWindow: 131072,
        maxTokens: 8192,
        privacy: "private",
    },
    {
        id: "hermes-3-llama-3.1-405b",
        name: "Hermes 3 Llama 3.1 405B",
        reasoning: false,
        input: ["text"],
        contextWindow: 131072,
        maxTokens: 8192,
        privacy: "private",
    },
    // Qwen models
    {
        id: "qwen3-235b-a22b-thinking-2507",
        name: "Qwen3 235B Thinking",
        reasoning: true,
        input: ["text"],
        contextWindow: 131072,
        maxTokens: 8192,
        privacy: "private",
    },
    {
        id: "qwen3-235b-a22b-instruct-2507",
        name: "Qwen3 235B Instruct",
        reasoning: false,
        input: ["text"],
        contextWindow: 131072,
        maxTokens: 8192,
        privacy: "private",
    },
    {
        id: "qwen3-coder-480b-a35b-instruct",
        name: "Qwen3 Coder 480B",
        reasoning: false,
        input: ["text"],
        contextWindow: 262144,
        maxTokens: 8192,
        privacy: "private",
    },
    {
        id: "qwen3-next-80b",
        name: "Qwen3 Next 80B",
        reasoning: false,
        input: ["text"],
        contextWindow: 262144,
        maxTokens: 8192,
        privacy: "private",
    },
    {
        id: "qwen3-vl-235b-a22b",
        name: "Qwen3 VL 235B (Vision)",
        reasoning: false,
        input: ["text", "image"],
        contextWindow: 262144,
        maxTokens: 8192,
        privacy: "private",
    },
    {
        id: "qwen3-4b",
        name: "Venice Small (Qwen3 4B)",
        reasoning: true,
        input: ["text"],
        contextWindow: 32768,
        maxTokens: 8192,
        privacy: "private",
    },
    // DeepSeek
    {
        id: "deepseek-v3.2",
        name: "DeepSeek V3.2",
        reasoning: true,
        input: ["text"],
        contextWindow: 163840,
        maxTokens: 8192,
        privacy: "private",
    },
    // Venice-specific models
    {
        id: "venice-uncensored",
        name: "Venice Uncensored (Dolphin-Mistral)",
        reasoning: false,
        input: ["text"],
        contextWindow: 32768,
        maxTokens: 8192,
        privacy: "private",
    },
    {
        id: "mistral-31-24b",
        name: "Venice Medium (Mistral)",
        reasoning: false,
        input: ["text", "image"],
        contextWindow: 131072,
        maxTokens: 8192,
        privacy: "private",
    },
    // Other private models
    {
        id: "google-gemma-3-27b-it",
        name: "Google Gemma 3 27B Instruct",
        reasoning: false,
        input: ["text", "image"],
        contextWindow: 202752,
        maxTokens: 8192,
        privacy: "private",
    },
    {
        id: "openai-gpt-oss-120b",
        name: "OpenAI GPT OSS 120B",
        reasoning: false,
        input: ["text"],
        contextWindow: 131072,
        maxTokens: 8192,
        privacy: "private",
    },
    {
        id: "zai-org-glm-4.7",
        name: "GLM 4.7",
        reasoning: true,
        input: ["text"],
        contextWindow: 202752,
        maxTokens: 8192,
        privacy: "private",
    },
    // ============================================
    // ANONYMIZED MODELS (Proxied through Venice)
    // These are proprietary models accessed via Venice's proxy
    // ============================================
    // Anthropic (via Venice)
    {
        id: "claude-opus-45",
        name: "Claude Opus 4.5 (via Venice)",
        reasoning: true,
        input: ["text", "image"],
        contextWindow: 202752,
        maxTokens: 8192,
        privacy: "anonymized",
    },
    {
        id: "claude-sonnet-45",
        name: "Claude Sonnet 4.5 (via Venice)",
        reasoning: true,
        input: ["text", "image"],
        contextWindow: 202752,
        maxTokens: 8192,
        privacy: "anonymized",
    },
    // OpenAI (via Venice)
    {
        id: "openai-gpt-52",
        name: "GPT-5.2 (via Venice)",
        reasoning: true,
        input: ["text"],
        contextWindow: 262144,
        maxTokens: 8192,
        privacy: "anonymized",
    },
    {
        id: "openai-gpt-52-codex",
        name: "GPT-5.2 Codex (via Venice)",
        reasoning: true,
        input: ["text", "image"],
        contextWindow: 262144,
        maxTokens: 8192,
        privacy: "anonymized",
    },
    // Google (via Venice)
    {
        id: "gemini-3-pro-preview",
        name: "Gemini 3 Pro (via Venice)",
        reasoning: true,
        input: ["text", "image"],
        contextWindow: 202752,
        maxTokens: 8192,
        privacy: "anonymized",
    },
    {
        id: "gemini-3-flash-preview",
        name: "Gemini 3 Flash (via Venice)",
        reasoning: true,
        input: ["text", "image"],
        contextWindow: 262144,
        maxTokens: 8192,
        privacy: "anonymized",
    },
    // xAI (via Venice)
    {
        id: "grok-41-fast",
        name: "Grok 4.1 Fast (via Venice)",
        reasoning: true,
        input: ["text", "image"],
        contextWindow: 262144,
        maxTokens: 8192,
        privacy: "anonymized",
    },
    {
        id: "grok-code-fast-1",
        name: "Grok Code Fast 1 (via Venice)",
        reasoning: true,
        input: ["text"],
        contextWindow: 262144,
        maxTokens: 8192,
        privacy: "anonymized",
    },
    // Other anonymized models
    {
        id: "kimi-k2-thinking",
        name: "Kimi K2 Thinking (via Venice)",
        reasoning: true,
        input: ["text"],
        contextWindow: 262144,
        maxTokens: 8192,
        privacy: "anonymized",
    },
    {
        id: "minimax-m21",
        name: "MiniMax M2.1 (via Venice)",
        reasoning: true,
        input: ["text"],
        contextWindow: 202752,
        maxTokens: 8192,
        privacy: "anonymized",
    },
];
/**
 * Build a ModelDefinitionConfig from a Venice catalog entry.
 *
 * Note: The `privacy` field from the catalog is not included in the output
 * as ModelDefinitionConfig doesn't support custom metadata fields. Privacy
 * mode is inherent to each model and documented in the catalog/docs.
 */
function buildVeniceModelDefinition(entry) {
    return {
        id: entry.id,
        name: entry.name,
        reasoning: entry.reasoning,
        input: __spreadArray([], entry.input, true),
        cost: exports.VENICE_DEFAULT_COST,
        contextWindow: entry.contextWindow,
        maxTokens: entry.maxTokens,
    };
}
/**
 * Discover models from Venice API with fallback to static catalog.
 * The /models endpoint is public and doesn't require authentication.
 */
function discoverVeniceModels() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, catalogById, models, _i, _a, apiModel, catalogEntry, isReasoning, hasVision, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // Skip API discovery in test environment
                    if (process.env.NODE_ENV === "test" || process.env.VITEST) {
                        return [2 /*return*/, exports.VENICE_MODEL_CATALOG.map(buildVeniceModelDefinition)];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("".concat(exports.VENICE_BASE_URL, "/models"), {
                            signal: AbortSignal.timeout(5000),
                        })];
                case 2:
                    response = _b.sent();
                    if (!response.ok) {
                        console.warn("[venice-models] Failed to discover models: HTTP ".concat(response.status, ", using static catalog"));
                        return [2 /*return*/, exports.VENICE_MODEL_CATALOG.map(buildVeniceModelDefinition)];
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = (_b.sent());
                    if (!Array.isArray(data.data) || data.data.length === 0) {
                        console.warn("[venice-models] No models found from API, using static catalog");
                        return [2 /*return*/, exports.VENICE_MODEL_CATALOG.map(buildVeniceModelDefinition)];
                    }
                    catalogById = new Map(exports.VENICE_MODEL_CATALOG.map(function (m) { return [m.id, m]; }));
                    models = [];
                    for (_i = 0, _a = data.data; _i < _a.length; _i++) {
                        apiModel = _a[_i];
                        catalogEntry = catalogById.get(apiModel.id);
                        if (catalogEntry) {
                            // Use catalog metadata for known models
                            models.push(buildVeniceModelDefinition(catalogEntry));
                        }
                        else {
                            isReasoning = apiModel.model_spec.capabilities.supportsReasoning ||
                                apiModel.id.toLowerCase().includes("thinking") ||
                                apiModel.id.toLowerCase().includes("reason") ||
                                apiModel.id.toLowerCase().includes("r1");
                            hasVision = apiModel.model_spec.capabilities.supportsVision;
                            models.push({
                                id: apiModel.id,
                                name: apiModel.model_spec.name || apiModel.id,
                                reasoning: isReasoning,
                                input: hasVision ? ["text", "image"] : ["text"],
                                cost: exports.VENICE_DEFAULT_COST,
                                contextWindow: apiModel.model_spec.availableContextTokens || 128000,
                                maxTokens: 8192,
                            });
                        }
                    }
                    return [2 /*return*/, models.length > 0 ? models : exports.VENICE_MODEL_CATALOG.map(buildVeniceModelDefinition)];
                case 4:
                    error_1 = _b.sent();
                    console.warn("[venice-models] Discovery failed: ".concat(String(error_1), ", using static catalog"));
                    return [2 /*return*/, exports.VENICE_MODEL_CATALOG.map(buildVeniceModelDefinition)];
                case 5: return [2 /*return*/];
            }
        });
    });
}
