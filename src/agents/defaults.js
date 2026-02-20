"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONTEXT_TOKENS = exports.DEFAULT_MODEL = exports.DEFAULT_PROVIDER = void 0;
// Defaults for agent metadata when upstream does not supply them.
// Model id uses pi-ai's built-in Anthropic catalog.
exports.DEFAULT_PROVIDER = "anthropic";
exports.DEFAULT_MODEL = "claude-opus-4-5";
// Context window: Opus 4.5 supports ~200k tokens (per pi-ai models.generated.ts).
exports.DEFAULT_CONTEXT_TOKENS = 200000;
