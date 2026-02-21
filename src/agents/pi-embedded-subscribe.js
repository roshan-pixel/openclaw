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
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeEmbeddedPiSession = subscribeEmbeddedPiSession;
var reply_directives_js_1 = require("../auto-reply/reply/reply-directives.js");
var streaming_directives_js_1 = require("../auto-reply/reply/streaming-directives.js");
var tool_meta_js_1 = require("../auto-reply/tool-meta.js");
var subsystem_js_1 = require("../logging/subsystem.js");
var code_spans_js_1 = require("../markdown/code-spans.js");
var pi_embedded_block_chunker_js_1 = require("./pi-embedded-block-chunker.js");
var pi_embedded_helpers_js_1 = require("./pi-embedded-helpers.js");
var pi_embedded_subscribe_handlers_js_1 = require("./pi-embedded-subscribe.handlers.js");
var pi_embedded_utils_js_1 = require("./pi-embedded-utils.js");
var THINKING_TAG_SCAN_RE = /<\s*(\/?)\s*(?:think(?:ing)?|thought|antthinking)\s*>/gi;
var FINAL_TAG_SCAN_RE = /<\s*(\/?)\s*final\s*>/gi;
var log = (0, subsystem_js_1.createSubsystemLogger)("agent/embedded");
function subscribeEmbeddedPiSession(params) {
  var _a, _b, _c;
  var reasoningMode = (_a = params.reasoningMode) !== null && _a !== void 0 ? _a : "off";
  var toolResultFormat = (_b = params.toolResultFormat) !== null && _b !== void 0 ? _b : "markdown";
  var useMarkdown = toolResultFormat === "markdown";
  var state = {
    assistantTexts: [],
    toolMetas: [],
    toolMetaById: new Map(),
    toolSummaryById: new Set(),
    lastToolError: undefined,
    blockReplyBreak: (_c = params.blockReplyBreak) !== null && _c !== void 0 ? _c : "text_end",
    reasoningMode: reasoningMode,
    includeReasoning: reasoningMode === "on",
    shouldEmitPartialReplies: !(reasoningMode === "on" && !params.onBlockReply),
    streamReasoning: reasoningMode === "stream" && typeof params.onReasoningStream === "function",
    deltaBuffer: "",
    blockBuffer: "",
    // Track if a streamed chunk opened a <think> block (stateful across chunks).
    blockState: {
      thinking: false,
      final: false,
      inlineCode: (0, code_spans_js_1.createInlineCodeState)(),
    },
    lastStreamedAssistant: undefined,
    lastStreamedReasoning: undefined,
    lastBlockReplyText: undefined,
    assistantMessageIndex: 0,
    lastAssistantTextMessageIndex: -1,
    lastAssistantTextNormalized: undefined,
    lastAssistantTextTrimmed: undefined,
    assistantTextBaseline: 0,
    suppressBlockChunks: false, // Avoid late chunk inserts after final text merge.
    lastReasoningSent: undefined,
    compactionInFlight: false,
    pendingCompactionRetry: 0,
    compactionRetryResolve: undefined,
    compactionRetryPromise: null,
    messagingToolSentTexts: [],
    messagingToolSentTextsNormalized: [],
    messagingToolSentTargets: [],
    pendingMessagingTexts: new Map(),
    pendingMessagingTargets: new Map(),
  };
  var assistantTexts = state.assistantTexts;
  var toolMetas = state.toolMetas;
  var toolMetaById = state.toolMetaById;
  var toolSummaryById = state.toolSummaryById;
  var messagingToolSentTexts = state.messagingToolSentTexts;
  var messagingToolSentTextsNormalized = state.messagingToolSentTextsNormalized;
  var messagingToolSentTargets = state.messagingToolSentTargets;
  var pendingMessagingTexts = state.pendingMessagingTexts;
  var pendingMessagingTargets = state.pendingMessagingTargets;
  var replyDirectiveAccumulator = (0,
  streaming_directives_js_1.createStreamingDirectiveAccumulator)();
  var resetAssistantMessageState = function (nextAssistantTextBaseline) {
    state.deltaBuffer = "";
    state.blockBuffer = "";
    blockChunker === null || blockChunker === void 0 ? void 0 : blockChunker.reset();
    replyDirectiveAccumulator.reset();
    state.blockState.thinking = false;
    state.blockState.final = false;
    state.blockState.inlineCode = (0, code_spans_js_1.createInlineCodeState)();
    state.lastStreamedAssistant = undefined;
    state.lastBlockReplyText = undefined;
    state.lastStreamedReasoning = undefined;
    state.lastReasoningSent = undefined;
    state.suppressBlockChunks = false;
    state.assistantMessageIndex += 1;
    state.lastAssistantTextMessageIndex = -1;
    state.lastAssistantTextNormalized = undefined;
    state.lastAssistantTextTrimmed = undefined;
    state.assistantTextBaseline = nextAssistantTextBaseline;
  };
  var rememberAssistantText = function (text) {
    state.lastAssistantTextMessageIndex = state.assistantMessageIndex;
    state.lastAssistantTextTrimmed = text.trimEnd();
    var normalized = (0, pi_embedded_helpers_js_1.normalizeTextForComparison)(text);
    state.lastAssistantTextNormalized = normalized.length > 0 ? normalized : undefined;
  };
  var shouldSkipAssistantText = function (text) {
    if (state.lastAssistantTextMessageIndex !== state.assistantMessageIndex) {
      return false;
    }
    var trimmed = text.trimEnd();
    if (trimmed && trimmed === state.lastAssistantTextTrimmed) {
      return true;
    }
    var normalized = (0, pi_embedded_helpers_js_1.normalizeTextForComparison)(text);
    if (normalized.length > 0 && normalized === state.lastAssistantTextNormalized) {
      return true;
    }
    return false;
  };
  var pushAssistantText = function (text) {
    if (!text) {
      return;
    }
    if (shouldSkipAssistantText(text)) {
      return;
    }
    assistantTexts.push(text);
    rememberAssistantText(text);
  };
  var finalizeAssistantTexts = function (args) {
    var text = args.text,
      addedDuringMessage = args.addedDuringMessage,
      chunkerHasBuffered = args.chunkerHasBuffered;
    // If we're not streaming block replies, ensure the final payload includes
    // the final text even when interim streaming was enabled.
    if (state.includeReasoning && text && !params.onBlockReply) {
      if (assistantTexts.length > state.assistantTextBaseline) {
        assistantTexts.splice(
          state.assistantTextBaseline,
          assistantTexts.length - state.assistantTextBaseline,
          text,
        );
        rememberAssistantText(text);
      } else {
        pushAssistantText(text);
      }
      state.suppressBlockChunks = true;
    } else if (!addedDuringMessage && !chunkerHasBuffered && text) {
      // Non-streaming models (no text_delta): ensure assistantTexts gets the final
      // text when the chunker has nothing buffered to drain.
      pushAssistantText(text);
    }
    state.assistantTextBaseline = assistantTexts.length;
  };
  // ── Messaging tool duplicate detection ──────────────────────────────────────
  // Track texts sent via messaging tools to suppress duplicate block replies.
  // Only committed (successful) texts are checked - pending texts are tracked
  // to support commit logic but not used for suppression (avoiding lost messages on tool failure).
  // These tools can send messages via sendMessage/threadReply actions (or sessions_send with message).
  var MAX_MESSAGING_SENT_TEXTS = 200;
  var MAX_MESSAGING_SENT_TARGETS = 200;
  var trimMessagingToolSent = function () {
    if (messagingToolSentTexts.length > MAX_MESSAGING_SENT_TEXTS) {
      var overflow = messagingToolSentTexts.length - MAX_MESSAGING_SENT_TEXTS;
      messagingToolSentTexts.splice(0, overflow);
      messagingToolSentTextsNormalized.splice(0, overflow);
    }
    if (messagingToolSentTargets.length > MAX_MESSAGING_SENT_TARGETS) {
      var overflow = messagingToolSentTargets.length - MAX_MESSAGING_SENT_TARGETS;
      messagingToolSentTargets.splice(0, overflow);
    }
  };
  var ensureCompactionPromise = function () {
    if (!state.compactionRetryPromise) {
      state.compactionRetryPromise = new Promise(function (resolve) {
        state.compactionRetryResolve = resolve;
      });
    }
  };
  var noteCompactionRetry = function () {
    state.pendingCompactionRetry += 1;
    ensureCompactionPromise();
  };
  var resolveCompactionRetry = function () {
    var _a;
    if (state.pendingCompactionRetry <= 0) {
      return;
    }
    state.pendingCompactionRetry -= 1;
    if (state.pendingCompactionRetry === 0 && !state.compactionInFlight) {
      (_a = state.compactionRetryResolve) === null || _a === void 0 ? void 0 : _a.call(state);
      state.compactionRetryResolve = undefined;
      state.compactionRetryPromise = null;
    }
  };
  var maybeResolveCompactionWait = function () {
    var _a;
    if (state.pendingCompactionRetry === 0 && !state.compactionInFlight) {
      (_a = state.compactionRetryResolve) === null || _a === void 0 ? void 0 : _a.call(state);
      state.compactionRetryResolve = undefined;
      state.compactionRetryPromise = null;
    }
  };
  var blockChunking = params.blockReplyChunking;
  var blockChunker = blockChunking
    ? new pi_embedded_block_chunker_js_1.EmbeddedBlockChunker(blockChunking)
    : null;
  // KNOWN: Provider streams are not strictly once-only or perfectly ordered.
  // `text_end` can repeat full content; late `text_end` can arrive after `message_end`.
  // Tests: `src/agents/pi-embedded-subscribe.test.ts` (e.g. late text_end cases).
  var shouldEmitToolResult = function () {
    return typeof params.shouldEmitToolResult === "function"
      ? params.shouldEmitToolResult()
      : params.verboseLevel === "on" || params.verboseLevel === "full";
  };
  var shouldEmitToolOutput = function () {
    return typeof params.shouldEmitToolOutput === "function"
      ? params.shouldEmitToolOutput()
      : params.verboseLevel === "full";
  };
  var formatToolOutputBlock = function (text) {
    var trimmed = text.trim();
    if (!trimmed) {
      return "(no output)";
    }
    if (!useMarkdown) {
      return trimmed;
    }
    return "```txt\n".concat(trimmed, "\n```");
  };
  var emitToolSummary = function (toolName, meta) {
    if (!params.onToolResult) {
      return;
    }
    var agg = (0, tool_meta_js_1.formatToolAggregate)(toolName, meta ? [meta] : undefined, {
      markdown: useMarkdown,
    });
    var _a = (0, reply_directives_js_1.parseReplyDirectives)(agg),
      cleanedText = _a.text,
      mediaUrls = _a.mediaUrls;
    if (!cleanedText && (!mediaUrls || mediaUrls.length === 0)) {
      return;
    }
    try {
      void params.onToolResult({
        text: cleanedText,
        mediaUrls: (mediaUrls === null || mediaUrls === void 0 ? void 0 : mediaUrls.length)
          ? mediaUrls
          : undefined,
      });
    } catch (_b) {
      // ignore tool result delivery failures
    }
  };
  var emitToolOutput = function (toolName, meta, output) {
    if (!params.onToolResult || !output) {
      return;
    }
    var agg = (0, tool_meta_js_1.formatToolAggregate)(toolName, meta ? [meta] : undefined, {
      markdown: useMarkdown,
    });
    var message = "".concat(agg, "\n").concat(formatToolOutputBlock(output));
    var _a = (0, reply_directives_js_1.parseReplyDirectives)(message),
      cleanedText = _a.text,
      mediaUrls = _a.mediaUrls;
    if (!cleanedText && (!mediaUrls || mediaUrls.length === 0)) {
      return;
    }
    try {
      void params.onToolResult({
        text: cleanedText,
        mediaUrls: (mediaUrls === null || mediaUrls === void 0 ? void 0 : mediaUrls.length)
          ? mediaUrls
          : undefined,
      });
    } catch (_b) {
      // ignore tool result delivery failures
    }
  };
  var stripBlockTags = function (text, state) {
    var _a, _b, _c;
    if (!text) {
      return text;
    }
    var inlineStateStart =
      (_a = state.inlineCode) !== null && _a !== void 0
        ? _a
        : (0, code_spans_js_1.createInlineCodeState)();
    var codeSpans = (0, code_spans_js_1.buildCodeSpanIndex)(text, inlineStateStart);
    // 1. Handle <think> blocks (stateful, strip content inside)
    var processed = "";
    THINKING_TAG_SCAN_RE.lastIndex = 0;
    var lastIndex = 0;
    var inThinking = state.thinking;
    for (var _i = 0, _d = text.matchAll(THINKING_TAG_SCAN_RE); _i < _d.length; _i++) {
      var match = _d[_i];
      var idx = (_b = match.index) !== null && _b !== void 0 ? _b : 0;
      if (codeSpans.isInside(idx)) {
        continue;
      }
      if (!inThinking) {
        processed += text.slice(lastIndex, idx);
      }
      var isClose = match[1] === "/";
      inThinking = !isClose;
      lastIndex = idx + match[0].length;
    }
    if (!inThinking) {
      processed += text.slice(lastIndex);
    }
    state.thinking = inThinking;
    // 2. Handle <final> blocks (stateful, strip content OUTSIDE)
    // If enforcement is disabled, we still strip the tags themselves to prevent
    // hallucinations (e.g. Minimax copying the style) from leaking, but we
    // do not enforce buffering/extraction logic.
    var finalCodeSpans = (0, code_spans_js_1.buildCodeSpanIndex)(processed, inlineStateStart);
    if (!params.enforceFinalTag) {
      state.inlineCode = finalCodeSpans.inlineState;
      FINAL_TAG_SCAN_RE.lastIndex = 0;
      return stripTagsOutsideCodeSpans(processed, FINAL_TAG_SCAN_RE, finalCodeSpans.isInside);
    }
    // If enforcement is enabled, only return text that appeared inside a <final> block.
    var result = "";
    FINAL_TAG_SCAN_RE.lastIndex = 0;
    var lastFinalIndex = 0;
    var inFinal = state.final;
    var everInFinal = state.final;
    for (var _e = 0, _f = processed.matchAll(FINAL_TAG_SCAN_RE); _e < _f.length; _e++) {
      var match = _f[_e];
      var idx = (_c = match.index) !== null && _c !== void 0 ? _c : 0;
      if (finalCodeSpans.isInside(idx)) {
        continue;
      }
      var isClose = match[1] === "/";
      if (!inFinal && !isClose) {
        // Found <final> start tag.
        inFinal = true;
        everInFinal = true;
        lastFinalIndex = idx + match[0].length;
      } else if (inFinal && isClose) {
        // Found </final> end tag.
        result += processed.slice(lastFinalIndex, idx);
        inFinal = false;
        lastFinalIndex = idx + match[0].length;
      }
    }
    if (inFinal) {
      result += processed.slice(lastFinalIndex);
    }
    state.final = inFinal;
    // Strict Mode: If enforcing final tags, we MUST NOT return content unless
    // we have seen a <final> tag. Otherwise, we leak "thinking out loud" text
    // (e.g. "**Locating Manulife**...") that the model emitted without <think> tags.
    if (!everInFinal) {
      return "";
    }
    // Hardened Cleanup: Remove any remaining <final> tags that might have been
    // missed (e.g. nested tags or hallucinations) to prevent leakage.
    var resultCodeSpans = (0, code_spans_js_1.buildCodeSpanIndex)(result, inlineStateStart);
    state.inlineCode = resultCodeSpans.inlineState;
    return stripTagsOutsideCodeSpans(result, FINAL_TAG_SCAN_RE, resultCodeSpans.isInside);
  };
  var stripTagsOutsideCodeSpans = function (text, pattern, isInside) {
    var _a;
    var output = "";
    var lastIndex = 0;
    pattern.lastIndex = 0;
    for (var _i = 0, _b = text.matchAll(pattern); _i < _b.length; _i++) {
      var match = _b[_i];
      var idx = (_a = match.index) !== null && _a !== void 0 ? _a : 0;
      if (isInside(idx)) {
        continue;
      }
      output += text.slice(lastIndex, idx);
      lastIndex = idx + match[0].length;
    }
    output += text.slice(lastIndex);
    return output;
  };
  var emitBlockChunk = function (text) {
    if (state.suppressBlockChunks) {
      return;
    }
    // Strip <think> and <final> blocks across chunk boundaries to avoid leaking reasoning.
    var chunk = stripBlockTags(text, state.blockState).trimEnd();
    if (!chunk) {
      return;
    }
    if (chunk === state.lastBlockReplyText) {
      return;
    }
    // Only check committed (successful) messaging tool texts - checking pending texts
    // is risky because if the tool fails after suppression, the user gets no response
    var normalizedChunk = (0, pi_embedded_helpers_js_1.normalizeTextForComparison)(chunk);
    if (
      (0, pi_embedded_helpers_js_1.isMessagingToolDuplicateNormalized)(
        normalizedChunk,
        messagingToolSentTextsNormalized,
      )
    ) {
      log.debug(
        "Skipping block reply - already sent via messaging tool: ".concat(
          chunk.slice(0, 50),
          "...",
        ),
      );
      return;
    }
    if (shouldSkipAssistantText(chunk)) {
      return;
    }
    state.lastBlockReplyText = chunk;
    assistantTexts.push(chunk);
    rememberAssistantText(chunk);
    if (!params.onBlockReply) {
      return;
    }
    var splitResult = replyDirectiveAccumulator.consume(chunk);
    if (!splitResult) {
      return;
    }
    var cleanedText = splitResult.text,
      mediaUrls = splitResult.mediaUrls,
      audioAsVoice = splitResult.audioAsVoice,
      replyToId = splitResult.replyToId,
      replyToTag = splitResult.replyToTag,
      replyToCurrent = splitResult.replyToCurrent;
    // Skip empty payloads, but always emit if audioAsVoice is set (to propagate the flag)
    if (!cleanedText && (!mediaUrls || mediaUrls.length === 0) && !audioAsVoice) {
      return;
    }
    void params.onBlockReply({
      text: cleanedText,
      mediaUrls: (mediaUrls === null || mediaUrls === void 0 ? void 0 : mediaUrls.length)
        ? mediaUrls
        : undefined,
      audioAsVoice: audioAsVoice,
      replyToId: replyToId,
      replyToTag: replyToTag,
      replyToCurrent: replyToCurrent,
    });
  };
  var consumeReplyDirectives = function (text, options) {
    return replyDirectiveAccumulator.consume(text, options);
  };
  var flushBlockReplyBuffer = function () {
    if (!params.onBlockReply) {
      return;
    }
    if (blockChunker === null || blockChunker === void 0 ? void 0 : blockChunker.hasBuffered()) {
      blockChunker.drain({ force: true, emit: emitBlockChunk });
      blockChunker.reset();
      return;
    }
    if (state.blockBuffer.length > 0) {
      emitBlockChunk(state.blockBuffer);
      state.blockBuffer = "";
    }
  };
  var emitReasoningStream = function (text) {
    if (!state.streamReasoning || !params.onReasoningStream) {
      return;
    }
    var formatted = (0, pi_embedded_utils_js_1.formatReasoningMessage)(text);
    if (!formatted) {
      return;
    }
    if (formatted === state.lastStreamedReasoning) {
      return;
    }
    state.lastStreamedReasoning = formatted;
    void params.onReasoningStream({
      text: formatted,
    });
  };
  var resetForCompactionRetry = function () {
    assistantTexts.length = 0;
    toolMetas.length = 0;
    toolMetaById.clear();
    toolSummaryById.clear();
    state.lastToolError = undefined;
    messagingToolSentTexts.length = 0;
    messagingToolSentTextsNormalized.length = 0;
    messagingToolSentTargets.length = 0;
    pendingMessagingTexts.clear();
    pendingMessagingTargets.clear();
    resetAssistantMessageState(0);
  };
  var ctx = {
    params: params,
    state: state,
    log: log,
    blockChunking: blockChunking,
    blockChunker: blockChunker,
    shouldEmitToolResult: shouldEmitToolResult,
    shouldEmitToolOutput: shouldEmitToolOutput,
    emitToolSummary: emitToolSummary,
    emitToolOutput: emitToolOutput,
    stripBlockTags: stripBlockTags,
    emitBlockChunk: emitBlockChunk,
    flushBlockReplyBuffer: flushBlockReplyBuffer,
    emitReasoningStream: emitReasoningStream,
    consumeReplyDirectives: consumeReplyDirectives,
    resetAssistantMessageState: resetAssistantMessageState,
    resetForCompactionRetry: resetForCompactionRetry,
    finalizeAssistantTexts: finalizeAssistantTexts,
    trimMessagingToolSent: trimMessagingToolSent,
    ensureCompactionPromise: ensureCompactionPromise,
    noteCompactionRetry: noteCompactionRetry,
    resolveCompactionRetry: resolveCompactionRetry,
    maybeResolveCompactionWait: maybeResolveCompactionWait,
  };
  var unsubscribe = params.session.subscribe(
    (0, pi_embedded_subscribe_handlers_js_1.createEmbeddedPiSessionEventHandler)(ctx),
  );
  return {
    assistantTexts: assistantTexts,
    toolMetas: toolMetas,
    unsubscribe: unsubscribe,
    isCompacting: function () {
      return state.compactionInFlight || state.pendingCompactionRetry > 0;
    },
    getMessagingToolSentTexts: function () {
      return messagingToolSentTexts.slice();
    },
    getMessagingToolSentTargets: function () {
      return messagingToolSentTargets.slice();
    },
    // Returns true if any messaging tool successfully sent a message.
    // Used to suppress agent's confirmation text (e.g., "Respondi no Telegram!")
    // which is generated AFTER the tool sends the actual answer.
    didSendViaMessagingTool: function () {
      return messagingToolSentTexts.length > 0;
    },
    getLastToolError: function () {
      return state.lastToolError ? __assign({}, state.lastToolError) : undefined;
    },
    waitForCompactionRetry: function () {
      var _a;
      if (state.compactionInFlight || state.pendingCompactionRetry > 0) {
        ensureCompactionPromise();
        return (_a = state.compactionRetryPromise) !== null && _a !== void 0
          ? _a
          : Promise.resolve();
      }
      return new Promise(function (resolve) {
        queueMicrotask(function () {
          var _a;
          if (state.compactionInFlight || state.pendingCompactionRetry > 0) {
            ensureCompactionPromise();
            void (
              (_a = state.compactionRetryPromise) !== null && _a !== void 0 ? _a : Promise.resolve()
            ).then(resolve);
          } else {
            resolve();
          }
        });
      });
    },
  };
}
