"use strict";
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
exports.SYNTHETIC_MODEL_CATALOG = exports.SYNTHETIC_DEFAULT_COST = exports.SYNTHETIC_DEFAULT_MODEL_REF = exports.SYNTHETIC_DEFAULT_MODEL_ID = exports.SYNTHETIC_BASE_URL = void 0;
exports.buildSyntheticModelDefinition = buildSyntheticModelDefinition;
exports.SYNTHETIC_BASE_URL = "https://api.synthetic.new/anthropic";
exports.SYNTHETIC_DEFAULT_MODEL_ID = "hf:MiniMaxAI/MiniMax-M2.1";
exports.SYNTHETIC_DEFAULT_MODEL_REF = "synthetic/".concat(exports.SYNTHETIC_DEFAULT_MODEL_ID);
exports.SYNTHETIC_DEFAULT_COST = {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
};
exports.SYNTHETIC_MODEL_CATALOG = [
    {
        id: exports.SYNTHETIC_DEFAULT_MODEL_ID,
        name: "MiniMax M2.1",
        reasoning: false,
        input: ["text"],
        contextWindow: 192000,
        maxTokens: 65536,
    },
    {
        id: "hf:moonshotai/Kimi-K2-Thinking",
        name: "Kimi K2 Thinking",
        reasoning: true,
        input: ["text"],
        contextWindow: 256000,
        maxTokens: 8192,
    },
    {
        id: "hf:zai-org/GLM-4.7",
        name: "GLM-4.7",
        reasoning: false,
        input: ["text"],
        contextWindow: 198000,
        maxTokens: 128000,
    },
    {
        id: "hf:deepseek-ai/DeepSeek-R1-0528",
        name: "DeepSeek R1 0528",
        reasoning: false,
        input: ["text"],
        contextWindow: 128000,
        maxTokens: 8192,
    },
    {
        id: "hf:deepseek-ai/DeepSeek-V3-0324",
        name: "DeepSeek V3 0324",
        reasoning: false,
        input: ["text"],
        contextWindow: 128000,
        maxTokens: 8192,
    },
    {
        id: "hf:deepseek-ai/DeepSeek-V3.1",
        name: "DeepSeek V3.1",
        reasoning: false,
        input: ["text"],
        contextWindow: 128000,
        maxTokens: 8192,
    },
    {
        id: "hf:deepseek-ai/DeepSeek-V3.1-Terminus",
        name: "DeepSeek V3.1 Terminus",
        reasoning: false,
        input: ["text"],
        contextWindow: 128000,
        maxTokens: 8192,
    },
    {
        id: "hf:deepseek-ai/DeepSeek-V3.2",
        name: "DeepSeek V3.2",
        reasoning: false,
        input: ["text"],
        contextWindow: 159000,
        maxTokens: 8192,
    },
    {
        id: "hf:meta-llama/Llama-3.3-70B-Instruct",
        name: "Llama 3.3 70B Instruct",
        reasoning: false,
        input: ["text"],
        contextWindow: 128000,
        maxTokens: 8192,
    },
    {
        id: "hf:meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
        name: "Llama 4 Maverick 17B 128E Instruct FP8",
        reasoning: false,
        input: ["text"],
        contextWindow: 524000,
        maxTokens: 8192,
    },
    {
        id: "hf:moonshotai/Kimi-K2-Instruct-0905",
        name: "Kimi K2 Instruct 0905",
        reasoning: false,
        input: ["text"],
        contextWindow: 256000,
        maxTokens: 8192,
    },
    {
        id: "hf:moonshotai/Kimi-K2.5",
        name: "Kimi K2.5",
        reasoning: true,
        input: ["text"],
        contextWindow: 256000,
        maxTokens: 8192,
    },
    {
        id: "hf:openai/gpt-oss-120b",
        name: "GPT OSS 120B",
        reasoning: false,
        input: ["text"],
        contextWindow: 128000,
        maxTokens: 8192,
    },
    {
        id: "hf:Qwen/Qwen3-235B-A22B-Instruct-2507",
        name: "Qwen3 235B A22B Instruct 2507",
        reasoning: false,
        input: ["text"],
        contextWindow: 256000,
        maxTokens: 8192,
    },
    {
        id: "hf:Qwen/Qwen3-Coder-480B-A35B-Instruct",
        name: "Qwen3 Coder 480B A35B Instruct",
        reasoning: false,
        input: ["text"],
        contextWindow: 256000,
        maxTokens: 8192,
    },
    {
        id: "hf:Qwen/Qwen3-VL-235B-A22B-Instruct",
        name: "Qwen3 VL 235B A22B Instruct",
        reasoning: false,
        input: ["text", "image"],
        contextWindow: 250000,
        maxTokens: 8192,
    },
    {
        id: "hf:zai-org/GLM-4.5",
        name: "GLM-4.5",
        reasoning: false,
        input: ["text"],
        contextWindow: 128000,
        maxTokens: 128000,
    },
    {
        id: "hf:zai-org/GLM-4.6",
        name: "GLM-4.6",
        reasoning: false,
        input: ["text"],
        contextWindow: 198000,
        maxTokens: 128000,
    },
    {
        id: "hf:deepseek-ai/DeepSeek-V3",
        name: "DeepSeek V3",
        reasoning: false,
        input: ["text"],
        contextWindow: 128000,
        maxTokens: 8192,
    },
    {
        id: "hf:Qwen/Qwen3-235B-A22B-Thinking-2507",
        name: "Qwen3 235B A22B Thinking 2507",
        reasoning: true,
        input: ["text"],
        contextWindow: 256000,
        maxTokens: 8192,
    },
];
function buildSyntheticModelDefinition(entry) {
    return {
        id: entry.id,
        name: entry.name,
        reasoning: entry.reasoning,
        input: __spreadArray([], entry.input, true),
        cost: exports.SYNTHETIC_DEFAULT_COST,
        contextWindow: entry.contextWindow,
        maxTokens: entry.maxTokens,
    };
}
